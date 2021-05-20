
export const cardData = [
  {
    title: '创作者总量',
    num: 'total_creator_cnt',
    pTitle: '日活情况',
    before: false,
  },
  {
    title: 'DAU',
    num: 'dau',
    pTitle: '日活情况',
    before: true,
  },
  {
    title: '活跃创作者',
    num: 'pub_creator_cnt',
    pTitle: '日活情况',
    before: true,
  },
  {
    title: '新增创作者',
    num: 'new_creator_cnt',
    pTitle: '日活情况',
    before: true,
  },
  {
    title: '回流创作者',
    num: 'pub_return_creator_cnt',
    pTitle: '日活情况',
    before: true,
  },
  {
    title: '留存创作者',
    num: 'pub_cnt_creator_cnt',
    pTitle: '日活情况',
    before: true,
  },
  {
    title: '超级创作者',
    num: 'super_creator_cnt',
    pTitle: '日活情况',
    before: true,
  },
  {
    title: '原创创作者',
    num: 'original_creator_cnt',
    pTitle: '日活情况',
    before: true,
  },
  {
    title: '发布视频数量',
    num: 'publish_count',
    pTitle: '发布情况',
    before: true,
  },
  {
    title: '水印视频占比',
    num: 'watermark_vc%publish_count',
    pTitle: '发布情况',
    before: true,
    suffix: true,
    fixed: true,
  },
  {
    title: '有效视频',
    num: 'qualified_v_cnt',
    pTitle: '发布情况',
    before: true,
  },
  {
    title: '热门曝光视频',
    num: 'exp_v_cnt',
    pTitle: '视频消费情况',
    before: true,
  },
  {
    title: '曝光量',
    num: 'exposure_count',
    pTitle: '视频消费情况',
    before: true,
  },
  {
    title: '播放量',
    num: 'play_3s_count',
    pTitle: '视频消费情况',
    before: true,
  },
  {
    title: '下载量',
    num: 'download_count',
    pTitle: '视频消费情况',
    before: true,
  },
  {
    title: 'PTR',
    num: 'play_3s_count%exposure_count',
    pTitle: '视频消费情况',
    before: true,
    suffix: true,
    fixed: true,
  },
  {
    title: 'DTR',
    num: 'download_count%exposure_count',
    pTitle: '视频消费情况',
    before: true,
    suffix: true,
    fixed: true,
  },
  {
    title: '金币(RMB)',
    num: 'reward_cost',
    pTitle: '奖励情况',
    before: true,
  },
  {
    title: '奖励人数',
    num: 'reward_user_cnt',
    pTitle: '奖励情况',
    before: true,
  },
  {
    title: '奖励视频数',
    num: 'reward_v_cnt',
    pTitle: '奖励情况',
    before: true,
  },
  {
    title: '提现用户数',
    num: 'withdraw_user_cnt',
    pTitle: '奖励情况',
    before: true,
  },
];


export const TabPaneOneTable = {
  columns: [
    {
      title: '日期',
      dataIndex: 'DAY',
    },
    {
      title: '创作者总量',
      dataIndex: 'total_creator_cnt',
    },
    {
      title: 'dau',
      dataIndex: 'dau',
    },
    {
      title: '活跃创作者数量',
      dataIndex: 'pub_creator_cnt',
    },
    {
      title: '新增创作者',
      dataIndex: 'new_creator_cnt',
    },
    {
      title: '回流创作者数量',
      dataIndex: 'pub_return_creator_cnt',
    },
    {
      title: '留存创作者数量',
      dataIndex: 'pub_cnt_creator_cnt',
    },
    {
      title: '超级创作者数量',
      dataIndex: 'super_creator_cnt',
    },
    {
      title: '原创创作者数量',
      dataIndex: 'original_creator_cnt',
    },
    {
      title: '次日留存率',
      dataIndex: 'T2.ret_cnt * 100 / T2.pub_creator_cnt',
    },
    {
      title: '流失率',
      dataIndex: 'T2.lost_cnt * 100 / T2.pub_creator_cnt',
    },
    {
      title: '发布视频数量',
      dataIndex: 'publish_count',
    },
    {
      title: '水印视频占比',
      dataIndex: 'T1.watermark_vc * 100 / T1.publish_count',
    },
    {
      title: '有效视频',
      dataIndex: 'qualified_v_cnt',
    },
    {
      title: '热门曝光视频',
      dataIndex: 'exp_v_cnt',
    },
    {
      title: '曝光量',
      dataIndex: 'exposure_count',
    },
    {
      title: '播放量',
      dataIndex: 'play_3s_count',
    },
    {
      title: '下载量',
      dataIndex: 'download_count',
    },
    {
      title: 'PTR',
      dataIndex: 'T1.play_3s_count * 100 / T1.exposure_count',
    },
    {
      title: 'DTR',
      dataIndex: 'T1.download_count * 100 / T1.exposure_count',
    },
    {
      title: '奖励金额',
      dataIndex: 'reward_cost',
    },
    {
      title: '奖励人数',
      dataIndex: 'reward_user_cnt',
    },
    {
      title: '奖励视频数',
      dataIndex: 'reward_v_cnt',
    },
    {
      title: '提现用户数',
      dataIndex: 'withdraw_user_cnt',
    },
  ],
};


export const TabPaneVideo = {
  columns: [
    {
      title: 'auid',
      dataIndex: 'auid',
      key: 'auid',
    },
    {
      title: 'puid',
      dataIndex: 'puid',
      key: 'puid',
    },
    {
      title: '语言',
      dataIndex: 'lang',
      key: 'lang',
    },
    {
      title: '上传方式',
      dataIndex: 'video_type',
      key: 'video_type',
    },
    {
      title: '水印状态',
      dataIndex: 'is_watermark',
      key: 'is_watermark',
    },
    {
      title: '曝光量',
      dataIndex: 'exposure_count',
      key: 'exposure_count',
    },
    {
      title: '播放量',
      dataIndex: 'play_count',
      key: 'play_count',
    },
    {
      title: 'PTR',
      dataIndex: 'play_count／exposure_count',
      key: 'play_count／exposure_count',
    },
    {
      title: 'DTR',
      dataIndex: 'download_count/exposure_count',
      key: 'download_count/exposure_count',
    },
    {
      title: '收益',
      dataIndex: 'coin',
      key: 'coin',
    },
  ],
};
export const TYPES_LIST = {
  coin_range: ['(0,50]', '(50,200]', '200+', '未获得收益'],
  upper_level: ['normal', 'upper'],
  original: ['原创', '非原创'],
  super: ['超级创作者', '创作者', '待激活超级创作者'],
  income: ['头部', '中部', '尾部', '未获得收益'],
  normal_creator: ['creator', 'publisher', 'predict_creator'],
};
