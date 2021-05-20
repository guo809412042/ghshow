import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Table } from 'antd';
import { columns, communityColumns } from '../constant';
import { getData } from '../../../../../utils/request';
import { createSqlWhere } from '../../../../../utils/utils';
import { summarySQL, communitySQL } from '../sqlTemplate';

const AllView = () => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const [communityDataSource, setCommunityDataSource] = useState([]);
  const getFetch = async () => {
    const sql = createSqlWhere({
      sql: summarySQL,
      startDate,
      endDate,
    });
    const res = await getData(sql);
    const dataSource = [];
    dataSource.push({
      Columns1: '一级标签',
      total: res[0].parent_all_cnt,
      is_spider_cnt: res[0].parent_is_spider_cnt,
      not_spider_cnt: res[0].parent_not_spider_cnt,
    });
    dataSource.push({
      Columns1: '二级标签',
      total: res[0].child_all_cnt,
      is_spider_cnt: res[0].child_is_spider_cnt,
      not_spider_cnt: res[0].child_not_spider_cnt,
    });
    dataSource.push({
      Columns1: '三级标签',
      total: res[0].tag_all_cnt,
    });
    setDataSource(dataSource);
  };
  const fetchCommunity = async () => {
    const sql = createSqlWhere({
      sql: communitySQL, startDate, endDate,
    });
    const res = await getData(sql);
    setCommunityDataSource(res);
  };
  useEffect(() => {
    getFetch();
    fetchCommunity();
  }, [startDate, endDate]);
  return <div>
    <DatePicker.RangePicker
      value={[startDate, endDate]}
      onChange={(values) => {
        setStartDate(values[0]);
        setEndDate(values[1]);
      }}
    />

    <Table
      style={{ marginTop: 20 }}
      dataSource={dataSource}
      columns={columns}
      pagination={false}
    />
    <h3 style={{ marginTop: 20 }}>社区数据</h3>
    <Table
      dataSource={communityDataSource}
      columns={communityColumns}
    />
  </div>;
};
export default AllView;
