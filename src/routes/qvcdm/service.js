/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-07-01 14:19:03
 * @LastEditTime: 2020-09-08 14:43:13
 * @LastEditors: ssssslf
 */
import xFetch from '../../utils/xFetch';

const url = '//vcm.quvideo.vip/gh/api/qvcdm';

export const query = async () => {
  const res = await xFetch(`${url}`);
  return res.data;
};

export const insert = async (body) => {
  const res = await xFetch(`${url}`, {
    method: 'post',
    body: JSON.stringify(body),
  });
  return res.data;
};

export const destroy = async (id) => {
  const res = await xFetch(`${url}/${id}`, {
    method: 'delete',
  });
  return res.data;
};
