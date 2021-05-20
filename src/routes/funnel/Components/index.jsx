/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Input, Radio, Button, Collapse, Table, Modal, Form, message,
} from 'antd';
import jsCookie from 'js-cookie';
import InsertOrUpdateView from './InsertOrUpdateView';
import {
  getFunnelEvent,
  deleteFunnelEvent,
  updateFunnelEventTag,
  deleteFunnelEventTags,
  updateFunnelEventStar,
} from '../service';

export default ({
  product_id, database, product, funnelType, productName = 'product', keyDatabase, ...props

}) => {
  const userId = JSON.parse(jsCookie.get('user')).user.id;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [type, setType] = useState('3');
  const [visible, setVisible] = useState(false);
  const [tagVisible, setTagVisible] = useState(false);
  const [editRow, setEditRow] = useState({});
  const [modalType, setModalType] = useState('add');
  const [searchName, setSearchName] = useState(undefined);
  const [dataSource, setDataSource] = useState([]);
  const [newTag, setNewTag] = useState(undefined);
  const getList = async () => {
    const res = await getFunnelEvent({
      name: searchName,
      username: type === '1' ? jsCookie.get('email') : '',
      star: type === '2' ? userId : '',
      step: 1,
      product_id,
      funnelType,
    });
    setDataSource(res.data);
  };
  const edit = (row) => {
    setVisible(true);
    setEditRow(row);
    setModalType('edit');
  };
  const deleteRow = (row) => {
    Modal.confirm({
      title: '确定删除？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        await deleteFunnelEvent(row.funnel_id);
        await getList();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const deleteIds = (row) => {
    if (!selectedRowKeys.length) {
      message.warn('请选择数据！');
    } else {
      Modal.confirm({
        title: '确定删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          await deleteFunnelEventTags(selectedRowKeys.join(','));
          await getList();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };
  const tagSubmit = async () => {
    if (!selectedRowKeys.length) {
      message.warn('请选择数据！');
    } else {
      await updateFunnelEventTag({ ids: selectedRowKeys.join(','), tag: newTag });
      setTagVisible(false);
      await getList();
    }
  };
  const updateStar = async (row) => {
    let star;
    if (row.star && row.star.includes(userId)) {
      const data = row.star.split(',');
      star = data.filter(v => v.toString() !== userId.toString()).join(',');
    } else {
      const data = row.star ? row.star.split(',') : [];
      data.push(userId);
      star = data.join(',');
    }
    await updateFunnelEventStar(row.id, { star });
    await getList();
  };
  const submitOk = async (value) => {
    setVisible(false);
    if (value) {
      await getList();
    }
  };
  const add = () => {
    setModalType('add');
    setVisible(true);
    setEditRow({});
  };
  const chartClick = (row) => {
    props.history.push(`/gh/funnel/${product_id}/${row.funnel_id}/${funnelType}`);
  };
  const columns = [
    { dataIndex: 'name', key: 'name', title: '漏斗名称' },
    { dataIndex: 'tag', key: 'tag', title: '漏斗标签' },
    { dataIndex: 'username', key: 'username', title: '创建者' },
    { dataIndex: 'update_username', key: 'update_username', title: '编辑者' },
    { dataIndex: 'create_time', key: 'create_time', title: '创建时间' },
    { dataIndex: 'update_time', key: 'update_time', title: '编辑时间' },
    {
      dataIndex: 'action',
      key: 'action',
      title: '操作',
      render: (text, row) => (
        <div>
          <Button icon="bar-chart" onClick={() => chartClick(row)} />
          <Button style={{ margin: '0 5px' }} icon="edit" onClick={() => edit(row)} />
          <Button icon="delete" style={{ marginRight: 5 }} onClick={() => deleteRow(row)} />
          <Button
            icon="star"
            type={row.star && row.star.includes(userId) ? 'primary' : 'default'}
            onClick={() => updateStar(row)}
          />
        </div>
      ),
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys,
  };
  useEffect(() => {
    getList();
  }, [searchName, type, product_id, database, product]);
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Input.Search placeholder="搜索漏斗名称" style={{ width: 250 }} onSearch={setSearchName} />
          <Radio.Group onChange={e => setType(e.target.value)} style={{ margin: '0 8px' }} value={type}>
            <Radio.Button key="1" value="1">
              我的
            </Radio.Button>
            <Radio.Button key="2" value="2">
              收藏
            </Radio.Button>
            <Radio.Button key="3" value="3">
              全部
            </Radio.Button>
          </Radio.Group>
        </Collapse.Panel>
      </Collapse>

      <Button icon="plus" onClick={add} type="primary">
        创建漏斗
      </Button>
      <Button style={{ margin: 8 }} icon="tag" onClick={() => setTagVisible(true)}>
        批量添加标签
      </Button>
      <Button icon="delete" onClick={deleteIds}>
        批量删除
      </Button>
      <Table columns={columns} dataSource={dataSource} bordered rowSelection={rowSelection} rowKey="funnel_id" />
      <InsertOrUpdateView
        product_id={product_id}
        visible={visible}
        editRow={editRow}
        modalType={modalType}
        submitOk={submitOk}
        database={database}
        keyDatabase={keyDatabase}
        product={product}
        funnelType={funnelType}
        productName={productName}
      />
      <Modal visible={tagVisible} title="标签" onCancel={() => setTagVisible(false)} onOk={tagSubmit}>
        <Form layout="inline">
          <Form.Item label="漏斗标签">
            <Input value={newTag} onChange={e => setNewTag(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
