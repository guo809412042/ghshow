export const ProductList = [
  {
    key: 'vivavideo',
    value: '2',
  },
  {
    key: 'vidstatus',
    value: '6',
  },
  {
    key: '奇幻变脸秀',
    value: '17',
  }, {
    key: 'picclub',
    value: '33',
  }, {
    key: 'Mono',
    value: '37',
  }, {
    key: '智云',
    value: '10001',
  }, {
    key: '讯飞',
    value: '231',
  }, {
    key: '趣影',
    value: '16',
  }, {
    key: 'slideplus',
    value: '3',
  }, {
    key: 'tempo',
    value: '10',
  }, {
    key: 'vivacut',
    value: '15',
  }, {
    key: 'vid素材中心',
    value: '501',
  }, {
    key: '收支系统',
    value: '102',
  }, {
    key: 'Facee',
    value: '35',
  }, {
    key: 'H5视频合成',
    value: '233',
  }, {
    key: 'vivalive-1v1',
    value: '20',
  }, {
    key: 'Vcam',
    value: '28',
  }, {
    key: 'AutoFeedBack',
    value: '101',
  }, {
    key: 'vivalive-hayya',
    value: '27',
  }, {
    key: 'GH',
    value: '110',
  }, {
    key: 'Veffecto',
    value: '39',
  }, {
    key: 'RBAC',
    value: '200',
  }, {
    key: 'StoryBuff',
    value: '41',
  }, {
    key: 'GoCut',
    value: '43',
  }, {
    key: 'mAst',
    value: '42',
  },
];

export const AppProductList = {
  0: '全部',
  2: 'vivavideo',
  6: 'vidstatus',
  17: '奇幻变脸秀',
  33: 'picclub',
  37: 'Mono',
  10001: '智云',
  231: '讯飞',
  16: '趣影',
  3: 'slideplus',
  10: 'tempo',
  15: 'vivacut',
  501: 'vid素材中心',
  102: '收支系统',
  35: 'Facee',
  233: 'H5视频合成',
  20: 'vivalive-1v1',
  28: 'Vcam',
  101: 'AutoFeedBack',
  27: 'vivalive-hayya',
  110: 'GH',
  39: 'Veffecto',
  200: 'RBAC',
  41: 'StoryBuff',
  43: 'GoCut',
  36: 'glitchfx',
  18: 'vmix',
  44: 'vivavideoindia',
  50: 'beatstarr',
  51: 'multirecorder',
  42: 'mAst',
};

export const AdvCompanyList = [
  { code: 1, name: 'FaceBook', type: 1 },
  { code: 2, name: 'AdMob', type: 1 },
  { code: 3, name: 'MOBVISTA', type: 1 },
  { code: 4, name: 'Pingstart', type: 1 },
  { code: 5, name: 'Altamob', type: 1 },
  { code: 6, name: 'Loopme', type: 1 },
  { code: 7, name: 'AdColony', type: 1 },
  { code: 8, name: 'CrystalExpress', type: 1 },
  { code: 9, name: 'AppLovin', type: 1 },
  { code: 10, name: 'Baidu', type: 1 },
  { code: 11, name: 'YeahMobi', type: 1 },
  { code: 12, name: 'InMobi', type: 1 },
  { code: 13, name: 'Appcoach', type: 1 },
  { code: 14, name: 'Batmobi', type: 1 },
  { code: 15, name: 'Caller', type: 1 },
  { code: 16, name: 'AppSNT', type: 1 },
  { code: 17, name: 'Bayes', type: 1 },
  { code: 18, name: 'Diggoods', type: 1 },
  { code: 19, name: 'Intowow', type: 1 },
  { code: 20, name: 'Mopub', type: 1 },
  { code: 21, name: 'toutiao', type: 1 },
  { code: 22, name: 'Solo', type: 1 },
  { code: 23, name: 'StartApp', type: 1 },
  { code: 25, name: 'Vungle', type: 1 },
  { code: 26, name: 'IronSource', type: 1 },
  { code: 27, name: 'PubMatic', type: 1 },
  { code: 28, name: 'MyTarget', type: 1 },
];

export const PlatformList = [
  { key: 'Android', value: '1' },
  { key: 'iOS', value: '2' },
];

export const AdvTypeList = [
  { key: '0', value: '原生广告' },
  { key: '1', value: '激励广告' },
  { key: '2', value: '插屏广告' },
  { key: '4', value: '横幅广告' },
  { key: '5', value: '开屏广告' },
  { key: '7', value: '原生横幅广告' },
];

export const StatiticsTypeList = [
  { key: '日期', value: 'day' },
  { key: '广告位', value: 'placement_name' },
  // { key: '日期、广告位', value: 'day_placement_name' },
];


