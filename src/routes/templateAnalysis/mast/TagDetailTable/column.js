export const columns = [
  {
    dataIndex: 'ds',
    title: '日期',
    key: 'ds',
  },
  {
    dataIndex: 'name_x',
    title: '名称',
    key: 'name_x',
    render(text, record) {
      const { name, path, } = record;
      return name || path;
    },
  },
  {
    dataIndex: 'tag_id',
    title: '标签id',
    key: 'tag_id',
    render(text) {
      return text || '-';
    },
  },
  {
    dataIndex: 'exp_cnt',
    title: '总曝光',
    key: 'exp_cnt',
  },
  {
    dataIndex: 'list_exp_cnt',
    title: '列表曝光',
    key: 'list_exp_cnt',
  },
  {
    dataIndex: 'cover_click_cnt',
    title: '封面点击',
    key: 'cover_click_cnt',
  },
  {
    dataIndex: 'pre_exp_cnt',
    title: '预览曝光',
    key: 'pre_exp_cnt',
  },
  {
    dataIndex: 'made_cnt',
    title: '制作量',
    key: 'made_cnt',
  },
  {
    dataIndex: 'export_cnt',
    title: '导出量',
    key: 'export_cnt',
  },
  {
    dataIndex: 'shr_cnt',
    title: '分享量',
    key: 'shr_cnt',
  },
  {
    dataIndex: 'cover_list_ratio',
    title: '封面点击率',
    key: 'cover_list_ratio',
    sorter: (a, b) => a.cover_list_ratio - b.cover_list_ratio,
    render(text) {
      return text + '%';
    },
  },
  {
    dataIndex: 'made_pre_exp_ratio',
    title: '制作率',
    key: 'made_pre_exp_ratio',
    sorter: (a, b) => a.made_pre_exp_ratio - b.made_pre_exp_ratio,
    render(text) {
      return text + '%';
    },
  },
  {
    dataIndex: 'export_made_ratio',
    title: '导出率',
    key: 'export_made_ratio',
    sorter: (a, b) => a.export_made_ratio - b.export_made_ratio,
    render(text) {
      return text + '%';
    },
  },
  {
    dataIndex: 'shr_export_ratio',
    title: '分享率',
    key: 'shr_export_ratio',
    sorter: (a, b) => a.shr_export_ratio - b.shr_export_ratio,
    render(text) {
      return text + '%';
    },
  },
  {
    dataIndex: 'export_exp_ratio',
    title: '导出/总曝光',
    key: 'export_exp_ratio',
    sorter: (a, b) => a.export_exp_ratio - b.export_exp_ratio,
    render(text) {
      return text + '%';
    },
  },
];
