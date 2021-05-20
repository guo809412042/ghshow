/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-19 14:49:58
 * @LastEditTime: 2020-06-23 12:08:22
 * @LastEditors: ssssslf
 */

export const columns = [
  { dataIndex: 'ds', title: '日期' },
  { dataIndex: 'app_start_cnt', title: '启动' },
  { dataIndex: 'view_cnt', title: '曝光' },
  { dataIndex: 'click_cnt', title: '点击' },
  { dataIndex: 'buy_cnt', title: '购买' },
  { dataIndex: 'app_start_cnt_view_cnt', title: '启动-曝光(%)' },
  { dataIndex: 'view_cnt_click_cnt', title: '曝光-点击(%)' },
  { dataIndex: 'click_cnt_buy_cnt', title: '点击-购买(%)' },
  { dataIndex: 'view_cnt_buy_cnt', title: '曝光-购买(%)' },
  { dataIndex: 'buy_year_cnt', title: '年包购买' },
  { dataIndex: 'buy_month_cnt', title: '月包购买' },
  { dataIndex: 'buy_week_cnt', title: '周包购买' },
].map(v => ({
  ...v,
  key: v.dataIndex,
  sorter: (a, b) => a[v.dataIndex] - b[v.dataIndex],
}));

export const initData = [
  {
    span: 18,
    offset: 3,
    name: '进入首页',
    value: 0,
    color: '#eea2a2',
    percent: [
      {
        percentTitle: '购买页进入率',
        percent: '0%',
      },
    ],
  },
  {
    span: 16,
    offset: 4,
    name: '进入购买页',
    value: 0,
    color: '#bbc1bf',
    percent: [
      {
        percentTitle: '购买点击率',
        percent: '0%',
      },
    ],
  },
  {
    span: 14,
    offset: 5,
    name: '购买点击',
    value: 0,
    color: '#57c6e1',
    percent: [
      {
        percentTitle: '购买成功率',
        percent: '0%',
      },
    ],
  },
  {
    span: 12,
    offset: 6,
    name: '购买成功',
    value: 0,
    color: '#b49fda',
  },
];

export const loudouColumns = [
  {
    dataIndex: 'enter_home_dvc_cnt',
    key: 'enter_home_dvc_cnt',
    title: '进入首页',
  },
  {
    dataIndex: 'enter_buy_home_dvc_cnt',
    key: 'enter_buy_home_dvc_cnt',
    title: '进入购买页',
  },
  {
    dataIndex: 'enter_buy_home_dvc_cnt/enter_home_dvc_cnt',
    key: 'enter_buy_home_dvc_cnt/enter_home_dvc_cnt',
    title: '购买页进入率',
  },
  {
    dataIndex: 'click_buy_dvc_cnt',
    key: 'click_buy_dvc_cnt',
    title: '购买点击',
  },
  {
    dataIndex: 'click_buy_dvc_cnt/enter_buy_home_dvc_cnt',
    key: 'click_buy_dvc_cnt/enter_buy_home_dvc_cnt',
    title: '购买点击率',
  },
  {
    dataIndex: 'buy_dvc_cnt',
    key: 'buy_dvc_cnt',
    title: '购买成功',
  },
  {
    dataIndex: 'buy_dvc_cnt/click_buy_dvc_cnt',
    key: 'buy_dvc_cnt/click_buy_dvc_cnt',
    title: '购买成功率',
  },
  {
    dataIndex: 'buy_dvc_cnt/enter_home_dvc_cnt',
    key: 'buy_dvc_cnt/enter_home_dvc_cnt',
    title: '购买率',
  },
];