export const chartKey = [
  {
    key: 'dau',
    dataIndex: 'dau',
    title: 'DAU',
  },
  {
    key: 'triggers',
    dataIndex: 'triggers',
    title: '触发次数',
  },
  // {
  //   key: 'triggeruid_num',
  //   dataIndex: 'triggeruid_num',
  //   title: '触发用户数',
  // },
  {
    key: 'request_num',
    dataIndex: 'request_num',
    title: '请求次数',
    // render: text => (text ? `${text}%` : ''),
  },
  {
    key: 'fill_suc_num',
    dataIndex: 'fill_suc_num',
    title: '填充成功',
    // render: text => (text ? `${text}%` : ''),
  },
  {
    key: 'fill_fail_num',
    dataIndex: 'fill_fail_num',
    title: '填充失败',
    // render: text => (text ? `${text}%` : ''),
  },
  {
    key: 'fill_rate',
    dataIndex: 'fill_rate',
    title: '填充率',
    // render: text => (text ? `${text}%` : ''),
  },
  {
    key: 'show_num',
    dataIndex: 'show_num',
    title: '展示次数',
  },
  // {
  //   key: 'showuid_num',
  //   dataIndex: 'showuid_num',
  //   title: '展示用户数',
  // },
  {
    key: 'show_rate',
    dataIndex: 'show_rate',
    title: '展示率',
  },
  {
    key: 'click_num',
    dataIndex: 'click_num',
    title: '点击次数',
  },
  {
    key: 'click_rate',
    dataIndex: 'click_rate',
    title: '点击率',
  },
  {
    key: 'video_num',
    dataIndex: 'video_num',
    title: '激励视频完成次数',
  },
];

export const chartKeyMap = {
  click_num: '点击次数',
  click_rate: '点击率',
  dau: 'DAU',
  fill_fail_num: '填充失败',
  fill_rate: '填充率',
  fill_suc_num: '填充成功',
  request_num: '请求次数',
  show_num: '展示次数',
  show_rate: '展示率',
  showuid_num: '展示用户数',
  triggers: '触发次数',
  triggeruid_num: '触发用户数',
  video_num: '激励视频完成次数',
};

function getRate({ content, k1, k2 }) {
  if (content[k2]) {
    return `${(content[k1] / content[k2] * 100).toFixed(2)}%`;
  }
  return `${0}%`;
}

