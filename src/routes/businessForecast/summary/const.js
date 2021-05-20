/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-30 16:19:01
 * @LastEditTime: 2020-05-20 13:35:22
 * @LastEditors: ssssslf
 */
// https://quvideo.feishu.cn/sheets/shtcn2bT4OPf6n6IR0IloYmmSkc#295e77

export const OZ_LIST = [
  '芬兰',
  '瑞典',
  '挪威',
  '冰岛',
  '丹麦',
  '法罗群岛',
  '爱沙尼亚',
  '拉脱维亚',
  '立陶宛',
  '白俄罗斯',
  '俄罗斯',
  '乌克兰',
  '摩尔多瓦',
  '波兰',
  '捷克',
  '斯洛伐克',
  '匈牙利',
  '德国',
  '奥地利',
  '瑞士',
  '列支敦士登',
  '英国',
  '爱尔兰',
  '荷兰',
  '比利时',
  '卢森堡',
  '法国',
  '摩纳哥',
  '罗马尼亚',
  '保加利亚',
  '塞尔维亚',
  '马其顿',
  '阿尔巴尼亚',
  '希腊',
  '斯洛文尼亚',
  '克罗地亚',
  '黑山共和国',
  '马耳他',
  '波斯尼亚和黑塞哥维那',
  '意大利',
  '梵蒂冈',
  '圣马力诺',
  '西班牙',
  '葡萄牙',
  '安道尔',
  '直布罗陀',
];

export const OZ_CODE_LIST = [
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FO',
  'FR',
  'GB',
  'AD',
  'AL',
  'AT',
  'BA',
  'BE',
  'BG',
  'BY',
  'CH',
  'UA',
  'VA',
  'PT',
  'RO',
  'RU',
  'SE',
  'SI',
  'SK',
  'SM',
  'GI',
  'GR',
  'HR',
  'HU',
  'IE',
  'RS',
  'NL',
  'NO',
  'PL',
  'IS',
  'IT',
  'LI',
  'LT',
  'LU',
  'LV',
  'MC',
  'MD',
  'MK',
  'MT',
];
export const ZD_CODE_LIST = [
  'DZ',
  'EG',
  'AE',
  'BH',
  'SY',
  'TN',
  'QA',
  'SA',
  'YE',
  'OM',
  'PS',
  'IQ',
  'JO',
  'KW',
  'LB',
  'LY',
  'MA',
];

export const COUNTRY_LISTS = {
  2: {
    CN: '中国',
    US: '美国',
    JP: '日本',
    KR: '韩国',
    TW: '台湾',
    TH: '泰国',
    IN: '印度',
    AU: '澳大利亚',
    TDDDW: '第二三梯队',
  },
  3: {
    CN: '中国',
    US: '美国',
    JP: '日本',
    KR: '韩国',
    TW: '台湾',
    OZ: '欧洲各国',
  },
  10: {
    CN: '中国',
    US: '美国',
    JP: '日本',
    KR: '韩国',
    TW: '台湾',
    OZ: '欧洲各国',
  },
  15: {
    CN: '中国',
    US: '美国',
    BR: '巴西',
    OZ: '欧洲各国',
    OTHER: 'other',
  },
  16: {
    CN: '中国',
    US: '美国',
    JP: '日本',
    KR: '韩国',
    TW: '台湾',
    OZ: '欧洲各国',
    ZD: '中东',
  },
};

export const COUNTRY = {
  CN: '中国',
  US: '美国',
  JP: '日本',
  KR: '韩国',
  TW: '台湾',
  TH: '泰国',
  TDDDW: '第二三梯队',
};

export const DATA_TYPE = {
  1: '全部',
  2: '真实',
  3: '预测',
  4: '真实预测',
};

export const TYPES = {
  1: '保守',
  2: '激进',
};

export const allColumns = [
  { dataIndex: 'country', key: 'country', title: '地区' },
  { dataIndex: 'day', key: 'day', title: '时间' },
  { title: '数据类型' },
];

