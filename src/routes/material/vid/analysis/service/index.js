/*
 * @Date: 2020-05-08 15:31:11
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-09-08 20:05:25
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import qs from 'qs';
import cookie from 'js-cookie';
import xFetch from '../../../../../utils/xFetch';
import config from '../../../../../utils/config';

function randomStr() {
  return (
    Math.random()
      .toString(36)
      .slice(7) + Date.now()
  );
}

const urlSignStr = ({ playload, token, openid }) => {
  const queryDoc = {
    token,
    openid,
    nonce_str: randomStr(),
    timestamp: Date.now(),
    playload,
  };

  let str = '';
  const signObj = window.signOAuth(queryDoc, true);
  queryDoc.sign = signObj.sign;
  ['token', 'playload'].map((item) => {
    delete queryDoc[item];
  });

  Object.keys(queryDoc).map((item) => {
    str += `&${item}=${queryDoc[item]}`;
  });
  str = str.slice(1);
  return str;
};

const signstr = data => urlSignStr({
  playload: data,
  token: cookie.get('openid'),
  openid: cookie.get('openid'),
});
export async function getEventOption(parmas, product) {
  const res = await xFetch(`${config.domain}/eventManageSelect/${parmas}/?product=${product}`);
  return res;
}

export async function query(parmas) {
  // const res = await xFetch(`http://127.0.0.1:6090/api/template/query?${qs.stringify(parmas)}`);
  const res = await xFetch(`${config.domainVcmGh}/api/template/query?${qs.stringify(parmas)}`);
  return res;
}

export async function queryCountry(parmas = {}) {
  // const res = await xFetch(`http://127.0.0.1:6090/api/template/query?${qs.stringify(parmas)}`);
  const res = await xFetch(`${config.domainVcmToolBase}/regioncountry/getcountrychoice?${signstr(parmas)}`);
  return res;
}


export const detail = async (id) => {
  const res = await xFetch(`${config.domainVcmGh}/api/template/collect/detail?id=${id}`);
  return res.data.data;
};
