/*
 * @Description:
 * @Author: kuckboy
 * @Date: 2020-11-26 10:34:28
 * @LastEditTime: 2020-11-26 10:34:28
 * @LastEditors: kuckboy
 */

import xFetch from '../../../utils/xFetch';

const url = window.location.href.includes('vcm.quvideo.vip')
  ? '//vcm.quvideo.vip/gh/api'
  : '//vcm-qa.quvideo.vip/gh/api';

// const url = `http://0.0.0.0:6090/api`;

// 产品信息
export async function getProductList() {
  return xFetch(`${url}/dataset/product-info`, {
    method: 'GET',
  });
}

export async function getProductInfo(id) {
  return xFetch(`${url}/dataset/product-info/${id}`, {
    method: 'GET',
  });
}

export async function addProductInfo(params) {
  return xFetch(`${url}/dataset/product-info`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function updateProductInfo(productId, params) {
  return xFetch(`${url}/dataset/product-info/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 审核
export async function getApproveList(id) {
  return xFetch(`${url}/dataset/product-approve/${id}`, {
    method: 'GET',
  });
}

// 审核记录
export async function getApproveRecord(approveId) {
  return xFetch(`${url}/dataset/product-approve-record/${approveId}`, {
    method: 'GET',
  });
}

// 产品线信息
export async function getProductLineList() {
  return xFetch(`${url}/dataset/product-line`, {
    method: 'GET',
  });
}

export async function addProductLine(params) {
  return xFetch(`${url}/dataset/product-line`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function updateProductLine(id, params) {
  return xFetch(`${url}/dataset/product-line/${id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 员工信息
export async function getEmployeeList() {
  return xFetch(`${url}/dataset/employee`, {
    method: 'GET',
  });
}

export async function updateEmployeeList(id, params) {
  return xFetch(`${url}/dataset/employee/${id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}
