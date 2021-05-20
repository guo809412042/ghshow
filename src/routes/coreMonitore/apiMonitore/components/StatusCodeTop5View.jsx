import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import moment from 'moment';
import { statusCodeSQL } from './sqlTemplate';
import { createSqlWhere } from '../../../../utils/utils';
import { getHoloData } from '../../../../utils/request';
import { BarChartRender } from './drawChart';

export default ({
  platform, where, currentDate, product,
}) => {
  let timer = null;
  const [loading, setLoading] = useState(false);
  const getFetchData = async () => {
    setLoading(true);
    if (currentDate) {
      where += ` and date_time >= '${moment(currentDate).format('YYYY-MM-DD')} 00:00:00'
      and date_time <= '${moment(currentDate).format('YYYY-MM-DD')} 23:59:59'
        `;
    }
    const sql = createSqlWhere({
      sql: statusCodeSQL,
      where,
      type: Number(platform) === 1 ? 'android' : 'ios',
      product,
    });
    const res = await getHoloData(sql);
    const chartData = res.map(v => ({
      value: Number((Number(v.ratio) * 100).toFixed(2)),
      day: v.date_time.toString(),
      type: v.status_code,
    }));
    BarChartRender(chartData, 'status-code-top5-chart', true);
    setLoading(false);
  };
  const clearTime = () => {
    clearInterval(timer);
  };
  useEffect(() => {
    if (timer) {
      clearTime();
    }
    timer = setInterval(() => {
      getFetchData();
    }, 600000);
    getFetchData();
  }, [platform, where, currentDate]);
  return (<Spin spinning={loading}>
    <div id="status-code-top5-chart" />
  </Spin>);
};
