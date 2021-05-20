/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Modal, DatePicker, Radio, Table,
} from 'antd';
import { taskMonitorService } from '../service';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';


export default ({ visible, setVisible, productId }) => {
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [platform, setPlatform] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const getList = async () => {
    const body = {
      productId: productId * 1,
      fileType: 0,
      platform,
      zone: 'all',
      state: 0,
      startTime: moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).valueOf(),
      endTime: moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).valueOf(),
    };
    const res = await taskMonitorService(body);
    const data = res.data.map(v => ({
      ...v,
      platform: platform ? platform === 1 ? 'Android' : 'ioS' : '全部',
    }));
    const chartData = [];
    for (const i of res.data) {
      chartData.push({
        type: '总数',
        value: i.makeTotal,
        day: i.makeDate,
      });
      chartData.push({
        type: '失败数',
        value: i.failTotal,
        day: i.makeDate,
      });
      chartData.push({
        type: '成功数',
        value: i.successTotal,
        day: i.makeDate,
      });
    }
    chartLineRender(chartData, document.getElementById('detail-chart'));
    setDataSource(data);
  };
  useEffect(() => {
    if (visible) {
      getList();
    }
  }, [startDate, endDate, platform, visible]);
  return <Modal
    title="云端模板任务监控"
    width={800}
    visible={visible}
    onCancel={() => setVisible(false)}
    onOk={() => setVisible(false)}
  >
    <DatePicker.RangePicker
      value={[startDate, endDate]}
      onChange={(values) => {
        setStartDate(values[0]);
        setEndDate(values[1]);
      }}
    />
    <Radio.Group value={platform} onChange={e => setPlatform(e.target.value)}>
      <Radio.Button value={0} key={0}>全部</Radio.Button>
      <Radio.Button value={1} key={1}>Android</Radio.Button>
      <Radio.Button value={2} key={2}>iOS</Radio.Button>
    </Radio.Group>
    <div id="detail-chart" />
    <Table
      dataSource={dataSource}
      columns={[
        { dataIndex: 'makeDate', key: 'makeDate', title: '日期' },
        { dataIndex: 'platform', key: 'platform', title: '平台' },
        { dataIndex: 'makeTotal', key: 'makeTotal', title: '总任务数' },
        { dataIndex: 'successTotal', key: 'successTotal', title: '成功任务数' },
        { dataIndex: 'failTotal', key: 'failTotal', title: '失败任务数' },
      ]}
      bordered
      style={{ marginTop: 20 }}
      rowKey="makeDate"
    />
  </Modal>;
};
