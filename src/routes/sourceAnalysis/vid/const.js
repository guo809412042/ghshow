export const AbsColumns = [
  {
    title: '新增用户',
    dataIndex: 'uv',
    key: 'uv',
    sorter: (a, b) => a.uv - b.uv,
  },
  {
    title: '活跃用户',
    dataIndex: 'dau_uv',
    key: 'dau_uv',
    sorter: (a, b) => a.dau_uv - b.dau_uv,
  },
  {
    title: '社区活跃用户',
    dataIndex: 'community_dau_uv',
    key: 'community_dau_uv',
    sorter: (a, b) => a.community_dau_uv - b.community_dau_uv,
  },
  {
    title: '社区消费用户',
    dataIndex: 'community_consume_uv',
    key: 'community_consume_uv',
    sorter: (a, b) => a.community_dau_uv - b.community_dau_uv,
  },
  {
    title: '社区分享用户',
    dataIndex: 'community_shr_uv',
    key: 'community_shr_uv',
    sorter: (a, b) => a.community_shr_uv - b.community_shr_uv,
  },
  {
    title: '工具活跃用户',
    dataIndex: 'tmpl_dau_uv',
    key: 'tmpl_dau_uv',
    sorter: (a, b) => a.tmpl_dau_uv - b.tmpl_dau_uv,
  },
  {
    title: '工具制作用户',
    dataIndex: 'tmpl_exp_uv',
    key: 'tmpl_exp_uv',
    sorter: (a, b) => a.tmpl_exp_uv - b.tmpl_exp_uv,
  },
  {
    title: '工具分享用户',
    dataIndex: 'tmpl_shr_uv',
    key: 'tmpl_shr_uv',
    sorter: (a, b) => a.tmpl_shr_uv - b.tmpl_shr_uv,
  },
  {
    title: '订阅人数',
    dataIndex: 'describe_uv',
    key: 'describe_uv',
    sorter: (a, b) => a.describe_uv - b.describe_uv,
  },
];

export const JColumns = [
  {
    title: '新增用户',
    dataIndex: 'uv',
    key: 'uv',
    sorter: (a, b) => a.dau_uv - b.dau_uv,
  },
  {
    title: '活跃用户',
    dataIndex: 'dau_uv',
    key: 'dau_uv',
  },
  {
    title: '社区活跃用户占比(%)',
    dataIndex: 'community_dau_uv/uv',
    key: 'community_dau_uv/uv',
  },
  {
    title: '社区消费用户占比(%)',
    dataIndex: 'community_consume_uv/uv',
    key: 'community_consume_uv/uv',
  },
  {
    title: '社区分享用户占比(%)',
    dataIndex: 'community_shr_uv/uv',
    key: 'community_shr_uv/uv',
  },
  {
    title: '工具活跃用户占比(%)',
    dataIndex: 'tmpl_dau_uv/uv',
    key: 'tmpl_dau_uv/uv',
  },
  {
    title: '工具制作用户占比(%)',
    dataIndex: 'tmpl_exp_uv/uv',
    key: 'tmpl_exp_uv/uv',
  },
  {
    title: '工具分享用户占比(%)',
    dataIndex: 'tmpl_shr_uv/uv',
    key: 'tmpl_shr_uv/uv',
  },
  {
    title: '订阅人数占比(%)',
    dataIndex: 'describe_uv/uv',
    key: 'describe_uv/uv',
  },
];

export const tagColors = ['magenta', 'red', 'volcano', 'orange', 'gold'];
export const SOURCE_KEYS_VIVA = [
  {
    value: 'media_source',
    text: 'media_source',
  },
  {
    value: 'campaign',
    text: 'campaign',
  },
];
