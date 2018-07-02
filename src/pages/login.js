import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
import { palette } from '../theme';
import Page from '../components/page';
import { getToken, ls } from '../utils/tool';
import alert from '../utils/alert';

const sty = {
	title: {
		paddingTop: '16vh',
    fontSize: '3em',
    color: palette.primary.main,
    fontWeight: 700
	},
	form: {
		width: '61.8%',
    margin: '2em auto'
	}
};

@connect(s => s)
class Login extends Component {
	onChange = (e) => {
		const { name, value } = e.target;
		this.data[name] = value;
	}
	data = {}
	login = () => {
		const { dispatch } = this.props;
		const data = this.data;
		if (!data.account) return alert('请输入用户名');
		if (!data.password) return alert('请输入密码');
		dispatch({ type: 'app/login', data });
	}

	render() {
		return (
			<Page className="center">
				<div style={sty.title}>coov</div>
				<div style={sty.form}>
					<TextField
						label="用户名"
						margin="normal"
						fullWidth
						name="account"
						onChange={this.onChange}
					/><br />
					<TextField
						label="密码"
						type="password"
						name="password"
						margin="normal"
						onChange={this.onChange}
						fullWidth
					/>
				</div>
				<Button variant="contained" size="large" color="primary" onClick={this.login}>登录</Button>
			</Page>
		);
	}
}

export default Login;
