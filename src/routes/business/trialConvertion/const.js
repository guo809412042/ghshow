export const PRODUCT_LIST = {
  viva: 2,
  sp: 3,
  vid: 6,
  tempo: 10,
  vivacut: 15,
  vivamini: 16,
  PicsFox: 33,
  facee: 35,
  'Glitch-VFX': 36,
  GoCut: 43,
  VMix: 18,
  mast: 42,
  StoryBuff: 41,
  Veffecto: 39,
  小影印度马甲包: 44,
};

const width = 120;
// dau试用转化
export const dauConvertColumns = [
  {
    title: '日期',
    dataIndex: 'ds',
    key: 'ds',
    width,
  },
  {
    title: 'dau',
    dataIndex: 'dau',
    key: 'dau',
    width,
  },
  {
    title: '活跃付费人数',
    dataIndex: 'pay_dvc_cnt_1d',
    key: 'pay_dvc_cnt_1d',
    width,
  },
  {
    title: '活跃试用人数',
    dataIndex: 'trial_dvc_cnt_1d',
    key: 'trial_dvc_cnt_1d',
    width,
  },
  {
    title: '活跃试用转付费人数（15日）',
    dataIndex: 'trial_pay_dvc_cnt_1d',
    key: 'trial_pay_dvc_cnt_1d',
    width,
  },
  {
    title: '试用率',
    dataIndex: 'trial_rate',
    key: 'trial_rate',
    width,
    render: text => `${text || 0}%`,
  },
  {
    title: '试用转化率',
    dataIndex: 'trial_convert_rate',
    key: 'trial_convert_rate',
    width,
    render: text => `${text || 0}%`,
  },
  {
    title: '付费率',
    dataIndex: 'pay_rate',
    key: 'pay_rate',
    width,
    render: text => `${text || 0}%`,
  },
];

// 新用户试用转化
export const userConvertColumns = [
  {
    title: '日期',
    dataIndex: 'ds',
    key: 'ds',
    width,
  },
  {
    title: '新用户数',
    dataIndex: 'dau',
    key: 'dau',
    width,
  },
  {
    title: '首日直接付费人数',
    dataIndex: 'pay_dvc_cnt_1d',
    key: 'pay_dvc_cnt_1d',
    width,
  },
  {
    title: '首日试用人数',
    dataIndex: 'trial_dvc_cnt_1d',
    key: 'trial_dvc_cnt_1d',
    width,
  },
  {
    title: '试用转付费人数（15日）',
    dataIndex: 'trial_pay_dvc_cnt_1d',
    key: 'trial_pay_dvc_cnt_1d',
    width,
  },
  {
    title: '首日试用率',
    dataIndex: 'trial_rate',
    key: 'trial_rate',
    width,
    render: text => `${text || 0}%`,
  },
  {
    title: '首日试用转化率',
    dataIndex: 'trial_convert_rate',
    key: 'trial_convert_rate',
    width,
    render: text => `${text || 0}%`,
  },
  {
    title: '首日试用付费率',
    dataIndex: 'trial_pay_rate',
    key: 'trial_pay_rate',
    width,
    render: text => `${text || 0}%`,
  },
  {
    title: '首日直接付费率',
    dataIndex: 'pay_rate',
    key: 'pay_rate',
    width,
    render: text => `${text || 0}%`,
  },
];

// 新用户试用率
export const userRateColumns = [
  {
    title: '日期',
    dataIndex: 'ds',
    key: 'ds',
    width,
  },
  {
    title: '新用户数',
    dataIndex: 'new_usr_cnt_1d',
    key: 'new_usr_cnt_1d',
    width,
  },
  {
    title: '当日试用',
    dataIndex: 'interval_day0',
    key: 'interval_day0',
    width,
  },
  {
    title: '1天后试用',
    dataIndex: 'interval_day1',
    key: 'interval_day1',
    width,
  },
  {
    title: '2天后试用',
    dataIndex: 'interval_day2',
    key: 'interval_day2',
    width,
  },
  {
    title: '3天后试用',
    dataIndex: 'interval_day3',
    key: 'interval_day3',
    width,
  },
  {
    title: '4天后试用',
    dataIndex: 'interval_day4',
    key: 'interval_day4',
    width,
  },
  {
    title: '5天后试用',
    dataIndex: 'interval_day5',
    key: 'interval_day5',
    width,
  },
  {
    title: '6天后试用',
    dataIndex: 'interval_day6',
    key: 'interval_day6',
    width,
  },
  {
    title: '7天后试用',
    dataIndex: 'interval_day7',
    key: 'interval_day7',
    width,
  },
  {
    title: '15天后试用',
    dataIndex: 'interval_day15',
    key: 'interval_day15',
    width,
  },
  {
    title: '30天后试用',
    dataIndex: 'interval_day30',
    key: 'interval_day30',
    width,
  },
];

