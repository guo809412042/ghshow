/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Table } from 'antd';
import moment from 'moment';
import { listSQL } from './sqlTemplate';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';
import ChildView from './ChildView';

const { Option } = Select;
export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(31, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [order, setOrder] = useState('playin_total');
  const [dataSource, setDataSource] = useState([]);
  const [tag, setTag] = useState('');
  const getFetchData = async () => {
    const res = await getData(createSqlWhere({
      sql: listSQL,
      startDate,
      endDate,
      order,
    }));
    const data = res.map((item, index) => ({
      ...item,
      key: index,
      duid_avg: getNumber(item.playin_total, item.duid_total, false),
      ptr: `${getNumber(item.play_exposure, item.exposure_total)}%`,
    }));
    setDataSource(data);
  };
  const columns = [{
    title: '标签名',
    dataIndex: 'parent_name',
  },
  //  {
  //   title: intl.get('user.Crawl_Video')
  //     .d('是否为爬取视频'),
  //   dataIndex: 'is_spider',
  // },
  {
    title: '热门播放',
    dataIndex: 'playin_total',
  }, {
    title: '设备总数',
    dataIndex: 'duid_total',
  }, {
    title: '点赞总数',
    dataIndex: 'like_count',
  }, {
    title: '站内播放',
    dataIndex: 'playin_all',
  }, {
    title: '总播放',
    dataIndex: 'play_count_all',
  }, {
    title: '站外播放',
    dataIndex: 'play_out',
  }, {
    title: '总视频数',
    dataIndex: 'puid_total_all',
  }, {
    title: '热门视频数',
    dataIndex: 'puid_total',
  }, {
    title: '转发总数',
    dataIndex: 'forward_count',
  }, {
    title: '评论总数',
    dataIndex: 'comment_count',
  }, {
    title: '人均播放数',
    dataIndex: 'duid_avg',
  }, {
    title: '下载次数',
    dataIndex: 'video_download_count',
  }, {
    title: 'ptr',
    dataIndex: 'ptr',
  }, {
    title: '操作',
    dataIndex: 'handle',
    render: (text, row) => <ChildView
      row={row}
      search={{ startDate, endDate }}
    />,
  }];

  useEffect(() => {
    getFetchData();
  }, [startDate, endDate, order, tag]);
  const tagChildren = [<Option key="" value="">全部</Option>];
  for (const item of dataSource) {
    tagChildren.push(<Option key={item.parent_name} value={item.parent_name}>{item.parent_name}</Option>);
  }
  return <div>
    <DownLoadButton
      columns={columns.map(v => ({
        ...v,
        key: v.dataIndex,
      }))}
      data={dataSource}
      filename="标签详情"
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
      onChange={value => setOrder(value)}
    >
      <Select.Option value="playin_total">热门播放</Select.Option>
      <Select.Option value="duid_total">设备总数</Select.Option>
      <Select.Option value="like_count">点赞总数</Select.Option>
      <Select.Option value="puid_total">热门视频数</Select.Option>
      <Select.Option value="forward_count">转发总数</Select.Option>
      <Select.Option value="comment_count">评论总数</Select.Option>
      <Select.Option value="playin_all">站内播放</Select.Option>
      <Select.Option value="play_count_all">总播放</Select.Option>
      <Select.Option value="play_out">站外播放</Select.Option>
      <Select.Option value="puid_total_all">总视频数</Select.Option>
      <Select.Option value="video_download_count">下载次数</Select.Option>
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
      dataSource={tag ? dataSource.filter(v => v.parent_name === tag) : dataSource}
      style={{ marginTop: 20 }}
    />
  </div>;
};
