/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Card, Table } from 'antd';
import OverviewQuery from './OverviewQuery';
import {
  overviewChartSQL, overviewChartAllSQL, overviewTableSQL, overviewTableMonSQL,
} from '../sqlTemplate';
import { getData } from '../../../../utils/request';
import { createSqlWhere } from '../../../../utils/utils';
import { APP_PRODUCT_LIST_WITHOUT_VID, PLAFORM_LIST } from '../../../../utils/const';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { IS_VIP } from '../const';

const dateFormat = 'YYYYMMDD';
export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    dayType: '1',
    country: [],
    source: [],
    lang: [],
  });
  const [dataSource, setDataSource] = useState([]);
  const getSQLData = async (sql, selectProduct = true, startDate = search.startDate, endDate = search.endDate) => {
    const {
      maxAppVersion, minAppVersion, product, isVip, platform,
    } = search;
    let where = '';
    const querys = {
      country: 'country',
      source: 'source',
      lang: 'lang',
    };
    const groups = [];
    if (selectProduct && product) {
      where += ` and product_id = '${product}'`;
    }
    for (const i of Object.keys(querys)) {
      if (search[i].length) {
        groups.push(i);
        where += ` and ${querys[i]} in (${search[i].map(v => `'${v}'`).join(',')}) `;
      }
    }
    if (isVip) {
      where += ` and is_vip = '${isVip}'`;
      groups.push('is_vip');
    }
    if (maxAppVersion) {
      where += ` and appKey <= '${maxAppVersion}'`;
    }
    if (minAppVersion) {
      where += ` and appKey >= '${minAppVersion}'`;
    }
    if (maxAppVersion || minAppVersion) {
      groups.push('app_version');
    }
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    const res = await getData(
      createSqlWhere({
        sql,
        startDate,
        endDate,
        where,
        group: groups.length ? groups.map(v => `,${v}`).join(' ') : '',
      }),
    );
    return res;
  };
  const getChartData = async () => {
    const res = await getSQLData(overviewChartSQL);
    const chartData = [];
    if (!search.product) {
      const allData = await getSQLData(overviewChartAllSQL, false);
      for (const v of allData) {
        chartData.push({
          type: '??????',
          day: moment(v.ds).format('YYYY-MM-DD'),
          value: v.count,
        });
      }
    }
    res.forEach((v) => {
      chartData.push({
        type: APP_PRODUCT_LIST_WITHOUT_VID[v.product_id],
        day: moment(v.ds).format('YYYY-MM-DD'),
        value: v.count,
      });
    });
    let data = [];
    if (search.dayType === '1') {
      data = chartData;
    } else {
      const start = [];
      const end = [];
      const diff = search.endDate.diff(search.startDate, 'days');
      const appList = [];
      for (const i of chartData) {
        if (!appList.includes(i.type)) {
          appList.push(i.type);
        }
      }
      for (let i = diff; i >= 0; i--) {
        const date = moment(search.endDate).subtract(i, 'days');
        const s = moment(date)
          .startOf(search.dayType === '2' ? 'week' : 'month')
          .format(dateFormat);
        const e = moment(date)
          .endOf(search.dayType === '2' ? 'week' : 'month')
          .format(dateFormat);
        if (!start.includes(s)) {
          start.push(s);
        }
        if (!end.includes(e)) {
          end.push(e);
        }
      }
      for (let i = 0; i < start.length; i++) {
        for (const j of appList) {
          const arr = {
            day: `${i === 0 ? moment(search.startDate).format(dateFormat) : moment(start[i]).format(dateFormat)}--${
              i === start.length - 1 ? moment(search.endDate).format(dateFormat) : moment(end[i]).format(dateFormat)
            }`,
            type: j,
          };
          const list = chartData.filter(
            v => moment(v.day).format(dateFormat) * 1 >= start[i] * 1
              && moment(v.day).format(dateFormat) * 1 <= end[i] * 1
              && v.type === j,
          );
          const count = list.reduce((a, b) => a + b.value, 0);
          arr.value = count;
          data.push(arr);
        }
      }
    }
    chartLineRender(data, document.getElementById('chart'));
  };
  const getTableData = async () => {
    let data = [];
    if (search.dayType === '1') {
      const res = await getSQLData(overviewTableSQL);
      const appList = [];
      for (const i of res) {
        if (!appList.includes(i.product_id)) {
          appList.push(i.product_id);
        }
      }
      data = res.map((v, index) => ({
        ds: v.ds,
        product: APP_PRODUCT_LIST_WITHOUT_VID[v.product_id],
        source: v.source || '??????',
        platform: PLAFORM_LIST[search.platform] || '??????',
        country: v.country || '??????',
        app_version: v.app_version || '??????',
        lang: v.lang || '??????',
        is_vip: IS_VIP[search.isVip] || '??????',
        count: v.count,
        key: index,
      }));
    } else {
      const start = [];
      const end = [];
      const diff = search.endDate.diff(search.startDate, 'days');
      for (let i = diff; i >= 0; i--) {
        const date = moment(search.endDate).subtract(i, 'days');
        const s = moment(date)
          .startOf(search.dayType === '2' ? 'week' : 'month')
          .format(dateFormat);
        const e = moment(date)
          .endOf(search.dayType === '2' ? 'week' : 'month')
          .format(dateFormat);
        if (!start.includes(s)) {
          start.push(s);
        }
        if (!end.includes(e)) {
          end.push(e);
        }
      }
      for (let i = start.length - 1; i >= 0; i--) {
        let sDate = '';
        let eDate = '';
        if (i === start.length - 1) {
          eDate = moment(search.endDate).format('YYYYMMDD');
        } else {
          eDate = end[i];
        }
        if (i === 0) {
          sDate = moment(search.startDate).format('YYYYMMDD');
        } else {
          sDate = start[i];
        }
        const res = await getSQLData(overviewTableMonSQL, true, sDate, eDate);
        res.forEach((j, index) => {
          data.push({
            ds: `${sDate}-${eDate}`,
            product: APP_PRODUCT_LIST_WITHOUT_VID[j.product_id],
            source: j.source || '??????',
            platform: PLAFORM_LIST[search.platform] || '??????',
            country: j.country || '??????',
            app_version: j.app_version || '??????',
            lang: j.lang || '??????',
            is_vip: IS_VIP[search.isVip] || '??????',
            count: j.count,
            key: `${i}-${index}`,
          });
        });
      }
    }
    setDataSource(data);
  };
  useEffect(() => {
    getChartData();
    getTableData();
  }, [search]);
  const fields = {
    ds: '??????',
    product: '??????',
    source: '??????',
    platform: '??????',
    country: '??????',
    app_version: '??????',
    is_vip: '????????????',
    lang: '??????',
    count: '?????????',
  };
  const columns = Object.keys(fields).map(v => ({
    dataIndex: v,
    key: v,
    title: fields[v],
  }));
  return (
    <div>
      <OverviewQuery search={search} setSearch={setSearch} />
      <Card style={{ margin: '20px 0' }}>
        <div id="chart" />
      </Card>
      <DownLoadButton filename="????????????" data={dataSource} columns={columns} />
      <Table style={{ marginTop: 20 }} dataSource={dataSource} columns={columns} bordered />
    </div>
  );
};
