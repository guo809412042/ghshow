/* eslint-disable guard-for-in */
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Select, Collapse, message,
} from 'antd';
import jsCookie from 'js-cookie';
import { getProductList, addProductInfo, updateProductInfo } from './services';
import ProductModal from './components/ProductModal';
import ProductDetailModal from './components/ProductDetailModal';

const { Panel } = Collapse;

export default () => {
  const [visible, setVisible] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const [filterList, setFilterList] = useState([]);
  const [filterName, setFilterName] = useState(undefined);

  const [detailId, setDetailId] = useState(undefined);

  const [ids, setIds] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '产品ID',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: '产品名称',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: '状态',
      dataIndex: 'product_state',
      key: 'product_state',
      render: product_state => ['停用', '使用中'][product_state],
    },
    {
      title: '产品说明',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Button
            type="primary"
            icon="search"
            size="small"
            onClick={() => {
              console.log(record.id);
              setDetailId(record.id);
            }}
          >
            查看
          </Button>
          &nbsp;
          <Button
            type="pridemary"
            icon="edit"
            size="small"
            onClick={() => {
              setUpdateData({ ...record });
              setVisible(true);
            }}
          >
            编辑
          </Button>
        </>
      ),
    },
  ];

  const getData = async () => {
    const res = await getProductList();
    if (res.code === 20000) {
      const ids = [];
      res.data.map((item) => {
        ids.push(item.product_id);
      });
      setIds(ids);
      setDataSource(res.data.reverse());
      const set = new Set();
      for (const i in res.data) {
        set.add(res.data[i].product_name);
      }
      setFilterList([...set]);
    }
  };

  const handleUpdateModal = async (modalVisible, value) => {
    setVisible(modalVisible);

    if (value) {
      if (value.id) {
        const res = await updateProductInfo(value.id, { ...value, modify_creater: jsCookie.get('email') });
        if (res.code === 20000 && res.data[0]) {
          message.success('产品修改信息提交成功，正在审核中');
          getData();
        }
      } else {
        const res = await addProductInfo({ ...value, modify_creater: jsCookie.get('email') });
        if (res.code === 20000 && res.data.id) {
          message.success('产品添加信息成功，正在审核中');
          getData();
        }
      }
    }
  };

  const handleDetailModal = async (modalVisible) => {
    if (!modalVisible) {
      setDetailId(undefined);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Collapse defaultActiveKey={['1']} style={{ marginTop: 15, marginBottom: 15 }}>
        <Panel header="操作" key="1">
          <Button
            type="primary"
            onClick={() => {
              setUpdateData({});
              setVisible(true);
            }}
          >
            新增产品配置
          </Button>
          <Select
            placeholder="请输入产品名"
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
      <ProductModal ids={ids} visible={visible} values={updateData} changeModalvisible={handleUpdateModal} />
      {detailId && <ProductDetailModal id={detailId} changeModalvisible={handleDetailModal} />}
      <Table
        bordered
        rowKey="id"
        dataSource={dataSource.filter(item => (filterName ? item.product_name === filterName : true))}
        columns={columns}
      />
    </>
  );
};
