import React, { useState, useEffect } from 'react';
import { DatePicker, Modal, Button } from 'antd';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { algUnitDetailSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';

export default ({
  searchStartDate, searchEndDate, algUnit, abVersion,
}) => {
  const [startDate, setStartDate] = useState(searchStartDate);
  const [endDate, setEndDate] = useState(searchEndDate);
  const columns = [
    {
      title: 'ptr(%)',
      dataIndex: 'ptr',
    },
    {
      title: 'ptr(%)(>3s)',
      dataIndex: 'ptr>3s',
    },
    {
      title: 'day',
      dataIndex: 'day',
    }];
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const getFetchData = async () => {
    let sql = createSqlWhere({
      sql: algUnitDetailSQL,
      startDate,
      endDate,
    });
    sql = sql.replace(/#ab_version#/, abVersion).replace(/#alg_unit#/, algUnit);
    const res = await getData(sql);
    const data = res.map(v => ({
      ptr: getNumber(v.play_puid_total, v.exposure_puid_total),
      'ptr>3s': getNumber(v.play_puid_3s, v.exposure_puid_total),
      day: v.day,
    }));
    setData(data);
    const chartData = [];
    data.forEach((v) => {
      chartData.push({
        type: 'ptr',
        value: v.ptr,
        day: v.day.toString(),
      });
      chartData.push({
        type: 'ptr>3s',
        value: v['ptr>3s'],
        day: v.day.toString(),
      });
    });
    chartLineRender(chartData, document.getElementById(`chart-ptr-ptr3s-${algUnit}-${abVersion}`));
  };

  useEffect(() => {
    if (visible) {
      getFetchData();
    }
  }, [startDate, endDate, algUnit, abVersion, visible]);

  return (
    <div key={ `${abVersion}_${algUnit}` }>
      <Button type="primary" onClick={() => setVisible(true)}>
        详情
      </Button>
      <Modal
        title="算法单元数据"
        width={1000}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        closable={false}
      >
        <DownLoadButton
          columns={columns.map(v => ({
            ...v,
            key: v.dataIndex,
          }))}
          data={data}
          filename="列表"
        />
        <DatePicker.RangePicker
          value={[startDate, endDate]}
          onChange={(value) => {
            setStartDate(value[0]);
            setEndDate(value[1]);
          }}
        />
        <div id={`chart-ptr-ptr3s-${algUnit}-${abVersion}`} />
      </Modal>
    </div>
  );
};
