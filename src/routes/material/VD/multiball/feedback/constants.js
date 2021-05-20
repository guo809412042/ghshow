export const columns = [
  { dataIndex: 'name', title: 'name' },
  { dataIndex: 'ttid', title: 'ttid' },
  { dataIndex: 'answer_a', title: '录屏时，会造成其他手机卡顿', sorter: (a, b) => a.answer_a - b.answer_a },
  { dataIndex: 'answer_b', title: '截屏功能不好用', sorter: (a, b) => a.answer_b - b.answer_b },
  { dataIndex: 'answer_c', title: '悬浮窗不好用', sorter: (a, b) => a.answer_c - b.answer_c },
  { dataIndex: 'answer_d', title: '视频剪辑不好用', sorter: (a, b) => a.answer_d - b.answer_d },
  { dataIndex: 'answer_e', title: '填写内容' },
];
