import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Form, DatePicker, Select } from 'antd';
import { getSql, getNameListSql } from './sql';
import XTable from '../common/XTable';
import XFilter from '../common/XFilter';
import { columns } from './column';
import { productId, typeList } from '../const';
import { getData } from '../../../../utils/request';

const { Item } = Form;
const { RangePicker } = DatePicker;

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [nameOptionsList, setNameOptionsList] = useState([]);
  const [filterParams, setFilterParams] = useState({
    date: [moment().subtract(1, 'd'), moment().subtract(1, 'd')],
    productId,
    type: [1],
  });

  const getNameList = async () => {
    const sql = getNameListSql(filterParams);
    const resp = await getData(sql);

    setNameOptionsList(resp);
  };

  const getTableData = async () => {
    const sql = getSql(filterParams);
    const resp = await getData(sql);

    setDataSource(resp);
  };

  const handleSearch = (params) => {
    setFilterParams({
      ...filterParams,
      ...params,
    })
  };

  useEffect(() => {
    getTableData();
    getNameList();
  }, [filterParams]);

  return (
    <div style={{ marginBottom: 30 }}>
      <XFilter onSearch={handleSearch} title="分类占比">
        {
          ({ getFieldDecorator }) => (
            <>
              <Item label="分类" initialValues={filterParams.type}>
                {
                  getFieldDecorator("type", {
                    initialValue: filterParams.type,
                  })(
                    <Select
                      mode="multiple"
                      style={{
                        width: 200
                      }}
                      allowClear
                      filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {
                        typeList.map(l => (
                          <Select.Option value={l.value} key={l.label}>
                            {l.label}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Item>
              <Item label="分类名称">
                {
                  getFieldDecorator("name", {
                    initialValue: filterParams.name,
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      allowClear
                      filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {
                        nameOptionsList.map(l => (
                          <Select.Option key={l.name} label={l.name}>{l.name}</Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Item>
              <Item label="日期" initialValues={filterParams.date}>
                {
                  getFieldDecorator("date", {
                    initialValue: filterParams.date,
                  })(
                    <RangePicker />
                  )
                }
              </Item>
            </>
          )
        }
      </XFilter>
      <XTable
        dataSource={dataSource}
        columns={columns}
        rowkey="class_id"
      />
    </div>
  );
};
