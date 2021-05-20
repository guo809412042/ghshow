/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, Radio, Tooltip, Icon,
} from 'antd';
import _ from 'lodash';
import Query from './components/Query';
import { DownLoadButton } from '../../common/DownLoadButton';
import {
  createSqlWhere, getFixed,
} from '../../../utils/utils';
import { getData } from '../../../utils/request';
import { fields, groups } from './const';
import { listSQL, listMonthSQL, allTtid } from './components/sqlTemplate';

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    appProduct: [],
    countryName: [],
    countryCode: [],
    platform: undefined,
    appTtid: [],
    conutryOperator: 'in',
    isNew: '0',
    mediaSource: [],
  });
  const [dayType1, setDayType1] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [allTtidList, setAllTtidList] = useState([]);
  const onSearch = (values) => {
    setSearch(values);
  };

  const gatAllTtid = async () => {
    const res = await getData(allTtid);
    setAllTtidList(res);
  };

  const columns = [
    { dataIndex: 'ds', key: 'ds', title: '日期' },
    { dataIndex: 'media_source', key: 'media_source', title: '渠道' },
    { dataIndex: 'ttid', key: 'ttid', title: '素材id' },
    { dataIndex: 'country_name', key: 'country_name', title: '地区' },
    {
      dataIndex: 'spend', key: 'spend', title: '投放成本', sorter: (a, b) => a.spend - b.spend, render: text => getFixed(text),
    },
    {
      dataIndex: 'impressions', key: 'impressions', title: '展示量', sorter: (a, b) => a.impressions - b.impressions,
    },
    {
      dataIndex: 'ecpm', key: 'ecpm', title: 'ecpm', sorter: (a, b) => a.ecpm - b.ecpm,
    },
    {
      dataIndex: 'clicks', key: 'clicks', title: '点击量', sorter: (a, b) => a.clicks - b.clicks,
    },
    {
      dataIndex: 'ctr', key: 'ctr', title: '点击率(%)', sorter: (a, b) => a.ctr - b.ctr,
    },
    {
      dataIndex: 'installs', key: 'installs', title: '新增', sorter: (a, b) => a.installs - b.installs,
    },
    {
      dataIndex: 'amount', key: 'amount', title: '销售额', sorter: (a, b) => a.amount - b.amount, render: text => getFixed(text),
    },
    {
      dataIndex: 'refund_amount', key: 'refund_amount', title: '退款额', sorter: (a, b) => a.refund_amount - b.refund_amount, render: text => getFixed(text),
    },
    {
      dataIndex: 'revenue', key: 'revenue', title: '实际收入', sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      dataIndex: 'roi', key: 'roi', title: 'roi', sorter: (a, b) => a.roi - b.roi,
    },
  ];

  const getSQLData = async (sql, startDate = search.startDate, endDate = search.endDate) => {
    let where = '';
    if (search.appProduct.length) {
      where += ` and product_id in (${search.appProduct.map(v => `'${v}'`).join(',')})`;
    }
    if (search.platform) {
      where += ` and platform = ${search.platform}`;
    }
    if (search.mediaSource && search.mediaSource.length) {
      where += ` and media_source ${search.conutryOperator} (${search.mediaSource.map(v => `'${v}'`).join(',')})`;
    }
    if (search.appTtid.length) {
      where += ` and ttid ${search.conutryOperator} (${search.appTtid.map(v => `'${v}'`).join(',')})`;
    }
    if (search.countryCode.length) {
      where += ` and country_code ${search.conutryOperator} (${search.countryCode.map(v => `'${v}'`).join(',')})`;
    }
    const where1 = _.clone(where);
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
  const getFetchData = async () => {
    if (dayType1 === '1') {
      const res = await getSQLData(listSQL);
      const dataSource = [];
      const allRes = {
        spend: 0,
        impressions: 0,
        ecpm: 0,
        clicks: 0,
        ctr: 0,
        installs: 0,
        amount: 0,
        refund_amount: 0,
        bonus: 0,
        revenue: 0,
        roi: 0,
      };
      const countryBonus = {};
      const countryAmount = {};
      const countryRefundAmount = {};
      res.forEach((v) => {
        allRes.spend += v.spend;
        allRes.impressions += v.impressions;
        allRes.clicks += v.clicks;
        allRes.installs += v.installs;
        allRes.amount += v.amount;
        allRes.refund_amount += v.refund_amount;
        allRes.bonus += v.bonus;
        countryBonus[v.country_code] = v.bonus;
        if (countryAmount[v.country_code]) {
          countryAmount[v.country_code] += v.amount;
        } else {
          countryAmount[v.country_code] = v.amount;
        }
        if (countryRefundAmount[v.country_code]) {
          countryRefundAmount[v.country_code] += v.refund_amount;
        } else {
          countryRefundAmount[v.country_code] = v.refund_amount;
        }
        dataSource.push({
          ...v,
          key: v.ttid + v.media_source + v.product_id + v.ds + v.platform + v.country_code,
          ecpm: getFixed(v.impressions / v.spend / 1000),
          revenue: getFixed((v.amount - v.refund_amount) * v.bonus),
          roi: getFixed((v.amount - v.refund_amount) * v.bonus / v.spend),
          ctr: getFixed(v.clicks / v.impressions * 100),
        });
      });
      allRes.ecpm = getFixed(allRes.impressions / allRes.spend / 1000);
      allRes.roi = 0;
      allRes.ctr = getFixed(allRes.clicks / allRes.impressions * 100);
      allRes.revenue = 0;
      for (const key in countryAmount) {
        const element = countryAmount[key];
        allRes.revenue += ((element - countryRefundAmount[key]) * countryBonus[key]);
      }

      allRes.revenue = getFixed(allRes.revenue);
      allRes.roi = getFixed(allRes.revenue / allRes.spend);

      const allData = {};
      if (res.length) {
        for (const i of Object.keys(fields)) {
          allData[i] = allRes[i] || 0;
        }
        allData.ds = '合计';
        for (const i in groups) {
          if (i === 'country_name') {
            allData.country_name = '合计';
          }
          if (i === 'media_source') {
            allData.media_source = '合计';
          }
          if (i === 'ttid') {
            allData.ttid = '合计';
          }
        }
      }
      const data = [allData].concat(dataSource).map((v, key) => ({
        ...v,
        key,
      }));
      setDataSource(data);
    } else {
      const res = await getSQLData(listMonthSQL);
      const dataSource = [];
      const allRes = {
        spend: 0,
        impressions: 0,
        ecpm: 0,
        clicks: 0,
        ctr: 0,
        installs: 0,
        amount: 0,
        refund_amount: 0,
        bonus: 0,
        revenue: 0,
        roi: 0,
      };
      const countryBonus = {};
      const countryAmount = {};
      const countryRefundAmount = {};
      res.forEach((v) => {
        allRes.spend += v.spend;
        allRes.impressions += v.impressions;
        allRes.clicks += v.clicks;
        allRes.installs += v.installs;
        allRes.amount += v.amount;
        allRes.refund_amount += v.refund_amount;
        allRes.bonus += v.bonus;
        countryBonus[v.country_code] = v.bonus;
        if (countryAmount[v.country_code]) {
          countryAmount[v.country_code] += v.amount;
        } else {
          countryAmount[v.country_code] = v.amount;
        }
        if (countryRefundAmount[v.country_code]) {
          countryRefundAmount[v.country_code] += v.refund_amount;
        } else {
          countryRefundAmount[v.country_code] = v.refund_amount;
        }
        dataSource.push({
          ...v,
          key: v.ttid + v.media_source + v.product_id + v.ds + v.platform + v.country_code,
          ecpm: getFixed(v.impressions / v.spend / 1000),
          revenue: getFixed((v.amount - v.refund_amount) * v.bonus),
          roi: getFixed((v.amount - v.refund_amount) * v.bonus / v.spend),
          ctr: getFixed(v.clicks / v.impressions * 100),
        });
      });
      allRes.ecpm = getFixed(allRes.impressions / allRes.spend / 1000);
      allRes.roi = 0;
      allRes.ctr = getFixed(allRes.clicks / allRes.impressions * 100);
      allRes.revenue = 0;
      for (const key in countryAmount) {
        const element = countryAmount[key];
        allRes.revenue += ((element - countryRefundAmount[key]) * countryBonus[key]);
      }

      allRes.revenue = getFixed(allRes.revenue);
      allRes.roi = getFixed(allRes.revenue / allRes.spend);

      const allData = {};
      if (res.length) {
        for (const i of Object.keys(fields)) {
          allData[i] = allRes[i] || 0;
        }
        allData.ds = '合计';
        for (const i in groups) {
          if (i === 'country_name') {
            allData.country_name = '合计';
          }
          if (i === 'media_source') {
            allData.media_source = '合计';
          }
          if (i === 'ttid') {
            allData.ttid = '合计';
          }
        }
      }
      const data = [allData].concat(dataSource).map((v, key) => ({
        ...v,
        key,
      }));
      setDataSource(data);
    }
  };
  useEffect(() => {
    getFetchData();
  }, [search, dayType1]);
  useEffect(() => {
    gatAllTtid();
  }, []);
  return (
    <div>
      <Query onSearch={onSearch} search={search} allTtidList={allTtidList}/>
      <DownLoadButton filename="客单价数据" data={dataSource} columns={columns} />
      <Radio.Group value={dayType1} onChange={e => setDayType1(e.target.value)}>
        <Radio.Button value="1" key="1">
          日
        </Radio.Button>
        <Radio.Button value="2" key="2">
          月
        </Radio.Button>
      </Radio.Group>
      <Tooltip title="新增为客户端新增">
        <Icon style={{ fontSize: 18, marginLeft: 10 }} type="question-circle" />
      </Tooltip>
      <Table dataSource={dataSource} columns={columns} bordered style={{ marginTop: 20 }} />
    </div>
  );
};
