/* eslint-disable no-restricted-syntax */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-30 17:23:16
 * @LastEditTime: 2020-04-27 11:05:24
 * @LastEditors: ssssslf
 */
export const COUNTRY = {
  1: '中国',
  2: '美国',
  3: '日本',
  4: '韩国',
  5: '台湾',
  6: '泰国',
  7: '第二三梯队',
};

export const CHANNEL_TYPE = {
  1: '自然',
  2: '投放',
};

export const DATA_TYPE = {
  1: '真实',
  2: '预测',
  3: '真实预测',
};

export const TYPES = {
  1: '保守',
  2: '激进',
};

export const allColumns = [
  { dataIndex: 'country', key: 'country', title: '地区' },
  { dataIndex: 'day', key: 'day', title: '时间' },
  { title: '数据类型' },
];

export const BASIC_COLUMNS = [
  { title: '地区', key: 'country', dataIndex: 'country' },
  { title: '时间', key: 'date_time', dataIndex: 'date_time' },
  {
    title: '渠道类型',
    key: 'channel',
    dataIndex: 'channel',
    render: text => CHANNEL_TYPE[text],
  },
  {
    title: '预测类型',
    key: 'type',
    dataIndex: 'type',
    render: text => TYPES[text],
  },
];
// 非中国自然
export const ORGANIC_NOT_CN_COLUMNS = [
  {
    title: '订阅销售额（美元）',
    children: [
      // B
      { title: '销售总额', key: 'amt_total', dataIndex: 'amt_total' },
      // C
      { title: 'GP销售额', key: 'gp_amt_total', dataIndex: 'gp_amt_total' },
      // D
      { title: 'iOS销售额', key: 'ios_amt_total', dataIndex: 'ios_amt_total' },
    ],
  },
  {
    title: '首购（新增）',
    children: [
      // E
      { title: 'GP月包', key: 'gp_new_month', dataIndex: 'gp_new_month' },
      // F
      { title: 'GP年包', key: 'gp_new_year', dataIndex: 'gp_new_year' },
      // G
      { title: 'iOS月包', key: 'ios_new_month', dataIndex: 'ios_new_month' },
      // H
      { title: 'iOS年包', key: 'ios_new_year', dataIndex: 'ios_new_year' },
    ],
  },
  {
    title: '续购',
    children: [
      // I
      { title: 'GP月续', key: 'gp_old_month', dataIndex: 'gp_old_month' },
      // J
      { title: 'GP年续', key: 'gp_old_year', dataIndex: 'gp_old_year' },
      // K
      { title: 'iOS月续', key: 'ios_old_month', dataIndex: 'ios_old_month' },
      // L
      { title: 'iOS年续', key: 'ios_old_year', dataIndex: 'ios_old_year' },
    ],
  },
  {
    title: '首购率',
    children: [
      // M
      { title: '月包付费率-GP', key: 'gp_new_month_rate', dataIndex: 'gp_new_month_rate' },
      // N
      { title: '年包付费率-GP', key: 'gp_new_year_rate', dataIndex: 'gp_new_year_rate' },
      // O
      { title: '月包付费率-iOS', key: 'ios_new_month_rate', dataIndex: 'ios_new_month_rate' },
      // P
      { title: '年包付费率-iOS', key: 'ios_new_year_rate', dataIndex: 'ios_new_year_rate' },
    ],
  },
  // {
  //   title: '月-续购率',
  //   children: [
  //     // Q
  //     { title: 'GP-月续购率', key: 'month_renewal_gp', dataIndex: 'month_renewal_gp' },
  //     // R
  //     { title: 'iOS-月续购率', key: 'month_renewal_ios', dataIndex: 'month_renewal_ios' },
  //   ],
  // },
  {
    title: '月新增',
    children: [
      // S
      { title: 'GP', key: 'zr_gp_new', dataIndex: 'zr_gp_new' },
      // T
      { title: 'iOS', key: 'zr_ios_new', dataIndex: 'zr_ios_new' },
    ],
  },
];
// 中国自然
export const ORGANIC_CN_COLUMNS = [
  {
    title: '订阅销售额（美元）',
    children: [
      // B
      { title: '销售总额', key: 'amt_total', dataIndex: 'amt_total' },
      // C
      { title: '安卓销售额', key: 'and_amt_total', dataIndex: 'and_amt_total' },
      // D
      { title: 'iOS销售额', key: 'ios_amt_total', dataIndex: 'ios_amt_total' },
    ],
  },
  {
    title: '首购（新增）',
    children: [
      // E
      { title: '单次购买-首购-月包', key: 'anrd_one_new_month', dataIndex: 'anrd_one_new_month' },
      // F
      {
        title: '自动续订-首购-月包',
        key: 'anrd_sub_new_month',
        dataIndex: 'anrd_sub_new_month',
      },
      // G
      {
        title: '单次购买-首购-年包',
        key: 'anrd_one_new_year',
        dataIndex: 'anrd_one_new_year',
      },
      // H
      {
        title: 'iOS月包',
        key: 'ios_new_month',
        dataIndex: 'ios_new_month',
      },
      // I
      {
        title: 'iOS年包',
        key: 'ios_new_year',
        dataIndex: 'ios_new_year',
      },
    ],
  },
  {
    title: '续购',
    children: [
      // J
      { title: '单次购买-续购-月包', key: 'anrd_one_old_month', dataIndex: 'anrd_one_old_month' },
      // K
      { title: '自动续订-续购-月包', key: 'anrd_sub_old_month', dataIndex: 'anrd_sub_old_month' },
      // L
      { title: '单次购买-续购-年包', key: 'anrd_one_old_year', dataIndex: 'anrd_one_old_year' },
      // M
      { title: 'iOS月续', key: 'ios_old_month', dataIndex: 'ios_old_month' },
      // N
      { title: 'iOS年续', key: 'ios_old_year', dataIndex: 'ios_old_year' },
    ],
  },
  {
    title: '首购率',
    children: [
      // O
      { title: '安卓-自动续订-月包转化率', key: 'and_month_rate', dataIndex: 'and_month_rate' },
      // P
      { title: 'iOS-月包转化率', key: 'ios_new_month_rate', dataIndex: 'ios_new_month_rate' },
      // Q
      { title: 'iOS-年包转化率', key: 'ios_new_year_rate', dataIndex: 'ios_new_year_rate' },
    ],
  },
  {
    title: '月-续购率',
    children: [
      // R
      { title: '安卓-自动续订-月续订率', key: 'and_sub_old_month_rate', dataIndex: 'and_sub_old_month_rate' },
      // S
      { title: 'iOS-月订购率', key: 'ios_sub_month_rate', dataIndex: 'ios_sub_month_rate' },
    ],
  },
  {
    title: '月新增',
    children: [
      // T
      { title: '安卓', key: 'zr_and_new_usr', dataIndex: 'zr_and_new_usr' },
      // U
      { title: 'iOS', key: 'zr_ios_new_usr', dataIndex: 'zr_ios_new_usr' },
    ],
  },
];
// 非中国投放
export const PUT_NOT_CN_COLUMNS = [
  {
    title: '首购率',
    children: [
      // B
      { title: 'GP月首购率', dataIndex: 'gp_new_month_rate', key: 'gp_new_month_rate' },
      // C
      { title: 'GP年首购率', dataIndex: 'gp_new_year_rate', key: 'gp_new_year_rate' },
      // D
      { title: 'iOS月首购率', dataIndex: 'ios_new_month_rate', key: 'ios_new_month_rate' },
      // E
      { title: 'iOS年首购率', dataIndex: 'ios_new_year_rate', key: 'ios_new_year_rate' },
    ],
  },
  {
    title: '首购（新增）',
    children: [
      // F
      { title: 'GP月包', key: 'gp_new_month_usr_cnt_1d', dataIndex: 'gp_new_month_usr_cnt_1d' },
      // G
      { title: 'GP年包', key: 'gp_new_year_usr_cnt_1d', dataIndex: 'gp_new_year_usr_cnt_1d' },
      // H
      { title: 'iOS月包', key: 'ios_new_month_usr_cnt_1d', dataIndex: 'ios_new_month_usr_cnt_1d' },
      // I
      { title: 'iOS年包', key: 'ios_new_year_usr_cnt_1d', dataIndex: 'ios_new_year_usr_cnt_1d' },
    ],
  },
  {
    title: '续购',
    children: [
      // J
      { title: 'GP月续', key: 'gp_old_month_usr_cnt_1d', dataIndex: 'gp_old_month_usr_cnt_1d' },
      // K
      { title: 'GP年续', key: 'gp_old_year_usr_cnt_1d', dataIndex: 'gp_old_year_usr_cnt_1d' },
      // L
      { title: 'iOS月续', key: 'ios_old_month_usr_cnt_1d', dataIndex: 'ios_old_month_usr_cnt_1d' },
      // M
      { title: 'iOS年续', key: 'ios_old_year_usr_cnt_1d', dataIndex: 'ios_old_year_usr_cnt_1d' },
    ],
  },
  {
    title: '月续购率',
    children: [
      // N
      { title: 'GP月续购率', key: 'gp_sub_month_rate', dataIndex: 'gp_sub_month_rate' },
      // O
      { title: 'iOS月续购率', key: 'ios_sub_month_rate', dataIndex: 'ios_sub_month_rate' },
    ],
  },
  {
    title: '投放自然arpu比',
    children: [
      // P
      { title: 'iOS投放自然arpu比', key: 'ios_put_org_year_arpu', dataIndex: 'ios_put_org_year_arpu' },
      // Q
      { title: 'GP投放自然arpu比', key: 'and_put_org_year_arpu', dataIndex: 'and_put_org_year_arpu' },
    ],
  },
  {
    title: '安卓新增',
    children: [
      // R
      { title: 'GP总新增', key: 'gp_new_usr_cnt_1d', dataIndex: 'gp_new_usr_cnt_1d' },
      // S
      { title: 'GP搜索新增', key: 'and_search_new_cnt', dataIndex: 'and_search_new_cnt' },
      // T
      { title: 'GP其它新增', key: 'and_other_new_cnt', dataIndex: 'and_other_new_cnt' },
    ],
  },
  {
    title: 'iOS新增',
    children: [
      // U
      { title: 'iOS总新增', key: 'ios_new_usr_cnt_1d', dataIndex: 'ios_new_usr_cnt_1d' },
      // V
      { title: 'iOS搜索新增', key: 'ios_search_new_cnt', dataIndex: 'ios_search_new_cnt' },
      // W
      { title: 'iOS其它新增', key: 'ios_other_new_cnt', dataIndex: 'ios_other_new_cnt' },
    ],
  },
  {
    title: 'CPA',
    children: [
      // X
      { title: 'GP搜索cpa', key: 'and_search_cpa', dataIndex: 'and_search_cpa' },
      // Y
      { title: 'GP其它cpa', key: 'and_other_cpa', dataIndex: 'and_other_cpa' },
      // Z
      { title: 'iOS搜索cpa', key: 'ios_search_cpa', dataIndex: 'ios_search_cpa' },
      // AA
      { title: 'iOS其它cpa', key: 'ios_other_cpa', dataIndex: 'ios_other_cpa' },
    ],
  },
  {
    title: '总收入、总消耗',
    children: [
      // AB
      { title: 'GP总收入', key: 'gp_income', dataIndex: 'gp_income' },
      // AC
      { title: 'GP总消耗', key: 'gp_cost', dataIndex: 'gp_cost' },
      // AD
      { title: 'iOS总收入', key: 'ios_income', dataIndex: 'ios_income' },
      // AE
      { title: 'iOS总消耗', key: 'ios_cost', dataIndex: 'ios_cost' },
    ],
  },
  {
    title: '月收、年收',
    children: [
      // AF
      { title: 'GP月收入', key: 'gp_month_income', dataIndex: 'gp_month_income' },
      // AG
      { title: 'GP年收入', key: 'gp_year_income', dataIndex: 'gp_year_income' },
      // AH
      { title: 'iOS月收入', key: 'ios_month_income', dataIndex: 'ios_month_income' },
      // AI
      { title: 'iOS年收入', key: 'ios_year_income', dataIndex: 'ios_year_income' },
    ],
  },
  {
    title: 'ARPU',
    children: [
      // AJ
      { title: 'gp-arpu', key: 'gp_arpu', dataIndex: 'gp_arpu' },
      // AK
      { title: 'ios-arpu', key: 'ios_arpu', dataIndex: 'ios_arpu' },
    ],
  },
];
// 中国投放
export const PUT_CN_COLUMNS = [
  {
    title: '付费率',
    children: [
      // B
      { title: '安卓自动续订-月包转化率', dataIndex: 'and_month_rate', key: 'and_month_rate' },
      // C
      { title: 'iOS月付费率', dataIndex: 'ios_new_month_rate', key: 'ios_new_month_rate' },
      // D
      { title: 'iOS年付费率', dataIndex: 'ios_new_year_rate', key: 'ios_new_year_rate' },
    ],
  },
  {
    title: '首购（新增）',
    children: [
      // E
      { title: '自动续订-首购-月包', key: 'anrd_sub_new_month_usr_cnt_1d', dataIndex: 'anrd_sub_new_month_usr_cnt_1d' },
      // F
      {
        title: '安卓单次购买-首购月包',
        key: 'anrd_one_new_month_usr_cnt_1d',
        dataIndex: 'anrd_one_new_month_usr_cnt_1d',
      },
      // G
      {
        title: '安卓单次购买-首购年包',
        key: 'anrd_one_new_year_usr_cnt_1d',
        dataIndex: 'anrd_one_new_year_usr_cnt_1d',
      },
      // H
      { title: 'iOS月首购', dataIndex: 'ios_new_month_usr_cnt_1d', key: 'ios_new_month_usr_cnt_1d' },
      // I
      { title: 'iOS年首购', dataIndex: 'ios_new_year_usr_cnt_1d', key: 'ios_new_year_usr_cnt_1d' },
    ],
  },
  {
    title: '续购',
    children: [
      // J
      { title: '自动续订-续购-月包', key: 'anrd_sub_old_month_usr_cnt_1d', dataIndex: 'anrd_sub_old_month_usr_cnt_1d' },
      // K
      {
        title: '安卓单次购买-续购-月包',
        key: 'anrd_one_old_month_usr_cnt_1d',
        dataIndex: 'anrd_one_old_month_usr_cnt_1d',
      },
      // L
      {
        title: '安卓单次购买-续购-年包',
        key: 'anrd_one_old_year_usr_cnt_1d',
        dataIndex: 'anrd_one_old_year_usr_cnt_1d',
      },
      // N
      { title: 'iOS月续', key: 'ios_old_month_usr_cnt_1d', dataIndex: 'ios_old_month_usr_cnt_1d' },
      // M
      { title: 'iOS年续', key: 'ios_old_year_usr_cnt_1d', dataIndex: 'ios_old_year_usr_cnt_1d' },
    ],
  },
  {
    title: '月续购率',
    children: [
      // O
      { title: '安卓月续购率', key: 'and_sub_old_month_rate', dataIndex: 'and_sub_old_month_rate' },
      // P
      { title: 'iOS月续购率', key: 'ios_sub_month_rate', dataIndex: 'ios_sub_month_rate' },
    ],
  },
  {
    title: '投放自然arpu比',
    children: [
      // Q
      { title: '安卓投放自然arpu比', key: 'and_put_org_year_arpu', dataIndex: 'and_put_org_year_arpu' },
      // R
      { title: 'iOS投放自然arpu比', key: 'ios_put_org_year_arpu', dataIndex: 'ios_put_org_year_arpu' },
    ],
  },
  {
    title: '新增',
    children: [
      // S
      { title: '安卓总新增', key: 'anrd_new_usr_cnt_1d', dataIndex: 'anrd_new_usr_cnt_1d' },
      // T
      { title: 'iOS总新增', key: 'ios_new_usr_cnt_1d', dataIndex: 'ios_new_usr_cnt_1d' },
    ],
  },
  {
    title: 'CPA',
    children: [
      // U
      { title: '安卓cpa', key: 'and_cpa', dataIndex: 'and_cpa' },
      // V
      { title: 'iOScpa', key: 'ios_cpa', dataIndex: 'ios_cpa' },
    ],
  },
  {
    title: '总收入、总消耗',
    children: [
      // W
      { title: '安卓总收入', key: 'and_income', dataIndex: 'and_income' },
      // X
      { title: '安卓总消耗', key: 'and_cost', dataIndex: 'and_cost' },
      // Y
      { title: 'iOS总收入', key: 'ios_income', dataIndex: 'ios_income' },
      // Z
      { title: 'iOS总消耗', key: 'ios_cost', dataIndex: 'ios_cost' },
      // AA
      { title: '安卓月收入', key: 'and_month_income', dataIndex: 'and_month_income' },
      // AB
      { title: '安卓年收入', key: 'and_year_income', dataIndex: 'and_year_income' },
      // AC
      { title: 'iOS月收入', key: 'ios_month_income', dataIndex: 'ios_month_income' },
      // AD
      { title: 'iOS年收入', key: 'ios_year_income', dataIndex: 'ios_year_income' },
    ],
  },
  {
    title: 'ARPU',
    children: [
      // AE
      { title: '安卓-arpu', key: 'and_arpu', dataIndex: 'and_arpu' },
      // AF
      { title: 'ios-arpu', key: 'ios_arpu', dataIndex: 'ios_arpu' },
    ],
  },
];

