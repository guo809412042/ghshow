/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-11 14:23:39
 * @LastEditTime: 2020-06-19 14:30:42
 * @LastEditors: ssssslf
 */
// molecular 分子
export const cardData = [
  {
    title: '模版展示量',
    molecular: 'show_',
    suffix: false,
  },
  {
    title: '生成中页模板制作量',
    molecular: 'click_make_',
    suffix: false,
  },
  {
    title: '视频分享量',
    molecular: 'share_',
    suffix: false,
  },
  {
    title: '视频平均删除率',
    molecular: 'del_',
    denominator: 'make_',
    suffix: true,
  },
  {
    title: '生成中页模板制作率',
    molecular: 'click_make_',
    denominator: 'show_',
    suffix: true,
  },
  {
    title: '视频平均分享率',
    molecular: 'share_',
    denominator: 'make_',
    suffix: true,
  },
];

export const columns = [
  { dataIndex: 'ttname', title: '模版名称', key: 'ttname' },
  { dataIndex: 'ttid', title: 'ttid', key: 'ttid' },
  {
    dataIndex: 'show_', title: '模版展示量', key: 'show_', sorter: (a, b) => a.show_ - b.show_,
  },
  {
    dataIndex: 'click_make_', title: '模版页制作量', key: 'click_make_', sorter: (a, b) => a.click_make_ - b.click_make_,
  },
  {
    dataIndex: 'click_make_show_', title: '模版页制作率(%)', key: 'click_make_show_', sorter: (a, b) => a.click_make_show_ - b.click_make_show_,
  },
  {
    dataIndex: 'make_', title: '总制作量', key: 'make_', sorter: (a, b) => a.make_ - b.make_,
  },
  {
    dataIndex: 'make_show_', title: '总制作率', key: 'make_show_', sorter: (a, b) => a.make_show_ - b.make_show_,
  },
  {
    dataIndex: 'share_', title: '视频分享量', key: 'share_', sorter: (a, b) => a.share_ - b.share_,
  },
  {
    dataIndex: 'share_make_', title: '视频分享率(%)', key: 'share_make_', sorter: (a, b) => a.share_make_ - b.share_make_,
  },
  {
    dataIndex: 'make_fail_', title: '模板制作失败量', key: 'make_fail_', sorter: (a, b) => a.make_fail_ - b.make_fail_,
  },
  {
    dataIndex: 'make_fail_make_', title: '模板制作失败率(%)', key: 'make_fail_make_', sorter: (a, b) => a.make_fail_make_ - b.make_fail_make_,
  },
  {
    dataIndex: 'del_', title: '视频删除量', key: 'del_', sorter: (a, b) => a.del_ - b.del_,
  },
  {
    dataIndex: 'del_make_', title: '视频删除率(%)', key: 'del_make_', sorter: (a, b) => a.del_make_ - b.del_make_,
  },
];
