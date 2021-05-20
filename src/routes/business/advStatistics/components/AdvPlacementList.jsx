import React, { useEffect, useState, Fragment } from 'react';
import {
  Table, Button, Modal, message, Popconfirm,
} from 'antd';
import Add from './AdvPlacementAdd';
import { DeleteAdvPlacement, GetAdvPlacementList } from '../services';
import { ProductList, advTypeList } from './utils';

export default ({ appList, updateView }) => {
  const [advPlacementList, setAdvPlacementList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [placementNameList, setPlacementNameList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [filterProductList, setProductList] = useState([]);

  const getList = async () => {
    const { data } = await GetAdvPlacementList();
    const placementList = [...new Set(data.map(item => item.placement_name))];
    setPlacementNameList(placementList.map(item => ({
      text: item,
      value: item,
    })));
    const companyList = [...new Set(data.map(item => item.company.toLocaleLowerCase()))];
    setCompanyList(companyList.map(item => ({
      text: item,
      value: item,
    })));
    const filterProductList = [...new Set(data.map(item => item.product_id))];
    setProductList(filterProductList.map(text => ({
      text: ProductList.find(v => v.value === String(text)) ? ProductList.find(v => v.value === String(text)).key : text,
      value: text,
    })));
    setAdvPlacementList(data);
  };

  const del = async (record) => {
    const res = await DeleteAdvPlacement(record);
    if (res && res.code === 20000) {
      await getList();
      message.info('操作成功');
    } else {
      message.info('操作异常');
    }
  };

  const show = () => {
    setVisible(true);
  };

  const columns = [
    {
      dataIndex: 'product_id',
      key: 'product_id',
      title: '产品',
      render: (text) => {
        const find = ProductList.find(v => v.value === String(text));
        return find ? find.key : text;
      },
      filters: filterProductList,
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.product_id.toLocaleLowerCase().indexOf(value) === 0,
    },
    {
      dataIndex: 'company',
      key: 'company',
      title: '广告商',
      filters: companyList,
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.company.toLocaleLowerCase().indexOf(value) === 0,
    },
    {
      dataIndex: 'placement_name',
      key: 'placement_name',
      title: '广告位名称',
      filters: placementNameList,
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.placement_name.indexOf(value) === 0,
    },
    {
      dataIndex: 'placement_id',
      key: 'placement_id',
      title: '广告位ID',
    },
    {
      dataIndex: 'disptype',
      key: 'disptype',
      title: '广告形式',
      render: text => advTypeList.map((item) => {
        if (text !== null & +item.select_key === +text) {
          return item.select_value;
        }
      }),
    },
    {
      dataIndex: 'platform',
      key: 'platform',
      title: '平台',
      render: text => (+text === 1 ? 'Android' : 'iOS'),
      filters: [
        {
          text: 'Android',
          value: '1',
        },
        {
          text: 'iOS',
          value: '2',
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.platform.indexOf(value) === 0,
    },
    {
      dataIndex: 'operator',
      key: 'operator',
      title: '操作',
      render: (text, record) => <Fragment>
        <Add content={record} isAdd={false} callback={getList} appList={appList}/>
        <span>{'  '}</span>
        <Popconfirm title="确定要删除吗？" onConfirm={() => del(record)}>
          <a>删除</a>
        </Popconfirm>
      </Fragment>,
    },
  ];

  useEffect(() => {
    if (visible) {
      getList();
    }
    if (typeof updateView === 'function') {
      updateView();
    }
  }, [visible]);

  return (<Fragment>
    <Button type="primary" onClick={show}>广告位配置</Button>
    <Modal width={800} title="广告位配置" visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      <Add appList={appList} callback={getList} />
      <p />
      <Table
        dataSource={advPlacementList}
        columns={columns}
      />
    </Modal>
  </Fragment>);
};
