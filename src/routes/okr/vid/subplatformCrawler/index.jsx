import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Table } from 'antd';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { getData } from '../../../../utils/request';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { listSQL } from './sqlTemplate';

export default () => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = [
    { dataIndex: 'ds', title: 'Day', key: 'ds' },
    { dataIndex: 'platform', title: '平台', key: 'platform' },
    { dataIndex: 'vdo_cnt', title: '视频数', key: 'vdo_cnt' },
    { dataIndex: 'vdo_exp_cnt', title: '曝光视频数', key: 'vdo_exp_cnt' },
    { dataIndex: 'similar_vdo_cnt', title: '相似视频数', key: 'similar_vdo_cnt' },
    { dataIndex: 'exp_vdo_cnt_1d', title: '曝光数', key: 'exp_vdo_cnt_1d' },
    { dataIndex: 'ply_vdo_cnt_1d', title: '播放数', key: 'ply_vdo_cnt_1d' },
    { dataIndex: 'dnld_vdo_cnt_1d', title: '下载数', key: 'dnld_vdo_cnt_1d' },
    { dataIndex: 'exp_vdo_cnt_1d/vdo_cnt', title: '平均曝光数', key: 'exp_vdo_cnt_1d/vdo_cnt' },
    { dataIndex: 'ply_vdo_cnt_1d/vdo_cnt', title: '平均播放数', key: 'ply_vdo_cnt_1d/vdo_cnt' },
    { dataIndex: 'ptr_3s', title: '有效播放率', key: 'ptr_3s' },
    { dataIndex: 'dnld_vdo_cnt_1d/exp_vdo_cnt_1d', title: '下载率', key: 'dnld_vdo_cnt_1d/exp_vdo_cnt_1d' },
    { dataIndex: 'vdo_exp_cnt/vdo_cnt', title: '曝光视频占比', key: 'vdo_exp_cnt/vdo_cnt' },
    { dataIndex: 'similar_vdo_cnt/vdo_cnt', title: '重复视频占比', key: 'similar_vdo_cnt/vdo_cnt' },
  ];
  const getFetchData = async () => {
    setLoading(true);
    const res = await getData(createSqlWhere({
      sql: listSQL,
      startDate: currentDate,
    }));
    const data = res.map((v, index) => ({
      ...v,
      'exp_vdo_cnt_1d/vdo_cnt': getNumber(v.exp_vdo_cnt_1d, v.vdo_cnt, false),
      'ply_vdo_cnt_1d/vdo_cnt': getNumber(v.ply_vdo_cnt_1d, v.vdo_cnt, false),
      'dnld_vdo_cnt_1d/exp_vdo_cnt_1d': getNumber(v.dnld_vdo_cnt_1d, v.exp_vdo_cnt_1d),
      'vdo_exp_cnt/vdo_cnt': getNumber(v.vdo_exp_cnt, v.vdo_cnt),
      'similar_vdo_cnt/vdo_cnt': getNumber(v.similar_vdo_cnt, v.vdo_cnt),
      key: index,
    }));
    setDataSource(data);
    setLoading(false);
  };
  useEffect(() => {
    getFetchData();
  }, [currentDate]);
  return <div>
    <DatePicker
      value={currentDate}
      onChange={setCurrentDate}
    />
    <DownLoadButton
      filename="分平台爬虫"
      data={dataSource}
      columns={columns}
    />
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      rowKey="key"
      style={{ marginTop: 20 }}
      scroll={{ x: 1500 }}
      loading={loading}
    />
  </div>;
};
