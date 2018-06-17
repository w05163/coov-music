/** 封装从store中取特定数据的方法 */
import _ from 'lodash';

// 从state里返回当前项目的设备列表
export function getDevices(state) {
	const { device: { deviceProjectMap }, app: { currentProject } } = state;
	return deviceProjectMap[currentProject] || { devices: [], gateways: [] };
}

export default function getStore(...args) {
	return function (state) {
		return args.reduce((p, arg) => {
			if (typeof arg === 'function') {
				return { ...p, ...arg(state) };
			} else if (Array.isArray(arg)) {
				const keys = arg.concat();
				const name = keys.shift();
				const modal = state[name];
				const d = { ...p };
				keys.forEach(k => d[k] = _.get(modal, k));
				return d;
			} else if (typeof arg === 'object') {
				const d = { ...p };
				Object.keys(arg).forEach(k => d[k] = _.get(state, arg[k]));
				return d;
			} else if (typeof arg === 'string') {
				const data = arg[0] === '*' ? _.get(state, arg.slice(1)) : _.get(state, arg);
				return arg[0] === '*' ? { ...p, ...data } : { ...p, [arg]: data };
			} else {
				return p;
			}
		}, {});
	};
}
