import React from 'react';
import { Router, Switch } from 'dva/router';
import { convertRoutes } from 'dva-router-config';
import routesConfig from './routes/router';
// eslint-disable-next-line
function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>{convertRoutes(routesConfig, { app })}</Switch>
    </Router>
  );
}

export default RouterConfig;
