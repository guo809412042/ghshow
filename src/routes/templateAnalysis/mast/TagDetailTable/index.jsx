import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Form, DatePicker, Select } from 'antd';
import { getSql } from './sql';
import XTable from '../common/XTable';
import XFilter from '../common/XFilter';
import { columns } from './column';
import { productId } from '../const';
import { getData } from '../../../../utils/request';

const { Item } = Form;
const { RangePicker } = DatePicker;

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [filterParams, setFilterParams] = useState({
    date: [moment().subtract(1, 'd'),  moment().subtract(1, 'd')],
    productId,
  });

  const getTableDate = async () => {
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
    getTableDate();
  }, [filterParams]);

  return (
    <div style={{ marginBottom: 30 }}>
      <XFilter onSearch={handleSearch} title="标签数据详情">
        {
          ({ getFieldDecorator }) => (
            <>
              {/* <Item label="日期" name="date" initialValues={filterParams.date}>
                {
                  getFieldDecorator("date", {
                    initialValue: filterParams.date,
                  })(
                    <RangePicker />
                  )
                }
              </Item> */}
              <Item label="日期" name="date" initialValues={filterParams.date}>
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
        scroll={{
          x: 'max-content'
        }}
      />
    </div>
  );
};
