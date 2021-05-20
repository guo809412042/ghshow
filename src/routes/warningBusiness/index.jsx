/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Select,
  Input,
  Button,
  DatePicker,
  Table,
  Radio,
  Icon,
  Pagination,
  message,
  Modal,
  Switch,
} from 'antd';
import moment from 'moment';
import cookie from 'js-cookie';
import {
  APP_PRODUCT_LIST, ENABLE, DAT_TYPE,
} from './const';
import InsertAndUpdateView from './InsertAndUpdateView';
import {
  getWarningList, changeState, deleteWarning,
} from './service';

export default () => {
  const pageSize = 10;
  // const product = 2;
  const [product, setProduct] = useState('');
  // const [type, setType] = useState('1');
  const [mine, setMine] = useState('1');
  const [state, setState] = useState(undefined);
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(0, 'days'));
  const [visible, setVisible] = useState(false);
  const [editRow, setEditRow] = useState({});
  const [modalType, setModalType] = useState('add');
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [moreData, setMoreData] = useState([]);
  const [moreVisible, setMoreVisible] = useState(false);
  const getList = async () => {
    const res = await getWarningList({
      product,
      // type,
      state,
      username: mine === '1' ? cookie.get('email') : username,
      page,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      page_size: pageSize,
    });
    console.log('res', res);
    // const rateRes = await getRates(product);
    // setRateList(rateRes);
    setTotal(res.count);
    setDataSource(res.rows);
  };
  const edit = (row, type = 'edit') => {
    setVisible(true);
    setEditRow(row);
    setModalType(type);
  };
  const add = () => {
    setModalType('add');
    setVisible(true);
    setEditRow({});
  };
  useEffect(() => {
    getList();
  }, [product, state, username, startDate, endDate, page, mine]);
  const deleteRow = (id) => {
    Modal.confirm({
      title: '确定删除？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        await deleteWarning(id);
        await getList();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const stateChange = (row) => {
    Modal.confirm({
      title: '确定修改状态？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        await changeState(row.id, row.state === '1' ? 0 : 1);
        await getList();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      title: '名称',
      width: 180,
    },
    {
      dataIndex: 'product', key: 'product', title: '产品', render: text => APP_PRODUCT_LIST[text],
    },
    {
      dataIndex: 'platform', key: 'platform', title: '平台', render: text => (text === '1' ? 'Android' : 'iOS'),
    },
    {
      dataIndex: 'channel', key: 'channel', title: '渠道',
    },
    { dataIndex: 'last_warning_time', key: 'last_warning_time', title: '上次预警时间' },
    {
      dataIndex: 'create_time',
      key: 'create_time',
      title: '创建信息',
      width: 200,
      render: (text, row) => (
        <div>
          <p>{row.username}</p>
          <p>{text}</p>
        </div>
      ),
    },
    {
      dataIndex: 'state',
      key: 'state',
      title: '状态',
      render: (text, row) => <Switch size="small" checked={text === '1'} onChange={() => stateChange(row)} />,
    },
    {
      dataIndex: 'action',
      key: 'action',
      title: '操作',
      width: 180,
      render: (text, row) => (
        <div>
          <Button size="small" onClick={() => edit(row)}>
            编辑
          </Button>
          <Button size="small" style={{ marginLeft: 5 }} onClick={() => edit(row, 'copy')} type="dashed">
            复制
          </Button>
          <Button type="primary" style={{ marginLeft: 5 }} size="small" onClick={() => deleteRow(row.id)}>
            删除
          </Button>
        </div>
      ),
    },
  ];
  const deleteIds = () => {
    if (!selectedRowKeys.length) {
      message.warn('请选择数据！');
    } else {
      Modal.confirm({
        title: '确定删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          await deleteWarning(selectedRowKeys.join(','));
          await getList();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };
  const enableHandle = () => {
    if (!selectedRowKeys.length) {
      message.warn('请选择数据！');
    } else {
      Modal.confirm({
        title: '确定启用？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          await changeState(selectedRowKeys.join(','), 1);
          await getList();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };
  const disenableHandle = () => {
    if (!selectedRowKeys.length) {
      message.warn('请选择数据！');
    } else {
      Modal.confirm({
        title: '确定禁用？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          await changeState(selectedRowKeys.join(','), 0);
          await getList();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };
  const submitOk = (value) => {
    if (value) {
      getList();
    }
    setVisible(false);
  };
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys,
  };
  useEffect(() => {
    if (!moreVisible) {
      setMoreData([]);
    }
  }, [moreVisible]);
  return (
    <div>
      <Button type="primary" onClick={add}>
        添加预警
      </Button>
      <Radio.Group onChange={e => setMine(e.target.value)} style={{ margin: 8 }} value={mine}>
        <Radio.Button key="1" value="1">
          我的
        </Radio.Button>
        <Radio.Button key="2" value="2">
          全部
        </Radio.Button>
      </Radio.Group>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <span>产品: </span>
          <Select placeholder="选择产品" value={product} onChange={value => setProduct(value)} style={{ width: 200 }}>
            <Select.Option key="" value="">
                全部
            </Select.Option>
            {Object.keys(APP_PRODUCT_LIST).map(v => (
              <Select.Option key={APP_PRODUCT_LIST[v]} value={APP_PRODUCT_LIST[v]}>
                {APP_PRODUCT_LIST[v]}
              </Select.Option>
            ))}
          </Select>
          <span>状态: </span>
          <Select
            value={state}
            onChange={setState}
            style={{ width: 120, margin: '0 8px' }}
            placeholder="是否启用"
            allowClear
          >
            {Object.keys(ENABLE).map(v => (
              <Select.Option key={v} value={v}>
                {ENABLE[v]}
              </Select.Option>
            ))}
          </Select>
          <span>创建者: </span>
          <Input.Search onSearch={setUsername} style={{ width: 150, margin: '0 8px' }} placeholder="创建者" />
          <DatePicker.RangePicker
            value={[startDate, endDate]}
            onChange={(value) => {
              setEndDate(value[1]);
              setStartDate(value[0]);
            }}
            style={{ width: 240 }}
          />
        </Collapse.Panel>
      </Collapse>
      <Button icon="check-circle" type="primary" onClick={enableHandle}>
        批量启用
      </Button>
      <Button style={{ margin: 8 }} icon="close-circle" onClick={disenableHandle}>
        批量禁用
      </Button>
      <Button icon="delete" onClick={deleteIds}>
        批量删除
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        rowKey="id"
        pagination={false}
        rowSelection={rowSelection}
      />
      <Pagination
        current={page}
        total={total}
        onChange={setPage}
        pageSize={pageSize}
        style={{ marginTop: 10, float: 'right' }}
      />
      <InsertAndUpdateView
        visible={visible}
        editRow={editRow}
        modalType={modalType}
        submitOk={submitOk}
        product={product}
      />
      <Modal
        visible={moreVisible}
        onCancel={() => setMoreVisible(false)}
        onOk={() => setMoreVisible(false)}
        title="更多"
      >
        <Table
          dataSource={moreData}
          columns={[
            { dataIndex: 'country', title: '地区' },
            { dataIndex: 'platform', title: '平台' },
            {
              dataIndex: 'rate',
              title: '趋势',
              render: (text, row) => (
                <div>
                  <span style={{ color: text >= 0 ? 'green' : 'red' }}>
                    <Icon type={text >= 0 ? 'arrow-up' : 'arrow-down'} />
                    {text}%
                  </span>
                  <div>{DAT_TYPE[row.time_type]}</div>
                </div>
              ),
            },
          ]}
          bordered
          rowKey={row => `${row.country}-${row.platform}`}
        />
      </Modal>
    </div>
  );
};
