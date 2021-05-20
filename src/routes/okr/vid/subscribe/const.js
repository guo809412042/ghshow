/*
 * @Author: zhoutao
 * @Date: 2020-10-09 13:43:52
 * @Copyright(c) QuVideo F2E Team
 * @Email: tao.zhou@quvideo.com
 */
export const listColumns = [
  { dataIndex: 'ds', key: 'ds', title: '日期' },
  { dataIndex: 'dau_v', key: 'dau_v', title: 'DAU' },
  { dataIndex: 'subscribe_v', key: 'subscribe_v', title: '进入订阅页' },
  { dataIndex: 'click_v', key: 'click_v', title: '点击购买按钮' },
  { dataIndex: 'pchs_v', key: 'pchs_v', title: '购买成功' },
  { dataIndex: 'subscribe_v_dau_v', key: 'subscribe_v_dau_v', title: '进入/DAU(%)' },
  { dataIndex: 'click_v_subscribe_v', key: 'click_v_subscribe_v', title: '点击/进入(%)' },
  { dataIndex: 'pchs_v_click_v', key: 'pchs_v_click_v', title: '购买/点击(%)' },
  { dataIndex: 'pchs_v_subscribe_v', key: 'pchs_v_subscribe_v', title: '购买/进入(%)' },
  { dataIndex: 'year_pchs_v', key: 'year_pchs_v', title: '年包' },
  { dataIndex: 'month_pchs_v', key: 'month_pchs_v', title: '月包' },
  {
    dataIndex: 'other_pchs_v',
    key: 'other_pchs_v',
    title: '其他订阅项',
  },
];

// 订阅路径列表
export const columns = [
  { dataIndex: 'dau_v', key: 'dau_v', title: 'DAU' },
  { dataIndex: 'subscribe_v', key: 'subscribe_v', title: '进入订阅页' },
  { dataIndex: 'subscribe_v_dau_v', key: 'subscribe_v_dau_v', title: '进入/DAU(%)' },
  { dataIndex: 'click_v', key: 'click_v', title: '点击购买' },
  { dataIndex: 'click_v_subscribe_v', key: 'click_v_subscribe_v', title: '点击/进入(%)' },
  { dataIndex: 'pchs_v', key: 'pchs_v', title: '购买成功' },
  { dataIndex: 'pchs_v_subscribe_v', key: 'pchs_v_subscribe_v', title: '购买/进入(%)' },
];

export const initData = [
  {
    span: 18,
    offset: 3,
    name: 'DAU',
    value: 0,
    color: '#eea2a2',
    percent: [
      {
        percentTitle: '订阅页进入率',
        percent: '0%',
      },
    ],
  },
  {
    span: 16,
    offset: 4,
    name: '进入订阅页',
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
    name: '点击购买',
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
