/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-18 16:09:00
 * @LastEditTime: 2020-08-24 16:43:42
 * @LastEditors: Neal
 */

export const cardData = [
  {
    title: 'GP新增',
    graphName: 'GP新增',
    id: '1',
    type: 'line',
    noDenominator: true,
    molecular: 'installs',
    suffix: false,
    database: 'rpt_pub_dp_channel_gp_1d',
    day: 'ds',
    yesterday: true,
    today: true,
    lastWeek: true,
    week: true,
    lastWeekDay: true,
    otherWhere: 'and product_id=6 ',
  },
];

export const gpSearchData = {
  title: 'GP搜索关键词',
  graphName: 'GP搜索关键词',
  id: '2',
  type: 'line',
  noDenominator: true,
  molecular: 'installs',
  suffix: false,
  database: 'rpt_pub_dp_keyword_gp_1d',
  day: 'ds',
  yesterday: true,
  today: true,
  lastWeek: true,
  week: true,
  lastWeekDay: true,
  otherWhere: 'and product_id=6 ',
};
