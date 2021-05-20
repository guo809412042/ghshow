/*
 * @Date: 2020-07-29 17:54:06
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-08-25 17:04:19
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Modal } from 'antd';
import moment from 'moment';
import { createSqlWhere } from '../../../utils/utils';
import { eventDaySQL, eventDaySQLWeb } from '../sqlTemplate';
import { getHoloData, getData } from '../../../utils/request';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';
import { DownLoadButton } from '../../common/DownLoadButton';

const EventChartView = ({
  record, search, database, noAuidTotal, noUser, productName = 'product', ghPlatform,
}) => {
  const { product } = search;
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [visible, setVisible] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const getFetch = async () => {
    let sql = createSqlWhere({
      sql: product === '3' ? eventDaySQLWeb : eventDaySQL,
      type: noUser ? '' : search.userTape,
      startDate,
      endDate,
      where: search.searchWhere,
      // product: ` and ${productName} = '${search.product}'`,
      product: ` and ${product === '3' ? 'productid' : productName} = '${product === '3' ? ghPlatform : product}'`,
      database,
    });
    sql = sql
      .replace(/#event_name#/, record.event_name)
      .replace(/#auid#/, noAuidTotal ? '' : ',sum(auid_total) as auid_total');
    const res = product === '3' ? await getData(sql) : await getHoloData(sql);
    setExportData(res);

    const chartData = [];
    if (res.length) {
      const KEYS = product === '3' ? Object.keys(res[0]).filter(v => v === 'total') : Object.keys(res[0]).filter(v => v !== 'ds');
      const column = Object.keys(res[0]).map(v => ({
        key: v,
        title: v,
      }));
      setColumns(column);
      for (const i of res) {
        for (const j of KEYS) {
          chartData.push({
            day: moment(i.ds.toString()).format('YYYY-MM-DD'),
            value: Number(i[j]),
            type: j,
          });
        }
      }
    }
    chartLineRender(chartData, document.getElementById(`${record.event_name}-chart`));
  };
  useEffect(() => {
    if (visible) {
      getFetch();
    }
  }, [visible, startDate, endDate]);
  useEffect(() => {
    setStartDate(search.startDate);
    setEndDate(search.endDate);
  }, [search]);
  return (
    <div style={{ display: 'inline-block' }}>
      <Button type="primary" size="small" onClick={() => setVisible(true)}>
        自定义事件统计
      </Button>
      <Modal
        title={record.event_name}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
        width={800}
      >
        <DownLoadButton filename={record.event_name} data={exportData} columns={columns} />
        <DatePicker.RangePicker
          value={[startDate, endDate]}
          onChange={(values) => {
            setStartDate(values[0]);
            setEndDate(values[1]);
          }}
        />
        <div id={`${record.event_name}-chart`} />
      </Modal>
    </div>
  );
};

export default EventChartView;
