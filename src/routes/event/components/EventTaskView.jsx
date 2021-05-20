import React, { useState, useEffect } from 'react';
import { Select, Radio, Table } from 'antd';
import moment from 'moment';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';
import QueryIndex from './QueryIndex';
import { DownLoadButton } from '../../common/DownLoadButton';
import { getHoloData, getGHData, getData } from '../../../utils/request';
import { eventSQL, eventNameSQL, eventSQLWeb } from '../sqlTemplate';
import { createSqlWhere } from '../../../utils/utils';
import EventChartView from './EventChartView';
import EventKeyTable from './EventKeyTable';
import ClickCountView from '../../components/ClickCount/ClickCountView';

const EventView = ({
  eventIdList,
  ghPlatform,
  title,
  eventNameCN = false,
  database,
  noIOS = false,
  noAuidTotal = false,
  noUser = false,
  keyDatabase,
  appVersionApi = false,
  productName = 'product',
  noChannel = false,
  channelName = '渠道',
  defaultProduct = '1',
  selectAppVersion,
}) => {
  const [startDate, setStartDate] = useState(moment().subtract(31, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [userTape, setUserType] = useState('');
  const [product, setProduct] = useState(defaultProduct);
  const [dataSource, setDataSource] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [EventNamesJson, setEventNamesJson] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectEventName, setSelectEventName] = useState('');
  const [searchWhere, setSearchWhere] = useState(` and event_name in ('${eventIdList.join(`','`)}')`);

  const columns = [
    {
      title: '事件名称',
      dataIndex: 'event_name',
      render: text => (
        <div
          style={{
            width: 399,
            overflow: 'hidden',
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: '事件总数',
      dataIndex: 'total',
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: '会话数',
      dataIndex: 'session_total',
      sorter: (a, b) => a.session_total - b.session_total,
    },
    {
      title: '设备数',
      dataIndex: 'duid_total',
      sorter: (a, b) => a.duid_total - b.duid_total,
    },
    {
      title: '账号数',
      dataIndex: 'auid_total',
      sorter: (a, b) => a.auid_total - b.auid_total,
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span>
          <EventChartView
            record={record}
            database={database}
            noAuidTotal={noAuidTotal}
            noIOS={noIOS}
            noUser={noUser}
            ghPlatform={ghPlatform}
            productName={productName}
            search={{
              product,
              userTape,
              searchWhere,
              startDate,
              endDate,
            }}
          />
          <EventKeyTable
            record={record}
            database={keyDatabase}
            noAuidTotal={noAuidTotal}
            noIOS={noIOS}
            ghPlatform={ghPlatform}
            productName={productName}
            noUser={noUser}
            search={{
              product,
              userTape,
              searchWhere,
              startDate,
              endDate,
            }}
          />
        </span>
      ),
    },
  ];
  if (eventNameCN && product !== '3') {
    columns.splice(1, 0, {
      title: '事件中文名称',
      dataIndex: 'event_name_CN',
    });
  }
  if (noAuidTotal) {
    columns.splice(4, 1);
  }
  if (product === '3' && ghPlatform === '2') {
    columns.splice(2, 3);
  } else if (product === '3' && ghPlatform !== '2') {
    columns.splice(2, 2);
  }
  // 获取表格数据
  const getFetchData = async () => {
    setLoading(true);
    let sql = createSqlWhere({
      sql: product === '3' ? eventSQLWeb : eventSQL,
      startDate,
      endDate,
      database: product === '3' ? 'ads_pub_log_h5_event_count' : database,
      product: ` and ${product === '3' ? 'productid' : productName} = '${product === '3' ? ghPlatform : product}'`,
      type: noUser ? '' : userTape,
      where: searchWhere,
    });
    console.log(sql)
    console.log(searchWhere)
    sql = sql.replace(/#auid#/, noAuidTotal ? '' : ',sum(auid_total) as auid_total');
    const res = product === '3' ? await getData(sql) : await getHoloData(sql);
    const dataSource = res.map(v => ({
      ...v,
      event_name_CN: EventNamesJson[v.event_name],
    }));
    setDataSource(dataSource);
    setLoading(false);
  };
  // 获取事件列表
  const getEventName = async () => {
    // 获取中文名称
    const res = await getGHData(eventNameSQL);
    const EventNamesJson = {};
    res.forEach((v) => {
      EventNamesJson[v.event_name] = v.event_name_CN;
    });
    setEventNamesJson(EventNamesJson);
    let sql = `select 
    DISTINCT(event_name) 
    from ${database} 
    where 1=1 ${` and ${productName} = '${product}'`}
    order by event_name  
    `;
    if (product === '3') {
      sql = `select 
    DISTINCT(event_name) 
    from ads_pub_log_h5_event_key_count 
    where productid = ${ghPlatform}
    order by event_name  
    `;
    }
    const res1 = product === '3' ? await getData(sql) : await getHoloData(sql);
    const events = [];
    for (const i of res1) {
      if (!events.includes(i.event_name)) {
        events.push(i.event_name);
      }
    }
    const json = events.map(v => ({
      event: v,
      name: EventNamesJson[v] || '',
    }));
    setEventList(json);
  };

  const exportColumns = columns.map(v => ({
    ...v,
    key: v.dataIndex,
  }));

  useEffect(() => {
    getEventName();
  }, [product, ghPlatform]);
  useEffect(() => {
    if (Object.keys(EventNamesJson).length) {
      getFetchData();
    }
  }, [EventNamesJson, product, userTape, startDate, endDate, searchWhere, ghPlatform]);

  const onSearch = (values) => {
    setStartDate(values.startDate);
    setEndDate(values.endDate);
    let where = '';
    if (values.selectAppVersion && values.appVersionOperation) {
      where += ` and app_version ${values.appVersionOperation} '${values.selectAppVersion}'`;
    }
    if (values.channelOperation && values.selectChannel) {
      where += ` and channel  ${values.channelOperation} '${values.selectChannel}'`;
    }
    if (values.countryOperation && values.selectCountry) {
      where += ` and country ${values.countryOperation} ${values.selectCountry}`;
    }
    setSearchWhere(where);
  };
  return (
    <div>
      {/* <BreadcrumbMenu /> */}
      {/* <ClickCountView startDate={startDate} endDate={endDate} product={ghPlatform} remark={selectEventName} /> */}
      {/* <QueryIndex
        product={product}
        ghPlatform={ghPlatform}
        onSearch={onSearch}
        database={database}
        noIOS={noIOS}
        appVersionApi={appVersionApi}
        productName={productName}
        noChannel={noChannel}
        channelName={channelName}
        selectAppVersion={selectAppVersion}
      /> */}
      {/* <div style={{ marginTop: 20 }}>
        <DownLoadButton filename={title} data={dataSource} columns={exportColumns} />
        <Select style={{ width: 200 }} value={product} onChange={value => setProduct(value)}>
          <Select.Option key="1" value="1">
            Android
          </Select.Option>
          {noIOS ? (
            ''
          ) : (
            <Select.Option key="2" value="2">
              iOS
            </Select.Option>
          )}
          <Select.Option key="3" value="3">
            H5
          </Select.Option>
        </Select>
        {noUser || product === '3' ? (
          ''
        ) : (
          <Radio.Group style={{ marginLeft: 16 }} onChange={value => setUserType(value.target.value)} value={userTape}>
            <Radio.Button value="" key="">
              所有用户
            </Radio.Button>
            <Radio.Button value="and new_user = 1" key="and new_user = 1">
              新用户
            </Radio.Button>
            <Radio.Button value="and new_user <> 1" key="and new_user <> 1">
              老用户
            </Radio.Button>
          </Radio.Group>
        )}
        <div
          style={{
            float: 'right',
            marginRight: 16,
          }}
        >
          <Select
            showSearch
            allowClear
            style={{ width: 400 }}
            placeholder="事件查询"
            optionFilterProp="children"
            filterOption={(inputValue, option) => option.key.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
            }
            onChange={v => setSelectEventName(v)}
          >
            {eventList.map(v => (
              <Select.Option key={v.name ? `${v.event}/${v.name}` : v.event} value={v.event}>
                {v.name ? `${v.event}/${v.name}` : v.event}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div> */}
      <Table
        bordered
        columns={columns}
        dataSource={selectEventName ? dataSource.filter(v => v.event_name === selectEventName) : dataSource}
        style={{ marginTop: 20 }}
        rowKey="event_name"
        loading={loading}
      />
    </div>
  );
};

export default EventView;
