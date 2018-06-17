import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getToken, ls } from '../utils/tool';

@connect(s => s)
class Login extends Component {
	render() {
		return (
			<div>
				登录页
			</div>
		);
	}
}

export default Login;
