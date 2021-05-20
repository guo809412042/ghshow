/*
 * @Author: ssssslf
 * @Date: 2020-01-15 17:46:27
 * @LastEditTime : 2020-02-10 14:55:48
 * @LastEditors  : ssssslf
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/money/funnelPay/components/contants.js
 */

const date = {
  dataIndex: 'ds',
  title: '日期',
};

const DAU = {
  dataIndex: 'dau',
  title: 'DAU',
};

const inVipUsrCnt = {
  dataIndex: 'in_vip_usr_cnt',
  title: '进入购买页人数',
};

const inVipUsrCntDAU = {
  dataIndex: 'in_vip_usr_cnt/DAU',
  title: 'VIP购买页面进入率(%)',
};

const clkPlyUsrCnt = {
  dataIndex: 'clk_ply_usr_cnt',
  title: '点击购买按钮用户数',
};

const clkPlyUsrCntInVipUsrCnt = {
  dataIndex: 'clk_ply_usr_cnt/in_vip_usr_cnt',
  title: 'VIP购买按钮点击率(%)',
};

const startPlyUsrCnt = {
  title: '发起购买人数',
  dataIndex: 'start_ply_usr_cnt',
};
const startPlyUsrCntClkPlyUsrCnt = {
  title: '发起购买率(%)',
  dataIndex: 'start_ply_usr_cnt/clk_ply_usr_cnt',
};
const startPlyUsrCntClkPlyUsrCnt1 = {
  title: '发起购买率(%)',
  dataIndex: 'start_ply_usr_cnt/in_vip_usr_cnt',
};

const singlePlyUsrCnt = {
  title: '单次付费用户数',
  dataIndex: 'single_ply_usr_cnt',
};

const singlePlyUsrCntStartPlyUsrCnt = {
  title: '单次付费率(%)',
  dataIndex: 'single_ply_usr_cnt/start_ply_usr_cnt',
};

const signPlyUsrCnt = {
  dataIndex: 'sign_ply_usr_cnt',
  title: '签约付费用户数',
};

const signPlyUsrCntStartPlyUsrCnt = {
  title: '签约付费率(%)',
  dataIndex: 'sign_ply_usr_cnt/start_ply_usr_cnt',
};

const singlePlyMonthUsrCnt = {
  title: '单次付费-月包',
  dataIndex: 'one_month_ply_usr_cnt',
};

const singlePlyYearUsrCnt = {
  title: '单次付费-年包',
  dataIndex: 'one_year_ply_usr_cnt',
};

const singlePlyOtherUsrCnt = {
  title: '单次付费-其他',
  dataIndex: 'other_single_ply_usr_cnt',
  render: (text) => {
    const other = Number(text);
    return other > 0 ? other : 0;
  },
};

const signPlyMonthUsrCnt = {
  title: '签约付费-月包',
  dataIndex: 'sub_month_ply_usr_cnt',
};

const signPlyYearUsrCnt = {
  title: '签约付费-年包',
  dataIndex: 'sub_year_ply_usr_cnt',
};

const signPlyOtherUsrCnt = {
  title: '签约付费-其他',
  dataIndex: 'other_sign_ply_usr_cnt',
  render: (text) => {
    const other = Number(text);
    return other > 0 ? other : 0;
  },
};


export const columnsData = {
  Android: {
    1: [
      date,
      DAU,
      inVipUsrCnt,
      inVipUsrCntDAU,
      clkPlyUsrCnt,
      clkPlyUsrCntInVipUsrCnt,
      startPlyUsrCnt,
      startPlyUsrCntClkPlyUsrCnt,
      singlePlyUsrCnt,
      singlePlyMonthUsrCnt,
      singlePlyYearUsrCnt,
      singlePlyOtherUsrCnt,
      singlePlyUsrCntStartPlyUsrCnt,
      signPlyUsrCnt,
      signPlyMonthUsrCnt,
      signPlyYearUsrCnt,
      signPlyOtherUsrCnt,
      signPlyUsrCntStartPlyUsrCnt,
    ],
    2: [
      date,
      DAU,
      inVipUsrCnt,
      clkPlyUsrCnt,
      startPlyUsrCnt,
      singlePlyUsrCnt,
      singlePlyMonthUsrCnt,
      singlePlyYearUsrCnt,
      singlePlyOtherUsrCnt,
      signPlyUsrCnt,
      signPlyMonthUsrCnt,
      signPlyYearUsrCnt,
      signPlyOtherUsrCnt,
    ],
    3: [
      date,
      DAU,
      inVipUsrCntDAU,
      clkPlyUsrCntInVipUsrCnt,
      startPlyUsrCntClkPlyUsrCnt,
      singlePlyUsrCntStartPlyUsrCnt,
      signPlyUsrCntStartPlyUsrCnt,
    ],
  },
  IOS: {
    1: [
      date,
      DAU,
      inVipUsrCnt,
      inVipUsrCntDAU,
      clkPlyUsrCnt,
      clkPlyUsrCntInVipUsrCnt,
      startPlyUsrCnt,
      startPlyUsrCntClkPlyUsrCnt,
      signPlyUsrCnt,
      signPlyMonthUsrCnt,
      signPlyYearUsrCnt,
      signPlyOtherUsrCnt,
      signPlyUsrCntStartPlyUsrCnt,
    ],
    2: [
      date,
      DAU,
      inVipUsrCnt,
      clkPlyUsrCnt,
      startPlyUsrCnt,
      signPlyUsrCnt,
      signPlyMonthUsrCnt,
      signPlyYearUsrCnt,
      signPlyOtherUsrCnt,
    ],
    3: [
      date,
      DAU,
      inVipUsrCntDAU,
      clkPlyUsrCntInVipUsrCnt,
      startPlyUsrCntClkPlyUsrCnt,
      signPlyUsrCntStartPlyUsrCnt,
    ],
  },
  GP: {
    1: [
      date,
      DAU,
      inVipUsrCnt,
      inVipUsrCntDAU,
      startPlyUsrCnt,
      startPlyUsrCntClkPlyUsrCnt1,
      signPlyUsrCnt,
      signPlyMonthUsrCnt,
      signPlyYearUsrCnt,
      signPlyOtherUsrCnt,
      signPlyUsrCntStartPlyUsrCnt,
    ],
    2: [
      date,
      DAU,
      inVipUsrCnt,
      startPlyUsrCnt,
      signPlyUsrCnt,
      signPlyMonthUsrCnt,
      signPlyYearUsrCnt,
      signPlyOtherUsrCnt,
    ],
    3: [
      date,
      DAU,
      inVipUsrCntDAU,
      startPlyUsrCntClkPlyUsrCnt1,
      signPlyUsrCntStartPlyUsrCnt,
    ],
  },
};


