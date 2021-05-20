/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-30 16:19:01
 * @LastEditTime: 2020-04-28 20:51:12
 * @LastEditors: ssssslf
 */
import moment from 'moment';
import { getConfigList } from '../services/index';
import { getNumber } from '../../../utils/utils';

export const COUNTRY = {
  CN: '中国',
  US: '美国',
  JP: '日本',
  KR: '韩国',
  TW: '台湾',
  TH: '泰国',
  TDDDW: '第二三梯队',
};
export const COUNTRY1 = ['CN', 'US', 'JP', 'KR', 'TW', 'TH'];

export const TDDDW = [
  'MY',
  'CY',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GB',
  'GD',
  'AE',
  'AG',
  'AR',
  'AT',
  'AU',
  'AW',
  'BB',
  'BE',
  'BH',
  'BN',
  'BS',
  'CA',
  'CH',
  'CL',
  'CR',
  'TT',
  'UY',
  'PT',
  'PW',
  'QA',
  'RO',
  'RU',
  'SA',
  'SC',
  'SE',
  'SG',
  'SI',
  'SK',
  'GR',
  'HK',
  'HR',
  'HU',
  'IE',
  'IL',
  'MO',
  'NL',
  'NO',
  'NZ',
  'OM',
  'PA',
  'PL',
  'PR',
  'IS',
  'IT',
  'KN',
  'KW',
  'LC',
  'LT',
  'LU',
  'LV',
  'MT',
  'MU',
];

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
      { title: '销售总额', dataIndex: 'amt_total_1d', key: 'amt_total_1d' },
      { title: 'GP销售额', dataIndex: 'gp_amt_total_1d', key: 'gp_amt_total_1d' },
      { title: 'IOS销售额', dataIndex: 'ios_amt_total_1d', key: 'ios_amt_total_1d' },
    ],
  },
  {
    title: '付费人数',
    children: [
      { title: 'GP付费人数', dataIndex: 'gp_amt_usr_cnt_1d', key: 'gp_amt_usr_cnt_1d' },
      { title: 'IOS付费人数', dataIndex: 'ios_amt_usr_cnt_1d', key: 'ios_amt_usr_cnt_1d' },
    ],
  },
  {
    title: 'ARPPU',
    children: [
      { title: 'GP ARPPU', dataIndex: 'gp_arppu', key: 'gp_arppu' },
      { title: 'iOS ARPPU', dataIndex: 'ios_arppu', key: 'ios_arppu' },
    ],
  },
  {
    title: '首购（新增）',
    children: [
      { title: 'IOS月包', dataIndex: 'ios_new_month_usr_cnt_1d', key: 'ios_new_month_usr_cnt_1d' },
      { title: 'IOS年包', dataIndex: 'ios_new_year_usr_cnt_1d', key: 'ios_new_year_usr_cnt_1d' },
      { title: 'GP月包', dataIndex: 'gp_new_month_usr_cnt_1d', key: 'gp_new_month_usr_cnt_1d' },
      { title: 'GP年包', dataIndex: 'gp_new_year_usr_cnt_1d', key: 'gp_new_year_usr_cnt_1d' },
    ],
  },
  {
    title: '续购',
    children: [
      { title: 'IOS月续', dataIndex: 'ios_old_month_usr_cnt_1d', key: 'ios_old_month_usr_cnt_1d' },
      { title: 'IOS年续', dataIndex: 'ios_old_year_usr_cnt_1d', key: 'ios_old_year_usr_cnt_1d' },
      { title: 'GP月续', dataIndex: 'gp_old_month_usr_cnt_1d', key: 'gp_old_month_usr_cnt_1d' },
      { title: 'GP年续', dataIndex: 'gp_old_year_usr_cnt_1d', key: 'gp_old_year_usr_cnt_1d' },
    ],
  },
  {
    title: '首购率',
    children: [
      { title: '月包付费率-GP', dataIndex: 'gp_new_month_rate', key: 'gp_new_month_rate' },
      { title: '年包付费率-GP', dataIndex: 'gp_new_year_rate', key: 'gp_new_year_rate' },
      { title: '月包付费率-iOS', dataIndex: 'ios_new_month_rate', key: 'ios_new_month_rate' },
      { title: '年包付费率-iOS', dataIndex: 'ios_new_year_rate', key: 'ios_new_year_rate' },
    ],
  },
  {
    title: '月新增',
    children: [
      { title: '投放GP新增', dataIndex: 'gp_new_usr_cnt_1d', key: 'gp_new_usr_cnt_1d' },
      { title: '投放IOS新增', dataIndex: 'ios_new_usr_cnt_1d', key: 'ios_new_usr_cnt_1d' },
    ],
  },
];

