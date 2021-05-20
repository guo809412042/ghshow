/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-19 14:49:58
 * @LastEditTime: 2020-06-24 10:14:42
 * @LastEditors: ssssslf
 */

export const columns = [
  { dataIndex: 'name', title: '模版名称' },
  { dataIndex: 'ttid', title: 'ttid' },
  { dataIndex: 'view_dvc_cnt_1d', title: '模版展示量' },
  { dataIndex: 'temp_make_dvc_cnt_1d', title: '模版页制作量' },
  { dataIndex: 'temp_make_dvc_cnt_1d/view_dvc_cnt_1d', title: '模版页制作率(%)' },
  { dataIndex: 'make_dvc_cnt_1d', title: '总制作量' },
  { dataIndex: 'make_dvc_cnt_1d/view_dvc_cnt_1d', title: '总制作率(%)' },
  { dataIndex: 'share_dvc_cnt_1d', title: '视频分享量' },
  { dataIndex: 'share_dvc_cnt_1d/make_dvc_cnt_1d', title: '视频分享率(%)' },
  { dataIndex: 'make_fail_dvc_cnt_1d', title: '模板制作失败量' },
  { dataIndex: 'make_fail_dvc_cnt_1d/make_dvc_cnt_1d', title: '模板制作失败率(%)' },
  { dataIndex: 'del_dvc_cnt_1d', title: '视频删除量' },
  { dataIndex: 'del_dvc_cnt_1d/make_dvc_cnt_1d', title: ' 视频删除率(%)' },
  { dataIndex: 'pay_dvc_cnt_1d', title: '模板付费数' },
  { dataIndex: 'pay_dvc_cnt_1d/view_dvc_cnt_1d', title: '模板付费率(%)' },
  { dataIndex: 'coil_60_dvc_cnt_1d', title: '按60金币购买' },
  { dataIndex: 'coil_60_dvc_cnt_1d/pay_dvc_cnt_1d', title: '60金币购买占比(%)' },
  { dataIndex: 'coil_200_dvc_cnt_1d', title: '按200金币购买' },
  { dataIndex: 'coil_200_dvc_cnt_1d/pay_dvc_cnt_1d', title: '200金币购买占比(%)' },
  { dataIndex: 'month_pay_dvc_cnt_1d', title: '按月度会员购买' },
  { dataIndex: 'month_pay_dvc_cnt_1d/pay_dvc_cnt_1d', title: '月度会员购买占比(%)' },
  { dataIndex: 'year_pay_dvc_cnt_1d', title: '按年度会员购买' },
  { dataIndex: 'year_pay_dvc_cnt_1d/pay_dvc_cnt_1d', title: '年度会员购买占比(%)' },
].map(v => ({
  ...v,
  key: v.dataIndex,
  sorter: v.dataIndex === 'name' || v.dataIndex === 'ttid' ? false : (a, b) => a[v.dataIndex] - b[v.dataIndex],
}));
