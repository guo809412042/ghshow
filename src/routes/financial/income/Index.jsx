/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Radio, Switch } from 'antd';
import Query from './components/Query';
import { columns } from './contants';
import { DownLoadButton } from '../../common/DownLoadButton';
import { listSQL } from './components/sqlTemplate';
import { getHoloData } from '../../../utils/request';
import { createSqlWhere } from '../../../utils/utils';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(0, 'days'),
    moneyType: 'rmb',
    appProduct: [],
    countryCode: [],
    conutryOperator: 'in',
  });
  const [showFlag, setShowFlag] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dayType, setDayType] = useState('1');
  const [loading, setLoading] = useState(false);
  const onSearch = (value) => {
    setSearch(value);
  };
  const getSQL = (sql) => {
    let where = '';

    if (search.countryCode.length) {
      where += ` and country_code ${search.conutryOperator} (${search.countryCode.map(v => `'${v}'`).join(',')}) `;
    }
    let fetchSql = createSqlWhere({
      sql,
      startDate: search.startDate,
      endDate: search.endDate,
      where,
      type: search.moneyType,
      platform: search.appProduct.length
        ? ` and app_product in (${search.appProduct.map(v => `'${v}'`).join(',')})`
        : '',
    });

    // 由于小程序的广告数据可以独立展示，筛选小程序广告收入时加like条件
    if (search.appProduct.length === 1 && search.appProduct[0] === '小程序') {
      fetchSql = fetchSql.replace(/#placementid#/, 'and placement_id LIKE \'adunit%\'');
    } else if (search.appProduct.length === 1 && search.appProduct[0] === 'VivaVideo') {
      fetchSql = fetchSql.replace(/#placementid#/, 'and placement_id not LIKE \'adunit%\'');
    } else {
      fetchSql = fetchSql.replace(/#placementid#/, '');
    }
    return fetchSql;
  };

  const calcAdv = !search.appProduct.length || search.appProduct.includes('小程序') || search.appProduct.includes('VivaVideo');

  const getListData = (res) => {
    const arr = {};
    arr.ds = `${res[res.length - 1].data_time} - ${res[0].data_time}`;
    res.forEach((v) => {
      arr.gp_revenue = Number(arr.gp_revenue || 0) + Number(v.gp_revenue);
      arr.huawei_revenue = Number(arr.huawei_revenue || 0) + Number(v.huawei_revenue);
      arr.and_revenue = Number(arr.and_revenue || 0) + Number(v.and_revenue);
      arr.ios_revenue = Number(Number(arr.ios_revenue || 0) + Number(v.net_revenuea) + Number(v.net_revenueb)).toFixed(
        2,
      );
      arr.revenue = calcAdv ? (Number(arr.revenue || 0) + Number(v.revenue)).toFixed(2) : 0;
      arr.app_revenue = Number(Number(arr.app_revenue || 0) + Number(v.revenue_appa) + Number(v.revenue_appb)).toFixed(
        2,
      );
      arr.all_revenue = Number(
        Number(arr.all_revenue || 0)
          + Number(v.gp_revenue)
          + Number(v.and_revenue)
          + Number(v.net_revenuea)
          + Number(v.net_revenueb)
          + Number(v.huawei_revenue)
          + Number(calcAdv ? v.revenue : 0.0)
          + Number(v.revenue_appa)
          + Number(v.revenue_appb),
      ).toFixed(2);
    });
    return arr;
  };
  const getFetchData = async () => {
    setLoading(true);
    let data = [];
    if (dayType === '1') {
      const res = await getHoloData(getSQL(listSQL));
      data = res.map(v => ({
        gp_revenue: Number(v.gp_revenue).toFixed(2),
        and_revenue: Number(v.and_revenue).toFixed(2),
        ios_revenue: (Number(v.net_revenuea) + Number(v.net_revenueb)).toFixed(2),
        revenue: calcAdv ? Number(v.revenue).toFixed(2) : 0,
        app_revenue: (Number(v.revenue_appa) + Number(v.revenue_appb)).toFixed(2),
        huawei_revenue: Number(v.huawei_revenue).toFixed(2),
        ds: v.data_time,
        all_revenue: (
          Number(v.gp_revenue)
          + Number(v.and_revenue)
          + Number(v.net_revenuea)
          + Number(v.net_revenueb)
          + Number(v.huawei_revenue)
          + Number(calcAdv ? v.revenue : 0)
          + Number(v.revenue_appa)
          + Number(v.revenue_appb)
        ).toFixed(2),
      }));
    } else {
      const startYear = moment(search.startDate).year();
      const endYear = moment(search.endDate).year();
      const startMon = moment(search.startDate).month() + 1;
      const endMon = moment(search.endDate).month() + 1;
      const res = await getHoloData(getSQL(listSQL));
      if (res.length) {
        if (startYear === endYear && startMon === endMon) {
          const arr = getListData(res);
          data.push(arr);
        } else if (startYear === endYear && startMon !== endMon) {
          for (let i = endMon; i >= startMon; i--) {
            const list = res.filter(
              v => Number(moment(v.data_time).year()) === Number(startYear)
                && Number(moment(v.data_time).month()) + 1 === Number(i),
            );
            if (list.length) {
              const arr = getListData(list);
              data.push(arr);
            }
          }
        } else if (startYear !== endYear) {
          for (let i = endMon; i >= 1; i--) {
            const list = res.filter(
              v => Number(moment(v.data_time).year()) === Number(endYear)
                && Number(moment(v.data_time).month()) + 1 === Number(i),
            );
            if (list.length) {
              const arr = getListData(list);
              data.push(arr);
            }
          }
          if (endYear - startYear > 1) {
            for (let i = startYear + 1; i < endYear; i++) {
              for (let j = 12; j >= 1; j--) {
                const list = res.filter(
                  v => Number(moment(v.data_time).year()) === Number(i)
                    && Number(moment(v.data_time).month()) + 1 === Number(j),
                );
                if (list.length) {
                  const arr = getListData(list);
                  data.push(arr);
                }
              }
            }
          }
          for (let i = 12; i >= startMon; i--) {
            const list = res.filter(
              v => Number(moment(v.data_time).year()) === Number(startYear)
                && Number(moment(v.data_time).month()) + 1 === Number(i),
            );
            if (list.length) {
              const arr = getListData(list);
              data.push(arr);
            }
          }
        }
      }
    }
    setDataSource(data);
    setLoading(false);
  };

  useEffect(() => {
    getFetchData();
  }, [search, dayType]);
  return (
    <div>
      <Query search={search} onSearch={onSearch} />
      <DownLoadButton filename="收入数据展示" data={dataSource} columns={columns} />
      <RadioGroup value={dayType} style={{ marginTop: 20 }} onChange={e => setDayType(e.target.value)}>
        <RadioButton value="1" key="1">
          日
        </RadioButton>
        <RadioButton value="2" key="2">
          月
        </RadioButton>
      </RadioGroup>
      <Switch
        style={{ marginLeft: 5 }}
        checkedChildren="显示广告收入"
        unCheckedChildren="不显示广告收入"
        onChange={setShowFlag}
        checked={showFlag}
      />
      <Table
        style={{ marginTop: 20 }}
        bordered
        columns={showFlag ? columns : columns.filter(v => v.dataIndex !== 'revenue')}
        dataSource={dataSource}
        loading={loading}
        rowKey="ds"
      />
    </div>
  );
};
