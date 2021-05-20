import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { getData } from '../../../../utils/request';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { detailSQL } from './sqlTemplate';
import AlgUnitDetailView from './AlgUnitDetailView';


export default ({ startDate, endDate, row }) => {
  const columns = [{
    title: '播放总数',
    dataIndex: 'play_puid_total',
  }, {
    title: '有效播放总数',
    dataIndex: 'play_puid_3s',
  }, {
    title: '曝光总数（占比）',
    dataIndex: 'exposure_puid_total',
  }, {
    title: '播放人数',
    dataIndex: 'play_uv_total',
  }, {
    title: '播放人数(>3s)',
    dataIndex: 'play_uv_3s',
  }, {
    title: '曝光人数',
    dataIndex: 'exposure_uv_total',
  }, {
    title: 'ptr(%)',
    dataIndex: 'ptr',
  }, {
    title: 'ptr(%)(>3s)',
    dataIndex: 'ptr>3s',
  }, {
    title: '播放完成度',
    dataIndex: 'play_cmplt_cnt',
  }, {
    title: '算法单元',
    dataIndex: 'alg_unit',
  }, {
    title: '详情',
    dataIndex: 'action',
    render: (text, detailRow) => <AlgUnitDetailView
      abVersion={row.ab_version}
      searchEndDate={endDate}
      searchStartDate={startDate}
      algUnit={detailRow.alg_unit}
    />,
  }];
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const fetchData = async () => {
    const res = await getData(createSqlWhere({
      sql: detailSQL,
      startDate,
      endDate,
      type: row.ab_version,
    }));
    let exposurePuidTotal = 0;
    res.forEach((i) => { exposurePuidTotal += i.exposure_puid_total; });
    const data = res.map(v => ({
      ...v,
      ptr: getNumber(v.play_puid_total, v.exposure_puid_total),
      'ptr>3s': getNumber(v.play_puid_3s, v.exposure_puid_total),
      exposure_puid_total: !v.exposure_puid_total || !exposurePuidTotal ? '0 (0.00%)' : `${v.exposure_puid_total} (${(v.exposure_puid_total * 100 / exposurePuidTotal).toFixed(2)}%)`,
      play_cmplt_cnt: `${getNumber(v.play_cmplt_cnt, v.play_puid_total)}%`,
    }));
    setDataSource(data);
  };
  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [startDate, endDate, visible]);

  return <div>
    <Button type="primary" onClick={() => setVisible(true)}>详情</Button>
    <Modal
      title="算法单元数据"
      width={1000}
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      <DownLoadButton
        columns={columns.map(v => ({
          ...v,
          key: v.dataIndex,
        }))}
        data={dataSource}
        filename="列表"
      />
      <Table dataSource={dataSource} columns={columns} rowKey="alg_unit" style={{ marginTop: 20 }} />
    </Modal>

  </div>;
};
