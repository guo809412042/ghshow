/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-09 14:53:20
 * @LastEditTime: 2021-02-23 15:52:59
 * @LastEditors: dongqi.zhao
 */
import xFetch from '../../utils/xFetch';

const url = window.location.href.includes('vcm.quvideo.vip')
  ? 'https://vcm.quvideo.vip/gh/api'
  : 'http://vcm-qa.quvideo.vip/gh/api';

export async function getCountryListService() {
  return xFetch('https://gh.quvideo.com/filter/country', {
    method: 'get',
  });
}

export async function getDataList() {
  return xFetch(
    `${url}/custom-country-group/list`,
  );
}

export async function create(data) {
  return xFetch(`${url}/custom-country-group/create`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteData(id) {
  return xFetch(`${url}/custom-country-group/${id}`, {
    method: 'delete',
  });
}
