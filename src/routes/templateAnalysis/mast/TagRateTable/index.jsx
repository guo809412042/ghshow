import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Form, DatePicker, Select } from 'antd';
import { getTableDataSql, getNameListSql, getPathListSql } from './sql';
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
  const [optionsList, setOptionsList] = useState([]);
  const [nameOptionsList, setNameOptionsList] = useState([]);

  const formatTreeResult = (list) => {
    const result = [];
    if (!list || !list.length) {
      return result;
    }
    list.forEach(l => {
      const { ds, path, ttid_cnt, ratio, } = l;
      const findSamePathAndDs = result.findIndex(item => item.ds === ds && item.path === path);
      if (findSamePathAndDs > -1) {
        const { children, } = result[findSamePathAndDs];

        result[findSamePathAndDs].ttid_cnt += ttid_cnt;
        result[findSamePathAndDs].ratio += ratio;
        result[findSamePathAndDs].ratio = Math.round(result[findSamePathAndDs].ratio * 10000) / 10000;
        children.push(l);
      } else {
        result.push({
          ds,
          path,
          ratio,
          ttid_cnt,
          children: [l]
        });
      }
    })
    return result;
  };

  const getTableDate = async () => {
    const sql = getTableDataSql(filterParams);
    const resp = await getData(sql);
    const { path } = filterParams;
    let list = resp;
    // 有维度情况下，对list处理成树形结构
    if (path) {
      list = formatTreeResult(resp);
    }
    setDataSource(list);
  };

  const getSelectOptionList = async () => {
    const sql = getPathListSql();
    const resp = await getData(sql);

    setOptionsList(resp);
  };

  const getNameSelectOptionList = async () => {
    const sql = getNameListSql();
    const resp = await getData(sql);

    setNameOptionsList(resp);
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

  useEffect(() => {
    getSelectOptionList();
    getNameSelectOptionList();
  }, []);

  return (
    <div style={{ marginBottom: 30 }}>
      <XFilter onSearch={handleSearch} title="标签占比">
        {
          ({ getFieldDecorator }) => (
            <>
              <Item label="日期">
                {
                  getFieldDecorator("date", {
                    initialValue: filterParams.date,
                  })(
                    <RangePicker />
                  )
                }
              </Item>
              <Item label="维度">
                {
                  getFieldDecorator("path", {
                    initialValue: filterParams.path,
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      allowClear
                      filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {
                        optionsList.map(l => (
                          <Select.Option
                            key={l.path}
                            label={l.path}
                          >
                            {l.path}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Item>
              <Item label="标签">
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
            </>
          )
        }
      </XFilter>
      <XTable
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};
