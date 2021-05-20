/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 11:03:54
 * @LastEditTime: 2020-06-15 10:04:48
 * @LastEditors: ssssslf
 */
export const gpIosColumns1 = [
  { dataIndex: 'gp_new_sub', key: 'gp_new_sub', title: '首购GP' },
  { dataIndex: 'gp_old_sub', key: 'gp_old_sub', title: '复购GP' },
  { dataIndex: 'ios_new_sub', key: 'ios_new_sub', title: '首购IOS' },
  { dataIndex: 'ios_old_sub', key: 'ios_old_sub', title: '复购IOS' },
  { dataIndex: 'gp_new_sub_y_total', key: 'gp_new_sub_y_total', title: '首购-GP年包' },
  { dataIndex: 'gp_new_sub_m_total', key: 'gp_new_sub_m_total', title: '首购-GP月包' },
  { dataIndex: 'gp_new_sub_oth_total', key: 'gp_new_sub_oth_total', title: '首购-GP其他订阅项' },
  { dataIndex: 'ios_new_sub_y_total', key: 'ios_new_sub_y_total', title: '首购-iOS年包' },
  { dataIndex: 'ios_new_sub_m_total', key: 'ios_new_sub_m_total', title: '首购-iOS月包' },
  { dataIndex: 'ios_new_sub_oth_total', key: 'ios_new_sub_oth_total', title: '首购-iOS其他订阅项' },
  { dataIndex: 'gp_old_sub_y_total', key: 'gp_old_sub_y_total', title: '复购-GP年包' },
  { dataIndex: 'gp_old_sub_m_total', key: 'gp_old_sub_m_total', title: '复购-GP月包' },
  { dataIndex: 'gp_old_sub_oth_total', key: 'gp_old_sub_oth_total', title: '复购-GP其他订阅项' },
  { dataIndex: 'ios_old_sub_y_total', key: 'ios_old_sub_y_total', title: '复购-iOS年包' },
  { dataIndex: 'ios_old_sub_m_total', key: 'ios_old_sub_m_total', title: '复购-iOS月包' },
  { dataIndex: 'ios_old_sub_oth_total', key: 'ios_old_sub_oth_total', title: '复购-iOS其他订阅项' },
  { dataIndex: 'gp_one_pay_total', key: 'gp_one_pay_total', title: '单独购买-GP单项' },
  { dataIndex: 'ios_one_pay_total', key: 'ios_one_pay_total', title: '单独购买-iOS单项' },
];
export const gpIosColumns = [
  {
    dataIndex: 'gp_new_sub_m_total/gp_add_user_total',
    key: 'gp_new_sub_m_total/gp_add_user_total',
    title: '付费率-GP月包',
  },
  {
    dataIndex: 'gp_new_sub_y_total/gp_add_user_total',
    key: 'gp_new_sub_y_total/gp_add_user_total',
    title: '付费率-GP年包',
  },
  {
    dataIndex: 'ios_new_sub_m_total/ios_add_user_total',
    key: 'ios_new_sub_m_total/ios_add_user_total',
    title: '付费率-iOS月包',
  },
  {
    dataIndex: 'ios_new_sub_y_total/ios_add_user_total',
    key: 'ios_new_sub_y_total/ios_add_user_total',
    title: '付费率-iOS年包',
  },
];

export const chartLines = {
  GP首购: [
    { key: 'gp_new_sub', title: '首购GP' },
    { key: 'gp_new_sub_y_total', title: '首购-GP年包' },
    { key: 'gp_new_sub_m_total', title: '首购-GP月包' },
    { key: 'gp_new_sub_oth_total', title: '首购-GP其他订阅项' },
    { key: 'gp_one_pay_total', title: '单独购买-GP单项' },
  ],
  GP复购: [
    { key: 'gp_old_sub', title: '复购GP' },
    { key: 'gp_old_sub_y_total', title: '复购-GP年包' },
    { key: 'gp_old_sub_m_total', title: '复购-GP月包' },
    { key: 'gp_old_sub_oth_total', title: '复购-GP其他订阅项' },
  ],
  iOS首购: [
    { key: 'ios_new_sub', title: '首购IOS' },
    { key: 'ios_new_sub_y_total', title: '首购-iOS年包' },
    { key: 'ios_new_sub_m_total', title: '首购-iOS月包' },
    { key: 'ios_new_sub_oth_total', title: '首购-iOS其他订阅项' },
    { key: 'ios_one_pay_total', title: '单独购买-iOS单项' },
  ],
  iOS复购: [
    { key: 'ios_old_sub', title: '复购IOS' },
    { key: 'ios_old_sub_y_total', title: '复购-iOS年包' },
    { key: 'ios_old_sub_m_total', title: '复购-iOS月包' },
    { key: 'ios_old_sub_oth_total', title: '复购-iOS其他订阅项' },
  ],
  国内安卓首购: [
    { key: 'and_new_sub', title: '首购订阅' },
    { key: 'and_nosub_new', title: '首购非订阅' },
    { key: 'and_new_sub_y_total', title: '首购-订阅年包' },
    { key: 'and_new_sub_m_total', title: '首购-订阅月包' },
    { key: 'and_new_sub_oth_total', title: '首购-订阅其他项目' },
    { key: 'and_nosub_new_y_total', title: '首购-非订阅年包' },
    { key: 'and_nosub_new_m_total', title: '首购-非订阅月包' },
    { key: 'and_nosub_new_oth_total', title: '首购-非订阅其他项目' },
  ],
  国内安卓复购: [
    { key: 'and_old_sub', title: '复购订阅' },
    { key: 'and_nosub_old', title: '复购非订阅' },
    { key: 'and_old_sub_y_total', title: '复购-订阅年包' },
    { key: 'and_old_sub_m_total', title: '复购-订阅月包' },
    { key: 'and_old_sub_oth_total', title: '复购-订阅其他项目' },
    { key: 'and_nosub_old_y_total', title: '复购-非订阅年包' },
    { key: 'and_nosub_old_m_total', title: '复购-非订阅月包' },
    { key: 'and_nosub_old_oth_total', title: '复购-非订阅其他项目' },
  ],
};