export const initata = {
  Android: [
    {
      span: 18,
      offset: 3,
      name: 'DAU',
      value: 0,
      color: '#eea2a2',
      percent: [
        {
          percentTitle: 'VIP购买页面进入率',
          percent: '0%',
        },
      ],
    },
    {
      span: 16,
      offset: 4,
      name: '进入VIP购买页面用户',
      value: 0,
      color: '#bbc1bf',
      percent: [
        {
          percentTitle: 'ViP购买点击率',
          percent: '0%',
        },
      ],
    },
    {
      span: 14,
      offset: 5,
      name: '购买点击用户数',
      value: 0,
      color: '#57c6e1',
      percent: [
        {
          percentTitle: '发起购买率',
          percent: '0%',
        },
      ],
    },
    {
      span: 12,
      offset: 6,
      name: '发起购买成功',
      value: 0,
      color: '#b49fda',
      percent: [
        {
          percentTitle: '单次付费率',
          percent: '0%',
        },
        {
          percentTitle: '签约付费率',
          percent: '0%',
        },
      ],
    },
    {
      span: 10,
      offset: 7,
      color: '#7ac5d8',
      double: true,
      data: [
        {
          name: '单次付费人数',
          value: 0,
        },
        {
          name: '签约付费人数',
          value: 0,
        },
      ],
    },
  ],
  IOS: [
    {
      span: 18,
      offset: 3,
      name: 'DAU',
      value: 0,
      color: '#eea2a2',
      percent: [
        {
          percentTitle: 'VIP购买页面进入率',
          percent: '0%',
        },
      ],
    },
    {
      span: 16,
      offset: 4,
      name: '进入VIP购买页面用户',
      value: 0,
      color: '#bbc1bf',
      percent: [
        {
          percentTitle: 'ViP购买点击率',
          percent: '0%',
        },
      ],
    },
    {
      span: 14,
      offset: 5,
      name: '购买点击用户数',
      value: 0,
      color: '#57c6e1',
      percent: [
        {
          percentTitle: '发起购买率',
          percent: '0%',
        },
      ],
    },
    {
      span: 12,
      offset: 6,
      name: '发起购买成功',
      value: 0,
      color: '#b49fda',
      percent: [
        {
          percentTitle: '签约付费率',
          percent: '0%',
        },
      ],
    },
    {
      span: 10,
      offset: 7,
      name: '签约付费人数',
      value: 0,
      color: '#7ac5d8',
    },
  ],
  GP: [
    {
      span: 18,
      offset: 3,
      name: 'DAU',
      value: 0,
      color: '#eea2a2',
      percent: [
        {
          percentTitle: 'VIP购买页面进入率',
          percent: '0%',
        },
      ],
    },
    {
      span: 16,
      offset: 4,
      name: '进入VIP购买页面用户',
      value: 0,
      color: '#bbc1bf',
      percent: [
        {
          percentTitle: '发起购买率',
          percent: '0%',
        },
      ],
    },
    {
      span: 14,
      offset: 5,
      name: '发起购买成功',
      value: 0,
      color: '#b49fda',
      percent: [
        {
          percentTitle: '签约付费率',
          percent: '0%',
        },
      ],
    },
    {
      span: 12,
      offset: 6,
      name: '签约付费人数',
      value: 0,
      color: '#7ac5d8',
    },
  ],
};
