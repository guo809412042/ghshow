import React, { useEffect, useState, Fragment } from 'react';
import {
  Table, Button, Modal, message, Popconfirm,
} from 'antd';
import Add from './AdvPlacementAdd';
import { DeleteAdvPlacement, GetAdvPlacementList } from '../services';
import { ProductList } from './utils';

export default ({ appList, updateView }) => {
  const [advPlacementList, setAdvPlacementList] = useState([]);
  const [visible, setVisible] = useState(false);

  const getList = async () => {
    const { data } = await GetAdvPlacementList();
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
    },
    {
      dataIndex: 'company',
      key: 'company',
      title: '广告商',
    },
    {
      dataIndex: 'placement_name',
      key: 'placement_name',
      title: '广告位名称',
    },
    {
      dataIndex: 'placement_id',
      key: 'placement_id',
      title: '广告位ID',
    },
    {
      dataIndex: 'platform',
      key: 'platform',
      title: '平台',
      render: text => (text == 1 ? 'Android' : 'iOS'),
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