export const NOT_CN_COLUMNS = [
  { title: '地区', key: 'country', dataIndex: 'country' },
  { title: '时间', key: 'data_time', dataIndex: 'data_time' },
  { title: '数据类型', key: 'type', dataIndex: 'type' },
  {
    title: '首购率',
    children: [
      { title: 'GP月首购率', dataIndex: 'gp_new_month_rate', key: 'gp_new_month_rate' },
      { title: 'GP年首购率', dataIndex: 'gp_new_year_rate', key: 'gp_new_year_rate' },
      { title: 'IOS月首购率', dataIndex: 'ios_new_month_rate', key: 'ios_new_month_rate' },
      { title: 'IOS年首购率', dataIndex: 'ios_new_year_rate', key: 'ios_new_year_rate' },
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
    title: '月续购率',
    children: [
      { title: 'GP月续购率', dataIndex: 'gp_sub_month_rate', key: 'gp_sub_month_rate' },
      { title: 'iOS月续购率', dataIndex: 'ios_sub_month_rate', key: 'ios_sub_month_rate' },
    ],
  },
  {
    title: '安卓新增',
    children: [{ title: 'GP总新增', dataIndex: 'gp_new_usr_cnt_1d', key: 'gp_new_usr_cnt_1d' }],
  },
  {
    title: 'IOS新增',
    children: [{ title: 'IOS总新增', dataIndex: 'ios_new_usr_cnt_1d', key: 'ios_new_usr_cnt_1d' }],
  },
  {
    title: '总收入、总消耗',
    children: [
      { title: 'GP总收入', dataIndex: 'gp_amt_total_1d', key: 'gp_amt_total_1d' },
      { title: 'GP总消耗', dataIndex: 'gp_cost_total_1d', key: 'gp_cost_total_1d' },
      { title: 'IOS总收入', dataIndex: 'ios_amt_total_1d', key: 'ios_amt_total_1d' },
      { title: 'IOS总消耗', dataIndex: 'ios_cost_total_1d', key: 'ios_cost_total_1d' },
    ],
  },
  {
    title: '月收、年收',
    children: [
      { title: 'GP月收入', dataIndex: 'gp_month_amt_total_1d', key: 'gp_month_amt_total_1d' },
      { title: 'GP年收入', dataIndex: 'gp_year_amt_total_1d', key: 'gp_year_amt_total_1d' },
      { title: 'iOS月收入', dataIndex: 'ios_month_amt_total_1d', key: 'ios_month_amt_total_1d' },
      { title: 'IOS年收入', dataIndex: 'ios_year_amt_total_1d', key: 'ios_year_amt_total_1d' },
    ],
  },
  {
    title: 'arpu',
    children: [
      { title: 'gp-arpu', dataIndex: 'gp_arpu', key: 'gp_arpu' },
      { title: 'ios-arpu', dataIndex: 'ios_arpu', key: 'ios_arpu' },
    ],
  },
];

export const CN_COLUMNS = [
  { title: '地区', key: 'country', dataIndex: 'country' },
  { title: '时间', key: 'data_time', dataIndex: 'data_time' },
  { title: '数据类型', key: 'type', dataIndex: 'type' },
  {
    title: '付费率',
    children: [
      { title: '安卓自动续订-月包转化率(%)', dataIndex: 'and_amt_new_user_rate', key: 'and_amt_new_user_rate' },
      { title: 'IOS月付费率(%)', dataIndex: 'ios_new_month_rate', key: 'ios_new_month_rate' },
      { title: 'IOS年付费率(%)', dataIndex: 'ios_new_year_rate', key: 'ios_new_year_rate' },
    ],
  },
  {
    title: '首购（新增）',
    children: [
      { title: '自动续订-首购-月包', dataIndex: 'anrd_sub_new_month_usr_cnt_1d', key: 'anrd_sub_new_month_usr_cnt_1d' },
      {
        title: '安卓单次购买-首购月包',
        dataIndex: 'anrd_one_new_month_usr_cnt_1d',
        key: 'anrd_one_new_month_usr_cnt_1d',
      },
      {
        title: '安卓单次购买-首购年包',
        dataIndex: 'anrd_one_new_year_usr_cnt_1d',
        key: 'anrd_one_new_year_usr_cnt_1d',
      },
      { title: 'IOS月首购', dataIndex: 'ios_new_month_usr_cnt_1d', key: 'ios_new_month_usr_cnt_1d' },
      { title: 'IOS年首购', dataIndex: 'ios_new_year_usr_cnt_1d', key: 'ios_new_year_usr_cnt_1d' },
    ],
  },
  {
    title: '续购',
    children: [
      {
        title: '自动续订-续购-月包',
        dataIndex: 'anrd_sub_old_month_usr_cnt_1d',
        key: 'anrd_sub_old_month_usr_cnt_1d',
      },
      {
        title: '安卓单次购买-续购-月包',
        dataIndex: 'anrd_one_old_month_usr_cnt_1d',
        key: 'anrd_one_old_month_usr_cnt_1d',
      },
      {
        title: '安卓单次购买-续购-年包',
        dataIndex: 'anrd_one_old_year_usr_cnt_1d',
        key: 'anrd_one_old_year_usr_cnt_1d',
      },
      { title: 'IOS月续', dataIndex: 'ios_old_month_usr_cnt_1d', key: 'ios_old_month_usr_cnt_1d' },
      { title: 'IOS年续', dataIndex: 'ios_old_year_usr_cnt_1d', key: 'ios_old_year_usr_cnt_1d' },
    ],
  },
  {
    title: '月续购率',
    children: [
      { title: '安卓续订月续购率(%)', dataIndex: 'and_sub_old_month_rate', key: 'and_sub_old_month_rate' },
      { title: 'iOS月续购率(%)', dataIndex: 'ios_sub_month_rate', key: 'ios_sub_month_rate' },
    ],
  },
  {
    title: '新增',
    children: [
      { title: '安卓总新增', dataIndex: 'anrd_new_usr_cnt_1d', key: 'anrd_new_usr_cnt_1d' },
      { title: 'IOS总新增', dataIndex: 'ios_new_usr_cnt_1d', key: 'ios_new_usr_cnt_1d' },
    ],
  },
  {
    title: '总收入、总消耗',
    children: [
      { title: '安卓总收入', dataIndex: 'anrd_amt_total_1d', key: 'anrd_amt_total_1d' },
      { title: '安卓总消耗', dataIndex: 'anrd_cost_total_1d', key: 'anrd_cost_total_1d' },
      { title: 'IOS总收入', dataIndex: 'ios_amt_total_1d', key: 'ios_amt_total_1d' },
      { title: 'IOS总消耗', dataIndex: 'ios_cost_total_1d', key: 'ios_cost_total_1d' },
      { title: '安卓月收入', dataIndex: 'anrd_month_amt_total_1d', key: 'anrd_month_amt_total_1d' },
      { title: 'IOS月收入', dataIndex: 'ios_month_amt_total_1d', key: 'ios_month_amt_total_1d' },
      { title: '安卓年收入', dataIndex: 'anrd_year_amt_total_1d', key: 'anrd_year_amt_total_1d' },
      { title: 'IOS年收入', dataIndex: 'ios_year_amt_total_1d', key: 'ios_year_amt_total_1d' },
    ],
  },
  {
    title: 'arpu',
    children: [
      { title: '安卓-arpu', dataIndex: 'anrd_arpu', key: 'anrd_arpu' },
      { title: 'IOS-arpu', dataIndex: 'ios_arpu', key: 'ios_arpu' },
    ],
  },
];

const add = (num1, num2) => Number(num1) + Number(num2);
const multip = (num1, num2) => Number(num1) * Number(num2);

const B3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return organicRes.month_rate_gp || 0;
};

