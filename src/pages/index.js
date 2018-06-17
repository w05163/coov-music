import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getToken, ls } from '../utils/tool';

@connect(s => s)
class Index extends Component {
	componentDidMount() {
		console.log('主页');
	}

	render() {
		return (
			<div>
				主页
				<Link to="./login">登录</Link>
			</div>
		);
	}
}

export default Index;
