/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-05-18 17:21:06
 * @LastEditTime: 2021-04-14 19:16:58
 * @LastEditors: dongqi.zhao
 */
import xFetch from '../../utils/xFetch';

const url = window.location.href.includes('vcm.quvideo.vip')
  ? 'https://vcm.quvideo.vip/gh/api/warning-business'
  : '//vcm-qa.quvideo.vip/gh/api/warning-business';
  // : 'http://localhost:6090/api/warning-business';

export async function getWarningList(query) {
  const querys = Object.keys(query)
    .map(v => `${v}=${query[v] || ''}`)
    .join('&');
  const res = await xFetch(`${url}/list?${querys}`);
  return res.data;
}

export async function createWarning(data) {
  const res = await xFetch(`${url}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}
export async function updateWarning(data, id) {
  const res = await xFetch(`${url}/update/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function changeState(id, state) {
  const res = await xFetch(`${url}/update/${id}/${state}`);
  return res.data;
}

export async function deleteWarning(id) {
  const res = await xFetch(`${url}/delete/${id}`, { method: 'DELETE' });
  return res.data;
}

export const userList = () => xFetch('https://vcm.quvideo.vip/common/vcmadmin/get-all-user/');

export const getRates = async (product) => {
  const res = await xFetch(`${url}/get-rate-product?product=${product}`);
  return res.data;
};
