
const historyList = [];
let index = -1;
const routerHistory = {
	onChange(history) {
		routerHistory.history = history;
		const href = history.createHref(history.location).slice(1);
		const currentHref = historyList[index];
		const next = routerHistory.getNext();
		if (routerHistory.isBack(history)) { // 后退
			const last = routerHistory.getLast();
			if (href === last) index--;
			else {
				index += routerHistory.goIndex || 0;
				routerHistory.goIndex = 0;
			}
		} else if (href === next) {
			index++;
		} else if (href !== currentHref) {
			historyList.splice(index + 1);
			historyList.push(href);
			index++;
		}
		// console.log(historyList, index);
	},
	isBack(history) {
		return history.action === 'POP' && index >= 0;
	},
	getLast(num = 1) {
		return historyList[index - num];
	},
	getNext(num = 1) {
		return historyList[index + num];
	},
	getHistory() {
		return historyList.slice(0, index + 1);
	},
	getFullHistory() {
		return historyList.concat();
	},
	push(...a) {
		routerHistory.history.push(...a);
	},
	go(i) {
		if (i * 1 === 0) return;
		window.history.go(i);
		routerHistory.goIndex = i;
	},
	backToLast(str) { // 返回最近的路由
		const list = routerHistory.getHistory();
		let i = -1;
		const test = typeof str === 'string' ? url => str === url : url => str.test(url);
		list.forEach((url, ind) => {
			if (test(url) && i <= index) i = ind;
		});

		if (i !== -1)routerHistory.go(i - index);
		return i;
	}
};

export default routerHistory;
