export const columns = [
  {
    dataIndex: 'ds',
    title: '日期',
    key: 'ds',
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
    dataIndex: 'tag_name',
    title: '名称',
    key: 'tag_name',
    render(text, record) {
      const { name, } = record;
      return name || '-';
    },
  },
  {
    dataIndex: 'path',
    title: '维度',
    key: 'path',
    render(text) {
      return text || '-';
    },
  },
  {
    dataIndex: 'ttid_cnt',
    title: '素材个数',
    key: 'ttid_cnt',
  },
  {
    dataIndex: 'ratio',
    title: '占比',
    key: 'ratio',
    sorter: (a, b) => a.ratio - b.ratio,
    render(text) {
      return text + '%';
    },
  },
];
