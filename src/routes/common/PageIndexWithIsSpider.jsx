/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Table } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { createSqlWhere, getNumber } from '../../utils/utils';
import { getData, getNickNameByPuid } from '../../utils/request';
import { DownLoadButton } from './DownLoadButton';

const pageSize = 20;
const { Option } = Select;
export default ({
  initOrder, columns, initSQL, getName = false, orderList, rowKey,
}) => {
  const [startDate, setStartDate] = useState(moment().subtract(31, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [order, setOrder] = useState(initOrder);
  const [type, setType] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [current, setCurrent] = useState(0);
  const [fetchJsonp, setFetchJsonp] = useState(false);
  const getNickName = async () => {
    setFetchJsonp(true);
    const data = _.clone(dataSource);
    const startNum = Number((current - 1) * pageSize);
    for (let i = Number((current - 1) * pageSize); i < startNum + pageSize; i++) {
      if (data[i]) {
        const res = await getNickNameByPuid(data[i].puiddigest);
        data[i].username = res.videoinfo.username;
      }
    }
    setDataSource(data);
    setFetchJsonp(false);
  };
  const getFetch = async () => {
    const sql = createSqlWhere({
      sql: initSQL,
      startDate,
      endDate,
      order,
      where: type ? ` and is_spider= '${type}' ` : '',
    });
    const res = await getData(sql);
    const dataSource = res.map(v => ({
      ...v,
      ptr: Number(getNumber(v.play_hot_uv, v.exposure_uv)),
    }));
    setDataSource(dataSource);
    if (getName) {
      setCurrent(1);
    }
  };
  const pageChange = (page) => {
    setCurrent(page);
  };

  useEffect(() => {
    if (getName) {
      setCurrent(0);
    }
    getFetch();
  }, [startDate, endDate, order, type]);
  useEffect(() => {
    if (dataSource.length && getName) {
      getNickName();
    }
  }, [current]);
  return (
    <div>
      <DownLoadButton
        columns={columns
          .filter(v => v.dataIndex !== 'username')
          .map(v => ({
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
      <Select style={{ width: 200, margin: '0 10px' }} defaultValue={order} onChange={value => setOrder(value)}>
        {orderList.map(v => (
          <Option key={v.key} value={v.key}>
            {v.label}
          </Option>
        ))}
      </Select>
      <Select style={{ width: 200 }} placeholder="是否爬取视频" defaultValue={type} onChange={value => setType(value)}>
        <Option value="">全部</Option>
        <Option value="Y">爬取视频</Option>
        <Option value="N">非爬取视频</Option>
      </Select>
      {getName ? (
        <Table
          dataSource={getName && fetchJsonp ? [] : dataSource}
          columns={columns}
          bordered
          rowKey="puiddigest"
          style={{ marginTop: 20 }}
          pagination={{
            current,
            pageSize,
            onChange: pageChange,
          }}
        />
      ) : (
        <Table dataSource={dataSource} columns={columns} bordered rowKey={rowKey} style={{ marginTop: 20 }} />
      )}
    </div>
  );
};