export const andColumns1 = [
  { dataIndex: 'and_new_sub', key: 'and_new_sub', title: '首购订阅' },
  { dataIndex: 'and_nosub_new', key: 'and_nosub_new', title: '首购非订阅' },
  { dataIndex: 'and_old_sub', key: 'and_old_sub', title: '复购订阅' },
  { dataIndex: 'and_nosub_old', key: 'and_nosub_old', title: '复购非订阅' },
  { dataIndex: 'and_new_sub_y_total', key: 'and_new_sub_y_total', title: '首购-订阅年包' },
  { dataIndex: 'and_new_sub_m_total', key: 'and_new_sub_m_total', title: '首购-订阅月包' },
  { dataIndex: 'and_new_sub_oth_total', key: 'and_new_sub_oth_total', title: '首购-订阅其他项目' },
  { dataIndex: 'and_nosub_new_y_total', key: 'and_nosub_new_y_total', title: '首购-非订阅年包' },
  { dataIndex: 'and_nosub_new_m_total', key: 'and_nosub_new_m_total', title: '首购-非订阅月包' },
  { dataIndex: 'and_nosub_new_oth_total', key: 'and_nosub_new_oth_total', title: '首购-非订阅其他项目' },
  { dataIndex: 'and_old_sub_y_total', key: 'and_old_sub_y_total', title: '复购-订阅年包' },
  { dataIndex: 'and_old_sub_m_total', key: 'and_old_sub_m_total', title: '复购-订阅月包' },
  { dataIndex: 'and_old_sub_oth_total', key: 'and_old_sub_oth_total', title: '复购-订阅其他项目' },
  { dataIndex: 'and_nosub_old_y_total', key: 'and_nosub_old_y_total', title: '复购-非订阅年包' },
  { dataIndex: 'and_nosub_old_m_total', key: 'and_nosub_old_m_total', title: '复购-非订阅月包' },
  { dataIndex: 'and_nosub_old_oth_total', key: 'and_nosub_old_oth_total', title: '复购-非订阅其他项目' },
];
export const andColumns = [
  {
    dataIndex: 'and_new_sub_y_total/and_add_user_total',
    key: 'and_new_sub_y_total/and_add_user_total',
    title: '付费率-订阅年包',
  },
  {
    dataIndex: 'and_new_sub_m_total/and_add_user_total',
    key: 'and_new_sub_m_total/and_add_user_total',
    title: '付费率-订阅月包',
  },
  {
    dataIndex: 'and_nosub_new_y_total/and_add_user_total',
    key: 'and_nosub_new_y_total/and_add_user_total',
    title: '付费率-非订阅年包',
  },
  {
    dataIndex: 'and_nosub_new_m_total/and_add_user_total',
    key: 'and_nosub_new_m_total/and_add_user_total',
    title: '付费率-非订阅月包',
  },
];

export const appProductList = [
  { key: 'viva', app_product: 'VivaVideo' },
  { key: 'vivamini', app_product: '趣影' },
  { key: 'sp', app_product: 'SlidePlus' },
  { key: 'tempo', app_product: 'Tempo' },
  { key: 'vivacut', app_product: 'VivaCut' },
  { key: 'picsfox', app_product: 'picsfox' },
  { key: 'VidStatus', app_product: 'VidStatus' },
  { key: 'Vmix', app_product: 'Vmix' },
  { key: 'Glitch', app_product: 'Glitch' },
  { key: 'Facee', app_product: 'Facee' },
];

export const appProductJSON = {
  VivaVideo: 'viva',
  趣影: 'vivamini',
  SlidePlus: 'sp',
  Tempo: 'tempo',
  VivaCut: 'vivacut',
};
