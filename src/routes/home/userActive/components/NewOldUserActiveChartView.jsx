/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  // Col,
  Row, Radio, DatePicker,
} from 'antd';
import moment from 'moment';
import CardBox from '../../common/CardBox';
// import styles from '../../../../styles/index.less';
// import { cardChartBarRender } from '../../../common/chartFunc/cardChartBarRender';
// import { chartRender2 } from '../../../common/chartFunc/chartRender2';
import { chartRender } from '../../../common/chartFunc/chartRender';
import { createSql } from '../../../../utils/utils';
import { allActvieUserPlatformSQL, allActvieUserSQL } from '../../common/sqlTemplate';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';

const { RangePicker } = DatePicker;

class NewwOldUserActiveChartView extends Component {
  state ={
    platform: null,
    startDate: moment().subtract(180, 'days'),
    endDate: moment().subtract(1, 'days'),
    product: this.props.product,
    dataSource: [],
  }

  componentDidMount() {
    this.getList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product !== this.state.product) {
      this.setState({
        product: nextProps.product,
      }, this.getList);
    }
  }

  getList = async () => {
    const {
      startDate, endDate, platform, product,
    } = this.state;
    const newUserData = [];
    const oldUserData = [];
    let sql = '';
    if (!platform) {
      sql = createSql(allActvieUserPlatformSQL, startDate, endDate, product);
    } else {
      sql = createSql(allActvieUserSQL, startDate, endDate, product, platform);
    }
    const res = await getData(sql);
    res.forEach((v) => {
      newUserData.push({
        type: '新用户',
        day: moment(v.bizdate).format('YYYY-MM-DD'),
        value: v.dau_new_1d,
      });
      oldUserData.push({
        type: '老用户',
        day: moment(v.bizdate).format('YYYY-MM-DD'),
        value: v.dau_old_1d,
      });
    });
    this.setState({
      dataSource: newUserData.concat(oldUserData),
    });
    chartRender(newUserData, 'new_user_chart', '#40a9ff', 'l(100) 0:#40a9ff 1:#fff');
    chartRender(oldUserData, 'old_user_chart', '#14abef', 'l(100) 0:#14abef 1:#fff');
  }

  render() {
    const { platform, startDate, endDate } = this.state;
    return <div>
      <div style={{ marginBottom: 20 }}>
        <DownLoadButton
          filename="新老用户活跃趋势"
          data ={this.state.dataSource}
          columns={[
            { title: 'day', key: 'day' },
            { title: 'value', key: 'value' },
            { title: 'type', key: 'type' },
          ]}
        />
        <Radio.Group
          value={platform}
          onChange={e => this.setState({
            platform: e.target.value,
          }, () => {
            this.getList();
          })}
          style={{ marginRight: 20 }}
        >
          <Radio.Button key={null} value={null}>全部</Radio.Button>
          <Radio.Button key={1} value={1}>Android</Radio.Button>
          <Radio.Button key={2} value={2}>iOS</Radio.Button>
        </Radio.Group>
        <RangePicker
          value={[startDate, endDate]}
          onChange={value => this.setState({
            startDate: value[0], endDate: value[1],
          }, () => {
            this.getList();
          })}
        />
      </div>
      <Row >
        <CardBox title="新用户活跃趋势">
          <div id="new_user_chart" />
        </CardBox>
      </Row>
      <Row>
        <CardBox title="老用户活跃趋势">
          <div id="old_user_chart" />
        </CardBox>
      </Row>
    </div>;
  }
}
export default NewwOldUserActiveChartView;
