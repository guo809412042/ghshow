/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-05 17:42:44
 * @LastEditTime: 2020-06-12 11:46:07
 * @LastEditors: ssssslf
 */

export const columns = [
  { dataIndex: 'ttid', title: 'ttid' },
  { dataIndex: 'name', title: '主题' },
  { dataIndex: 'app_start_dvc_cnt', title: '启动' },
  { dataIndex: 'ent_home_dvc_cnt', title: '进入首页' },
  { dataIndex: 'm_view_dvc_cnt', title: '模版曝光' },
  { dataIndex: 'click_dvc_cnt', title: '模版点击' },
  { dataIndex: 'click_dvc_cnt/m_view_dvc_cnt', title: '点击率(%)' },
  { dataIndex: 'cover_view_dvc_cnt', title: '模版预览' },
  { dataIndex: 'make_dvc_cnt', title: '模版制作' },
  { dataIndex: 'make_dvc_cnt/cover_view_dvc_cnt', title: '制作率(%)' },
  { dataIndex: 'm_edit_view_dvc_cnt', title: '编辑页模版预览' },
  { dataIndex: 'm_edit_make_dvc_cnt', title: '编辑页模版制作' },
  { dataIndex: 'm_edit_make_dvc_cnt/m_edit_view_dvc_cnt', title: '编辑页制作率(%)' },
  { dataIndex: 'make_succ_dvc_cnt', title: '模版制作成功' },
  { dataIndex: 'save_dvc_cnt', title: '保存' },
  { dataIndex: 'save_dvc_cnt/make_succ_dvc_cnt', title: '保存率(%)' },
  { dataIndex: 'share_dvc_cnt', title: '分享' },
  { dataIndex: 'share_dvc_cnt/make_succ_dvc_cnt', title: '分享率(%)' },
].map(v => ({
  ...v,
  key: v.dataIndex,
  sorter: v.dataIndex === 'ttid' || v.dataIndex === 'name' ? false : (a, b) => a[v.dataIndex] - b[v.dataIndex],
}));
