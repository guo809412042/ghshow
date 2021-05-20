import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import { connect } from 'dva';
import Query from './components/Query';
import { createSqlWhere } from '../../../utils/utils';
import { getData } from '../../../utils/request';
import { DownLoadButton } from '../../common/DownLoadButton';
import { saleColumns, refColumns } from './const';
import {
  saleSQL, refSQL, saleAllSQL, refAllSQL,
} from './components/sqlTemplate';

const index = ({ app: { kpCountryType } }) => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(1, 'month'),
    endDate: moment().subtract(0, 'month'),
    appProduct: [],
    skuType: [],
    countryCode: [],
    channel: [],
    moneyType: 'rmb',
    conutryOperator: 'in',
    kpCountryTypeValue: [],
  });
  const [saleData, setSaleData] = useState([]);
  const [refData, setRefData] = useState([]);
  const onSearch = (value) => {
    setSearch(value);
  };
  const getSQL = (sql) => {
    let where = '';
    let where2 = '';
    if (search.appProduct.length) {
      where += ` and app_product in (${search.appProduct.map(v => `'${v}'`).join(',')}) `;
      where2 += ` and app_product in (${search.appProduct.map(v => `'${v}'`).join(',')}) `;
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
      where2 += `and subscription_type in (${search.subType.map(v => `'${v}'`).join(',')})`;
    }

    where += ` and charge_type = '${search.moneyType}'`;
    where2 += ` and charge_type = '${search.moneyType}'`;
    const fetchSQL = createSqlWhere({
      sql: sql.replace(/#where2#/g, where2),
      startDate: search.startDate,
      endDate: search.endDate,
      where,
      dateFormat: 'YYYYMM',
    });
    return fetchSQL;
  };
  const getSaleData = async () => {
    const res = await getData(getSQL(saleSQL));
    const resAll = await getData(getSQL(saleAllSQL));
    const data = [];
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
    setSaleData(data);
  };
  const getRefData = async () => {
    const res = await getData(getSQL(refSQL));
    const resAll = await getData(getSQL(refAllSQL));
    const data = [];
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
    setRefData(data);
  };
  useEffect(() => {
    getSaleData();
    getRefData();
  }, [search]);
  const fileNameSuffix = `${search.appProduct}-${search.channel}-${
    search.moneyType === 'dollar' ? '美元' : '人民币'
  }-${search.startDate.format('YYYY-MM')}-${search.endDate.format('YYYY-MM')}`;
  return (
    <div>
      <Query search={search} onSearch={onSearch} kpCountryType={kpCountryType}/>
      <h3 style={{ margin: 10 }}>销售数据汇总展示</h3>
      <DownLoadButton columns={saleColumns} data={saleData} filename={`销售数据汇总-${fileNameSuffix}`} />
      <Table dataSource={saleData} columns={saleColumns} bordered rowKey="key" scroll={{ x: 1500 }} />
      <h3 style={{ margin: 10 }}>退款数据汇总展示</h3>
      <DownLoadButton columns={refColumns} data={refData} filename={`退款数据汇总-${fileNameSuffix}`} />
      <Table dataSource={refData} columns={refColumns} bordered rowKey="key" scroll={{ x: 1500 }} />
    </div>
  );
};

export default connect(({ app }) => ({ app }))(index);
