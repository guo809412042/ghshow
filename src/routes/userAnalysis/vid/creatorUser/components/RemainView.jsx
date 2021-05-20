import React from 'react';
import moment from 'moment';
import {
  DatePicker, Row, Col,
} from 'antd';
import styles from '../index.less';
import {
  remainIncomeSQL, remainCreateUserStateSQL, remainSuperCreateUserStateSQL,
  remainOriginalStateSQL, remainGoldSQL, remainFLowSQL,
} from '../sqlTemplate';
import { createSqlWhere } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { chartBarRender, chartLineRender } from './remainChartRender';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import { TYPES_LIST } from '../contants';

class RemainView extends React.Component {
  state ={
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(0, 'days'),
  }

  async componentDidMount() {
    this.initData();
  }

  initData = async () => {
    await this.getIncomeData();
    await this.getCreateUserState();
    await this.getSuperCreateUserState();
    await this.getOriginalState();
    await this.getFlowData();
    await this.getGoldData();
  }

  getCommomData = async (SQL, name) => {
    const types = TYPES_LIST[name];
    const {
      startDate, endDate,
    } = this.state;
    const sql = createSqlWhere({ sql: SQL, startDate, endDate });
    const res = await getData(sql);
    const exportColumns = [];
    let exportDataSource = [];
    if (res.length) {
      Object.keys(res[0])
        .forEach((i) => {
          exportColumns.push({
            title: i,
            key: i,
            dataIndex: i,
          });
        });
    }
    if (name === 'coin_range') {
      res.forEach((v) => {
        exportDataSource.push({
          ...v,
          type: v.type.replace(',', '-'),
        });
      });
    } else {
      exportDataSource = res;
    }
    this.setState({
      [`exportDataSource_${name}`]: exportDataSource,
      [`exportColumns_${name}`]: exportColumns,
    });
    const data = [];
    types.forEach((i) => {
      const list = res.filter(j => j.type === i);
      list.forEach((j) => {
        data.push({
          day: moment(String(j.DAY))
            .format('YYYYMMDD'),
          type: i,
          value: j.active_user && j.ret_cnt ? parseFloat((j.ret_cnt * 100 / j.active_user).toFixed(2)) : 0,
          percent: j.active_user_cnt_d && j.total_cnt ? parseFloat((j.active_user_cnt_d * 100 / j.total_cnt).toFixed(2)) : 0,
        });
      });
    });
    chartLineRender(data, document.getElementById(`remain_line_${name}`));
    chartBarRender(data, document.getElementById(`remain_bar_${name}`));
  }

  getGoldData = async () => {
    await this.getCommomData(remainGoldSQL, 'coin_range');
  }

  getFlowData = async () => {
    await this.getCommomData(remainFLowSQL, 'upper_level');
  }

  getOriginalState = async () => {
    await this.getCommomData(remainOriginalStateSQL, 'original');
  }

  getSuperCreateUserState = async () => {
    await this.getCommomData(remainSuperCreateUserStateSQL, 'super');
  }

  getIncomeData = async () => {
    const {
      startDate, endDate,
    } = this.state;
    const sql = createSqlWhere({ sql: remainIncomeSQL, startDate, endDate });
    const res = await getData(sql);
    const exportColumns = [];
    if (res.length) {
      Object.keys(res[0])
        .forEach((i) => {
          exportColumns.push({
            title: i,
            key: i,
            dataIndex: i,
          });
        });
    }
    this.setState({
      exportDataSource_income: res,
      exportColumns_income: exportColumns,
    });
    const types = ['头部', '中部', '尾部', '未获得收益'];
    const data = [];
    types.forEach((i) => {
      const list = res.filter(j => j.type === i);
      list.forEach((j) => {
        data.push({
          day: moment(String(j.day))
            .format('YYYYMMDD'),
          type: i,
          value: j.active_user_cnt && j.ret_cnt ? parseFloat((j.ret_cnt * 100 / j.active_user_cnt).toFixed(2)) : 0,
          percent: j.active_user_cnt_d && j.total_cnt ? parseFloat((j.active_user_cnt_d * 100 / j.total_cnt).toFixed(2)) : 0,
        });
      });
    });
    chartLineRender(data, document.getElementById('remain_line_income'));
    chartBarRender(data, document.getElementById('remain_bar_income'));
  }

  getCreateUserState = async () => {
    const {
      startDate, endDate,
    } = this.state;
    const sql = createSqlWhere({ sql: remainCreateUserStateSQL, startDate, endDate });
    const res = await getData(sql);
    const exportColumns = [];
    if (res.length) {
      Object.keys(res[0])
        .forEach((i) => {
          exportColumns.push({
            title: i,
            key: i,
            dataIndex: i,
          });
        });
    }
    this.setState({
      exportDataSource_normal_creator: res,
      exportColumns_normal_creator: exportColumns,
    });
    const types = {
      creator: '创作者',
      publisher: '发布者',
      predict_creator: '潜在发布者',
    };
    const data = [];
    res.forEach((j) => {
      data.push({
        day: moment(String(j.DAY))
          .format('YYYYMMDD'),
        type: types[j.type],
        value: j.active_user && j.ret_cnt ? parseFloat((j.ret_cnt * 100 / j.active_user).toFixed(2)) : 0,
        percent: j.active_user_cnt_d && j.total_cnt ? parseFloat((j.active_user_cnt_d * 100 / j.total_cnt).toFixed(2)) : 0,
      });
    });
    chartLineRender(data, document.getElementById('remain_line_normal_creator'));
    chartBarRender(data, document.getElementById('remain_bar_normal_creator'));
  }

  render() {
    const { startDate, endDate } = this.state;
    const lineAndBarChartView = (name, type) => (<div style={{ borderBottom: '2px solid #eeee' }}>
      <h2 className={styles.remainHeaderTitle}>{name}</h2>
      <DownLoadButton
        filename={name}
        columns={this.state[`exportColumns_${type}`]}
        data={this.state[`exportDataSource_${type}`]}
      />
      <Row>
        <Col span={12}>
          <h4>留存率</h4>
          <div id={`remain_line_${type}`}/>
        </Col>
        <Col span={12}>
          <h4>活跃用户数占比</h4>
          <div id={`remain_bar_${type}`}/>
        </Col>
      </Row>
    </div>);
    return <div>
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={values => this.setState({ startDate: values[0], endDate: values[1] }, this.initData)}
      />
      {lineAndBarChartView('收入分层', 'income')}
      {lineAndBarChartView('创作者状态', 'normal_creator')}
      {lineAndBarChartView('超级创作者状态', 'super')}
      {lineAndBarChartView('原创状态', 'original')}
      {lineAndBarChartView('流量扶持状态', 'upper_level')}
      {lineAndBarChartView('金币分布状态', 'coin_range')}
    </div>;
  }
}
export default RemainView;
