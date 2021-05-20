export const sourceCardData = [
  {
    title: '平均整体新增',
    bg: '#6eb8d4',
    type: 'reg_num',
    percent: 0,
    num: 0,
  },
  {
    title: '平均投放新增',
    bg: '#13c2c2',
    type: 'put_num',
    percent: 0,
    num: 0,
  },
  {
    title: '平均自然新增',
    bg: '#1d89cf',
    type: 'organic_num',
    percent: 0,
    num: 0,
  },
];

export const clientCardData = [
  {
    title: '平均整体投放消耗',
    bg: '#6eb8d4',
    type: 'spend_num',
    percent: 0,
    num: 0,
  },
  {
    title: '平均整体新增',
    bg: '#6eb8d4',
    type: 'reg_num',
    percent: 0,
    num: 0,
  },
  {
    title: '平均投放新增',
    bg: '#6eb8d4',
    type: 'put_num',
    percent: 0,
    num: 0,
  },
  {
    title: '平均自然新增',
    bg: '#6eb8d4',
    type: 'organic_num',
    percent: 0,
    num: 0,
  },
];

export const radioStatus = {
  all: '所有数据',
  a: '广告数据',
  b: '变现数据',
};
export const MEDIA_SOURCE_VID = {
  pId: null,
  value: 'media_source',
  text: 'media_source',
  cId: 'CAMPAIGN_VID',
  id: 'MEDIA_SOURCE_VID',
};
export const CAMPAIGN_VID = {
  pId: 'MEDIA_SOURCE_VID',
  value: 'campaign_name',
  text: 'campaign_name',
  cId: 'ADSET_VID',
  id: 'CAMPAIGN_VID',
};
export const ADSET_VID = {
  pId: 'CAMPAIGN_VID',
  value: 'adset',
  text: 'adset',
  cId: 'ADNAME',
  id: 'ADSET_VID',
};
export const MEDIA_SOURCE = {
  pId: null,
  value: 'media_source',
  text: 'media_source',
  cId: 'CAMPAIGN',
};
export const CAMPAIGN = {
  pId: 'MEDIA_SOURCE',
  value: 'campaign',
  text: 'campaign',
  cId: 'ADSET',
};

export const tagColors = ['magenta', 'red', 'volcano', 'orange', 'gold'];
export const SOURCE_KEYS_VIVA = [
  {
    value: 'media_source',
    text: 'media_source',
  },
  {
    value: 'campaign_name',
    text: 'campaign',
  },
  {
    value: 'adset',
    text: 'adset',
  },
  {
    value: 'adname',
    text: 'adname',
  },
];
export const vivaMoneyColumns = [
  {
    title: '新增用户',
    dataIndex: 'reg_num',
    key: 'reg_num',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.reg_num - b.reg_num,
  },
  {
    title: '进入付费页',
    dataIndex: 'vip_enter_cnt',
    key: 'vip_enter_cnt',
  },
  {
    title: '试用成功',
    dataIndex: 'trial_paid_cnt',
    key: 'trial_paid_cnt',
  },
  {
    title: '年费用户数',
    dataIndex: 'yearly_paid_cnt',
    key: 'yearly_paid_cnt',
  },
  {
    title: '月费用户数',
    dataIndex: 'monthly_paid_cnt',
    key: 'monthly_paid_cnt',
  },
  {
    title: '其它包人数',
    dataIndex: 'other_paid_cnt',
    key: 'other_paid_cnt',
  },
  {
    title: '目前收入',
    dataIndex: 'amount_total',
    key: 'amount_total',
  },
  // {
  //   title: '实时ROI',
  //   dataIndex: 'trial_paid_cnt/amount_total',
  //   key: 'trial_paid_cnt/amount_total',
  // },
  {
    title: '试用率',
    dataIndex: 'trial_paid_cnt/reg_num',
    key: 'trial_paid_cnt/reg_num',
    render: text => `${text}%`,
  },
  {
    title: '付费率',
    dataIndex: '(yearly_paid_cnt+monthly_paid_cnt+other_paid_cnt)/reg_num',
    key: '(yearly_paid_cnt+monthly_paid_cnt+other_paid_cnt)/reg_num',
    render: text => `${text}%`,
  },
];

export const vivaAllColumns = [
  {
    title: '新增用户',
    dataIndex: 'reg_num',
    key: 'reg_num',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.reg_num - b.reg_num,
  },
  {
    title: '进入付费页',
    dataIndex: 'vip_enter_cnt',
    key: 'vip_enter_cnt',
  },
  {
    title: '试用成功',
    dataIndex: 'trial_paid_cnt',
    key: 'trial_paid_cnt',
  },
  {
    title: '年费用户数',
    dataIndex: 'yearly_paid_cnt',
    key: 'yearly_paid_cnt',
  },
  {
    title: '月费用户数',
    dataIndex: 'monthly_paid_cnt',
    key: 'monthly_paid_cnt',
  },
  {
    title: '其它包人数',
    dataIndex: 'other_paid_cnt',
    key: 'other_paid_cnt',
  },
  {
    title: '目前收入',
    dataIndex: 'amount_total',
    key: 'amount_total',
  },
  // {
  //   title: '实时ROI',
  //   dataIndex: 'trial_paid_cnt/amount_total',
  //   key: 'trial_paid_cnt/amount_total',
  // },
  {
    title: '试用率',
    dataIndex: 'trial_paid_cnt/reg_num',
    key: 'trial_paid_cnt/reg_num',
    render: text => `${text}%`,
  },
  {
    title: '付费率',
    dataIndex: '(yearly_paid_cnt+monthly_paid_cnt+other_paid_cnt)/reg_num',
    key: '(yearly_paid_cnt+monthly_paid_cnt+other_paid_cnt)/reg_num',
    render: text => `${text}%`,
  },
];
