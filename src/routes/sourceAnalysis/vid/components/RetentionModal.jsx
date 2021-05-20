import React, { useState, useEffect } from 'react';
import { DatePicker, Table } from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { getData } from '../../../../utils/request';
import { createSqlWhere } from '../../../../utils/utils';
import { RetentionSQL } from '../sqlTemplate';

export default ({
  visible, name, source, searchValues,
}) => {
  const [startDate, setStartDate] = useState(searchValues.seartDate || moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(searchValues.endDate || moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: '日期',
      dataIndex: 'DAY',
      key: 'DAY',
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
  const getSQL = (sql) => {
    let where = '';

    if (!source || name === 'Organic') {
      where += `AND  media_source = '${name}'`;
    } else {
      where += `AND  media_source = '${source}' AND campaign = '${name}'`;
    }
    const fetchSql = createSqlWhere({
      sql,
      startDate,
      endDate,
      where,
    });
    return fetchSql;
  };

  const getFetchData = async () => {
    const fetchSql = getSQL(RetentionSQL);
    const res = await getData(fetchSql);
    const dataSource = [];
    const dates = [];
    res.forEach(i => !dates.includes(i.DAY) && dates.push(i.DAY));
    dates.forEach((i) => {
      const list = res.filter(j => j.DAY === i);
      const arr = {
        DAY: i,
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

  useEffect(() => {
    setStartDate(searchValues.startDate);
    setEndDate(searchValues.endDate);
  }, [searchValues]);

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
