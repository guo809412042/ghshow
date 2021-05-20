/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Tooltip, Icon } from 'antd';
import _ from 'lodash';
import Query from './components/Query';
import {
  ALL_COLUMNS, CN_COLUMNS, NOT_CN_COLUMNS, COUNTRY, COUNTRY1,
} from './const';
import { getData } from '../../../utils/request';
import {
  createSqlWhere, dateFormat, getNumber, getFixed, getPrecision,
} from '../../../utils/utils';
import { listSQL } from './sqlTemplate';
import { getConfigCnPutList, getConfigNotCnPutList } from '../services';
import { DownLoadButton } from '../../common/DownLoadButton';
import { getPutCnData, getNotPutCnData, getAllData } from './func';

const add = (num1, num2) => Number(num1) + Number(num2);

export default () => {
  const [search, setSearch] = useState({
    country: undefined,
    dataType: '1',
    type: '1',
    startDate: moment().subtract(3, 'month'),
    endDate: moment().subtract(1, 'month'),
  });
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const onSearch = (values) => {
    setSearch(values);
  };
  const getColumns = () => {
    if (!search.country) {
      setColumns(ALL_COLUMNS);
    } else if (search.country === 'CN') {
      setColumns(CN_COLUMNS);
    } else {
      setColumns(NOT_CN_COLUMNS);
    }
  };
  const getSQL = async () => {
    let where = '';
    if (search.country && search.country !== 'TDDDW' && search.country !== 'TDDDT') {
      where += ` and country_code = '${search.country}'`;
    }
    if (search.country === 'TDDDW') {
      where += ` and country_code not in (${COUNTRY1.map(v => `'${v}'`).join(',')})`;
    }
    const res = await getData(
      createSqlWhere({
        sql: listSQL,
        startDate: moment(search.startDate).subtract(1, 'month'),
        endDate: search.endDate,
        where,
        dateFormat: 'YYYYMM',
      }),
    );
    return res;
  };
  const getCnPutData = async (
    startDate = moment(search.endDate).format('YYYYMM'),
    endDate = moment(search.endDate).format('YYYYMM'),
  ) => {
    const res = await getConfigCnPutList({
      type: search.type,
      startDate,
      endDate,
    });
    return res.data;
  };
  const getNotCnPutData = async (
    startDate = moment(search.endDate).format('YYYYMM'),
    endDate = moment(search.endDate).format('YYYYMM'),
  ) => {
    const res = await getConfigNotCnPutList({
      type: search.type,
      startDate,
      endDate,
      country: search.country ? COUNTRY[search.country] : '',
    });
    if (res.data.length) {
      return res.data.length > 1 ? res.data : res.data[0];
    }
    return search.country ? {} : [];
  };

  const getList = async () => {
    setLoading(true);

    const relRes = await getSQL();
    const dataSource = [];
    const startDate = Number(dateFormat(search.startDate, 'YYYYMM'));
    const endDate = Number(dateFormat(search.endDate, 'YYYYMM'));
    for (const i of relRes) {
      const date = Number(i.data_time);
      if (startDate <= date && date <= endDate) {
        const arr = _.clone(i);
        arr.country = COUNTRY[search.country] || '全部';
        arr.type = '真实';
        const _list = relRes.find(
          v => v.data_time
            === moment(`${date.toString()}01`)
              .subtract(1, 'month')
              .format('YYYYMM'),
        );
        if (_list) {
          // 续购率(本月复购人数/上个月月付费人数)
          arr.and_sub_old_month_rate = getNumber(
            i.anrd_sub_old_month_usr_cnt_1d,
            _list.anrd_one_new_month_usr_cnt_1d * 1
              + _list.anrd_sub_new_month_usr_cnt_1d * 1
              + _list.anrd_one_old_month_usr_cnt_1d * 1
              + _list.anrd_sub_old_month_usr_cnt_1d,
            false,
            4,
          );
          arr.ios_sub_month_rate = getNumber(
            i.ios_old_month_usr_cnt_1d,
            _list.ios_new_month_usr_cnt_1d * 1 + _list.ios_old_month_usr_cnt_1d * 1,
            false,
            4,
          );
          arr.gp_sub_month_rate = getNumber(
            i.gp_old_month_usr_cnt_1d,
            _list.gp_new_month_usr_cnt_1d * 1 + _list.gp_old_month_usr_cnt_1d * 1,
            false,
            4,
          );
        } else {
          arr.gp_sub_month_rate = 0;
          arr.month_order_rate_ios = 0;
        }
        arr.ios_amt_new_user_month_rate = arr.and_month_rate;
        arr.ios_amt_new_user_year_rate = arr.and_month_rate;
        arr.gp_arppu = getNumber(arr.gp_amt_total_1d, arr.gp_amt_usr_cnt_1d, false);
        arr.ios_arppu = getNumber(arr.ios_amt_total_1d, arr.ios_amt_usr_cnt_1d, false);
        arr.gp_new_month_rate = getNumber(arr.gp_new_month_usr_cnt_1d, arr.gp_new_usr_cnt_1d, false, 4);
        arr.gp_new_year_rate = getNumber(arr.gp_new_year_usr_cnt_1d, arr.gp_new_usr_cnt_1d, false, 4);
        arr.ios_new_month_rate = getNumber(arr.ios_new_month_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false, 4);
        arr.ios_new_year_rate = getNumber(arr.ios_new_year_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false, 4);
        arr.and_amt_new_user_rate = getNumber(arr.anrd_sub_new_month_usr_cnt_1d, arr.anrd_new_usr_cnt_1d, false, 4);
        dataSource.push(arr);
      }
    }

    // 当前
    const current = dataSource.find(v => v.data_time === dateFormat(search.endDate, 'YYYYMM'));
    // 上月
    const last = dataSource.find(
      v => v.data_time
        === moment(search.endDate)
          .subtract(1, 'month')
          .format('YYYYMM'),
    );

    // 当前对比上月真实
    const compareReal = {
      country: !search.country ? '全部' : COUNTRY[search.country],
      data_time: `真实${moment(search.endDate).format('YYYYMM')}对比真实${moment(search.endDate)
        .subtract(1, 'month')
        .format('YYYYMM')}`,
      type: '真实',
    };

    // compareRealPrecision 真实对比数据百分比
    const compareRealPrecision = {
      country: !search.country ? '全部' : COUNTRY[search.country],
      data_time: `${moment(search.endDate).format('YYYYMM')}对比${moment(search.endDate)
        .subtract(1, 'month')
        .format('YYYYMM')}百分比`,
      type: '真实',
    };

    if (current && last && search.dataType === '1') {
      const keys = Object.keys(current).filter(v => v !== 'country' && v !== 'data_time' && v !== 'type');
      for (const i of keys) {
        compareReal[i] = current[i] * 1 - last[i] * 1;
        compareRealPrecision[i] = `${getPrecision(current[i] * 1, last[i] * 1)}%`;
      }
    }
    // currentPrePrecision 当前预测对比
    const currentPrePrecision = {
      country: !search.country ? '全部' : COUNTRY[search.country],
      data_time: `${moment(search.endDate).format('YYYYMM')}真实与预测对比百分比`,
      type: '预测',
    };
    const preData = {};
    if (search.dataType === '1') {
      if (search.country) {
        if (search.country === 'CN') {
          let cnPutData = await getCnPutData();
          cnPutData = cnPutData.length ? cnPutData[0] : {};
          preData.country = '中国';
          preData.data_time = `预测${moment(search.endDate).format('YYYYMM')}`;
          preData.type = '预测';
          preData.anrd_amt_total_1d = cnPutData.and_income;
          preData.ios_amt_total_1d = cnPutData.ios_income;
          preData.amt_total_1d = add(preData.anrd_amt_total_1d, preData.ios_amt_total_1d);
          preData.anrd_one_new_month_usr_cnt_1d = cnPutData.anrd_one_new_month_usr_cnt_1d;
          preData.anrd_sub_new_month_usr_cnt_1d = cnPutData.anrd_sub_new_month_usr_cnt_1d;
          preData.anrd_one_new_year_usr_cnt_1d = cnPutData.anrd_one_new_year_usr_cnt_1d;
          preData.ios_new_month_usr_cnt_1d = cnPutData.ios_new_month_usr_cnt_1d;
          preData.ios_new_year_usr_cnt_1d = cnPutData.ios_new_year_usr_cnt_1d;
          preData.anrd_one_old_month_usr_cnt_1d = cnPutData.anrd_one_old_month_usr_cnt_1d;
          preData.anrd_sub_old_month_usr_cnt_1d = cnPutData.anrd_sub_old_month_usr_cnt_1d;
          preData.anrd_one_old_year_usr_cnt_1d = cnPutData.anrd_one_old_year_usr_cnt_1d;
          preData.ios_old_month_usr_cnt_1d = cnPutData.ios_old_month_usr_cnt_1d;
          preData.ios_old_year_usr_cnt_1d = cnPutData.ios_old_year_usr_cnt_1d;
          preData.tf_and_new_usr_cnt = cnPutData.anrd_new_usr_cnt_1d;
          preData.tf_ios_new_usr_cnt = cnPutData.ios_new_usr_cnt_1d;
          preData.anrd_new_usr_cnt_1d = preData.tf_and_new_usr_cnt;
          preData.ios_new_usr_cnt_1d = preData.tf_ios_new_usr_cnt;
          preData.and_amt_new_user_rate = cnPutData.and_month_rate;
          preData.ios_amt_new_user_month_rate = cnPutData.ios_new_month_rate;
          preData.ios_amt_new_user_year_rate = cnPutData.ios_new_year_rate;
          preData.and_sub_old_month_rate = cnPutData.and_sub_old_month_rate;
          preData.ios_sub_month_rate = cnPutData.ios_sub_month_rate;
          preData.anrd_cost_total_1d = cnPutData.and_cost;
          preData.ios_cost_total_1d = cnPutData.ios_cost;
          preData.anrd_month_amt_total_1d = cnPutData.and_month_income;
          preData.ios_month_amt_total_1d = cnPutData.ios_month_income;
          preData.anrd_arpu = cnPutData.and_arpu;
          preData.ios_arpu = cnPutData.ios_arpu;
          preData.anrd_year_amt_total_1d = cnPutData.and_year_income;
          preData.ios_year_amt_total_1d = cnPutData.ios_year_income;
        } else {
          const cnPutData = await getNotCnPutData();
          preData.country = COUNTRY[search.country];
          preData.data_time = `预测${moment(search.endDate).format('YYYYMM')}`;
          preData.type = '预测';
          preData.gp_amt_total_1d = getFixed(cnPutData.gp_income);
          preData.ios_amt_total_1d = getFixed(cnPutData.ios_income);
          preData.amt_total_1d = getFixed(add(preData.gp_amt_total_1d, preData.ios_amt_total_1d));

          preData.gp_new_month_usr_cnt_1d = cnPutData.gp_new_month_usr_cnt_1d;
          preData.gp_new_year_usr_cnt_1d = cnPutData.gp_new_year_usr_cnt_1d;
          preData.ios_new_month_usr_cnt_1d = cnPutData.ios_new_month_usr_cnt_1d;
          preData.ios_new_year_usr_cnt_1d = cnPutData.ios_new_year_usr_cnt_1d;

          preData.gp_old_month_usr_cnt_1d = cnPutData.gp_old_month_usr_cnt_1d;
          preData.gp_old_year_usr_cnt_1d = cnPutData.gp_old_year_usr_cnt_1d;
          preData.ios_old_month_usr_cnt_1d = cnPutData.ios_old_month_usr_cnt_1d;
          preData.ios_old_year_usr_cnt_1d = cnPutData.ios_old_year_usr_cnt_1d;
          preData.tf_gp_new_usr_cnt = cnPutData.gp_new_usr_cnt_1d;
          preData.tf_ios_new_usr_cnt = cnPutData.ios_new_usr_cnt_1d;
          preData.ios_new_usr_cnt_1d = preData.tf_ios_new_usr_cnt;
          preData.gp_new_usr_cnt_1d = preData.tf_gp_new_usr_cnt;
          preData.gp_sub_month_rate = cnPutData.gp_sub_month_rate;
          preData.ios_sub_month_rate = cnPutData.ios_sub_month_rate;
          preData.gp_cost_total_1d = cnPutData.gp_cost;
          preData.ios_cost_total_1d = cnPutData.ios_cost;
          preData.gp_month_amt_total_1d = cnPutData.gp_month_income;
          preData.gp_year_amt_total_1d = cnPutData.gp_year_income;
          preData.ios_month_amt_total_1d = cnPutData.ios_month_income;
          preData.ios_year_amt_total_1d = cnPutData.ios_year_income;
          preData.gp_arpu = cnPutData.gp_arpu;
          preData.ios_arpu = cnPutData.ios_arpu;
          preData.gp_new_month_rate = getNumber(preData.gp_new_month_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
          preData.gp_new_year_rate = getNumber(preData.gp_new_year_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
          preData.ios_new_month_rate = getNumber(
            preData.ios_new_month_usr_cnt_1d,
            preData.ios_new_usr_cnt_1d,
            false,
            4,
          );
          preData.ios_new_year_rate = getNumber(preData.ios_new_year_usr_cnt_1d, preData.ios_new_usr_cnt_1d, false, 4);
        }
      } else {
        let putCnData = await getCnPutData();
        putCnData = putCnData.length ? putCnData[0] : {};
        const putNotCnData = await getNotCnPutData();
        preData.country = '全部';
        preData.data_time = `预测${moment(search.endDate).format('YYYYMM')}`;
        preData.type = '预测';
        preData.gp_amt_total_1d = putCnData.and_income;
        preData.ios_amt_total_1d = putCnData.ios_income;

        preData.gp_amt_usr_cnt_1d = putCnData.anrd_sub_new_month_usr_cnt_1d * 1
          + putCnData.anrd_one_new_month_usr_cnt_1d * 1
          + putCnData.anrd_one_new_year_usr_cnt_1d * 1
          + putCnData.anrd_sub_old_month_usr_cnt_1d * 1
          + putCnData.anrd_one_old_month_usr_cnt_1d * 1
          + putCnData.anrd_one_old_year_usr_cnt_1d * 1;
        preData.ios_amt_usr_cnt_1d = putCnData.ios_new_month_usr_cnt_1d * 1
          + putCnData.ios_new_year_usr_cnt_1d * 1
          + putCnData.ios_old_month_usr_cnt_1d * 1
          + putCnData.ios_old_year_usr_cnt_1d * 1;

        preData.ios_new_month_usr_cnt_1d = putCnData.ios_new_month_usr_cnt_1d;
        preData.ios_new_year_usr_cnt_1d = putCnData.ios_new_year_usr_cnt_1d;
        preData.gp_new_month_usr_cnt_1d = putCnData.anrd_sub_new_month_usr_cnt_1d * 1 + putCnData.anrd_one_new_month_usr_cnt_1d * 1;
        preData.gp_new_year_usr_cnt_1d = putCnData.anrd_one_new_year_usr_cnt_1d * 1;

        preData.gp_old_month_usr_cnt_1d = putCnData.anrd_sub_old_month_usr_cnt_1d * 1 + putCnData.anrd_one_old_month_usr_cnt_1d * 1;
        preData.gp_old_year_usr_cnt_1d = putCnData.anrd_one_old_year_usr_cnt_1d * 1;

        preData.tf_gp_new_usr_cnt = putCnData.anrd_new_usr_cnt_1d;
        preData.tf_ios_new_usr_cnt = putCnData.ios_new_usr_cnt_1d;
        preData.ios_old_year_usr_cnt_1d = putCnData.ios_old_year_usr_cnt_1d;
        preData.ios_old_month_usr_cnt_1d = putCnData.ios_old_month_usr_cnt_1d;

        for (const i of putNotCnData) {
          preData.gp_amt_total_1d = add(preData.gp_amt_total_1d, i.gp_income);
          preData.ios_amt_total_1d = add(preData.ios_amt_total_1d, i.ios_income);

          preData.gp_amt_usr_cnt_1d = preData.gp_amt_usr_cnt_1d * 1
            + i.gp_new_month_usr_cnt_1d * 1
            + i.gp_new_year_usr_cnt_1d * 1
            + i.gp_old_month_usr_cnt_1d * 1
            + i.gp_old_year_usr_cnt_1d * 1;

          preData.ios_amt_usr_cnt_1d = preData.ios_amt_usr_cnt_1d * 1
            + i.ios_new_month_usr_cnt_1d * 1
            + i.ios_new_year_usr_cnt_1d * 1
            + i.ios_old_month_usr_cnt_1d * 1
            + i.ios_old_year_usr_cnt_1d * 1;

          preData.ios_new_month_usr_cnt_1d = add(preData.ios_new_month_usr_cnt_1d, i.ios_new_month_usr_cnt_1d);
          preData.ios_new_year_usr_cnt_1d = add(preData.ios_new_year_usr_cnt_1d, i.ios_new_year_usr_cnt_1d);
          preData.gp_new_month_usr_cnt_1d = add(preData.gp_new_month_usr_cnt_1d, i.gp_new_month_usr_cnt_1d);
          preData.gp_new_year_usr_cnt_1d = add(preData.gp_new_year_usr_cnt_1d, i.gp_new_year_usr_cnt_1d);
          preData.ios_old_month_usr_cnt_1d = add(preData.ios_old_month_usr_cnt_1d, i.ios_old_month_usr_cnt_1d);
          preData.ios_old_year_usr_cnt_1d = add(preData.ios_old_year_usr_cnt_1d, i.ios_old_year_usr_cnt_1d);
          preData.gp_old_month_usr_cnt_1d = add(preData.gp_old_month_usr_cnt_1d, i.gp_old_month_usr_cnt_1d);
          preData.gp_old_year_usr_cnt_1d = add(preData.gp_old_year_usr_cnt_1d, i.gp_old_year_usr_cnt_1d);
          preData.tf_gp_new_usr_cnt = add(preData.tf_gp_new_usr_cnt, i.gp_new_usr_cnt_1d);
          preData.tf_ios_new_usr_cnt = add(preData.tf_ios_new_usr_cnt, i.ios_new_usr_cnt_1d);
        }
        preData.amt_total_1d = add(preData.gp_amt_total_1d, preData.ios_amt_total_1d);
        preData.gp_new_usr_cnt_1d = preData.tf_gp_new_usr_cnt;
        preData.ios_new_usr_cnt_1d = preData.tf_ios_new_usr_cnt;
        preData.gp_new_month_rate = getNumber(preData.gp_new_month_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
        preData.gp_new_year_rate = getNumber(preData.gp_new_year_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
        preData.ios_new_month_rate = getNumber(preData.ios_new_month_usr_cnt_1d, preData.ios_new_usr_cnt_1d, false, 4);
        preData.ios_new_year_rate = getNumber(preData.ios_new_year_usr_cnt_1d, preData.ios_new_usr_cnt_1d, false, 4);
        preData.gp_arppu = getNumber(preData.gp_amt_total_1d, preData.gp_amt_usr_cnt_1d, false);
        preData.ios_arppu = getNumber(preData.ios_amt_total_1d, preData.ios_amt_usr_cnt_1d, false);
      }
    }

    // 对比当月预测
    const currentPre = {
      country: !search.country ? '全部' : COUNTRY[search.country],
      data_time: `${moment(search.endDate).format('YYYYMM')}真实与预测对比`,
      type: '预测',
    };
    if (current && preData && search.dataType === '1') {
      const keys = Object.keys(current).filter(v => v !== 'country' && v !== 'data_time' && v !== 'type');
      for (const i of keys) {
        currentPre[i] = Number(current[i] || 0) - Number(preData[i] || 0);
        currentPrePrecision[i] = `${getPrecision(current[i], preData[i])}%`;
      }
    }

    const DATA = [];
    const preList = [];
    if (search.dataType === '3' || search.dataType === '4') {
      if (search.country === 'CN') {
        const putCnRes = await getCnPutData(startDate, endDate);
        for (const i of putCnRes) {
          let arr = {
            country: '中国',
            data_time: `预测${i.date_time}`,
            type: '预测',
          };
          arr = getPutCnData(arr, i);
          arr.ios_new_month_rate = getNumber(arr.ios_new_month_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false, 4);
          arr.ios_new_year_rate = getNumber(arr.ios_new_year_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false, 4);
          preList.push(arr);
        }
      } else if (search.country && search.country !== 'CN') {
        const putCnRes = await getNotCnPutData(startDate, endDate);
        for (const i of putCnRes) {
          let arr = {
            country: COUNTRY[search.country],
            data_time: `预测${i.date_time}`,
            type: '预测',
          };
          arr = getNotPutCnData(arr, i);
          arr.gp_new_month_rate = getNumber(arr.gp_new_month_usr_cnt_1d, arr.gp_new_usr_cnt_1d, false, 4);
          arr.gp_new_year_rate = getNumber(arr.gp_new_year_usr_cnt_1d, arr.gp_new_usr_cnt_1d, false, 4);
          arr.ios_new_month_rate = getNumber(arr.ios_new_month_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false, 4);
          arr.ios_new_year_rate = getNumber(arr.ios_new_year_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false, 4);
          preList.push(arr);
        }
      } else {
        const putCnRes = await getCnPutData(startDate, endDate);
        const putNotCnRes = await getNotCnPutData(startDate, endDate);
        for (const i of putCnRes) {
          let arr = {
            country: '全球',
            data_time: `预测${i.date_time}`,
            type: '预测',
          };
          const list = putNotCnRes.filter(v => v.date_time === i.date_time);
          arr = getAllData(arr, i, list);
          preList.push(arr);
        }
      }
    }
    // 全部数据
    if (search.dataType === '1') {
      DATA.push(...dataSource);
      DATA.push(preData);
      DATA.push(currentPre);
      DATA.push(currentPrePrecision);
      DATA.push(compareReal);
      DATA.push(compareRealPrecision);
    }
    // 真实数据
    if (search.dataType === '2') {
      DATA.push(...dataSource);
    }
    // 预测数据
    if (search.dataType === '3') {
      DATA.push(...preList);
    }
    if (search.dataType === '4') {
      DATA.push(...dataSource);
      DATA.push(...preList);
    }
    const notFixedIds = ['country', 'channel', 'data_time', 'type'];
    // 百分比
    const suffixIds = [
      'and_amt_new_user_rate',
      'ios_amt_new_user_month_rate',
      'ios_amt_new_user_year_rate',
      'and_sub_old_month_rate',
      'ios_sub_month_rate',
      'gp_new_month_rate',
      'gp_new_year_rate',
      'ios_new_month_rate',
      'ios_new_year_rate',
      'gp_sub_month_rate',
    ];
    // 两位小数
    const fixed2Ids = ['anrd_arpu', 'ios_arpu', 'gp_arpu', 'gp_arppu', 'ios_arppu'];
    const datas = [];
    if (DATA.length) {
      const keys = Object.keys(DATA[0]);
      for (const i of DATA) {
        const arr = {};
        if (search.dataType === '1' && i.data_time.includes('百分比')) {
          datas.push(i);
        } else {
          for (const j of keys) {
            if (notFixedIds.includes(j)) {
              arr[j] = i[j];
            } else if (suffixIds.includes(j)) {
              arr[j] = `${getFixed(i[j] * 100, 2)}%`;
            } else if (fixed2Ids.includes(j)) {
              arr[j] = getFixed(i[j], 2);
            } else {
              arr[j] = getFixed(i[j], 0);
            }
          }
          datas.push(arr);
        }
      }
    }
    setDataSource(datas);
    setLoading(false);
  };
  useEffect(() => {
    getColumns();
  }, [search.country]);
  useEffect(() => {
    getList();
  }, [search]);
  const downColumns = [];
  columns.forEach((v) => {
    if (v.key) {
      downColumns.push(v);
    } else {
      v.children.forEach(i => downColumns.push(i));
    }
  });
  return (
    <div>
      <Query search={search} onSearch={onSearch} />
      <DownLoadButton filename="投放数据" data={dataSource} columns={downColumns} />
      <Tooltip title="新增为服务端新增">
        <Icon style={{ fontSize: 18, marginLeft: 10 }} type="question-circle" />
      </Tooltip>
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        scroll={{ x: columns.length * 300 }}
        style={{ marginTop: 20 }}
        loading={loading}
        rowKey={row => `${row.data_time}+${row.country}+${row.type}`}
      />
    </div>
  );
};
