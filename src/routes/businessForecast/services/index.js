/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-31 13:49:13
 * @LastEditTime: 2020-09-08 14:42:06
 * @LastEditors: ssssslf
 */

import xFetch from '../../../utils/xFetch';

const url = window.location.href.includes('vcm.quvideo.vip')
  ? '//vcm.quvideo.vip/gh/api/predict_config'
  : '//vcm-qa.quvideo.vip/gh/api/predict_config';
export async function createConfig(data) {
  return xFetch(`${url}/create`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getConfigList({
  country = '', channel = '', type = '', startDate = '', endDate = '',
}) {
  return xFetch(
    `${url}/list?country=${country}&channel=${channel}&type=${type}&startDate=${startDate}&endDate=${endDate}`,
  );
}
export async function getFirstDateList({ country = '', channel = '' }) {
  return xFetch(`${url}/first_date?country=${country}&channel=${channel}`);
}

export async function updateConfig(id, data) {
  return xFetch(`${url}/update/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteConfig(id) {
  return xFetch(`${url}/delete/${id}`, {
    method: 'delete',
  });
}
const testUrl = '//vcm.quvideo.vip/gh/api/predict_config';

// 批量添加中国自然
export async function createCnOrgBulk(data) {
  return xFetch(`${testUrl}/cn_org/list`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
// 删除中国自然
export const deleteCnOrg = async id => xFetch(`${testUrl}/cn_org/${id}`, {
  method: 'delete',
});

// 中国自然列表
export async function getConfigCnOrgList({ type = '', startDate = '', endDate = '' }) {
  return xFetch(`${testUrl}/cn_org/list?type=${type}&startDate=${startDate}&endDate=${endDate}`);
}

// 批量添加非中国自然
export async function createNotCnOrgBulk(data) {
  return xFetch(`${testUrl}/not_cn_org/list`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
// 非中国自然列表
export async function getConfigNotCnOrgList({
  country = '', type = '', startDate = '', endDate = '',
}) {
  return xFetch(`${testUrl}/not_cn_org/list?country=${country}&type=${type}&startDate=${startDate}&endDate=${endDate}`);
}

// 删除非中国自然
export const deleteNotCnOrg = async id => xFetch(`${testUrl}/not_cn_org/${id}`, {
  method: 'delete',
});

// 批量添加中国投放
export async function createCnPutBulk(data) {
  return xFetch(`${testUrl}/cn_put/list`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
// 删除中国投放
export const deleteCnPut = async id => xFetch(`${testUrl}/cn_put/${id}`, {
  method: 'delete',
});

// 中国自然投放
export async function getConfigCnPutList({ type = '', startDate = '', endDate = '' }) {
  return xFetch(`${testUrl}/cn_put/list?type=${type}&startDate=${startDate}&endDate=${endDate}`);
}

// 批量添加非中国投放
export async function createNotCnPutBulk(data) {
  return xFetch(`${testUrl}/not_cn_put/list`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
// 删除非中国投放
export const deleteNotCnPut = async id => xFetch(`${testUrl}/not_cn_put/${id}`, {
  method: 'delete',
});

// 中国非自然投放
export async function getConfigNotCnPutList({
  country = '', type = '', startDate = '', endDate = '',
}) {
  console.log(country);
  return xFetch(`${testUrl}/not_cn_put/list?country=${country}&type=${type}&startDate=${startDate}&endDate=${endDate}`);
}
