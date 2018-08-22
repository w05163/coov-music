import { getToken } from '../utils/tool';
import config from '../config';

const { fetch } = window;

export function parseJSON(response) {
	switch (response.headers.get('content-type')) {
		case 'image/jpeg':

			return response.blob().then(blob => ({
				code: '200',
				data: blob,
			}));
		default:
			return response.json();
	}
}

export function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	const error = new Error(response.statusText);
	error.response = response;
	throw error;
}

export function requestFile(url) {
	return fetch(url).then((res) => {
		if (res.status >= 200 && res.status < 300) {
			return res.blob();
		}

		const error = new Error(res.statusText);
		error.response = res;
		throw error;
	});
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
	if (!/^(http:\/\/|https:\/\/).+$/.test(url)) url = `${config.apiRoot}${url}`;
	const { headers = {}, body, timeout = 20000, ...opt } = options;
	const Authorization = getToken();
	if (Authorization) {
		headers.Authorization = Authorization;
	}
	headers['Access-Control-Allow-Origin'] = '*';

	if (body instanceof window.FormData) {
		opt.body = body;
	} else {
		headers['Content-Type'] = 'application/json';
		opt.body = JSON.stringify(body);
	}
	opt.headers = new Headers(headers);
	if (opt.method.toUpperCase() === 'GET') {
		delete opt.body;
	}

	return new Promise((resolve) => {
		const timeId = setTimeout(() => {
			console.log('请求超时timeout', timeout);
			resolve(new Error('fetch timeout'));
		}, timeout);
		fetch(url, opt)
		.then((res) => {
			clearTimeout(timeId);
			return checkStatus(res);
		})
		.then(parseJSON)
		.then(resolve)
		.catch(resolve);
	});
}