const N3 = (organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return organicRes.month_renewal_gp;
};
const O3 = (organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return organicRes.month_renewal_ios;
};

const P3 = (row, country) => {
  if (country === '中国') {
    return 0;
  }
  return row.put_organic_arpu_ios;
};
const Q3 = (row, country) => {
  if (country === '中国') {
    return 0;
  }
  return row.put_organic_arpu_gp;
};

const S3 = row => row.search_new_gp || 0;
const T3 = row => row.other_new_gp || 0;
// S3+T3
const R3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return Number(T3(row)) + Number(S3(row));
};
// B3*R3
const F3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return Number(B3(row, organicRes)) * Number(R3(row, organicRes));
};
const B10 = (row, organicRes) => organicRes.year_conversion_and;
const S10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return row.all_new_and;
  }
  return 0;
};
const U10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return row.cpa_and;
  }
  return 0;
};
const V10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return row.cpa_ios;
  }
  return 0;
};
// B10*S10
const E10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return Number(B10(row, organicRes, country)) * Number(S10(row, organicRes, country));
  }
  return 0;
};
const F10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return row.month_first;
  }
  return 0;
};
// F3+E10+F10
// const K17 = (row, organicRes, country) => Number(F3(row, organicRes, country)) + Number(E10(row, organicRes, country)) + Number(F10(row, organicRes, country));

