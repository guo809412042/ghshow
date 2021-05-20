/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, Tooltip, Icon, Radio, Switch,
} from 'antd';
import _ from 'lodash';
import Query from './components/Query';
import { columns } from './const';
import { DownLoadButton } from '../../common/DownLoadButton';
import { createSqlWhere, getNumber, getFixed } from '../../../utils/utils';
import { listSQL } from './components/sqlTemplate';
import { getData } from '../../../utils/request';
import { chartRender } from './components/chartRender';

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(1, 'days'),
    appProduct: '',
    countryName: [],
    countryCode: [],
    skuId: [],
    platform: '1,3',
    type: 'pay_usr_cnt_1d',
    conutryOperator: 'in',
    channel: undefined,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [downDataSource, setDownDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [caclType, setCalcType] = useState(false); // x天后付费是否累加计算
  const [excolumns, setExcolumns] = useState(columns);

  const onSearch = (values) => {
    setSearch(values);
  };
  const getSQLData = async (sql, startDate = search.startDate, endDate = search.endDate) => {
    let where = '';
    if (search.appProduct) {
      where += ` and product_id = ${search.appProduct}`;
    }
    if (search.countryName.length) {
      where += ` and country_name ${search.conutryOperator} (${search.countryName.map(v => `'${v}'`).join(',')})`;
    }
    if (search.channel) {
      where += ` and is_ser_throw='${search.channel}'`;
    }

    const where1 = where;
    if (search.skuId.length) {
      where += ` and sku_id in (${search.skuId.map(v => `'${v}'`).join(',')})`;
    }
    let fetchSQL = createSqlWhere({
      sql,
      platform: search.platform,
      startDate,
      endDate,
      where,
    });
    fetchSQL = fetchSQL.replace(/#where1#/, where1);
    const res = await getData(fetchSQL);
    return res;
  };
  const getList = async () => {
    setLoading(true);
    const res = await getSQLData(listSQL);
    const data = [];
    const regTimes = [];
    for (const i of res) {
      if (!regTimes.includes(i.reg_time)) {
        regTimes.push(i.reg_time);
      }
    }
    for (const i of regTimes) {
      const arr = {
        reg_time: i,
        user_total: 0,
        pay_total: 0,
      };
      const list = res.filter(v => v.reg_time === i);
      for (const item of list) {
        arr[`interval_day${item.interval_day}`] = item[search.type];
        arr.pay_total += item.pay_amt_total;
      }
      if (list.length) {
        arr.user_total = list[0].user_total;
        arr.pay_total = getFixed(arr.pay_total);
        data.push(arr);
      }
    }
    let downData = [];
    const dataSource = [];
    for (const i of data) {
      downData.push({
        ...i,
        'pay_total/user_total': getNumber(i.pay_total, i.user_total, false, 4),
      });
    }

    if (search.type === 'pay_usr_cnt_1d' && data.length) {
      for (const i of data) {
        const arr = _.clone(i);
        const keys = Object.keys(i).filter(v => v !== 'reg_time' && v !== 'user_total' && v !== 'pay_total');
        for (const key of keys) {
          const ii = key.split('_day')[1];
          const list = keys.filter(v => Number(v.split('_day')[1]) <= Number(ii));
          if (list.length) {
            let num = 0;
            for (const j of list) {
              num += i[j];
            }
            arr[key] = `${i[key]}  (${getNumber(num, i.user_total)}%)`;
            if (caclType) {
              switch (ii) {
                case '7':
                  let sum7 = 0;
                  for (let v = 7; v < 15; v++) {
                    const day = arr[`interval_day${v}`] ? parseInt(arr[`interval_day${v}`], 10) : 0;
                    sum7 += day;
                  }
                  arr[`${key}sum`] = `${sum7}  (${getNumber(num + sum7 - i.interval_day7, i.user_total)}%)`;
                  arr[key] = `${i[key]}  (${getNumber(num + sum7, i.user_total)}%)`;
                  break;
                case '15':
                  let sum15 = 0;
                  for (let v = 15; v < 30; v++) {
                    const day = arr[`interval_day${v}`] ? parseInt(arr[`interval_day${v}`], 10) : 0;
                    sum15 += day;
                  }
                  arr[`${key}sum`] = `${sum15}  (${getNumber(num + sum15 - i.interval_day15, i.user_total)}%)`;
                  arr[key] = `${i[key]}  (${getNumber(num + sum15 - i.interval_day15, i.user_total)}%)`;
                  break;
                case '30':
                  let sum30 = 0;
                  for (let v = 30; v < 60; v++) {
                    const day = arr[`interval_day${v}`] ? parseInt(arr[`interval_day${v}`], 10) : 0;
                    sum30 += day;
                  }
                  arr[`${key}sum`] = `${sum30}  (${getNumber(num + sum30 - i.interval_day30, i.user_total)}%)`;
                  arr[key] = `${i[key]}  (${getNumber(num + sum30 - i.interval_day30, i.user_total)}%)`;
                  break;
                case '60':
                  let sum60 = 0;
                  for (let v = 60; v < 90; v++) {
                    const day = arr[`interval_day${v}`] ? parseInt(arr[`interval_day${v}`], 10) : 0;
                    sum60 += day;
                  }
                  arr[`${key}sum`] = `${sum60}  (${getNumber(num + sum60 - i.interval_day60, i.user_total)}%)`;
                  arr[key] = `${i[key]}  (${getNumber(num + sum60 - i.interval_day60, i.user_total)}%)`;
                  break;
                case '90':
                  let sum90 = 0;
                  const diff = moment(search.endDate).diff(search.startDate, 'days');
                  for (let v = 90; v < diff; v++) {
                    const day = arr[`interval_day${v}`] ? parseInt(arr[`interval_day${v}`], 10) : 0;
                    sum90 += day;
                  }
                  arr[`${key}sum`] = `${sum90}  (${getNumber(num + sum90 - i.interval_day90, i.user_total)}%)`;
                  arr[key] = `${i[key]}  (${getNumber(num + sum90 - i.interval_day90, i.user_total)}%)`;
                  break;
                default:
                  arr[key] = `${i[key]}  (${getNumber(num, i.user_total)}%)`;
                  break;
              }
            }
            arr['pay_total/user_total'] = getNumber(i.pay_total, i.user_total, false, 4);
          }
        }
        dataSource.push(arr);
      }
    } else if (search.type === 'pay_amt_total' && data.length) {
      for (const i of data) {
        dataSource.push({
          ...i,
          'pay_total/user_total': getNumber(i.pay_total, i.user_total, false, 4),
        });
      }
    }
    setDataSource(dataSource);
    if (caclType) {
      downData = dataSource.map(v => Object.assign({}, ...Object.keys(v).map(i => ({ [i]: parseFloat(v[i]) }))));
    }
    setDownDataSource(downData);
    setLoading(false);
  };
  const getChartDatas = async (sql, startDate, endDate, type) => {
    const res = await getSQLData(sql, startDate, endDate);
    let intervalDays = [];
    const regTimes = [];
    let userTotal = 0;
    let payAmtTotal = 0;
    const chartData = [];
    res.forEach((v) => {
      payAmtTotal += Number(v.pay_amt_total);
      if (!intervalDays.includes(v.interval_day) && v.interval_day) {
        intervalDays.push(v.interval_day);
      }
      if (!regTimes.includes(v.reg_time)) {
        regTimes.push(v.reg_time);
        userTotal += v.user_total;
      }
    });
    intervalDays = intervalDays.sort((a, b) => a - b);
    for (const i of intervalDays) {
      const list = res.filter(v => Number(v.interval_day) <= i);
      let num = 0;
      for (const j of list) {
        num += Number(j[search.type]);
      }
      chartData.push({
        day: i.toString(),
        value: getNumber(num, search.type === 'pay_usr_cnt_1d' ? userTotal : payAmtTotal),
        type,
      });
    }
    return chartData;
  };
  const getChartData = async () => {
    let chartData = await getChartDatas(listSQL, undefined, undefined, '整体');
    if (selectedRowKeys.length) {
      const date = selectedRowKeys[0].toString();
      const res = await getChartDatas(listSQL, date, date, moment(date).format('YYYY-MM-DD'));
      chartData = chartData.concat(res);
    }
    chartRender(chartData, 'chart');
  };
  useEffect(() => {
    if (caclType) {
      setExcolumns(
        columns.concat([
          { dataIndex: 'interval_day7sum', key: 'interval_day7sum', title: '7天后付费' },
          { dataIndex: 'interval_day15sum', key: 'interval_day15sum', title: '15日后付费' },
          { dataIndex: 'interval_day30sum', key: 'interval_day30sum', title: '30日后付费' },
          { dataIndex: 'interval_day60sum', key: 'interval_day60sum', title: '60日后付费' },
          { dataIndex: 'interval_day90sum', key: 'interval_day90sum', title: '90日后付费' },
        ]),
      );
    } else {
      setExcolumns(
        columns.concat([
          { dataIndex: 'interval_day7', key: 'interval_day7', title: '7天后付费' },
          { dataIndex: 'interval_day15', key: 'interval_day15', title: '15日后付费' },
          { dataIndex: 'interval_day30', key: 'interval_day30', title: '30日后付费' },
          { dataIndex: 'interval_day60', key: 'interval_day60', title: '60日后付费' },
          { dataIndex: 'interval_day90', key: 'interval_day90', title: '90日后付费' },
        ]),
      );
    }
    getList();
  }, [search, caclType]);
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys.length ? [selectedRowKeys[selectedRowKeys.length - 1]] : []);
    },
    selectedRowKeys,
  };
  useEffect(() => {
    getChartData();
  }, [search, selectedRowKeys]);
  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <div style={{ verticalAlign: 'center' }}>
        <DownLoadButton filename="用户付费率表" data={downDataSource} columns={excolumns} />
        <Tooltip title="新增为服务端新增">
          <Icon style={{ fontSize: 18 }} type="question-circle" />
        </Tooltip>
        <Switch checked={caclType} onChange={setCalcType} style={{ margin: '-5px 5px 0 15px' }} />
        数值累加
      </div>
      <Table
        dataSource={dataSource}
        columns={excolumns}
        bordered
        style={{ marginTop: 20 }}
        rowKey="reg_time"
        scroll={{ x: 1800 }}
        rowSelection={rowSelection}
        loading={loading}
      />
      <h3 style={{ marginTop: 10 }}>用户付费率曲线</h3>
      <div id="chart" />
    </div>
  );
};
