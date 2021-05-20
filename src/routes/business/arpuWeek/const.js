/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-05 10:31:22
 * @LastEditTime: 2021-03-10 17:59:17
 * @LastEditors: dongqi.zhao
 */
export const appProductList = [
  { app_product: 'VivaVideo' },
  { app_product: 'Camdy' },
  { app_product: 'SlidePlus' },
  { app_product: 'VivaCut' },
  { app_product: 'VivaVideoPro' },
  { app_product: '趣影' },
  { app_product: 'KamStar' },
  { app_product: 'Tempo' },
  { app_product: 'VISO' },
  { app_product: '奇幻变脸秀' },
];
export const productMap = {
  2: 'viva',
  3: 'sp',
  6: 'vid',
  10: 'tempo',
  15: 'vivacut',
  16: 'vivamini',
  18: 'vmix',
  33: 'picsfox',
  35: 'facee',
  36: 'glitchfx',
  39: 'veffecto',
  41: 'storybuff',
  42: 'mast',
  43: 'gocut',
  44: 'vivavideoindia',
  50: 'beatstarr',
  51: 'multirecorder',
  10000: 'all',
};


export const columnsout = [
  {
    key: 'product', title: '产品', dataIndex: 'product_id', render: (text, row) => (text === 10000 ? productMap[text] : productMap[text] + (row.platform_id === 1 ? '－GP' : '－iOS')),
  },
  {
    title: '日均DAU',
    dataIndex: 'adau',
    key: 'adau',
    render: text => (text ? Number(text) : 0),
  },
  {
    title: '日均新增',
    dataIndex: 'areg',
    key: 'areg',
    render: text => (text ? Number(text) : 0),
  },
  {
    title: '新增占比',
    dataIndex: 'regrate',
    key: 'regrate',
    render: text => (text ? Number(text) : 0),
  },
  {
    title: '日均广告收入',
    dataIndex: 'ad_revenue',
    key: 'ad_revenue',
    render: text => (text ? Number(text) : 0),
  },
  {
    title: '日均广告ARPU',
    dataIndex: 'ad_arpu',
    key: 'ad_arpu',
    render: text => (text ? Number(text) : 0),
  },
  {
    title: '日均ecpm',
    dataIndex: 'ecpm',
    key: 'ecpm',
    render: text => (text ? Number(text) : 0),
  },
  {
    title: '日均订阅销售额',
    dataIndex: 'sub_amount',
    key: 'sub_amount',
    render: text => (text ? Number(text) : 0),
  },
  {
    title: '日均订阅销售额ARPU',
    dataIndex: 'sub_arpu',
    key: 'sub_arpu',
    render: text => (text ? Number(text) : 0),
  },

  {
    title: '对比上周-日均DAU',
    dataIndex: 'adau_last_rate',
    key: 'adau_last_rate',
    // render: (text, row) => getScale({ molecular: row.adau || 0, denominator: text || 0 }),
  },
  {
    title: '对比上周-日均新增',
    dataIndex: 'areg_last_rate',
    key: 'areg_last_rate',
    // render: (text, row) => getScale({ molecular: row.areg || 0, denominator: text || 0 }),
  },
  {
    title: '对比上周-新增占比',
    dataIndex: 'regrate_last_rate',
    key: 'regrate_last_rate',
    // render: (text, row) => getScale({ molecular: row.regrate || 0, denominator: text || 0 }),
  },
  {
    title: '对比上周-日均广告收入',
    dataIndex: 'ad_revenue_last_rate',
    key: 'ad_revenue_last_rate',
    // render: (text, row) => getScale({ molecular: row.ad_revenue || 0, denominator: text || 0 }),
  },
  {
    title: '对比上周-日均广告ARPU',
    dataIndex: 'ad_arpu_last_rate',
    key: 'ad_arpu_last_rate',
    // render: (text, row) => getScale({ molecular: row.ad_arpu || 0, denominator: text || 0 }),
  },
  {
    title: '对比上周-日均ecpm',
    dataIndex: 'ecpm_last_rate',
    key: 'ecpm_last_rate',
    // render: (text, row) => getScale({ molecular: row.ecpm || 0, denominator: text || 0 }),
  },
  {
    title: '对比上周-日均订阅销售额',
    dataIndex: 'sub_amount_last_rate',
    key: 'sub_amount_last_rate',
    // render: (text, row) => getScale({ molecular: row.sub_amount || 0, denominator: text || 0 }),
  },
  {
    title: '对比上周-日均订阅销售额ARPU',
    dataIndex: 'sub_arpu_last_rate',
    key: 'sub_arpu_last_rate',
    // render: (text, row) => getScale({ molecular: row.sub_arpu || 0, denominator: text || 0 }),
  },
];
