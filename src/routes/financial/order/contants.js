/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-27 12:07:35
 * @LastEditTime: 2020-03-06 09:44:55
 * @LastEditors: ssssslf
 */

export const basicColumns = [
  { key: 'data_time', title: '日期', dataIndex: 'data_time' },
  { key: 'channel', title: '结算平台', dataIndex: 'channel' },
  { key: 'app_product', title: 'APP', dataIndex: 'app_product' },
  { key: 'country_code', title: '地区', dataIndex: 'country_code' },
  { key: 'sku_type', title: '购买类型', dataIndex: 'sku_type' },
  { key: 'sku', title: 'sku', dataIndex: 'sku' },
  { key: 'subscription_type', title: '订阅类型', dataIndex: 'subscription_type' },
  { key: 'subscription_duration', title: '订阅时长', dataIndex: 'subscription_duration' },
  { key: 'pay_way', title: '结算方式', dataIndex: 'pay_way' },
];
export const columnsKeys = [
  { value: '1', label: '销售类' },
  { value: '2', label: '成本类' },
  { value: '3', label: '退款类' },
  { value: '4', label: '收入类' },
];

export const saleColumns = [
  { key: 'order_id', title: '订单编号', dataIndex: 'order_id' },
  { key: 'subscription_over_1y', title: '订单优惠', dataIndex: 'subscription_over_1y' },
  { key: 'currency', title: '币种', dataIndex: 'currency' },
  { key: 'charged_amount', title: '销售金额', dataIndex: 'charged_amount' },
];

export const costColumns = [
  { key: 'channel_rate', title: '平台分成率', dataIndex: 'channel_rate' },
  { key: 'handing_rate', title: '手续费率', dataIndex: 'handing_rate' },
  { key: 'tax_rate', title: '税率', dataIndex: 'tax_rate' },
  { key: 'channel_fee', title: '平台手续费', dataIndex: 'channel_fee' },
  { key: 'handling_fee', title: '手续费', dataIndex: 'handling_fee' },
  { key: 'tax_fee', title: '税费', dataIndex: 'tax_fee' },
];

export const refundColumns = [
  { key: 'refund_amount', title: '退款总额', dataIndex: 'refund_amount' },
  { key: 'channel_fee_return', title: '平台分成返还', dataIndex: 'channel_fee_return' },
  { key: 'tax_return', title: '税费返还', dataIndex: 'tax_return' },
  { key: 'handling_fee_return', title: '手续费返还', dataIndex: 'handling_fee_return' },
  { key: 'net_refund_amount', title: '净退款额', dataIndex: 'net_refund_amount' },
];
export const incomeColumns = [
  { key: 'net_revenue', title: '净收入', dataIndex: 'net_revenue' },
  { key: 'offset_revenue', title: '冲抵后净收入', dataIndex: 'offset_revenue' },
];
