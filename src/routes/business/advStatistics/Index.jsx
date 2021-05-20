/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Spin } from 'antd';
import Query from './components/Query';
import { DownLoadButton } from '../../common/DownLoadButton';
import { AdvListSQL, AdvChartSQL, PlacementGroupListSQL } from './components/SqlTemplate';
import { getData } from '../../../utils/request';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';
import { AdvColumns } from './components/utils';
import { GetAdvPlacementList } from './services';
import { groupSignal } from '../trialConvertion/utils';

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(1, 'days'),
    product: 2,
    platform: '1',
    country: undefined,
    advCompany: [],
    advPlacement: [],
    advType: '',
    statisticsType: 'day',
  });

  const [dataList, setDataList] = useState([]);

  const dynamicColumn = {
    key: search.statisticsType,
    dataIndex: search.statisticsType,
    title: search.statisticsType,
    render: text => text,
  };

  const [columns, setColumns] = useState([dynamicColumn].concat(AdvColumns));
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  // 获取where查询条件
  const getWhere = () => {
    let where = ' where 1=1 ';
    if (search.startDate) {
      where += ` and day>=${moment(search.startDate).format('YYYYMMDD')}`;
    }
    if (search.endDate) {
      where += ` and day<=${moment(search.endDate).format('YYYYMMDD')}`;
    }
    if (search.advCompany && search.advCompany.length > 0) {
      where += ` and platform in(${search.advCompany.map(v => `'${v}'`).join(',')})`;
    }
    if (search.advPlacement && search.advPlacement.length > 0) {
      where += ` and placement_id in(${search.advPlacement
        .map(v => v.split(',').map(str => `'${str}'`))
        .flat()
        .join(',')})`;
    }
    if (search.advType && search.advType.length > 0) {
      where += ` and type in(${search.advType.map(v => `'${v}'`)})`;
    }
    if (search.country && search.country.length > 0) {
      where += ` and country in(${search.country.map(v => `'${v}'`)})`;
    }
    if (search.platform) {
      where += ` and product in('${search.platform}')`;
    }
    if (search.product) {
      where += ` and product_id in('${search.product}')`;
    }
    return where;
  };

  const getColumns = () => {
    const dau_arpu_columns = search.statisticsType === 'day' || search.statisticsType === 'country'
      ? [
        {
          key: 'DAU',
          dataIndex: 'DAU',
          title: 'DAU',
        },
        {
          key: 'ARPU',
          dataIndex: 'ARPU',
          title: 'ARPU',
        },
      ]
      : [];
    const curr = [dynamicColumn].concat(dau_arpu_columns).concat(AdvColumns);
    setColumns(curr);
    return curr;
  };
  // 获取表格数据
  const getList = async () => {
    setLoading(true);

    const { statisticsType } = search;
    const where = getWhere();
    const groupby = ` ${statisticsType}`;
    const orderby = ` ${statisticsType === 'day' ? 'day' : 'revenue'} `;
    try {
      let sql;
      if (statisticsType === 'placement_name') {
        const { data: placements } = await GetAdvPlacementList({});
        const names = groupSignal(placements, 'placement_name') || [];
        let groupbyName = ' case';
        Object.keys(names).forEach((name) => {
          const ids = (names[name] || []).map(record => `'${record.placement_id}'`).join(',');
          groupbyName += ` when placement_id in (${ids}) then '${name}' `;
        });
        groupbyName += ' end as placement_name';
        sql = PlacementGroupListSQL.replace(/#where#/g, where).replace(/#groupfield#/g, groupbyName);
      } else {
        sql = AdvListSQL.replace(/#where#/g, where)
          .replace(/#groupby#/g, groupby)
          .replace(/#orderby#/, ` order by ${orderby} desc`);
      }
      const res = await getData(sql);
      console.log(res);
      const avgData = {
        ARPU: 0,
        CTR: 0,
        DAU: 0,
        click: 0,
        day: 0,
        eCPM: 0,
        fill_rate: 0,
        filled: 0,
        impression: 0,
        request: 0,
        revenue: 0,
        show_rate: 0,
      };
      let startDate;
      let endDate;
      if (search.statisticsType === 'day') {
        res.forEach((item) => {
          const keys = Object.keys(item);
          if (startDate) {
            if (startDate > moment(`${item.day}`).valueOf()) {
              startDate = moment(`${item.day}`).valueOf();
            }
          } else {
            startDate = moment(`${item.day}`).valueOf();
          }
          if (endDate) {
            if (endDate < moment(`${item.day}`).valueOf()) {
              endDate = moment(`${item.day}`).valueOf();
            }
          } else {
            endDate = moment(`${item.day}`).valueOf();
          }
          keys.forEach((key) => {
            avgData[key] += +item[key];
          });
        });
      }
      // console.log('avgData', avgData);
      const days = moment(endDate).diff(startDate, 'days') + 1;
      // console.log('days', days);
      const avgDatakeys = Object.keys(avgData);
      avgDatakeys.forEach((key) => {
        if (key === 'ARPU') {
          avgData[key] = (avgData[key] / days).toFixed(6);
        } else {
          avgData[key] = (avgData[key] / days).toFixed(2);
        }
      });
      if (search.statisticsType === 'day') {
        setDataList(
          [Object.assign({ ...avgData, [search.statisticsType]: 'avg' })].concat(res.map(v => ({
            ...v,
            // DAU: search.statisticsType === 'day' ? v.DAU : parseInt(v.DAU / days, 10),
          }))),
        );
      } else {
        setDataList(
          res.map(v => ({
            ...v,
            // DAU: search.statisticsType === 'day' ? v.DAU : parseInt(v.DAU / days, 10),
          })),
        );
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      setLoading(false);
    }
  };

  // 获取图表数据
  const getChartList = async () => {
    setChartLoading(true);
    const where = getWhere();
    try {
      const res = await getData(AdvChartSQL.replace(/#where#/g, where));
      if (res) {
        const fields = getColumns().slice(1);
        const chartList = res.map((v) => {
          const list = [];
          fields.forEach((field) => {
            list.push({
              day: moment(v.day, 'YYYYMMDD').format('YYYY-MM-DD'),
              type: field.title,
              value: v[field.key],
            });
          });
          return list;
        });

        chartLineRender(chartList.flat(), document.getElementById('lineChart'), 300, '', [], true);
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      setChartLoading(false);
    }
  };

  const onSearch = (params) => {
    setSearch(params);
  };

  useEffect(() => {
    getList();
    getColumns();
    getChartList();
  }, [search]);

  return (
    <div>
      <Query search={search} onSearch={onSearch} />
      <Spin spinning={chartLoading}>
        <div id="lineChart" />
      </Spin>
      <p />
      <DownLoadButton filename="广告统计分析" data={dataList} columns={columns} />
      <p />
      <Table loading={loading} dataSource={dataList} columns={columns} />
    </div>
  );
};
