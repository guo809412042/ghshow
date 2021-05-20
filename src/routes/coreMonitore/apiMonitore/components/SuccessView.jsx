import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Spin } from 'antd';
import { createSqlWhere } from '../../../../utils/utils';
import {
  successSQL, successStatusCodeSQL, successWeekSQL, successTestSQL, successWeekTestSQL,
} from './sqlTemplate';
import { getHoloData, getData } from '../../../../utils/request';
import { ChartRenderWithTool } from './drawChart';

export default ({
  platform, where, currentDate, productValue, database = '', test = false, productInfo,
}) => {
  database = productInfo.database.replace(/#type#/, Number(platform) === 1 ? 'android' : 'ios');
  productInfo.productValue = productInfo.productValue === 'viva' ? '' : productInfo.productValue;
  let timer = null;
  const [loading, setLoading] = useState(false);
  const getFetchData = async () => {
    setLoading(true);
    let weekWhere = _.clone(where);
    if (currentDate) {
      where += ` and date_time >= '${moment(currentDate).format('YYYY-MM-DD')} 00:00:00'
      and date_time <= '${moment(currentDate).format('YYYY-MM-DD')} 23:59:59'
        `;
      weekWhere += ` and date_time >= '${moment(currentDate)
        .subtract(7, 'days')
        .format('YYYY-MM-DD')} 00:00:00'
        and date_time <= '${moment(currentDate)
    .subtract(1, 'days')
    .format('YYYY-MM-DD')} 23:59:59'
          `;
    }
    if (productInfo.productValue) {
      where += ` and product = '${productInfo.productValue}' `;
      weekWhere += ` and product = '${productInfo.productValue}' `;
    }
    const sql = createSqlWhere({
      sql: test ? successWeekTestSQL : successSQL,
      where,
      database,
    });
    const weekSQL = createSqlWhere({
      sql: productValue ? successWeekSQL : (test ? successWeekTestSQL : successSQL),
      where: weekWhere,
      database,
    });
    const res = test ? await getData(sql) : await getHoloData(sql);
    const weekRes = test ? await getData(weekSQL) : await getHoloData(weekSQL);
    const chartData = res.map(v => ({
      value: Number(v.ratio) * 100,
      day: `${moment(currentDate).format('YYYY-MM-DD')} ${(v.date_time.toString()).split(' ')[1]}`,
      type: `当天-${moment(currentDate).format('YYYY-MM-DD')}`,
    }));
    weekRes.forEach((v) => {
      chartData.push({
        value: Number(v.ratio) * 100,
        // day: (moment(v.date_time).format('HH:mm:ss')).toString(),
        day: `${moment(currentDate).format('YYYY-MM-DD')} ${(v.date_time.toString()).split(' ')[1]}`,
        type: '周平均',
      });
    });
    const topSQL = createSqlWhere({
      sql: test ? successTestSQL : successStatusCodeSQL,
      where,
      database,
    });
    const topRes = test ? await getData(topSQL) : await getHoloData(topSQL);
    ChartRenderWithTool(chartData, 'success-chart', true, topRes);
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
  }, [platform, where, currentDate, productInfo.product_id]);

  useEffect(() => clearTime);
  return (
    <Spin spinning={loading}>
      <div id="success-chart" />
    </Spin>
  );
};
