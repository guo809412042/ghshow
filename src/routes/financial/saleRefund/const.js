/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-27 15:08:13
 * @LastEditTime: 2021-04-02 11:17:14
 * @LastEditors: dongqi.zhao
 */
import moment from 'moment';

export const saleColumns = [
  {
    title: '日期',
    dataIndex: 'data_time',
    key: 'data_time',
    render: v => moment(v, 'YYYYMM').format('YYYY年MM月'),
  },
  { title: 'app类型', dataIndex: 'app_product', key: 'app_product' },
  { title: '购买类型', dataIndex: 'sku_type', key: 'sku_type' },
  { title: '订阅包类型', dataIndex: 'subscription_type', key: 'subscription_type' },
  { title: '结算平台', dataIndex: 'channel', key: 'channel' },
  { title: '地区', dataIndex: 'country_code', key: 'country_code' },
  { title: '地区类型', dataIndex: 'kp_country_type', key: 'kp_country_type' },
  {
    title: '销售金额',
    dataIndex: 'charged_amount',
    key: 'charged_amount',
  },
  {
    title: '应用平台分成',
    dataIndex: 'sum_channel_fee',
    key: 'sum_channel_fee',
  },
  {
    title: '手续费',
    dataIndex: 'handling_fee',
    key: 'handling_fee',
  },
  {
    title: '素材版权分成',
    dataIndex: 'cn_material_channel_fee',
    key: 'cn_material_channel_fee',
  },
  {
    title: '净收入',
    dataIndex: 'net_revenue',
    key: 'net_revenue',
  },
  {
    title: '增值税销项税额（仅中国）',
    dataIndex: 'output_vat',
    key: 'output_vat',
  },
  {
    title: '代扣代缴增值税-进项税额(对应所有渠道的平台分成)',
    dataIndex: 'withhold_input_vat',
    key: 'withhold_input_vat',
  },
  {
    title: '代扣代缴附加税(对应代扣代缴增值税-进项税额)',
    dataIndex: 'withhold_addition_tax',
    key: 'withhold_addition_tax',
  },
  {
    title: '增值税进项税额-手续费',
    dataIndex: 'input_tax_with_handingfee',
    key: 'input_tax_with_handingfee',
  },
];

export const refColumns = [
  {
    title: '日期',
    dataIndex: 'data_time',
    key: 'data_time',
    render: v => moment(v, 'YYYYMM').format('YYYY年MM月'),
  },
  { title: 'app类型', dataIndex: 'app_product', key: 'app_product' },
  { title: '购买类型', dataIndex: 'sku_type', key: 'sku_type' },
  { title: '订阅包类型', dataIndex: 'subscription_type', key: 'subscription_type' },
  { title: '结算平台', dataIndex: 'channel', key: 'channel' },
  { title: '地区', dataIndex: 'country_code', key: 'country_code' },
  { title: '地区类型', dataIndex: 'kp_country_type', key: 'kp_country_type' },
  {
    title: '销售金额',
    dataIndex: 'charged_amount',
    key: 'charged_amount',
  },
  {
    title: '应用平台分成',
    dataIndex: 'sum_channel_fee_return',
    key: 'sum_channel_fee_return',
  },
  {
    title: '手续费',
    dataIndex: 'handing_fee_return',
    key: 'handing_fee_return',
  },
  {
    title: '素材版权分成',
    dataIndex: 'cn_material_channel_fee',
    key: 'cn_material_channel_fee',
  },
  {
    title: '净收入',
    dataIndex: 'net_revenue_return',
    key: 'net_revenue_return',
  },
  {
    title: '返还增值税销项税额（仅中国）',
    dataIndex: 'output_vat_return',
    key: 'output_vat_return',
  },
  {
    title: '返还代扣代缴增值税-进项税额(对应所有渠道的平台分成)',
    dataIndex: 'withhold_input_vat_return',
    key: 'withhold_input_vat_return',
  },
  {
    title: '返还代扣代缴附加税(对应代扣代缴增值税-进项税额)',
    dataIndex: 'withhold_addition_tax_return',
    key: 'withhold_addition_tax_return',
  },
  {
    title: '返还增值税进项税额-手续费',
    dataIndex: 'input_tax_with_handingfee_return',
    key: 'input_tax_with_handingfee_return',
  },
];
