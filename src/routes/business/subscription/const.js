/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-05-06 10:35:17
 * @LastEditTime: 2020-05-07 13:39:13
 * @LastEditors: ssssslf
 */
export const columns = [
  { title: '日期', key: 'ds', dataIndex: 'ds' },
  { title: '应用名称', key: 'product_id', dataIndex: 'product_id' },
  { title: '用户数', key: 'user_total', dataIndex: 'user_total' },
  { title: '曝光数', key: 'exp_total', dataIndex: 'exp_total' },
  { title: '曝光率', key: 'exp_total/user_total', dataIndex: 'exp_total/user_total' },
  { title: '点击数', key: 'click_total', dataIndex: 'click_total' },
  { title: '点击率', key: 'click_total/exp_total', dataIndex: 'click_total/exp_total' },
  { title: '订阅成功人数', key: 'suc_total', dataIndex: 'suc_total' },
  { title: '订阅成功率', key: 'suc_total/click_total', dataIndex: 'suc_total/click_total' },
  { title: '购买率', key: 'suc_total/user_total', dataIndex: 'suc_total/user_total' },
  { title: '成功扣费人数', key: 'sucs_pay_cnt_1d', dataIndex: 'sucs_pay_cnt_1d' },
  { title: '成功扣款率', key: 'sucs_pay_cnt_1d/suc_total', dataIndex: 'sucs_pay_cnt_1d/suc_total' },
  { title: '复购人数', key: 'sub_total', dataIndex: 'sub_total' },
  { title: '复购率', key: 'sub_total/sucs_pay_cnt_1d', dataIndex: 'sub_total/sucs_pay_cnt_1d' },
  { title: '退款人数', key: 'refund_cnt_1d', dataIndex: 'refund_cnt_1d' },
  { title: '退款率', key: 'refund_cnt_1d/sucs_pay_cnt_1d', dataIndex: 'refund_cnt_1d/sucs_pay_cnt_1d' },
  { title: '支付总额', key: 'charged_amount', dataIndex: 'charged_amount' },
  { title: '退款金额', key: 'refund_amount', dataIndex: 'refund_amount' },
  { title: '收入(分成后)', key: 'net_revenue', dataIndex: 'net_revenue' },
  { title: 'arpu', key: 'arpu', dataIndex: 'arpu' },
  { title: 'LTV人均', key: 'ltv', dataIndex: 'ltv' },
];

export const APP_LIST = {
  2: 'viva',
  3: 'sp',
  6: 'vid',
  10: 'tempo',
  15: 'vivacut',
  16: 'vivamini',
};

export const weidu = {
  fvalue: '入口',
  media_source: '来源',
  country_name: '地区',
  app_version: '版本',
  campaign_name: 'campaign_name',
};
