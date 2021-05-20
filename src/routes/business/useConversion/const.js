/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 11:03:54
 * @LastEditTime: 2020-05-12 18:54:02
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
  { dataIndex: 'ds', key: 'ds', title: '日期范围' },
  { dataIndex: 'new_usr_actv', key: 'new_usr_actv', title: '新增用户数' },
  { dataIndex: 'pay_usr_cnt_1d', key: 'pay_usr_cnt_1d', title: '直接付费人数' },
  { dataIndex: 'trial_usr_cnt_1d', key: 'trial_usr_cnt_1d', title: '试用人数' },
  { dataIndex: 'trial_pay_usr_cnt_1d', key: 'trial_pay_usr_cnt_1d', title: '试用转付费人数(15日内)' },
  { dataIndex: 'trial_usr_cnt_1d/new_usr_actv', key: 'trial_usr_cnt_1d/new_usr_actv', title: '试用率' },
  {
    dataIndex: 'trial_pay_usr_cnt_1d/trial_usr_cnt_1d',
    key: 'trial_pay_usr_cnt_1d/trial_usr_cnt_1d',
    title: '试用转化率',
  },
  { dataIndex: 'trial_pay_usr_cnt_1d/new_usr_actv', key: 'trial_pay_usr_cnt_1d/new_usr_actv', title: '试用付费率' },
  { dataIndex: 'pay_usr_cnt_1d/new_usr_actv', key: 'pay_usr_cnt_1d/new_usr_actv', title: '直接付费率' },
];
