/**
 * model主文件
 */
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { put, takeEvery } from 'redux-saga/effects';
import app from './app';

const initialState = {};
const modelReducers = {};
const modelEffects = {};
const modelOther = {};

function modelInit(state = initialState, action) {
	if (action.type === 'modelInit') {
		return {
			...state,
			[action.model]: action.state
		};
	}
	for (const key in modelReducers) {
		const model = modelReducers[key];
		for (const k in model) {
			const type = `${key}/${k}`;
			if (action.type === type) {
				return { ...state, [key]: model[k](state[key], action, key, modelOther[key]) };
			}
		}
	}
	return state;
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(modelInit, applyMiddleware(sagaMiddleware));


function makeEffectFun(namespace, proxyPut) {
	return function *(action) {
		const { type } = action;
		const key = type.replace(`${namespace}/`, '');
		const effects = modelEffects[namespace];
		const effect = effects[key];
		if (!effect) return;
		yield* effect(action, { put: proxyPut }, namespace, modelOther[namespace]);
	};
}

// 生成代理put或者dispatch方法，会自动在type前面加上"namespace\"
function makeProxy(namespace, fun) {
	return function ({ type, ...action }) {
		type = type.includes('/') ? type : `${namespace}/${type}`;
		return fun({ ...action, type });
	};
}

export function runModel(model) {
	const {
		namespace, state = {}, effects = {}, reducers = {}, subscriptions = {},
		...other
	} = model;

	initialState[namespace] = state;
	modelReducers[namespace] = reducers;
	modelEffects[namespace] = effects;
	modelOther[namespace] = other;
	const proxyPut = makeProxy(namespace, put);
	const proxyDispatch = makeProxy(namespace, store.dispatch);
	const effect = makeEffectFun(namespace, proxyPut);

	for (const k in effects) {
		sagaMiddleware.run(function *() {
			yield takeEvery(`${namespace}/${k}`, function *(...args) {
				try {
					yield effect(...args);
				} catch (error) {
					console.error('model未捕捉的错误', error);
				}
			});
		});
	}

	store.dispatch({ type: 'modelInit', model: namespace, state });

	Promise.resolve().then(() => {
		for (const k in subscriptions) {
			subscriptions[k]({ dispatch: proxyDispatch, state });
		}
	});
}


// 运行model
runModel(app);

export default store;
