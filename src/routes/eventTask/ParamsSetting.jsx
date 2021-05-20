import React, { useState, useEffect } from 'react';
import { Table, Button, Select, message, Popconfirm } from 'antd';
import { getParam, addParam, deleteParam, updateParam } from './services';
import ParamModal from './components/ParamModal';

const TYPES = [
  {
    value: 1,
    text: '载体'
  },
  {
    value: 2,
    text: '对象'
  },
  {
    value: 3,
    text: '行为'
  }
];

export default props => {
  const [visible, setVisible] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const [query, setQuery] = useState({
    type: undefined
  });

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: type => TYPES.filter(item => item.value === type)[0].text
    },
    {
      title: '英文名称',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: '中文名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '操作',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon="search"
            size="small"
            onClick={() => {
              setUpdateData(record);
              setVisible(true);
            }}
          >
            修改
          </Button>
          &nbsp;&nbsp;
          <Popconfirm
            title="确定进入下一步吗？操作不可逆"
            onConfirm={() => {
              deleteParam(record.id);
              getParamList();
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </>
      )
    }
  ];

  const getParamList = async () => {
    const res = await getParam();
    if (res.code === 20000) {
      setDataSource(res.data);
    }
  };

  const handleUpdateModal = async (modalVisible, value) => {
    if (value === null) {
      setVisible(modalVisible);
      return;
    }
    if (value.id) {
      const res = await updateParam(value.id, value);
      if (res.code === 20000) {
        message.success('修改成功');
        getParamList();
        setVisible(modalVisible);
      }
    } else {
      const res = await addParam(value);
      if (res.code === 20000 && res.data.id) {
        message.success('添加成功');
        getParamList();
        setVisible(modalVisible);
      }
    }
  };

  useEffect(() => {
    getParamList();
  }, []);

  return (
    <>
      <div style={{ padding: 10 }}>
        <Select
          placeholder="选择类型"
          style={{ width: 200 }}
          onChange={e => setQuery(q => ({ ...q, type: e }))}
          allowClear
        >
          {TYPES.map(t => (
            <Select.Option value={t.value} key={t.value}>
              {t.text}
            </Select.Option>
          ))}
        </Select>
        &nbsp;&nbsp;
        <Button
          type="primary"
          onClick={() => {
            setUpdateData({});
            setVisible(true);
          }}
        >
          创建配置
        </Button>
      </div>

      <ParamModal visible={visible} values={updateData} changeModalvisible={handleUpdateModal} />

      <Table
        bordered
        rowKey="id"
        dataSource={dataSource.filter(item => {
          if (query.type !== undefined && query.type !== item.type) {
            return false;
          }
          return true;
        })}
        columns={columns}
      />
    </>
  );
};
