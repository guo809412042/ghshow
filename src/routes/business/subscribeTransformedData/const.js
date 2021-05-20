/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-07-31 11:38:39
 * @LastEditTime: 2021-04-15 17:38:34
 * @LastEditors: dongqi.zhao
 */

export const APP_PRODUCT_LIST = {
  2: 'VivaVideo',
  3: 'SlidePlus',
  6: 'VidStatus',
  10: 'Tempo',
  15: 'VivaCut',
  16: 'VivaMini',
  35: 'Facee',
  36: 'Glitchfx',
  18: 'Vmix',
  43: 'GoCut',
  33: 'picsfox',
  42: 'mast',
  41: 'StoryBuff',
  39: 'Veffecto',
  44: '小影印度马甲包',
};

export const groups = {
  sku_id: '商品id',
  entrance: '入口',
  country: '国家',
  media_source: '来源',
  campaign: 'campaign',
  // subscribe_period: '订阅周期',
};

export const subscribePeriodEum = {
  week: '周订阅',
  month: '月订阅',
  year: '年订阅',
  forever: '永久订阅',
};

export const fields = {
  user_num: '用户数',
  cpa: 'CPA',
  subscription_views_num: '订阅页展示量',
  subscription_click_num: '订阅页点击量',
  subscribe_success_num: '订阅成功人数',
  subscribe_cancal_num: '取消订阅人数',
  purchase_renew_num: '续费人数',
  purchase_num: '直接付费人数',
  free_purchase_num: '试用后付费人数',
  refund_num: '退款人数',
  ad_cost: '推广总花费',
  real_revenue: '订阅收入',
  charged_amount: '支付总额',
  refund_amount: '退款总额',
  ad_revenue: '广告收入',
  arpu: 'ARPU',
  LTV: '预估 LTV',
  profit: '当前总利润',
  profit_rate: '当前利润率',
  fore_roi: '预估ROI',
  view_rate: '展示率',
  click_rate: '点击率',
  subscribe_success_rate: '订阅成功占比',
  purchase_success_rate: '支付成功率',
  purchase_rate: '实际支付人数占比',
  refund_rate: '退款率',
  purchase_renew_rate: '续费率',
};

export const fieldsTooltip = {
  arpu: 'arpu = ( charged_amount - refund_amount + adrevenue ) * 分成比例  / user_num ',
  profit: '(支付总额-退款总额) * 国家分成比例 -推广总花费',
  profit_rate: '(当前总利润 / 推广总花费) * 100',
  view_rate: '订阅页展示量 * 100 / 用户数',
  click_rate: '订阅页点击量 * 100 / 订阅页展示量',
  subscribe_success_rate: '订阅成功人数 * 100 / 订阅页展示量',
  purchase_success_rate: '(直接付费人数+试用后付费人数) * 100 / 订阅成功人数',
  purchase_rate: '(直接付费人数+试用后付费人数) * 100 / 用户数',
  refund_rate: '退款人数 * 100 / (直接付费人数+试用后付费人数)',
  purchase_renew_rate: '续费人数 * 100 / (直接付费人数 + 试用后付费人数)',
};

export const createTimeEum = {
  '<1': '第一天',
  '<3': '前三天',
  '<7': '前七天',
  '<14': '前十四天',
  '<30': '前三十天',
};
