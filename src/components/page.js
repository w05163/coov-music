// 页面组件
import React, { Component } from 'react';
import cass from 'classnames';

class Page extends Component {
	render() {
		const { className, children, ...props } = this.props;
		return (
			<div className={cass('page', className)} {...props} >
				{children}
			</div>
		);
	}
}

export default Page;
