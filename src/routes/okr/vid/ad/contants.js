/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-11 18:52:00
 * @LastEditTime: 2020-03-05 16:11:22
 * @LastEditors: ssssslf
 */
export const cardData = [
  {
    title: '总日活',
    graphName: '总日活',
    id: '1',
    type: 'line',
    noDenominator: true,
    molecular: 'active_dvc_cnt',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '客户端日活',
    graphName: '客户端日活',
    id: '2',
    type: 'line',
    noDenominator: true,
    molecular: 'app_active_dvc_cnt',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '播放设备数',
    graphName: '播放设备数',
    id: '3',
    type: 'line',
    noDenominator: true,
    molecular: 'ply_dvc_cnt',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '播放时长(s)',
    graphName: '播放时长(s)',
    id: '4',
    type: 'line',
    noDenominator: true,
    molecular: 'ply_dur',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '播放次数',
    graphName: '播放次数',
    id: '5',
    type: 'line',
    noDenominator: true,
    molecular: 'ply_cnt',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '下载设备数',
    graphName: '下载设备数',
    id: '6',
    type: 'line',
    noDenominator: true,
    molecular: 'dnld_dvc_cnt',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '下载量',
    graphName: '下载量',
    id: '7',
    type: 'line',
    noDenominator: true,
    molecular: 'dnld_cnt',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '下载率',
    graphName: '下载率',
    id: '8',
    type: 'line',
    molecular: 'dnld_cnt',
    denominator: 'ply_cnt',
    suffix: true,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '人均播放量',
    graphName: '人均播放量',
    id: '9',
    type: 'line',
    denominator: 'ply_dvc_cnt',
    molecular: 'ply_cnt',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '人均播放时长(s)',
    graphName: '人均播放时长(s)',
    id: '10',
    type: 'line',
    denominator: 'ply_dvc_cnt',
    molecular: 'ply_dur',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '人均下载量',
    graphName: '人均下载量',
    id: '11',
    type: 'line',
    denominator: 'dnld_dvc_cnt',
    molecular: 'dnld_cnt',
    suffix: false,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '老用户活跃次留(%)',
    graphName: '老用户活跃次留(%)',
    id: '12',
    type: 'line',
    denominator: 'y_old_dau_cnt',
    molecular: 'old_stay_cnt',
    suffix: true,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '新用户次留(%)',
    graphName: '新用户次留(%)',
    id: '13',
    type: 'line',
    denominator: 'y_new_dvc_cnt',
    molecular: 'new_stay_cnt',
    suffix: true,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '新用户活跃次留(%)',
    graphName: '新用户活跃次留(%)',
    id: '14',
    type: 'line',
    denominator: 'y_new_dau_cnt',
    molecular: 'new_stay_cnt',
    suffix: true,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
  {
    title: '总次留(%)',
    graphName: '总次留(%)',
    id: '15',
    type: 'line',
    denominator: ['y_old_dau_cnt', 'y_new_dau_cnt'],
    molecular: ['old_stay_cnt', 'new_stay_cnt'],
    suffix: true,
    database: 'rpt_vid_log_ad_cnt_1d',
    day: 'ds',
  },
];
