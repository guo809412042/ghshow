export const detailColumns = [
  { dataIndex: 'name', title: '模版名称' },
  { dataIndex: 'ttid', title: 'ttid' },
  { dataIndex: 'answer_a', title: '答案1', sorter: (a, b) => a.answer_a - b.answer_a },
  { dataIndex: 'answer_a_detail', title: '答案1-填写内容' },
  { dataIndex: 'answer_b', title: '答案2', sorter: (a, b) => a.answer_b - b.answer_b },
  { dataIndex: 'answer_b_detail', title: '答案2-填写内容' },
  { dataIndex: 'answer_c', title: '答案3', sorter: (a, b) => a.answer_c - b.answer_c },
  { dataIndex: 'answer_c_detail', title: '答案3-填写内容' },
  { dataIndex: 'answer_d', title: '答案4', sorter: (a, b) => a.answer_d - b.answer_d },
  { dataIndex: 'answer_d_detail', title: '答案4-填写内容' },
  { dataIndex: 'answer_e', title: '其他-填写内容' },
];

export const statisticColumns = [
  { dataIndex: 'name', title: '模版名称' },
  { dataIndex: 'ttid', title: 'ttid' },
  { dataIndex: 'answer_a', title: '答案1', sorter: (a, b) => a.answer_a - b.answer_a },
  { dataIndex: 'answer_b', title: '答案2', sorter: (a, b) => a.answer_b - b.answer_b },
  { dataIndex: 'answer_c', title: '答案3', sorter: (a, b) => a.answer_c - b.answer_c },
  { dataIndex: 'answer_d', title: '答案4', sorter: (a, b) => a.answer_d - b.answer_d },
  { dataIndex: 'answer_e', title: '其他-填写内容' },
];
