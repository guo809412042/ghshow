/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import {
  Card, Select, DatePicker, Input, Button, Tabs, Table, Spin, Icon, Modal, message,
} from 'antd';
import moment from 'moment';
import { getData } from '../../../../utils/request';
import { countryNameSQL } from './sqlTemplate';
import { PLAFORM_LIST } from '../../../../utils/const';
import exportParams from '../../../../utils/exportExecl';
import {
  taskMonitorService, failMonitorService, consumeTimeService, getTemplateStore,
} from '../service';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';
import { getFixed } from '../../../../utils/utils';

const { Column, ColumnGroup } = Table;
export default ({ productId }) => {
  const [countryList, setCountryList] = useState([]);
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(0, 'days'),
  });
  const [visible, setVisible] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [detailDataSource, setDetailDataSource] = useState([]);
  const [currentTemplateCode, setCurrentTemplateCode] = useState(undefined);
  const [templateCodeDataSource, setTemplateCodeDataSource] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLaoding, setDetailLoading] = useState(false);

  const [consumeTimeDataSource, setConsumeTimeDataSource] = useState([]);
  const [consumeTimeLoading, setConsumeTimeLoading] = useState(false);
  const getCountryCode = async () => {
    const res = await getData(countryNameSQL);
    setCountryList(res);
  };
  const getSearchValue = () => {
    const body = {
      productId: productId * 1,
      platform: search.platform || 0,
      startTime: moment(`${moment(search.startDate).format('YYYY-MM-DD')} 00:00:00`).valueOf(),
      endTime: moment(`${moment(search.endDate).format('YYYY-MM-DD')} 23:59:59`).valueOf(),
    };
    if (search.ttid) {
      body.templateCode = search.ttid;
    }
    if (search.country) {
      body.country = search.country;
    }
    return body;
  };
  const getChartData = async () => {
    setChartLoading(true);
    const body = {
      ...getSearchValue(),
      fileType: 0,
      zone: 'all',
      state: 0,
      groupType: 1,
    };
    const res = await taskMonitorService(body);
    const data = [];
    for (const i of res.data) {
      data.push({
        type: '总数',
        value: i.makeTotal,
        day: i.groupKey,
      });
      data.push({
        type: '失败数',
        value: i.failTotal,
        day: i.groupKey,
      });
      data.push({
        type: '成功数',
        value: i.successTotal,
        day: i.groupKey,
      });
    }
    chartLineRender(data, document.getElementById('chart-colud'), 200);
    setChartData(data);
    setChartLoading(false);
  };
  const getFailData = async () => {
    setLoading(true);
    const body = {
      ...getSearchValue(),
      fileType: 0,
      state: 2,
      zone: 'all',
    };
    const res = await failMonitorService(body);
    console.log('res', res);
    setDataSource(res.data);
    setLoading(false);
  };
  const getDetailData = async () => {
    setDetailLoading(true);
    const body = {
      ...getSearchValue(),
      fileType: 0,
      zone: 'all',
      state: 0,
      groupType: 2,
    };
    const res = await taskMonitorService(body);
    setDetailDataSource(
      res.data.map(v => ({
        ...v,
        failRatio: getFixed(v.failRatio * 100, 2),
      })),
    );
    setDetailLoading(false);
  };

  const getConsumeTimeData = async () => {
    setConsumeTimeLoading(true);
    const { data } = await consumeTimeService({
      ...getSearchValue(),
      fileType: 0,
      zone: 'all',
      state: 0,
      groupType: search.ttid ? 1 : 2,
    });
    setConsumeTimeDataSource(data.map(v => ({
      ...v,
      avgTime: Number(getFixed(v.avgTime)),
    })));
    setConsumeTimeLoading(false);
  };
  const handleSearch = () => {
    if (activeKey === '1') {
      getChartData();
      getFailData();
    } else if (activeKey === '2') {
      getDetailData();
    } else {
      getConsumeTimeData();
    }
  };
  const clickTemplateCode = async (row) => {
    setDetailLoading(true);
    setCurrentTemplateCode(row.groupKey);
    const body = {
      ...getSearchValue(),
      fileType: 0,
      zone: 'all',
      state: 2,
      templateCode: row.groupKey,
    };
    const res = await failMonitorService(body);
    setTemplateCodeDataSource(res.data);
    setVisible(true);
    setDetailLoading(false);
  };
  const columns = [
    { dataIndex: 'errorCode', key: 'errorCode', title: '错误码' },
    {
      dataIndex: 'count',
      key: 'count',
      title: '次数',
      sorter: (a, b) => a.count - b.count,
    },
    { dataIndex: 'failReason', key: 'failReason', title: '失败原因' },
  ];
  const handleDownLoad = () => {
    if (activeKey === '1') {
      exportParams({
        filename: '云端模板任务-图表',
        columns: [{ key: 'day', title: 'day' }, { key: 'value', title: 'value' }, { key: 'type', title: 'type' }],
        data: chartData,
      });
      exportParams({
        filename: '云端模板任务-失败任务',
        columns,
        data: dataSource,
      });
    } else if (activeKey === '2') {
      exportParams({
        filename: '云端模板任务-任务详情',
        columns: [
          { dataIndex: 'groupKey', key: 'groupKey', title: '模板ID' },
          { dataIndex: 'makeTotal', key: 'makeTotal', title: '任务总数' },
          { dataIndex: 'successTotal', key: 'successTotal', title: '成功数' },
          { dataIndex: 'failTotal', key: 'failTotal', title: '失败数' },
          { dataIndex: 'failRatio', key: 'failRatio', title: '失败率' },
        ],
        data: detailDataSource,
      });
    } else {
      exportParams({
        filename: '云端模板任务-任务耗时',
        columns: [
          { dataIndex: 'groupKey', key: 'groupKey', title: search.ttid ? '时间' : '模板ID' },
          { dataIndex: 'makeCount', key: 'makeCount', title: '成功总数' },
          { dataIndex: 'avgTime', key: 'avgTime', title: '合成时间-平均耗时' },
          { dataIndex: 'maxTime', key: 'maxTime', title: '合成时间-最大耗时' },
          { dataIndex: 'minTime', key: 'minTime', title: '合成时间-最小耗时' },
        ],
        data: consumeTimeDataSource,
      });
    }
  };

  const getTemplateByTtid = async (ttid) => {
    const res = await getTemplateStore(ttid);
    const { count, dataList } = res;
    if (!count) return message.error('未找到相关预览视频');
    window.open(dataList[0].previewurl);
  };
  useEffect(() => {
    getCountryCode();
  }, [productId]);

  useEffect(() => {
    handleSearch();
  }, [search, activeKey, productId]);
  return (
    <div style={{ marginTop: 20 }}>
      <Card title="云端模板任务">
        <Select
          allowClear
          showSearch
          style={{ width: 150 }}
          placeholder="地区"
          value={search.country}
          onChange={e => setSearch({
            ...search,
            country: e,
          })
          }
          filterOption={(inputValue, option) => option.key.includes(inputValue)}
        >
          {countryList.map(v => (
            <Select.Option key={v.country_name} value={v.country_code}>
              {v.country_name}
            </Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          showSearch
          style={{ width: 150, margin: '0 10px' }}
          placeholder="平台"
          value={search.platform}
          onChange={e => setSearch({
            ...search,
            platform: e,
          })
          }
        >
          {Object.keys(PLAFORM_LIST).map(v => (
            <Select.Option key={v} value={v}>
              {PLAFORM_LIST[v]}
            </Select.Option>
          ))}
        </Select>
        <DatePicker.RangePicker
          value={[search.startDate, search.endDate]}
          onChange={values => setSearch({
            ...search,
            startDate: values[0],
            endDate: values[1],
          })
          }
          style={{ width: 220 }}
        />
        <Input.Search
          value={search.ttid}
          style={{ width: 200, margin: '0 10px' }}
          placeholder="请输入模版ID"
          onChange={e => setSearch({
            ...search,
            ttid: e.target.value,
          })
          }
        />
        <Button style={{ marginRight: 10 }} icon="cloud-download" type="primary" onClick={handleDownLoad} />
        <Tabs style={{ marginTop: 20 }} activeKey={activeKey} onChange={setActiveKey}>
          <Tabs.TabPane tab="任务趋势" key="1">
            <Spin spinning={chartLoading}>
              <div id="chart-colud" />
            </Spin>
            <Table
              dataSource={dataSource}
              columns={columns}
              rowKey="groupKey"
              bordered
              size="small"
              pagination={{
                pageSize: 20,
              }}
              loading={loading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="任务详情" key="2">
            <Table
              dataSource={detailDataSource}
              columns={[
                {
                  dataIndex: 'groupKey',
                  key: 'groupKey',
                  title: '模板ID',
                  render: groupKey => <span>{groupKey} { (productId === '6' || productId === '42') && <span style={{ color: '#3370ff', cursor: 'pointer' }} onClick={() => getTemplateByTtid(groupKey)}>link</span>}</span>,
                },
                {
                  dataIndex: 'makeTotal',
                  key: 'makeTotal',
                  title: '任务总数',
                  sorter: (a, b) => a.makeTotal - b.makeTotal,
                },
                {
                  dataIndex: 'successTotal',
                  key: 'successTotal',
                  title: '成功数',
                  sorter: (a, b) => a.successTotal - b.successTotal,
                },
                {
                  dataIndex: 'failTotal',
                  key: 'failTotal',
                  title: '失败数',
                  sorter: (a, b) => a.failTotal - b.failTotal,
                },
                {
                  dataIndex: 'failRatio',
                  key: 'failRatio',
                  title: '失败率',
                  sorter: (a, b) => a.failRatio - b.failRatio,
                  render: (text, row) => (
                    <div>
                      {text}%
                      <Icon
                        type="question-circle"
                        theme="filled"
                        style={{ marginLeft: 5 }}
                        onClick={() => clickTemplateCode(row)}
                      />
                    </div>
                  ),
                },
              ]}
              rowKey="templateCode"
              bordered
              size="small"
              pagination={{
                pageSize: 20,
              }}
              loading={detailLaoding}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="任务耗时" key="3">
            <Table
              dataSource={consumeTimeDataSource}
              loading={consumeTimeLoading}
              bordered
              rowKey="groupKey"
            >
              <Column
                title={search.ttid ? '时间' : '模版ID'}
                dataIndex="groupKey"
                key="groupKey"
                render={groupKey => <span>{groupKey} { (productId === '6' || productId === '42') && !search.ttid && <span style={{ color: '#3370ff', cursor: 'pointer' }} onClick={() => getTemplateByTtid(groupKey)}>link</span>}</span>}
              />
              <Column title="成功数量" dataIndex="makeCount" key="makeCount" sorter={(a, b) => a.makeCount - b.makeCount} />
              <ColumnGroup title="合成时间">
                <Column title="平均耗时" dataIndex="avgTime" key="avgTime"sorter={(a, b) => a.avgTime - b.avgTime} />
                <Column title="最大耗时" dataIndex="maxTime" key="maxTime" sorter={(a, b) => a.maxTime - b.maxTime} />
                <Column title="最小耗时" dataIndex="minTime" key="minTime" sorter={(a, b) => a.minTime - b.minTime} />
              </ColumnGroup>
            </Table>
          </Tabs.TabPane>
        </Tabs>
      </Card>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
        title={currentTemplateCode}
        footer={null}
        width={500}
      >
        <Table dataSource={templateCodeDataSource} columns={columns} rowKey="errorCode" bordered />
      </Modal>
    </div>
  );
};
