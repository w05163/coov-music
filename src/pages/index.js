import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TextField, Button, List, ListItem, ListItemText,
	Avatar, withStyles, ListItemSecondaryAction
} from '@material-ui/core';
import Page from '../components/page';
import Icon from '../components/icon';
import { getToken } from '../utils/tool';
import routerHistory from '../utils/routerHistory';
import { palette } from '../theme';
import css from '../style/page.less';

const sty = {
  search: {
		position: 'absolute',
    width: '100%',
    left: 0,
		bottom: 0,
		color: '#fff'
	},
	mainIcon: {
		fontSize: '24vw',
    marginTop: '1em',
    position: 'absolute',
    left: 0,
    right: 0,
    width: '1em',
    height: '1em',
    margin: 'auto',
    top: 0,
    bottom: 0
	},
	h1: { color: palette.primary.main, margin: 0 },
	item: { borderBottom: '1px solid #eee' }
};

@connect(s => s.app)
class Index extends Component {
	componentDidMount() {
		if (!getToken()) {
			// routerHistory.push('/login');
		}
	}

	render() {
		const data = new Array(10).fill(1);
		return (
			<Page className="center">
				<div className={css.background} >
					<h1 style={sty.h1}>
						<Icon type="headset" style={sty.mainIcon} />
					</h1>
					<TextField label="输入以搜索" fullWidth margin="normal" style={sty.search} />
				</div>
				<List dense>
					{data.map((a, i) => (
						<ListItem style={sty.item} button>
							<Icon type="play_circle_outline" style={i === 3 ? { color: palette.primary.main } : { color: '#fff' }} />
							<ListItemText primary={`歌曲${i}`} secondary={`周杰伦${i}`} />
							<Icon type="headset" />
							<Icon type="headset" />
						</ListItem>
					))}
				</List>
			</Page>
		);
	}
}

export default Index;
