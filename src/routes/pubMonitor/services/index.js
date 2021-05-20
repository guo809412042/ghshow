/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-09-08 14:09:44
 * @LastEditTime: 2021-01-04 17:37:33
 * @LastEditors: dongqi.zhao
 */
import xFetch from '../../../utils/xFetch';
import { domainVcmGh } from '../../../utils/config';

export async function QueryMessageState(messageId) {
  return xFetch(`${domainVcmGh}/api/monitor-message-state/${messageId}`, {
    method: 'get',
  });
}

export async function createMessageState(params) {
  return xFetch(`${domainVcmGh}/api/monitor-message-state/create`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function updateMessageState(params) {
  return xFetch(`${domainVcmGh}/api/monitor-message-state/update`, {
    method: 'put',
    body: JSON.stringify(params),
  });
}

export async function getMessagethreshold({ odps_table_name, product_id, type }) {
  return xFetch(
    `${domainVcmGh}/api/monitor-message-threshold/data?odps_table_name=${odps_table_name}&product_id=${product_id}&type=${type}`,
    {
      method: 'get',
    },
  );
}
