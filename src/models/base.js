import _ from 'lodash';
import { dbStore } from '../utils/tool';

const saveModelFun = {};
const initState = {};

export function getLocalDataKey(namespace) {
	return `saveModel.${namespace}`;
}

/**
 * 基本的model
 * 默认有一个list，并对list进行增删改
 * 提供extend用于model继承
 */
export const baseModal = {
	namespace: 'base',
	state: {
		list: []
	},
	subscriptions: {
		setup({ dispatch }) {
			dispatch({ type: 'init' });
		}
	},
	effects: {},
	reducers: {
		add(state, { data }) {
			return { ...state, list: state.list.concat(data) };
		},
		remove(state, { id, ids }) {
			ids = ids || [id];
			return {
				...state,
				list: state.list.filter(i => !ids.includes(i.id))
			};
		},
		update(state, { data }) {
			return {
				...state,
				list: state.list.map(i => i.id === data.id ? { ...i, ...data } : i)
			};
		},
		set(state, { type, ...other }) {
			return { ...state, ...other };
		},
		reset(state, action, namespace, { resetIgnoreKey = [] }) {
			dbStore.removeItem(getLocalDataKey(namespace));
			const keep = {};
			resetIgnoreKey.forEach(k => keep[k] = state[k]);
			return {
				...initState[namespace],
				...keep
			};
		},
		setObj(state, { type, name, data }) {
			return { ...state, [name]: { ...state[name], ...data } };
		},
		saveModelToLocal(state, action, namespace, { ignoreKey = [], inculdeKey = [] }) {
			const data = inculdeKey && inculdeKey.length ?
				inculdeKey.reduce((p, k) => {
					p[k] = state[k];
					return p;
				}, {})
				: { ...state };
				ignoreKey.forEach(k => delete data[k]);
			saveModelFun[namespace](getLocalDataKey(namespace), data);
			return state;
		}
	}
};

function mixing(base, model, key) {
	return { ...base[key], ...model[key] };
}

export default function extend(model, base = baseModal) {
	const keys = ['state', 'subscriptions', 'effects', 'reducers'];
	const obj = { ...base, ...model };
	keys.forEach(k => obj[k] = mixing(base, model, k));
	saveModelFun[model.namespace] = _.debounce((key, data) => dbStore.setItem(key, data), 5000);
	initState[model.namespace] = _.cloneDeep(obj.state);
	return obj;
}
