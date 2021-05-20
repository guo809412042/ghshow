import React from 'react';
import {
  DatePicker, Select, Row, Col, Table,
} from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import { createSqlWhere } from '../../../../../utils/utils';
import { publishSQL } from '../sqlTemplate';
import { getData } from '../../../../../utils/request';
import { TYPES_LIST } from '../contants';
import { chartLineRender, chartBarRender2 } from './remainChartRender';

class PublishView extends React.Component {
  state ={
    startDate: moment()
      .subtract(8, 'days'),
    endDate: moment()
      .subtract(1, 'days'),
    type: 'income',
    exportColumns: [],
    exportDataSource: [],
    dataSource: [],
    columns: [],
  }

  async componentDidMount() {
    this.initData();
  }

  initData = async () => {
    const {
      startDate, endDate, type,
    } = this.state;
    const sql = createSqlWhere({
      sql: publishSQL, startDate, endDate, type,
    });
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
      exportDataSource: res,
      exportColumns,
    });
    const types = TYPES_LIST[type] || [];
    const dates = [];
    res.forEach((i) => {
      if (!TYPES_LIST[type]) {
        !types.includes(i.type) && types.push(i.type);
      }
      !dates.includes(i.DAY) && dates.push(i.DAY);
    });
    const data = [];
    res.forEach((i) => {
      data.push({
        day: moment(String(i.DAY))
          .format('YYYYMMDD'),
        type: i.type,
        value: i.pub_v_cnt && i.active_user_cnt_d ? parseFloat((i.pub_v_cnt / i.active_user_cnt_d).toFixed(2)) : 0,
        barValue: i.pub_w_v_cnt && i.pub_v_cnt ? parseFloat((i.pub_w_v_cnt * 100 / i.pub_v_cnt).toFixed(2)) : 0,
      });
    });
    chartLineRender(data, document.getElementById('publish_line_chart'));
    chartBarRender2(data, document.getElementById('publish_bar_chart'));
    this.getTableData(types, res, dates);
  }

  getTableData = async (types, res, dates) => {
    const dataSource = [];
    const columns = [{
      dataIndex: 'day',
      title: '日期',
      key: 'day',
    }];
    types.forEach((i) => {
      const arr = {
        dataIndex: i,
        title: i,
        key: i,
        children: [],
      };
      arr.children.push({
        dataIndex: `active_user_cnt_d_${i}`,
        title: '活跃用户数',
        key: `active_user_cnt_d_${i}`,
      });
      arr.children.push({
        dataIndex: `pub_v_cnt_${i}`,
        title: '发布量',
        key: `pub_v_cnt_${i}`,
      });
      arr.children.push({
        dataIndex: `pub_w_v_cnt_${i}`,
        title: '水印视频量',
        key: `pub_w_v_cnt_${i}`,
      });
      arr.children.push({
        dataIndex: `watermark_pct_${i}`,
        title: '水印视频占比',
        key: `watermark_pct_${i}`,
      });
      arr.children.push({
        dataIndex: `pub_v_cnt/active_user_cnt_d_${i}`,
        title: '人均发布量',
        key: `pub_v_cnt/active_user_cnt_d_${i}`,
      });
      columns.push(arr);
    });
    dates.forEach((i) => {
      const list = res.filter(j => j.DAY === i);
      const arr = {
        day: i,
      };
      list.forEach((j) => {
        arr[`active_user_cnt_d_${j.type}`] = j.active_user_cnt_d;
        arr[`pub_v_cnt_${j.type}`] = j.pub_v_cnt;
        arr[`pub_w_v_cnt_${j.type}`] = j.pub_w_v_cnt;
        arr[`watermark_pct_${j.type}`] = `${(j.pub_w_v_cnt * 100 / j.pub_v_cnt).toFixed(2)}%`;
        arr[`pub_v_cnt/active_user_cnt_d_${j.type}`] = (j.pub_v_cnt / j.active_user_cnt_d).toFixed(2);
      });
      dataSource.push(arr);
    });
    this.setState({
      columns,
      dataSource,
    });
  }

  render() {
    const {
      startDate, endDate, type, exportColumns, exportDataSource, dataSource, columns,
    } = this.state;
    return <div>
      <DatePicker.RangePicker
        value = {[startDate, endDate]}
        onChange={values => this.setState({
          startDate: values[0],
          endDate: values[1],
        })}
      />
      <Select
        style={{
          width: 200,
          marginLeft: 20,
          marginRight: 20,
        }}
        placeholder="用户分层"
        value={type}
        onChange={value => this.setState({
          type: value,
        }, this.initData)}
      >
        <Select.Option key="income" value="income">收入分层</Select.Option>
        <Select.Option key="normal_creator" value="normal_creator">创作者状态</Select.Option>
        <Select.Option key="super" value="super">超级创作者状态</Select.Option>
        <Select.Option key="original" value="original">原创状态</Select.Option>
        <Select.Option key="upper_level" value="upper_level">流量扶持状态</Select.Option>
        <Select.Option key="coin_range" value="coin_range">金币分层</Select.Option>
        <Select.Option key="rewarded_withdraw" value="rewarded_withdraw">提现及奖励用户</Select.Option>
        <Select.Option key="reg" value="reg">成为创作者时间</Select.Option>
      </Select>
      <DownLoadButton
        filename="发布情况"
        columns={exportColumns}
        data={exportDataSource}
      />
      <Row style={{ marginTop: 20 }}>
        <Col span={12}>
          <h3>人均发布量</h3>
          <div id="publish_line_chart"/>
        </Col>
        <Col span={12}>
          <h3>水印视频占比</h3>
          <div id="publish_bar_chart"/>
        </Col>
      </Row>
      <h3>明细数据</h3>
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 2400 }}
        bordered
      />
    </div>;
  }
}
export default PublishView;
