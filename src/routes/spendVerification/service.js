/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-09 14:53:20
 * @LastEditTime: 2021-04-26 15:18:26
 * @LastEditors: dongqi.zhao
 */
import qs from 'qs';
import xFetch from '../../utils/xFetch';

// const url = window.location.href.includes('vcm.quvideo.vip')
//   ? 'https://vcm.quvideo.vip/gh/api'
//   : 'http://vcm-qa.quvideo.vip/gh/api';
const url = '/gh/api';

export async function getCountryListService() {
  return xFetch('https://gh.quvideo.com/filter/country', {
    method: 'get',
  });
}

export async function getDataList(parmas) {
  return xFetch(
    `${url}/finance_verification/list?${qs.stringify(parmas)}`,
  );
}

export async function create(data) {
  return xFetch(`${url}/finance_verification/create`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function checkDataInfo(data) {
  return xFetch(`${url}/finance_verification/check-info`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function update(data) {
  return xFetch(`${url}/finance_verification/update`, {
    method: 'put',
    body: JSON.stringify(data),
  });
}

export async function relUpdate(data) {
  return xFetch(`${url}/finance_verification/rel/update`, {
    method: 'post',
    body: JSON.stringify(data),
  });
}

export async function info(uuid) {
  return xFetch(`${url}/finance_verification/${uuid}`);
}

export async function approveInfo(instanceCode) {
  return xFetch(`${url}/finance_verification/get-approve/${instanceCode}`);
}

export async function getFinanceSpiderCheck(parmas) {
  return xFetch(`${url}/finance_verification/find-by-month?${qs.stringify(parmas)}`);
}

export async function deleteData(id) {
  return xFetch(`${url}/custom-country-group/${id}`, {
    method: 'delete',
  });
}
