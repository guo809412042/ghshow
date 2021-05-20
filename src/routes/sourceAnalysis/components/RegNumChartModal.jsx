/*
 * @Date: 2021-01-12 20:06:53
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-12 15:32:11
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import { getData } from '../../../utils/request';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';
import { DownLoadButton } from '../../common/DownLoadButton';
import { getFixed, getNumber } from '../../../utils/utils';

export default ({
  sql, visible, searchValues, name, showType = 'reg_num', spendSql,
}) => {
  const [startDate, setStartDate] = useState(searchValues.seartDate || moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(searchValues.endDate || moment().subtract(1, 'days'));
  const [data, setData] = useState([]);
  let chartData;
  const getFetchData = async () => {
    // console.log('sql', sql);
    const fetchSql = sql
      .replace(/#startDateReg#/, moment(startDate).format('YYYYMMDD'))
      .replace(/#endDateReg#/, moment(endDate).format('YYYYMMDD'));
    const res = await getData(fetchSql);
    if (showType.includes('/')) {
      const spendFetchSql = spendSql
        .replace(/#startDateReg#/, moment(startDate).format('YYYYMMDD'))
        .replace(/#endDateReg#/, moment(endDate).format('YYYYMMDD'));
      const spendRes = await getData(spendFetchSql);
      chartData = [];
      for (const i of res) {
        const find = spendRes.find(v => v.reg_time === i.reg_time);
        chartData.push({
          value: getNumber(find[showType.split('/')[0]], i[showType.split('/')[1]], false),
          type: name,
          day: moment(i.reg_time.toString()).format('YYYY-MM-DD'),
        });
      }
    } else if (showType.includes('*')) {
      const spendFetchSql = spendSql
        .replace(/#startDateReg#/, moment(startDate).format('YYYYMMDD'))
        .replace(/#endDateReg#/, moment(endDate).format('YYYYMMDD'));
      const spendRes = await getData(spendFetchSql);
      chartData = [];
      for (const i of res) {
        const find = spendRes.find(v => v.reg_time === i.reg_time);
        chartData.push({
          value: getNumber(i[showType.split('*')[1]], find[showType.split('*')[0]], true),
          type: name,
          day: moment(i.reg_time.toString()).format('YYYY-MM-DD'),
        });
      }
    } else if (showType.includes('%')) {
      chartData = [];
      for (const i of res) {
        chartData.push({
          value: getNumber(i[showType.split('%')[0]], i[showType.split('%')[1]]),
          type: name,
          day: moment(i.reg_time.toString()).format('YYYY-MM-DD'),
        });
      }
    } else {
      // console.log('res', res);
      // console.log('showType', showType);
      chartData = res.map(v => ({
        value: Number(getFixed(v[showType], showType === 'amt_total' || showType === 'spend' ? 2 : 0)),
        type: name,
        day: moment(v.reg_time.toString()).format('YYYY-MM-DD'),
      }));
    }
    // console.log('chartData', chartData);
    setData(chartData);
    chartLineRender(chartData, document.getElementById(`chart-${name}`));
  };
  useEffect(() => {
    if (visible) {
      getFetchData();
    }
  }, [visible, startDate, endDate]);
  return (
    <div>
      <DownLoadButton
        filename={name}
        data={data}
        columns={[{ key: 'value', title: 'value' }, { key: 'type', title: 'type' }, { key: 'day', title: 'day' }]}
      />
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(values) => {
          setStartDate(values[0]);
          setEndDate(values[1]);
        }}
        style={{ float: 'right' }}
      />
      <div id={`chart-${name}`} />
    </div>
  );
};
