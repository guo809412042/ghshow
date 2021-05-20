export { COUNTRY_NAME_COMMON_LIST } from '../trialConvertion/const';

const width = 120;
export const columns = [
  {
    title: '日期',
    dataIndex: 'ds',
    key: 'ds',
    width,
  },
  {
    title: '平台',
    dataIndex: 'platform',
    key: 'platform',
    width,
  },
  {
    title: '渠道',
    dataIndex: 'media_source',
    key: 'media_source',
    width,
  },
  {
    title: '地区',
    dataIndex: 'country_name',
    key: 'country_name',
    width,
  },
  {
    title: '用户类型',
    dataIndex: 'user_status',
    key: 'user_status',
    width,
  },
  {
    title: '商品项',
    dataIndex: 'sku_info',
    key: 'sku_info',
    width,
  },
  {
    title: '活跃用户数',
    dataIndex: 'active_user',
    key: 'active_user',
    width,
  },
  {
    title: 'ARPDAU',
    dataIndex: 'ARPDAU',
    key: 'ARPDAU',
    width,
  },
  {
    title: '当期付费率',
    dataIndex: 'curr_rate',
    key: 'curr_rate',
    width,
    render: text => `${text}%`,
  },
  {
    title: '当期付费金额',
    dataIndex: 'curr_amount',
    key: 'curr_amount',
    width,
  },
  {
    title: '一年LTV',
    dataIndex: 'LTV',
    key: 'LTV',
    width,
  },
  {
    title: '试用数',
    dataIndex: 'try_out',
    key: 'try_out',
    width,
  },
  {
    title: '试用转付费数',
    dataIndex: 'try_out_topay',
    key: 'try_out_topay',
    width,
  },
  {
    title: '直接付费数',
    dataIndex: 'direct_pay',
    key: 'direct_pay',
    width,
  },
  {
    title: '试用转付费金额',
    dataIndex: 'try_out_topay_amount',
    key: 'try_out_topay_amount',
    width,
  },
  {
    title: '直接付费金额',
    dataIndex: 'direct_amount',
    key: 'direct_amount',
    width,
  },
  {
    title: '一年内续期数',
    dataIndex: 'rate',
    key: 'rate',
    width,
    render: text => (text ? Number(text).toFixed(2) : ''),
  },
  {
    title: '预估一年付费金额',
    dataIndex: 'year_expect_amount',
    key: 'year_expect_amount',
    width,
  },
];
