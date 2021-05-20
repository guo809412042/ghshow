/*
 * @Date: 2021-03-05 14:09:44
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-03-30 11:27:47
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-restricted-syntax */
/* eslint-disable for-direction */
/* eslint-disable no-await-in-loop */

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, message,
} from 'antd';
import Query from './components/Query';
import { createSqlWhere } from '../../../utils/utils';
import { listSQL, allListSQL, allCountryListSQL } from './components/sqlTemplate';
import { getData } from '../../../utils/request';
import { productMap, columnsout } from './const';
import { DownLoadButton } from '../../common/DownLoadButton';
// import { chartRender } from './chartRender';


export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(2, 'days'),
    appProduct: '',
    countries: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [allDataSource, setAllDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [chartLoading, setChartLoading] = useState(false);
  const onSearch = (value) => {
    setSearch(value);
  };

  const getScale = ({ molecular, denominator }) => {
    if (denominator === 0) {
      return 0;
    }
    return molecular > denominator ? +((molecular - denominator) / denominator * 100).toFixed(1) : +((molecular - denominator) / denominator * 100).toFixed(1);
  };

  const getFetchData = async () => {
    console.log('search', search);
    setLoading(true);
    let day = '';
    let where = ' 1 = 1 ';
    let lastWhere = ' 1 = 1 ';
    let sql = '';
    if (search.endDate) {
      day = search.endDate.format('YYYYMMDD') > moment().subtract(2, 'days').format('YYYYMMDD') ? moment().subtract(2, 'days').format('YYYYMMDD') : search.endDate.format('YYYYMMDD');
      where += ` and ds >= ${moment(day).subtract(6, 'days').format('YYYYMMDD')} and ds <= ${day} `;
      lastWhere += ` and ds >= ${moment(day).subtract(14, 'days').format('YYYYMMDD')} and ds <= ${moment(day).subtract(8, 'days').format('YYYYMMDD')} `;
    } else {
      message.error('请选择日期');
      setLoading(false);
      return false;
    }
    if (search.countries && search.countries.length) {
      sql = listSQL;
      where += ` and country_name = '${search.countries}' `;
      lastWhere += ` and country_name = '${search.countries}' `;
    } else {
      sql = allListSQL;
    }
    const fecthSQL = createSqlWhere({
      sql,
      where: `${where} `,
    });
    const res = await getData(fecthSQL);

    // const lastday = moment(day).subtract(1, 'months').format('YYYYMMDD');
    // where += ` ds = '${lastday}' `;
    const lastFecthSQL = createSqlWhere({
      sql,
      where: `${lastWhere}  `,
    });
    const lastRes = await getData(lastFecthSQL);
    const lastResEnd = [];
    for (let index = 0; index < lastRes.length; index++) {
      const element = lastRes[index];
      element.product = (element.product_id === 10000 ? 'all' : productMap[element.product_id] + (element.platform_id === 1 ? '－GP' : '－iOS'));
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        if (item.product_id === element.product_id && item.platform_id === element.platform_id) {
          const data = {
            platform_id: element.platform_id,
            product_id: element.product_id,
            // `${item.reg_rate} ${getScale({ molecular: item.reg_rate || 0, denominator: element.reg_rate || 0 })} `;
            adau_last: element.adau || 0,
            areg_last: element.areg || 0,
            regrate_last: element.regrate || 0,
            ad_revenue_last: element.ad_revenue || 0,
            ad_arpu_last: element.ad_arpu || 0,
            ecpm_last: element.ecpm || 0,
            sub_amount_last: element.sub_amount || 0,
            sub_arpu_last: element.sub_arpu || 0,
          };
          lastResEnd.push(data);
          res[n] = Object.assign(data, item);
        }
      }
    }
    const all = {
      product_id: 10000,
      ds: '20210306',
      product: 'all',
      bonus: '0.7',
      platform_id: 0,
      ad_arpu: 0,
      ad_revenue: 0,
      all_amount: 0,
      all_arpu: 0,
      adau: 0,
      ecpm: 0,
      ecpm_last: 0,
      real_amount: 0,
      areg: 0,
      regrate: 0,
      return_amount: 0,
      sub_amount: 0,
      sub_arpu: 0,
      ad_arpu_last: 0,
      ad_revenue_last: 0,
      all_amount_last: 0,
      all_arpu_last: 0,
      adau_last: 0,
      real_amount_last: 0,
      areg_last: 0,
      regrate_last: 0,
      return_amount_last: 0,
      sub_amount_last: 0,
      sub_arpu_last: 0,
    };
    res.forEach((element) => {
      all.adau += (element.adau || 0);
      all.areg += (element.areg || 0);
      all.ad_revenue += (element.ad_revenue || 0);
      all.ecpm += (element.ecpm || 0);
      all.ad_arpu += (element.ad_arpu || 0);
      all.sub_amount += (element.sub_amount || 0);
      all.adau_last += (element.adau_last || 0);
      all.areg_last += (element.areg_last || 0);
      all.ad_revenue_last += (element.ad_revenue_last || 0);
      all.ecpm_last += (element.ecpm_last || 0);
      all.ad_arpu_last += (element.ad_arpu_last || 0);
      all.sub_amount_last += (element.sub_amount_last || 0);
      element.product = (element.product_id === 10000 ? 'all' : productMap[element.product_id] + (element.platform_id === 1 ? '－GP' : '－iOS'));
      element.key = `${element.product_id}-${element.platform_id}`;
    });
    all.sub_arpu = (all.areg && all.sub_amount) ? +(all.sub_amount / all.areg).toFixed(4) : 0;
    all.regrate = (all.areg && all.adau) ? +(all.areg / all.adau).toFixed(3) : 0;
    all.ecpm = all.ecpm ? +((all.ecpm / 7).toFixed(4)) : 0;
    all.ad_arpu = all.ad_arpu ? +((all.ad_arpu / 7).toFixed(4)) : 0;
    all.ad_arpu_last = all.ad_arpu_last ? +((all.ad_arpu_last / 7).toFixed(4)) : 0;
    all.sub_arpu_last = (all.areg_last && all.sub_amount_last) ? +(all.sub_amount_last / all.areg_last).toFixed(4) : 0;
    all.regrate_last = (all.areg_last && all.adau_last) ? +(all.areg_last / all.adau_last).toFixed(3) : 0;
    all.ecpm_last = all.ecpm_last ? +((all.ecpm_last / 7).toFixed(4)) : 0;
    all.key = '10000-0';
    console.log('all', all);
    res.push(all);
    res.forEach((item) => {
      item.adau_last_rate = getScale({ molecular: item.adau || 0, denominator: item.adau_last || 0 });
      item.areg_last_rate = getScale({ molecular: item.areg || 0, denominator: item.areg_last || 0 });
      item.regrate_last_rate = getScale({ molecular: item.regrate || 0, denominator: item.regrate_last || 0 });
      item.ad_revenue_last_rate = getScale({ molecular: item.ad_revenue || 0, denominator: item.ad_revenue_last || 0 });
      item.ad_arpu_last_rate = getScale({ molecular: item.ad_arpu || 0, denominator: item.ad_arpu_last || 0 });
      item.ecpm_last_rate = getScale({ molecular: item.ecpm || 0, denominator: item.ecpm_last || 0 });
      item.sub_amount_last_rate = getScale({ molecular: item.sub_amount || 0, denominator: item.sub_amount_last || 0 });
      item.sub_arpu_last_rate = getScale({ molecular: item.sub_arpu || 0, denominator: item.sub_arpu_last || 0 });
    });
    console.log('lastRes', lastRes);
    console.log('resresres', res);
    // lastRes.push()
    // console.log('res', res);
    const dataList = res.sort((a, b) => (a.product_id + a.platform_id) - (b.product_id + b.platform_id));
    const noVLdataList = dataList.filter(item => item.product_id !== 6 && item.product_id !== 42);
    const VLdataList = dataList.filter(item => item.product_id === 6 || item.product_id === 42);
    for (let index = 0; index < VLdataList.length; index++) {
      const element = VLdataList[index];
      noVLdataList.splice(noVLdataList.length - 1, 0, element);
    }
    const dataListLast = lastRes.sort((a, b) => a.product_id - b.product_id);
    const noVLdataListLast = dataListLast.filter(item => item.product_id !== 6 && item.product_id !== 42);
    const VLdataListLast = dataListLast.filter(item => item.product_id === 6 || item.product_id === 42);
    for (let index = 0; index < VLdataList.length; index++) {
      const element = VLdataListLast[index];
      noVLdataListLast.splice(noVLdataListLast.length - 1, 0, element);
    }
    setDataSource(noVLdataList);
    // setLastDataSource(noVLdataListLast);
    setLoading(false);
  };
  const getFetchAllCountryData = async () => {
    console.log('search', search);
    setLoading(true);
    let day = '';
    let where = ' 1 = 1 ';
    let lastWhere = ' 1 = 1 ';
    const sql = allCountryListSQL;
    if (search.endDate) {
      day = search.endDate.format('YYYYMMDD') > moment().subtract(2, 'days').format('YYYYMMDD') ? moment().subtract(2, 'days').format('YYYYMMDD') : search.endDate.format('YYYYMMDD');
      where += ` and ds >= ${moment(day).subtract(6, 'days').format('YYYYMMDD')} and ds <= ${day} `;
      lastWhere += ` and ds >= ${moment(day).subtract(14, 'days').format('YYYYMMDD')} and ds <= ${moment(day).subtract(8, 'days').format('YYYYMMDD')} `;
    } else {
      message.error('请选择日期');
      setLoading(false);
      return false;
    }
    // if (search.countries && search.countries.length) {
    //   sql = listSQL;
    //   where += ` and country_name = '${search.countries}' `;
    //   lastWhere += ` and country_name = '${search.countries}' `;
    // } else {
    //   sql = allListSQL;
    // }
    const fecthSQL = createSqlWhere({
      sql,
      where: `${where} `,
    });
    const res = await getData(fecthSQL);

    // const lastday = moment(day).subtract(1, 'months').format('YYYYMMDD');
    // where += ` ds = '${lastday}' `;
    const lastFecthSQL = createSqlWhere({
      sql,
      where: `${lastWhere}  `,
    });
    const lastRes = await getData(lastFecthSQL);
    const lastResEnd = [];
    for (let index = 0; index < lastRes.length; index++) {
      const element = lastRes[index];
      element.product = (element.product_id === 10000 ? 'all' : productMap[element.product_id] + (element.platform_id === 1 ? '－GP' : '－iOS'));
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        item.product = (item.product_id === 10000 ? 'all' : productMap[item.product_id] + (item.platform_id === 1 ? '－GP' : '－iOS'));
        if (item.product_id === element.product_id && item.platform_id === element.platform_id && item.country_name === element.country_name) {
          const data = {
            platform_id: element.platform_id,
            product_id: element.product_id,
            // `${item.reg_rate} ${getScale({ molecular: item.reg_rate || 0, denominator: element.reg_rate || 0 })} `;
            adau_last: element.adau || 0,
            areg_last: element.areg || 0,
            regrate_last: element.regrate || 0,
            ad_revenue_last: element.ad_revenue || 0,
            ad_arpu_last: element.ad_arpu || 0,
            ecpm_last: element.ecpm || 0,
            sub_amount_last: element.sub_amount || 0,
            sub_arpu_last: element.sub_arpu || 0,
          };
          lastResEnd.push(data);
          res[n] = Object.assign(data, item);
        }
      }
    }
    res.forEach((item) => {
      item.adau_last_rate = getScale({ molecular: item.adau || 0, denominator: item.adau_last || 0 });
      item.areg_last_rate = getScale({ molecular: item.areg || 0, denominator: item.areg_last || 0 });
      item.regrate_last_rate = getScale({ molecular: item.regrate || 0, denominator: item.regrate_last || 0 });
      item.ad_revenue_last_rate = getScale({ molecular: item.ad_revenue || 0, denominator: item.ad_revenue_last || 0 });
      item.ad_arpu_last_rate = getScale({ molecular: item.ad_arpu || 0, denominator: item.ad_arpu_last || 0 });
      item.ecpm_last_rate = getScale({ molecular: item.ecpm || 0, denominator: item.ecpm_last || 0 });
      item.sub_amount_last_rate = getScale({ molecular: item.sub_amount || 0, denominator: item.sub_amount_last || 0 });
      item.sub_arpu_last_rate = getScale({ molecular: item.sub_arpu || 0, denominator: item.sub_arpu_last || 0 });
    });
    // console.log('lastRes', lastRes);
    // console.log('resresres', res);
    // lastRes.push()
    // console.log('res', res);
    const dataList = res.sort((a, b) => (a.product_id + a.platform_id) - (b.product_id + b.platform_id));
    // console.log('dataListdataListdataList', dataList);
    setAllDataSource(dataList);
    // setLastDataSource(noVLdataListLast);
    setLoading(false);
  };
  useEffect(() => {
    getFetchData();
  }, [search]);

  useEffect(() => {
    getFetchAllCountryData();
  }, [search.endDate]);


  const renderTable = text => <span>{text >= 0 ? <span style={{ color: 'red' }}>{text}</span> : <span style={{ color: 'green' }}>{text}</span>}</span>;

  const columns = [
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
      width: 100,
      fixed: 'left',
    },
    {
      title: '详细数据',
      children: [
        {
          title: '日均DAU',
          dataIndex: 'adau',
          key: 'adau',
          render: text => (text ? Number(text) : 0),
        },
        {
          title: '日均新增',
          dataIndex: 'areg',
          key: 'areg',
          render: text => (text ? Number(text) : 0),
        },
        {
          title: '新增占比',
          dataIndex: 'regrate',
          key: 'regrate',
          render: text => (text ? Number(text) : 0),
        },
        {
          title: '日均广告收入',
          dataIndex: 'ad_revenue',
          key: 'ad_revenue',
          render: text => (text ? Number(text) : 0),
        },
        {
          title: '日均广告ARPU',
          dataIndex: 'ad_arpu',
          key: 'ad_arpu',
          render: text => (text ? Number(text) : 0),
        },
        {
          title: '日均ecpm',
          dataIndex: 'ecpm',
          key: 'ecpm',
          render: text => (text ? Number(text) : 0),
        },
        {
          title: '日均订阅销售额',
          dataIndex: 'sub_amount',
          key: 'sub_amount',
          render: text => (text ? Number(text) : 0),
        },
        {
          title: '日均订阅销售额ARPU',
          dataIndex: 'sub_arpu',
          key: 'sub_arpu',
          render: text => (text ? Number(text) : 0),
        },
      ],
    },
    {
      title: '对比上周(%)',
      children: [
        {
          title: '日均DAU',
          dataIndex: 'adau_last_rate',
          key: 'adau_last_rate',
          render: text => renderTable(text || 0),
        },
        {
          title: '日均新增',
          dataIndex: 'areg_last_rate',
          key: 'areg_last_rate',
          render: text => renderTable(text || 0),
        },
        {
          title: '新增占比',
          dataIndex: 'regrate_last_rate',
          key: 'regrate_last_rate',
          render: text => renderTable(text || 0),
        },
        {
          title: '日均广告收入',
          dataIndex: 'ad_revenue_last_rate',
          key: 'ad_revenue_last_rate',
          render: text => renderTable(text || 0),
        },
        {
          title: '日均广告ARPU',
          dataIndex: 'ad_arpu_last_rate',
          key: 'ad_arpu_last_rate',
          render: text => renderTable(text || 0),
        },
        {
          title: '日均ecpm',
          dataIndex: 'ecpm_last_rate',
          key: 'ecpm_last_rate',
          render: text => renderTable(text || 0),
        },
        {
          title: '日均订阅销售额',
          dataIndex: 'sub_amount_last_rate',
          key: 'sub_amount_last_rate',
          render: text => renderTable(text || 0),
        },
        {
          title: '日均订阅销售额ARPU',
          dataIndex: 'sub_arpu_last_rate',
          key: 'sub_arpu_last_rate',
          render: text => renderTable(text || 0),
        },
      ],
    },
  ];

  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <DownLoadButton filename={`周ARPU-${search.endDate.format('YYYYMMDD')}`} columns={columnsout} data={dataSource} />
      <DownLoadButton title="导出所有国家" filename={`周ARPU(所有国家)-${search.endDate.format('YYYYMMDD')}`} columns={[{
        key: 'country_name',
        title: '国家',
        dataIndex: 'country_name',
      }].concat(columnsout)} data={allDataSource} />
      <Table
        style={{ marginTop: 20 }}
        // rowKey="data_time"
        bordered
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: 1600 }}
        pagination={false}
        size="small"
      />
    </div>
  );
};
