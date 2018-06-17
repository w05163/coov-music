/** 整个app都需要用到的一些数据与流程 */
import { call, select } from 'redux-saga/effects';
import service from '../services/app';
import { setToken, dbStore, getToken, expirationData, wait, ls, clearLs } from '../utils/tool';
import routerHistory from '../utils/routerHistory';
import extend, { getLocalDataKey } from './base';

export default extend({
	namespace: 'app',
	ignoreKey: [], // 保存model到本地时忽略的state key，默认会保存全部，在base内使用
	resetIgnoreKey: [],
	state: {
		loginStatus: 0, // 0：未登录；1：登录中；2：已登录
		user: {}, // 用户数据
	},
	subscriptions: {
	},
	effects: {
		*init(action, { put }, namespace) {
			yield put({ type: 'userInit' });
			const res = yield call(service.login);
			console.log(res);
		},
		*userInit(action, { put }) {
			const token = getToken();
			if (!token) return;
			const user = yield call(service.userInfo);
			user.account = user.mobile;
			yield put({ type: 'set', user });
		},
		*login({ payload, isScanLogin }, { put }) {
			yield put({ type: 'set', loginStatus: 1 });
			try {
				const data = yield call(service.login, payload);
				const { fuitsuToken, gizwitsExpireAt, gizwitsToken, gizwitsUid, ...user } = data;
				setToken(fuitsuToken, 7);
				user.account = payload.account;
				yield put({ type: 'userInit' });
				yield put({ type: 'set', loginStatus: 2, user });
				routerHistory.push('/house/room');
			} catch (error) {
				console.error(error);
				yield put({ type: 'set', loginStatus: 0 });
			}
		},
		*logout(action, { put }) {
			clearLs();
			yield put({ type: 'reset' });
			routerHistory.push('/login');
		},
		*refresh(action, { put }) {
			const { currentProject } = yield select(s => s.app);
		}
	},
	reducers: {
	}
});
