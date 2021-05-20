/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Tooltip, Icon } from 'antd';
import _ from 'lodash';
import Query from './components/Query';
import {
  ALL_COLUMNS,
  CN_COLUMNS,
  NOT_CN_COLUMNS,
  APP_PRODUCT_LIST,
  COUNTRY_LISTS,
  OZ_CODE_LIST,
  ZD_CODE_LIST,
} from './const';
import { getData } from '../../../utils/request';
import {
  createSqlWhere, dateFormat, getFixed, getPrecision, getNumber,
} from '../../../utils/utils';
import { listSQL, refSQL } from './sqlTemplate';
import {
  getConfigCnOrgList, getConfigCnPutList, getConfigNotCnOrgList, getConfigNotCnPutList,
} from '../services';
import { COUNTRY1 } from '../put/const';
import { DownLoadButton } from '../../common/DownLoadButton';
import {
  getNotCnPreData, getRelData, getCnPreData, getAllPreData,
} from './func';

export default () => {
  const [search, setSearch] = useState({
    country: undefined,
    dataType: '1',
    type: '1',
    startDate: moment().subtract(3, 'month'),
    endDate: moment().subtract(1, 'month'),
    product: '2',
  });
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const onSearch = (values) => {
    setSearch(values);
  };
  const getColumns = () => {
    let column;
    const data = [];
    if (!search.country) {
      column = ALL_COLUMNS;
    } else if (search.country === 'CN') {
      column = CN_COLUMNS;
    } else {
      column = NOT_CN_COLUMNS;
    }
    column.forEach((v) => {
      const arr = _.cloneDeep(v);
      if (v.children && search.product === '2') {
        arr.children = v.children.filter(v => v.title !== '金币充值人数');
      }
      data.push(arr);
    });
    setColumns(data);
  };
  const getSQL = async (sql = listSQL) => {
    let where = '';
    if (search.country) {
      if (search.country === 'TDDDW') {
        where += ` and country_code not in (${COUNTRY1.map(v => `'${v}'`).join(',')})`;
      } else if (search.country === 'OZ') {
        where += ` and country_code in (${OZ_CODE_LIST.map(v => `'${v}'`).join(',')})`;
      } else if (search.country === 'OTHER') {
        where += ` and country_code not in (${COUNTRY1.concat(OZ_CODE_LIST)
          .map(v => `'${v}'`)
          .join(',')})`;
      } else if (search.country === 'ZD') {
        where += ` and country_code in (${ZD_CODE_LIST.map(v => `'${v}'`).join(',')})`;
      } else {
        where += ` and country_code = '${search.country}'`;
      }
    }
    const res = await getData(
      createSqlWhere({
        sql,
        startDate: moment(search.startDate).subtract(1, 'month'),
        endDate: search.endDate,
        where,
        dateFormat: 'YYYYMM',
        product: search.product,
        type: APP_PRODUCT_LIST[search.product],
      }),
    );
    return res;
  };
  const getCnOrgData = async (
    startDate = moment(search.endDate).format('YYYYMM'),
    endDate = moment(search.endDate).format('YYYYMM'),
  ) => {
    const res = await getConfigCnOrgList({
      type: search.type,
      startDate,
      endDate,
    });
    return res.data;
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
  const getNotCnOrgData = async (
    startDate = moment(search.endDate).format('YYYYMM'),
    endDate = moment(search.endDate).format('YYYYMM'),
  ) => {
    const res = await getConfigNotCnOrgList({
      type: search.type,
      startDate,
      endDate,
      country: search.country ? COUNTRY_LISTS[search.product][search.country] : '',
    });
    if (res.data.length) {
      return res.data.length > 1 ? res.data : res.data[0];
    }
    return search.country ? {} : [];
  };
  const getNotCnPutData = async (
    startDate = moment(search.endDate).format('YYYYMM'),
    endDate = moment(search.endDate).format('YYYYMM'),
  ) => {
    const res = await getConfigNotCnPutList({
      type: search.type,
      startDate,
      endDate,
      country: search.country ? COUNTRY_LISTS[search.product][search.country] : '',
    });
    if (res.data.length) {
      return res.data.length > 1 ? res.data : res.data[0];
    }
    return search.country ? {} : [];
  };
  const getList = async () => {
    setLoading(true);
    const relRes = await getSQL();
    const refRes = await getSQL(refSQL);
    const startDate = Number(dateFormat(search.startDate, 'YYYYMM'));
    const endDate = Number(dateFormat(search.endDate, 'YYYYMM'));
    const dataSource = getRelData(relRes, refRes, startDate, endDate, search);

    // compareReal 真实对比数据
    const compareReal = {
      country: !search.country ? '全部' : COUNTRY_LISTS[search.product][search.country],
      data_time: `${moment(search.endDate).format('YYYYMM')}对比${moment(search.endDate)
        .subtract(1, 'month')
        .format('YYYYMM')}`,
      type: '真实',
    };
    // compareRealPrecision 真实对比数据百分比
    const compareRealPrecision = {
      country: !search.country ? '全部' : COUNTRY_LISTS[search.product][search.country],
      data_time: `${moment(search.endDate).format('YYYYMM')}对比${moment(search.endDate)
        .subtract(1, 'month')
        .format('YYYYMM')}百分比`,
      type: '真实',
    };
    const current = dataSource.find(v => v.data_time === moment(search.endDate).format('YYYYMM'));
    const before = dataSource.find(
      v => v.data_time
        === moment(search.endDate)
          .subtract(1, 'month')
          .format('YYYYMM'),
    );
    if (current && before && search.dataType === '1') {
      Object.keys(current)
        .filter(v => v !== 'country' && v !== 'data_time' && v !== 'type')
        .forEach((i) => {
          compareReal[i] = current[i] - before[i];
          compareRealPrecision[i] = `${getPrecision(current[i], before[i])}%`;
        });
    }

    let preData = {};
    // currentPre 当前预测对比
    const currentPre = {
      country: !search.country ? '全部' : COUNTRY_LISTS[search.product][search.country],
      data_time: `${moment(search.endDate).format('YYYYMM')}真实与预测对比`,
      type: '预测',
    };
    // currentPrePrecision 当前预测对比
    const currentPrePrecision = {
      country: !search.country ? '全部' : COUNTRY_LISTS[search.product][search.country],
      data_time: `${moment(search.endDate).format('YYYYMM')}真实与预测对比百分比`,
      type: '预测',
    };
    if (search.product === '2' && search.dataType === '1') {
      // preData 预测数据
      if (search.country) {
        if (search.country === 'CN') {
          let orgCnRes = await getCnOrgData();
          orgCnRes = orgCnRes.length ? orgCnRes[0] : {};
          let putCnRes = await getCnPutData();
          putCnRes = putCnRes.length ? putCnRes[0] : {};
          preData.country = '中国';
          preData.data_time = `预测${moment(search.endDate).format('YYYYMM')}`;
          preData.type = '预测';
          preData = getCnPreData(preData, orgCnRes, putCnRes);
        } else {
          const orgCnRes = await getNotCnOrgData();
          const cnPutData = await getNotCnPutData();
          preData.country = COUNTRY_LISTS[search.product][search.country];
          preData.data_time = `预测${moment(search.endDate).format('YYYYMM')}`;
          preData.type = '预测';
          preData = getNotCnPreData(preData, orgCnRes, cnPutData);
        }
      } else {
        let orgCnData = await getCnOrgData();
        orgCnData = orgCnData.length ? orgCnData[0] : {};
        let putCnData = await getCnPutData();
        putCnData = putCnData.length ? putCnData[0] : {};
        const orgNotCnData = await getNotCnOrgData();
        const putNotCnData = await getNotCnPutData();
        preData.country = '全部';
        preData.data_time = `预测${moment(search.endDate).format('YYYYMM')}`;
        preData.type = '预测';
        preData = getAllPreData(preData, orgCnData, putCnData, orgNotCnData, putNotCnData);
        // 上个月
        const lastMonth = moment(search.endDate)
          .subtract(1, 'month')
          .format('YYYYMM');
        let lastOrgCnData = await getCnOrgData(lastMonth, lastMonth);
        lastOrgCnData = lastOrgCnData.length ? lastOrgCnData[0] : {};
        let lastPutCnData = await getCnPutData(lastMonth, lastMonth);
        lastPutCnData = lastPutCnData.length ? lastPutCnData[0] : {};
        const lastOrgNotCnData = await getNotCnOrgData(lastMonth, lastMonth);
        const lastPutNotCnData = await getNotCnPutData(lastMonth, lastMonth);
        let lastPreData = {};
        lastPreData = getAllPreData(lastPreData, lastOrgCnData, lastPutCnData, lastOrgNotCnData, lastPutNotCnData);
        preData.ios_sub_month_rate = getNumber(
          preData.ios_old_month_usr_cnt_1d,
          lastPreData.ios_new_month_usr_cnt_1d * 1 + lastPreData.ios_old_month_usr_cnt_1d * 1,
          false,
          4,
        );
        preData.gp_sub_month_rate = getNumber(
          preData.gp_old_month_usr_cnt_1d,
          lastPreData.gp_new_month_usr_cnt_1d * 1 + lastPreData.gp_old_month_usr_cnt_1d * 1,
          false,
          4,
        );
      }
      if (current && preData) {
        Object.keys(current)
          .filter(v => v !== 'country' && v !== 'data_time' && v !== 'type')
          .forEach((i) => {
            currentPre[i] = current[i] - preData[i];
            currentPrePrecision[i] = `${getPrecision(current[i], preData[i])}%`;
          });
      }
    }
    const preList = [];
    if (search.product === '2' && (search.dataType === '3' || search.dataType === '4')) {
      if (search.country === 'CN') {
        const orgCnRes = await getCnOrgData(startDate, endDate);
        const putCnRes = await getCnPutData(startDate, endDate);
        for (const i of orgCnRes) {
          const find = putCnRes.find(v => v.date_time === i.date_time);
          let arr = {
            country: '中国',
            data_time: `预测${i.date_time}`,
            type: '预测',
          };
          arr = getCnPreData(arr, i, find);
          preList.push(arr);
        }
      } else if (search.country && search.country !== 'CN') {
        const orgCnRes = await getNotCnOrgData(startDate, endDate);
        const cnPutData = await getNotCnPutData(startDate, endDate);
        for (const i of orgCnRes) {
          const find = cnPutData.find(v => v.date_time === i.date_time);
          let arr = {
            country: COUNTRY_LISTS[search.product][search.country],
            data_time: `预测${i.date_time}`,
            type: '预测',
          };
          arr = getNotCnPreData(arr, i, find);
          preList.push(arr);
        }
      } else {
        const startDate1 = moment(`${startDate}01`)
          .subtract(1, 'month')
          .format('YYYYMM');
        const orgCnData = await getCnOrgData(startDate1, endDate);
        const putCnData = await getCnPutData(startDate1, endDate);
        const orgNotCnData = await getNotCnOrgData(startDate1, endDate);
        const putNotCnData = await getNotCnPutData(startDate1, endDate);
        orgCnData.forEach((i) => {
          const find = putCnData.find(v => v.date_time === i.date_time);
          let arr = {
            country: '全球',
            data_time: `预测${i.date_time}`,
            type: '预测',
          };
          const orgNotCn = orgNotCnData.filter(v => v.date_time === i.date_time);
          const putNotCn = putNotCnData.filter(v => v.date_time === i.date_time);
          arr = getAllPreData(arr, i, find, orgNotCn, putNotCn);
          preList.push(arr);
        });
        preList.forEach((arr, index) => {
          if (index >= 1) {
            arr.ios_sub_month_rate = getNumber(
              arr.ios_old_month_usr_cnt_1d,
              preList[index - 1].ios_new_month_usr_cnt_1d * 1 + preList[index - 1].ios_old_month_usr_cnt_1d * 1,
              false,
              4,
            );
            arr.gp_sub_month_rate = getNumber(
              arr.gp_old_month_usr_cnt_1d,
              preList[index - 1].gp_new_month_usr_cnt_1d * 1 + preList[index - 1].gp_old_month_usr_cnt_1d * 1,
              false,
              4,
            );
          }
        });
        preList.splice(0, 1);
      }
    }
    const DATA = [];
    // 全部数据
    if (search.dataType === '1') {
      DATA.push(...dataSource);
      if (search.product === '2') {
        DATA.push(preData);
        DATA.push(currentPre);
        DATA.push(currentPrePrecision);
      }
      DATA.push(compareReal);
      DATA.push(compareRealPrecision);
    }
    // 真实数据
    if (search.dataType === '2') {
      DATA.push(...dataSource);
    }
    // 预测数据
    if (search.dataType === '3' && search.product === '2') {
      DATA.push(...preList);
    }
    if (search.dataType === '4' && search.product === '2') {
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
      'and_month_rate',
    ];
    // 两位小数
    const fixed2Ids = ['gp_arppu', 'ios_arppu'];
    const datas = [];
    if (DATA.length) {
      const keys = Object.keys(DATA[0]);
      for (const i of DATA) {
        const arr = {};
        if (i.data_time.includes('百分比')) {
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
  }, [search.country, search.product]);
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
      <p />
      <DownLoadButton filename="汇总数据" data={dataSource} columns={downColumns} />
      <Tooltip overlay="说明1:投放安卓新增，投放IOS新增为服务端投放新增.">
        <Icon style={{ fontSize: 18 }} type="question-circle" />
      </Tooltip>
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        scroll={{ x: columns.length * 320 }}
        style={{ marginTop: 10 }}
        rowKey={row => `${row.data_time}+${row.country}+${row.type}`}
        loading={loading}
      />
    </div>
  );
};