const G10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return row.year_first;
  }
  return 0;
};
const O10 = (organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.month_renewal_and;
  }
  return 0;
};
const P10 = (organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.month_order_rate_ios;
  }
  return 0;
};

const C3 = (organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return organicRes.year_rate_ios;
};
const AT3 = row => row.calculation_first_purchase;
// C3*R3*AT3
const G3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return Number(C3(organicRes)) * Number(R3(row)) * Number(AT3(row));
};
// // R3+S10
// const U17 = (row, organicRes, country) => add(R3(row, organicRes, country), S10(row, organicRes, country));
// // G3+G10
// const L17 = (row, organicRes, country) => add(G3(row, organicRes, country), G10(row, organicRes, country));
// // // L17/U17
// const R17 = (row, organicRes, country) => getNumber(L17(row, organicRes, country), U17(row, organicRes, country), false);

// // K17/U17
// const Q17 = (row, organicRes, country) => getNumber(K17(row, organicRes, country), U17(row, organicRes, country), false);

const D3 = organicRes => organicRes.month_rate_ios || 0;

const V3 = row => row.search_ios;
const W3 = row => row.other_ios;

// V3+W3
const U3 = (row, country) => {
  if (country === '中国') {
    return 0;
  }
  return add(V3(row), W3(row));
};
// D3*U3
const H3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return multip(D3(organicRes), U3(row, country));
};
const C10 = organicRes => organicRes.month_conversion_ios;
const T10 = (row, country) => {
  if (country === '中国' || !country) {
    return row.all_new_ios;
  }
  return 0;
};
// C10*T10
const H10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return multip(C10(organicRes), T10(row, country));
  }
  return 0;
};

const E3 = organicRes => organicRes.year_rate_ios;
const L3 = (row, country) => {
  if (country === '中国') {
    return 0;
  }
  return row.month_init_ios;
};

const N10 = (row, country) => {
  if (country === '中国' || !country) {
    return row.month_init_ios;
  }
  return 0;
};
// E3*U3*AT3
const I3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return Number(E3(organicRes)) * Number(U3(row, country)) * Number(AT3(row));
};
const D10 = organicRes => organicRes.year_conversion_ios;

// D10*T10
const I10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return multip(D10(organicRes), T10(row, country));
  }
  return 0;
};

const M3 = (row, country) => {
  if (country === '中国') {
    return 0;
  }
  return row.year_renewal_ios;
};

const M10 = (row, country) => {
  if (country === '中国' || !country) {
    return row.year_renewal_ios;
  }
  return 0;
};
const J10 = (row, country) => {
  if (country === '中国' || !country) {
    return row.month_init_and;
  }
  return 0;
};
const K10 = (row, country) => {
  if (country === '中国' || !country) {
    return row.month_renewal;
  }
  return 0;
};
const J3 = (row, country) => {
  if (country === '中国') {
    return 0;
  }
  return row.month_init_gp;
};
const K3 = (row, country) => {
  if (country === '中国' || !country) {
    return row.year_renewal_gp;
  }
  return 0;
};
const L10 = (row, country) => {
  if (country === '中国' || !country) {
    return row.year_renewal;
  }
  return 0;
};
// H3+H10
// const I17 = (row, organicRes, country) => add(H3(row, organicRes, country), H10(row, organicRes, country));

// // I3+I10
// const J17 = (row, organicRes, country) => add(I3(row, organicRes, country), I10(row, organicRes, country));

// // U3+T10
// const V17 = (row, organicRes, country) => add(U3(row, country), T10(row, country));

// // I17/V17
// const S17 = (row, organicRes, country) => getNumber(I17(row, organicRes, country), V17(row, organicRes, country), false);

// // J17/V17
// const T17 = (row, organicRes, country) => getNumber(J17(row, organicRes, country), V17(row, organicRes, country), false);

// // J3+J10+K10
// const O17 = (row, country) => add(add(J3(row, country), J10(row, country)), K10(row, country));
// // M3+M10
// const N17 = (row, country) => add(M3(row, country), M10(row, country));
// // L3+N10
// const M17 = (row, country) => add(L3(row, country), N10(row, country));
// // K3+L10
// const P17 = (row, country) => add(K3(row, country), L10(row, country));

