/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, Radio, Tooltip, Icon,
} from 'antd';
import Query from './components/Query';
import { columns } from './const';
import { DownLoadButton } from '../../common/DownLoadButton';
import { createSqlWhere, getNumber, dateFormat } from '../../../utils/utils';
import { getData } from '../../../utils/request';
import { listSQL, listMonthSQL, listChartSQL } from './components/sqlTemplate';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    appProduct: [],
    countryName: [],
    countryCode: [],
    conutryOperator: 'in',
  });
  const [dayType1, setDayType1] = useState('1');
  const [dayType2, setDayType2] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const onSearch = (values) => {
    setSearch(values);
  };
  const getSQLData = async (sql, startDate = search.startDate, endDate = search.endDate) => {
    let where = '';
    if (search.appProduct.length) {
      where += ` and app_product ${search.conutryOperator} (${search.appProduct.map(v => `'${v}'`).join(',')})`;
    }
    if (search.countryName.length) {
      where += ` and country_name ${search.conutryOperator} (${search.countryName.map(v => `'${v}'`).join(',')})`;
    }
    const fetchSQL = createSqlWhere({
      sql,
      platform: search.platform,
      startDate,
      endDate,
      where,
    });
    const res = await getData(fetchSQL);
    return res;
  };
  const getMonthData = async (startDate, endDate) => {
    const data = await getSQLData(listMonthSQL, startDate, endDate);
    if (data.length) {
      const v = data[0];
      return {
        ...v,
        data_time: `${dateFormat(startDate, 'YYYYMMDD')}-${dateFormat(endDate, 'YYYYMMDD')}`,
        'rfd_amt_total/pay_amt_total': getNumber(v.rfd_amt_total, v.pay_amt_total),
        'rfd_amt_total_ios/pay_amt_total_ios': getNumber(v.rfd_amt_total_ios, v.pay_amt_total_ios),
        'rfd_amt_total_and/pay_amt_total_and': getNumber(v.rfd_amt_total_and, v.pay_amt_total_and),
        'rfd_amt_total_gp/pay_amt_total_gp': getNumber(v.rfd_amt_total_gp, v.pay_amt_total_gp),
      };
    }
    return {
      data_time: `${dateFormat(startDate, 'YYYYMMDD')}-${dateFormat(endDate, 'YYYYMMDD')}`,
    };
  };
  const getFetchData = async () => {
    if (dayType1 === '1') {
      const res = await getSQLData(listSQL);
      const dataSource = [];
      res.forEach((v) => {
        dataSource.push({
          ...v,
          'rfd_amt_total/pay_amt_total': getNumber(v.rfd_amt_total, v.pay_amt_total),
          'rfd_amt_total_ios/pay_amt_total_ios': getNumber(v.rfd_amt_total_ios, v.pay_amt_total_ios),
          'rfd_amt_total_and/pay_amt_total_and': getNumber(v.rfd_amt_total_and, v.pay_amt_total_and),
          'rfd_amt_total_gp/pay_amt_total_gp': getNumber(v.rfd_amt_total_gp, v.pay_amt_total_gp),
        });
      });
      setDataSource(dataSource);
    } else {
      const startYear = Number(moment(search.startDate).year());
      const endYear = Number(moment(search.endDate).year());
      const startMon = Number(moment(search.startDate).month() + 1);
      const endMon = Number(moment(search.endDate).month() + 1);
      const data = [];
      if (startMon === endMon && startYear === endYear) {
        const res = await getMonthData(search.startDate, search.endDate);
        if (res) {
          data.push(res);
        }
      } else if (startMon !== endMon && startYear === endYear) {
        for (let i = endMon; i >= startMon; i--) {
          if (i === endMon) {
            const res = await getMonthData(
              `${startYear}-${endMon * 1 < 10 ? `0${endMon}` : endMon}-01`,
              search.endDate,
            );
            if (res) {
              data.push(res);
            }
          } else if (i === startMon) {
            const res = await getMonthData(search.startDate, moment(search.startDate).endOf('month'));
            if (res) {
              data.push(res);
            }
          } else {
            const res = await getMonthData(
              `${startYear}-${i * 1 < 10 ? `0${i}` : i}-01`,
              moment(`${startYear}-${i * 1 < 10 ? `0${i}` : i}-01`).endOf('month'),
            );
            if (res) {
              data.push(res);
            }
          }
        }
      } else if (startYear !== endYear) {
        for (let i = endYear; i >= startYear; i--) {
          if (i === endYear) {
            for (let j = endMon; j >= 1; j--) {
              if (j === endMon) {
                const res = await getMonthData(
                  `${endYear}-${endMon * 1 < 10 ? `0${endMon}` : endMon}-01`,
                  search.endDate,
                );
                if (res) {
                  data.push(res);
                }
              } else {
                const res = await getMonthData(
                  `${endYear}-${j * 1 < 10 ? `0${j}` : j}-01`,
                  moment(`${endYear}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
                );
                if (res) {
                  data.push(res);
                }
              }
            }
          } else if (i === startYear) {
            for (let j = 12; j >= startMon; j--) {
              if (j === startMon) {
                const res = await getMonthData(search.startDate, moment(search.startDate).endOf('month'));
                if (res) {
                  data.push(res);
                }
              } else {
                const res = await getMonthData(
                  `${startYear}-${j * 1 < 10 ? `0${j}` : j}-01`,
                  moment(`${startYear}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
                );
                if (res) {
                  data.push(res);
                }
              }
            }
          } else {
            for (let j = 12; j >= 1; j--) {
              const res = await getMonthData(
                `${i}-${j * 1 < 10 ? `0${j}` : j}-01`,
                moment(`${i}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
              );
              if (res) {
                data.push(res);
              }
            }
          }
        }
      }
      setDataSource(data);
    }
  };
  const getChartArr = (chartData, res, date) => {
    chartData.push({
      type: '总退款率',
      day: moment(date).format('YYYY-MM'),
      value: res['rfd_amt_total/pay_amt_total'],
    });
    chartData.push({
      type: '国内安卓退款率',
      day: moment(date).format('YYYY-MM'),
      value: res['rfd_amt_total_and/pay_amt_total_and'],
    });
    chartData.push({
      type: 'iOS退款率',
      day: moment(date).format('YYYY-MM'),
      value: res['rfd_amt_total_ios/pay_amt_total_ios'],
    });
    chartData.push({
      type: 'GP退款率',
      day: moment(date).format('YYYY-MM'),
      value: res['rfd_amt_total_gp/pay_amt_total_gp'],
    });
  };
  const getChartData = async () => {
    const chartData = [];
    if (dayType2 === '1') {
      const res = await getSQLData(listChartSQL);
      res.forEach((v) => {
        chartData.push({
          type: '总退款率',
          day: moment(v.data_time).format('YYYY-MM-DD'),
          value: getNumber(v.rfd_amt_total, v.pay_amt_total),
        });
        chartData.push({
          type: '国内安卓退款率',
          day: moment(v.data_time).format('YYYY-MM-DD'),
          value: getNumber(v.rfd_amt_total_and, v.pay_amt_total_and),
        });
        chartData.push({
          type: 'iOS退款率',
          day: moment(v.data_time).format('YYYY-MM-DD'),
          value: getNumber(v.rfd_amt_total_ios, v.pay_amt_total_ios),
        });
        chartData.push({
          type: 'GP退款率',
          day: moment(v.data_time).format('YYYY-MM-DD'),
          value: getNumber(v.rfd_amt_total_gp, v.pay_amt_total_gp),
        });
      });
    } else {
      const startYear = Number(moment(search.startDate).year());
      const endYear = Number(moment(search.endDate).year());
      const startMon = Number(moment(search.startDate).month() + 1);
      const endMon = Number(moment(search.endDate).month() + 1);
      if (startMon === endMon && startYear === endYear) {
        const res = await getMonthData(search.startDate, search.endDate);
        if (res) {
          getChartArr(chartData, res, search.startDate);
        }
      } else if (startMon !== endMon && startYear === endYear) {
        for (let i = startMon; i <= endMon; i++) {
          if (i === endMon) {
            const res = await getMonthData(
              `${startYear}-${endMon * 1 < 10 ? `0${endMon}` : endMon}-01`,
              search.endDate,
            );
            if (res) {
              getChartArr(chartData, res, search.endDate);
            }
          } else if (i === startMon) {
            const res = await getMonthData(search.startDate, moment(search.startDate).endOf('month'));
            if (res) {
              getChartArr(chartData, res, search.startDate);
            }
          } else {
            const res = await getMonthData(
              `${startYear}-${i * 1 < 10 ? `0${i}` : i}-01`,
              moment(`${startYear}-${i * 1 < 10 ? `0${i}` : i}-01`).endOf('month'),
            );
            if (res) {
              getChartArr(chartData, res, `${startYear}-${i * 1 < 10 ? `0${i}` : i}-01`);
            }
          }
        }
      } else if (startYear !== endYear) {
        for (let i = startYear; i <= endYear; i++) {
          if (i === endYear) {
            for (let j = 1; j <= endMon; j++) {
              if (j === endMon) {
                const res = await getMonthData(
                  `${endYear}-${endMon * 1 < 10 ? `0${endMon}` : endMon}-01`,
                  search.endDate,
                );
                if (res) {
                  getChartArr(chartData, res, search.endDate);
                }
              } else {
                const res = await getMonthData(
                  `${endYear}-${j * 1 < 10 ? `0${j}` : j}-01`,
                  moment(`${endYear}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
                );
                if (res) {
                  getChartArr(chartData, res, `${endYear}-${j * 1 < 10 ? `0${j}` : j}-01`);
                }
              }
            }
          } else if (i === startYear) {
            for (let j = startMon; j <= 12; j++) {
              if (j === startMon) {
                const res = await getMonthData(search.startDate, moment(search.startDate).endOf('month'));
                if (res) {
                  getChartArr(chartData, res, search.startDate);
                }
              } else {
                const res = await getMonthData(
                  `${startYear}-${j * 1 < 10 ? `0${j}` : j}-01`,
                  moment(`${startYear}-${j}-01`).endOf('month'),
                );
                if (res) {
                  getChartArr(chartData, res, `${startYear}-${j * 1 < 10 ? `0${j}` : j}-01`);
                }
              }
            }
          } else {
            for (let j = 1; j <= 12; j++) {
              const res = await getMonthData(
                `${i}-${j * 1 < 10 ? `0${j}` : j}-01`,
                moment(`${i}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
              );
              if (res) {
                getChartArr(chartData, res, `${i}-${j * 1 < 10 ? `0${j}` : j}-01`);
              }
            }
          }
        }
      }
    }
    chartLineRender(chartData, document.getElementById('chart'));
  };
  useEffect(() => {
    getFetchData();
  }, [search, dayType1]);
  useEffect(() => {
    getChartData();
  }, [search, dayType2]);
  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <DownLoadButton filename="退款数据" data={dataSource} columns={columns} />
      <Radio.Group value={dayType1} onChange={e => setDayType1(e.target.value)}>
        <Radio.Button value="1" key="1">
          日
        </Radio.Button>
        <Radio.Button value="2" key="2">
          月
        </Radio.Button>
      </Radio.Group>
      <Tooltip
        overlay={
          <div>
            <span>
              说明1:
              <br />
              退款金额统计均为当日退款，不回溯到购买日.
              <br />
            </span>
            <span>
              说明2:
              <br />
              退款率=当日退款金额/当日销售金额
              <br />
            </span>
          </div>
        }
      >
        <Icon style={{ fontSize: 18, marginLeft: 10 }} type="question-circle" />
      </Tooltip>
      <Table dataSource={dataSource} rowKey="data_time" columns={columns} bordered style={{ marginTop: 20 }} />
      <h3 style={{ marginTop: 10 }}>退款数据</h3>
      <Radio.Group value={dayType2} onChange={e => setDayType2(e.target.value)}>
        <Radio.Button value="1" key="1">
          日
        </Radio.Button>
        <Radio.Button value="2" key="2">
          月
        </Radio.Button>
      </Radio.Group>
      <div id="chart" />
    </div>
  );
};
