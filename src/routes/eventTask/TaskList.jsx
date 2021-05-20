/* eslint-disable guard-for-in */
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Select, Collapse, message, Popconfirm,
} from 'antd';
import {
  getEventTask, addEventTask, getProductListValid, getProductVersion, deleteEventTask,
} from './services';
import {
  platformMap,
} from './const';
import EventTaskModal from './components/EventTaskModal';

const { Panel } = Collapse;

export default (props) => {
  const [visible, setVisible] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const [query, setQuery] = useState({
    product_name: undefined,
    platform: undefined,
    version: undefined,
    task_name: undefined,
  });

  const [product, setProduct] = useState([]);
  const [version, setVersion] = useState([]);

  const getTaskList = async () => {
    const res = await getEventTask();
    if (res.code === 20000) {
      setDataSource(res.data);
    }
  };

  const confirm = async (id) => {
    const res = await deleteEventTask(id);
    if (res.code === 20000) {
      message.success(res.message);
      getTaskList();
    } else {
      message.error(res.message);
    }
  };

  const columns = [
    {
      title: '产品',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      render: text => platformMap[text],
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '任务名称',
      dataIndex: 'task_name',
      key: 'task_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      key: 'status',
      render: status => ['埋点设计中', '开发中', '测试中', '埋点上线'][status],
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
              // setDetailId(record.id);
              props.history.push(`/gh/event_task/task_detail/${record.id}`);
            }}
          >
            查看
          </Button>
          {record.status < 3 && <Popconfirm title="确定要删除这个事件吗？" onConfirm={() => confirm(record.id)}>
            <Button size="small" style={{ marginLeft: 16 }}>删除</Button>
          </Popconfirm>}
        </>
      ),
    },
  ];

  const init = async () => {
    getTaskList();

    const pi = await getProductListValid();
    if (pi.code === 20000) {
      setProduct(pi.data);
    }
  };

  const handleProductChange = async (product_name, e) => {
    setQuery(e => ({ ...e, product_name, version: undefined }));
    const productId = e.props['data-product_id'];
    const v = await getProductVersion(productId);
    setVersion(v.data.reverse());
  };

  const handleUpdateModal = async (modalVisible, value) => {
    if (value === null) {
      setVisible(modalVisible);
      return;
    }

    const res = await addEventTask(value);
    if (res.code === 20000 && res.data.id) {
      message.success('任务添加成功');
      getTaskList();
      setVisible(modalVisible);
    }
  };

  useEffect(() => {
    init();
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
            创建任务
          </Button>
          <Select
            placeholder="请输入产品"
            style={{ width: 200 }}
            onChange={handleProductChange}
            allowClear
            optionFilterProp="children"
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            value={query.product_name}
          >
            {product.map(p => (
              <Select.Option value={p.product_name} data-product_id={p.product_id} key={p.id}>
                {p.product_name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="平台选择"
            style={{ width: 200 }}
            onChange={platform => setQuery(e => ({ ...e, platform }))}
            value={query.platform}
            allowClear
          >
            <Select.Option value={0} key={0}>
              ios
            </Select.Option>
            <Select.Option value={1} key={1}>
              安卓
            </Select.Option>
          </Select>
          <Select
            placeholder="版本选择"
            style={{ width: 200 }}
            onChange={version => setQuery(e => ({ ...e, version }))}
            value={query.version}
            allowClear
          >
            {version.map(v => (
              <Select.Option value={v.version} key={v.version}>
                {v.version}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="请输入项目名称"
            style={{ width: 200 }}
            value={query.task_name}
            onChange={(task_name) => {
              console.log(task_name);
              setQuery(e => ({ ...e, task_name }));
            }}
            allowClear
            optionFilterProp="children"
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {dataSource.map(item => (
              <Select.Option value={item.task_name} key={item.id}>
                {item.task_name}
              </Select.Option>
            ))}
          </Select>
        </Panel>
      </Collapse>
      <EventTaskModal visible={visible} values={updateData} changeModalvisible={handleUpdateModal} />
      <Table
        bordered
        rowKey="id"
        dataSource={dataSource.filter((item) => {
          if (
            (query.product_name !== undefined && query.product_name !== item.product_name)
            || (query.platform !== undefined && query.platform !== item.platform)
            || (query.version !== undefined && query.version !== item.version)
            || (query.task_name !== undefined && query.task_name !== item.task_name)
          ) {
            return false;
          }
          return true;
        })}
        columns={columns}
      />
    </>
  );
};
