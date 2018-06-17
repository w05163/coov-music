/** 最大组件 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import routerHistory from './utils/routerHistory';
import renderRouter from './router';
import config from './config';


@withRouter
@connect(s => s.app)
class App extends Component {
	shouldComponentUpdate(nextProps) {
		const { location, history } = nextProps;
		const { location: oldLocation } = this.props;
		if (location === oldLocation) return true;
		if (this.historyGo) { // 是恢复路径所做的变更，不更新
			this.historyGo = false;
			return false;
		}
		if (history.action === 'POP') { // 返回
			if (
				oldLocation.pathname !== location.pathname
				&& config.endPaths.find(path => typeof path === 'string' ? oldLocation.pathname === path : path.test(oldLocation.pathname))
			) { // 再退就自杀
				console.log('再退就自杀');
				window.history.go(1);
				this.historyGo = true;
				this.onBackButton();
				return false;
			}
		}
		return true;
	}

	onBackButton = () => {
		if (this.exitAppTouch) {
			return;
		}
		this.exitAppTouch = true;
		console.log('再点击一次将退出应用!');
		clearTimeout(this.exitTimeId);
		this.exitTimeId = setInterval(() => {
			this.exitAppTouch = false;
		}, 2000);
	}

	render() {
		const { history, location } = this.props;
		const isBack = routerHistory.isBack(history);
		routerHistory.onChange(history);
		return (
			<ReactCSSTransitionGroup
				transitionName={isBack ? 'routeBack' : 'route'}
				// transitionEnterTimeout={400}
				// transitionLeaveTimeout={400}
			>
				{renderRouter({ location })}
			</ReactCSSTransitionGroup>
		);
	}
}


export default App;
