/*
 * @Date: 2020-05-08 10:54:02
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-03-16 16:43:03
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, Popconfirm, Button, Select, Icon, message,
} from 'antd';
import _ from 'lodash';
import Query from './components/Query';
import { query, queryCountry, detail } from './service/index';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { getData } from '../../../../utils/request';

const ButtonGroup = Button.Group;
export default ({ match }) => {
  const { params: { product } } = match;
  const useMergeState = (initialState) => {
    const [state, setState] = useState(initialState);
    const setMergedState = newState => setState(prevState => Object.assign({}, prevState, newState));
    return [state, setMergedState];
  };
  const [queryState, setQueryState] = useMergeState({
    deviceId: '',
    platform: '0',
    state: '1',
    taskId: '',
    productId: product,
    templateCode: '',
    startTime: '',
    endTime: '',
    userId: '',
    zone: 'all',
    fileType: '0',
    desc: 'true',
    pageNum: 1,
    pageSize: 10,
    clearWatermark: false,
    country: undefined,
  });
  // const { iosAppVer, azAppVer } = queryState;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [downloadDataSource, setDownloadDataSource] = useState([]);

  const getExationData = async (record) => {
    const fileIds = new Set();
    const dates = new Set();
    record.forEach((item) => {
      fileIds.add(item.fileId);
      dates.add(moment(item.finishTime).format('YYYYMMDD'));
    });
    // console.log('record', record);
    // console.log('fileIds', fileIds);

    const sql = `
      SELECT
        *
      FROM
        ads_facee_cld_pic_result_da 
      WHERE
        docid IN ( '${[...fileIds].join('\',\'')}' ) 
        AND statistics_date IN (
        '${[...dates].join('\',\'')}')
    `;

    const r = await getData(sql);

    const obj = {};
    r.forEach((i) => {
      obj[i.docid + i.statistics_date] = {
        is_shared: i.is_shared,
        is_stored: i.is_stored,
      };
    });

    return obj;
  };

  const getTableData = async () => {
    setLoading(true);
    const res = await query(queryState);

    const recordObj = await getExationData(res.data.items);

    setDataSource(
      res.data.items.map(item => ({
        ...item,
        key: item.id,
        ...recordObj[item.fileId + moment(item.finishTime).format('YYYYMMDD')],
      })),
    );
    setLoading(false);
    setHasMore(res.data.hasMore);
  };
  const getDownloadTableData = async () => {
    const res = await query({
      ...queryState,
      pageNum: 1,
      pageSize: 2000,
    });
    setDownloadDataSource(res.data.items);
  };
  const getCountry = async () => {
    const res = await queryCountry();
    // console.log('res', res);
    setCountryData(res.code ? [] : res);
    // setDownloadDataSource(res.data.items);
  };
  useEffect(() => {
    getTableData();
    getDownloadTableData();
  }, [queryState]);
  useEffect(() => {
    getCountry();
  }, []);
  const copy = (content) => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute(
      'value',
      `请求数据：${content.requestData}-----，返回数据：${content.responseData}`,
    );
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
    document.body.removeChild(input);
  };
  const refresh = async (row, index) => {
    // console.log(index);
    const res = await detail(row.id);
    const data = _.cloneDeep(dataSource);
    data[index] = res;
    setDataSource(data);
  };
  const columns = [
    { dataIndex: 'userId', title: 'Userid', key: 'userId' },
    { dataIndex: 'deviceId', title: 'Deviceid', key: 'deviceId' },
    {
      dataIndex: 'taskId', title: 'Taskid', key: 'taskId',
    },
    {
      dataIndex: 'templateCode', title: 'Templateid', key: 'templateCode',
    },
    {
      dataIndex: 'consumeTime', title: '制作耗时(ms)', key: 'consumeTime',
    },
    {
      dataIndex: 'finishTime',
      title: 'Time',
      key: 'finishTime',
      render: text => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'Picture',
      title: 'Picture',
      key: 'Picture',
      render: (_text, row) => {
        try {
          const jsonData = JSON.parse(row.uploadUrl);
          if (['6', '42'].includes(product)) {
            return jsonData?.map(x => <img src={x.url || x} style={{ maxWidth: '90px', marginBottom: '4px' }} alt="上传图片"/>);
          }
          return <img src={jsonData[0].url || jsonData[0]} width="90" alt="上传图片"/>;
        } catch (error) {
          return null;
        }
      },
    },
    {
      dataIndex: 'fileUrl',
      title: 'Template video',
      key: 'fileUrl',
      render: (text, row) => {
        if (!text) {
          return null;
        }
        if (/.mp4$/i.test(text.split('?')[0])) {
          return <video src={text} controls width="180" />;
        }

        return <img src={text} width="90" alt="结果图片"/>;
      },
    },
    {
      dataIndex: 'is_stored',
      title: 'stored',
      key: 'is_stored',
      render: text => ['no', 'yes'][text],
    },
    {
      dataIndex: 'is_shared',
      title: 'shared',
      key: 'is_shared',
      render: text => ['no', 'yes'][text],
    },
    {
      dataIndex: 'state',
      title: 'Task result',
      key: 'state',
      render: text => (text === 1 ? 'success' : 'fail'),
    },
    {
      dataIndex: 'Task record',
      title: 'Task record',
      key: 'Task record',
      render: (_text, row, index) => <div>
        <Popconfirm
          title={<div>{row.requestData}<br />
            {row.responseData}</div>}
        >
          <a>详情</a>
        </Popconfirm>
        <div style={{ marginTop: 8 }}>
          <Button size="small" onClick={() => copy(row)}>复制详情</Button>
        </div>
        <div style={{ marginTop: 8 }}>
          <Button size="small" onClick={() => refresh(row, index)}>刷新</Button>
        </div>
      </div>,
    },
  ];
  const downloadColumns = [
    { dataIndex: 'userId', title: 'Userid', key: 'userId' },
    { dataIndex: 'deviceId', title: 'Deviceid', key: 'deviceId' },
    {
      dataIndex: 'taskId', title: 'Taskid', key: 'taskId',
    },
    {
      dataIndex: 'templateCode', title: 'Templateid', key: 'templateCode',
    },
    {
      dataIndex: 'consumeTime', title: '制作耗时(ms)', key: 'consumeTime',
    },
    {
      dataIndex: 'finishTime',
      title: 'Time',
      key: 'finishTime',
      render: text => text && moment().utc(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'uploadUrl',
      title: 'Picture',
      key: 'uploadUrl',
    },
    {
      dataIndex: 'fileUrl',
      title: 'Template video',
      key: 'fileUrl',
    },
    {
      dataIndex: 'state',
      title: 'Task result',
      key: 'state',
      render: text => (text === 1 ? 'success' : 'fail'),
    },
    {
      dataIndex: 'requestData',
      title: 'requestData',
      key: 'requestData',
    },
    {
      dataIndex: 'responseData',
      title: 'responseData',
      key: 'responseData',
    },
  ];

  const pageSizeOption = [10, 20, 30];
  const { pageNum } = queryState;
  return (
    <div>
      <Query setQueryState={setQueryState} queryState={queryState} countryData={countryData}/>
      <div style={{ marginTop: 16 }}>
        <DownLoadButton filename="素材效果分析" data={downloadDataSource} columns={downloadColumns} />
      </div>
      <Table
        bordered
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
        rowKey="id"
      />
      <div style={{ marginTop: 10, float: 'right' }}>
        <ButtonGroup>
          <Button disabled={pageNum - 1 === 0} onClick={() => setQueryState({
            pageNum: pageNum - 1,
          })}>
            <Icon type="left" />
          </Button>
        &nbsp;
          <Button disabled={!hasMore} onClick={() => setQueryState({
            pageNum: pageNum + 1,
          })}>
            <Icon type="right" />
          </Button>
        </ButtonGroup>
        <Select onChange={pageSize => setQueryState({
          pageSize,
        })} defaultValue={pageSizeOption[0].toString()}>
          {pageSizeOption.map(v => (
            <Select.Option key={v.toString()} value={v.toString()}>
              {v}/页
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};
