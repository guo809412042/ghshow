import * as sqls from './sqlTempalte';

// type 按照什么group by
// value  取值
export const cardData = [
  {
    title: '每日新增用户',
    sql: sqls.newUserSQL,
    keys: {
      1: '新增并活跃用户(2001事件)',
      100: '新增用户(包含活跃与未活跃)',
      200: '新增并活跃用户(2001+app_launch事件)',
    },
    type: 'dau_type',
    value: 'new_usr_cnt_1d',
  },
  {
    title: '日活分层',
    sql: sqls.dauSQL,
    keys: {
      1: '当天注册新用户',
      2: '一周内注册老用户',
      3: '一个月内注册老用户',
      100: '一个月前注册老用户',
    },
    type: 'new_user',
    value: 'new_usr_cnt_1d',
  },
  {
    title: '1日用户活跃，7日用户活跃，30日用户活跃',
    sql: sqls.userActiveSQL,
    keys: {
      1: 'DAU',
      2: 'WAU',
      3: 'MAU',
    },
    type: 'dau_type',
    value: 'dau_cnt',
  },
  {
    title: '留存率',
    sql: sqls.remainSQL,
    keys: {
      active_all: '所有活跃(对应2001+1999事件)',
      user: '用户留存(对应2001事件)',
      rolling: 'rolling用户留存(对应app_lauch事件)',
    },
    denominator: 'stay_num',
    molecular: 'reg_num',
    suffix: true,
    type: 'type',
    value: 'stay_ratio',
  },
  {
    title: '每日累计用户量',
    sql: sqls.duidTotalSQL,
    noType: true,
    value: 'duid_total',
  },
  {
    title: '新用户7日用户rolloing_DAU留存率',
    sql: sqls.rolloingDAUSQL,
    keys: {
      active_all: '所有活跃(对应2001+1999事件)',
      user: '用户留存(对应2001事件)',
      rolling: 'rolling用户留存(对应app_lauch事件)',
    },
    denominator: 'stay_num',
    molecular: 'reg_num',
    suffix: true,
    type: 'type',
    value: 'stay_ratio7',
  },
  {
    title: '导出成功率',
    sql: sqls.expSQL,
    denominator: 'exp_suced_cnt_1d',
    molecular: 'exp_start_cnt_1d',
    type: 'exp_suced_cnt_1d',
    value: 'exp_start_cnt_1d',
    suffix: true,
    nochannel: true,
  },
  {
    title: '导出失败率',
    sql: sqls.expSQL,
    denominator: 'exp_failed_cnt_1d',
    molecular: 'exp_start_cnt_1d',
    type: 'exp_failed_cnt_1d',
    value: 'exp_start_cnt_1d',
    suffix: true,
    nochannel: true,
  },
  {
    title: '导出取消率',
    sql: sqls.expSQL,
    denominator: 'exp_cancel_cnt_1d',
    molecular: 'exp_start_cnt_1d',
    type: 'exp_cancel_cnt_1d',
    value: 'exp_start_cnt_1d',
    suffix: true,
    nochannel: true,
  },
  {
    title: '导出崩溃率',
    sql: sqls.collapseSQL,
    noType: true,
    value: 'collapse',
    nochannel: true,
  },
  {
    title: '平均导出速度',
    sql: sqls.expSQL,
    denominator: 'exp_fsize_1d',
    molecular: 'exp_time_1d',
    type: 'exp_fsize_1d',
    value: 'exp_time_1d',
    suffix: false,
    alias: 'kb/s',
    nochannel: true,
  },
  {
    title: '平均导出时长',
    sql: sqls.expTimeSQL,
    noType: true,
    value: 'exp_time_1d',
    nochannel: true,
  },
  {
    title: '平均导出文件大小',
    sql: sqls.expSizeSQL,
    noType: true,
    value: 'exp_fsize_1d',
    nochannel: true,
    selectList: [
      { value: '480', label: '480' },
      { value: '720', label: '720' },
      { value: '1080', label: '1080' },
      { value: '4K', label: '4K' },
    ],
  },
];