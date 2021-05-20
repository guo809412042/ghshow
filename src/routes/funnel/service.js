/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-09 14:53:20
 * @LastEditTime: 2021-04-01 16:28:57
 * @LastEditors: Neal
 */
import xFetch from '../../utils/xFetch';

const url = 'https://vcm.quvideo.vip/gh/api/funnel_event';
// const url = 'http://127.0.0.1:6090/api/funnel_event';

export async function createFunnelEvent(data) {
  return xFetch(`${url}/create`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getFunnelEvent({
  username = '', name = '', star = '', step = '', funnelId = '', product_id, funnelType = 1,
}) {
  return xFetch(
    `${url}/list?username=${username}&name=${name}&star=${star}&step=${step}&funnel_id=${funnelId}&product_id=${product_id}&funnelType=${funnelType}`,
  );
}

export async function updateFunnelEvent(id, data) {
  return xFetch(`${url}/update/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateFunnelEventStar(id, data) {
  return xFetch(`${url}/star/update/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateFunnelEventTag(data) {
  return xFetch(`${url}/tag/update`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteFunnelEvent(id) {
  return xFetch(`${url}/delete/${id}`, {
    method: 'delete',
  });
}
export async function deleteFunnelEventTags(ids) {
  return xFetch(`${url}/tag/delete/${ids}`, {
    method: 'delete',
  });
}