// "（【中国自然预测配置】（首购-单次购买）-
// 首购月包*【中国自然预测配置】（单价）-单次购买-月单价-安卓+
// 「自然渠道」-自动续订-首购-月包*【中国自然预测配置】（单价）-月自动续订-月单价-安卓）/【中国自然预测配置】（新增）-月新增-安卓"
const AM10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.month_new_and
      ? (Number(organicRes.month_first) * Number(organicRes.month_pay_once_and)
          + Number(organicRes.year_conversion_and)
            * Number(organicRes.month_new_and)
            * Number(organicRes.month_renewal_unit_and))
          / Number(organicRes.month_new_and)
      : 0;
  }
  return 0;
};
// 【中国自然预测配置】（单价）-月自动续订-月单价-安卓
const AI10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.month_renewal_unit_and;
  }
  return 0;
};
// 【中国自然预测配置】（单价）-单次购买-月单价-安卓
const AG10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.month_pay_once_and;
  }
  return 0;
};
const Q10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return row.put_organic_arpu_gp;
  }
  return 0;
};
const R10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return row.put_organic_arpu_ios;
  }
  return 0;
};
// (S*AM*Q+J*AI)*Q+K*AG
const AA10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return (
      Number(S10(row, organicRes, country) * AM10(row, organicRes, country) * Q10(row, organicRes, country))
      + Number(J10(row, country) * AI10(row, organicRes, country))
      + Number(K10(row, country) * AG10(row, organicRes, country))
    );
  }
  return 0;
};

// 【中国自然预测配置】（单价）-单次购买-年单价-安卓
const AH10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.year_pay_once_and;
  }
  return 0;
};

// "【中国自然预测配置】（首购-单次购买）-
// 首购年包
//* 【中国自然预测配置】（单价）-单次购买-年单价-安卓/【中国自然预测配置】（新增）-月新增-安卓"
const AL10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.month_new_and
      ? (Number(organicRes.month_first) * Number(organicRes.year_pay_once_and)) / Number(organicRes.month_new_and)
      : 0;
  }
  return 0;
};
// S*U
const X10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return multip(S10(row, organicRes, country), U10(row, organicRes, country));
  }
  return 0;
};

// L*AH*Q+AL*Q*S
const AB10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return (
      Number(L10(row, country) * AH10(row, organicRes, country) * Q10(row, organicRes, country))
      + Number(AL10(row, organicRes, country)) * Q10(row, organicRes, country) * S10(row, organicRes, country)
    );
  }
  return 0;
};
// AA10+AB10
const W10 = (row, organicRes, country) => add(AA10(row, organicRes, country), AB10(row, organicRes, country));

const AJ10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.month_unit_ios;
  }
  return 0;
};

// 「中国自然渠道」-首购（新增）-iOS月包*【中国自然预测配置】（单价）-月单价-IOS/【自然预测配置】（新增）-月新增-iOS
const AO10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.month_new_ios
      ? (Number(organicRes.month_conversion_ios)
          * Number(organicRes.month_new_ios)
          * Number(organicRes.month_unit_ios))
          / Number(organicRes.month_new_ios)
      : 0;
  }
  return 0;
};
// AJ10*N10*R10+AO10*R10*T10
const AC10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return (
      Number(AJ10(row, organicRes, country) * N10(row, country) * R10(row, organicRes, country))
      + Number(AO10(row, organicRes, country) * R10(row, organicRes, country) * T10(row, country))
    );
  }
  return 0;
};

const AK10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.year_unit_ios;
  }
  return 0;
};

const AN10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return organicRes.month_new_ios
      ? (Number(organicRes.month_new_ios) * Number(organicRes.year_conversion_ios) * Number(organicRes.year_unit_ios))
          / Number(organicRes.month_new_ios)
      : 0;
  }
  return 0;
};

// AK10*M10*R10+AN10*R10*T10
const AD10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return (
      Number(AK10(row, organicRes, country) * M10(row, country) * R10(row, organicRes, country))
      + Number(AN10(row, organicRes, country)) * R10(row, organicRes, country) * T10(row, country)
    );
  }
  return 0;
};

// AC+AD
const Y10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return add(AC10(row, organicRes, country), AD10(row, organicRes, country));
  }
  return 0;
};
// T*V
export const Z10 = (row, organicRes, country) => {
  if (country === '中国' || !country) {
    return multip(T10(row, country), V10(row, organicRes, country));
  }
  return 0;
};