export const ALL_COLUMNS = [
  { title: '地区', key: 'country', dataIndex: 'country' },
  { title: '时间', key: 'data_time', dataIndex: 'data_time' },
  { title: '数据类型', key: 'type', dataIndex: 'type' },
  {
    title: '订阅销售额（美元）',
    children: [
      {
        title: '销售总额',
        dataIndex: 'amt_total_1d',
        key: 'amt_total_1d',
      },
      {
        title: '安卓销售额',
        dataIndex: 'gp_amt_total_1d',
        key: 'gp_amt_total_1d',
      },
      {
        title: 'IOS销售额',
        dataIndex: 'ios_amt_total_1d',
        key: 'ios_amt_total_1d',
      },
    ],
  },
  {
    title: '付费人数',
    children: [
      { title: '安卓付费人数', dataIndex: 'gp_amt_usr_cnt_1d', key: 'gp_amt_usr_cnt_1d' },
      { title: 'IOS付费人数', dataIndex: 'ios_amt_usr_cnt_1d', key: 'ios_amt_usr_cnt_1d' },
    ],
  },
  {
    title: 'ARPPU',
    children: [
      { title: '安卓 ARPPU', dataIndex: 'gp_arppu', key: 'gp_arppu' },
      { title: 'iOS ARPPU', dataIndex: 'ios_arppu', key: 'ios_arppu' },
    ],
  },
  {
    title: '首购（新增）',
    children: [
      {
        title: '金币充值人数',
        dataIndex: 'anrd_consum_cnt_1d',
        key: 'anrd_consum_cnt_1d',
      },
      { title: 'IOS月包', dataIndex: 'ios_new_month_usr_cnt_1d', key: 'ios_new_month_usr_cnt_1d' },
      { title: 'IOS年包', dataIndex: 'ios_new_year_usr_cnt_1d', key: 'ios_new_year_usr_cnt_1d' },
      { title: '安卓月包', dataIndex: 'gp_new_month_usr_cnt_1d', key: 'gp_new_month_usr_cnt_1d' },
      { title: '安卓年包', dataIndex: 'gp_new_year_usr_cnt_1d', key: 'gp_new_year_usr_cnt_1d' },
    ],
  },
  {
    title: '续购',
    children: [
      { title: 'IOS月续', dataIndex: 'ios_old_month_usr_cnt_1d', key: 'ios_old_month_usr_cnt_1d' },
      { title: 'IOS年续', dataIndex: 'ios_old_year_usr_cnt_1d', key: 'ios_old_year_usr_cnt_1d' },
      { title: '安卓月续', dataIndex: 'gp_old_month_usr_cnt_1d', key: 'gp_old_month_usr_cnt_1d' },
      { title: '安卓年续', dataIndex: 'gp_old_year_usr_cnt_1d', key: 'gp_old_year_usr_cnt_1d' },
    ],
  },
  {
    title: '首购率',
    children: [
      { title: '月包付费率-安卓', dataIndex: 'gp_new_month_rate', key: 'gp_new_month_rate' },
      { title: '年包付费率-安卓', dataIndex: 'gp_new_year_rate', key: 'gp_new_year_rate' },
      { title: '月包付费率-iOS', dataIndex: 'ios_new_month_rate', key: 'ios_new_month_rate' },
      { title: '年包付费率-iOS', dataIndex: 'ios_new_year_rate', key: 'ios_new_year_rate' },
    ],
  },
  {
    title: '月续购率',
    children: [
      { title: '安卓月续购率', dataIndex: 'gp_sub_month_rate', key: 'gp_sub_month_rate' },
      { title: 'iOS月续购率', dataIndex: 'ios_sub_month_rate', key: 'ios_sub_month_rate' },
    ],
  },
  {
    title: '月新增',
    children: [
      { title: '总安卓新增', dataIndex: 'gp_new_usr_cnt_1d', key: 'gp_new_usr_cnt_1d' },
      { title: '总IOS新增', dataIndex: 'ios_new_usr_cnt_1d', key: 'ios_new_usr_cnt_1d' },
      { title: '自然安卓新增', dataIndex: 'zr_gp_new_usr_cnt', key: 'zr_gp_new_usr_cnt' },
      { title: '自然IOS新增', dataIndex: 'zr_ios_new_usr_cnt', key: 'zr_ios_new_usr_cnt' },
      { title: '投放安卓新增', dataIndex: 'tf_gp_new_usr_cnt', key: 'tf_gp_new_usr_cnt' },
      { title: '投放IOS新增', dataIndex: 'tf_ios_new_usr_cnt', key: 'tf_ios_new_usr_cnt' },
    ],
  },
];

