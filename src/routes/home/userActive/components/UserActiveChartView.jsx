import React, { Component } from 'react';
import {
  Col,
  // Select, Table,
  // Tag, Statistic, Progress,
  Radio,
  DatePicker,
} from 'antd';
import moment from 'moment';
import CardBox from '../../common/CardBox';
import styles from '../../../../styles/index.less';
import { chartRender } from '../../../common/chartFunc/chartRender';
// import { chartRender2 } from '../../../common/chartFunc/chartRender2';
// import { cardChartBarRender } from '../../../common/chartFunc/cardChartBarRender';
import { allActvieUserSQL, allActvieUserPlatformSQL } from '../../common/sqlTemplate';
import { getData } from '../../../../utils/request';
import { createSql } from '../../../../utils/utils';
import { DownLoadButton } from '../../../common/DownLoadButton';
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
const { RangePicker } = DatePicker;
// const userActiveTop5 = [
//   { value: 21894, country: '中国', precision: '70' },
//   { value: 20193, country: '印度', precision: '50' },
//   { value: 12793, country: '中东', precision: '48' },
//   { value: 11874, country: '马来西亚', precision: '40' },
//   { value: 3484, country: '独联体', precision: '30' },
// ];

const getPrecision = (a, b) => (a && b ? parseFloat(((a * 100) / b).toFixed(2)) : 0);
class UserActiveChartView extends Component {
  state = {
    platform: null,
    startDate: moment().subtract(180, 'days'),
    endDate: moment().subtract(1, 'days'),
    product: this.props.product,
    dataSource: [],
  };

  componentDidMount() {
    this.getActiveData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product !== this.state.product) {
      this.setState(
        {
          product: nextProps.product,
        },
        this.getActiveData,
      );
    }
  }

  getActiveData = async () => {
    const {
      startDate, endDate, platform, product,
    } = this.state;
    const chartData = [];
    const dauWauMduData = [];
    const dauwaumauPrecisionData = [];
    let sql = '';
    if (!platform) {
      sql = createSql(allActvieUserPlatformSQL, startDate, endDate, product);
    } else if (Number(platform) === 1) {
      sql = createSql(allActvieUserSQL, startDate, endDate, product, 1);
    } else {
      sql = createSql(allActvieUserSQL, startDate, endDate, product, 2);
    }
    const res = await getData(sql);
    res.forEach((v) => {
      chartData.push({
        type: '活跃用户',
        day: moment(v.bizdate).format('YYYY-MM-DD'),
        value: v.dau,
      });
      dauWauMduData.push({
        type: 'mau',
        value: v.mau,
        day: moment(v.bizdate).format('YYYY-MM-DD'),
      });
      dauWauMduData.push({
        type: 'wau',
        value: v.wau,
        day: moment(v.bizdate).format('YYYY-MM-DD'),
      });
      dauWauMduData.push({
        type: 'dau',
        value: v.dau,
        day: moment(v.bizdate).format('YYYY-MM-DD'),
      });
      dauwaumauPrecisionData.push({
        type: 'dau/mau',
        value: getPrecision(v.dau, v.mau),
        day: v.bizdate,
      });
    });
    this.setState({
      dataSource: chartData,
    });
    chartRender(chartData, 'user_active_chart', '#008b8b', 'l(100) 0:#008b8b 1:#fff');
    // chartRender2(dauWauMduData, 'dau_wau_mau_chart', ['#f5365c', '#02ba5a', '#14abef'], true, ['#f5365c', '#02ba5a', '#14abef']);
    // cardChartBarRender(dauwaumauPrecisionData, 'dau_wau_mau_precision_chart',
    //   ['l(100) 0:#f9d423 1:#f83600']);
  };

  render() {
    const { startDate, endDate, platform } = this.state;
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
    return (
      <div>
        <CardBox
          title="用户活跃趋势"
          extra={
            <div style={{ display: 'inline-block', float: 'right' }}>
              <DownLoadButton
                filename="用户活跃趋势"
                data={this.state.dataSource}
                columns={[
                  { title: 'day', key: 'day' },
                  { title: 'value', key: 'value' },
                  { title: 'type', key: 'type' },
                ]}
              />
              <Radio.Group
                value={platform}
                onChange={e => this.setState(
                  {
                    platform: e.target.value,
                  },
                  () => {
                    this.getActiveData();
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
                    this.getActiveData();
                  },
                )
                }
              />
            </div>
          }
        >
          <Col span={24} style={{ padding: 20 }} className={styles.homeCardLeft}>
            <div id="user_active_chart" />
          </Col>
          {/* <Col span={8} >
          <div style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>活跃用户Top5排行榜</span>
            <Select style={{ width: 100, float: 'right' }} value="china">
              <Select.Option key="china" value="china">
            中国
              </Select.Option>
            </Select>
            <Table
              columns={columns}
              dataSource={userActiveTop5}
              // bordered={false}
              rowKey="country"
              pagination={false}
              style={{ marginTop: 20 }}
            />
          </div>
        </Col>
         */}
          <Col
            span={12}
            style={{
              height: 30,
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              width: '100%',
            }}
          />
          {/* <Col span={24} className={styles.homeCardLeft} style={{ padding: 20 }} >
          <p style={{ fontWeight: 600, color: '#000000' }}>DAU/WAU/MAU趋势图</p>
          <div id="dau_wau_mau_chart" />
        </Col> */}
          {/* <Col span={8}>
          <p style={{ fontWeight: 600, color: '#000000', marginLeft: 20 }}>DAU/MAU</p>
          <div id="dau_wau_mau_precision_chart"/>
        </Col> */}
        </CardBox>
      </div>
    );
  }
}

export default UserActiveChartView;
