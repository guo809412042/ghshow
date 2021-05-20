import React, { useState, useEffect } from 'react';
import {
  DatePicker, Select, Table,
} from 'antd';
import moment from 'moment';
import DetailView from './DetailView';
import { getData } from '../../../../utils/request';
import { listSQL } from './sqlTemplate';
import { createSqlWhere } from '../../../../utils/utils';
import { DownLoadButton } from '../../../common/DownLoadButton';

const { Option } = Select;

export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(31, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [order, setOrder] = useState('play_count');
  const [dataSource, setDataSource] = useState([]);
  const [tag, setTag] = useState('');
  const getFetchData = async () => {
    const res = await getData(createSqlWhere({
      sql: listSQL,
      startDate,
      endDate,
      order,
    }));
    setDataSource(res);
  };
  const columns = [{
    title: '活动',
    dataIndex: 'tag',
  }, {
    title: '播放总数',
    dataIndex: 'play_count',
  }, {
    title: '发布总数',
    dataIndex: 'publish_count',
  }, {
    title: '评论总数',
    dataIndex: 'comment_count',
  }, {
    title: '站外播放总数',
    dataIndex: 'play_out',
  }, {
    title: '站内播放总数',
    dataIndex: 'play_in',
  }, {
    title: '喜欢总数',
    dataIndex: 'like_count',
  }, {
    title: '转发总数',
    dataIndex: 'forward_count',
  }, {
    title: '下载次数',
    dataIndex: 'video_download_count',
  }, {
    title: '视频列表',
    render: (text, row) => <DetailView
      row={row}
      startDate={startDate}
      endDate={endDate}
    />,
  }];
  useEffect(() => {
    getFetchData();
  }, [startDate, endDate, order, tag]);
  const tagChildren = [<Option key="" value="">全部</Option>];
  for (const item of dataSource) {
    tagChildren.push(<Option key={item.tag} value={item.tag}>{item.tag}</Option>);
  }

  return <div>
    <DownLoadButton
      columns={columns.map(v => ({
        ...v,
        key: v.dataIndex,
      }))}
      data={dataSource}
      filename="hashTag详情"
    />
    <DatePicker.RangePicker
      value={[startDate, endDate]}
      onChange={(value) => {
        setStartDate(value[0]);
        setEndDate(value[1]);
      }}
    />
    <Select
      style={{ width: 200, margin: '0 10px' }}
      defaultValue={order}
      onChange={setOrder}
    >
      <Option value="play_count">播放总数</Option>
      <Option value="publish_count">发布总数</Option>
      <Option value="comment_count">评论总数</Option>
      <Option value="play_out">站外播放总数</Option>
      <Option value="play_in">站内播放总数</Option>
      <Option value="like_count">喜欢总数</Option>
      <Option value="forward_count">转发总数</Option>
      <Option value="video_download_count">下载次数</Option>
    </Select>
    <Select showSearch
      style={{ width: 150 }}
      placeholder="请选择活动"
      optionFilterProp="children"
      notFoundContent="无法找到"
      defaultValue="全部"
      onChange={setTag}
    >
      {tagChildren}
    </Select>
    <Table
      columns={columns}
      dataSource={tag ? dataSource.filter(v => v.tag === tag) : dataSource}
      style={{ marginTop: 20 }}
    />
  </div>;
};
