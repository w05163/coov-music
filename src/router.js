import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/login';
import Index from './pages/index';

const renderRouter = ({ location, ...props }) => (
	<Switch {...props} key={location.pathname.match(/^\/[^/]*/)[0]} location={location}>
		<Route exact path="/" component={Index} />
		<Route path="/login" component={Login} />
		<Route render={() => '404'} />
	</Switch>
);

export default renderRouter;

export const AppRouter = BrowserRouter;
