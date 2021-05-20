/*
 * @Author: ssssslf
 * @Date: 2019-10-28 16:36:03
 * @LastEditTime: 2021-04-07 16:27:59
 * @LastEditors: dongqi.zhao
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/entry.ts
 */
/* eslint-disable global-require */
import dva from 'dva';
import ReactDOM from 'react-dom';

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  const app = dva();

  app.model(require('./models/app').default);

  app.router(require('./router').default);

  app.start('#root');

  console.log('props from main framework', props);
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
}

if (!process.env.BUILD_ENV) {
  document.cookie = 'productList=2%2C5%2C3%2C6;';
  document.cookie = 'email=dongqi.zhao@quvideo.com;';
  document.cookie = 'username=dongqi.zhao;';
  document.cookie = 'userid=3421;';
  document.cookie = 'groupIdList=1%2C9;';
  document.cookie = 'role_id=11;';
  document.cookie = 'openid=56daa6a4ba794036a7d26767646ad600;';
  document.cookie = 'country_code=CN;';
  document.cookie = 'project_type=1;';
  document.cookie = 'group_id=9;';
  document.cookie = 'user_leader_department=;';
  document.cookie = 'user={"user":{"username":"lifen.sheng@quvideo.com","id":3421,"email":"lifen.sheng@quvideo.com"},"isLogin":true,"product_list":"2,5,3,6","group_list":"1,9","role_id":11,"app_channel":"","user_leader_department":null};';
  document.cookie = 'PRODUCT_ID=6';
}
mount();
