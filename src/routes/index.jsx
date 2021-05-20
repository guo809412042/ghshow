import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { renderRoutes } from 'dva-router-config';
import { IntlProvider, addLocaleData } from 'react-intl';
// import locale from '@xy/design/es/locales/index';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zhCN from '../locales/zh-Hans-CN';
import enUS from '../locales/en-US.messages';
import { getLang } from '../utils/utils';
import '../styles/styles.less';

function setLang() {
  const lang = getLang();
  switch (lang) {
    case 'en-US':
      return enUS;
    default:
      return zhCN;
  }
}

addLocaleData([...en, ...zh]);
const App = ({ route = {} }) => (
  <IntlProvider locale={getLang()} messages={setLang()}>
    <div style={{ margin: 10 }}>
      {/* <canvas id="vcmCanvasWaterMark"> */}

      <div style={{ marginTop: 10 }}>{renderRoutes(route.routes)}</div>
      {/* </canvas> */}
    </div>
  </IntlProvider>
);
App.contextTypes = {
  router: PropTypes.object.isRequired,
};

App.propTypes = {
  route: () => {},
};

App.defaultProps = {
  route: PropTypes.object,
};

export default connect(({ app }) => ({ app }))(App);
