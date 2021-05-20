import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Select } from 'antd';
import Query from './components/Query';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import {
  APISCOSTMILLS, APIERROE, errorCodeSQL, APICOUNT,
} from './components/sqlTemplate';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    country: [],
    apiCategory: undefined,
    product: '1',
    apiName: undefined,
    appVersion: undefined,
  });
  const [costMillsData, setCostMillsData] = useState([]);
  const [countData, setCountData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [errorCode, setErrorCode] = useState(undefined);
  const [errorCodeList, setErrorCodeList] = useState([]);

  const getSQL = async (sql) => {
    const {
      startDate, endDate, product, appVersion, apiName, apiCategory,
    } = search;
    let where = '';
    if (search.country.length) {
      where += ` and country in (${search.country.map(v => `'${v}'`).join(',')})`;
    }
    if (appVersion) {
      where += ` and app_version = '${appVersion}'`;
    }
    if (apiName) {
      where += ` and api_name = '${apiName}'`;
    }
    if (apiCategory) {
      where += ` and api_category = '${apiCategory}'`;
    }
    let fetchSql = createSqlWhere({
      startDate, endDate, where, product, sql,
    });
    fetchSql = fetchSql.replace(/#query#/, errorCode ? ` and _key = '${errorCode}'` : '');
    const res = await getData(fetchSql);
    return res;
  };
  const getErrorCodeList = async () => {
    const res = await getSQL(errorCodeSQL);
    setErrorCodeList(res);
  };
  const getCountList = async () => {
    const countRes = await getSQL(APICOUNT);
    const countData = countRes.map(i => ({
      day: moment(i.ds).format('YYYY-MM-DD'),
      value: i.total,
      type: 'api吞吐统计',
    }));
    setCountData(countData);
    chartLineRender(countData, document.getElementById('count'));
  };
  const getCostList = async () => {
    const costMillsRes = await getSQL(APISCOSTMILLS);
    const costMillsData = costMillsRes.map(i => ({
      day: moment(i.ds).format('YYYY-MM-DD'),
      value: getNumber(i.value2, i.value1, false),
      type: 'api响应时长统计',
    }));
    setCostMillsData(costMillsData);
    chartLineRender(costMillsData, document.getElementById('cost_mills'));
  };
  const getErrorList = async () => {
    const apiError = await getSQL(APIERROE);
    const apiErrorData = [];
    apiError.forEach((i) => {
      apiErrorData.push({
        day: moment(i.ds).format('YYYY-MM-DD'),
        value: i.duid_total,
        type: 'duid_total',
      });
      apiErrorData.push({
        day: moment(i.ds).format('YYYY-MM-DD'),
        value: i.total,
        type: 'total',
      });
    });
    setErrorData(apiErrorData);
    chartLineRender(apiErrorData, document.getElementById('error'));
  };
  useEffect(() => {
    getCostList(); getErrorCodeList(); getCountList();
  }, [search]);
  useEffect(() => {
    getErrorList();
  }, [search, errorCode]);
  return <div>
    <Query
      search = {search}
      onSearch = {setSearch}
    />
    <h3 style={{ marginTop: 20 }}>api响应时长统计</h3>
    <DownLoadButton
      filename="api响应时长统计"
      data={costMillsData}
      columns={[
        { key: 'day', title: 'day' },
        { key: 'value', title: 'value' },
        { key: 'type', title: 'type' },
      ]}
    />
    <div id="cost_mills"/>

    <h3 style={{ marginTop: 20 }}>api错误统计</h3>
    <DownLoadButton
      filename="api错误统计"
      data={errorData}
      columns={[
        { key: 'day', title: 'day' },
        { key: 'value', title: 'value' },
        { key: 'type', title: 'type' },
      ]}
    />
    <Select
      style={{ width: 200 }}
      value={errorCode}
      onChange={setErrorCode}
      placeholder="错误码"
      allowClear
    >
      {errorCodeList.map(v => <Select.Option key={v.error_code} value={v.error_code}>{v.error_code}</Select.Option>)}
    </Select>
    <div id="error" />

    <h3 style={{ marginTop: 20 }}>api吞吐统计</h3>
    <DownLoadButton
      filename="api吞吐统计"
      data={countData}
      columns={[
        { key: 'day', title: 'day' },
        { key: 'value', title: 'value' },
        { key: 'type', title: 'type' },
      ]}
    />
    <div id="count" />
  </div>;
};
