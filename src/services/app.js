import { makeApi } from './index';

const paths = {
	login: 'open/login',
	userInfo: {
		url: 'user/info',
		method: 'get'
	}
};

const api = makeApi(paths);

export default api;
