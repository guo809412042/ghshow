/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Card, DatePicker, Table, Button, Icon,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { getData } from '../../../utils/request';
import {
  countrySQL, appVersionSQL, listSQL, statusCodeSQL,
} from './sqlTemplate';
import { createSqlWhere, getNumber, getPrecision } from '../../../utils/utils';
import QueryTemplate from '../../common/QueryTemplate';
import { PLAFORM_LIST } from '../../../utils/const';

export default (props) => {
  const product = props.match.params.product;
  const [platform, setPlatform] = useState({
    URL: {
      1: undefined,
      2: undefined,
    },
    DNS: {
      3: undefined,
      4: undefined,
    },
  });
  const [dataSource, setDataSource] = useState({
    URL: {
      1: [],
      2: [],
    },
    DNS: {
      3: [],
      4: [],
    },
  });
  const [startDate, setStartDate] = useState({
    1: moment().subtract(1, 'days'),
    2: moment().subtract(1, 'days'),
    3: moment().subtract(1, 'days'),
    4: moment().subtract(1, 'days'),
  });
  const [endDate, setEndDate] = useState({
    1: moment().subtract(1, 'days'),
    2: moment().subtract(1, 'days'),
    3: moment().subtract(1, 'days'),
    4: moment().subtract(1, 'days'),
  });
  // const [urlDnsData, setUrlDnsData] = useState({
  //   URL: [],
  //   DNS: [],
  // });
  const [country, setCountry] = useState({
    URL: {
      1: undefined,
      2: undefined,
    },
    DNS: {
      3: undefined,
      4: undefined,
    },
  });
  const [appVersion, setAppVersion] = useState({
    URL: {
      1: undefined,
      2: undefined,
    },
    DNS: {
      3: undefined,
      4: undefined,
    },
  });
  const [selectValue, setSelectValue] = useState({
    URL: {
      1: undefined,
      2: undefined,
    },
    DNS: {
      3: undefined,
      4: undefined,
    },
  });
  const [compareData, setCompareData] = useState({
    URL: [],
    DNS: [],
  });
  const [statusCode, setStatusCode] = useState({
    URL: {
      1: undefined,
      2: undefined,
    },
    DNS: {
      3: undefined,
      4: undefined,
    },
  });
  const [statusCodeList, setStatusCodeList] = useState([]);
  // const getUrlList = async () => {
  //   const urlRes = await getData(
  //     createSqlWhere({
  //       sql: urlSQL,
  //       product,
  //     }),
  //   );
  //   const dnsRes = await getData(
  //     createSqlWhere({
  //       sql: dnsSQL,
  //       product,
  //     }),
  //   );
  //   console.log(urlRes, dnsRes, 2398046);
  //   setUrlDnsData({
  //     URL: urlRes.map(v => ({
  //       value: v.url,
  //       label: v.url,
  //     })),
  //     DNS: dnsRes.map(v => ({
  //       value: v.dns,
  //       label: v.dns,
  //     })),
  //   });
  // };
  const [countryList, setCountryList] = useState([]);
  const [appVersionList, setAppVersionList] = useState({
    1: [],
    2: [],
  });
  const getCountry = async () => {
    const res = await getData(
      createSqlWhere({
        sql: countrySQL,
        product,
      }),
    );
    setCountryList(
      res.map(v => ({
        label: v.country,
        value: v.country,
      })),
    );
  };
  const getStatusCodeList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: statusCodeSQL,
        product,
      }),
    );
    setStatusCodeList(
      res.map(v => ({
        label: v.status_code,
        value: v.status_code,
      })),
    );
  };
  const getAppVersion = async () => {
    const res1 = await getData(
      createSqlWhere({
        sql: appVersionSQL,
        product,
        platform: 1,
      }),
    );
    const res2 = await getData(
      createSqlWhere({
        sql: appVersionSQL,
        product,
        platform: 2,
      }),
    );
    const data = {
      1: res1.map(v => ({
        label: v.app_version,
        value: v.app_version,
      })),
      2: res2.map(v => ({
        label: v.app_version,
        value: v.app_version,
      })),
    };
    setAppVersionList(data);
  };
  useEffect(() => {
    console.log(product);
    // getUrlList();
    getCountry();
    getAppVersion();
    getStatusCodeList();
  }, [product]);
  const cards = {
    DNS: ['3', '4'],
    URL: ['1', '2'],
  };

  const platformList = Object.keys(PLAFORM_LIST).map(v => ({
    value: v,
    label: PLAFORM_LIST[v],
  }));

  const getSQLData = async (type, index) => {
    let where = '';
    if (platform[type][index]) {
      where += ` and platform ='${platform[type][index]}'`;
    }
    if (country[type][index]) {
      where += ` and country ='${country[type][index]}'`;
    }
    if (appVersion[type][index]) {
      where += ` and app_version ='${appVersion[type][index]}'`;
    }
    if (statusCode[type][index]) {
      where += ` and status_code = '${statusCode[type][index]}'`;
    }

    if (selectValue[type][index]) {
      where += ` and ${type === 'DNS' ? 'dns' : 'url'} = '${selectValue[type][index]}'`;
      const res = await getData(
        createSqlWhere({
          sql: listSQL,
          startDate: startDate[index],
          endDate: endDate[index],
          where,
          product,
          dateFormat: 'YYYYMMDDHH',
        }),
      );
      const data = [];
      if (res.length) {
        const v = res[0];
        data.push({
          'conn_cost_sum_1d/conn_cost_cnt_1d': getNumber(v.conn_cost_sum_1d, v.conn_cost_cnt_1d, false),
          'costmills_sum_1d/costmills_cnt_1d': getNumber(v.costmills_sum_1d, v.costmills_cnt_1d, false),
          'rsp_cost_sum_1d/rsp_cost_cnt_1d': getNumber(v.rsp_cost_sum_1d, v.rsp_cost_cnt_1d, false),
          'dns_cost_sum_1d/dns_cost_cnt_1d': getNumber(v.dns_cost_sum_1d, v.dns_cost_cnt_1d, false),
          key: index,
        });
      }
      return data;
    }
    return [];
  };
  const columns = [
    { dataIndex: 'conn_cost_sum_1d/conn_cost_cnt_1d', title: 'HTTPS链接耗时' },
    { dataIndex: 'costmills_sum_1d/costmills_cnt_1d', title: '整体耗时' },
    { dataIndex: 'rsp_cost_sum_1d/rsp_cost_cnt_1d', title: '服务器响应耗时' },
    { dataIndex: 'dns_cost_sum_1d/dns_cost_cnt_1d', title: 'DNS解析耗时' },
  ].map(v => ({
    ...v,
    key: v.dataIndex,
  }));
  const getDataList = async (name) => {
    let res1;
    let res2;
    const res = [{}];
    const data = _.cloneDeep(dataSource);
    if (name === 'DNS') {
      res1 = await getSQLData(name, '3');
      res2 = await getSQLData(name, '4');
      data[name]['3'] = res1;
      data[name]['4'] = res2;
    } else {
      res1 = await getSQLData(name, '1');
      res2 = await getSQLData(name, '2');
      data[name]['1'] = res1;
      data[name]['2'] = res2;
    }
    if (res1.length && res2.length) {
      Object.keys(res1[0]).forEach((v) => {
        res[0][v] = getPrecision(res1[0][v], res2[0][v]);
      });
      const compare = _.cloneDeep(compareData);
      compare[name] = res;
      setDataSource(data);
      setCompareData(compare);
    } else {
      const compare = _.cloneDeep(compareData);
      compare[name] = [];
      setDataSource(data);
      setCompareData(compare);
    }
  };

  return (
    <div>
      {Object.keys(cards).map(v => (
        <Card title={v} key={v} style={{ marginBottom: 20 }}>
          <Button onClick={() => getDataList(v)} style={{ marginBottom: 10 }} type="primary">
            查询
          </Button>
          {cards[v].map(i => (
            <div style={{ marginBottom: 10 }}>
              <DatePicker.RangePicker
                value={[startDate[i], endDate[i]]}
                onChange={(values) => {
                  setStartDate({ ...startDate, [i]: values[0] });
                  setEndDate({ ...endDate, [i]: values[1] });
                }}
                style={{ marginRight: 8, width: 280 }}
                showTime={{ format: 'HH' }}
                format="YYYY-MM-DD HH"
              />
              <QueryTemplate
                value={selectValue[v][i]}
                setValue={(value) => {
                  const _value = _.cloneDeep(selectValue);
                  _value[v][i] = value.target.value;
                  setSelectValue(_value);
                }}
                title={v}
                width={400}
                type="input"
              />
              <QueryTemplate
                data={platformList}
                value={platform[v][i]}
                setValue={(value) => {
                  const _value = _.cloneDeep(platform);
                  _value[v][i] = value;
                  setPlatform(_value);
                }}
                title="平台"
              />
              <QueryTemplate
                data={countryList}
                value={country[v][i]}
                setValue={(value) => {
                  const _value = _.cloneDeep(country);
                  _value[v][i] = value;
                  setCountry(_value);
                }}
                title="地区"
              />
              <QueryTemplate
                data={platform[v][i] ? appVersionList[platform[v][i]] : []}
                value={appVersion[v][i]}
                setValue={(value) => {
                  const _value = _.cloneDeep(appVersion);
                  _value[v][i] = value;
                  setAppVersion(_value);
                }}
                title="版本"
              />
              <QueryTemplate
                data={statusCodeList}
                value={statusCode[v][i]}
                setValue={(value) => {
                  const _value = _.cloneDeep(statusCode);
                  _value[v][i] = value;
                  setStatusCode(_value);
                }}
                title="状态码"
              />
              <Table
                bordered
                style={{ marginTop: 8 }}
                dataSource={dataSource[v][i]}
                columns={columns}
                rowKey="key"
                size="small"
                scroll={{ y: 100 }}
              />
            </div>
          ))}
          <Table
            bordered
            style={{ marginTop: 8 }}
            dataSource={compareData[v]}
            columns={columns.map(v => ({
              ...v,
              render: text => (
                <p style={{ color: text > 0 ? 'green' : 'red', fontSize: 12 }}>
                  <Icon type={text > 0 ? 'arrow-up' : 'arrow-down'} />
                  {text}%
                </p>
              ),
            }))}
            rowKey="key"
            size="small"
            scroll={{ y: 50 }}
          />
        </Card>
      ))}
    </div>
  );
};
