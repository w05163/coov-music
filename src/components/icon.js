// 图标
import React, { Component } from 'react';
import cass from 'classnames';

class Icon extends Component {
	render() {
		const { type, className, ...props } = this.props;
		return (
			<span className={cass('icons', className)} {...props}>
				{type}
			</span>
		);
	}
}

export default Icon;
