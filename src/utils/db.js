/**
 * 与本地数据库的交互动作类
 * 每个表通用字段：{uTime,cTime,id}
 */
import config from '../config';

/**
 * 数据库升级阶梯
 */
const updateDbObj = [
	function (db) {
		const store = db.createObjectStore('store', { keyPath: 'id' });// 类似localStorage，利用indexdb进行key-value键值对存储
		store.createIndex('uTime', 'uTime', { unique: false });
		store.createIndex('cTime', 'cTime', { unique: false });
	},
];

export class DB {
	constructor() {
		try {
			const request = window.indexedDB.open(config.dbName, updateDbObj.length);
			request.onsuccess = (event) => {
				this.dbReady(event);
			};

			request.onupgradeneeded = (event) => {
				const { oldVersion, newVersion, target } = event;
				const { result: db, transaction } = target;

				for (let i = oldVersion; i < updateDbObj.length; i++) {
					updateDbObj[i](db);
				}

				transaction.oncomplete = () => this.dbReady(event);
			};

			request.onerror = (event) => {
				console.error('打开数据库错误', event);
				this.todo.forEach(o => o.ret(new Error('打开数据库错误')));
				throw request.error;
			};

			this.todo = [];
		} catch (error) {
			console.error('打开indexedDB错误', error);
			Promise.resolve().then(() => this.todo.forEach(o => o.ret(new Error('打开数据库错误'))));
		}
	}

	// 原本可以使用promise实现，但在safari浏览器（ios与mac）下通过promise的resolve回传objectStore会导致transaction失活，
	// 奇怪的是在dbReady中却不会导致transaction失活，所以猜测是safari的实现不标准或者bug
	getStore(name, callback, ret) {
		if (!this.db) {
			this.todo.push({ res: callback, ret, name });
		} else {
			callback(this.db.transaction(name, 'readwrite').objectStore(name));
		}
	}

	dbReady(event) {
		this.db = event.target.result;
		Promise.resolve().then(() => {
			this.todo.forEach((o) => {
				this.getStore(o.name, o.res, o.ret);
			});
			this.todo = [];
		});
	}
}

const db = new DB();

class Store {
	constructor(name) {
		this.name = name;
	}

	getStore(callback) {
		db.getStore(this.name, callback);
	}

	get(id) { // 获取单条
		return new Promise((res, ret) => {
			this.getStore((store) => {
				const p = store.get(id);
				p.onsuccess = () => res(p.result);
				p.onerror = ret;
			});
		});
	}

	add(obj) { // 添加一条记录，出错则调用callback,传入错误对象
		if (typeof obj === 'object') {
			obj.uTime = new Date();
			obj.cTime = obj.uTime;
		}
		return this.put(obj);
	}

	update(obj) {
		if (typeof obj === 'object') {
			obj.uTime = new Date();
		}
		return this.put(obj);
	}

	put(obj) {
		return new Promise((res, ret) => {
			this.getStore((store) => {
				const p = store.put(obj);
				p.onsuccess = () => res(p.result);
				p.onerror = ret;
			});
		});
	}

	list(opt = {}) {
		const {
			indexName,
			direction = 'next',
			page = 1, size
		} = opt;
		let { range } = opt;
		return new Promise((res, ret) => {
			this.getStore((store) => {
				const data = [];
				let index = store;
				if (indexName) index = store.index(indexName);
				if (size) {
					range = IDBKeyRange.bound((page - 1) * size, page * size);
				}
				const req = index.openCursor(range, direction);
				req.onsuccess = function (e) {
					const r = e.target.result;
					if (r) {
						data.push(r.value);
						if (!size || data.length < size) r.continue();
						else res(data);
					} else {
						res(data);
					}
				};
				req.onerror = ret;
			});
		});
	}
	remove(id) { // 删除单条记录，出错则调用callback,传入错误对象
		return new Promise((res, ret) => {
			this.getStore((store) => {
				const p = store.delete(id);
				p.onsuccess = res;
				p.onerror = ret;
			});
		});
	}
	clearStore() {
		return new Promise((res, ret) => {
			this.getStore((store) => {
				const p = store.clear();
				p.onsuccess = res;
				p.onerror = ret;
			});
		});
	}
}

const database = {
	store: new Store('store')
};

/** 测试代码 */
// async function abc() {
// 	const res = await database.store.put({ id: 1, d: 123 });
// 	console.warn('put方法返回', res);
// 	const res2 = await database.store.list();
// 	console.warn('list方法返回', res2);
// 	const res1 = await database.store.get(1);
// 	console.warn('get方法返回', res1);
// 	const res3 = await database.store.remove(1);
// 	console.warn('remove方法返回', res3);
// }

// abc();
// setTimeout(abc, 5000);

export default database;
