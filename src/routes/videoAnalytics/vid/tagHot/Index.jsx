import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Select, Table } from 'antd';
import _ from 'lodash';
import { BreadcrumbMenu } from '../../../common/BreadcrumbMenu';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { columns } from './constant';
import { createSqlWhere } from '../../../../utils/utils';
import { tagVideoEveryDaySql, tagNamesSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import ModalView from './ModalView';

const { Option } = Select;
const Index = () => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [exportData, setExportData] = useState([]);
  const [order, setOrder] = useState('tag_puid_all_total');
  const [loading, setLoading] = useState(false);
  const [tagNames, setTagNames] = useState([]);
  const [type, setType] = useState('');
  const getFetch = async () => {
    setLoading(true);
    const where = '';
    const sql = createSqlWhere({
      sql: tagVideoEveryDaySql,
      startDate,
      endDate,
      order,
      where,
      type: type ? ` and tag_name ='${type}'` : '',
    });
    const res = await getData(sql);
    const dataSource = res.map((item, index) => ({
      ...item,
      key: index,
      'tag_puid_all_total*100/puid_all_total': `${(item.tag_puid_all_total * 100 / item.puid_all_total).toFixed(2)}%`,
      'tag_puid_total*100／puid_total': item.puid_total ? `${(item.tag_puid_total * 100 / item.puid_total).toFixed(2)}%` : '0',
      'play_count／play_3s_uv': `${(item.play_count / item.play_3s_uv).toFixed(2)}`,
      'exposure_count／exposure_uv': `${(item.exposure_count / item.exposure_uv).toFixed(2)}`,
      'pass_cnt*100／pop_cnt': `${(item.pass_cnt * 100 / item.pop_cnt).toFixed(2)}%`,
    }));
    setExportData(dataSource);
    setLoading(false);
  };
  const getTagNames = async () => {
    const res = await getData(tagNamesSQL);
    setTagNames(res);
  };
  useEffect(() => {
    getFetch();
  }, [startDate, endDate, order, type]);
  useEffect(() => {
    getTagNames();
  }, []);
  const exportColumns = _.clone(columns).map(v => ({
    ...v,
    key: v.dataIndex,
  }));
  const dataColumns = _.clone(exportColumns);
  dataColumns.push({
    dataIndex: 'action',
    title: '操作',
    render: (text, row) => <ModalView
      row={row}
    />,
  });
  return <div>
    <BreadcrumbMenu />
    <DownLoadButton filename="热门视频质量统计" data={exportData} columns={exportColumns} />
    <DatePicker.RangePicker
      value={[startDate, endDate]}
      onChange={(value) => {
        setEndDate(value[1]);
        setStartDate(value[0]);
      }}
    />
    <Select
      style={{ width: 200, margin: '0 10px' }}
      defaultValue={order}
      onChange={value => setOrder(value)}
    >
      <Option value="tag_puid_all_total">总视频数</Option>
      <Option value="tag_puid_total">新增视频数</Option>
      <Option value="exposure_puid_total">曝光视频数</Option>
      <Option value="exposure_count">总曝光</Option>
      <Option value="play_count">总播放</Option>
      <Option value="download_count">下载</Option>
      <Option value="like_count">点赞</Option>
      <Option value="forward_count">转发总数</Option>
    </Select>
    <Select
      showSearch
      style={{ width: 150 }}
      placeholder="请选择标签"
      optionFilterProp="children"
      filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
      notFoundContent="无法找到"
      value={type}
      onChange={value => setType(value)}
    >
      <Option key="__all__" value="">全部</Option>
      {
        tagNames.map(item => <Option key={item.tag_name} value={item.tag_name}>{item.tag_name}</Option>)
      }
    </Select>
    <Table
      dataSource={exportData}
      columns={dataColumns}
      bordered
      scroll={{ x: 2600 }}
      style={{ marginTop: 20 }}
      loading={loading}
    />
  </div>;
};

export default Index;
