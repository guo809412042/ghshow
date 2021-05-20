/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-07-01 10:28:07
 * @LastEditTime: 2020-07-06 11:30:24
 * @LastEditors: ssssslf
 */
const config = {
  target: process.env.BUILD_ENV ? '/vcm/gh/dist/' : '',
  host: process.env.BUILD_ENV ? '' : 'http://rc.quvideo.vip',
};
module.exports = config;
