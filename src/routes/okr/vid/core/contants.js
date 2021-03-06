/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-11 18:52:00
 * @LastEditTime: 2020-04-30 10:52:50
 * @LastEditors: ssssslf
 */
export const cardData = [
  {
    title: '曝光设备',
    graphName: '曝光设备',
    id: '1',
    type: 'line',
    noDenominator: true,
    molecular: 'exp_dvc_cnt_1d',
    suffix: false,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_itr_idx_1d',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '分享设备',
    graphName: '分享设备',
    id: '2',
    type: 'line',
    noDenominator: true,
    molecular: 'shr_dvc_cnt_1d',
    suffix: false,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_itr_idx_1d',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '分享渗透率',
    graphName: '分享渗透率',
    id: '3',
    type: 'line',
    denominator: 'exp_dvc_cnt_1d',
    molecular: 'shr_dvc_cnt_1d',
    suffix: true,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_itr_idx_1d',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '活跃社区分享设备',
    graphName: '活跃社区分享设备',
    id: '4',
    type: 'line',
    noDenominator: true,
    molecular: 'active_shr_cnt_1d',
    suffix: false,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_itr_idx_1d',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '人均分享视频量',
    graphName: '人均分享视频量',
    id: '5',
    type: 'line',
    molecular: 'shr_vdo_cnt_1d',
    denominator: 'shr_dvc_cnt_1d',
    suffix: false,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_itr_idx_1d',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '分享视频量',
    graphName: '分享视频量',
    id: '6',
    type: 'line',
    noDenominator: true,
    molecular: 'shr_vdo_cnt_1d',
    suffix: false,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_itr_idx_1d',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '社区分享设备留存量',
    graphName: '社区分享设备留存量',
    id: '7',
    type: 'line',
    noDenominator: true,
    molecular: 'shr_active_stay_cnt_1d',
    suffix: false,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_itr_idx_1d',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '社区分享留存',
    graphName: '社区分享留存',
    id: '8',
    type: 'line',
    molecular: 'shr_active_stay_cnt_1d',
    denominator: 'pre_cmty_shr_active_cnt_1d',
    suffix: true,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_itr_idx_1d',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '社区分享设备',
    graphName: '社区分享设备',
    id: '9',
    type: 'line',
    noDenominator: true,
    molecular: 'cmty_shr_cnt_1d',
    suffix: false,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_itr_idx_1d',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '人均曝光',
    graphName: '人均曝光',
    id: '10',
    type: 'line',
    denominator: 'exp_dvc_cnt_1d',
    molecular: 'exp_cnt_1d',
    suffix: false,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_log_dvc_ver_cnt_nd',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: '人均播放',
    graphName: '人均播放',
    id: '11',
    type: 'line',
    denominator: 'ply_dvc_cnt_1d',
    molecular: 'ply_cnt_1d',
    suffix: false,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_log_dvc_ver_cnt_nd',
    day: 'ds',
    typeSelect: true,
  },
  {
    title: 'ptr',
    graphName: 'ptr',
    id: '12',
    type: 'line',
    denominator: 'exp_cnt_1d',
    molecular: 'ply_cnt_1d',
    suffix: true,
    newDatabase: 'rpt_vid_log_dvc_ver_cnt_nd',
    database: 'rpt_vid_log_dvc_ver_cnt_nd',
    day: 'ds',
    typeSelect: true,
  },
];
export const HOT_LIST = [
  { value: '_', title: 'all' },
  { value: '_vivashow_', title: 'vivashow' },
  { value: '_status_', title: 'status' },
  { value: '_search_', title: 'search' },
  { value: '_follow_', title: 'follow' },
];
