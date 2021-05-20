/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 16:19:54
 * @LastEditTime: 2020-05-20 17:04:45
 * @LastEditors: ssssslf
 */
// conditionExpr 在pTitle的判断上再加一个判断 显示
export const initData = [
  {
    title: 'DAU',
    pTitle: '用户行为漏斗',
    num: 'app_active_cnt',
  },
  {
    title: '日活&消费',
    pTitle: '用户行为漏斗',
    num: 'app_con_cnt',
  },
  {
    title: '日活&消费&工具',
    pTitle: '用户行为漏斗',
    num: 'app_con_tool_cnt',
  },
  {
    title: '消费用户量',
    pTitle: '用户行为漏斗',
    num: 'con_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '消费用户占比(%)',
    pTitle: '用户行为漏斗',
    num: 'con_cnt%app_active_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '分享用户量',
    pTitle: '用户行为漏斗',
    num: 'shr_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '分享用户占比(%)',
    pTitle: '用户行为漏斗',
    num: 'shr_cnt%app_active_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '发布用户量',
    pTitle: '用户行为漏斗',
    num: 'pub_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '发布用户占比(%)',
    pTitle: '用户行为漏斗',
    num: 'pub_cnt%app_active_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '工具用户量',
    pTitle: '用户行为漏斗',
    num: 'tool_enter_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '工具用户占比(%)',
    pTitle: '用户行为漏斗',
    num: 'tool_enter_cnt%app_active_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '工具制作用户量',
    pTitle: '用户行为漏斗',
    num: 'tool_made_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '工具制作用户占比(%)',
    pTitle: '用户行为漏斗',
    num: 'tool_made_cnt%app_active_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '工具分享用户量',
    pTitle: '用户行为漏斗',
    num: 'tool_sus_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '工具分享用户占比(%)',
    pTitle: '用户行为漏斗',
    num: 'tool_sus_cnt%app_active_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '社区活跃用户量',
    pTitle: '社区数据',
    num: 'cmty_act_cnt',
  },
  {
    title: '社区活跃次留(%)',
    pTitle: '社区数据',
    num: 'cmty_act_stay_cnt%pre_cmty_act_cnt',
  },
  {
    title: '社区app留存(%)',
    pTitle: '社区数据',
    num: 'cmty_act_app_stay_cnt%pre_cmty_act_cnt',
  },
  {
    title: '消费用户量',
    pTitle: '社区数据',
    num: 'con_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '消费用户占比',
    pTitle: '社区数据',
    num: 'con_cnt%cmty_act_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '消费次留(%)',
    pTitle: '社区数据',
    num: 'con_stay_cnt%pre_con_cnt',
  },
  {
    title: '消费app 次留(%)',
    pTitle: '社区数据',
    num: 'con_app_stay_cnt%pre_con_cnt',
  },
  {
    title: '分享用户量',
    pTitle: '社区数据',
    num: 'shr_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '分享用户占比(%)',
    pTitle: '社区数据',
    num: 'shr_cnt%cmty_act_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '分享次留(%)',
    pTitle: '社区数据',
    num: 'shr_stay_cnt%pre_shr_cnt',
  },
  {
    title: '分享app次留(%)',
    pTitle: '社区数据',
    num: 'shr_app_stay_cnt%pre_shr_cnt',
  },
  {
    title: '发布用户量',
    pTitle: '社区数据',
    num: 'pub_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '发布用户占比(%)',
    pTitle: '社区数据',
    num: 'pub_cnt%cmty_act_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '发布次留(%)',
    pTitle: '社区数据',
    num: 'pub_stay_cnt%pre_pub_cnt',
  },
  {
    title: '发布app次留(%)',
    pTitle: '社区数据',
    num: 'pub_app_stay_cnt%pre_pub_cnt',
  },

  {
    title: '工具活跃用户',
    pTitle: '工具数据',
    num: 'tool_enter_cnt',
  },
  {
    title: '工具活跃次留',
    pTitle: '工具数据',
    num: 'tool_act_stay_cnt%pre_tool_act_cnt',
  },
  {
    title: '工具活跃app次留',
    pTitle: '工具数据',
    num: 'tool_act_app_stay_cnt%pre_tool_act_cnt',
  },
  {
    title: '工具制作用户量',
    pTitle: '工具数据',
    num: 'tool_made_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '工具制作用户占比(%)',
    pTitle: '工具数据',
    num: 'tool_made_cnt%tool_enter_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '工具制作次留',
    pTitle: '工具数据',
    num: 'tool_made_stay_cnt%pre_tool_made_cnt',
  },
  {
    title: '工具制作app次留',
    pTitle: '工具数据',
    num: 'tool_made_app_stay_cnt%pre_tool_made_cnt',
  },
  {
    title: '工具分享用户量',
    pTitle: '工具数据',
    num: 'tool_sus_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '工具分享用户占比(%)',
    pTitle: '工具数据',
    num: 'tool_sus_cnt%tool_enter_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '工具分享次留',
    pTitle: '工具数据',
    num: 'tool_shr_stay_cnt%pre_tool_shr_cnt',
  },
  {
    title: '工具分享app次留',
    pTitle: '工具数据',
    num: 'tool_shr_app_stay_cnt%pre_tool_shr_cnt',
  },
];

export const titleList = [
  { label: '全量用户', value: 'all' },
  { label: '社区版本用户', value: 'community' },
  { label: '工具版本用户', value: 'tool' },
  { label: '新用户', value: 'new' },
  { label: '老用户', value: 'old' },
];

export const otherData = [
  {
    title: '进入次数',
    pTitle: '工具数据',
    num: 'enter_cnt',
  },
  {
    title: '进入设备数',
    pTitle: '工具数据',
    num: 'enter_dvc_cnt',
  },
  {
    title: '导出次数',
    pTitle: '工具数据',
    num: 'exp_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '导出次数占比(%)',
    pTitle: '工具数据',
    num: 'exp_cnt%enter_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '导出设备数',
    pTitle: '工具数据',
    num: 'exp_dvc_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '导出设备数占比(%)',
    pTitle: '工具数据',
    num: 'exp_dvc_cnt%enter_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '分享次数',
    pTitle: '工具数据',
    num: 'shr_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '分享次数占比(%)',
    pTitle: '工具数据',
    num: 'shr_cnt%enter_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '分享设备数',
    pTitle: '工具数据',
    num: 'shr_dvc_cnt',
    conditionExpr: '!([\'all\', \'new\'].includes(i.value) && showType === 1)',
  },
  {
    title: '分享设备数占比(%)',
    pTitle: '工具数据',
    num: 'shr_dvc_cnt%enter_cnt',
    conditionExpr: '[\'all\', \'new\'].includes(i.value) && showType === 1',
  },
  {
    title: '人均制作视频量',
    pTitle: '工具数据',
    num: 'exp_cnt%enter_dvc_cnt',
    showSuffix: false,
  },
  {
    title: '人均分享视频量',
    pTitle: '工具数据',
    num: 'shr_cnt%exp_dvc_cnt',
    showSuffix: false,
  },
];
