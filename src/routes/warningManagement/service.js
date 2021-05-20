/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-05-18 17:21:06
 * @LastEditTime: 2020-09-08 14:43:27
 * @LastEditors: ssssslf
 */
import xFetch from '../../utils/xFetch';

const url = window.location.href.includes('vcm.quvideo.vip')
  ? '//vcm.quvideo.vip/gh/api/warning'
  : '//vcm-qa.quvideo.vip/gh/api/warning';
// : 'http://localhost:6090/api/warning';

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

export const userList = () => xFetch('//vcm.quvideo.vip/common/vcmadmin/get-all-user/');

export const getRates = async (product) => {
  const res = await xFetch(`${url}/get-rate-product?product=${product}`);
  return res.data;
};
