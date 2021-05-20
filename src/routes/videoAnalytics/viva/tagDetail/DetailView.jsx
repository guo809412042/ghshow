import React, { useState, useEffect } from 'react';
import {
  Button, Table, Modal, DatePicker, Select,
} from 'antd';
import { getData } from '../../../../utils/request';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { detailSQL } from './sqlTemplate';
import { DownLoadButton } from '../../../common/DownLoadButton';

const { Option } = Select;
export default ({ row, search }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState('play_count');
  const [type, setType] = useState('');
  const columns = [{
    title: '视频标识',
    dataIndex: 'puiddigest',
    render: (text, row) => <a href={`https://xiaoying.tv/v/${text}/${row.ver}`}
      target="_blank">{text}</a>,
  }, {
    title: '是否为爬取视频',
    dataIndex: 'is_spider',
  }, {
    title: '播放总数',
    dataIndex: 'play_count',
    key: 'play_count',
  }, {
    title: '评论总数',
    dataIndex: 'comment_count',
    key: 'comment_count',
  }, {
    title: '站外播放总数',
    dataIndex: 'play_out',
    key: 'play_out',
  }, {
    title: '站内播放总数',
    dataIndex: 'play_in',
    key: 'play_in',
  }, {
    title: '点赞总数',
    dataIndex: 'like_count',
    key: 'like_count',
  }, {
    title: '转发总数',
    dataIndex: 'forward_count',
    key: 'forward_count',
  }, {
    title: '曝光总数',
    dataIndex: 'exposure_count',
  }, {
    title: '曝光人数',
    dataIndex: 'exposure_uv',
  }, {
    title: '热门模块播放人数',
    dataIndex: 'ply_hot_uv',
  }, {
    title: '下载次数',
    dataIndex: 'video_download_count',
  }, {
    title: '曝光播放占比',
    dataIndex: 'ptr',
  }];
  const getFetchData = async () => {
    let sql = createSqlWhere({
      sql: detailSQL,
      startDate,
      endDate,
      order,
      where: type ? ` and is_spider = '${type}'` : '',
    });
    sql = sql.replace(/#parent_id#/, search.parent_id).replace(/#child_id#/, row.child_id);
    const res = await getData(sql);
    const dataSource = res.map(v => ({
      ...v,
      ptr: getNumber(v.ply_hot_uv, v.exposure_uv),
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
  }, [row, startDate, endDate, modalVisible, order, type]);

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
        <Option value="play_count">播放总数</Option>
        <Option value="like_count">点赞总数</Option>
        <Option value="forward_count">转发总数</Option>
        <Option value="comment_count">评论总数</Option>
        <Option value="play_in">站内播放</Option>
        <Option value="play_out">站外播放</Option>
        <Option value="video_download_count">下载次数</Option>
      </Select>
      <Select
        style={{ width: 200 }}
        placeholder="是否爬取视频"
        defaultValue={type}
        onChange={setType}
      >
        <Option value="">全部</Option>
        <Option value="Y">爬取视频</Option>
        <Option value="N">非爬取视频</Option>
      </Select>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="puiddigest"
      />
    </Modal>
  </div>;
};
