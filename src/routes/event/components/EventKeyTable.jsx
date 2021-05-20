/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Button, Modal, Table, Select, DatePicker, Spin,
} from 'antd';
import moment from 'moment';
import { createSqlWhere } from '../../../utils/utils';
import {
  eventKeySQL, eventKeyDaySQL, eventKeyDaySQLWeb, eventKeySQLWeb,
} from '../sqlTemplate';
import { DownLoadButton } from '../../common/DownLoadButton';
import { getHoloData, getData } from '../../../utils/request';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';
import { removeChartNode } from '../../attributeActive/chartRender';

const EventChartView = ({
  record, search, database, noIOS, noUser, productName = 'product', ghPlatform,
}) => {
  const { product } = search;
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [visible, setVisible] = useState(false);
  const [selectKeyName, setSelectKeyName] = useState(false);
  const [keyNamesList, setKeyNamesList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [selectParamValue, setSelectParamValue] = useState('');
  const [chartVisible, setChartVisible] = useState(false);
  const [exportColumns, setExportColumns] = useState([]);
  const [queryParam, setQueryParam] = useState('');
  const columns = [
    {
      title: '参数值',
      dataIndex: 'param_value',
      width: 500,
      render: text => <span style={{ wordBreak: 'break-word' }}>{text}</span>,
    },
    {
      title: '占比',
      dataIndex: 'rate',
      onCell: record => ({
        onClick: () => {
          if (product === '3') {
            return false;
          }
          setSelectParamValue(record.param_value.replace('\'', '\'\''));
          setChartVisible(true);
        },
      }),
    },
    {
      title: '事件总数',
      dataIndex: 'total',
      sorter: (a, b) => a.total - b.total,
      onCell: record => ({
        onClick: () => {
          if (product === '3') {
            return false;
          }
          setSelectParamValue(record.param_value.replace('\'', '\'\''));
          setChartVisible(true);
        },
      }),
    },
    {
      title: '会话数',
      dataIndex: 'session_total',
      sorter: (a, b) => a.session_total - b.session_total,
      onCell: record => ({
        onClick: () => {
          if (product === '3') {
            return false;
          }
          setSelectParamValue(record.param_value.replace('\'', '\'\''));
          setChartVisible(true);
        },
      }),
    },
    {
      title: '设备数',
      dataIndex: 'duid_total',
      sorter: (a, b) => a.duid_total - b.duid_total,
      onCell: record => ({
        onClick: () => {
          if (product === '3') {
            return false;
          }
          setSelectParamValue(record.param_value.replace('\'', '\'\''));
          setChartVisible(true);
        },
      }),
    },
    {
      title: '账号数',
      dataIndex: 'auid_total',
      sorter: (a, b) => a.auid_total - b.auid_total,
      onCell: record => ({
        onClick: () => {
          if (product === '3') {
            return false;
          }
          setSelectParamValue(record.param_value.replace('\'', '\'\''));
          setChartVisible(true);
        },
      }),
    },
  ];
  const getFetch = async () => {
    setLoading(true);
    let where = search.searchWhere;
    if (queryParam)where += `and param_value='${queryParam}'`;
    let sql = createSqlWhere({
      sql: product === '3' ? eventKeySQLWeb : eventKeySQL,
      database,
      type: noUser ? '' : search.userTape,
      startDate,
      endDate,
      where,
      product: `and ${product === '3' ? 'productid' : productName} = '${product === '3' ? ghPlatform : product}'`,
    });
    sql = sql.replace(/#event_name#/, record.event_name).replace(/#key_name#/, selectKeyName).replace(/#param_value#/, queryParam);
    // const res = await getHoloData(sql);
    const res = product === '3' ? await getData(sql) : await getHoloData(sql);
    let total = 0;
    res.forEach((a) => {
      total += Number(a.total);
    });
    const list = res.map(v => ({
      ...v,
      rate: `${((v.total * 100) / total).toFixed(2)}%`,
    }));
    setDataSource(list);
    setLoading(false);
  };
  const handleClick = async () => {
    // if (product === '3') {
    //   return false;
    // }
    setVisible(true);
    setSpinning(true);
    let sql = `
    SELECT DISTINCT(key_name)
  FROM ${database}
 where event_name= '${record.event_name}'
 `;
    if (product === '3') {
      sql = `
      SELECT DISTINCT(key_name)
    FROM ads_pub_log_h5_event_key_count
   where event_name= '${record.event_name}'
   `;
    }
    const res = product === '3' ? await getData(sql) : await getHoloData(sql);
    console.log('res', res);
    setKeyNamesList(res);
    setSpinning(false);
  };
  const getKeyChart = async () => {
    let sql = createSqlWhere({
      sql: eventKeyDaySQL,
      database,
      type: noUser ? '' : search.userTape,
      startDate,
      endDate,
      where: search.searchWhere,
      product: ` and ${productName} = '${search.product}'`,
    });
    sql = sql
      .replace(/#event_name#/, record.event_name)
      .replace(/#key_name#/, selectKeyName)
      .replace(/#param_value#/, selectParamValue);
    const res = await getHoloData(sql);
    setExportData(res);
    const chartData = [];
    if (res.length) {
      const KEYS = Object.keys(res[0]).filter(v => v !== 'ds');
      const column = Object.keys(res[0]).map(v => ({
        key: v,
        title: v,
      }));
      setExportColumns(column);
      for (const i of res) {
        for (const j of KEYS) {
          chartData.push({
            day: moment(i.ds.toString()).format('YYYY-MM-DD'),
            value: Number(i[j]),
            type: j,
          });
        }
      }
    }
    chartLineRender(chartData, document.getElementById('chart_event_key'));
  };
  useEffect(() => {
    if (chartVisible) {
      getKeyChart();
    }
  }, [chartVisible]);
  useEffect(() => {
    if (visible && selectKeyName) {
      getFetch();
    }
  }, [selectKeyName, visible, startDate, endDate]);
  useEffect(() => {
    setStartDate(search.startDate);
    setEndDate(search.endDate);
  }, [search]);
  return (
    <div style={{ display: 'inline-block' }}>
      <Button style={{ margin: '0px 8px' }} type="ghost" size="small" onClick={handleClick}>
        事件参数情况
      </Button>
      <Modal
        title={record.event_name}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        visible={visible}
        width={1000}
      >
        <Spin spinning={spinning}>
          <DownLoadButton
            filename={record.event_name}
            data={dataSource.map(v => ({
              ...v,
              param_value: v.param_value.replace(/,/g, '||'),
            }))}
            columns={columns.map(v => ({
              ...v,
              key: v.dataIndex,
            }))}
          />
          <DatePicker.RangePicker
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
            }}
          />
          <Select
            placeholder="选择事件参数值"
            style={{ width: 200, marginLeft: 10 }}
            onChange={(v) => { setSelectKeyName(v); setQueryParam(''); }}
          >
            {keyNamesList.map(v => (
              <Select.Option key={v.key_name} value={v.key_name}>
                {v.key_name}
              </Select.Option>
            ))}
          </Select>
          <Select
            showSearch
            placeholder="参数值查询"
            style={{ width: 200, marginLeft: 10 }}
            onChange={v => setQueryParam(v)}
            optionFilterProp="children"
            allowClear
            value={queryParam}
          >
            {dataSource.map(v => (
              <Select.Option key={v.param_value} value={v.param_value}>
                {v.param_value}
              </Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={() => { getFetch(); }}>查询</Button>
        </Spin>
        <Table
          bordered
          style={{ marginTop: 20 }}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="param_value"
        />
      </Modal>
      <Modal
        title={selectParamValue}
        visible={chartVisible}
        onCancel={() => {
          removeChartNode('chart_event_key');
          setChartVisible(false);
        }}
        onOk={() => {
          removeChartNode('chart_event_key');
          setChartVisible(false);
        }}
        width={1000}
      >
        <DownLoadButton filename={record.event_name} data={exportData} columns={exportColumns} />
        <div id="chart_event_key" />
      </Modal>
    </div>
  );
};

export default EventChartView;
