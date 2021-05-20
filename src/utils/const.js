/* eslint-disable no-dupe-keys */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-27 17:30:54
 * @LastEditTime: 2020-12-17 15:53:39
 * @LastEditors: dongqi.zhao
 */
export const APP_PRODUCT_LIST = {
  2: 'VivaVideo',
  3: 'SlidePlus',
  6: 'VidStatus',
  10: 'Tempo',
  15: 'VivaCut',
  16: 'VivaMini',
  35: 'Facee',
};

export const APP_PRODUCT_LIST_WITHOUT_VID = {
  2: 'VivaVideo',
  3: 'SlidePlus',
  10: 'Tempo',
  15: 'VivaCut',
  16: 'VivaMini',
  18: 'VMix',
  35: 'Facee',
};

export const PLAFORM_LIST = {
  1: 'Android',
  2: 'iOS',
};

export const MEDIA_SOURCE_LIST = {
  Organic: 'Organic',
  'UAC source': 'UAC source',
  douyin: 'douyin',
  tiktok: 'tiktok',
  ASM: 'ASM',
  FBad: 'FBad',
};

export const PRODUCT_APP_MIN = {
  viva: '2',
  sp: '3',
  vid: '6',
  tempo: '10',
  vivacut: '15',
  vivamini: '16',
  picsfox: '33',
  facee: '35',
  mast: '42',
};

export const PRODUCT_LIST_MIN = {
  2: 'viva',
  3: 'sp',
  6: 'vid',
  10: 'tempo',
  15: 'vivacut',
  16: 'vivamini',
  35: 'facee',
  18: 'vmix',
  36: 'glitchfx',
  43: 'gocut',
};

export const ANNOTATION = {
  DAU: 'Android触发任一页面事件，iOS触发指定事件',
  'Android-DAU': 'Android触发任一页面事件',
  'iOS-DAU': 'iOS触发指定事件',
  '新增-DAU': '设备新增-唯一设备且与阿里校对',
  新增: '设备新增-唯一设备且与阿里校对',
  'Android新增-DAU': '设备新增-唯一设备且与阿里校对',
  'iOS新增-DAU': '设备新增-唯一设备且与阿里校对',
  MAU: 'DAU 月去重',
  'Android-MAU': 'Android-DAU 月去重',
  'iOS-MAU': 'iOS-DAU 月去重',
  次日留存: '新增用户在第二天活跃',
  老用户留存: '老用户次日活跃',
  工具用户次留: '工具用户在新增当天完成上述事件且在第二天依然完成上述事件的比例',
  '7日rolling留存': '新用户在新增的第二天-第七天中任意一天活跃的用户占比',
  人均分享次数: '分享总次数/分享用户数',
  教程用户播放的7日rolling: '播放教程的用户在后续第二天-第七天内任意一天观看教程的用户占比',
  曝光占比: '用户中有模版曝光（School_Module_Show）的用户占DAU的比例',
  模版进入率: '进入剪辑页的用户数/有模版曝光的用户数',
  模版完成率: '导出人数/剪辑页进入人数',
  模版创作用户占比: '分子是导出小影学院模版的用户数，分母是导出视频的用户数',
  模版创作视频数占比: '分子式导出小影学院模版的视频数，分母是导出视频的视频总数',
  教程播放总数: '教程播放的总数',
  教程播放用户占比: '教程播放的用户/视频播放的用户',
  一键分享占比: '一键分享的视频总数/分享的视频总数',
  素材使用率: '使用者对使用率定义概念不同，后续直接用我们的漏斗分析观察',
  新增设备数: '新增为服务端新增',
  '剪辑完成率(导出完成/进入Preview)': '导出完成/进入Preview',
  '剪辑完成率(点击保存/进入Preview)': '点击保存/进入Preview',
  '用户进入preview占比(进入Preview/DAU)': '进入Preview/DAU',
  '用户导出完成占比(导出完成/DAU)': '导出完成/DAU',
  导出成功率: '导出完成/导出开始',
  导出闪退率: '（导出开始-导出完成-导出失败-导出取消）/导出开始',
  导出失败率: '导出失败/导出开始',
  导出取消率: '导出取消/导出开始',
  导出平均速率: '导出总文件大小/总时长',
  导出平均时长: '导出总时长/总导出数',
  上传失败率: '上传失败/上传总数',
  上传取消率: '上传取消/上传总数',
  人均播放视频数: '视频播放总数/视频播放设备数',
  平均视频播放数: '视频播放总数/被播放的视频总数',
  人均曝光数: '曝光总量/曝光设备数',
  '有效人均播放时长(s)': '视频播放时长/有效播放(播放3s)设备数',
  人均请求数: '视频曝光请求总量/曝光请求设备数',
  人均点赞: '点赞总量/点赞设备数',
  人均下载: '下载总量/下载设备数',
  人均评论: '评论总量/评论设备数',
  人均转发: '转发总量/转发设备数',
  人均搜索: '搜索总量/搜索设备数',
  人均举报: '举报总量/举报设备数',
  ptr: '播放量/曝光量',
  'Push_Show_Rate_of_New Device(%)': '展示push新设备量/新设备量',
  Push_Show_Count_Per_New_Device: '新设备push展示量/新设备量',
  'Push_Receive_Rate_of_New_Device(%)': '接收push新设备量/新设备量',
  Push_Receive_Count_Per_New_Device: '新设备push接收量/新设备量',
  Total_Receive_Count: 'push总接收量',
  'Total_Show_Count shows': 'push总展示量',
  'Total_Click_Count click': 'push总点击量',
  'click/receive(%)': 'Total_Click_Count click/Total_Receive_Count',
  收到push设备数: '成功接收到push的设备数量',
  '点击push设备占比(%)': '点击设备数/接收设备数',
  导出成功率:
    ' 5.9.0及以上版本为：(Share_Export_Done_Modify+Share_Export_Done_Modify_HD)/(Share_Export_Start_Modify+Share_Export_Start_Modify_HD) 5.8.10及以下版本为：（Share_Export_Done_New+HD_Export_Success）/(Share_Export_New2+HD_Export_Start)"',
  导出失败率:
    'Share_Export_Fail_modify + Share_Export_Fail_modify_HD） / （Share_Export_Start_modify + Share_Export_Start_modify_HD）',
  平均导出速率:
    'Share_Export_Done_Modify(HD/GIF/4k)中sum(size_detail)/sum(cost_detail)得到导出平均速率的均值，可以选择导出的类型，单位是kb/s。',
  平均导出时长:
    'Share_Export_Done_Modify(HD/GIF/4k)中sum(cost_detail)/sum(导出次数)得到导出平均时长的均值，可以选择导出的类型，单位是s（秒）',
};
