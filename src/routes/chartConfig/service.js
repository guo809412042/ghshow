/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-05-15 10:44:30
 * @LastEditTime: 2021-04-07 14:09:16
 * @LastEditors: dongqi.zhao
 */

import xFetch from '../../utils/xFetch';

const url = 'https://vcm.quvideo.vip/gh/api/chart-config';

export async function getConfigList({
  product = '', pMenuName = '', id = '', name = '',
}) {
  const res = await xFetch(`${url}/list?product=${product}&pMenuName=${pMenuName}&id=${id}&name=${name}`);
  return res.data;
}

export async function getConfigListPage({
  product = '',
  pMenuName = '',
  id = '',
  name = '',
  page = 1,
  paeg_size = 10,
}) {
  const res = await xFetch(
    `${url}-page/list?product=${product}&pMenuName=${pMenuName}&id=${id}&name=${name}&page=${page}&page_size=${paeg_size}`,
  );
  return res.data;
}

export async function createConfig(data) {
  const res = await xFetch(`${url}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteConfig(id) {
  const res = await xFetch(`${url}/${id}`, {
    method: 'DELETE',
  });
  return res.data;
}
