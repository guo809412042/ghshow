/*
 * @Date: 2021-03-05 14:09:44
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-03-30 10:56:25
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
import { productMap } from './const';
import { DownLoadButton } from '../../common/DownLoadButton';
// import { chartRender } from './chartRender';


export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: undefined,
    appProduct: '',
    countries: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [allCountrydataSource, setAllCountrydataSource] = useState([]);
  // const [lastDataSource, setLastDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [chartLoading, setChartLoading] = useState(false);
  const onSearch = (value) => {
    setSearch(value);
  };

  const isEndDayOfMonth = (day) => {
    const res = moment(day).endOf('month').format('YYYYMMDD');
    return day === res;
  };

  const getScale = ({ molecular, denominator }) => {
    if (denominator === 0) {
      return '对比上月0';
    }
    return `对比上月${molecular > denominator ? +((molecular - denominator) / denominator * 100).toFixed(1) : ((molecular - denominator) / denominator * 100).toFixed(1)}`;
  };

  const parseData = (data) => {
    // console.log('data2', data);
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      element.ad_arpu_now = String(element.ad_arpu || 0).split('对比上月')[0];
      element.ad_arpu_last = String(element.ad_arpu || 0).split('对比上月')[1] || 0;
      element.ad_revenue_now = String(element.ad_revenue || 0).split('对比上月')[0];
      element.ad_revenue_last = String(element.ad_revenue || 0).split('对比上月')[1] || 0;
      element.all_amount_now = String(element.all_amount || 0).split('对比上月')[0];
      element.all_amount_last = String(element.all_amount || 0).split('对比上月')[1] || 0;
      element.all_arpu_now = String(element.all_arpu || 0).split('对比上月')[0];
      element.all_arpu_last = String(element.all_arpu || 0).split('对比上月')[1] || 0;
      element.mau_now = String(element.mau || 0).split('对比上月')[0];
      element.mau_last = String(element.mau || 0).split('对比上月')[1] || 0;
      element.real_amount_now = String(element.real_amount || 0).split('对比上月')[0];
      element.real_amount_last = String(element.real_amount || 0).split('对比上月')[1] || 0;
      element.reg_now = String(element.reg || 0).split('对比上月')[0];
      element.reg_last = String(element.reg || 0).split('对比上月')[1] || 0;
      element.reg_rate_now = String(element.reg_rate || 0).split('对比上月')[0];
      element.reg_rate_last = String(element.reg_rate || 0).split('对比上月')[1] || 0;
      element.sub_amount_now = String(element.sub_amount || 0).split('对比上月')[0];
      element.sub_amount_last = String(element.sub_amount || 0).split('对比上月')[1] || 0;
      element.sub_arpu_now = String(element.sub_arpu || 0).split('对比上月')[0];
      element.sub_arpu_last = String(element.sub_arpu || 0).split('对比上月')[1] || 0;
    }
    return data;
  };

  const getFetchData = async () => {
    // console.log('search', search);
    setLoading(true);
    let day = '';
    let where = ' 1 = 1 ';
    let sql = '';
    if (search.endDate) {
      day = search.endDate.format('YYYYMMDD') > moment().subtract(2, 'days').format('YYYYMMDD') ? moment().subtract(2, 'days').format('YYYYMMDD') : search.endDate.format('YYYYMMDD');
      // where += ` and ds = '${day}' `;
    } else {
      message.error('请选择日期');
      setLoading(false);
      return false;
    }
    if (search.countries && search.countries.length) {
      sql = listSQL;
      where += ` and country_name = '${search.countries}' `;
    } else {
      sql = allListSQL;
    }
    const fecthSQL = createSqlWhere({
      sql,
      where: `${where} and ds = '${day}' `,
    });
    const res = await getData(fecthSQL);
    const all = {
      product_id: 10000,
      platform_id: 0,
      ad_arpu: 0,
      ad_revenue: 0,
      all_amount: 0,
      all_arpu: 0,
      bonus: '0.7',
      ds: '20210306',
      mau: 0,
      real_amount: 0,
      reg: 0,
      reg_rate: 0,
      return_amount: 0,
      sub_amount: 0,
      sub_arpu: 0,
      product: 'all',
    };
    res.forEach((element) => {
      all.mau += (element.mau || 0);
      all.reg += (element.reg || 0);
      all.ad_revenue += (element.ad_revenue || 0);
      all.sub_amount += (element.sub_amount || 0);
      all.return_amount += (element.return_amount || 0);
      all.real_amount += (element.real_amount || 0);
      all.all_amount += (element.all_amount || 0);
      element.product = (element.product_id === 10000 ? 'all' : productMap[element.product_id] + (element.platform_id === 1 ? '－GP' : '－iOS'));
      element.key = `${element.product_id}-${element.platform_id}`;
    });
    all.reg_rate = (all.mau && all.reg) ? +(all.reg / all.mau).toFixed(3) : 0;
    // all.all_amount = (all.real_amount || 0) + (all.ad_revenue || 0);
    all.all_arpu = (all.mau && all.all_amount) ? +(all.all_amount / all.mau).toFixed(4) : 0;
    all.ad_arpu = (all.mau && all.ad_revenue) ? +(all.ad_revenue / all.mau).toFixed(4) : 0;
    all.sub_arpu = (all.mau && all.real_amount) ? +(all.real_amount / all.mau).toFixed(4) : 0;
    all.key = '10000-0';
    // console.log('all', all);
    // console.log('resresres', res);
    res.push(all);
    let lastday;
    if (isEndDayOfMonth(day)) {
      lastday = moment(day).subtract(1, 'months').endOf('month').format('YYYYMMDD');
      // let lastWhere = where;
      // where += ` and ds = '${lastday}' `;
    } else {
      lastday = moment(day).subtract(1, 'months').format('YYYYMMDD');
      // where += ` ds = '${lastday}' `;
    }
    const lastFecthSQL = createSqlWhere({
      sql,
      where: `${where} and ds = '${lastday}' `,
    });
    const lastRes = await getData(lastFecthSQL);
    // console.log('lastRes', lastRes);
    const lastResEnd = [];
    for (let index = 0; index < lastRes.length; index++) {
      const element = lastRes[index];
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        // if (item.product_id === element.product_id && element.product_id === 10000) {
        //   element.data = item;
        //   // break;
        // }
        if (item.product_id === element.product_id && item.platform_id === element.platform_id) {
          lastResEnd.push(element);
          break;
        }
      }
    }
    const lastAll = {
      product_id: 10000,
      platform_id: 0,
      ad_arpu: 0,
      ad_revenue: 0,
      all_amount: 0,
      all_arpu: 0,
      bonus: '0.7',
      ds: '20210306',
      mau: 0,
      real_amount: 0,
      reg: 0,
      reg_rate: 0,
      return_amount: 0,
      sub_amount: 0,
      sub_arpu: 0,
      product: 'all',
    };
    for (let index = 0; index < lastResEnd.length; index++) {
      const element = lastResEnd[index];
      lastAll.mau += (element.mau || 0);
      lastAll.reg += (element.reg || 0);
      lastAll.ad_revenue += (element.ad_revenue || 0);
      lastAll.sub_amount += (element.sub_amount || 0);
      lastAll.return_amount += (element.return_amount || 0);
      lastAll.real_amount += (element.real_amount || 0);
      lastAll.all_amount += (element.all_amount || 0);
      element.product = (element.product_id === 10000 ? productMap[element.product_id] : productMap[element.product_id] + (element.platform_id === 1 ? '－GP' : '－iOS'));
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        // if (item.product_id === element.product_id && element.product_id === 10000) {
        //   element.data = item;
        //   // break;
        // }
        if (item.product_id === element.product_id && item.platform_id === element.platform_id) {
          element.data = item;
          break;
        }
      }
    }
    lastAll.reg_rate = (lastAll.mau && lastAll.reg) ? +(lastAll.reg / lastAll.mau).toFixed(3) : 0;
    // all.all_amount = (all.real_amount || 0) + (all.ad_revenue || 0);
    lastAll.all_arpu = (lastAll.mau && lastAll.all_amount) ? +(lastAll.all_amount / lastAll.mau).toFixed(4) : 0;
    lastAll.ad_arpu = (lastAll.mau && lastAll.ad_revenue) ? +(lastAll.ad_revenue / lastAll.mau).toFixed(4) : 0;
    lastAll.sub_arpu = (lastAll.mau && lastAll.real_amount) ? +(lastAll.real_amount / lastAll.mau).toFixed(4) : 0;
    lastAll.data = all;
    lastResEnd.push(lastAll);
    for (let index = 0; index < lastResEnd.length; index++) {
      const element = lastResEnd[index];
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        if (item.product_id === element.product_id && item.platform_id === element.platform_id) {
          item.mau = `${item.mau || 0} ${getScale({ molecular: item.mau || 0, denominator: element.mau || 0 })} `;
          item.reg = `${item.reg || 0} ${getScale({ molecular: item.reg || 0, denominator: element.reg || 0 })} `;
          item.reg_rate = `${item.reg_rate || 0} ${getScale({ molecular: item.reg_rate || 0, denominator: element.reg_rate || 0 })} `;
          item.all_amount = `${item.all_amount || 0} ${getScale({ molecular: item.all_amount || 0, denominator: element.all_amount || 0 })} `;
          item.ad_revenue = `${item.ad_revenue || 0} ${getScale({ molecular: item.ad_revenue || 0, denominator: element.ad_revenue || 0 })} `;
          item.real_amount = `${item.real_amount || 0} ${getScale({ molecular: item.real_amount || 0, denominator: element.real_amount || 0 })} `;
          item.sub_amount = `${item.sub_amount || 0} ${getScale({ molecular: item.sub_amount || 0, denominator: element.sub_amount || 0 })} `;
          item.all_arpu = `${item.all_arpu || 0} ${getScale({ molecular: item.all_arpu || 0, denominator: element.all_arpu || 0 })} `;
          item.ad_arpu = `${item.ad_arpu || 0} ${getScale({ molecular: item.ad_arpu || 0, denominator: element.ad_arpu || 0 })} `;
          item.sub_arpu = `${item.sub_arpu || 0} ${getScale({ molecular: item.sub_arpu || 0, denominator: element.sub_arpu || 0 })} `;
        }
      }
    }
    lastResEnd.forEach((element) => {
      element.key = `${element.product_id}-${element.platform_id}-2`;
    });
    // console.log('lastResEnd', lastResEnd);
    // setLastDataSource(lastResEnd.sort((a, b) => a.product_id - b.product_id));
    // console.log('res', res);
    // gp 在前，按产品id排序；vd，mast最后
    const dataList = res.sort((a, b) => (a.product_id + a.platform_id) - (b.product_id + b.platform_id));
    const noVLdataList = dataList.filter(item => item.product_id !== 6 && item.product_id !== 42);
    const VLdataList = dataList.filter(item => item.product_id === 6 || item.product_id === 42);
    for (let index = 0; index < VLdataList.length; index++) {
      const element = VLdataList[index];
      noVLdataList.splice(noVLdataList.length - 1, 0, element);
    }
    // console.log('noVLdataList', noVLdataList);
    // console.log('parseData(JSON.parse(JSON.stringify(dataSource)))', parseData(JSON.parse(JSON.stringify(noVLdataList))));
    setDataSource(noVLdataList);
    setLoading(false);
  };

  const getFetchAllCountryData = async () => {
    // console.log('search', search);
    setLoading(true);
    let day = '';
    const where = ' 1 = 1 ';
    const sql = allCountryListSQL;
    if (search.endDate) {
      day = search.endDate.format('YYYYMMDD') > moment().subtract(2, 'days').format('YYYYMMDD') ? moment().subtract(2, 'days').format('YYYYMMDD') : search.endDate.format('YYYYMMDD');
      // where += ` and ds = '${day}' `;
    } else {
      // message.error('请选择日期');
      setLoading(false);
      return false;
    }
    const fecthSQL = createSqlWhere({
      sql,
      where: `${where} and ds = '${day}' `,
    });
    const res = await getData(fecthSQL);
    console.log('resresresres', res);
    let lastday;
    if (isEndDayOfMonth(day)) {
      lastday = moment(day).subtract(1, 'months').endOf('month').format('YYYYMMDD');
    } else {
      lastday = moment(day).subtract(1, 'months').format('YYYYMMDD');
    }
    const lastFecthSQL = createSqlWhere({
      sql,
      where: `${where} and ds = '${lastday}' `,
    });
    const lastRes = await getData(lastFecthSQL);
    const lastResEnd = [];
    for (let index = 0; index < lastRes.length; index++) {
      const element = lastRes[index];
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        if (item.product_id === element.product_id && item.platform_id === element.platform_id && item.country_name === element.country_name) {
          lastResEnd.push(element);
          break;
        }
      }
    }
    for (let index = 0; index < lastResEnd.length; index++) {
      const element = lastResEnd[index];
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        item.product = (item.product_id === 10000 ? productMap[item.product_id] : productMap[item.product_id] + (item.platform_id === 1 ? '－GP' : '－iOS'));
        if (item.product_id === element.product_id && item.platform_id === element.platform_id && item.country_name === element.country_name) {
          element.data = item;
          item.mau = `${item.mau || 0} ${getScale({ molecular: item.mau || 0, denominator: element.mau || 0 })} `;
          item.reg = `${item.reg || 0} ${getScale({ molecular: item.reg || 0, denominator: element.reg || 0 })} `;
          item.reg_rate = `${item.reg_rate || 0} ${getScale({ molecular: item.reg_rate || 0, denominator: element.reg_rate || 0 })} `;
          item.all_amount = `${item.all_amount || 0} ${getScale({ molecular: item.all_amount || 0, denominator: element.all_amount || 0 })} `;
          item.ad_revenue = `${item.ad_revenue || 0} ${getScale({ molecular: item.ad_revenue || 0, denominator: element.ad_revenue || 0 })} `;
          item.real_amount = `${item.real_amount || 0} ${getScale({ molecular: item.real_amount || 0, denominator: element.real_amount || 0 })} `;
          item.sub_amount = `${item.sub_amount || 0} ${getScale({ molecular: item.sub_amount || 0, denominator: element.sub_amount || 0 })} `;
          item.all_arpu = `${item.all_arpu || 0} ${getScale({ molecular: item.all_arpu || 0, denominator: element.all_arpu || 0 })} `;
          item.ad_arpu = `${item.ad_arpu || 0} ${getScale({ molecular: item.ad_arpu || 0, denominator: element.ad_arpu || 0 })} `;
          item.sub_arpu = `${item.sub_arpu || 0} ${getScale({ molecular: item.sub_arpu || 0, denominator: element.sub_arpu || 0 })} `;
        }
      }
    }
    lastResEnd.forEach((element) => {
      element.key = `${element.product_id}-${element.platform_id}-${element.country_name}-2`;
    });
    const dataList = res.sort((a, b) => (a.product_id + a.platform_id) - (b.product_id + b.platform_id));
    setAllCountrydataSource(dataList);
    setLoading(false);
  };
  useEffect(() => {
    getFetchData();
  }, [search]);
  useEffect(() => {
    getFetchAllCountryData();
  }, [search.endDate]);
  const renderTable = (text) => {
    // console.log('text', text);
    if (text === undefined) {
      // console.log('text', text);
      return '无比对数据';
    }
    const arr = String(text).split('对比上月');
    if (arr.length > 1) {
      return <span>{arr[0]}<br/>{arr[1] >= 0 ? <span style={{ color: 'red' }}>对比上月:{arr[1]}</span> : <span style={{ color: 'green' }}>对比上月:{arr[1]}</span>}</span>;
    }
    return <span>{arr[0]}<br/>对比上月:{0}</span>;
  };
  const columns = [
    {
      key: 'product',
      title: '产品',
      dataIndex: 'product',
      width: 100,
      fixed: 'left',
    },
    {
      key: 'mau', title: 'MAU', dataIndex: 'mau', render: text => renderTable(text || 0),
    },
    {
      key: 'reg', title: '新增', dataIndex: 'reg', render: text => renderTable(text || 0),
    },
    {
      key: 'reg_rate', title: '新增占比', dataIndex: 'reg_rate', render: text => renderTable(text || 0),
    },
    {
      key: 'all_amount', title: '总收入($)', dataIndex: 'all_amount', render: text => renderTable(text || 0),
    },
    {
      key: 'ad_revenue', title: '广告收入($)', dataIndex: 'ad_revenue', render: text => renderTable(text || 0),
    },
    {
      key: 'real_amount', title: '订阅净收入($)', dataIndex: 'real_amount', render: text => renderTable(text || 0),
    },
    {
      key: 'sub_amount', title: '订阅销售额($)', dataIndex: 'sub_amount', render: text => renderTable(text || 0),
    },
    {
      key: 'bonus', title: '分成比例', dataIndex: 'bonus', render: text => text || 0,
    },
    {
      key: 'all_arpu', title: '总ARPU($)', dataIndex: 'all_arpu', render: text => renderTable(text || 0),
    },
    {
      key: 'ad_arpu', title: '广告ARPU($)', dataIndex: 'ad_arpu', render: text => renderTable(text || 0),
    },
    {
      key: 'sub_arpu', title: '订阅ARPU($)', dataIndex: 'sub_arpu', render: text => renderTable(text || 0),
    },
  ];

  const columnsOut = [
    {
      key: 'product',
      title: '产品',
      dataIndex: 'product',
      width: 100,
      fixed: 'left',
    },
    {
      key: 'mau_now', title: 'MAU', dataIndex: 'mau', render: text => renderTable(text || 0),
    },
    {
      key: 'mau_last', title: 'MAU(对比上月)', dataIndex: 'mau', render: text => renderTable(text || 0),
    },
    {
      key: 'reg_now', title: '新增', dataIndex: 'reg', render: text => renderTable(text || 0),
    },
    {
      key: 'reg_last', title: '新增(对比上月)', dataIndex: 'reg', render: text => renderTable(text || 0),
    },
    {
      key: 'reg_rate_now', title: '新增占比', dataIndex: 'reg_rate', render: text => renderTable(text || 0),
    },
    {
      key: 'reg_rate_last', title: '新增占比(对比上月)', dataIndex: 'reg_rate', render: text => renderTable(text || 0),
    },
    {
      key: 'all_amount_now', title: '总收入($)', dataIndex: 'all_amount', render: text => renderTable(text || 0),
    },
    {
      key: 'all_amount_last', title: '总收入($)(对比上月)', dataIndex: 'all_amount', render: text => renderTable(text || 0),
    },
    {
      key: 'ad_revenue_now', title: '广告收入($)', dataIndex: 'ad_revenue', render: text => renderTable(text || 0),
    },
    {
      key: 'ad_revenue_last', title: '广告收入($)(对比上月)', dataIndex: 'ad_revenue', render: text => renderTable(text || 0),
    },
    {
      key: 'real_amount_now', title: '订阅净收入($)', dataIndex: 'real_amount', render: text => renderTable(text || 0),
    },
    {
      key: 'real_amount_last', title: '订阅净收入($)(对比上月)', dataIndex: 'real_amount', render: text => renderTable(text || 0),
    },
    {
      key: 'sub_amount_now', title: '订阅销售额($)', dataIndex: 'sub_amount', render: text => renderTable(text || 0),
    },
    {
      key: 'sub_amount_last', title: '订阅销售额($)(对比上月)', dataIndex: 'sub_amount', render: text => renderTable(text || 0),
    },
    {
      key: 'bonus', title: '分成比例', dataIndex: 'bonus', render: text => text || 0,
    },
    {
      key: 'all_arpu_now', title: '总ARPU($)', dataIndex: 'all_arpu', render: text => renderTable(text || 0),
    },
    {
      key: 'all_arpu_last', title: '总ARPU($)(对比上月)', dataIndex: 'all_arpu', render: text => renderTable(text || 0),
    },
    {
      key: 'ad_arpu_now', title: '广告ARPU($)', dataIndex: 'ad_arpu', render: text => renderTable(text || 0),
    },
    {
      key: 'ad_arpu_last', title: '广告ARPU($)(对比上月)', dataIndex: 'ad_arpu', render: text => renderTable(text || 0),
    },
    {
      key: 'sub_arpu_now', title: '订阅ARPU($)', dataIndex: 'sub_arpu', render: text => renderTable(text || 0),
    },
    {
      key: 'sub_arpu_last', title: '订阅ARPU($)(对比上月)', dataIndex: 'sub_arpu', render: text => renderTable(text || 0),
    },
  ];
  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <DownLoadButton filename="月ARPU" columns={columnsOut} data={parseData(JSON.parse(JSON.stringify(dataSource)))} />
      <DownLoadButton title="导出所有国家" filename="月ARPU(所有国家)" columns={[{
        key: 'country_name',
        title: '国家',
        dataIndex: 'country_name',
      }].concat(columnsOut)} data={parseData(JSON.parse(JSON.stringify(allCountrydataSource)))} />
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
      {/* <Table
        // style={{ marginTop: 20 }}
        // rowKey="data_time"
        bordered
        // showHeader={false}
        title={() => '对比上月(%)'}
        columns={lastColumns}
        dataSource={lastDataSource}
        loading={loading}
        scroll={{ x: 1600 }}
        pagination={false}
        size="small"
      /> */}
    </div>
  );
};
