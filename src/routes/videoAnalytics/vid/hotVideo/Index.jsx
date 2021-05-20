import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Select, Table } from 'antd';
import { BreadcrumbMenu } from '../../../common/BreadcrumbMenu';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { exportColumns, MAJIA_1 } from './constant';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { hotvideoVivaShow } from './sqlTemplate';
import { getData } from '../../../../utils/request';

const { Option } = Select;
const Index = () => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [exportData, setExportData] = useState([]);
  const [order, setOrder] = useState('ply_vdo_vivashow_cnt_1d');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const getFetch = async () => {
    setLoading(true);
    let where = '';
    if (type !== '') {
      where += ` and is_spider='${type}'`;
    }
    const sql = createSqlWhere({
      sql: hotvideoVivaShow,
      startDate,
      endDate,
      order,
      where,
    });
    const res = await getData(sql);
    const dataSource = res.map(v => ({
      ...v,
      ply_vdo_dur_vivashow_3s_1d: v.ply_vdo_dur_vivashow_3s_1d ? (v.ply_vdo_dur_vivashow_3s_1d / 1000 / 60).toFixed(2) : '',
      ply_vdo_dur_vivashow_1d: v.ply_vdo_dur_vivashow_1d ? (v.ply_vdo_dur_vivashow_1d / 1000 / 60).toFixed(2) : '',
      is_spider: MAJIA_1[v.is_spider],
      ptr: `${getNumber(v.ply_vdo_vivashow_dvc_cnt_3s_1d, v.exp_vdo_vivashow_cnt_1d)}%`,
    }));
    setExportData(dataSource);
    setLoading(false);
  };
  useEffect(() => {
    getFetch();
  }, [startDate, endDate, type, order]);
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
      <Option value="ply_vdo_vivashow_cnt_1d">播放总数</Option>
      <Option value="ply_vdo_vivashow_dvc_cnt_1d">播放人数</Option>
      <Option value="ply_vdo_vivashow_cnt_3s_1d">有效播放总数</Option>
      <Option value="ply_vdo_vivashow_dvc_cnt_3s_1d">有效播放人数</Option>
      <Option value="lk_vdo_vivashow_cnt_1d">点赞总数</Option>
      <Option value="lk_vdo_vivashow_dvc_cnt_1d">点赞人数</Option>
      <Option value="cmnt_vdo_vivashow_cnt_1d">评论总数</Option>
      <Option value="cmnt_vdo_vivashow_dvc_cnt_1d">评论人数</Option>
      <Option value="exp_vdo_vivashow_cnt_1d">曝光总数</Option>
      <Option value="exp_vdo_vivashow_dvc_cnt_1d">曝光人数</Option>
      <Option value="dnld_vdo_vivashow_cnt_1d">下载次数</Option>
    </Select>
    <Select
      style={{ width: 200 }}
      placeholder="是否爬取视频"
      defaultValue={type}
      onChange={value => setType(value)}
    >
      <Option value="">全部</Option>
      <Option value="Y">爬取视频</Option>
      <Option value="N">非爬取视频</Option>
    </Select>
    <Table
      dataSource={exportData}
      columns={exportColumns}
      bordered
      style={{ marginTop: 20 }}
      loading={loading}
    />
  </div>;
};

export default Index;
