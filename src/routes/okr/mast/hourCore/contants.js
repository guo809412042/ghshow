/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-18 16:09:00
 * @LastEditTime: 2021-02-04 10:49:03
 * @LastEditors: dongqi.zhao
 */
export const dayCardData = [
  {
    title: '新增',
    graphName: '新增',
    id: '1',
    type: 'line',
    noDenominator: true,
    molecular: 'dvc_cnt',
    suffix: false,
    database: 'rpt_vid_log_reg_cnt_hh',
    day: 'ds',
    otherWhere: 'and product_id = 42 ',
  },
  // {
  //   title: '视频分享PV',
  //   graphName: '视频分享PV',
  //   id: '2',
  //   type: 'line',
  //   noDenominator: true,
  //   molecular: 'shr_cnt',
  //   suffix: false,
  //   database: 'rpt_vid_log_shr_cnt_hh',
  //   day: 'ds',
  //   otherWhere: 'and   product_id = 42 and  usr_type = \'template\' and  hh = \'24\' ',
  // },
  // {
  //   title: '视频分享UV',
  //   graphName: '视频分享UV',
  //   id: '3',
  //   type: 'line',
  //   noDenominator: true,
  //   molecular: 'shr_dvc_cnt',
  //   suffix: false,
  //   database: 'rpt_vid_log_shr_cnt_hh',
  //   day: 'ds',
  //   otherWhere: 'and  product_id = 42 and  usr_type = \'template\'  and  hh = \'24\' ',
  // },
  {
    title: '模版分享PV',
    graphName: '模版分享PV',
    id: '4',
    type: 'line',
    noDenominator: true,
    molecular: 'shr_cnt',
    suffix: false,
    database: 'rpt_vid_log_shr_cnt_hh',
    day: 'ds',
    otherWhere: 'and product_id = 42 and  usr_type = \'template\' and  hh = \'24\' ',
  },
  {
    title: '模版分享UV',
    graphName: '模版分享UV',
    id: '5',
    type: 'line',
    noDenominator: true,
    molecular: 'shr_dvc_cnt',
    suffix: false,
    database: 'rpt_vid_log_shr_cnt_hh',
    day: 'ds',
    otherWhere: 'and product_id = 42 and usr_type = \'template\' and  hh = \'24\' ',
  },
];

export const cardData = [
  {
    title: '新增',
    graphName: '新增',
    id: '1',
    type: 'line',
    noDenominator: true,
    molecular: 'dvc_cnt',
    suffix: false,
    database: 'rpt_vid_log_reg_cnt_hh',
    day: 'ds',
    yesterday: true,
    today: true,
    lastWeek: true,
    week: true,
    lastWeekDay: true,
    otherWhere: 'and product_id = 42 and  hh <> \'24\' ',
  },
  // {
  //   title: '视频分享PV',
  //   graphName: '视频分享PV',
  //   id: '2',
  //   type: 'line',
  //   noDenominator: true,
  //   molecular: 'shr_cnt',
  //   suffix: false,
  //   database: 'rpt_vid_log_shr_cnt_hh',
  //   day: 'ds',
  //   yesterday: true,
  //   today: true,
  //   lastWeek: true,
  //   week: true,
  //   lastWeekDay: true,
  //   otherWhere: 'and   product_id = 42 and  usr_type = \'template\' and  hh <> \'24\' ',
  // },
  // {
  //   title: '视频分享UV',
  //   graphName: '视频分享UV',
  //   id: '3',
  //   type: 'line',
  //   noDenominator: true,
  //   molecular: 'shr_dvc_cnt',
  //   suffix: false,
  //   database: 'rpt_vid_log_shr_cnt_hh',
  //   day: 'ds',
  //   yesterday: true,
  //   today: true,
  //   lastWeek: true,
  //   week: true,
  //   lastWeekDay: true,
  //   otherWhere: 'and    product_id = 42 and   usr_type = \'template\' and  hh <> \'24\' ',
  // },
  {
    title: '模版分享PV',
    graphName: '模版分享PV',
    id: '4',
    type: 'line',
    noDenominator: true,
    molecular: 'shr_cnt',
    suffix: false,
    database: 'rpt_vid_log_shr_cnt_hh',
    day: 'ds',
    yesterday: true,
    today: true,
    lastWeek: true,
    week: true,
    lastWeekDay: true,
    otherWhere: 'and   product_id = 42 and   usr_type = \'template\' and  hh <> \'24\' ',
  },
  {
    title: '模版分享UV',
    graphName: '模版分享UV',
    id: '5',
    type: 'line',
    noDenominator: true,
    molecular: 'shr_dvc_cnt',
    suffix: false,
    database: 'rpt_vid_log_shr_cnt_hh',
    day: 'ds',
    yesterday: true,
    today: true,
    lastWeek: true,
    week: true,
    lastWeekDay: true,
    otherWhere: 'and   product_id = 42 and   usr_type = \'template\' and  hh <> \'24\' ',
  },
];
