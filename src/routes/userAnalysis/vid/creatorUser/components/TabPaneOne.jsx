import React from 'react';
import { Row, DatePicker, Table } from 'antd';
import moment from 'moment';
import CardView from './CardView';
import { cardData, TabPaneOneTable } from '../contants';
import { allSQL, allSQL2, levelSQL } from '../sqlTemplate';
import { createSqlWhere, getBeforeWeek } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { DownLoadButton } from '../../../../common/DownLoadButton';

class TabPaneOne extends React.Component {
  state = {
    dateSpan: moment()
      .subtract(1, 'days'),
    currentData: {},
    beforeData: {},
    otherCurrentData: {},
    otherBeforeData: {},
    dataSource: [],
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(1, 'days'),
  }

  componentDidMount() {
    this.getData();
    this.getTableData();
  }

  getTableData=async () => {
    const { startDate, endDate } = this.state;
    const sql = createSqlWhere({ sql: levelSQL, startDate, endDate });
    const res = await getData(sql);
    const dataSource = [];
    if (res.length > 0) {
      const ids = Object.keys(res[res.length - 1]);
      res.forEach((v) => {
        const arr = {};
        ids.forEach((i) => {
          arr[i] = (i !== 'DAY' && v[i] && i.includes('/')) || i === 'reward_cost' ? (v[i]).toFixed(2) : v[i];
        });
        dataSource.push(arr);
      });
    }
    this.setState({ dataSource });
  }

  getData=async () => {
    const { dateSpan } = this.state;
    const beforeDateSpan = getBeforeWeek(dateSpan, 1);

    const currentSql = createSqlWhere({ sql: allSQL, startDate: dateSpan, endDate: dateSpan });
    const beforeSql = createSqlWhere({ sql: allSQL, startDate: beforeDateSpan, endDate: beforeDateSpan });

    const otherSql = createSqlWhere({ sql: allSQL2, startDate: dateSpan, endDate: dateSpan });
    const otherBeforeSql = createSqlWhere({ sql: allSQL2, startDate: beforeDateSpan, endDate: beforeDateSpan });

    const res = await getData(currentSql);
    const beforeRes = await getData(beforeSql);

    const otherRes = await getData(otherSql);
    const otherBeforeRes = await getData(otherBeforeSql);

    this.setState({
      currentData: res.length ? res[0] : {},
      beforeData: beforeRes.length ? beforeRes[0] : {},
      otherCurrentData: otherRes.length ? otherRes[0] : {},
      otherBeforeData: otherBeforeRes.length ? otherBeforeRes[0] : {},
    });
  }

  render() {
    const columns = TabPaneOneTable.columns.map(v => ({
      ...v,
      key: v.dataIndex,
    }));
    const {
      currentData, beforeData, otherCurrentData, otherBeforeData, dataSource,
      startDate, endDate,
    } = this.state;
    return <Row>
      <DatePicker
        style={{ margin: '20px 0' }}
        value={this.state.dateSpan}
        onChange={dateSpan => this.setState({ dateSpan }, this.getData)}
      />
      <h2>日活情况</h2>
      <Row gutter={10}>
        {cardData.map((v, index) => (v.pTitle === '日活情况' ? <CardView
          key={index}
          {...v}
          currentData={currentData}
          beforeData={beforeData}
        /> : ''))}
        <CardView
          title="次日留存率"
          num="ret_cnt/pub_creator_cnt"
          currentData={otherCurrentData}
          beforeData={otherBeforeData}
          fixed
          before
        />
        <CardView
          title="流失率"
          num="lost_cnt/total_creator_cnt"
          currentData={otherCurrentData}
          beforeData={otherBeforeData}
          fixed
          before
        />
      </Row>
      <h2>发布情况</h2>
      <Row gutter={10}>
        {cardData.map((v, index) => (v.pTitle === '发布情况' ? <CardView
          key={index}
          {...v}
          currentData={currentData}
          beforeData={beforeData}
        /> : ''))}
      </Row>
      <h2>视频消费情况</h2>
      <Row gutter={10}>
        {cardData.map((v, index) => (v.pTitle === '视频消费情况' ? <CardView
          key={index}
          {...v}
          currentData={currentData}
          beforeData={beforeData}
        /> : ''))}
      </Row>
      <h2>奖励情况</h2>
      <Row gutter={10}>
        {cardData.map((v, index) => (v.pTitle === '奖励情况' ? <CardView
          key={index}
          {...v}
          currentData={currentData}
          beforeData={beforeData}
        /> : ''))}
      </Row>
      <Row>
        <DownLoadButton filename="总览" data={dataSource} columns={columns} />
        <DatePicker.RangePicker
          style={{ marginLeft: 20 }}
          defaultValue={[startDate, endDate]}
          format={this.dateFormat}
          onChange={values => this.setState({
            startDate: values[0],
            endDate: values[1],
          }, this.getTableData)}
        />
        <Table
          columns={columns}
          dataSource={this.state.dataSource}
          scroll={{ x: 2800 }}
          rowKey="DAY"
          bordered
          style={{ marginTop: 20 }}
        />
      </Row>
    </Row>;
  }
}
export default TabPaneOne;
