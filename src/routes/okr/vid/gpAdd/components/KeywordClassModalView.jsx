import React, { useState, useEffect } from 'react';
import {
  Button, Popconfirm, Table, Modal,
} from 'antd';
import { getClass, deleteClass } from '../services';
import AddClassModel from './AddClassModalView';

export default ({ keywordList, refreshMethod, keywordListSql }) => {
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  const initClass = async () => {
    const res = await getClass(6);
    setClassList(res.data);
    setLoading(false);
  };
  const handleDeleteClass = async (data) => {
    await deleteClass(data.id);
    await initClass();
  };
  const handleOk = async () => {
    await refreshMethod();
    setShowListModal(false);
  };
  const handleCancel = async () => {
    await refreshMethod();
    setShowListModal(false);
  };

  const listKeywordClass = () => {
    setShowListModal(true);
  };

  useEffect(() => {
    initClass();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '分类',
      dataIndex: 'class_name',
      key: 'class_name',
    },
    {
      title: '关键词',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => (
          <>
          <Popconfirm
            title="确认删除"
            onConfirm={() => handleDeleteClass(record)}
            okText="是"
            cancelText="否"
          >
            <Button type="primary">删除</Button>
          </Popconfirm>
          <br />
          <AddClassModel refreshTable={initClass}
            keywordList={keywordList} buttonName="修改" keywordSelectInit={record.keyword.split(',')}
            classNameInit={record.class_name} dataId={record.id} keywordListSql={keywordListSql} />
          </>
      ),
    },
  ];
  const tableOpts = {
    style: { backgroundColor: '#fff', marginTop: '10px' },
    loading,
    pagination: false,
    columns,
    dataSource: classList,
  };
  const listOpts = {
    visible: showListModal,
    width: 890,
    onCancel: handleCancel,
    onOk: handleOk,
  };
  return <>
    <Button type="primary" onClick={listKeywordClass}>分类管理</Button>
    <Modal {...listOpts}>
      <AddClassModel refreshTable={initClass} keywordList={keywordList}
        buttonName="创建" keywordSelectInit={[]} classNameInit="" keywordListSql={keywordListSql} />
      <Table {...tableOpts} />
      <div style={{ clear: 'both' }} />
    </Modal>
  </>;
};
