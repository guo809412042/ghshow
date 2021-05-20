/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-05-26 16:17:26
 * @LastEditTime: 2020-05-26 16:43:43
 * @LastEditors: ssssslf
 */

// denominator 分母
// molecular 分子
export const getCardData = ghPlatform => [
  {
    title: ghPlatform * 1 === 1 ? 'DAU' : 'DAU(真实)',
    molecular: 'active_device_num',
    database: 'vcm_app_comm_dau_add_dvc_ads',
  },
  {
    title: ghPlatform * 1 === 1 ? '次日留存' : '次日留存(真实)',
    molecular: 'stay_num',
    denominator: 'reg_num',
    database: 'vcm_app_comm_usr_stay_ads',
    suffix: true,
  },
  {
    title: '老用户留存',
    molecular: 'stay_num',
    denominator: 'reg_num',
    database: 'vcm_app_comm_usr_stay_ads',
    suffix: true,
    selectList: [
      {
        name: '一周',
        value: '2',
      },
      {
        name: '一月',
        value: '3',
      },
      {
        name: '一月以上',
        value: '100',
      },
    ],
  },
  {
    title: '新增设备数',
    molecular: 'active_new_device_num',
    database: 'vcm_app_comm_dau_add_dvc_ads',
  },
  {
    title: '工具用户次留',
    molecular: 'stay_num',
    denominator: 'reg_num',
    database: 'vcm_app_comm_usr_stay_ads',
    suffix: true,
  },
  {
    title: 'push点击',
    database: 'push_click_count_day',
    radioList: [
      { value: 'duid_total', name: '整体' },
      { value: 'remote_duid_total', name: '运营推送' },
      { value: 'local_duid_total', name: '本地推送' },
    ],
  },
];
