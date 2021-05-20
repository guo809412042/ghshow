/*
 * @Author: ssssslf
 * @Date: 2019-10-28 16:36:03
 * @LastEditTime: 2021-04-27 17:54:50
 * @LastEditors: dongqi.zhao
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/utils/request.js
 */
/* eslint-disable no-console */
import fetchJsonp from 'fetch-jsonp';
import xFetch from './xFetch';
import config from './config';

export async function getDataList(sql) {
  console.log(sql);
  return xFetch(`${config.domain}/v1/query`, {
    method: 'POST',
    body: JSON.stringify({ sql }).replace(/\+/g, 'self_plus'),
  });
}

export async function getData(sql) {
  console.log('----', sql);
  return xFetch(`${config.domain}/v1/query`, {
    method: 'POST',
    body: JSON.stringify({ sql }).replace(/\+/g, 'self_plus'),
  });
}
export async function getDataOfNew(where) {
  console.log(where);
  return xFetch(`https://vcm.quvideo.vip/gh/api/funnel_event/get-stat?where=${where}`, {
    method: 'get',
  });
}

export async function uploadget(fileName) {
  return xFetch(`https://vcm-tool.api.xiaoying.co/tools/get_ali_oss_sts/?fileName=${fileName}`, {
    method: 'get',
  });
}

export async function getOssToken(fileName, domain) {
  return xFetch(`/tool-base/api/tools/get-oss-by-domain?fileName=${fileName}&domain=${domain}`, {
    method: 'get',
  });
}
export async function getHoloData(sql) {
  console.log('getHoloData', sql);
  const res = await xFetch('https://vcm.quvideo.vip/gh/api/holo/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql }).replace(/\+/g, 'self_plus'),
  });
  return res.data;
}

export async function getEventCountData(path = '') {
  return xFetch(`//vcm.quvideo.vip/gh/api/event/list/count?path=${path}`, {
    method: 'get',
  });
}
export async function createEventCountData(body) {
  return xFetch('//vcm.quvideo.vip/gh/api/event/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
export async function countEventNameList(product = '') {
  return xFetch(`//vcm.quvideo.vip/gh/api/event/event-name?product=${product}`, {
    method: 'get',
  });
}
export async function getapplog(url) {
  // return xFetch(url, {
  //   method: 'get'
  // })
  return xFetch(`${config.domainGH}/getLog`, {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

// 传递 sql，从 gh 接口获取数据
export function query(sql) {
  console.log(sql);
  return xFetch(`${config.domain}/v2/query`, {
    method: 'POST',
    body: JSON.stringify({ sql }).replace(/\+/g, 'self_plus'),
  });
}

export function getKeyNames(eventName, productId) {
  return xFetch(`${config.domain}/select/key_name/filter/${eventName}/${productId}`);
}

export function getAllEventSegs() {
  const sql = 'SELECT * FROM event_segment';
  const option = { sql };
  return xFetch(`${config.domain}/setting/edit_table`, {
    method: 'POST',
    body: JSON.stringify(option),
  });
}

/**
 * 可配置的条件类型
 */
export function getConditionType(product) {
  return xFetch(`${config.domain}/setting/group_info/${product}`);
}

/**
 * 具体条件类型的值，conditionType 的值为 group_info 表中的 name
 */
export function getConditionValue(conditionType, product) {
  if (conditionType === 'Ios_AppVersion') {
    return xFetch(`https://reports.quvideo.com/appinfo/2?product=${product || 2}`);
  }
  if (conditionType === 'Android_AppVersion') {
    return xFetch(`https://reports.quvideo.com/appinfo/1?product=${product || 2}`);
  }
  return xFetch(`${config.domain}/filter/${conditionType}`);
}
export async function getGHData(sql) {
  return xFetch(`${config.domainGH}/api/query`, {
    method: 'POST',
    body: JSON.stringify({ sql }),
  });
}

export function getParams(eventName, product) {
  return xFetch(`${config.domain}/select/key_name/filter/${eventName}/${product}`);
}

const host = 'https://viva.api.xiaoying.co';

export const getNickNameByPuid = async (puiddigest) => {
  const res = await fetchJsonp(
    `${host}/webapi2/rest/video/publishinfo.get?appkey=30000000&puid=${puiddigest}&ver=1&format=MP4`,
    {
      jsonpCallback: 'callback',
    },
  );
  return res.json();
};
