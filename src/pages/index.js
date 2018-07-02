import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getToken } from '../utils/tool';
import routerHistory from '../utils/routerHistory';

@connect(s => s)
class Index extends Component {
	componentDidMount() {
		if (!getToken()) {
			routerHistory.push('/login');
		}
	}

	render() {
		return (
			<div>
				主页
			</div>
		);
	}
}

export default Index;
