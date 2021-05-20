import React, { useState, useEffect } from 'react';
import { Table, Button, Select, message, Input, Popconfirm } from 'antd';
import { getAlarm, addAlarm, deleteAlarm, getProductListValid } from './services';
import AlarmModal from './components/AlarmModal';

export default props => {
  const [visible, setVisible] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [productObj, setProductObj] = useState({});
  const [product, setProduct] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [version, setVersion] = useState([]);
  const [business, setBusiness] = useState([]);
  const [tag, setTag] = useState([]);

  const [query, setQuery] = useState({
    product: undefined,
    platform: undefined,
    version: undefined,
    business_module: undefined,
    tag: undefined,
    event_id: undefined
  });

  const columns = [
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
      render: id => productObj[id] || id
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform'
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: '事件名称',
      dataIndex: 'event_name',
      key: 'event_name'
    },
    {
      title: '事件ID',
      dataIndex: 'event_id',
      key: 'event_id'
    },
    {
      title: '触发条件',
      dataIndex: 'remark_desc',
      key: 'remark_desc'
    },
    {
      title: '参数',
      dataIndex: 'event_params',
      key: 'event_params'
    },
    {
      title: '业务模块',
      dataIndex: 'business_module',
      key: 'business_module'
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag'
    },
    {
      title: '是否警告',
      dataIndex: 'is_alarm',
      key: 'is_alarm',
      render: is_alarm => ['N', 'Y'][is_alarm]
    },
    {
      title: '告警等级',
      dataIndex: 'alarm_level',
      key: 'alarm_level',
      render: alarm_level => `P${alarm_level}`
    },
    {
      title: '操作',
      render: (_, record) => (
        <>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => {
              deleteAlarm(record.id);
              getAlarmList();
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

  const getAlarmList = async () => {
    const res = await getAlarm();
    if (res.code === 20000) {
      setDataSource(res.data);

      const productSet = new Set();
      const platformSet = new Set();
      const versionSet = new Set();
      const businessSet = new Set();
      const tagSet = new Set();

      res.data.forEach(item => {
        productSet.add(item.product);
        platformSet.add(item.platform);
        versionSet.add(item.version);
        businessSet.add(item.business_module);
        tagSet.add(item.tag);
      });

      setProduct([...productSet]);
      setPlatform([...platformSet]);
      setVersion([...versionSet]);
      setBusiness([...businessSet]);
      setTag([...tagSet]);
    }
  };

  const getProductList = async () => {
    const res = await getProductListValid();
    if (res.code === 20000) {
      const obj = {};
      res.data.forEach(item => {
        obj[item.product_id] = item.product_name;
      });

      setProductObj(obj);
    }
  };

  const handleUpdateModal = async (modalVisible, value) => {
    if (value === null) {
      setVisible(modalVisible);
      return;
    }

    const res = await addAlarm(value);
    if (res.code === 20000 && res.data.id) {
      message.success('添加成功');
      getAlarmList();
      setVisible(modalVisible);
    }
  };

  useEffect(() => {
    getAlarmList();
    getProductList();
  }, []);

  return (
    <>
      <div style={{ padding: 10 }}>
        <Select
          placeholder="请输入产品"
          style={{ width: 200 }}
          onChange={e => setQuery(q => ({ ...q, product: e }))}
          allowClear
          value={query.product}
        >
          {product.map(t => (
            <Select.Option value={t} key={t}>
              {productObj[t] || t}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="平台选择"
          style={{ width: 200 }}
          onChange={e => setQuery(q => ({ ...q, platform: e }))}
          allowClear
          value={query.platform}
        >
          {platform.map(p => (
            <Select.Option value={p} key={p}>
              {p}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="版本选择"
          style={{ width: 200 }}
          onChange={e => setQuery(q => ({ ...q, version: e }))}
          allowClear
          value={query.version}
        >
          {version.map(v => (
            <Select.Option value={v} key={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="业务模块"
          style={{ width: 200 }}
          onChange={e => setQuery(q => ({ ...q, business_module: e }))}
          allowClear
          value={query.business_module}
        >
          {business.map(v => (
            <Select.Option value={v} key={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="标签"
          style={{ width: 200 }}
          onChange={e => setQuery(q => ({ ...q, tag: e }))}
          allowClear
          value={query.tag}
        >
          {tag.map(v => (
            <Select.Option value={v} key={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
        <Input
          style={{ width: 200 }}
          placeholder="事件id"
          onChange={e => {
            e.persist();
            console.log(e.target.value);
            setQuery(q => ({ ...q, event_id: e.target.value || undefined }));
          }}
          value={query.event_id}
        />
        &nbsp;&nbsp;
        <Button
          type="primary"
          onClick={() => {
            setUpdateData({});
            setVisible(true);
          }}
        >
          告警设置
        </Button>
        <Button
          type="link"
          onClick={() =>
            setQuery({
              product: undefined,
              platform: undefined,
              version: undefined,
              business_module: undefined,
              tag: undefined,
              event_id: undefined
            })
          }
        >
          清空筛选
        </Button>
      </div>

      <AlarmModal visible={visible} values={updateData} changeModalvisible={handleUpdateModal} />

      <Table
        bordered
        rowKey="id"
        dataSource={dataSource.filter(item => {
          console.log(query.event_id, item.event_id, new RegExp(query.event_id, 'i').test(item.event_id));
          if (
            (query.product !== undefined && query.product !== item.product) ||
            (query.platform !== undefined && query.platform !== item.platform) ||
            (query.version !== undefined && query.version !== item.version) ||
            (query.business_module !== undefined && query.business_module !== item.business_module) ||
            (query.tag !== undefined && query.tag !== item.tag) ||
            (query.event_id !== undefined && !new RegExp(query.event_id, 'i').test(item.event_id))
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
