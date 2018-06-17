/** 杂项 */
import db from './db';
import config from '../config';

const lsKeys = new Set();
/**
 * localStorage存储或取出json数据
 * @param {string} key localStorage的key
 * @param {object} data 数据
 */
export function ls(key, data) {
	if (typeof data !== 'undefined') {
		lsKeys.add(key);
		return localStorage.setItem(key, JSON.stringify(data));
	} else {
		const jsonStr = localStorage.getItem(key);
		if (jsonStr) {
			try {
				const json = JSON.parse(jsonStr);
				return json;
			} catch (err) {
				console.log(err);
				return jsonStr;
			}
		}
	}
}

/**
 * 清理有ls方法存储的localStorage的记录
 */
export function clearLs() {
	lsKeys.forEach(key => localStorage.removeItem(key));
	lsKeys.clear();
}

/**
 * 设置有过期时间的localStorage，类似cookie，不过不会自动清除过期数据，所以不适合存放大量数据
 * @param {string} key localStorage的key
 * @param {any} data 数据
 * @param {number} day 过期天数
 */
export function expirationData(key, data, day) {
	if (typeof data !== 'undefined' && day) {
		ls(key, {
			data,
			expiration: (new Date() * 1) + (day * 24 * 60 * 60 * 1000),
		});
	} else {
		try {
			const json = ls(key);
			if (!json) return json;
			if (json.expiration < new Date()) {
				localStorage.removeItem(key);
				return null;
			}
			return json.data;
		} catch (error) {
			return null;
		}
	}
	return null;
}

export function getToken() {
	return expirationData('accessToken');
}

export function setToken(token, day) {
	return expirationData('accessToken', token, day);
}

export function wait(time) {
	return new Promise((res) => {
		setTimeout(() => res(time), time);
	});
}

// 给特定dom添加触摸active事件
export function touchActive(dom, classNmae = 'active', currentTarget) {
	if (!dom || typeof dom.addEventListener !== 'function') return;

	const start = function (e) {
		if (currentTarget && e.currentTarget !== e.target) return;
		e.currentTarget.classList.add(classNmae);
	};
	const end = function (e) {
		if (currentTarget && e.currentTarget !== e.target) return;
		e.currentTarget.classList.remove(classNmae);
	};
	dom.addEventListener('touchstart', start);
	dom.addEventListener('touchend', end);
	return function () {
		dom.removeEventListener('touchstart', start);
		dom.removeEventListener('touchend', end);
	};
}

/**
 * 类似localStorage，但是是利用indexdb进行存储，所以是异步的
 * 特点是json不需要格式化，可以存储文件
 */
export const dbStore = {
	async getItem(id) {
		const res = await db.store.get(id);
		return res ? res.data : null;
	},
	setItem(id, data) {
		return db.store.add({ id, data });
	},
	removeItem(id) {
		return db.store.remove(id);
	},
	clearStore() {
		return db.store.clearStore();
	}
};


const scripts = [];// 已加载的
const loadingScriptObj = {};// 正在加载的
/**
 * 动态加载js脚本
 * @param {String} url 脚本地址
 * @param {Object} opt 给script标签的额外属性
 */
export function include(url, opt) {
	return new Promise((res, ret) => {
		if (scripts.includes(url)) {
			res();
			return;
		}
		loadingScriptObj[url] = true;
		const script = document.createElement('script');
		script.src = url;
		Object.assign(script, opt);
		script.onload = (e) => {
			scripts.push(url);
			delete loadingScriptObj[url];
			res(e);
		};
		script.onerror = ret;
		document.body.appendChild(script);
	});
}

let count = 0; // 请求队列数量
const max = config.maxRequest; // 最大同时请求数
const waittingQueue = [];

/**
 * 限制同时请求的数量
 * @param {*} fun 请求的方法，需要是返回一个promise的方法
 */
export function queueControl(fun) {
	return function (...params) {
		if (count >= max) { // 最多同时发起max个请求
			return new Promise((res, ret) => {
				waittingQueue.push({ res, params, fun, ret });
			});
		}
		count++;
		return fun(...params).then(next);
	};
}

function next(res) {
	count--;
	if (count >= max || !waittingQueue.length) return res;
	const tem = waittingQueue.shift();
	tem.fun(...tem.params).then(next).then(tem.res).catch(tem.ret);
	return res;
}

/**
 * 控制请求参数，同一参数不会发送多次请求
 * @param {*} fun
 */
export function paramsControl(fun) {
	const paramsMap = new Map();
	return (params = {}, ...args) => {
		const key = JSON.stringify(params);
		let promise = paramsMap.get(key);
		if (!promise) {
			promise = fun(params, ...args).then((res) => { // 请求返回则删除
				paramsMap.delete(key);
				return res;
			}).catch((e) => {
				paramsMap.delete(key);
				throw e;
			});
			paramsMap.set(key, promise);
		}
		return promise;
	};
}

/**
 * 不足10的数字补0
 * @param {Number} num
 */
export function formatNum(num) {
	if (num === null || num === undefined) return '';
	if (num % 1 !== 0 || num >= 10) return num.toString();
	return `0${num}`;
}

/**
 * date转字符串
 * @param {Date} date
 */
export function dateToString(date = new Date()) {
	return `${date.getFullYear()}-${formatNum(date.getMonth() + 1)}-${formatNum(date.getDate())} ${date.toTimeString().slice(0, 8)}`;
}

/**
 * 字符串转Date
 * @param {String} str
 * @returns {Date}
 */
export function stringToDate(str) {
	try {
		const d = new Date();
		let date = '';
		let time = '';
		const arr = str.split(' ');
		if (arr.length > 1) {
			date = arr[0];
			time = arr[1];
		} else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(arr[0])) date = arr[0];
		else if (/^\d{1,2}:\d{1,2}/.test(arr[0])) time = arr[0];
		if (date) {
			const [y, m, day] = date.split('-');
			d.setFullYear(y);
			d.setMonth(m - 1);
			d.setDate(day);
		}
		if (time) {
			const [h, m, s] = time.split(':');
			d.setHours(h);
			d.setMinutes(m);
			d.setSeconds(s || 0);
		}
		return d;
	} catch (error) {
		return new Date();
	}
}

/**
 * 统计字符串字符数，一个中文字算两个字符
 * @param {String} str
 * @returns {Number}
 */
export function getLength(str) {
	// <summary>获得字符串实际长度，中文2，英文1</summary>
	// <param name="str">要获得长度的字符串</param>
	let realLength = 0;
	const len = str.length;
	let charCode = -1;
	for (let i = 0; i < len; i++) {
		charCode = str.charCodeAt(i);
		if (charCode >= 0 && charCode <= 128) realLength += 1;
		else realLength += 2;
	}
	return realLength;
}
/**
* json对象转成a=xx&b=xxx的形式
* @param {Object} json
*/
export function jsonToSearch(json) {
 const keys = Object.keys(json).sort();
 return keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(json[k])}`).join('&');
}

/**
 * data url 转成 blob
 * @param {String} urlData
 */
export function base64UrlToBlob(urlData, type = 'image/png') {
	const bytes = window.atob(urlData); // 去掉url的头，并转换为byte
	// 处理异常,将ascii码小于0的转换为大于0
	const ab = new ArrayBuffer(bytes.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < bytes.length; i++) {
			ia[i] = bytes.charCodeAt(i);
	}
	return new Blob([ab], { type });
}
