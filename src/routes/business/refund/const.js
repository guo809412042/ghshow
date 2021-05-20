/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 11:03:54
 * @LastEditTime: 2020-05-06 17:38:52
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
  { dataIndex: 'rfd_usr_total_gp', key: 'rfd_usr_total_gp', title: 'GP退款数' },
  { dataIndex: 'rfd_amt_total_gp', key: 'rfd_amt_total_gp', title: 'GP退款金额' },
  {
    dataIndex: 'rfd_amt_total_gp/pay_amt_total_gp',
    key: 'rfd_amt_total_gp/pay_amt_total_gp',
    title: 'GP退款率(%)',
  },
  { dataIndex: 'rfd_usr_total_ios', key: 'rfd_usr_total_ios', title: 'iOS退款数' },
  { dataIndex: 'rfd_amt_total_ios', key: 'rfd_amt_total_ios', title: 'iOS退款金额' },
  {
    dataIndex: 'rfd_amt_total_ios/pay_amt_total_ios',
    key: 'rfd_amt_total_ios/pay_amt_total_ios',
    title: 'iOS退款率(%)',
  },
  { dataIndex: 'rfd_usr_total_and', key: 'rfd_usr_total_and', title: '国内安卓退款数' },
  { dataIndex: 'rfd_amt_total_and', key: 'rfd_amt_total_and', title: '国内安卓退款金额' },
  {
    dataIndex: 'rfd_amt_total_and/pay_amt_total_and',
    key: 'rfd_amt_total_and/pay_amt_total_and',
    title: '国内安卓退款率(%)',
  },
  { dataIndex: 'rfd_usr_total', key: 'rfd_usr_total', title: '退款总数' },
  { dataIndex: 'rfd_amt_total', key: 'rfd_amt_total', title: '退款总金额' },
  { dataIndex: 'rfd_amt_total/pay_amt_total', key: 'rfd_amt_total/pay_amt_total', title: '退款率(%)' },
];
