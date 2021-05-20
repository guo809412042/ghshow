import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'antd';
import { getData } from '../../../../utils/request';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { detailSQL } from './sqlTemplate';

export default ({ row, startDate, endDate }) => {
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const columns = [{
    title: '视频标识',
    dataIndex: 'puiddigest',
    render: (text, row) => <a href={`https://xiaoying.tv/v/${text}/${row.ver}`} target="_blank">{text}</a>,
  }, {
    title: '用户标识',
    dataIndex: 'auiddigest',
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
    title: '曝光总数',
    dataIndex: 'exposure_count',
  }, {
    title: '曝光人数',
    dataIndex: 'exposure_uv',
  }, {
    title: '热门模块播放人数',
    dataIndex: 'play_hot_uv',
  }, {
    title: '下载次数',
    dataIndex: 'video_download_count',
  }, {
    title: '曝光播放占比',
    dataIndex: 'ptr',
  }, {
    title: '版本号',
    dataIndex: 'ver',
  }];
  const getFetchData = async () => {
    const res = await getData(createSqlWhere({
      sql: detailSQL,
      startDate,
      endDate,
      type: row.tag,
    }));
    const dataSource = res.map(v => ({
      ...v,
      ptr: getNumber(v.play_hot_uv, v.exposure_uv),
    }));
    setDataSource(dataSource);
  };
  useEffect(() => {
    getFetchData();
  }, [row, startDate, endDate]);
  return <div>
    <Button type="primary" onClick={() => setModalVisible(true)}>详情</Button>
    <Modal
      title="视频列表"
      width={1100}
      visible={modalVisible}
      onOk={() => setModalVisible(false)}
      onCancel={() => setModalVisible(false)}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="puiddigest"
      />
    </Modal>
  </div>;
};