export const ORGANIC_NOT_CN_FORM = [
  {
    title: '首购率',
    children: [
      { label: '月包付费率-GP', key: 'month_rate_gp' },
      { label: '年包付费率-GP', key: 'year_rate_gp' },
      { label: '月包付费率-iOS', key: 'month_rate_ios' },
      { label: '年包付费率-iOS', key: 'year_rate_ios' },
    ],
  },
  {
    title: '续购',
    children: [
      { label: '年续-GP', key: 'year_renewal_gp' },
      { label: '年续-iOS', key: 'year_renewal_ios' },
      { label: '月续购率-GP', key: 'month_renewal_gp' },
      { label: '月续购率-iOS', key: 'month_renewal_ios' },
      { label: '月续初始值-GP', key: 'month_init_gp' },
      { label: '月续初始值-iOS', key: 'month_init_ios' },
    ],
  },
  {
    title: '单价',
    children: [
      { label: '月单价-GP', key: 'month_unit_gp' },
      { label: '年单价-GP', key: 'year_unit_gp' },
      { label: '月单价-iOS', key: 'month_unit_ios' },
      { label: '年单价-iOS', key: 'year_unit_ios' },
    ],
  },
  {
    title: '新增',
    children: [{ label: '月新增-GP', key: 'month_new_gp' }, { label: '月新增-iOS', key: 'month_new_ios' }],
  },
];

