import React, { Component } from 'react';
import {
  Col,
  // Table,
  //  Tag, Statistic, Progress,
  Radio,
  DatePicker,
} from 'antd';
import moment from 'moment';
import CardBox from '../../common/CardBox';
import styles from '../../../../styles/index.less';
// import { chartRender2 } from '../../../common/chartFunc/chartRender2';
import { cardChartBarRender2 } from '../../../common/chartFunc/cardChartBarRender2';
import { allActvieUserPlatformSQL, allActvieUserSQL } from '../../common/sqlTemplate';
import { getData } from '../../../../utils/request';
import { createSql } from '../../../../utils/utils';

const { RangePicker } = DatePicker;

// 活跃用户Top5排行榜颜色;
// const TagColors = ['magenta', 'red', 'volcano', 'orange', 'gold'];
// const ProcessColors = [
//   {
//     from: '#ee0979', to: '#f54ea2',
//   },
//   {
//     from: '#f54ea2', to: '#ff7676',
//   },
//   {
//     from: '#ff7676',
//     to: '#ff8359',
//   },
//   {
//     from: '#ff8359',
//     to: '#ffdf40',
//   },
//   {
//     from: '#ffdf40',
//     to: '#f7b733',
//   },
// ];
// const columns = [
//   {
//     dataIndex: 'country',
//     title: '地区',
//     render: (text, row, index) => (
//       <div>
//         <Tag color={TagColors[index]}>{index + 1}</Tag>
//         {text}
//       </div>
//     ),
//   },
//   {
//     dataIndex: 'value',
//     title: '用户活跃',
//     render: text => <Statistic value={text} valueStyle={{ fontSize: 14 }} />,
//   },
//   {
//     dataIndex: 'precision',
//     title: '百分比',
//     render: (text, row, index) => <Progress strokeColor={ProcessColors[index]}
//       size="small" percent={Number(text)} />,
//   },
// ];

class DailyNewOldActiveChartView extends Component {
  state = {
    platform: null,
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(1, 'days'),
    product: this.props.product,
  };

  componentDidMount() {
    // 每日新老用户活跃占比
    // chartRender2(userNewOldPrecision, 'user_old_day_line_chart', ['#40a9ff', '#0050b3'],
    //   true, ['#40a9ff', '#0050b3']);
    // 每日新老用户活跃占比

    this.getList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product !== this.state.product) {
      this.setState(
        {
          product: nextProps.product,
        },
        this.getList,
      );
    }
  }

  getList = async () => {
    const {
      startDate, endDate, platform, product,
    } = this.state;
    const chartData = [];
    let sql = '';
    if (!platform) {
      sql = createSql(allActvieUserPlatformSQL, startDate, endDate, product);
    } else {
      sql = createSql(allActvieUserSQL, startDate, endDate, product, platform);
    }
    const res = await getData(sql);
    res.forEach((v) => {
      chartData.push({
        type: '新用户',
        day: moment(v.bizdate).format('YYYY-MM-DD'),
        value: v.dau_new_1d,
      });
      chartData.push({
        type: '老用户',
        day: moment(v.bizdate).format('YYYY-MM-DD'),
        value: v.dau_old_1d,
      });
    });
    cardChartBarRender2(chartData, 'user_old_day_bar_chart', ['#40a9ff', '#0050b3']);
  };

  render() {
    const { platform, startDate, endDate } = this.state;
    return (
      <CardBox
        title="每日新老用户活跃占比"
        extra={
          <div style={{ display: 'inline-block', float: 'right' }}>
            <Radio.Group
              value={platform}
              onChange={e => this.setState(
                {
                  platform: e.target.value,
                },
                () => {
                  this.getList();
                },
              )
              }
              style={{ marginRight: 20 }}
            >
              <Radio.Button key={null} value={null}>
                全部
              </Radio.Button>
              <Radio.Button key={1} value={1}>
                Android
              </Radio.Button>
              <Radio.Button key={2} value={2}>
                iOS
              </Radio.Button>
            </Radio.Group>
            <RangePicker
              value={[startDate, endDate]}
              onChange={value => this.setState(
                {
                  startDate: value[0],
                  endDate: value[1],
                },
                () => {
                  this.getList();
                },
              )
              }
            />
          </div>
        }
      >
        <Col span={24} className={styles.homeCardLeft}>
          <div id="user_old_day_bar_chart" />
        </Col>
        {/* <Col span={8} style={{ padding: 20 }} >
        <h3>每日新老用户活跃</h3>
        <Table
          dataSource={[
            { value: 21894, country: '中国', precision: '70' },
            { value: 20193, country: '印度', precision: '50' },
            { value: 12793, country: '中东', precision: '48' },
            { value: 11874, country: '马来西亚', precision: '40' },
            { value: 3484, country: '独联体', precision: '30' },
          ]}
          columns={columns}
          pagination={false}

        />
      </Col> */}
      </CardBox>
    );
  }
}

export default DailyNewOldActiveChartView;