// 「自然渠道」-首购（新增）-GP月包*【自然预测配置】（单价）-月单价-GP/【自然预测配置】（新增）-月新增-GP
const AQ3 = (organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return Number(organicRes.month_new_gp)
    ? (Number(organicRes.month_rate_gp) * Number(organicRes.month_new_gp) * Number(organicRes.month_unit_gp))
        / Number(organicRes.month_new_gp)
    : 0;
};
const AP3 = (organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return Number(organicRes.month_new_gp)
    ? (Number(organicRes.year_rate_gp) * Number(organicRes.month_new_gp) * Number(organicRes.year_unit_gp))
        / Number(organicRes.month_new_gp)
    : 0;
};

const AL3 = organicRes => organicRes.month_unit_gp;
const AN3 = organicRes => organicRes.year_unit_gp;
// AL*J*Q+AQ*Q*R
const AF3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return (
    Number(AL3(organicRes) * J3(row, country) * Q3(row, country))
    + Number(AQ3(organicRes, country) * Q3(row, country) * R3(row, organicRes, country))
  );
};
// AN*K*Q+AP*Q*R
const AG3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return (
    Number(AN3(organicRes) * K3(row, country) * Q3(row, country))
    + Number(AP3(organicRes, country) * Q3(row, country) * R3(row, country))
  );
};
// AF3+AG3
const AB3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return add(AF3(row, organicRes, country), AG3(row, organicRes, country));
};
const AM3 = organicRes => organicRes.month_unit_ios;
const AO3 = organicRes => organicRes.year_unit_ios;
// 「自然渠道」-首购（新增）-iOS月包*【自然预测配置】（单价）-月单价-iOS/【自然预测配置】（新增）-月新增-iOS
const AS3 = (row, organicRes) => (Number(organicRes.month_new_ios || 0)
  ? (Number(organicRes.month_rate_ios || 0) * Number(organicRes.month_new_ios) * Number(organicRes.month_unit_ios))
      / Number(organicRes.month_new_ios)
  : 0);
// AM*L*P+AS*P*U
const AH3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return (
    Number(AM3(organicRes) * L3(row, country) * P3(row, country))
    + Number(AS3(row, organicRes) * P3(row, country) * U3(row, country))
  );
};
const AR3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return Number(organicRes.month_new_ios)
    ? (Number(organicRes.year_rate_ios) * Number(organicRes.month_new_ios) * Number(organicRes.year_unit_ios))
        / Number(organicRes.month_new_ios)
    : 0;
};
// AO*M*P+AR*P*U
const AI3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return (
    Number(AO3(organicRes) * M3(row, country) * P3(row, country))
    + Number(AR3(row, organicRes, country) * P3(row, country) * U3(row, country))
  );
};
const X3 = row => row.search_gp;
const Y3 = row => row.other_gp;
const Z3 = row => row.search_ios;
const AA3 = row => row.other_ios;
// AH+AI
const AD3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return add(AH3(row, organicRes, country), AI3(row, organicRes, country));
};
// V*Z+W*AA
const AE3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return add(multip(V3(row), Z3(row)), multip(W3(row), AA3(row)));
};

// S*X+T*Y
const AC3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return Number(S3(row) * X3(row)) + Number(T3(row) * Y3(row));
};

const AJ3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return getNumber(AB3(row, organicRes, country), R3(row, organicRes, country), false);
};
const AK3 = (row, organicRes, country) => {
  if (country === '中国') {
    return 0;
  }
  return getNumber(AD3(row, organicRes, country), U3(row, organicRes, country), false);
};

const getCnData = async (arr, country, type, data_time, data) => {
  const organicData = await getConfigList({
    country,
    channel: 1,
    type,
    startDate: moment(`${data_time}01`).format('YYYYMM'),
    endDate: moment(`${data_time}01`).format('YYYYMM'),
  });
  const organicRes = organicData.data.length ? organicData.data[0] : {};
  if (data.length) {
    const row = data[0];
    arr.and_amt_new_user_rate = B10(row, organicRes);
    arr.ios_amt_new_user_month_rate = C10(organicRes);
    arr.ios_amt_new_user_year_rate = D10(organicRes);
    arr.anrd_sub_new_month_usr_cnt_1d = E10(row, organicRes, country);
    arr.anrd_one_new_month_usr_cnt_1d = F10(row);
    arr.anrd_one_new_year_usr_cnt_1d = G10(row);
    arr.ios_new_month_usr_cnt_1d = H10(row, organicRes, country);
    arr.ios_new_year_usr_cnt_1d = I10(row, organicRes, country);
    arr.anrd_one_old_month_usr_cnt_1d = J10(row, country);
    arr.anrd_sub_old_month_usr_cnt_1d = K10(row, country);
    arr.anrd_one_old_year_usr_cnt_1d = L10(row, country);
    arr.ios_old_month_usr_cnt_1d = M10(row, country);
    arr.ios_old_year_usr_cnt_1d = N10(row, country);
    arr.and_sub_old_month_rate = O10(organicRes, country);
    arr.ios_sub_month_rate = P10(organicRes, country);
    arr.anrd_new_usr_cnt_1d = S10(row, country);
    arr.ios_new_usr_cnt_1d = T10(row, country);
    arr.anrd_amt_total_1d = W10(row, organicRes, country);
    arr.anrd_cost_total_1d = X10(row, organicRes, country);
    arr.ios_amt_total_1d = Y10(row, organicRes, country);
    arr.ios_cost_total_1d = Z10(row, organicRes, country);
    arr.anrd_month_amt_total_1d = AA10(row, organicRes, country);
    arr.ios_month_amt_total_1d = AC10(row, organicRes, country);
    arr.anrd_arpu = getNumber(W10(row, organicRes, country), S10(row, organicRes, country), false);
    arr.ios_arpu = getNumber(Y10(row, organicRes, country), T10(row, country), false);
  }

  return arr;
};