export const columnsMap = {
  day: [
    {
      key: 'ds',
      dataIndex: 'ds',
      title: '日期',
    },
    {
      key: 'dau',
      dataIndex: 'dau',
      title: 'DAU',
    },
    {
      key: 'triggers',
      dataIndex: 'triggers',
      title: '触发次数',
    },
    // {
    //   key: 'triggeruid_num',
    //   dataIndex: 'triggeruid_num',
    //   title: '触发用户数',
    // },
    {
      key: 'request_num',
      dataIndex: 'request_num',
      title: '请求次数',
      // render: text => (text ? `${text}%` : ''),
    },
    {
      key: 'fill_suc_num',
      dataIndex: 'fill_suc_num',
      title: '填充成功',
      // render: text => (text ? `${text}%` : ''),
    },
    {
      key: 'fill_fail_num',
      dataIndex: 'fill_fail_num',
      title: '填充失败',
      // render: text => (text ? `${text}%` : ''),
    },
    {
      key: 'fill_rate',
      dataIndex: 'fill_rate',
      title: '填充率(%)',
      render: (text, content) => (text ? `${(text * 100).toFixed(2)}%` : getRate({ content, k1: 'fill_suc_num', k2: 'request_num' })),
    },
    {
      key: 'show_num',
      dataIndex: 'show_num',
      title: '展示次数',
    },
    // {
    //   key: 'showuid_num',
    //   dataIndex: 'showuid_num',
    //   title: '展示用户数',
    // },
    {
      key: 'show_rate',
      dataIndex: 'show_rate',
      title: '展示率(%)',
      render: (text, content) => (text ? `${(text * 100).toFixed(2)}%` : getRate({ content, k1: 'show_num', k2: 'request_suc_num' })),
    },
    {
      key: 'click_num',
      dataIndex: 'click_num',
      title: '点击次数',
    },
    {
      key: 'click_rate',
      dataIndex: 'click_rate',
      title: '点击率(%)',
      render: (text, content) => (text ? `${(text * 100).toFixed(2)}%` : getRate({ content, k1: 'click_num', k2: 'show_num' })),
    },
    {
      key: 'video_num',
      dataIndex: 'video_num',
      title: '激励视频完成次数',
      width: 100,
    },
  ],
  placement_name: [
    {
      key: 'placement_id',
      dataIndex: 'placement_id',
      title: '广告位',
      render: (text, row) => (row.placementIdMap[text] || text),
    },
    {
      key: 'triggers',
      dataIndex: 'triggers',
      title: '触发次数',
    },
    // {
    //   key: 'triggeruid_num',
    //   dataIndex: 'triggeruid_num',
    //   title: '触发用户数',
    // },
    {
      key: 'request_num',
      dataIndex: 'request_num',
      title: '请求次数',
      // render: text => (text ? `${text}%` : ''),
    },
    {
      key: 'fill_suc_num',
      dataIndex: 'fill_suc_num',
      title: '填充成功',
      // render: text => (text ? `${text}%` : ''),
    },
    {
      key: 'fill_fail_num',
      dataIndex: 'fill_fail_num',
      title: '填充失败',
      // render: text => (text ? `${text}%` : ''),
    },
    {
      key: 'fill_rate',
      dataIndex: 'fill_rate',
      title: '填充率(%)',
      render: (text, content) => (text ? `${(text * 100).toFixed(2)}%` : getRate({ content, k1: 'fill_suc_num', k2: 'request_num' })),
    },
    {
      key: 'show_num',
      dataIndex: 'show_num',
      title: '展示次数',
    },
    // {
    //   key: 'showuid_num',
    //   dataIndex: 'showuid_num',
    //   title: '展示用户数',
    // },
    {
      key: 'show_rate',
      dataIndex: 'show_rate',
      title: '展示率(%)',
      render: (text, content) => (text ? `${(text * 100).toFixed(2)}%` : getRate({ content, k1: 'show_num', k2: 'request_suc_num' })),
    },
    {
      key: 'click_num',
      dataIndex: 'click_num',
      title: '点击次数',
    },
    {
      key: 'click_rate',
      dataIndex: 'click_rate',
      title: '点击率(%)',
      render: (text, content) => (text ? `${(text * 100).toFixed(2)}%` : getRate({ content, k1: 'click_num', k2: 'show_num' })),
    },
    {
      key: 'video_num',
      dataIndex: 'video_num',
      title: '激励视频完成次数',
      width: 100,
    },
  ],
  day_placement_name: [
    {
      key: 'ds',
      dataIndex: 'ds',
      title: '日期',
    },
    {
      key: 'dau',
      dataIndex: 'dau',
      title: 'DAU',
    },
    {
      key: 'placement_id',
      dataIndex: 'placement_id',
      title: '广告位',
      render: (text, row) => (row.placementIdMap[text] || text),
    },
    {
      key: 'triggers',
      dataIndex: 'triggers',
      title: '触发次数',
    },
    // {
    //   key: 'triggeruid_num',
    //   dataIndex: 'triggeruid_num',
    //   title: '触发用户数',
    // },
    {
      key: 'request_num',
      dataIndex: 'request_num',
      title: '请求次数',
      // render: text => (text ? `${text}%` : ''),
    },
    {
      key: 'fill_suc_num',
      dataIndex: 'fill_suc_num',
      title: '填充成功',
      // render: text => (text ? `${text}%` : ''),
    },
    {
      key: 'fill_fail_num',
      dataIndex: 'fill_fail_num',
      title: '填充失败',
      // render: text => (text ? `${text}%` : ''),
    },
    {
      key: 'fill_rate',
      dataIndex: 'fill_rate',
      title: '填充率(%)',
      render: (text, content) => (text ? `${(text * 100).toFixed(2)}%` : getRate({ content, k1: 'fill_suc_num', k2: 'request_num' })),
    },
    {
      key: 'show_num',
      dataIndex: 'show_num',
      title: '展示次数',
    },
    // {
    //   key: 'showuid_num',
    //   dataIndex: 'showuid_num',
    //   title: '展示用户数',
    // },
    {
      key: 'show_rate',
      dataIndex: 'show_rate',
      title: '展示率(%)',
      render: (text, content) => (text ? `${(text * 100).toFixed(2)}%` : getRate({ content, k1: 'show_num', k2: 'request_suc_num' })),
    },
    {
      key: 'click_num',
      dataIndex: 'click_num',
      title: '点击次数',
    },
    {
      key: 'click_rate',
      dataIndex: 'click_rate',
      title: '点击率(%)',
      render: (text, content) => (text ? `${(text * 100).toFixed(2)}%` : getRate({ content, k1: 'click_num', k2: 'show_num' })),
    },
    {
      key: 'video_num',
      dataIndex: 'video_num',
      title: '激励视频完成次数',
      width: 100,
    },
  ],
};