export const ORGANIC_CN_FORM = [
  {
    title: '首购率',
    children: [
      { label: '自动续订-月包转化率-安卓', key: 'year_conversion_and' },
      { label: '月包转化率-iOS', key: 'month_conversion_ios' },
      { label: '年包转化率-iOS', key: 'year_conversion_ios' },
    ],
  },
  {
    title: '续购',
    children: [
      { label: '安卓-自动续订-月续订率', key: 'month_renewal_and' },
      { label: '单次购买-续购-月包用户', key: 'month_renewal_once_user' },
      { label: '单次购买-续购-年包用户', key: 'year_renewal_once_user' },
      { label: '月续订率-iOS', key: 'month_order_rate_ios' },
      { label: '年续用户-iOS', key: 'year_renewal_uesr_ios' },
      { label: '月续用户-iOS', key: 'month_renewal_uesr_ios' },
      { label: '自动续订-续购-月包用户初始值', key: 'month_renewal_init_user' },
    ],
  },
  {
    title: '单价',
    children: [
      { label: '单次购买-月单价-安卓', key: 'month_pay_once_and' },
      { label: '单次购买-年单价-安卓', key: 'year_pay_once_and' },
      { label: '月自动续订-月单价-安卓', key: 'month_renewal_unit_and' },
      { label: '月单价-iOS', key: 'month_unit_ios' },
      { label: '年单价-iOS', key: 'year_unit_ios' },
    ],
  },
  {
    title: '首购-单次购买',
    children: [{ label: '首购月包', key: 'month_first' }, { label: '首购年包', key: 'year_first' }],
  },
  {
    title: '新增',
    children: [{ label: '月新增-安卓', key: 'month_new_and' }, { label: '月新增-iOS', key: 'month_new_ios' }],
  },
];

