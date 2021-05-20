/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-05 17:42:44
 * @LastEditTime: 2020-06-10 14:12:52
 * @LastEditors: ssssslf
 */

export const columns = [
  { dataIndex: 'ds', title: '日期' },
  { dataIndex: 'app_start_dvc_cnt', title: '启动数' },
  { dataIndex: 'ent_sub_dvc_cnt', title: '进入订阅页' },
  { dataIndex: 'ent_sub_dvc_cnt/app_start_dvc_cnt', title: '曝光率(%)' },
  { dataIndex: 'click_dvc_cnt', title: '点击数' },
  { dataIndex: 'click_dvc_cnt/ent_sub_dvc_cnt', title: '购买点击转化(%)' },
  { dataIndex: 'buy_dvc_cnt', title: '购买成功' },
  { dataIndex: 'buy_dvc_cnt/click_dvc_cnt', title: '购买转化(%)' },
  { dataIndex: 'buy_dvc_cnt/ent_sub_dvc_cnt', title: '曝光-购买转化(%)' },
  { dataIndex: 'buy_dvc_cnt/app_start_dvc_cnt', title: '购买-激活转化(%)' },
].map(v => ({
  ...v,
  key: v.dataIndex,
  sorter: (a, b) => a[v.dataIndex] - b[v.dataIndex],
}));
