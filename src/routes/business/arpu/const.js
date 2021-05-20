/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-05 10:31:22
 * @LastEditTime: 2021-03-29 16:05:58
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
  2: 'VivaVideo',
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

// function getScale({ molecular, denominator }) {
//   return molecular > denominator ? <span>+{((molecular - denominator) / denominator * 100).toFixed(1)}</span> : <span>{((molecular - denominator) / denominator * 100).toFixed(1)}</span>;
// }

export const columns = [
  {
    key: 'product_id', title: '产品', dataIndex: 'product_id', render: (text, row) => (text === 10000 ? productMap[text] : productMap[text] + (row.platform_id === 1 ? '－GP' : '－iOS')),
  },
  {
    key: 'mau', title: 'MAU', dataIndex: 'mau', render: text => (text || 0),
  },
  {
    key: 'reg', title: '新增', dataIndex: 'reg', render: text => (text || 0),
  },
  {
    key: 'reg_rate', title: '新增占比', dataIndex: 'reg_rate', render: text => (text || 0),
  },
  {
    key: 'all_amount', title: '总收入($)', dataIndex: 'all_amount', render: text => (text || 0),
  },
  {
    key: 'ad_revenue', title: '广告收入($)', dataIndex: 'ad_revenue', render: text => (text || 0),
  },
  {
    key: 'real_amount', title: '订阅净收入($)', dataIndex: 'real_amount', render: text => (text || 0),
  },
  {
    key: 'sub_amount', title: '订阅销售额($)', dataIndex: 'sub_amount', render: text => (text || 0),
  },
  {
    key: 'bonus', title: '分成比例', dataIndex: 'bonus', render: text => (text || 0),
  },
  {
    key: 'all_arpu', title: '总ARPU($)', dataIndex: 'all_arpu', render: text => (text || 0),
  },
  {
    key: 'ad_arpu', title: '广告ARPU($)', dataIndex: 'ad_arpu', render: text => (text || 0),
  },
  {
    key: 'sub_arpu', title: '订阅ARPU($)', dataIndex: 'sub_arpu', render: text => (text || 0),
  },
];

export const columnsout = [
  {
    key: 'product', title: '产品', dataIndex: 'product_id', render: (text, row) => (text === 10000 ? productMap[text] : productMap[text] + (row.platform_id === 1 ? '－GP' : '－iOS')),
  },
  {
    key: 'mau', title: 'MAU', dataIndex: 'mau', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'reg', title: '新增', dataIndex: 'reg', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'reg_rate', title: '新增占比', dataIndex: 'reg_rate', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'all_amount', title: '总收入($)', dataIndex: 'all_amount', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'ad_revenue', title: '广告收入($)', dataIndex: 'ad_revenue', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'real_amount', title: '订阅净收入($)', dataIndex: 'real_amount', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'sub_amount', title: '订阅销售额($)', dataIndex: 'sub_amount', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'bonus', title: '分成比例', dataIndex: 'bonus', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'all_arpu', title: '总ARPU($)', dataIndex: 'all_arpu', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'ad_arpu', title: '广告ARPU($)', dataIndex: 'ad_arpu', render: text => (text ? Number(text) : 0),
  },
  {
    key: 'sub_arpu', title: '订阅ARPU($)', dataIndex: 'sub_arpu', render: text => (text ? Number(text) : 0),
  },
];
