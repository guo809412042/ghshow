export const columns = [
  { dataIndex: 'name', title: '模版名称' },
  { dataIndex: 'ttid', title: 'ttid' },
  { dataIndex: 'answer_a', title: '答案1（不能编辑）', sorter: (a, b) => a.answer_a - b.answer_a },
  { dataIndex: 'answer_b', title: '答案2（效果不好）', sorter: (a, b) => a.answer_b - b.answer_b },
  { dataIndex: 'answer_c', title: '答案3（尺寸不一致）', sorter: (a, b) => a.answer_c - b.answer_c },
  { dataIndex: 'answer_d', title: '答案4（合成时间长）', sorter: (a, b) => a.answer_d - b.answer_d },
  { dataIndex: 'answer_e', title: '填写内容' },
];
