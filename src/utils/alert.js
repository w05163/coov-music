/** 全局alert和toast方法 */
import config from '../config';

export function toast(content, duration = 3, mask = false) {
	// return new Promise((res) => {
	// 	Toast.info(content, duration, res, mask);
	// });
	return Promise.resolve();
}

export default function showAlert(content, title = config.title, opt = { showCancel: false, cancelText: '取消', okText: '确定' }) {
	// return new Promise((res) => {
	// 	const buts = [
	// 		{ text: opt.okText || '确定', onPress: () => res(true) }
	// 	];
	// 	if (opt.showCancel)buts.unshift({ text: opt.cancelText || '取消', onPress: () => res(false), style: 'default' });
	// 	Modal.alert(title, content, buts);
	// });
	return Promise.resolve();
}
