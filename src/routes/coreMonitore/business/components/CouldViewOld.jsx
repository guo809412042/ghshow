/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Spin, Card, Row, Col, Table,
} from 'antd';
import { taskMonitorService, failMonitorService } from '../service';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';
import FailModalView from './FailModalView';
import MonitoreChart from './MonitoreChart';

export default ({ productId, product }) => {
  const [chartLoading, setChartLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const startDate = moment().subtract(7, 'days');
  const endDate = moment().subtract(1, 'days');
  const [monitorVisible, setMonitorVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [failVisivle, setFailVisible] = useState(false);
  const getTaskMonitor = async () => {
    setChartLoading(true);
    const body = {
      productId: productId * 1,
      fileType: 0,
      platform: 0,
      zone: 'all',
      state: 0,
      startTime: moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).valueOf(),
      endTime: moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).valueOf(),
    };
    const res = await taskMonitorService(body);
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
    chartLineRender(chartData, document.getElementById('chart-template'), 400);
    setChartLoading(false);
  };
  const getFailMonitor = async () => {
    setTableLoading(true);
    const body = {
      productId: productId * 1,
      fileType: 0,
      platform: 0,
      zone: 'all',
      startTime: moment(`${moment(endDate).format('YYYY-MM-DD')} 00:00:00`).valueOf() * 1,
      endTime: moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).valueOf() * 1,
      state: 2,
    };
    const res = await failMonitorService(body);
    setDataSource(res.data);
    setTableLoading(false);
  };
  useEffect(() => {
    getTaskMonitor();
    getFailMonitor();
  }, [productId]);
  return <Row gutter={24}>
    <Col span={12} onClick={() => setMonitorVisible(true)}>
      <Spin spinning={chartLoading}>
        <Card
          title={`云端模板任务 | ${moment(startDate).format('YYYY-MM-DD')} ~ ${moment(endDate).format(
            'YYYY-MM-DD',
          )}`}
        >
          <div id="chart-template" />
        </Card>
      </Spin>
    </Col>
    <Col span={12}>
      <Card title={`云端模板失败原因 | ${moment(endDate).format('YYYY-MM-DD')}`}>
        <Table
          dataSource={dataSource}
          columns={[
            { dataIndex: 'errorCode', key: 'errorCode', title: '错误码' },
            {
              dataIndex: 'count',
              key: 'count',
              title: '次数',
              width: 100,
            },
            { dataIndex: 'failReason', key: 'failReason', title: '失败原因' },
          ]}
          bordered
          rowKey="errorCode"
          pagination={{ pageSize: 5 }}
          scroll={{ y: 290 }}
          onRow={() => ({
            onClick: () => setFailVisible(true),
          })}
          loading={tableLoading}
        />
      </Card>
    </Col>
    <FailModalView visible={failVisivle} setVisible={setFailVisible} productId={productId} product={product} />
    <MonitoreChart visible={monitorVisible} setVisible={setMonitorVisible} productId={productId} />

  </Row>;
};
