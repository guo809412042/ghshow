/* eslint-disable guard-for-in */
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Collapse, message, Select, Popover,
} from 'antd';
import { getEmployeeList, updateEmployeeList, getProductLineList } from './services';

const { Panel } = Collapse;

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [productLine, setProductLine] = useState([]);
  const [productLineObj, setProductLineObj] = useState({});

  const [filterList, setFilterList] = useState([]);
  const [filterName, setFilterName] = useState(undefined);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '部门名称',
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: '产品线',
      dataIndex: 'product_line_id',
      key: 'product_line_id',
      render: (lineId, record) => (
        <Popover
          trigger="click"
          content={
            <Select
              defaultValue={lineId || undefined}
              style={{ width: 220 }}
              placeholder={`请设置${record.name}所在的产品线`}
              onChange={async (plid) => {
                const res = await updateEmployeeList(record.id, {
                  product_line_id: plid,
                });
                if (res.code === 20000 && res.data === true) {
                  message.success('设置成功');
                  setDataSource(data => [
                    ...data.map(item => ({
                      ...item,
                      product_line_id: item.id === record.id ? plid : item.product_line_id,
                    })),
                  ]);
                } else {
                  message.error('设置失败，刷新页面后重试');
                }
              }}
            >
              {productLine.map(p => (
                <Select.Option value={p.id} key={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          }
        >
          <Button type="link">{productLineObj[lineId] || '未设置'}</Button>
        </Popover>
      ),
    },
  ];

  const getData = async () => {
    const res = await getEmployeeList();
    if (res.code === 20000) {
      setDataSource(res.data);
      const set = new Set();
      for (const i in res.data) {
        set.add(res.data[i].name);
      }
      setFilterList([...set]);
    }
  };

  const getProductLine = async () => {
    const res = await getProductLineList();
    if (res.code === 20000) {
      const obj = {};
      for (const i in res.data) {
        obj[res.data[i].id] = res.data[i].name;
      }
      setProductLineObj(obj);
      setProductLine(res.data);
    }
  };

  useEffect(() => {
    getData();
    getProductLine();
  }, []);

  return (
    <>
      <Collapse defaultActiveKey={['1']} style={{ marginTop: 15, marginBottom: 15 }}>
        <Panel header="操作" key="1">
          <Select
            placeholder="请输入姓名"
            style={{ width: 200, float: 'right' }}
            onChange={filtername => setFilterName(filtername)}
            allowClear
            optionFilterProp="children"
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {filterList.map(name => (
              <Select.Option value={name} key={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Panel>
      </Collapse>
      <Table
        bordered
        rowKey="id"
        dataSource={dataSource.filter(item => (filterName ? item.name === filterName : true))}
        columns={columns}
      />
    </>
  );
};
