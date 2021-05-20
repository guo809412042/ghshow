/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-09-08 14:09:44
 * @LastEditTime: 2021-04-29 18:43:15
 * @LastEditors: dongqi.zhao
 */
import xFetch from '../../../../utils/xFetch';

const url = window.location.href.includes('vcm.quvideo.vip')
  ? '//vcm.quvideo.vip/gh'
  : '//vcm-qa.quvideo.vip/gh';

const monetizeURL = window.location.href.includes('vcm.quvideo.vip')
  ? '//vcm.quvideo.vip/monetize'
  : '//vcm-qa.quvideo.vip/monetize';
  // : '//10.0.24.107:9750';

export async function QueryNodeData(params) {
  return xFetch(`${url}/api/common/query-data`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function GetAdvPlacementList() {
  return xFetch(`${url}/api/adv/placement-list`, {
    method: 'get',
  });
}

export async function GetVCMAdvPlacementList(params) {
  return xFetch(`${monetizeURL}/advertise/advertise-partner?pageSize=9999&current=1&productIdQuery=${params.product}&type=2`, {
    method: 'get',
  });
}

// export async function GetVCMAdvList(params) {
//   return xFetch(`${monetizeURL}/advertise/advertise?pageSize=9999&page=1&productIdQuery=${params.product}`, {
//     method: 'get',
//   });
// }

export async function AddAdvPlacement(params) {
  return xFetch(`${url}/api/adv/placement-add`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function UpdateAdvPlacement(params) {
  return xFetch(`${url}/api/adv/placement-update/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function DeleteAdvPlacement(params) {
  return xFetch(`${url}/api/adv/placement-delete/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function GetFinancialWarningList({
  channel = '',
  product = '',
  cash_type = '',
  start_date = '',
  end_date = '',
}) {
  return xFetch(`${url}/api/financial-warning/list?channel=${channel}&product=${product}&cash_type=${cash_type}&start_date=${start_date}&end_date=${end_date}`, {
    method: 'GET',
  });
}

export async function GetFinancialChannelList() {
  return xFetch(`${url}/api/financial-check/channel-list`);
}

export async function GetFinancialCheckList({
  channel = '',
  account = '',
  cash_type = '',
  start_date = '',
  end_date = '',
}) {
  return xFetch(`${url}/api/financial-check/list?channel=${channel}&account=${account}&cash_type=${cash_type}&start_date=${start_date}&end_date=${end_date}`, {
    method: 'GET',
  });
}

export async function UpdateFinancialCheckItem(params) {
  return xFetch(`${url}/api/financial-check/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function UpdateVCMIncome(params) {
  return xFetch(`${url}/api/financial-check/createVCMIncome`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
