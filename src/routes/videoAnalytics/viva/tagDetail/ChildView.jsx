import React, { useState, useEffect } from 'react';
import {
  Button, Table, Modal, DatePicker, Select,
} from 'antd';
import { getData } from '../../../../utils/request';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { childrenListSQL } from './sqlTemplate';
import { DownLoadButton } from '../../../common/DownLoadButton';
import DetailView from './DetailView';

const { Option } = Select;
export default ({ row, search }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState('play_count_all');
  const columns = [{
    title: '标签名',
    dataIndex: 'child_name',
  },
  // {
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
    render: (text, rows) => <DetailView
      row={rows}
      search={{ startDate, endDate, parent_id: row.parent_id }}
    />,
  }];
  const getFetchData = async () => {
    const res = await getData(createSqlWhere({
      sql: childrenListSQL,
      startDate,
      endDate,
      type: row.parent_id,
      order,
    }));
    const dataSource = res.map(v => ({
      ...v,
      ptr: getNumber(v.play_hot_uv, v.exposure_uv),
      duid_avg: getNumber(v.playin_total, v.duid_total, false),
    }));
    setDataSource(dataSource);
  };
  useEffect(() => {
    setStartDate(search.startDate);
    setEndDate(search.endDate);
  }, [search]);
  useEffect(() => {
    if (modalVisible) {
      getFetchData();
    }
  }, [row, startDate, endDate, modalVisible]);
  return <div>
    <Button type="primary" onClick={() => setModalVisible(true)}>详情</Button>
    <Modal
      title="标签列表"
      width={1100}
      visible={modalVisible}
      onOk={() => setModalVisible(false)}
      onCancel={() => setModalVisible(false)}
    >
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
        onChange={setOrder}
      >
        <Option value="play_count_all">播放总数</Option>
        <Option value="like_count">点赞总数</Option>
        <Option value="forward_count">转发总数</Option>
        <Option value="comment_count">评论总数</Option>
        <Option value="play_in">站内播放</Option>
        <Option value="play_out">站外播放</Option>
        <Option value="video_download_count">下载次数</Option>
      </Select>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="puiddigest"
      />
    </Modal>
  </div>;
};
