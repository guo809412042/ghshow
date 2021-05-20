/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 11:03:54
 * @LastEditTime: 2021-02-08 11:28:50
 * @LastEditors: dongqi.zhao
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
  33: 'PicsFox',
  35: 'facee',
  36: 'Glitch-VFX',
  43: 'GoCut',
  18: 'VMix',
  42: 'mast',
  41: 'StoryBuff',
  39: 'Veffecto',
  44: '小影印度马甲包',
};
export const appProductJSON = {
  VivaVideo: 'viva',
  趣影: 'vivamini',
  SlidePlus: 'sp',
  Tempo: 'tempo',
  VivaCut: 'vivacut',
};

export const columns = [
  { dataIndex: 'reg_time', key: 'reg_time', title: 'reg_time' },
  { dataIndex: 'user_total', key: 'user_total', title: '新增用户' },
  { dataIndex: 'pay_total', key: 'pay_total', title: '收入' },
  { dataIndex: 'pay_total/user_total', key: 'pay_total/user_total', title: '收入/新增' },
  { dataIndex: 'interval_day0', key: 'interval_day0', title: '当日付费' },
  { dataIndex: 'interval_day1', key: 'interval_day1', title: '1天后付费' },
  { dataIndex: 'interval_day2', key: 'interval_day2', title: '2天后付费' },
  { dataIndex: 'interval_day3', key: 'interval_day3', title: '3天后付费' },
  { dataIndex: 'interval_day4', key: 'interval_day4', title: '4天后付费' },
  { dataIndex: 'interval_day5', key: 'interval_day5', title: '5天后付费' },
  { dataIndex: 'interval_day6', key: 'interval_day6', title: '6天后付费' },
];
