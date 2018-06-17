import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './style/index.less';
import store from './models';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { AppRouter } from './router';
import config from './config';

window.rootDom = document.getElementById('root');

ReactDOM.render(
	<Provider store={store}>
		<AppRouter basename={config.basePath}>
			<App />
		</AppRouter>
	</Provider>,
	window.rootDom
);
registerServiceWorker();
