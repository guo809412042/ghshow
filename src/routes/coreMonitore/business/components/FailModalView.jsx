/*
 * @Date: 2020-06-09 09:36:18
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-12-17 15:51:41
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Modal, Table } from 'antd';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { failMonitorService } from '../service';


export default ({ visible, setVisible, productId }) => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    { dataIndex: 'errorCode', key: 'errorCode', title: '错误码' },
    {
      dataIndex: 'count',
      key: 'count',
      title: '次数',
      width: 100,
    },
    { dataIndex: 'failReason', key: 'failReason', title: '失败原因' },
  ];
  const getData = async () => {
    const body = {
      productId: productId * 1,
      fileType: 0,
      platform: 0,
      zone: 'all',
      startTime: moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).valueOf() * 1,
      endTime: moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).valueOf() * 1,
      state: 2,
    };
    const res = await failMonitorService(body);
    const data = res.data.sort((a, b) => b.count - a.count);
    setDataSource(data);
  };
  useEffect(() => {
    if (visible) {
      getData();
    }
  }, [visible, startDate, endDate]);
  return <Modal
    visible={visible}
    onOk={() => setVisible(false)}
    onCancel={() => setVisible(false)}
    title="云端模板失败原因"
    width={800}
  >
    <DatePicker.RangePicker
      value={[startDate, endDate]}
      onChange={(values) => {
        setStartDate(values[0]);
        setEndDate(values[1]);
      }}
      style={{ marginRight: 10 }}
    />
    <DownLoadButton
      filename="云端模板失败原因"
      data = {dataSource}
      columns={columns}
    />
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="errorCode"
      bordered
      style={{ marginTop: 10 }}
    />
  </Modal>;
};
