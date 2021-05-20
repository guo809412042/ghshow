/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  DatePicker, Select, Table, Modal, Button,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { columns } from './constant';
import { tagChildSQL } from './sqlTemplate';
import { createSqlWhere } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';

const { Option } = Select;
const ModalView = ({ row }) => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [order, setOrder] = useState('tag_puid_all_total');
  const getFetch = async () => {
    const sql = createSqlWhere({
      sql: tagChildSQL,
      startDate,
      endDate,
      type: row.tag_id,
      order,
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

  useEffect(() => {
    if (visible) {
      getFetch();
    }
  }, [visible, startDate, endDate, order]);
  const exportColumns = _.clone(columns).map(v => ({
    ...v,
    key: v.dataIndex,
  }));
  exportColumns.splice(0, 0, {
    dataIndex: 'tag_id',
    title: '子标签id',
    key: 'tag_id',
  });
  return <div>
    <Button type="primary" onClick={() => setVisible(true)}>查看</Button>
    <Modal
      width={1000}
      title={row.tag_name}
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={() => setVisible(false)}
    >
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
      <Table
        dataSource={exportData}
        columns={exportColumns}
        bordered
        style={{ marginTop: 20 }}
        scroll={{ x: 2000 }}
        loading={loading}
      />
    </Modal>
  </div>;
};

export default ModalView;
