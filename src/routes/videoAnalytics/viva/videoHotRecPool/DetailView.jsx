import React, { useState, useEffect } from 'react';
import {
  DatePicker, Table, Modal, Button,
} from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { groupmap, VIDEOTRACE } from '../../../../utils/enum';
import { getData } from '../../../../utils/request';
import { createSqlWhere } from '../../../../utils/utils';
import { hotRecPoolDetail } from './sqlTemplate';

export default ({ row, search }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const columns = [{
    title: '视频标识',
    dataIndex: 'puiddigest',
    render: (text, row) => <a href={`${groupmap['1']}/${text}/${row.ver}`} target="_blank">{text}</a>,
  }, {
    title: '用户标识',
    dataIndex: 'auiddigest',
  }, {
    title: '视频来源',
    dataIndex: 'video_trace',
    render: text => <span>{VIDEOTRACE[text] || text}</span>,
  }, {
    title: '状态',
    dataIndex: 'state',
  }, {
    title: '创建时间',
    dataIndex: 'create_time',
    render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
  }, {
    title: '修改时间',
    dataIndex: 'modify_time',
    render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
  }];
  const fetchData = async () => {
    const res = await getData(createSqlWhere({
      sql: hotRecPoolDetail,
      startDate,
      endDate,
      type: row.video_trace,
      state: row.state,
    }));
    setDataSource(res);
  };
  useEffect(() => {
    setEndDate(search.endDate);
    setStartDate(search.startDate);
  }, [search]);
  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [startDate, endDate, visible]);
  return <div>
    <Button type="primary" onClick={() => setVisible(true)}>详情</Button>
    <Modal
      title="详情"
      visible={visible}
      width={1100}
      onCancel={() => setVisible(false)}
      onOk={() => setVisible(true)}
    >
      <DownLoadButton
        columns={columns.map(v => ({
          ...v,
          key: v.dataIndex,
        }))}
        data={dataSource}
        filename="列表"
      />
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(value) => {
          setStartDate(value[0]);
          setEndDate(value[1]);
        }}
      />
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="puiddigest"
        style={{ marginTop: 20 }}
      />
    </Modal>

  </div>;
};