const getNotCnData = async (arr, country, type, data_time, data) => {
  const organicData = await getConfigList({
    country,
    channel: 1,
    type,
    startDate: moment(`${data_time}01`).format('YYYYMM'),
    endDate: moment(`${data_time}01`).format('YYYYMM'),
  });
  const organicRes = organicData.data.length ? organicData.data[0] : {};
  if (data.length) {
    const row = data[0];
    arr.gp_new_month_rate = B3(row, organicRes, country);
    arr.gp_new_year_rate = C3(organicRes, country);
    arr.ios_new_month_rate = D3(organicRes);
    arr.ios_new_year_rate = E3(organicRes);
    arr.gp_new_month_usr_cnt_1d = F3(row, organicRes, country);
    arr.gp_new_year_usr_cnt_1d = G3(row, organicRes, country);
    arr.ios_new_month_usr_cnt_1d = H3(row, organicRes, country);
    arr.ios_new_year_usr_cnt_1d = I3(row, organicRes, country);
    arr.gp_old_month_usr_cnt_1d = J3(row, country);
    arr.gp_old_year_usr_cnt_1d = K3(row, country);
    arr.ios_old_month_usr_cnt_1d = L3(row, country);
    arr.ios_old_year_usr_cnt_1d = M3(row, country);
    arr.gp_sub_month_rate = N3(organicRes, country);
    arr.ios_sub_month_rate = O3(organicRes, country);
    arr.gp_new_usr_cnt_1d = R3(row, organicRes, country);
    arr.ios_new_usr_cnt_1d = U3(row, organicRes, country);
    arr.gp_amt_total_1d = AB3(row, organicRes, country);
    arr.gp_cost_total_1d = AC3(row, organicRes, country);
    arr.ios_amt_total_1d = AD3(row, organicRes, country);
    arr.ios_cost_total_1d = AE3(row, organicRes, country);
    arr.gp_month_amt_total_1d = AF3(row, organicRes, country);
    arr.gp_year_amt_total_1d = AG3(row, organicRes, country);
    arr.ios_month_amt_total_1d = AH3(row, organicRes, country);
    arr.ios_year_amt_total_1d = AI3(row, organicRes, country);
    arr.gp_arpu = AJ3(row, organicRes, country);
    arr.ios_arpu = AK3(row, organicRes, country);
  }
  return arr;
};

