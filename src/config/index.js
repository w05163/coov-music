/**
 * 整个项目的配置文件(代码内需要用到的配置)
 */
import dev from './dev';

let config = {};
if (process.env.NODE_ENV !== 'production') {
	config = dev;
}

export default {
	title: '可乎音乐',
	displayVersion: '0.0.1',
	basePath: '/music',
	apiRoot: 'http://localhost:8000/api/',
	endPaths: ['/', '/login', /^\/home\//], // 用户处于这些路径时不能再返回上一页了
	dbName: 'music',
	debug: false,
	maxRequest: 3, // 最大同时请求数
	fetchTimeout: 20, // 请求接口超时时间
	...config
};
