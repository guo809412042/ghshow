/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-05-14 11:24:01
 * @LastEditTime: 2020-05-14 16:16:47
 * @LastEditors: ssssslf
 */

import xFetch from '../../../../utils/xFetch';

const url = '//vcm.quvideo.vip/gh/api';
export const getSummaryData = async (startDate, endDate) => {
  const res = await xFetch(`${url}/result-sort/list?startDate=${startDate}&endDate=${endDate}&is_in=Y`, {
    method: 'GET',
  });
  return res.data;
};
export const getDetailData = async ({
  startDate, endDate, appname = '', added_template = '',
  is_in = '',
}) => {
  const res = await xFetch(`${url}/result-temp/list?startDate=${startDate}&endDate=${endDate}&appname=${appname}&added_template=${added_template}&is_in=${is_in}`, {
    method: 'GET',
  });
  return res.data;
};
export const getAppNameData = async () => {
  const res = await xFetch(`${url}/result-appname/list`, {
    method: 'GET',
  });
  return res.data;
};
