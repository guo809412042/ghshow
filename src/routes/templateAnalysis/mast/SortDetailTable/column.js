export const columns = [
  {
    dataIndex: 'ds',
    title: '日期',
    key: 'ds',
  },
  {
    dataIndex: 'name',
    title: '分类名称',
    key: 'name',
  },
  {
    dataIndex: 'class_id',
    title: '分类id',
    key: 'class_id',
  },
  {
    dataIndex: 'exp_cnt',
    title: '总曝光',
    key: 'exp_cnt',
    sorter: (a, b) => a.exp_cnt - b.exp_cnt,
  },
  {
    dataIndex: 'list_exp_cnt',
    title: '列表曝光',
    key: 'list_exp_cnt',
    sorter: (a, b) => a.list_exp_cnt - b.list_exp_cnt,
  },
  {
    dataIndex: 'cover_click_cnt',
    title: '封面点击',
    key: 'cover_click_cnt',
    sorter: (a, b) => a.cover_click_cnt - b.cover_click_cnt,
  },
  {
    dataIndex: 'pre_exp_cnt',
    title: '预览曝光',
    key: 'pre_exp_cnt',
    sorter: (a, b) => a.pre_exp_cnt - b.pre_exp_cnt,
  },
  {
    dataIndex: 'made_cnt',
    title: '制作量',
    key: 'made_cnt',
    sorter: (a, b) => a.made_cnt - b.made_cnt,
  },
  {
    dataIndex: 'export_cnt',
    title: '导出量',
    key: 'export_cnt',
    sorter: (a, b) => a.export_cnt - b.export_cnt,
  },
  {
    dataIndex: 'shr_cnt',
    title: '分享量',
    key: 'shr_cnt',
    sorter: (a, b) => a.shr_cnt - b.shr_cnt,
  },
  {
    dataIndex: 'cover_list_ratio',
    title: '封面点击率',
    key: 'cover_list_ratio',
    sorter: (a, b) => a.cover_list_ratio - b.cover_list_ratio,
    render(text) {
      return text ? text + '%' : '';
    },
  },
  {
    dataIndex: 'made_pre_exp_ratio',
    title: '制作率',
    key: 'made_pre_exp_ratio',
    sorter: (a, b) => a.cover_click_cnt - b.cover_click_cnt,
    render(text) {
      return text ? text + '%' : '';
    },
  },
  {
    dataIndex: 'export_made_ratio',
    title: '导出率',
    key: 'export_made_ratio',
    sorter: (a, b) => a.cover_click_cnt - b.cover_click_cnt,
    render(text) {
      return text ? text + '%' : '';
    },
  },
  {
    dataIndex: 'shr_export_ratio',
    title: '分享率',
    key: 'shr_export_ratio',
    sorter: (a, b) => a.cover_click_cnt - b.cover_click_cnt,
    render(text) {
      return text ? text + '%' : '';
    },
  },
  {
    dataIndex: 'export_exp_ratio',
    title: '导出/总曝光',
    key: 'export_exp_ratio',
    sorter: (a, b) => a.cover_click_cnt - b.cover_click_cnt,
    render(text) {
      return text ? text + '%' : '';
    },
  },
];
