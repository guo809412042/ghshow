/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Table } from 'antd';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { getData } from '../../../../utils/request';
import { createSqlWhere, getFixed } from '../../../../utils/utils';
import { listSQL, mastSql } from './sqlTemplate';

export default ({ product }) => {
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const getColumns = () => {
    const data = [
      {
        dataIndex: 'day', key: 'day', title: 'Day', width: 100,
      },
    ];
    for (let i = 1; i <= 30; i++) {
      data.push({
        dataIndex: i,
        key: i,
        title: i,
      });
    }
    setColumns(data);
  };
  const getFetchData = async () => {
    setLoading(true);
    const res = await getData(createSqlWhere({
      sql: product === 'vid' ? listSQL : mastSql,
      startDate,
      endDate,
    }));
    const data = [];
    const days = [];
    for (const i of res) {
      if (!days.includes(i.day)) {
        days.push(i.day);
      }
    }
    for (const i of days) {
      const list = res.filter(v => v.day === i);
      const arr = {
        day: i,
      };
      for (const j of list) {
        arr[j.stay_seq] = getFixed(j.stay_ratio);
      }
      data.push(arr);
    }
    setDataSource(data);
    setLoading(false);
  };
  useEffect(() => {
    getColumns();
  }, []);
  useEffect(() => {
    getFetchData();
  }, [startDate, endDate, product]);
  return <div>
    <DatePicker.RangePicker
      style={{ marginRight: '12px' }}
      value={[startDate, endDate]}
      onChange={(values) => {
        setEndDate(values[1]);
        setStartDate(values[0]);
      }}
    />
    <DownLoadButton
      filename="30天留存"
      data={dataSource}
      columns={columns}
    />
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      rowKey="day"
      style={{ marginTop: 20 }}
      scroll={{ x: 2300 }}
      loading={loading}
      pagination={false}
    />
  </div>;
};
