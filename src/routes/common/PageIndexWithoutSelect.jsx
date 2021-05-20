import React, { useState, useEffect } from 'react';
import { DatePicker, Table } from 'antd';
import moment from 'moment';
import { DownLoadButton } from './DownLoadButton';
import { getData } from '../../utils/request';
import { createSqlWhere, getNumber } from '../../utils/utils';

export default ({
  listSQL, columns, rowKey, search, calculateData = [],
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [startDate, setStartDate] = useState(search.startDate ? search.startDate : moment().subtract(1, 'days'));
  const [endDate, setEndDate] = useState(search.endDate ? search.endDate : moment().subtract(1, 'days'));
  const getFetchData = async () => {
    const res = await getData(
      createSqlWhere({
        sql: listSQL,
        startDate,
        endDate,
      }),
    );
    if (calculateData.length) {
      const dataSource = res.map((v) => {
        const arr = v;
        for (const i of calculateData) {
          arr[i.key] = getNumber(v[i.value[0]], v[i.value[1]], i.suffix) + (i.suffix ? '%' : '');
        }
        return arr;
      });
      setDataSource(dataSource);
    } else {
      setDataSource(res);
    }
  };
  useEffect(() => {
    getFetchData();
  }, [startDate, endDate]);
  return (
    <div>
      <DownLoadButton
        columns={columns.map(v => ({
          ...v,
          key: v.dataIndex,
        }))}
        data={dataSource}
        filename="列表"
      />
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(value) => {
          setStartDate(value[0]);
          setEndDate(value[1]);
        }}
      />
      <Table dataSource={dataSource} columns={columns} rowKey={rowKey} style={{ marginTop: 20 }} />
    </div>
  );
};
