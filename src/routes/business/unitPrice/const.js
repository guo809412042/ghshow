/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 11:03:54
 * @LastEditTime: 2020-05-07 20:44:35
 * @LastEditors: ssssslf
 */

export const appProductList = [
  { key: 'viva', app_product: 'VivaVideo' },
  { key: 'vivamini', app_product: '趣影' },
  { key: 'sp', app_product: 'SlidePlus' },
  { key: 'tempo', app_product: 'Tempo' },
  { key: 'vivacut', app_product: 'VivaCut' },
];
export const APP_LIST = {
  2: 'viva',
  3: 'sp',
  6: 'vid',
  10: 'tempo',
  15: 'vivacut',
  16: 'vivamini',
};

export const appProductJSON = {
  VivaVideo: 'viva',
  趣影: 'vivamini',
  SlidePlus: 'sp',
  Tempo: 'tempo',
  VivaCut: 'vivacut',
};

export const columns = [
  { dataIndex: 'data_time', key: 'data_time', title: '日期范围' },
  { dataIndex: 'new_usr_actv', key: 'new_usr_actv', title: '新增用户数' },
  { dataIndex: 'pay_usr_total', key: 'pay_usr_total', title: '付费人数' },
  { dataIndex: 'pay_amt_total', key: 'pay_amt_total', title: '付费金额' },
  { dataIndex: 'pay_amt_total/new_usr_actv', key: 'pay_amt_total/new_usr_actv', title: 'ARPU' },
  { dataIndex: 'pay_amt_total/pay_usr_total', key: 'pay_amt_total/pay_usr_total', title: 'ARPPU' },
];