export const NOT_CN_COLUMNS = [
  { title: '地区', key: 'country', dataIndex: 'country' },
  { title: '时间', key: 'data_time', dataIndex: 'data_time' },
  { title: '数据类型', key: 'type', dataIndex: 'type' },
  {
    title: '订阅销售额',
    children: [
      { title: '销售总额', dataIndex: 'amt_total_1d', key: 'amt_total_1d' },
      { title: 'GP销售额', dataIndex: 'gp_amt_total_1d', key: 'gp_amt_total_1d' },
      { title: 'IOS销售额', dataIndex: 'ios_amt_total_1d', key: 'ios_amt_total_1d' },
    ],
  },
  {
    title: '付费人数',
    children: [
      { title: '安卓付费人数', dataIndex: 'gp_amt_usr_cnt_1d', key: 'gp_amt_usr_cnt_1d' },
      { title: 'IOS付费人数', dataIndex: 'ios_amt_usr_cnt_1d', key: 'ios_amt_usr_cnt_1d' },
    ],
  },
  {
    title: 'ARPPU',
    children: [
      { title: '安卓 ARPPU', dataIndex: 'gp_arppu', key: 'gp_arppu' },
      { title: 'iOS ARPPU', dataIndex: 'ios_arppu', key: 'ios_arppu' },
    ],
  },
  {
    title: '首购（新增）',
    children: [
      { title: 'GP月包', dataIndex: 'gp_new_month_usr_cnt_1d', key: 'gp_new_month_usr_cnt_1d' },
      { title: 'GP年包', dataIndex: 'gp_new_year_usr_cnt_1d', key: 'gp_new_year_usr_cnt_1d' },
      { title: 'IOS月包', dataIndex: 'ios_new_month_usr_cnt_1d', key: 'ios_new_month_usr_cnt_1d' },
      { title: 'IOS年包', dataIndex: 'ios_new_year_usr_cnt_1d', key: 'ios_new_year_usr_cnt_1d' },
    ],
  },
  {
    title: '续购',
    children: [
      { title: 'GP月续', dataIndex: 'gp_old_month_usr_cnt_1d', key: 'gp_old_month_usr_cnt_1d' },
      { title: 'GP年续', dataIndex: 'gp_old_year_usr_cnt_1d', key: 'gp_old_year_usr_cnt_1d' },
      { title: 'IOS月续', dataIndex: 'ios_old_month_usr_cnt_1d', key: 'ios_old_month_usr_cnt_1d' },
      { title: 'IOS年续', dataIndex: 'ios_old_year_usr_cnt_1d', key: 'ios_old_year_usr_cnt_1d' },
    ],
  },
  {
    title: '首购率',
    children: [
      { title: 'GP月包付费率', dataIndex: 'gp_new_month_rate', key: 'gp_new_month_rate' },
      { title: 'GP年包付费率', dataIndex: 'gp_new_year_rate', key: 'gp_new_year_rate' },
      { title: 'IOS月包付费率', dataIndex: 'ios_new_month_rate', key: 'ios_new_month_rate' },
      { title: 'IOS年包付费率', dataIndex: 'ios_new_year_rate', key: 'ios_new_year_rate' },
    ],
  },
  {
    title: '月续购率',
    children: [
      { title: 'GP月续购率', dataIndex: 'gp_sub_month_rate', key: 'gp_sub_month_rate' },
      { title: 'iOS月续购率', dataIndex: 'ios_sub_month_rate', key: 'ios_sub_month_rate' },
    ],
  },
  {
    title: '月新增',
    children: [
      { title: '总GP新增', dataIndex: 'gp_new_usr_cnt_1d', key: 'gp_new_usr_cnt_1d' },
      { title: '总IOS新增', dataIndex: 'ios_new_usr_cnt_1d', key: 'ios_new_usr_cnt_1d' },
      { title: '自然GP新增', dataIndex: 'zr_gp_new_usr_cnt', key: 'zr_gp_new_usr_cnt' },
      { title: '自然IOS新增', dataIndex: 'zr_ios_new_usr_cnt', key: 'zr_ios_new_usr_cnt' },
      { title: '投放GP新增', dataIndex: 'tf_gp_new_usr_cnt', key: 'tf_gp_new_usr_cnt' },
      { title: '投放IOS新增', dataIndex: 'tf_ios_new_usr_cnt', key: 'tf_ios_new_usr_cnt' },
    ],
  },
];

