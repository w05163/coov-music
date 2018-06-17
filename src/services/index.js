import cloneDeep from 'lodash/cloneDeep';
import request from '../utils/request';
import config from '../config';
import showAlert from '../utils/alert';
import { include, wait, paramsControl, queueControl } from '../utils/tool';
import { completeUrlExp } from '../utils/regexp';
import historyManager from '../utils/routerHistory';

export function pretreatment(res, dotShowError) {
	if (res.success) {
		return res.data.data;
	}
	const error = res instanceof Error ? res : res.error || new Error(res.data ? res.data.message : res);
	error.data = res.data;
	if (res.data && res.data.code === '505') {
		// token 失效
		historyManager.push('/login');
	} else if (!dotShowError) {
		if (error.message === 'Failed to fetch') {
			showAlert('当前网络状态不好，请稍后再试。', '网络错误');
		} else if (error.message === 'fetch timeout') {
			showAlert('当前网络状态不好，请稍后再试。', '请求超时');
		} else showAlert(res.data.message, '接口错误');
	}
	throw error;
}


export function makeApi(paths) {
	const obj = {};
	const reg = /\/:[a-zA-Z0-9]*/g;
	for (const k in paths) {
		let conf = paths[k];
		let path = '';
		if (typeof conf === 'object') {
			path = conf.url;
		} else {
			path = conf;
			conf = null;
		}
		if (!completeUrlExp.exp.test(path)) path = `${config.apiRoot}${path}`; // 如果不是完整的路径添加前缀
		obj[k] = paramsControl(queueControl((params, dotShowError) => {
			const m = path.match(reg) || [];
			if (typeof params !== 'object' && m.length) {
				params = { [m[0].slice(1)]: params };
			}
			const body = cloneDeep(params);
			const url = m.reduce((p, n) => {
				const key = n.slice(1);
				delete body[key];
				return p.replace(n, `/${encodeURIComponent(params[key])}`);
			}, path);
			const opt = {
				method: 'post',
				data: body,
				timeout: config.fetchTimeout * 1000,
				...conf
			};
			return request(url, opt).then(res => pretreatment(res, dotShowError));
		}));
	}
	return obj;
}
