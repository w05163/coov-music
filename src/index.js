import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import './style/index.less';
import { Alert } from './utils/alert';
import store from './models';
import registerServiceWorker from './registerServiceWorker';
import { AppRouter } from './router';
import config from './config';
import theme from './theme';
import App from './App';

window.rootDom = document.getElementById('root');

ReactDOM.render(
	<Provider store={store}>
		<AppRouter basename={config.basePath}>
			<MuiThemeProvider theme={theme}>
				<App />
				<Alert />
			</MuiThemeProvider>
		</AppRouter>
	</Provider>,
	window.rootDom
);
registerServiceWorker();