export const PUT_NOT_CN_FROM = [
  {
    title: '新增',
    children: [
      { label: '搜索新增-GP', key: 'search_new_gp' },
      { label: '其它新增-GP', key: 'other_new_gp' },
      { label: '搜索新增-iOS', key: 'search_new_ios' },
      { label: '其它新增-iOS', key: 'other_new_ios' },
    ],
  },
  {
    title: '续购',
    children: [
      { label: '年续-GP', key: 'year_renewal_gp' },
      { label: '年续-iOS', key: 'year_renewal_ios' },
      { label: '月续初始值-GP', key: 'month_init_gp' },
      { label: '月续初始值-iOS', key: 'month_init_ios' },
    ],
  },
  {
    title: 'ARPU',
    children: [
      { label: '投放/自然ARPU-GP', key: 'put_organic_arpu_gp' },
      { label: '投放/自然ARPU-iOS', key: 'put_organic_arpu_ios' },
    ],
  },
  {
    title: 'CPA',
    children: [
      { label: 'gp-搜索', key: 'search_gp' },
      { label: 'gp-其它', key: 'other_gp' },
      { label: 'iOS-搜索', key: 'search_ios' },
      { label: 'iOS-其它', key: 'other_ios' },
    ],
  },
  {
    title: '首购',
    children: [{ label: '首购计算系数', key: 'calculation_first_purchase' }],
  },
];

