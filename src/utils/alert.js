/** 全局alert和toast方法 */
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import config from '../config';

let setState = null;
const queue = [];

export class Alert extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			content: null,
			title: null,
			showCancel: false,
			cancelText: '取消',
			okText: '确定',
			open: false
		};
		this.defaultState = {
			cancelText: '取消',
			okText: '确定',
			open: false
		};
		setState = obj => this.setState(obj);
	}
	next() {
		const con = queue.shift();
		if (queue.length)setTimeout(() => this.setState(queue[0].opt), 500);
		return con;
	}
	handleClose = () => {
		this.setState(this.defaultState);
		this.next().res();
	}
	cancel = () => {
		this.next().ret();
	}

	render() {
		const { content, title, showCancel, cancelText, okText, open } = this.state;
		return (
			<Dialog
				open={open}
				onClose={this.handleClose}
				fullWidth
			>
				<DialogTitle>
					{title}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{content}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					{showCancel ? (
						<Button onClick={this.cancel} color="primary">
							{cancelText}
						</Button>
					) : null}
					<Button onClick={this.handleClose} color="primary">
						{okText}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export function toast(content, duration = 3, mask = false) {
	// return new Promise((res) => {
	// 	Toast.info(content, duration, res, mask);
	// });
	return Promise.resolve();
}

export default function showAlert(content, title = config.title, opt = { showCancel: false, cancelText: '取消', okText: '确定' }) {
	return new Promise((res, ret) => {
		const item = {
			res,
			ret,
			opt: {
				content,
				title,
				...opt,
				open: true
			}
		};
		queue.push(item);
		if (queue.length === 1) setState(item.opt);
	});
}
