/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-05-17 15:57:11
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState, useEffect } from 'react';
import { DatePicker, Table } from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../../common/DownLoadButton';
import { getData } from '../../../utils/request';

export default ({
  searchValues, visible, sql, name,
}) => {
  const [startDate, setStartDate] = useState(searchValues.seartDate || moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(searchValues.endDate || moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
    },
    {
      title: '新增用户',
      dataIndex: 'reg_num',
      key: 'reg_num',
    },
  ];
  for (let i = 1; i < 8; i++) {
    columns.push({
      title: `${i}天后`,
      dataIndex: `stay_seq ${i}`,
      key: `stay_seq ${i}`,
    });
  }
  const getFetchData = async () => {
    const fetchSql = sql
      .replace(/#startDateRemain#/g, moment(startDate).format('YYYYMMDD'))
      .replace(/#endDateRemain#/g, moment(endDate).format('YYYYMMDD'));
    const res = await getData(fetchSql);
    const dataSource = [];
    const dates = [];
    res.forEach(i => !dates.includes(i.ds) && dates.push(i.ds));
    dates.forEach((i) => {
      const list = res.filter(j => j.ds === i);
      const arr = {
        ds: i,
      };
      list.forEach((j) => {
        arr[`stay_seq ${j.stay_seq}`] = j.reg_num ? `${((j.stay_num * 100) / j.reg_num).toFixed(2)}%` : '0.00%';
        arr.reg_num = j.reg_num;
      });
      dataSource.push(arr);
    });
    setDataSource(dataSource);
  };
  useEffect(() => {
    if (visible) {
      getFetchData();
    }
  }, [startDate, endDate, visible]);
  columns.push({
    title: '14天后',
    dataIndex: 'stay_seq 14',
    key: 'stay_seq 14',
  });
  columns.push({
    title: '28天后',
    dataIndex: 'stay_seq 28',
    key: 'stay_seq 28',
  });
  useEffect(() => {
    setStartDate(searchValues.startDate);
    setEndDate(searchValues.endDate);
  }, [searchValues]);
  return (
    <div>
      <DownLoadButton filename={name} data={dataSource} columns={columns} />
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(values) => {
          setStartDate(values[0]);
          setEndDate(values[1]);
        }}
        style={{ float: 'right' }}
      />
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};
