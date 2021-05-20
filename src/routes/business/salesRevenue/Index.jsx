/* eslint-disable no-restricted-syntax */
/* eslint-disable for-direction */
/* eslint-disable no-await-in-loop */

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, Radio, Spin, Tooltip, Icon,
} from 'antd';
import Query from './components/Query';
import { createSqlWhere, getFixed, dateFormat } from '../../../utils/utils';
import { listSQL, listMonSQL, listChartSQL } from './components/sqlTemplate';
import { getHoloData } from '../../../utils/request';
import { columns } from './const';
import { DownLoadButton } from '../../common/DownLoadButton';
import { chartRender } from './chartRender';

const PRODUCT_LIST = {
  整体: 1,
  VivaVideo: 2,
  Tempo: 3,
  VivaCut: 4,
  SlidePlus: 5,
  趣影: 6,
  奇幻变脸秀: 7,
  VivaVideoPro: 8,
  Camdy: 9,
  KamStar: 10,
  VISO: 11,
};
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    appProduct: '',
  });
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const onSearch = (value) => {
    setSearch(value);
  };
  const [dayType, setDayType] = useState('1');
  const [chartDayType, setChartDayType] = useState('1');

  const getSQLData = async (sql, startDate, endDate, flag) => {
    let where = '';
    if (search.appProduct && !flag) {
      where += ` and app_product = '${search.appProduct}' `;
    }
    const fecthSQL = createSqlWhere({
      sql,
      startDate,
      endDate,
      where,
    });
    const res = await getHoloData(fecthSQL);
    return res;
  };

  const getArrData = (v) => {
    const arr = {
      amount: (
        Number(v.gp_sub_amount)
        + Number(v.ios_sub_amount)
        + Number(v.and_sub_amount)
        + Number(v.gp_one_amount)
        + Number(v.ios_one_amount)
      ).toFixed(2),
      gp_sub_amount: getFixed(v.gp_sub_amount),
      ios_sub_amount: getFixed(v.ios_sub_amount),
      and_sub_amount: getFixed(v.and_sub_amount),
      gp_one_amount: getFixed(v.gp_one_amount),
      ios_one_amount: getFixed(v.ios_one_amount),
      sub_revenue: (
        Number(v.gp_sub_revenue)
        + Number(v.ios_sub_revenue)
        + Number(v.and_sub_revenue)
        + Number(v.gp_one_revenue)
        + Number(v.ios_one_revenue)
      ).toFixed(2),
      gp_sub_revenue: getFixed(v.gp_sub_revenue),
      ios_sub_revenue: getFixed(v.ios_sub_revenue),
      and_sub_revenue: getFixed(v.and_sub_revenue),
      gp_one_revenue: getFixed(v.gp_one_revenue),
      ios_one_revenue: getFixed(v.ios_one_revenue),
    };
    return arr;
  };

  const getFetchData = async () => {
    setLoading(true);
    if (dayType === '1') {
      const res = await getSQLData(listSQL, search.startDate, search.endDate);
      const dataSource = res.map(v => ({ data_time: v.data_time, ...getArrData(v) }));
      setDataSource(dataSource);
    } else {
      const startYear = Number(moment(search.startDate).year());
      const endYear = Number(moment(search.endDate).year());
      const startMon = Number(moment(search.startDate).month() + 1);
      const endMon = Number(moment(search.endDate).month() + 1);
      if (startMon === endMon && startYear === endYear) {
        const res = await getSQLData(listMonSQL, search.startDate, search.endDate);
        const data = res.length
          ? [
            {
              ...getArrData(res[0]),
              data_time: `${dateFormat(search.startDate)}-${dateFormat(search.endDate)}`,
            },
          ]
          : [];
        setDataSource(data);
      }
      if (startMon !== endMon && startYear === endYear) {
        let list = [];
        for (let i = endMon; i >= startMon; i--) {
          if (i === endMon) {
            const res = await getSQLData(
              listMonSQL,
              `${startYear}-${endMon * 1 < 10 ? `0${endMon}` : endMon}-01`,
              search.endDate,
            );
            const data = res.length
              ? [
                {
                  ...getArrData(res[0]),
                  data_time: `${dateFormat(
                    `${startYear}-${endMon * 1 < 10 ? `0${endMon}` : endMon}-01`,
                  )}-${dateFormat(search.endDate)}`,
                },
              ]
              : [];
            list = list.concat(data);
          } else if (i === startMon) {
            const res = await getSQLData(listMonSQL, search.startDate, moment(search.startDate).endOf('month'));
            const data = res.length
              ? [
                {
                  ...getArrData(res[0]),
                  data_time: `${dateFormat(search.startDate)}-${dateFormat(moment(search.startDate).endOf('month'))}`,
                },
              ]
              : [];
            list = list.concat(data);
          } else {
            const res = await getSQLData(
              listMonSQL,
              `${startYear}-${i * 1 < 10 ? `0${i}` : i}-01`,
              moment(`${startYear}-${i * 1 < 10 ? `0${i}` : i}-01`).endOf('month'),
            );
            const data = res.length
              ? [
                {
                  ...getArrData(res[0]),
                  data_time: `${dateFormat(`${startYear}-${i * 1 < 10 ? `0${i}` : i}-01`)}-${dateFormat(
                    moment(`${startYear}-${i * 1 < 10 ? `0${i}` : i}-01`).endOf('month'),
                  )}`,
                },
              ]
              : [];
            list = list.concat(data);
          }
        }
        setDataSource(list);
      }
      if (startYear !== endYear) {
        let list = [];
        for (let i = endYear; i >= startYear; i--) {
          if (i === endYear) {
            for (let j = endMon; j >= 1; j--) {
              if (j === endMon) {
                const res = await getSQLData(
                  listMonSQL,
                  `${endYear}-${endMon * 1 < 10 ? `0${endMon}` : endMon}-01`,
                  search.endDate,
                );
                const data = res.length
                  ? [
                    {
                      ...getArrData(res[0]),
                      data_time: `${dateFormat(
                        `${endYear}-${endMon * 1 < 10 ? `0${endMon}` : endMon}-01`,
                      )}-${dateFormat(search.endDate)}`,
                    },
                  ]
                  : [];
                list = list.concat(data);
              } else {
                const res = await getSQLData(
                  listMonSQL,
                  `${endYear}-${j * 1 < 10 ? `0${j}` : j}-01`,
                  moment(`${endYear}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
                );
                const data = res.length
                  ? [
                    {
                      ...getArrData(res[0]),
                      data_time: `${dateFormat(`${endYear}-${j * 1 < 10 ? `0${j}` : j}-01`)}-${dateFormat(
                        moment(`${endYear}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
                      )}`,
                    },
                  ]
                  : [];
                list = list.concat(data);
              }
            }
          } else if (i === startYear) {
            for (let j = 12; j >= startMon; j--) {
              if (j === startMon) {
                const res = await getSQLData(listMonSQL, search.startDate, moment(search.startDate).endOf('month'));
                const data = res.length
                  ? [
                    {
                      ...getArrData(res[0]),
                      data_time: `${dateFormat(search.startDate)}-${dateFormat(
                        moment(search.startDate).endOf('month'),
                      )}`,
                    },
                  ]
                  : [];
                list = list.concat(data);
              } else {
                const res = await getSQLData(
                  listMonSQL,
                  `${startYear}-${j * 1 < 10 ? `0${j}` : j}-01`,
                  moment(`${startYear}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
                );
                const data = res.length
                  ? [
                    {
                      ...getArrData(res[0]),
                      data_time: `${dateFormat(`${startYear}-${j * 1 < 10 ? `0${j}` : j}-01`)}-${dateFormat(
                        moment(`${startYear}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
                      )}`,
                    },
                  ]
                  : [];
                list = list.concat(data);
              }
            }
          } else {
            for (let j = 12; j >= 1; j--) {
              const res = await getSQLData(
                listMonSQL,
                `${i}-${j * 1 < 10 ? `0${j}` : j}-01`,
                moment(`${i}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
              );
              const data = res.length
                ? [
                  {
                    ...getArrData(res[0]),
                    data_time: `${dateFormat(`${i}-${j * 1 < 10 ? `0${j}` : j}-01`)}-${dateFormat(
                      moment(`${i}-${j * 1 < 10 ? `0${j}` : j}-01`).endOf('month'),
                    )}`,
                  },
                ]
                : [];
              list = list.concat(data);
            }
          }
        }
        setDataSource(list);
      }
    }

    setLoading(false);
  };
  const getChartData = async () => {
    setChartLoading(true);
    const chartAmountData = [];
    const chartRevenueData = [];
    let res = await getSQLData(listChartSQL, search.startDate, search.endDate, true);
    res = res.sort((a, b) => PRODUCT_LIST[a.app_product] - PRODUCT_LIST[b.app_product]);
    const allRes = await getSQLData(listSQL, search.startDate, search.endDate, true);
    if (chartDayType === '1') {
      for (const i of allRes) {
        const arr = getArrData(i);
        chartAmountData.push({
          value: Number(arr.amount),
          type: '整体',
          day: dateFormat(i.data_time),
        });
        chartRevenueData.push({
          value: Number(arr.sub_revenue),
          type: '整体',
          day: dateFormat(i.data_time),
        });
      }
      for (const v of res) {
        const arr = getArrData(v);
        chartAmountData.push({
          value: Number(arr.amount),
          type: v.app_product,
          day: dateFormat(v.data_time),
        });
        chartRevenueData.push({
          value: Number(arr.sub_revenue),
          type: v.app_product,
          day: dateFormat(v.data_time),
        });
      }
    } else {
      const momentType = chartDayType === '2' ? 'week' : 'month';
      const start = [];
      const end = [];
      const appProductList = [];
      for (const i of res) {
        const s = moment(i.data_time)
          .startOf(momentType)
          .format('YYYYMMDD');
        const e = moment(i.data_time)
          .endOf(momentType)
          .format('YYYYMMDD');
        if (!start.includes(s)) {
          start.push(s);
        }
        if (!end.includes(e)) {
          end.push(e);
        }
        if (!appProductList.includes(i.app_product)) {
          appProductList.push(i.app_product);
        }
      }
      start.forEach(async (v, index) => {
        for (const p of appProductList) {
          const list = res.filter(i => i.data_time >= v && i.data_time <= end[index] && i.app_product === p);
          if (list.length) {
            let amounts = 0;
            let revenues = 0;
            for (const v of list) {
              amounts += Number(
                (
                  Number(v.gp_sub_amount)
                  + Number(v.ios_sub_amount)
                  + Number(v.and_sub_amount)
                  + Number(v.gp_one_amount)
                  + Number(v.ios_one_amount)
                ).toFixed(2),
              );
              revenues += Number(
                (
                  Number(v.gp_sub_revenue)
                  + Number(v.ios_sub_revenue)
                  + Number(v.and_sub_revenue)
                  + Number(v.gp_one_revenue)
                  + Number(v.ios_one_revenue)
                ).toFixed(2),
              );
            }
            chartAmountData.push({
              value: Number(amounts.toFixed(2)),
              type: p,
              day: `${dateFormat(v, 'YYYYMMDD')}-${dateFormat(end[index], 'YYYYMMDD')}`,
            });
            chartRevenueData.push({
              value: Number(revenues.toFixed(2)),
              type: p,
              day: `${dateFormat(v, 'YYYYMMDD')}-${dateFormat(end[index], 'YYYYMMDD')}`,
            });
          }
        }
        const allList = allRes.filter(i => i.data_time >= v && i.data_time <= end[index]);
        if (allList.length) {
          let amounts = 0;
          let revenues = 0;
          for (const v of allList) {
            amounts += Number(
              (
                Number(v.gp_sub_amount)
                + Number(v.ios_sub_amount)
                + Number(v.and_sub_amount)
                + Number(v.gp_one_amount)
                + Number(v.ios_one_amount)
              ).toFixed(2),
            );
            revenues += Number(
              (
                Number(v.gp_sub_revenue)
                + Number(v.ios_sub_revenue)
                + Number(v.and_sub_revenue)
                + Number(v.gp_one_revenue)
                + Number(v.ios_one_revenue)
              ).toFixed(2),
            );
          }
          chartAmountData.push({
            value: Number(Number(amounts).toFixed(2)),
            type: '整体',
            day: `${dateFormat(v, 'YYYYMMDD')}-${dateFormat(end[index], 'YYYYMMDD')}`,
          });
          chartRevenueData.push({
            value: Number(Number(revenues).toFixed(2)),
            type: '整体',
            day: `${dateFormat(v, 'YYYYMMDD')}-${dateFormat(end[index], 'YYYYMMDD')}`,
          });
        }
      });
    }
    chartRender(chartAmountData, 'amount-chart');
    chartRender(chartRevenueData, 'revenue-chart');
    setChartLoading(false);
  };
  useEffect(() => {
    getFetchData();
  }, [search, dayType]);
  useEffect(() => {
    getChartData();
  }, [search.startDate, search.endDate, chartDayType]);
  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <Spin spinning={chartLoading}>
        <RadioGroup value={chartDayType} style={{ marginTop: 20 }} onChange={e => setChartDayType(e.target.value)}>
          <RadioButton value="1" key="1">
            日
          </RadioButton>
          <RadioButton value="2" key="2">
            周
          </RadioButton>
          <RadioButton value="3" key="3">
            月
          </RadioButton>
        </RadioGroup>
        <h3>销售额总计</h3>
        <div id="amount-chart" />
        <h3>预估净收入总计</h3>
        <div id="revenue-chart" />
      </Spin>
      <DownLoadButton filename="销售额和收入汇总" columns={columns} data={dataSource} />

      <RadioGroup value={dayType} style={{ marginTop: 20 }} onChange={e => setDayType(e.target.value)}>
        <RadioButton value="1" key="1">
          日
        </RadioButton>
        <RadioButton value="2" key="2">
          月
        </RadioButton>
      </RadioGroup>
      <Tooltip
        overlayStyle={{ maxWidth: 320 }}
        overlay={
          <div>
            <span>
              说明1:
              <br />
              国内安卓和GP数据采用UTC时区，iOS采用PST时区
              <br />
            </span>
            <span>
              说明2:
              <br />
              销售额不减去退款
              <br />
            </span>
            <span>
              说明3:
              <br />
              净收入=销售额-税费-平台抽成/手续费
              <br />
            </span>
            <span>
              说明4:
              <br />
              货币单位:$，换算方式以当日实时汇率换算
              <br />
            </span>
          </div>
        }
      >
        <Icon type="question-circle" style={{ marginLeft: 8, fontSize: 18 }} />
      </Tooltip>

      <Table
        style={{ marginTop: 20 }}
        rowKey="data_time"
        bordered
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: 1600 }}
      />
    </div>
  );
};
