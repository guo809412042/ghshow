import React, { useState, useEffect } from 'react';
import {
  DatePicker, Collapse, Select, Table,
} from 'antd';
import moment from 'moment';
import { getAppNameData, getDetailData } from '../service';
import { DownLoadButton } from '../../../../common/DownLoadButton';

export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(0, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(0, 'days'));
  const [appname, setAppname] = useState([]);
  const [selectAppname, setSelectAppname] = useState(undefined);
  const [selectAddTemplate, setSelectAddTemplate] = useState(undefined);
  const [selectCountry, setSelectCountry] = useState();
  const [data, setData] = useState([]);
  const columns = [
    { dataIndex: 'template_hot_index', key: 'template_hot_index', title: 'Template rank' },
    { dataIndex: 'appname', key: 'appname', title: 'appname' },
    { dataIndex: 'category', key: 'category', title: 'category' },
    {
      dataIndex: 'category_icon',
      key: 'category_icon',
      title: 'category_icon',
      render: text => (text !== 'NULL' && text ? <img src={text} alt={text} width={100} style={{ backgroundColor: 'black' }}/> : ''),
    },
    { dataIndex: 'template_name', key: 'template_name', title: 'template_name' },
    {
      dataIndex: 'template_cover',
      key: 'template_cover',
      title: 'template_cover',
      render: text => (text !== 'NULL' && text ? <img src={text} alt={text} width={100} style={{ backgroundColor: 'black' }} /> : ''),
    },
    {
      dataIndex: 'template_preview_video',
      key: 'template_preview_video',
      title: 'template_preview_video',
      render: text => (text !== 'NULL' && text ? <video src={text} controls width={150} style={{ backgroundColor: 'black' }}/> : ''),
    },
    { dataIndex: 'added_template', key: 'added_template', title: 'added_template' },
  ];
  const getApppname = async () => {
    const res = await getAppNameData();
    setAppname(res);
  };
  const getList = async () => {
    const res = await getDetailData({
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      appname: selectAppname,
      added_template: selectAddTemplate,
      is_in: selectCountry,
    });
    setData(res);
  };
  useEffect(() => {
    getApppname();
  }, []);
  useEffect(() => {
    getList();
  }, [startDate, endDate, selectAddTemplate, selectAppname, selectCountry]);
  return <div>
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel
        header="查询"
        key="1"
      >
        <span>APP name：</span>
        <Select
          style={{ width: 120, margin: '0 8px' }}
          value={selectAppname}
          onChange={setSelectAppname}
          allowClear
        >
          {appname.filter(i => i.appname !== 'Vfly').map(v => <Select.Option key={v.appname} value={v.appname}>{v.appname}</Select.Option>)}
        </Select>
        <span>Added template：</span>
        <Select
          style={{ width: 150, margin: '0 8px' }}
          value={selectAddTemplate}
          onChange={setSelectAddTemplate}
          allowClear
        >
          <Select.Option key="Y" value="Y">Y</Select.Option>
          <Select.Option key="N" value="N">N</Select.Option>
        </Select>
        <span>country：</span>
        <Select
          style={{ width: 150, margin: '0 8px' }}
          value={selectCountry}
          onChange={setSelectCountry}
          allowClear
        >
          <Select.Option value="Y">IN</Select.Option>
          <Select.Option value="N">Others</Select.Option>
        </Select>
        <span>Time：</span>
        <DatePicker.RangePicker
          value={[startDate, endDate]}
          onChange={
            (value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }
          }
        />
      </Collapse.Panel>
    </Collapse>
    <DownLoadButton
      filename="明细"
      data={data}
      columns={columns}
    />
    <Table
      bordered
      dataSource={data}
      columns={columns}
    />
  </div>;
};
