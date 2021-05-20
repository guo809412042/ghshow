/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 11:03:54
 * @LastEditTime: 2021-01-25 16:56:38
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
};

export const appProductJSON = {
  VivaVideo: 'viva',
  趣影: 'vivamini',
  SlidePlus: 'sp',
  Tempo: 'tempo',
  VivaCut: 'vivacut',
};

export const columns = [
  { dataIndex: 'ds', key: 'ds', title: '日期' },
  { dataIndex: 'media_source', key: 'media_source', title: '渠道' },
  { dataIndex: 'ttid', key: 'ttid', title: '素材id' },
  { dataIndex: 'country_code', key: 'country_code', title: '地区' },
  { dataIndex: 'spend', key: 'spend', title: '投放成本' },
  { dataIndex: 'impressions', key: 'impressions', title: '展示量' },
  { dataIndex: 'ecpm', key: 'ecpm', title: 'ecpm' },
  { dataIndex: 'clicks', key: 'clicks', title: '点击量' },
  { dataIndex: 'clicks', key: 'clicks', title: '点击率' },
  { dataIndex: 'clicks', key: 'clicks', title: 'ctr' },
  { dataIndex: 'installs', key: 'installs', title: '新增' },
  { dataIndex: 'amount', key: 'amount', title: '销售额' },
  { dataIndex: 'refund_amount', key: 'refund_amount', title: '退款额' },
  { dataIndex: 'revenue', key: 'revenue', title: '实际收入' },
  { dataIndex: 'revenue', key: 'revenue', title: 'roi' },
];

export const fields = {
  ds: '日期',
  media_source: '渠道',
  ttid: '素材id',
  country_code: '地区',
  spend: '投放成本',
  impressions: '展示量',
  ecpm: 'ecpm',
  clicks: '点击量',
  ctr: '点击率',
  installs: '新增',
  amount: '销售额',
  refund_amount: '退款额',
  revenue: '实际收入',
  roi: 'roi',
};

export const groups = {
  country_name: '国家',
  media_source: '渠道',
  ttid: '素材id',
  // subscribe_period: '订阅周期',
};
