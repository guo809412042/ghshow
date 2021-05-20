import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import { connect } from 'dva';
import Query from './components/Query';
import { createSqlWhere } from '../../../utils/utils';
import { getData } from '../../../utils/request';
import {
  saleSQL, refSQL, saleAllSQL, refAllSQL,
} from './components/sqlTemplate';
import { saleColumns, refColumns } from './const';
import { DownLoadButton } from '../../common/DownLoadButton';

const index = ({ app: { kpCountryType } }) => {
  // console.log('app', kpCountryType);
  const [search, setSearch] = useState({
    startDate: moment().subtract(2, 'month'),
    endDate: moment().subtract(1, 'month'),
    appProduct: ['VivaVideo'],
    skuType: [],
    countryCode: [],
    channel: [],
    moneyType: 'rmb',
    valueType: '收入',
    conutryOperator: 'in',
    kpCountryTypeValue: [],
  });
  const [saleData, setSaleData] = useState([]);
  const [refData, setRefData] = useState([]);
  const onSearch = (value) => {
    setSearch(value);
  };

  // 筛选整行为0或空的记录
  const notEmptyRow = (datas = [], columns = []) => {
    const results = datas.filter((item) => {
      let allZero = true;
      columns.forEach((title) => {
        const value = item[title];
        if (!(value === undefined || value === null || Number(value) === 0)) {
          allZero = false;
        }
      });
      return !allZero;
    });
    return results;
  };

  const getSQL = (sql) => {
    let where = '';
    if (search.appProduct.length) {
      where += ` and app_product in (${search.appProduct.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.channel.length) {
      where += ` and channel in (${search.channel.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.skuType.length) {
      where += ` and sku_type in (${search.skuType.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.countryCode.length) {
      where += ` and country_code ${search.conutryOperator} (${search.countryCode.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.kpCountryTypeValue.length) {
      where += ` and kp_country_type ${search.conutryOperator} (${search.kpCountryTypeValue.map(v => `'${v}'`).join(',')}) `;
    }
    if (search?.subType?.length) {
      where += `and subscription_type in (${search.subType.map(v => `'${v}'`).join(',')})`;
    }

    where += ` and currency_type = '${search.moneyType}'`;
    where += ` and value_type = '${search.valueType}'`;
    const fetchSQL = createSqlWhere({
      sql,
      startDate: search.startDate,
      endDate: search.endDate,
      where,
      dateFormat: 'YYYYMM',
    });
    return fetchSQL;
  };

  // // 循环获取数据，突破接口查询限制10000条记录
  // const circleGetData = async (sql) => {
  //   const step = 10000;
  //   let current = 0;
  //   let dataLength = 0;
  //   let results = [];
  //   do {
  //     const stepSQL = sql
  //       .replace(/#from#/g, current)
  //       .replace(/#to#/g, step);
  //     const res = await getData(stepSQL);
  //     dataLength = res.length;
  //     current += dataLength;
  //     results = results.concat(res);
  //   } while (dataLength > step - 2);
  //   return results;
  // };

  const getSaleData = async () => {
    const res = await getData(getSQL(saleSQL));
    const resAll = await getData(getSQL(saleAllSQL));
    let data = [];
    resAll.forEach((v, index) => {
      data.push({
        ...v,
        key: `all-${index}`,
        country_code: search.countryCode.length
          ? `${search.conutryOperator === 'in' ? '包含' : '不包含'}(${search.countryCode.join(',')})`
          : '全部',
        kp_country_type: search.kpCountryTypeValue.length
          ? `${search.conutryOperator === 'in' ? '包含' : '不包含'}(${search.kpCountryTypeValue.join(',')})`
          : '全部',
        app_product: search.appProduct.length ? search.appProduct.join('|') : '全部',
        channel: search.channel.length ? search.channel.join('|') : '全部',
        sku_type: search.skuType.length ? search.skuType.join('|') : '全部',
      });
    });

    res.forEach((v, index) => {
      data.push({
        ...v,
        key: index,
      });
    });
    data = notEmptyRow(data, [
      'current_order_to_amortize_amount',
      'current_order_amortized_amount',
      'current_order_to_amortize_in_future_amount',
      'current_order_to_amortize_over_1y_amount',
      'his_order_to_amorize_amount',
      'his_order_amorized_amount',
      'his_order_to_amortize_in_future_amount',
      'his_order_to_amortize_over_1y_amount',
      'current_order_to_amortiz_in_future_amount_12',
      'his_order_to_amortiz_in_future_amount_12',
    ]);
    setSaleData(data);
  };
  const getRefData = async () => {
    const res = await getData(getSQL(refSQL));
    const resAll = await getData(getSQL(refAllSQL));
    let data = [];
    resAll.forEach((v, index) => {
      data.push({
        ...v,
        key: `all-${index}`,
        country_code: search.countryCode.length
          ? `${search.conutryOperator === 'in' ? '包含' : '不包含'}(${search.countryCode.join(',')})`
          : '全部',
        kp_country_type: search.kpCountryTypeValue.length
          ? `${search.conutryOperator === 'in' ? '包含' : '不包含'}(${search.kpCountryTypeValue.join(',')})`
          : '全部',
        app_product: search.appProduct.length ? search.appProduct.join('|') : '全部',
        channel: search.channel.length ? search.channel.join('|') : '全部',
        sku_type: search.skuType.length ? search.skuType.join('|') : '全部',
      });
    });
    res.forEach((v, index) => {
      data.push({
        ...v,
        key: index,
      });
    });
    data = notEmptyRow(data, [
      'current_refund_order_to_amortize_amount',
      'current_refund_order_amortized_amount',
      'current_refund_order_to_amortize_in_future_amount',
      'current_refund_order_to_amortize_over_1y_amount',
      'his_refund_order_to_amorize_amount',
      'his_refund_order_amorized_amount',
      'his_refund_order_to_amortize_in_future_amount',
      'his_refund_order_to_amortize_over_1y_amount',
      'current_order_to_amortiz_in_future_amount_12',
      'his_order_to_amortiz_in_future_amount_12',
    ]);
    setRefData(data);
  };
  useEffect(() => {
    getSaleData();
    getRefData();
  }, [search]);
  const fileNameSuffix = `${search.appProduct}-${search.channel}-${search.moneyType === 'dollar' ? '美元' : '人民币'}-${
    search.valueType
  }-${search.startDate.format('YYYY-MM')}-${search.endDate.format('YYYY-MM')}`;
  return (
    <div>
      <Query search={search} onSearch={onSearch} kpCountryType={kpCountryType}/>
      <h3 style={{ margin: 10 }}>销售数据汇总展示</h3>
      <DownLoadButton columns={saleColumns} data={saleData} filename={`销售摊销数据汇总-${fileNameSuffix}`} />
      <Table dataSource={saleData} columns={saleColumns} bordered rowKey="key" scroll={{ x: 1500 }} />
      <h3 style={{ margin: 10 }}>退款数据汇总展示</h3>
      <DownLoadButton columns={refColumns} data={refData} filename={`退款摊销数据汇总-${fileNameSuffix}`} />
      <Table dataSource={refData} columns={refColumns} bordered rowKey="key" scroll={{ x: 1500 }} />
    </div>
  );
};

export default connect(({ app }) => ({ app }))(index);
