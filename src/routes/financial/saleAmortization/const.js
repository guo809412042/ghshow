/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-27 15:08:13
 * @LastEditTime: 2021-01-22 13:33:06
 * @LastEditors: dongqi.zhao
 */

import moment from 'moment';

export const saleColumns = [
  {
    title: '日期',
    dataIndex: 'order_month',
    key: 'order_month',
    render: v => moment(v, 'YYYYMM').format('YYYY年MM月'),
  },
  { title: 'app类型', dataIndex: 'app_product', key: 'app_product' },
  { title: '购买类型', dataIndex: 'sku_type', key: 'sku_type' },
  { title: '订阅包类型', dataIndex: 'subscription_type', key: 'subscription_type' },
  { title: '结算平台', dataIndex: 'channel', key: 'channel' },
  { title: '地区', dataIndex: 'country_code', key: 'country_code' },
  { title: '地区类型', dataIndex: 'kp_country_type', key: 'kp_country_type' },
  { title: '当期订单待摊销额', dataIndex: 'current_order_to_amortize_amount', key: 'current_order_to_amortize_amount' },
  { title: '当期订单当期摊销额', dataIndex: 'current_order_amortized_amount', key: 'current_order_amortized_amount' },
  {
    title: '当期订单未来摊销额',
    dataIndex: 'current_order_to_amortize_in_future_amount',
    key: 'current_order_to_amortize_in_future_amount',
  },
  {
    title: '当期订单未来摊销额(本年度内)',
    dataIndex: 'current_order_to_amortize_over_1y_amount',
    key: 'current_order_to_amortize_over_1y_amount',
  },
  { title: '历史订单待摊销额', dataIndex: 'his_order_to_amorize_amount', key: 'his_order_to_amorize_amount' },
  { title: '历史订单当期摊销额', dataIndex: 'his_order_amorized_amount', key: 'his_order_amorized_amount' },
  {
    title: '历史订单未来待摊销额',
    dataIndex: 'his_order_to_amortize_in_future_amount',
    key: 'his_order_to_amortize_in_future_amount',
  },
  {
    title: '历史订单未来待摊销额(本年度内)',
    dataIndex: 'his_order_to_amortize_over_1y_amount',
    key: 'his_order_to_amortize_over_1y_amount',
  },
  {
    title: '当期订单未来摊销额_未来12月内待摊销额',
    dataIndex: 'current_order_to_amortiz_in_future_amount_12',
    key: 'current_order_to_amortiz_in_future_amount_12',
  },
  {
    title: '历史订单未来摊销额_未来12月内待摊销额',
    dataIndex: 'his_order_to_amortiz_in_future_amount_12',
    key: 'his_order_to_amortiz_in_future_amount_12',
  },
];

export const refColumns = [
  {
    title: '日期',
    dataIndex: 'refund_month',
    key: 'refund_month',
    render: v => moment(v, 'YYYYMM').format('YYYY年MM月'),
  },
  { title: 'app类型', dataIndex: 'app_product', key: 'app_product' },
  { title: '购买类型', dataIndex: 'sku_type', key: 'sku_type' },
  { title: '订阅包类型', dataIndex: 'subscription_type', key: 'subscription_type' },
  { title: '结算平台', dataIndex: 'channel', key: 'channel' },
  { title: '地区', dataIndex: 'country_code', key: 'country_code' },
  { title: '地区类型', dataIndex: 'kp_country_type', key: 'kp_country_type' },
  {
    title: '当期退款订单待摊销额',
    dataIndex: 'current_refund_order_to_amortize_amount',
    key: 'current_refund_order_to_amortize_amount',
  },
  {
    title: '当期退款订单当期摊销额',
    dataIndex: 'current_refund_order_amortized_amount',
    key: 'current_refund_order_amortized_amount',
  },
  {
    title: '当期退款订单未来摊销额',
    dataIndex: 'current_refund_order_to_amortize_in_future_amount',
    key: 'current_refund_order_to_amortize_in_future_amount',
  },
  {
    title: '当期退款订单未来摊销额(本年度内)',
    dataIndex: 'current_refund_order_to_amortize_over_1y_amount',
    key: 'current_refund_order_to_amortize_over_1y_amount',
  },
  {
    title: '历史退款订单待摊销额',
    dataIndex: 'his_refund_order_to_amorize_amount',
    key: 'his_refund_order_to_amorize_amount',
  },
  {
    title: '历史退款订单当期摊销额',
    dataIndex: 'his_refund_order_amorized_amount',
    key: 'his_refund_order_amorized_amount',
  },
  {
    title: '历史退款订单未来待摊销额',
    dataIndex: 'his_refund_order_to_amortize_in_future_amount',
    key: 'his_refund_order_to_amortize_in_future_amount',
  },
  {
    title: '历史退款订单未来待摊销额(本年度内)',
    dataIndex: 'his_refund_order_to_amortize_over_1y_amount',
    key: 'his_refund_order_to_amortize_over_1y_amount',
  },
  {
    title: '当期订单未来摊销额_未来12月内待摊销额',
    dataIndex: 'current_order_to_amortiz_in_future_amount_12',
    key: 'current_order_to_amortiz_in_future_amount_12',
  },
  {
    title: '历史订单未来摊销额_未来12月内待摊销额',
    dataIndex: 'his_order_to_amortiz_in_future_amount_12',
    key: 'his_order_to_amortiz_in_future_amount_12',
  },
];
