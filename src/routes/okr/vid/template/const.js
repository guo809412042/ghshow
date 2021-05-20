/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-11 14:23:39
 * @LastEditTime: 2021-03-16 16:27:16
 * @LastEditors: dongqi.zhao
 */
import moment from 'moment';
// molecular 分子

// 增加showInProductIds 当productId在数组内则展示
export const cardData = [
  {
    title: '模板曝光量',
    molecular: 'exp_cnt',
    suffix: false,
  },
  {
    title: '模板制作量',
    molecular: 'export_cnt',
    suffix: false,
  },
  {
    title: '视频分享量',
    molecular: 'shr_cnt',
    suffix: false,
  },
  {
    title: '视频上传量',
    molecular: 'upload_cnt',
    suffix: false,
    showInProductIds: [6],
  },
  {
    title: '平均制作率(%)',
    molecular: 'export_dvc_cnt',
    denominator: 'click_dvc_cnt',
    suffix: true,
  },
  {
    title: '平均分享率(%)',
    molecular: 'shr_dvc_cnt',
    denominator: 'export_dvc_cnt',
    suffix: true,
  },
  {
    title: '平均上传率(%)',
    molecular: 'upload_dvc_cnt',
    denominator: 'export_dvc_cnt',
    suffix: true,
    showInProductIds: [6],
  },
];

export const columns = [
  { dataIndex: 'template_name', title: '模版名称', key: 'template_name' },
  { dataIndex: 'template_id', title: '模版ID', key: 'template_id' },
  { dataIndex: 'previewurl', title: '预览图', key: 'previewurl' },
  {
    dataIndex: 'cover_list_ratio', title: '封面点击率(%)', key: 'cover_list_ratio', sorter: (a, b) => a.cover_list_ratio - b.cover_list_ratio,
  },
  {
    dataIndex: 'made_pre_exp_ratio', title: '制作率(%)', key: 'made_pre_exp_ratio', sorter: (a, b) => a.made_pre_exp_ratio - b.made_pre_exp_ratio,
  },
  {
    dataIndex: 'export_made_ratio', title: '导出率(%)', key: 'export_made_ratio', sorter: (a, b) => a.export_made_ratio - b.export_made_ratio,
  },
  {
    dataIndex: 'shr_export_ratio', title: '分享率(%)', key: 'shr_export_ratio', sorter: (a, b) => a.shr_export_ratio - b.shr_export_ratio,
  },
  {
    dataIndex: 'export_exp_ratio', title: '导出/曝光', key: 'export_exp_ratio', sorter: (a, b) => a.export_exp_ratio - b.export_exp_ratio,
  },
  {
    dataIndex: 'export_cnt/all_export_cnt', title: '模板导出占比(%)', key: 'export_cnt/all_export_cnt', sorter: (a, b) => a['export_cnt/all_export_cnt'] - b['export_cnt/all_export_cnt'],
  },
  {
    dataIndex: 'shr_cnt/all_share_cnt', title: '模版分享占比(%)', key: 'shr_cnt/all_share_cnt', sorter: (a, b) => a['shr_cnt/all_share_cnt'] - b['shr_cnt/all_share_cnt'],
  },
  {
    dataIndex: 'exp_cnt', title: '总曝光', key: 'exp_cnt', sorter: (a, b) => a.exp_cnt - b.exp_cnt,
  },
  {
    dataIndex: 'list_exp_cnt', title: '列表曝光', key: 'list_exp_cnt', sorter: (a, b) => a.list_exp_cnt - b.list_exp_cnt,
  },
  {
    dataIndex: 'cover_click_cnt', title: '封面点击', key: 'cover_click_cnt', sorter: (a, b) => a.cover_click_cnt - b.cover_click_cnt,
  },
  {
    dataIndex: 'pre_exp_cnt', title: '预览曝光', key: 'pre_exp_cnt', sorter: (a, b) => a.pre_exp_cnt - b.pre_exp_cnt,
  },
  {
    dataIndex: 'made_cnt', title: '制作', key: 'made_cnt', sorter: (a, b) => a.made_cnt - b.made_cnt,
  },
  {
    dataIndex: 'export_cnt', title: '导出', key: 'export_cnt', sorter: (a, b) => a.export_cnt - b.export_cnt,
  },
  {
    dataIndex: 'shr_cnt', title: '分享', key: 'shr_cnt', sorter: (a, b) => a.shr_cnt - b.shr_cnt,
  },
  {
    dataIndex: 'create_time', title: '上线时间', key: 'create_time', width: 200, sorter: (a, b) => moment(a.create_time || '1999-12-31').valueOf() - moment(b.create_time || '1999-12-31').valueOf(),
  },
  { dataIndex: 'template_type', title: '素材类型', key: 'template_type' },
];

export const productListMap = new Map([['vid', 6], ['mast', 42]]);

export const communityList = ['all', 'bn', 'gu', 'hi', 'kn', 'ml', 'mr', 'pa', 'ta', 'te'];