// 新用户试用转付费
export const userToPayColumns = [
  {
    title: '日期',
    dataIndex: 'ds',
    key: 'ds',
    width,
  },
  {
    title: '新用户数',
    dataIndex: 'new_usr_cnt_1d',
    key: 'new_usr_cnt_1d',
    width,
  },
  {
    title: '当日试用转付费',
    dataIndex: 'interval_day0',
    key: 'interval_day0',
    width,
  },
  {
    title: '1天后试用转付费',
    dataIndex: 'interval_day1',
    key: 'interval_day1',
    width,
  },
  {
    title: '2天后试用转付费',
    dataIndex: 'interval_day2',
    key: 'interval_day2',
    width,
  },
  {
    title: '3天后试用转付费',
    dataIndex: 'interval_day3',
    key: 'interval_day3',
    width,
  },
  {
    title: '4天后试用转付费',
    dataIndex: 'interval_day4',
    key: 'interval_day4',
    width,
  },
  {
    title: '5天后试用转付费',
    dataIndex: 'interval_day5',
    key: 'interval_day5',
    width,
  },
  {
    title: '6天后试用转付费',
    dataIndex: 'interval_day6',
    key: 'interval_day6',
    width,
  },
  {
    title: '7天后试用转付费',
    dataIndex: 'interval_day7',
    key: 'interval_day7',
    width,
  },
  {
    title: '15天后试用转付费',
    dataIndex: 'interval_day15',
    key: 'interval_day15',
    width,
  },
  {
    title: '30天后试用转付费',
    dataIndex: 'interval_day30',
    key: 'interval_day30',
    width,
  },
];

export const COUNTRY_NAME_COMMON_LIST = [
  { country_code: ['中国', '美国', '日本', '韩国', '台湾', '泰国'], country_name: '中美日韩台泰' },
  { country_code: ['印度', '印度尼西亚', '巴西'], country_name: '印度印尼巴西' },
  { country_code: ['伊朗', '巴基斯坦', '土耳其', '俄罗斯'], country_name: '伊朗巴基斯坦土耳其俄罗斯' },
  { country_code: ['中国', '美国', '韩国', '台湾', '日本', '泰国'], country_name: '第一梯度' },
  {
    country_code: [
      '马来西亚',
      '俄罗斯',
      '英国',
      '西班牙',
      '德国',
      '沙特阿拉伯',
      '澳大利亚',
      '法国',
      '加拿大',
      '香港',
      '意大利',
      '新加坡',
      '阿联酋',
      '以色列',
      '阿根廷',
      '瑞士',
      '新西兰',
      '科威特',
      '智利',
      '奥地利',
      '荷兰',
      '瑞典',
      '阿曼',
      '比利时',
      '芬兰',
      '罗马尼亚',
      '波兰',
      '挪威',
      '卡塔尔',
      '爱尔兰',
      '捷克共和国',
      '哥斯达黎加',
      '巴拿马',
      '葡萄牙',
      '丹麦',
      '希腊',
      '澳门',
      '匈牙利',
      '斯洛伐克',
      '巴林',
      '乌拉圭',
      '波多黎各',
      '立陶宛',
      '克罗地亚',
      '拉脱维亚',
      '塞浦路斯',
      '斯洛文尼亚',
      '特立尼达和多巴哥',
      '爱沙尼亚',
      '巴哈马',
      '卢森堡',
      '毛里求斯',
      '马耳他',
      '文莱',
      '冰岛',
      '安提瓜和巴布达',
      '巴巴多斯',
      '阿鲁巴',
      '圣基茨和尼维斯',
      '帕劳',
      '塞舌尔',
      '格林纳达',
      '圣卢西亚',
    ],
    country_name: '第二梯度',
  },
  {
    country_code: [
      '蒙古',
      '格鲁吉亚',
      '关岛',
      '马其顿',
      '波黑',
      '瓜德罗普岛',
      '开曼群岛',
      '留尼汪岛',
      '北马里亚纳群岛',
      '百慕大',
      '特克斯和凯科斯群岛',
      '刚果',
      '英属维尔京群岛',
      '美属萨摩亚',
      '维尔京群岛',
      '安圭拉',
      '斯威士兰',
      '列支敦士登',
      '墨西哥',
      '土耳其',
      '保加利亚',
      '黎巴嫩',
      '哈萨克斯坦',
      '巴西',
      '加蓬',
      '博茨瓦纳',
      '多米尼加共和国',
      '土库曼斯坦',
      '圣文森特和格林纳丁斯',
      '塞尔维亚',
      '秘鲁',
      '多米尼克',
      '哥伦比亚',
      '南非',
      '厄瓜多尔',
      '白俄罗斯',
      '伊拉克',
      '巴拉圭',
      '苏里南',
      '斐济',
      '纳米比亚',
      '牙买加',
      '阿尔巴尼亚',
      '伯利兹',
      '圭亚那',
      '危地马拉',
      '阿塞拜疆',
      '约旦',
      '阿尔及利亚',
      '亚美尼亚',
      '斯里兰卡',
      '萨尔瓦多',
      '印度尼西亚',
      '马绍尔群岛',
      '玻利维亚',
      '安哥拉',
      '佛得角',
      '突尼斯',
      '委内瑞拉',
      '摩洛哥',
      '摩尔多瓦',
      '不丹',
      '菲律宾',
      '乌克兰',
      '老挝',
      '埃及',
      '越南',
      '巴布亚新几内亚',
      '洪都拉斯',
      '所罗门群岛',
      '加纳',
      '尼加拉瓜',
      '尼日利亚',
      '印度',
      '肯尼亚',
      '孟加拉国',
      '津巴布韦',
      '科特迪瓦',
      '巴基斯坦',
      '喀麦隆',
      '柬埔寨',
      '塞内加尔',
      '赞比亚',
      '缅甸',
      '吉尔吉斯斯坦',
      '乌兹别克斯坦',
      '毛里塔尼亚',
      '坦桑尼亚',
      '尼泊尔',
      '马里',
      '贝宁',
      '乍得',
      '也门',
      '海地',
      '几内亚比绍',
      '塔吉克斯坦',
      '卢旺达',
      '冈比亚',
      '布基纳法索',
      '利比里亚',
      '乌干达',
      '多哥',
      '塞拉利昂',
      '尼日尔',
      '莫桑比克',
      '马达加斯加',
      '马拉维',
    ],
    country_name: '第三梯度',
  },
];
