/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import {
  Transfer, Table, Card, Modal, Button, Form, Input, message, Popconfirm,
} from 'antd';
import {
  getCountryListService, getDataList, create, deleteData,
} from './service';

export default () => {
  // const useMergeState = (initialState) => {
  //   const [state, setState] = useState(initialState);
  //   const setMergedState = newState => setState(prevState => Object.assign({}, prevState, newState));
  //   return [state, setMergedState];
  // };
  const [countrylist, setCountryList] = useState([]);
  const [data, setData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  // const [search, setSearch] = useMergeState({
  //   product: 'viva',
  //   platform: '1',
  //   country: undefined,
  //   advCompany: [],
  //   advPlacement: [],
  //   appVersionOperation: 'in',
  //   countryOperation: 'in',
  //   advType: '',
  //   statisticsType: ['day'],
  //   selectAppVersion: undefined,
  //   mediaSourceValue: undefined,
  //   campaignValue: undefined,
  //   // selectAppVersion: []
  // });
  const getCountryList = async () => {
    const res = await getCountryListService();
    // console.log('res', res);
    res.forEach((element) => {
      element.key = element.value;
      element.title = element.value;
    });
    setCountryList(res);
  };

  const getTableDataList = async () => {
    const { data } = await getDataList();
    // console.log('res2', data);
    data.forEach((element) => {
      element.key = element.id;
      // element.title = element.value;
    });
    setData(data);
  };

  const handleOk = async () => {
    if (targetKeys.length === 0 || !groupName) {
      message.error('请填写信息');
      return false;
    }
    const sendData = {
      countryCodes: targetKeys.join(','),
      groupName,
    };
    const res = await create(sendData);
    // console.log('res', res);
    if (res.code === 20000) {
      message.success('创建成功');
      setIsModalVisible(false);
      setTargetKeys([]);
      getTableDataList();
    } else {
      message.error('创建失败');
    }
  };

  const confirm = async (id) => {
    const res = await deleteData(id);
    // console.log('res', res);
    if (res.code === 20000) {
      getTableDataList();
      message.success('删除成功');
    } else {
      message.error('删除失败');
    }
  };

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  useEffect(() => {
    getCountryList();
    getTableDataList();
  }, []);

  const columns = [
    {
      title: '分组名称',
      dataIndex: 'group_name',
      key: 'group_name',
    },
    {
      title: '国家',
      dataIndex: 'country_codes',
      key: 'country_codes',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '操作',
      dataIndex: 'handel',
      key: 'handel',
      render: (_text, row) => <Popconfirm
        title="确认删除?"
        onConfirm={() => confirm(row.id)}
        okText="Yes"
        cancelText="No"
      >
        <a>Delete</a>
      </Popconfirm>,
    },
  ];

  return (
    <div>
      <Card style={{ width: '100%' }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          添加
        </Button>
      </Card>
      <Table columns={columns} dataSource={data} />
      <Modal title="创建国家分组" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
        <Form.Item
          label="组别名称"
          name="groupName"
          rules={[{ required: true, message: '请输入组别名称!' }]}
        >
          <Input onChange={(e) => {
            setGroupName(e.target.value);
          }}/>
        </Form.Item>
        <Transfer
          dataSource={countrylist}
          showSearch
          titles={['Source', 'Target']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          filterOption={(inputValue, option) => option.title.indexOf(inputValue) > -1}
          render={item => item.title}
        />
      </Modal>
    </div>
  );
};
