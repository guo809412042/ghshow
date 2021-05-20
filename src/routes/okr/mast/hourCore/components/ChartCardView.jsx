/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Row } from 'antd';
import CardTemplateView from '../../../../common/CardTemplateView';
import { createSqlWhere } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { ChartRender } from './drawChart';
import { DownLoadButton } from '../../../../common/DownLoadButton';

const dateFormat = 'YYYY-MM-DD';
const sqlTemplate = `select  sum(#molecular#) as #molecular#
,hh
from    #database#
where   ds >= #startDate#
and     ds <= #endDate#
#otherWhere#
group by hh
order by hh
limit   10000
;
`;
export default ({
  molecular,
  denominator,
  title,
  graphName,
  yesterday = false, // 昨天
  today = false, // 今天
  lastWeek = false, // 上周平均
  week = false, // 本周平均
  lastWeekDay = false, // 上周同时间
  otherWhere = '',
  database = '',
}) => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const CardTemplateViewProps = {
    title,
    loading: false,
    graphName,
  };
  const getChartData = async (start, end, type) => {
    start = Number(start);
    end = Number(end);
    const chartData = [];
    const sql = createSqlWhere({
      sql: sqlTemplate,
      startDate: moment(currentDate).subtract(start, 'days'),
      endDate: moment(currentDate).subtract(end, 'days'),
      molecular,
      database,
      otherWhere,
    });
    const res = await getData(sql);
    for (const i of res) {
      chartData.push({
        value: Number((i[molecular] / (start - end + 1)).toFixed(2)),
        day: moment(`${moment(currentDate).format(dateFormat)} ${i.hh}:00`).format('YYYY-MM-DD HH:mm'),
        type,
        hh: `${i.hh}:00`,
      });
    }
    return chartData;
  };
  const getFetchData = async () => {
    let chartData = [];
    if (yesterday) {
      chartData = chartData.concat(await getChartData(1, 1, '昨天'));
    }
    if (today) {
      chartData = chartData.concat(await getChartData(0, 0, '今天'));
    }
    if (lastWeekDay) {
      chartData = chartData.concat(await getChartData(7, 7, '上周同时间'));
    }
    if (week) {
      const weekOfday = moment(currentDate).format('E');// 计算今天是这周第几天
      chartData = chartData.concat(await getChartData(weekOfday - 1, 0, '本周平均'));
    }
    if (lastWeek) {
      const weekOfday = Number(moment(currentDate).format('E'));// 计算今天是这周第几天
      chartData = chartData.concat(await getChartData(weekOfday + 6, weekOfday, '上周平均'));
    }
    console.log(chartData);
    setDataSource(chartData);
    ChartRender(chartData, `hour-${molecular}-${title}`);
  };
  useEffect(() => {
    getFetchData();
  }, [currentDate]);
  return <Row
    id={`chartDiv-${molecular}-${denominator}`}
    style={{ marginBottom: 10 }}
  >
    <CardTemplateView {...CardTemplateViewProps} >
      <DatePicker defaultValue={currentDate} format={dateFormat} onChange={setCurrentDate} />
      <DownLoadButton filename={title} data={dataSource} columns={[
        { title: '时间', key: 'hh' },
        { title: '值', key: 'value' },
        { title: '类型', key: 'type' },
      ]} />
      <div id={`hour-${molecular}-${title}`} />
    </CardTemplateView>
  </Row>;
};
