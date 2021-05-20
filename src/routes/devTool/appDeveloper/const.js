import { dict2List } from '../../../utils/utils';

const defaultProduct = '2';
const productList = [
  {
    value: defaultProduct,
    label: '小影',
  },
  {
    value: '6',
    label: 'vidStatus',
  },
  {
    value: '20',
    label: '直播',
  },
  {
    value: '27',
    label: 'hayya',
  },
];

const STATEMAP = {
  0: '未开始',
  1: '开发完成',
  2: '测试完成',
};
const STATEMAPColor = {
  0: '#f50',
  1: '#87d068',
  2: '#2db7f5',
};

const platformList = [
  {
    value: 'Android',
    label: 'Android',
  },
  {
    value: 'iOS',
    label: 'iOS',
  },
  {
    value: 'Android/iOS',
    label: 'Android/iOS',
  },
];
const IDpageDict = {
  Splash: '启动',
  Home: '首页',
  Gallery: '相册选择页',
  Preview: '编辑页',
  VE: '编辑',
  My: '首页-我',
  Follow: '关注页',
  Hot: '推荐页',
  Export: '导出页',
  Share: '分享页',
  Course: '教程页',
  Template: '模板页',
  Store: '素材中心',
  Login: '登陆页',
  Setting: '设置页',
  Music: '音乐',
  Subscription: 'VIP购买页',
  Pop: '弹窗',
  Banner: '轮播图',
  Message: '消息',
  Camera: '拍摄',
};
const IDpageList = dict2List(IDpageDict);
const IDmoduleDict = {
  Clip: '相册文件',
  Work: '我的作品',
  Draft: '我的草稿',
  Timeline: '时间线',
  Theme: '主题',
  BGM: '配乐',
  SoundEffects: '音效',
  Sound: '录音',
  ExtractMusic: '音频提取',
  VoiceChanger: '变声',
  Mute: '静音',
  Trim: '修剪',
  Canvas_BG: '比例和背景',
  Split: '分割',
  Speed: '变速',
  Reverse: '镜头倒放',
  Transition: '转场',
  Duration: '图片时长',
  Pic_zoom: '图片动画',
  ClipsOrder: '镜头排序',
  Title: '文字',
  Sticker: '贴纸',
  PIP: '画中画',
  Watermark: '水印',
  Mosaic: '马赛克',
  Fx: '特效',
  Keyframe: '关键帧',
  ColorFilter: '调色滤镜',
  EffectFilter: '特效滤镜',
  Adjust: '参数调节',
};
const IDmoduleList = dict2List(IDmoduleDict);
const IDcontrolDict = {
  Button: '按钮',
  Tab: '表',
  Page: '页面',
  Package: '素材包',
};
const IDcontrolList = dict2List(IDcontrolDict);
const IDactionDict = {
  Enter: '进入',
  Exit: '退出',
  Export: '导出',
  Show: '展示、曝光',
  Click: '点击',
  Use: '使用',
  Next: '下一步',
  Save: '保存',
  Add: '添加',
  Delete: '删除',
  Modify: '修改',
  Switch: '切换',
  Back: '返回',
  Start: '开始',
  Finish: '结束',
  Video_Play: '观看视频',
  Share: '分享',
  Download: '下载',
  Confirm: '确认',
  Like: '点赞、喜欢',
  Comment: '评论',
  Discard: '放弃',
  Slide: '滑动',
  Choose: '选择',
  Search: '搜索',
  Sort: '排序',
  Rate: '好评',
  Success: '成功',
  Fail: '失败',
  Cancel: '取消',
};
const IDactionList = dict2List(IDactionDict);

const eventTypeDict = {
  int: 'int',
  string: 'string',
  boolean: 'boolean',
};
const eventTypeList = dict2List(eventTypeDict);

const defaultEventKeyList = [
  {
    key: 'abTagList',
    type: 'string',
    remark: '',
  },
  {
    key: 'com_function',
    type: 'string',
    remark: '',
  },
  {
    key: 'com_Status',
    type: 'string',
    remark: '',
  },
  {
    key: 'com_createPosition',
    type: 'string',
    remark: '',
  },
  {
    key: 'com_projectID',
    type: 'string',
    remark: '',
  },
  {
    key: 'com_ttid',
    type: 'string',
    remark: '',
  },
];

const TYPEMAP = {
  1: '页面',
  2: '模块',
  3: '控件',
  4: '行为',
};

export {
  defaultProduct,
  productList,
  STATEMAP,
  STATEMAPColor,
  platformList,
  IDpageDict,
  IDmoduleDict,
  IDcontrolDict,
  IDactionDict,
  IDpageList,
  IDmoduleList,
  IDcontrolList,
  IDactionList,
  eventTypeDict,
  eventTypeList,
  defaultEventKeyList,
  TYPEMAP,
};
