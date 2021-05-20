import React, { useState, useEffect } from 'react';
import {
  Table, Button, Pagination, Modal,
} from 'antd';
import { getConfigListPage, deleteConfig } from './service';
import InsertAndUpdateView from './InsertAndUpdateView';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const getList = async () => {
    const res = await getConfigListPage({ page });
    setTotal(res.count);
    setDataSource(res.rows);
  };
  const remove = (row) => {
    Modal.confirm({
      title: '确定删除？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        await deleteConfig(row.id);
        await getList();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const columns = [
    { dataIndex: 'id', key: 'id', title: 'id' },
    { dataIndex: 'product', key: 'product', title: 'product' },
    { dataIndex: 'p_menu_title', key: 'p_menu_title', title: '菜单' },
    { dataIndex: 'name', key: 'name', title: '名称' },
    { dataIndex: 'database', key: 'database', title: '表名' },
    { dataIndex: 'field_name', key: 'field_name', title: '字段名' },
    {
      dataIndex: 'action',
      key: 'action',
      title: '操作',
      render: (text, row) => <Button onClick={() => remove(row)}>删除</Button>,
    },
  ];
  const submitOk = async () => {
    await getList();
  };
  useEffect(() => {
    getList();
  }, [page]);
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} bordered rowKey="id" pagination={false} />
      <Pagination
        current={page}
        total={total}
        onChange={setPage}
        pageSize={10}
        style={{ margin: 10 }}
        showTotal={() => `Total: ${total}`}
      />
      <InsertAndUpdateView submitOk={submitOk} />
    </div>
  );
};
