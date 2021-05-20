import React, { useState, useEffect } from 'react';
import { Table, Button, Collapse, message, Popconfirm, Select } from 'antd';
import { getEventTaskEmployeeList, addEventTaskEmployee, deleteEventTaskEmployee, getEmployeeList } from './services';
import EventTaskEmployeeModal from './components/EventTaskEmployeeModal';

const { Panel } = Collapse;

const jobDesc = new Map([[0, '埋点设计'], [1, 'ios开发'], [2, '安卓开发'], [3, '测试']]);

export default () => {
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [jobType, setJobType] = useState(undefined);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '职责',
      dataIndex: 'job_type',
      key: 'job_type',
      render: j => jobDesc.get(j)
    },
    {
      title: '操作',
      render: (_, record) => (
        <Popconfirm
          title="你确定删除人员吗？"
          onConfirm={async () => {
            const res = await deleteEventTaskEmployee(record.id);
            if (res.code === 20000 && res.data) {
              message.success('人员删除成功');
              getData();
            }
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="pridemary" icon="edit" size="small">
            删除
          </Button>
        </Popconfirm>
      )
    }
  ];

  const getData = async () => {
    const res = await getEventTaskEmployeeList();
    if (res.code === 20000) {
      setDataSource(res.data);
    }

    const ee = await getEmployeeList();
    if (ee.code === 20000) {
      setEmployee(ee.data);
    }
  };

  const handleUpdateModal = async (modalVisible, value) => {
    if (value === null) {
      setVisible(modalVisible);
      return
    }

    const res = await addEventTaskEmployee(value);
    if (res.code === 20000 && res.data.id) {
      message.success('人员添加成功成功');
      getData();
      setVisible(modalVisible);
    } else {
      message.error('添加失败，可能是当前人员在该职责下已经存在');
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
              setVisible(true);
            }}
          >
            新增人员
          </Button>

          <Select
            placeholder="请选择职责"
            style={{
              width: 200,
              float: 'right'
            }}
            allowClear
            onChange={t => setJobType(t)}
          >
            <Select.Option value={0} key={0}>
              埋点设计
            </Select.Option>
            <Select.Option value={1} key={1}>
              ios开发
            </Select.Option>
            <Select.Option value={2} key={2}>
              安卓开发
            </Select.Option>
            <Select.Option value={3} key={3}>
              测试
            </Select.Option>
          </Select>
        </Panel>
      </Collapse>
      <EventTaskEmployeeModal visible={visible} changeModalvisible={handleUpdateModal} />
      <Table
        bordered
        rowKey="id"
        dataSource={dataSource.filter(i => jobType === undefined || i.job_type === jobType)}
        columns={columns}
      />
    </>
  );
};
