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
    dataIndex: 'ttid_cnt',
    title: '模版个数',
    key: 'ttid_cnt',
  },
  {
    dataIndex: 'ratio',
    title: '占比',
    key: 'ratio',
    sorter: (a, b) => a.ratio - b.ratio,
    render(text) {
      return text ? text + '%' : '';
    },
  },
];
