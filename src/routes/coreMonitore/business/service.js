/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-03 15:38:23
 * @LastEditTime: 2021-02-23 17:05:56
 * @LastEditors: dongqi.zhao
 */
import xFetch from '../../../utils/xFetch';

const url = window.location.href.includes('vcm.quvideo.vip')
  ? '//vcm.quvideo.vip/gh/api'
  : '//vcm-qa.quvideo.vip/gh/api';
// const url = 'https://vcm.quvideo.vip/gh/api';
const repositoryUrl = '//vcm.quvideo.vip/template-repository/api';

export const taskMonitorService = async (body) => {
  const res = await xFetch(`${url}/task-monitor`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const failMonitorService = async (body) => {
  const res = await xFetch(`${url}/fail-monitor`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};
export const failMonitorNewService = async (body) => {
  const res = await xFetch(`${url}/fail-monitor-new`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};
export const taskMonitorSearchService = async (body) => {
  const res = await xFetch(`${url}/task-monitor-search${body.productId * 1 === 6 ? '-new' : ''}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const consumeTimeService = async (body) => {
  const res = await xFetch(`${url}/task-consumeTime`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const getTemplateStore = async (ttid) => {
  const res = await xFetch(
    `${repositoryUrl}/templatestore/query_template_repository_list/?page=1&pageSize=1&ttid=${ttid}`,
    {
      method: 'GET',
    },
  );
  return res.data;
};
