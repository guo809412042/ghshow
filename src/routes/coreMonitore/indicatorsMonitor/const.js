/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-14 16:15:46
 * @LastEditTime: 2020-06-08 17:02:53
 * @LastEditors: ssssslf
 */

const BasicColumns = [
  {
    title: 'DAU',
    dataIndex: 'dau',
    key: 'dau',
    sorter: (a, b) => a.dau - b.dau,
  },
  { title: '总新增', dataIndex: 'new_dvc_cnt', key: 'new_dvc_cnt' },
  { title: '投放新增', dataIndex: 'put_new_dvc_cnt', key: 'put_new_dvc_cnt' },
  { title: '自然量新增', dataIndex: 'organic_new_dvc_cnt', key: 'organic_new_dvc_cnt' },
  { title: '投放次留', dataIndex: 'put_dvc_stay_cnt/put_new_dvc_cnt', key: 'put_dvc_stay_cnt/put_new_dvc_cnt' },
  {
    title: '自然次留',
    dataIndex: 'organic_dvc_stay_cnt/organic_new_dvc_cnt',
    key: 'organic_dvc_stay_cnt/organic_new_dvc_cnt',
  },
];
const EditColumns = [
  { title: '进入首页占比', dataIndex: 'enter_home_dvc_cnt/dau', key: 'enter_home_dvc_cnt/dau' },
  { title: '进入gallery占比', dataIndex: 'enter_gallery_dvc_cnt/dau', key: 'enter_gallery_dvc_cnt/dau' },
  { title: '进入编辑页占比', dataIndex: 'enter_edit_dvc_cnt/dau', key: 'enter_edit_dvc_cnt/dau' },
  { title: '点击导出占比', dataIndex: 'click_save_dvc_cnt/dau', key: 'click_save_dvc_cnt/dau' },
  { title: '导出完成占比', dataIndex: 'exp_succ_dvc_cnt/dau', key: 'exp_succ_dvc_cnt/dau' },
  { title: '视频导出量', dataIndex: 'exp_succ_cnt', key: 'exp_succ_cnt' },
  { title: '人均导出', dataIndex: 'exp_succ_cnt%dau', key: 'exp_succ_cnt%dau' },
];
const MoneyColumns = [
  { title: '总收入', dataIndex: 'income', key: 'income' },
  { title: '首购收入', dataIndex: 'fst_income', key: 'fst_income' },
  { title: '续费收入', dataIndex: 'renew_income', key: 'renew_income' },
  {
    title: '新用户7日付费率',
    dataIndex: 'new_dvc_pay_dvc_cnt_7d/new_dvc_cnt',
    key: 'new_dvc_pay_dvc_cnt_7d/new_dvc_cnt',
  },
  { title: '新用户试用率', dataIndex: 'trial_dvc_cnt/new_dvc_cnt', key: 'trial_dvc_cnt/new_dvc_cnt' },
  { title: '试用转化率', dataIndex: 'trial_pay_dvc_cnt/trial_dvc_cnt', key: 'trial_pay_dvc_cnt/trial_dvc_cnt' },
];
const TempColumns = [
  {
    title: '整体使用素材',
    dataIndex: 'use_material_dvc_cnt/exp_succ_dvc_cnt',
    key: 'use_material_dvc_cnt/exp_succ_dvc_cnt',
  },
  { title: '音乐', dataIndex: 'exp_bgm_dvc_cnt/exp_succ_dvc_cnt', key: 'exp_bgm_dvc_cnt/exp_succ_dvc_cnt' },
  { title: '主题', dataIndex: 'exp_theme_dvc_cnt/exp_succ_dvc_cnt', key: 'exp_theme_dvc_cnt/exp_succ_dvc_cnt' },
  { title: '调色滤镜', dataIndex: 'exp_cf_dvc_cnt/exp_succ_dvc_cnt', key: 'exp_cf_dvc_cnt/exp_succ_dvc_cnt' },
  { title: '特效滤镜', dataIndex: 'exp_ef_dvc_cnt/exp_succ_dvc_cnt', key: 'exp_ef_dvc_cnt/exp_succ_dvc_cnt' },
  { title: '文字', dataIndex: 'exp_t_dvc_cnt/exp_succ_dvc_cnt', key: 'exp_t_dvc_cnt/exp_succ_dvc_cnt' },
  { title: '贴纸', dataIndex: 'exp_stick_dvc_cnt/exp_succ_dvc_cnt', key: 'exp_stick_dvc_cnt/exp_succ_dvc_cnt' },
  { title: '转场', dataIndex: 'exp_trans_dvc_cnt/exp_succ_dvc_cnt', key: 'exp_trans_dvc_cnt/exp_succ_dvc_cnt' },
  { title: '特效', dataIndex: 'fx_dvc_cnt/exp_succ_dvc_cnt', key: 'fx_dvc_cnt/exp_succ_dvc_cnt' },
  { title: '模版', dataIndex: 'atr_puid_cnt/exp_succ_dvc_cnt', key: 'atr_puid_cnt/exp_succ_dvc_cnt' },
];
const AbColumns = [
  { title: '导出成功率', dataIndex: 'exp_succ_cnt/start_exp_cnt', key: 'exp_succ_cnt/start_exp_cnt' },
  { title: '导出失败率', dataIndex: 'exp_fail_cnt/start_exp_cnt', key: 'exp_fail_cnt/start_exp_cnt' },
  { title: '导出取消率', dataIndex: 'exp_cancel_cnt/start_exp_cnt', key: 'exp_cancel_cnt/start_exp_cnt' },
  {
    title: '普通导出平均速率',
    dataIndex: 'exp_normal_vdo_size%exp_normal_vdo_time',
    key: 'exp_normal_vdo_size%exp_normal_vdo_time',
  },
  { title: '高清导出平均速率', dataIndex: 'exp_hd_vdo_size%exp_hd_vdo_time', key: 'exp_hd_vdo_size%exp_hd_vdo_time' },
  {
    title: '普通导出平均时长',
    dataIndex: 'exp_normal_vdo_time%exp_normal_cnt',
    key: 'exp_normal_vdo_time%exp_normal_cnt',
  },
  { title: '高清导出平均时长', dataIndex: 'exp_hd_vdo_time%exp_hd_cnt', key: 'exp_hd_vdo_time%exp_hd_cnt' },
];
export const columnsKeys = [
  { value: '1', label: '基础指标', columns: BasicColumns },
  { value: '2', label: '编辑指标', columns: EditColumns },
  { value: '3', label: '变现指标(美元)', columns: MoneyColumns },
  { value: '4', label: '素材指标', columns: TempColumns },
  { value: '5', label: '性能指标', columns: AbColumns },
];

export const AllColumns = [...BasicColumns, ...EditColumns, ...MoneyColumns, ...TempColumns, ...AbColumns];
