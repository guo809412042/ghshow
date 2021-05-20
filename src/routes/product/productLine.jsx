import React, { useState, useEffect } from 'react';
import {
  Table, Button, Collapse, message,
} from 'antd';
import { getProductLineList, addProductLine, updateProductLine } from './services';
import ProductLineModal from './components/ProductLineModal';

const { Panel } = Collapse;

export default () => {
  const [visible, setVisible] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '产品线名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '产品线负责人（第一审批人）',
      dataIndex: 'owner_email',
      key: 'owner_email',
      render: (_, record) => `${record.owner_name} - ${record.owner_email}`,
    },
    {
      title: '数据组负责人（第二审批人）',
      dataIndex: 'reviewer_email',
      key: 'reviewer_email',
      render: (_, record) => `${record.reviewer_name} - ${record.reviewer_email}`,
    },
    {
      title: '操作',
      render: (_, record) => (
        <Button
          type="pridemary"
          icon="edit"
          size="small"
          onClick={() => {
            setUpdateData(record);
            setVisible(true);
          }}
        >
          编辑
        </Button>
      ),
    },
  ];

  const getData = async () => {
    const res = await getProductLineList();
    if (res.code === 20000) {
      setDataSource(res.data);
    }
  };

  const handleUpdateModal = async (modalVisible, value) => {
    setVisible(modalVisible);

    if (value) {
      if (value.id) {
        const res = await updateProductLine(value.id, value);
        if (res.code === 20000 && res.data) {
          message.success('产品线修改成功');
          getData();
        }
      } else {
        const res = await addProductLine(value);
        if (res.code === 20000 && res.data.id) {
          message.success('产品线添加成功');
          getData();
        }
      }
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
            新增产品线
          </Button>
        </Panel>
      </Collapse>
      <ProductLineModal visible={visible} values={updateData} changeModalvisible={handleUpdateModal} />
      <Table bordered rowKey="id" dataSource={dataSource} columns={columns} />
    </>
  );
};