export const CN_COLUMNS = [
  { title: '地区', key: 'country', dataIndex: 'country' },
  { title: '时间', key: 'data_time', dataIndex: 'data_time' },
  { title: '数据类型', key: 'type', dataIndex: 'type' },
  {
    title: '订阅销售额',
    children: [
      { title: '销售总额', dataIndex: 'amt_total_1d', key: 'amt_total_1d' },
      { title: '安卓销售额', dataIndex: 'gp_amt_total_1d', key: 'gp_amt_total_1d' },
      { title: 'IOS销售额', dataIndex: 'ios_amt_total_1d', key: 'ios_amt_total_1d' },
    ],
  },
  {
    title: '付费人数',
    children: [
      { title: '安卓付费人数', dataIndex: 'gp_amt_usr_cnt_1d', key: 'gp_amt_usr_cnt_1d' },
      { title: 'IOS付费人数', dataIndex: 'ios_amt_usr_cnt_1d', key: 'ios_amt_usr_cnt_1d' },
    ],
  },
  {
    title: 'ARPPU',
    children: [
      { title: '安卓 ARPPU', dataIndex: 'gp_arppu', key: 'gp_arppu' },
      { title: 'iOS ARPPU', dataIndex: 'ios_arppu', key: 'ios_arppu' },
    ],
  },
  {
    title: '首购（新增）',
    children: [
      { title: '单次购买-首购-月包', dataIndex: 'anrd_one_new_month_usr_cnt_1d', key: 'anrd_one_new_month_usr_cnt_1d' },
      { title: '自动续订-首购-月包', dataIndex: 'anrd_sub_new_month_usr_cnt_1d', key: 'anrd_sub_new_month_usr_cnt_1d' },
      { title: '单次购买-首购-年包', dataIndex: 'anrd_one_new_year_usr_cnt_1d', key: 'anrd_one_new_year_usr_cnt_1d' },
      { title: 'IOS月包', dataIndex: 'ios_new_month_usr_cnt_1d', key: 'ios_new_month_usr_cnt_1d' },
      { title: 'IOS年包', dataIndex: 'ios_new_year_usr_cnt_1d', key: 'ios_new_year_usr_cnt_1d' },
    ],
  },
  {
    title: '续购',
    children: [
      { title: '单次购买-续购-月包', dataIndex: 'anrd_one_old_month_usr_cnt_1d', key: 'anrd_one_old_month_usr_cnt_1d' },
      { title: '自动续订-续购-月包', dataIndex: 'anrd_sub_old_month_usr_cnt_1d', key: 'anrd_sub_old_month_usr_cnt_1d' },
      { title: '单次购买-续购-年包', dataIndex: 'anrd_one_old_year_usr_cnt_1d', key: 'anrd_one_old_year_usr_cnt_1d' },
      { title: 'IOS月续', dataIndex: 'ios_old_month_usr_cnt_1d', key: 'ios_old_month_usr_cnt_1d' },
      { title: 'IOS年续', dataIndex: 'ios_old_year_usr_cnt_1d', key: 'ios_old_year_usr_cnt_1d' },
    ],
  },
  {
    title: '首购率',
    children: [
      { title: '安卓-自动续订-月包转化率', dataIndex: 'and_month_rate', key: 'and_month_rate' },
      { title: 'IOS-月包转化率', dataIndex: 'ios_new_month_rate', key: 'ios_new_month_rate' },
      { title: 'IOS-年包转化率', dataIndex: 'ios_new_year_rate', key: 'ios_new_year_rate' },
    ],
  },
  {
    title: '月续购率',
    children: [
      { title: '安卓-自动续订-月续订率', dataIndex: 'and_sub_old_month_rate', key: 'and_sub_old_month_rate' },
      { title: 'iOS月续购率', dataIndex: 'ios_sub_month_rate', key: 'ios_sub_month_rate' },
    ],
  },
  {
    title: '月新增',
    children: [
      { title: '总安卓新增', dataIndex: 'anrd_new_usr_cnt_1d', key: 'anrd_new_usr_cnt_1d' },
      { title: '总IOS新增', dataIndex: 'ios_new_usr_cnt_1d', key: 'ios_new_usr_cnt_1d' },
      { title: '自然安卓新增', dataIndex: 'zr_and_new_usr_cnt', key: 'zr_and_new_usr_cnt' },
      { title: '自然IOS新增', dataIndex: 'zr_ios_new_usr_cnt', key: 'zr_ios_new_usr_cnt' },
      { title: '投放安卓新增', dataIndex: 'tf_and_new_usr_cnt', key: 'tf_and_new_usr_cnt' },
      { title: '投放IOS新增', dataIndex: 'tf_ios_new_usr_cnt', key: 'tf_ios_new_usr_cnt' },
    ],
  },
];

export const APP_PRODUCT_LIST = {
  2: 'VivaVideo',
  3: 'SlidePlus',
  // 6: 'vid',
  10: 'Tempo',
  15: 'VivaCut',
  16: 'VivaMini',
};
