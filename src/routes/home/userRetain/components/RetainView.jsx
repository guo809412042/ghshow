import React, { Component } from 'react';
import {
  Row, DatePicker, Radio,
} from 'antd';
import moment from 'moment';
import CardBox from '../../common/CardBox';
import { chartRender } from '../../../common/chartFunc/chartRender';
import {
  retainUserActiveSQL,
} from '../../common/sqlTemplate';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';

const { RangePicker } = DatePicker;

class RetainView extends Component {
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

  getList=async () => {
    const {
      platform, product, startDate, endDate,
    } = this.state;
    const sql = createSqlWhere({
      sql: retainUserActiveSQL,
      startDate,
      endDate,
      type: product,
      product: platform ? ` and platform = ${platform}` : '',
    });
    const res = await getData(sql);

    const userRetainData = res.map(v => ({
      type: '用户活跃次留',
      day: moment(v.bizdate).format('YYYY-MM-DD'),
      value: getNumber(v.pv_cnt_ystd_dretn_1d, v.pv_cnt_ystd_1d),
    }));
    const newRetainData = res.map(v => ({
      type: '新用户活跃留存趋势',
      day: moment(v.bizdate).format('YYYY-MM-DD'),
      value: getNumber(v.pv_cnt_new_ystd_dretn_1d, v.pv_cnt_new_ystd_1d),
    }));
    const oldRetainData = res.map(v => ({
      type: '老用户活跃留存趋势',
      day: moment(v.bizdate).format('YYYY-MM-DD'),
      value: getNumber(v.pv_cnt_old_ystd_dretn_1d, v.pv_cnt_old_ystd_1d),
    }));
    this.setState({
      dataSource: [...userRetainData, ...newRetainData, ...oldRetainData],
    });
    chartRender(userRetainData, 'user_active_retain_chart', '#0250c5', 'l(100) 0:#0250c5 1:#fff');
    chartRender(newRetainData, 'user_new_retain_chart', '#0c3483', 'l(100) 0:#0c3483 1:#fff');
    chartRender(oldRetainData, 'user_old_retain_chart', '#0c3483', 'l(100) 0:#0c3483 1:#fff');
  }

  render() {
    const { platform, startDate, endDate } = this.state;
    return <div>
      <div style={{ marginBottom: 20 }}>
        <DownLoadButton
          filename="用户留存"
          data={this.state.dataSource}
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
        <CardBox title="用户活跃次留趋势">
          <div id="user_active_retain_chart" />
        </CardBox>

      </Row>
      <Row >
        <CardBox title=" 新用户活跃留存趋势">
          <div id="user_new_retain_chart" />
        </CardBox>
      </Row>
      <Row >
        <CardBox title=" 老用户活跃留存趋势">
          <div id="user_old_retain_chart" />
        </CardBox>
      </Row>
    </div>;
  }
}

export default RetainView;