export const PUT_CN_FROM = [
  {
    title: '新增',
    children: [{ label: '总新增-安卓', key: 'all_new_and' }, { label: '总新增-iOS', key: 'all_new_ios' }],
  },
  {
    title: '续购',
    children: [
      { label: '年续-安卓', key: 'year_renewal_and' },
      { label: '年续-iOS', key: 'year_renewal_ios' },
      { label: '月续初始值-安卓', key: 'month_init_and' },
      { label: '月续初始值-iOS', key: 'month_init_ios' },
    ],
  },
  {
    title: 'ARPU',
    children: [
      { label: '投放/自然ARPU-安卓', key: 'put_organic_arpu_gp' },
      { label: '投放/自然ARPU-iOS', key: 'put_organic_arpu_ios' },
    ],
  },
  {
    title: 'CPA',
    children: [{ label: '安卓', key: 'cpa_and' }, { label: 'iOS', key: 'cpa_ios' }],
  },
  {
    title: '单次购买',
    children: [
      { label: '首购月包', key: 'month_first' },
      { label: '首购年包', key: 'year_first' },
      { label: '续购月包', key: 'month_renewal' },
      { label: '续购年包', key: 'year_renewal' },
      { label: '首购计算系数', key: 'calculation_first_purchase' },
    ],
  },
];

