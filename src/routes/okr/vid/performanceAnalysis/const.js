/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-25 11:21:28
 * @LastEditTime: 2020-03-25 13:44:47
 * @LastEditors: ssssslf
 */

// molecular 分子 denominator// 分母
export const cardData = [
  {
    title: '导出成功率',
    graphName: '导出成功率',
    id: '1',
    type: 'line',
    denominator: 'export_cnt',
    molecular: 'export_suc',
    suffix: true,
    database: 'rpt_india_log_export_cnt_1d',
    day: 'ds',
    unit: '%',
  },
  {
    title: '导出失败率',
    graphName: '导出失败率',
    id: '2',
    type: 'line',
    denominator: 'export_cnt',
    molecular: 'export_fal',
    suffix: true,
    database: 'rpt_india_log_export_cnt_1d',
    day: 'ds',
    unit: '%',
  },
  {
    title: '平均导出速率',
    graphName: '平均导出速率',
    id: '3',
    type: 'line',
    denominator: 'duration',
    molecular: 'duration_size_cnt',
    suffix: false,
    database: 'rpt_india_log_export_cnt_1d',
    day: 'ds',
    unit: 'kb/s',
  },
  {
    title: '平均导出时长',
    graphName: '平均导出时长',
    id: '4',
    type: 'line',
    denominator: 'duration_cnt',
    molecular: 'duration',
    suffix: false,
    database: 'rpt_india_log_export_cnt_1d',
    day: 'ds',
    unit: 's',
  },
  {
    title: '平均导出文件大小',
    graphName: '平均导出文件大小',
    id: '5',
    type: 'line',
    denominator: 'export_suc_cnt',
    molecular: 'size_col',
    suffix: false,
    database: 'rpt_india_log_export_cnt_1d',
    day: 'ds',
    unit: 'kb',
  },
];

export const productListMap = new Map([['vid', 6], ['mast', 42]]);
