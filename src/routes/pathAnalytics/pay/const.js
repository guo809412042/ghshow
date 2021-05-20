/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-15 17:13:45
 * @LastEditTime: 2020-06-12 15:14:35
 * @LastEditors: ssssslf
 */

export const listColumns = [
  { dataIndex: 'ds', key: 'ds', title: '日期' },
  { dataIndex: 'app_start_cnt', key: 'app_start_cnt', title: '启动' },
  { dataIndex: 'view_cnt', key: 'view_cnt', title: '曝光' },
  { dataIndex: 'click_cnt', key: 'click_cnt', title: '点击' },
  { dataIndex: 'buy_cnt', key: 'buy_cnt', title: '购买' },
  { dataIndex: 'app_start_cnt_view_cnt', key: 'app_start_cnt_view_cnt', title: '曝光-启动(%)' },
  { dataIndex: 'view_cnt_click_cnt', key: 'view_cnt_click_cnt', title: '点击-曝光(%)' },
  { dataIndex: 'click_cnt_buy_cnt', key: 'click_cnt_buy_cnt', title: '购买-点击(%)' },
  { dataIndex: 'view_cnt_buy_cnt', key: 'view_cnt_buy_cnt', title: '购买-曝光(%)' },
  { dataIndex: 'buy_year_cnt', key: 'buy_year_cnt', title: '年包购买' },
  { dataIndex: 'buy_month_cnt', key: 'buy_month_cnt', title: '月包购买' },
  { dataIndex: 'buy_week_cnt', key: 'buy_week_cnt', title: '周包购买' },
  {
    dataIndex: 'buy_other_cnt',
    key: 'buy_other_cnt',
    title: '其他购买',
    render: (text, record) => {
      const other = Number(record.buy_cnt)
        - Number(record.buy_year_cnt)
        - Number(record.buy_month_cnt)
        - Number(record.buy_week_cnt);
      return other;
    },
  },
];
