import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Spin } from 'antd';
import { createSqlWhere } from '../../../../utils/utils';
import {
  totalSQL, totalTestSQL, totalWeekSQL, totalWeekTestSQL,
} from './sqlTemplate';
import { getHoloData, getData } from '../../../../utils/request';
import { ChartRender } from './drawChart';
import { productInfos } from '../../../../utils/enum';

export default ({
  platform, where, currentDate, database = '', productValue = '', test = false, productInfo,
}) => {
  database = productInfo.database.replace(/#type#/, Number(platform) === 1 ? 'android' : 'ios');
  productInfo.productValue = productInfo.productValue === 'viva' ? '' : productInfo.productValue;
  console.log(productInfo.productValue === 'viva');
  let timer = null;
  const [loading, setLoading] = useState(false);
  const getFetchData = async () => {
    setLoading(true);
    let weekWhere = _.clone(where);
    if (currentDate && !test) {
      where += ` and date_time >= '${moment(currentDate).format('YYYY-MM-DD')} 00:00:00'
      and date_time <= '${moment(currentDate).format('YYYY-MM-DD')} 23:59:59'
        `;
      weekWhere += ` and date_time >= '${moment(currentDate)
        .subtract(7, 'days')
        .format('YYYY-MM-DD')} 00:00:00'
        and date_time <= '${moment(currentDate)
    .subtract(1, 'days')
    .format('YYYY-MM-DD')} 23:59:59'`;
    }
    if (currentDate && test) {
      where += ` and date_time >= '${moment(currentDate).format('YYYY-MM-DD')} 00:00:00'
      and date_time <= '${moment(currentDate).format('YYYY-MM-DD')} 23:59:59'
      and ds = '${moment(currentDate).format('YYYYMMDD')}'
        `;
      weekWhere += ` and date_time >= '${moment(currentDate)
        .subtract(7, 'days')
        .format('YYYY-MM-DD')} 00:00:00'
        and date_time <= '${moment(currentDate)
    .subtract(1, 'days')
    .format('YYYY-MM-DD')} 23:59:59'`;
    }
    if (productInfo.productValue) {
      where += ` and product = '${productInfo.productValue}' `;
      weekWhere += ` and product = '${productInfo.productValue}' `;
    }
    const sql = createSqlWhere({
      sql: test ? totalTestSQL : totalSQL,
      where,
      database,
    });
    const weekSQL = createSqlWhere({
      sql: test ? totalWeekTestSQL : totalWeekSQL,
      where: weekWhere,
      database,
    });
    const res = test ? await getData(sql) : await getHoloData(sql);
    const weekRes = test ? await getData(weekSQL) : await getHoloData(weekSQL);
    const chartData = res.map(v => ({
      value: Number(v.total),
      // day: (moment(v.date_time).format('HH:mm:ss')).toString(),
      day: v.date_time.toString(),
      type: `当天-${moment(currentDate).format('YYYY-MM-DD')}`,
    }));
    weekRes.forEach((v) => {
      chartData.push({
        value: Number(v.total),
        // day: (moment(v.date_time).format('HH:mm:ss')).toString(),
        // day: v.date_time.toString(),
        day: `${moment(currentDate).format('YYYY-MM-DD')} ${(v.date_time.toString()).split(' ')[1]}`,
        type: '周平均',
      });
    });
    ChartRender(chartData, 'through-chart');
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
      <div id="through-chart" />
    </Spin>
  );
};