export const downMode = (country, channel) => {
  const row = { columns: [] };
  if (country === '中国') {
    if (channel === '1') {
      row.data = [
        {
          date_time: '时间',
          amt_total: '订阅销售总额（安卓+iOS）',
          and_amt_total: '安卓总销售额',
          ios_amt_total: 'iOS总销售额',
          anrd_one_new_month: '单次购买-首购-月包',
          anrd_sub_new_month: '自动续订-首购-月包',
          anrd_one_new_year: '单次购买-首购-年包',
          ios_new_month: 'iOS月包',
          ios_new_year: 'iOS年包',
          anrd_one_old_month: '单次购买-续购-月包',
          anrd_sub_old_month: '自动续订-续购-月包',
          anrd_one_old_year: '单次购买-续购-年包',
          ios_old_month: 'iOS月续',
          ios_old_year: 'iOS年续',
          and_month_rate: '安卓-自动续订-月包转化率',
          ios_new_month_rate: 'iOS-月包转化率',
          ios_new_year_rate: 'iOS- 年包转化率',
          and_sub_old_month_rate: '安卓-自动续订-月续订率',
          ios_sub_month_rate: 'iOS-月续订率',
          zr_and_new_usr: '安卓-新增',
          zr_ios_new_usr: 'iOS-新增',
          and_one_pay_month: '安卓-单次购买-月单价',
          and_one_pay_year: '安卓-单次购买-年单价',
          and_sub_pay_month: '安卓-自动续订-月单价',
          ios_pay_month: 'iOS-月单价',
          ios_pay_year: 'iOS-年单价',
          first_date: '首月',
          country: '地区',
          channel: '渠道',
          type: '预测类型',
        },
      ];
      row.demo = [
        201911,
        661915.688,
        278470,
        383445.688,
        10000,
        11000,
        1000,
        2100,
        3150,
        5000,
        30000,
        1000,
        43931.2,
        3000,
        0.025,
        0.01,
        0.015,
        0.72,
        0.8,
        440000,
        210000,
        5.13,
        29.01,
        3.5,
        4.99,
        25,
        201911,
        '中国',
        '自然',
        '保守',
      ];
    } else {
      row.data = [
        {
          date_time: '时间',
          and_month_rate: '安卓-自动续订-月包转化率',
          ios_new_month_rate: 'ios-月付费率',
          ios_new_year_rate: 'ios-年付费率',
          anrd_sub_new_month_usr_cnt_1d: '自动续订-首购-月包',
          anrd_one_new_month_usr_cnt_1d: '单次购买-首购-月包',
          anrd_one_new_year_usr_cnt_1d: '单次购买-首购-年包',
          ios_new_month_usr_cnt_1d: 'IOS月包',
          ios_new_year_usr_cnt_1d: 'IOS年包',
          anrd_sub_old_month_usr_cnt_1d: '自动续订-续购-月包',
          anrd_one_old_month_usr_cnt_1d: '单次购买-续购-月包',
          anrd_one_old_year_usr_cnt_1d: '单次购买-续购-年包',
          ios_old_year_usr_cnt_1d: 'IOS年续',
          ios_old_month_usr_cnt_1d: 'IOS月续',
          and_sub_old_month_rate: '安卓-自动续订-月续订率',
          ios_sub_month_rate: 'iOS月续购率',
          and_org_year_arpu: 'and-自然年包arpu',
          and_org_month_arpu: 'and-自然月包arpu',
          ios_org_year_arpu: 'ios-自然年包arpu',
          ios_org_month_arpu: 'ios-自然月包arpu',
          and_put_org_year_arpu: 'and-投放比自然用户arpu比',
          ios_put_org_year_arpu: 'ios-投放比自然用户arpu比',
          and_put_year_arpu: 'and-投放年包arpu',
          and_put_month_arpu: 'and-投放月包arpu',
          ios_put_year_arpu: 'ios-投放年包arpu',
          ios_put_month_arpu: 'ios-投放月包arpu',
          and_one_sub_month_arppu: 'and-单次购买续购月包arppu',
          and_sub_month_arppu: 'and-续购月包arppu',
          ios_sub_month_arppu: 'ios-续购月包arppu',
          and_sub_year_arppu: 'and-续购年包arppu',
          ios_sub_year_arppu: 'ios-续购年包arppu',
          anrd_new_usr_cnt_1d: '安卓总新增',
          ios_new_usr_cnt_1d: 'IOS总新增',
          and_cpa: 'and-cpa',
          ios_cpa: 'ios-cpa',
          and_income: ' 安卓总收入',
          and_cost: ' 安卓总消耗',
          ios_income: ' IOS总收入',
          ios_cost: ' ios总消耗',
          and_month_income: '安卓月收入',
          and_year_income: '安卓年收入',
          ios_month_income: 'ios-月收入',
          ios_year_income: 'ios-年收入',
          and_arpu: '安卓-arpu',
          ios_arpu: 'ios-arpu',
          first_date: '首月',
          country: '地区',
          channel: '渠道',
          type: '预测类型',
        },
      ];
      row.demo = [
        201911,
        0.025,
        0.01,
        0.015,
        1466,
        1000,
        100,
        30,
        45,
        4000,
        500,
        100,
        300,
        3000,
        0.7,
        0.8,
        0.07,
        0.2,
        0.38,
        0.05,
        1.0,
        1.0,
        0.07,
        0.2,
        0.44,
        0.05,
        5.13,
        3.5,
        4.99,
        29.01,
        25.0,
        58635,
        3000,
        0.3,
        0.86,
        35299,
        17591,
        85008,
        2571,
        28532,
        6767,
        75000,
        10008,
        0.6,
        28.34,
        201911,
        '中国',
        '投放',
        '保守',
      ];
    }
  } else if (channel === '1') {
    row.data = [
      {
        date_time: '时间',
        amt_total: '订阅销售总额(GP+iOS)',
        gp_amt_total: 'GP总销售额',
        ios_amt_total: 'iOS总销售额',
        gp_new_month: 'GP月包',
        gp_new_year: 'GP年包',
        ios_new_month: 'iOS月包',
        ios_new_year: 'iOS年包',
        gp_old_month: 'GP月续',
        gp_old_year: 'GP年续',
        ios_old_month: 'iOS月续',
        ios_old_year: 'iOS年续',
        gp_new_month_rate: '月包付费率-GP',
        gp_new_year_rate: '年包付费率-GP',
        ios_new_month_rate: '月包付费率-iOS',
        ios_new_year_rate: '年包付费率-iOS',
        gp_sub_month_rate: 'GP-月续购率',
        ios_sub_month_rate: 'iOS-月续购率',
        zr_gp_new: 'GP-新增',
        zr_ios_new: 'iOS-新增',
        month_unit_gp: 'GP-月单价',
        year_unit_gp: 'GP-年单价',
        month_unit_ios: 'iOS-月单价',
        year_unit_ios: 'iOS-年单价',
        first_date: '首月',
        country: '地区',
        channel: '渠道',
        type: '预测类型',
      },
    ];
    row.demo = [
      201911,
      192198,
      45610,
      146589,
      538,
      1076,
      1200,
      2300,
      3500,
      400,
      12493,
      2300,
      0.011,
      0.022,
      0.012,
      0.023,
      0.8,
      0.9,
      48894,
      100000,
      3.99,
      19.99,
      3.99,
      19.99,
      201911,
      '美国',
      '自然',
      '激进',
    ];
  } else {
    row.data = [
      {
        date_time: '时间',
        gp_new_month_rate: 'GP月首购率',
        gp_new_year_rate: 'GP年首购率',
        ios_new_month_rate: 'ios月首购率',
        ios_new_year_rate: 'ios年首购率',
        gp_new_month_usr_cnt_1d: 'GP月包',
        gp_new_year_usr_cnt_1d: 'GP年包',
        ios_new_month_usr_cnt_1d: 'IOS月包',
        ios_new_year_usr_cnt_1d: 'IOS年包',
        gp_old_year_usr_cnt_1d: 'GP年续',
        gp_old_month_usr_cnt_1d: 'GP月续',
        ios_old_year_usr_cnt_1d: 'IOS年续',
        ios_old_month_usr_cnt_1d: 'IOS月续',
        gp_sub_month_rate: 'GP月续购率',
        ios_sub_month_rate: 'iOS月续购率',
        and_org_year_arpu: 'and-自然年包arpu',
        and_org_month_arpu: 'and-自然月包arpu',
        ios_org_year_arpu: 'ios-自然年包arpu',
        ios_org_month_arpu: 'ios-自然月包arpu',
        and_put_org_year_arpu: 'and-投放比自然用户arpu比',
        ios_put_org_year_arpu: 'ios-投放比自然用户arpu比',
        and_put_year_arpu: 'and-投放年包arpu',
        and_put_month_arpu: 'and-投放月包arpu',
        ios_put_year_arpu: 'ios-投放年包arpu',
        ios_put_month_arpu: 'ios-投放月包arpu',
        and_sub_month_arppu: 'and-续购月包arppu',
        ios_sub_month_arppu: 'ios-续购月包arppu',
        and_sub_year_arppu: 'and-续购年包arppu',
        ios_sub_year_arppu: 'ios-续购年包arppu',
        gp_new_usr_cnt_1d: 'GP总新增',
        and_search_new_cnt: 'and-搜索新增',
        and_other_new_cnt: 'and-其他新增',
        ios_new_usr_cnt_1d: 'IOS总新增',
        ios_search_new_cnt: 'ios-搜索新增',
        ios_other_new_cnt: 'ios-其他新增',
        and_search_cpa: 'and-搜索cpa',
        and_other_cpa: 'and-其他cpa',
        ios_search_cpa: 'ios-搜索cpa',
        ios_other_cpa: 'ios-其他cpa',
        gp_income: ' gp总收入',
        gp_cost: ' gp总消耗',
        ios_income: ' IOS总收入',
        ios_cost: ' ios总消耗',
        gp_month_income: 'gp月收入',
        gp_year_income: 'gp年收入',
        ios_month_income: 'ios-月收入',
        ios_year_income: 'ios-年收入',
        gp_arpu: 'gp-arpu',
        ios_arpu: 'ios-arpu',
        first_date: '首月',
        country: '地区',
        channel: '渠道',
        type: '预测类型',
      },
    ];
    row.demo = [
      201911,
      0,
      0,
      0,
      0,
      671,
      1342,
      14,
      26,
      0,
      5500,
      0,
      40,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      0,
      0,
      0,
      4,
      4,
      20,
      20,
      61000,
      60000,
      1000,
      1610,
      0,
      1610,
      1,
      0,
      1,
      0,
      61739,
      48200,
      977,
      483,
      29547,
      32192,
      237,
      740,
      1,
      1,
      201911,
      '美国',
      '投放',
      '保守',
    ];
  }
  row.columns = Object.keys(row.data[0]).map(v => ({
    key: v,
    title: v,
  }));
  return row;
};
