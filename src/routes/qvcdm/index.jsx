import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { query, destroy } from './service';
import InsertView from './InsertView';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const getList = async () => {
    const res = await query();
    setDataSource(res);
  };
  const remove = async (id) => {
    Modal.confirm({
      title: '确定删除？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        await destroy(id);
        await getList();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const columns = [
    'id',
    'table_name',
    'table_field',
    'mon_type',
    'condition',
    'mon_value1',
    'mon_value2',
    'warning_msg',
  ].map(v => ({
    dataIndex: v,
    title: v,
    key: v,
  }));
  columns.push({
    dataIndex: 'action',
    title: '操作',
    key: 'action',
    render: (text, row) => (
      <Button type="primary" onClick={() => remove(row.id)}>
        删除
      </Button>
    ),
  });

  useEffect(() => {
    getList();
  }, []);
  return (
    <div>
      <InsertView getList={getList} />
      <Table dataSource={dataSource} columns={columns} bordered style={{ marginTop: 20 }} rowKey="id" />
    </div>
  );
};
