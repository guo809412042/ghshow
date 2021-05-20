import { numberDivide } from '../const';

export const columns = [
  {
    dataIndex: 'ds',
    title: '日期',
    key: 'ds',
  },
  {
    dataIndex: 'platform',
    title: '客户端',
    key: 'platform',
    render(text, record) {
      const { platform, } = record;

      return +platform === 2 ? 'IOS' : '安卓';
    },
  },
  {
    dataIndex: 'ttid',
    title: 'ttid',
    key: 'ttid',
  },
  {
    dataIndex: 'country',
    title: '国家',
    key: 'country',
  },
  {
    dataIndex: 'home_view_dvc_cnt',
    title: '封面曝光',
    key: 'home_view_dvc_cnt',
  },
  {
    dataIndex: 'home_click_dvc_cnt',
    title: '封面点击',
    key: 'home_click_dvc_cnt',
  },
  {
    dataIndex: 'home_click_dvc_cnt_uv_rate',
    title: '封面点击率',
    key: 'home_click_dvc_cnt_uv_rate',
    render(text) {
      return (text || 0) + '%';
    },
  },
  {
    dataIndex: 'template_view_dvc_cnt',
    title: '详情页曝光',
    key: 'template_view_dvc_cnt',
  },
  {
    dataIndex: 'make_button_click_dvc_cnt',
    title: '模板使用',
    key: 'make_button_click_dvc_cnt',
  },
  {
    dataIndex: 'template_view_dvc_usage_rate',
    title: '模板使用率',
    key: 'template_view_dvc_usage_rate',
    render(text) {
      return (text || 0) + '%';
    },
  },
  {
    dataIndex: 'gallery_view_dvc_cnt',
    title: '相册页曝光',
    key: 'gallery_view_dvc_cnt',
  },
  {
    dataIndex: 'template_make_dvc_cnt',
    title: '素材编辑',
    key: 'template_make_dvc_cnt',
  },
  {
    dataIndex: 'export_dvc_cnt',
    title: '素材导出',
    key: 'export_dvc_cnt',
  },
  {
    dataIndex: 'export_dvc_rate',
    title: '模板导出率（导出/编辑）',
    key: 'export_dvc_rate',
    render(text) {
      return (text || 0) + '%';
    },
  },
  {
    dataIndex: 'done_rate',
    title: '总完成率（导出/封面曝光）',
    key: 'done_rate',
    render(text) {
      return (text || 0) + '%';
    },
  },
  {
    dataIndex: 'share_dvc_cnt',
    title: '素材分享',
    key: 'share_dvc_cnt',
  },
  {
    dataIndex: 'share_dvc_rate',
    title: '分享率（分享/导出）',
    key: 'share_dvc_rate',
    render(text) {
      return (text || 0) + '%';
    },
  },
  {
    dataIndex: 'share_dvc_rate_total',
    title: '总分享率（分享/封面曝光）',
    key: 'share_dvc_rate_total',
    render(text) {
      return (text || 0) + '%';
    },
  },
];
