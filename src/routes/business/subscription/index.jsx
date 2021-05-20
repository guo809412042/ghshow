/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Icon, Switch } from 'antd';
import _ from 'lodash';
import Query from './Query';
import {
  createSqlWhere, getNumber, getFixed, getPrecision,
} from '../../../utils/utils';
import { getHoloData } from '../../../utils/request';
import { listSQLsp, listSQLtempo } from './sqlTemplate';
import { columns, APP_LIST, weidu } from './const';
import { DownLoadButton } from '../../common/DownLoadButton';

export default () => {
  const [search, setSearch] = useState({
    productId: '10',
    countryName: [],
    platform: '1',
    selectAppVersion: [],
    newUser: '=',
    skuType: undefined,
    subscriptionDuration: undefined,
    skuId: undefined,
    mediaSource: undefined,
    campaign: undefined,
    category: undefined,
    funtion: undefined,
    fvalue: undefined,
    evtIntervalDay: undefined,
    dayType: '1',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    groupBy1: undefined,
    groupBy2: undefined,
    compare: '2',
  });
  const [tableColumns, setTableColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchFlag, setSearchFlag] = useState(false);
  const getSQL = async (startDate = search.startDate, endDate = search.endDate) => {
    const {
      newUser,
      productId,
      platform,
      countryName,
      selectAppVersion,
      skuType,
      subscriptionDuration,
      skuId,
      mediaSource,
      groupBy1,
      groupBy2,
      campaign,
      category,
      funtion,
      fvalue,
      evtIntervalDay,
    } = search;
    let where = '';
    const newColumns = _.cloneDeep(columns);
    if (newUser) {
      where += ` and new_user ${newUser} '1' `;
    }
    if (productId) {
      where += ` and product_id = '${productId}'`;
    }

    if (mediaSource) {
      where += ` and media_source = '${mediaSource}'`;
    }
    if (campaign) {
      where += ` and campaign_name = '${campaign}'`;
    }
    if (category) {
      where += ` and category = '${category}'`;
    }
    if (funtion) {
      where += ` and funtion = '${funtion}'`;
    }
    if (fvalue) {
      where += ` and fvalue = '${fvalue}'`;
    }
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    if (countryName && countryName.length) {
      where += `and country_name in (${countryName.map(v => `'${v}'`)})`;
    }
    if (selectAppVersion && selectAppVersion.length) {
      where += `and app_version in (${selectAppVersion.map(v => `'${v}'`)})`;
    }
    let otherWhere = where;

    if (skuType) {
      otherWhere += ` and sku_type = '${skuType}'`;
    }
    if (skuId) {
      otherWhere += ` and sku_id = '${skuId}'`;
    }
    if (subscriptionDuration) {
      otherWhere += ` and subscription_duration = '${subscriptionDuration}'`;
    }
    let group = '';
    let group1 = '';
    const type = {
      type1: '',
      type2: '',
      type3: '',
      type4: '',
      type5: '',
      type6: '',
    };
    if (groupBy1) {
      newColumns.splice(1, 0, {
        dataIndex: groupBy1,
        key: groupBy1,
        title: weidu[groupBy1],
      });
      group += ` ,${groupBy1}`;
      group1 += `, a.${groupBy1}  `;
      ['b', 'c', 'd', 'e', 'f', 'g'].forEach((v, index) => {
        type[`type${index + 1}`] += ` and a.${groupBy1} = ${v}.${groupBy1}`;
      });
    }
    if (groupBy2) {
      newColumns.splice(1, 0, {
        dataIndex: groupBy2,
        key: groupBy2,
        title: weidu[groupBy2],
      });
      group += ` ,${groupBy2}`;
      group1 += `, a.${groupBy2}  `;
      ['b', 'c', 'd', 'e', 'f', 'g'].forEach((v, index) => {
        type[`type${index + 1}`] += ` and a.${groupBy2} = ${v}.${groupBy2}`;
      });
    }
    setTableColumns(newColumns);
    if (evtIntervalDay) {
      otherWhere += ` and ord_interval_day ${evtIntervalDay.includes('>') ? evtIntervalDay : `='${evtIntervalDay}'`}`;
    }
    where += ' and evt_interval_day = \'0\'';
    let sql = listSQLsp;
    if (Number(productId) === 10) {
      sql = listSQLtempo;
    }
    const fetchSQL = createSqlWhere({
      sql,
      startDate,
      endDate,
      where,
      otherWhere,
      group,
    })
      .replace(/#group1#/g, group1)
      .replace(/#type1#/g, type.type1)
      .replace(/#type2#/g, type.type2)
      .replace(/#type3#/g, type.type3)
      .replace(/#type4#/g, type.type4)
      .replace(/#type5#/g, type.type5)
      .replace(/#type6#/g, type.type6);
    const res = await getHoloData(fetchSQL);
    return res;
  };
  const getList = async () => {
    setLoading(true);
    if (search.dayType === '1') {
      const res = await getSQL();
      const diff = search.endDate.diff(search.startDate, 'days');
      let beforeRes;
      if (search.compare === '1') {
        beforeRes = await getSQL(
          moment(search.startDate)
            .subtract(diff + 1, 'days')
            .format('YYYYMMDD'),
          moment(search.startDate)
            .subtract(1, 'days')
            .format('YYYYMMDD'),
        );
      }

      const data = [];
      res.forEach((v, index) => {
        const arr = _.clone(v);
        arr.key = index;
        arr.charged_amount = getFixed(v.charged_amount);
        arr.refund_amount = getFixed(v.refund_amount);
        arr.net_revenue = getFixed((v.net_revenue * 1 - v.refund_amount * 1) * (search.platform === '1' ? 1 : 0.7));
        arr.sub_total = getFixed(v.sub_total, 0);
        arr.refund_cnt_1d = getFixed(v.refund_cnt_1d, 0);
        arr.product_id = APP_LIST[v.product_id];
        arr['exp_total/user_total'] = `${getNumber(v.exp_total, v.user_total)}`;
        arr['click_total/exp_total'] = `${getNumber(v.click_total, v.exp_total)}`;
        arr['suc_total/click_total'] = `${getNumber(v.suc_total, v.click_total)}`;
        arr['suc_total/user_total'] = `${getNumber(v.suc_total, v.user_total)}`;
        arr['sucs_pay_cnt_1d/suc_total'] = `${getNumber(v.sucs_pay_cnt_1d, v.suc_total)}`;
        arr['sub_total/sucs_pay_cnt_1d'] = `${getNumber(v.sub_total, v.sucs_pay_cnt_1d)}`;
        arr['refund_cnt_1d/sucs_pay_cnt_1d'] = `${getNumber(v.refund_cnt_1d, v.sucs_pay_cnt_1d)}`;
        arr.arpu = getNumber(arr.charged_amount, arr.user_total, false, 4); // 分成前/新增
        arr.ltv = getNumber(arr.net_revenue, arr.user_total, false, 4); // 分成后/新增
        if (search.compare === '1') {
          const find = beforeRes.find(
            v => v.ds
              === moment(arr.ds)
                .subtract(diff + 1, 'days')
                .format('YYYYMMDD'),
          );
          if (find) {
            find.charged_amount = getFixed(find.charged_amount);
            find.refund_amount = getFixed(find.refund_amount);
            find.net_revenue = getFixed(find.net_revenue * 1 - find.refund_amount * 1);
            find.sub_total = getFixed(find.sub_total, 0);
            find.refund_cnt_1d = getFixed(find.refund_cnt_1d, 0);
            find['exp_total/user_total'] = `${getNumber(find.exp_total, find.user_total)}`;
            find['click_total/exp_total'] = `${getNumber(find.click_total, find.exp_total)}`;
            find['suc_total/click_total'] = `${getNumber(find.suc_total, find.click_total)}`;
            find['suc_total/user_total'] = `${getNumber(find.suc_total, find.user_total)}`;
            find['sucs_pay_cnt_1d/suc_total'] = `${getNumber(find.sucs_pay_cnt_1d, find.suc_total)}`;
            find['sub_total/sucs_pay_cnt_1d'] = `${getNumber(find.sub_total, find.sucs_pay_cnt_1d)}`;
            find['refund_cnt_1d/sucs_pay_cnt_1d'] = `${getNumber(find.refund_cnt_1d, find.sucs_pay_cnt_1d)}`;
            find.arpu = getNumber(find.charged_amount, find.user_total, false, 4); // 分成前/新增
            find.ltv = getNumber(find.net_revenue, find.user_total, false, 4); // 分成后/新增
            const keys = Object.keys(find).filter(v => !['product_id', 'ds'].includes(v));
            for (const i of keys) {
              const rate = getPrecision(arr[i], find[i]).toString();
              arr[i] = (
                <div>
                  <p>
                    {arr[i]}
                    {i.includes('/') ? '%' : ''}
                  </p>
                  <p>
                    {' '}
                    ({find[i]}){i.includes('/') ? '%' : ''}
                  </p>
                  <p style={{ color: rate.includes('-') ? '#3f8600' : '#cf1322' }}>
                    <Icon type={rate.includes('-') ? 'arrow-down' : 'arrow-up'} />
                    {rate}%
                  </p>
                </div>
              );
            }
          }
        } else {
          arr['exp_total/user_total'] += '%';
          arr['click_total/exp_total'] += '%';
          arr['suc_total/click_total'] += '%';
          arr['suc_total/user_total'] += '%';
          arr['sucs_pay_cnt_1d/suc_total'] += '%';
          arr['sub_total/sucs_pay_cnt_1d'] += '%';
          arr['refund_cnt_1d/sucs_pay_cnt_1d'] += '%';
        }
        data.push(arr);
      });
      setDataSource(data);
      setSearchFlag(true);
      setLoading(false);
    }
  };
  useEffect(() => {
    getList();
  }, [search]);
  return (
    <div>
      <Query search={search} onSearch={setSearch} searchFlag={searchFlag} />
      <DownLoadButton filename="订阅数据" data={dataSource} columns={tableColumns} />
      <Table
        columns={tableColumns}
        dataSource={dataSource}
        loading={loading}
        bordered
        scroll={{ x: tableColumns.length * 120 }}
      />
    </div>
  );
};