export const getPredictData = async (data, data_time, country, type) => {
  let arr = {
    country: country || '全部',
    data_time,
    type: type.toString() === '1' ? '保守预测' : '激进预测',
  };
  if (!country) {
    arr.amt_total_1d = 0;
    arr.gp_amt_total_1d = 0;
    arr.ios_amt_total_1d = 0;
    arr.gp_amt_usr_cnt_1d = 0;
    arr.ios_amt_usr_cnt_1d = 0;
    arr.ios_new_month_usr_cnt_1d = 0;
    arr.ios_new_year_usr_cnt_1d = 0;
    arr.gp_new_month_usr_cnt_1d = 0;
    arr.gp_new_year_usr_cnt_1d = 0;
    arr.ios_old_month_usr_cnt_1d = 0;
    arr.ios_old_year_usr_cnt_1d = 0;
    arr.gp_old_month_usr_cnt_1d = 0;
    arr.gp_old_year_usr_cnt_1d = 0;
    arr.gp_new_usr_cnt_1d = 0;
    arr.ios_new_usr_cnt_1d = 0;
    for (const i of data) {
      if (i.country === '中国') {
        const organicData = await getConfigList({
          country: i.country,
          channel: 1,
          type,
          startDate: moment(`${data_time}01`).format('YYYYMM'),
          endDate: moment(`${data_time}01`).format('YYYYMM'),
        });
        const organicRes = organicData.data.length ? organicData.data[0] : {};
        arr.gp_amt_total_1d += W10(i, organicRes, i.country);
        arr.ios_amt_total_1d += Y10(i, organicRes, i.country);
        arr.gp_amt_usr_cnt_1d
          += Number(E10(i, organicRes, i.country))
          + Number(F10(i, organicRes, i.country))
          + Number(G10(i, i.country))
          + Number(J10(i, i.country))
          + Number(K10(i, i.country))
          + Number(L10(i, i.country));
        arr.ios_new_month_usr_cnt_1d += H10(i, organicRes, i.country);
        arr.ios_new_month_usr_cnt_1d += I10(i, organicRes, i.country);
        arr.gp_new_month_usr_cnt_1d += Number(add(E10(i, organicRes, i.country), F10(i, organicRes, i.country)));
        arr.gp_new_year_usr_cnt_1d += G10(i, organicRes, i.country);
        arr.ios_old_month_usr_cnt_1d += N10(i, i.country);
        arr.ios_old_year_usr_cnt_1d += M10(i, i.country);
        arr.gp_old_month_usr_cnt_1d += add(J10(i, i.country), K10(i, i.country));
        arr.gp_old_year_usr_cnt_1d += L10(i, i.country);
        arr.gp_new_usr_cnt_1d += S10(i, i.country);
        arr.ios_new_usr_cnt_1d += T10(i, i.country);
      } else {
        const organicData = await getConfigList({
          country: i.country,
          channel: 1,
          type,
          startDate: moment(`${data_time}01`).format('YYYYMM'),
          endDate: moment(`${data_time}01`).format('YYYYMM'),
        });
        const organicRes = organicData.data.length ? organicData.data[0] : {};
        arr.gp_amt_total_1d += AB3(i, organicRes, i.country);
        arr.ios_amt_total_1d += AD3(i, organicRes, i.country);
        arr.gp_amt_usr_cnt_1d
          += Number(F3(i, organicRes, i.country))
          + Number(G3(i, organicRes, i.country))
          + Number(J3(i, i.country))
          + Number(K3(i, i.country));
        arr.ios_amt_usr_cnt_1d
          += Number(H3(i, organicRes, i.country))
          + Number(I3(i, organicRes, i.country))
          + Number(L3(i, i.country))
          + Number(M3(i, i.country));
        arr.ios_new_month_usr_cnt_1d += H3(i, organicRes, i.country);
        arr.ios_new_year_usr_cnt_1d += I3(i, organicRes, i.country);
        arr.gp_new_month_usr_cnt_1d += F3(i, organicRes, i.country);
        arr.gp_new_year_usr_cnt_1d += G3(i, organicRes, i.country);
        arr.ios_old_month_usr_cnt_1d += L3(i, i.country);
        arr.ios_old_year_usr_cnt_1d += M3(i, i.country);
        arr.gp_old_month_usr_cnt_1d += J3(i, i.country);
        arr.gp_old_year_usr_cnt_1d += K3(i, i.country);
        arr.gp_new_usr_cnt_1d += R3(i, i.country);
        arr.ios_new_usr_cnt_1d += U3(i, i.country);
      }
      arr.amt_total_1d = add(arr.gp_amt_total_1d, arr.ios_amt_total_1d);
      arr.gp_arppu = getNumber(arr.gp_amt_total_1d, arr.gp_amt_usr_cnt_1d, false);
      arr.ios_arppu = getNumber(arr.ios_amt_total_1d, arr.ios_amt_usr_cnt_1d, false);
      arr.gp_new_month_rate = getNumber(arr.gp_new_month_usr_cnt_1d, arr.gp_new_usr_cnt_1d, false);
      arr.gp_new_year_rate = getNumber(arr.ios_old_month_usr_cnt_1d, arr.gp_new_usr_cnt_1d, false);
      arr.ios_new_month_rate = getNumber(arr.ios_new_month_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false);
      arr.ios_new_year_rate = getNumber(arr.ios_new_year_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false);
    }
  } else if (country === '中国') {
    arr = await getCnData(arr, country, type, data_time, data);
  } else {
    arr = await getNotCnData(arr, country, type, data_time, data);
  }
  return arr;
};
