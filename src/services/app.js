import { makeApi } from './index';

const paths = {
	login: 'open/login',
	userInfo: 'user/info'
};

const api = makeApi(paths);

export default api;
