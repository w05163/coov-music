/**
 * 常用的正则表达式
 */

const phone = /^1[345678]\d{9}$/;
const email = /^((\w-*\.*)+@(\w-?)+(\.\w{2,})+)/;
const phoneAndEmail = /^((\w-*\.*)+@(\w-?)+(\.\w{2,})+)|1[345678]\d{9}$/;

export const mobileExp = {
	exp: phone,
	des: '请输入正确的手机号'
};

export const emailExp = {
	exp: email,
	des: '请输入正确的邮箱地址'
};

export const mobileAndEmailExp = {
	exp: phoneAndEmail,
	des: '请输入正确的手机号码/邮箱地址'
};

export const pwdExp = {
	exp: /^[0-9a-zA-Z-_%`~!@#\u0024\u005E&\u002A\u0028\u0029\u002B=]{6,18}$/,
	des: '6-18个字符（只能包含英文字母、数字、特殊符号，不能包含空格）',
	minLen: 6,
	maxLen: 18
};

export const sceneNameExp = {
	exp: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/,
	des: '1-10个字符，只能输入中文、数字或英文字母',
	minLen: 1,
	maxLen: 10
};

export const nameExp = {
	exp: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/,
	des: '1-30个字符，只能输入中文、数字或英文字母',
	minLen: 1,
	maxLen: 30
};

export const projectNameExp = {
	exp: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/,
	des: '1-20个字符，只能输入中文、数字或英文字母',
	minLen: 1,
	maxLen: 20
};

export const roomNameExp = {
	exp: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,16}$/,
	des: '1-16个字符，只能输入中文、数字或英文字母',
	minLen: 1,
	maxLen: 16
};

export const numberExp = {
	exp: /^[0-9]+([.]\d{1,2})?$/,
	des: '请输入合法的正数,最多两位小数'
};

export const macExp = {
	exp: /^[a-zA-Z0-9]+$/,
	des: 'mac只能输入字母与数字'
};

export const completeUrlExp = {
	exp: /^(http:\/\/|https:\/\/).+$/,
	des: '是否是http开头的地址'
};

export const expObj = {
	pwd: pwdExp,
	mobile: mobileExp,
	name: nameExp,
	number: numberExp,
	mac: macExp,
	email: emailExp
};

export function patternObj(key) {
	const exp = expObj[key];
	return { pattern: exp.exp, message: exp.des };
}

export default function validateFun(key) {
	let obj = key;
	if (typeof key === 'string')obj = expObj[key];
	return (text) => {
		return obj.exp.test(text) ? null : obj.des;
	};
}
