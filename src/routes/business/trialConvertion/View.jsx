/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Collapse, Select, Button, Table, Tooltip,
} from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';
import style from './styles/index.less';
import MyDatePicker from '../../components/MyDatePicker';
import {
  PRODUCT_LIST,
  dauConvertColumns,
  userConvertColumns,
  userRateColumns,
  userToPayColumns,
  COUNTRY_NAME_COMMON_LIST,
} from './const';
import { DownLoadButton } from '../../common/DownLoadButton';
import { getData } from '../../../utils/request';
import { whereSql } from '../newIncomeSource/components/utils';
import {
  SkuListSQL,
  ConvertDayListSQL,
  ConvertMonthListSQL,
  CountryListSQL,
  UserTrialRateListSQL,
  UserToPayListSQL,
} from './components/sqlTemplate';
import { filterEmptyObj } from '../../../utils/utils';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';
import { groupSignal } from './utils';
import { chartRender } from '../newUserPay/components/chartRender';

export default () => {
  const [product, setProduct] = useState(2);
  const [payway, setPayway] = useState('1'); // GP|iOS
  const [opt, setOpt] = useState('in'); // in|not in
  const [countries, setCountries] = useState([]);
  const [sku, setSku] = useState();
  const [dataType, setDataType] = useState('user'); // dau|user
  const [channel, setChannel] = useState(''); // put|organic
  const [startDate, setStartDate] = useState(moment().subtract(10, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(4, 'days'));
  const [dataSpan, setDataSpan] = useState('day'); // day|month

  const [productList, setProductList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [skuList, setSkuList] = useState([]);

  const [dauConvertList, setDauConvertList] = useState([]); // dau试用转化
  const [userConvertList, setUserConvertList] = useState([]); // 新用户试用转化
  const [userRateList, setUserRateList] = useState([]); // 新用户试用率
  const [userToPayList, setUserToPayList] = useState([]); // 新用户试用转付费

  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 获取查询where条件字符串
  const getWhere = (new_user, sku_id) => {
    const searchParams = {
      ds__gte: moment(startDate).format('YYYYMMDD'),
      ds__lte: moment(endDate).format('YYYYMMDD'),
      new_user,
      product_id: product,
      platform: payway,
      sku_id,
    };

    if (!countries.includes(' ')) {
      if (opt === 'in') {
        searchParams.country_name__in = countries.length === 0 ? undefined : countries.reduce((prev, current) => current.concat(prev), []);
      } else {
        searchParams.country_name__notIn = countries.length === 0 ? undefined : countries.reduce((prev, current) => current.concat(prev), []);
      }
    }

    if (channel === 'put') {
      searchParams.media_source__not = 'Organic';
    } else if (channel === 'organic') {
      searchParams.media_source = 'Organic';
    }

    const where = whereSql(filterEmptyObj(searchParams));
    return where ? ` where ${where}` : '';
  };

  // 获取试用转化表格数据
  const getConvertList = async () => {
    const isNewUser = dataType === 'user' ? 1 : undefined;
    const where1 = getWhere(isNewUser);
    const where2 = getWhere(isNewUser, sku);
    let sql;
    if (dataSpan === 'day') {
      sql = ConvertDayListSQL.replace(/\?/g, where1).replace(/#/g, where2);
    } else {
      sql = ConvertMonthListSQL.replace(/\?/g, where1).replace(/#/g, where2);
    }
    const convertList = await getData(sql);
    const chartList = [];
    convertList.forEach((v) => {
      chartList.push({
        day: moment(v.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: v.trial_rate,
        type: '试用率',
      });
      chartList.push({
        day: moment(v.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: v.trial_convert_rate,
        type: '试用转化率',
      });
      chartList.push({
        day: moment(v.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: v.trial_pay_rate,
        type: '试用付费率',
      });
      chartList.push({
        day: moment(v.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: v.pay_rate,
        type: '直接付费率',
      });
    });
    if (dataType === 'dau') {
      setDauConvertList(convertList);
      chartLineRender(chartList, document.getElementById('dauConvertChart'));
    } else if (dataType === 'user') {
      setUserConvertList(convertList);
      chartLineRender(chartList, document.getElementById('userConvertChart'));
    }
  };

  // 获取新用户试用率表格数据
  const getUserRateList = async () => {
    const where1 = getWhere(undefined);
    const where2 = getWhere(undefined, sku);
    const sql = UserTrialRateListSQL.replace(/\?/g, where1).replace(/#/g, where2);
    const trialRateList = await getData(sql);
    let tableData = [];
    const chartData = [];
    if (trialRateList && trialRateList.length > 0) {
      const groupBy = groupSignal(trialRateList, 'ds');
      for (const item in groupBy) {
        const ds = groupBy[item];
        const obj = { ds: item, new_usr_cnt_1d: ds[0].new_usr_cnt_1d };
        let trialDaySum = 0;
        const total = ds[0].new_usr_cnt_1d;
        for (let i = 0; i < ds.length; i++) {
          if ('trial_dvc_cnt_1d' in ds[i]) {
            trialDaySum += ds[i].trial_dvc_cnt_1d;
            const percent = (trialDaySum / total) * 100;
            obj[`interval_day${i}`] = `${ds[i].trial_dvc_cnt_1d}(${percent.toFixed(2)}%)`;
            // if(selectedRowKeys.length>0 && selectedRowKeys[0].ds===item){
            //   chartData.push({
            //     day:dayIndex++,
            //     value:percent,
            //     type:moment(item,'YYYYMMDD').format('YYYY-MM-DD'),
            //   });
            // }
          }
        }
        tableData.push(obj);
      }

      // 从开始日期到现在
      let newSum = 0;
      Object.keys(groupBy).forEach((key) => {
        newSum += groupBy[key][0].new_usr_cnt_1d;
      });
      let trialSum = 0;

      const diff = moment(moment(Date.now())).diff(startDate, 'days');
      for (let i = 0; i < (diff > 31 ? 31 : diff); i++) {
        let chartSum = 0;
        Object.keys(groupBy).forEach((v) => {
          chartSum += groupBy[v][i] ? groupBy[v][i].trial_dvc_cnt_1d : 0;
        });
        trialSum += chartSum;
        chartData.push({
          day: i.toString(),
          value: (trialSum / newSum) * 100,
          type: '整体',
        });
      }

      tableData = tableData.sort((a, b) => b.ds - a.ds);
    }
    setUserRateList(tableData || []);
    chartRender(chartData, 'userRateChart');
  };

  // 获取新用户试用转付费表格数据
  const getUserToPayList = async () => {
    const where1 = getWhere(undefined);
    const where2 = getWhere(undefined, sku);
    const sql = UserToPayListSQL.replace(/\?/g, where1).replace(/#/g, where2);
    const toPayList = await getData(sql);

    let tableData = [];
    const chartData = [];
    if (toPayList && toPayList.length > 0) {
      const groupBy = groupSignal(toPayList, 'ds');
      for (const item in groupBy) {
        const ds = groupBy[item];
        const obj = { ds: item, new_usr_cnt_1d: ds[0].new_usr_cnt_1d };
        // let payDaySum = 0;
        for (let i = 0; i < ds.length; i++) {
          if ('trial_pay_dvc_cnt_1d' in ds[i]) {
            const trialNum = ds[i].trial_dvc_cnt_1d;
            const percent = (ds[i].trial_pay_dvc_cnt_1d / trialNum) * 100;
            obj[`interval_day${i}`] = `${ds[i].trial_pay_dvc_cnt_1d}(${percent.toFixed(2)}%)`;
          }
        }
        tableData.push(obj);
      }

      // 从开始日期到现在
      const diff = moment(moment(Date.now())).diff(startDate, 'days');
      for (let i = 0; i < (diff > 31 ? 31 : diff); i++) {
        let chartSum = 0;
        Object.keys(groupBy).forEach((v) => {
          chartSum += groupBy[v][i] ? groupBy[v][i].trial_pay_dvc_cnt_1d : 0;
        });
        let trialSum = 0;
        Object.keys(groupBy).forEach((key) => {
          trialSum += groupBy[key][i] ? groupBy[key][i].trial_dvc_cnt_1d : 0;
        });
        if (trialSum === 0) {
          chartSum = 0;
          trialSum = 1;
        }
        chartData.push({
          day: i.toString(),
          value: (chartSum / trialSum) * 100,
          type: '整体',
        });
      }

      tableData = tableData.sort((a, b) => b.ds - a.ds);
    }

    setUserToPayList(tableData || []);
    chartRender(chartData, 'userToPayChart');
  };

  const search = async () => {
    if (dataType === 'user') {
      getUserRateList();
      getUserToPayList();
    }
    getConvertList();
  };

  const changePanel = (e) => {
    if (e.length > 0) {
      search();
    }
  };

  // 获取国家列表
  const getCountryList = async () => {
    const countryList = await getData(CountryListSQL);
    const list = COUNTRY_NAME_COMMON_LIST.concat(
      countryList.map(v => ({ country_code: [v.country], country_name: v.country })),
    );
    setCountryList(list);
  };

  // 获取商品列表
  const getSkuList = async () => {
    let where = ` where product_id=${product}`;
    if (countries.length > 0 && !countries.includes(' ')) {
      where += ` and country_name in (${countries.map(j => j.map(i => `'${i}'`)).join()})`;
    }
    const skuList = await getData(SkuListSQL.replace(/\?/g, where));
    setSkuList(skuList);
    setSku();
  };

  // const rowSelection = {
  //   onChange: (selectedRowKeys) => {
  //     setSelectedRowKeys(selectedRowKeys.length ? [selectedRowKeys[selectedRowKeys.length - 1]] : []);
  //   },
  //   selectedRowKeys,
  // };

  useEffect(() => {
    search();
  }, [dataSpan, dataType]);

  useEffect(() => {
    getSkuList();
  }, [product, countries]);

  useEffect(() => {
    const products = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const key in PRODUCT_LIST) {
      // eslint-disable-next-line no-prototype-builtins
      if (PRODUCT_LIST.hasOwnProperty(key)) {
        const value = PRODUCT_LIST[key];
        products.push({ key, value });
      }
    }
    setProductList(products);

    getCountryList();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Collapse defaultActiveKey={['1']}>
          <Collapse.Panel header="查询" key="1">
            <div>
              <Select
                placeholder="产品"
                value={product}
                onChange={setProduct}
                className={style.queryItem}
                key="product"
              >
                {productList.map(v => (
                  <Select.Option value={v.value} key={v.key}>
                    {v.key}
                  </Select.Option>
                ))}
              </Select>
              <Select placeholder="平台" value={payway} onChange={setPayway} className={style.queryItem} key="payway">
                <Select.Option key="GP" value="1">
                  GP
                </Select.Option>
                <Select.Option key="iOS" value="2">
                  iOS
                </Select.Option>
              </Select>
              <Select placeholder="操作" value={opt} onChange={setOpt} className={style.queryItem} key="opt">
                <Select.Option key="in" value="in">
                  包含
                </Select.Option>
                <Select.Option key="not in" value="not in">
                  不包含
                </Select.Option>
              </Select>
              <Select
                placeholder="地区"
                allowClear
                mode="multiple"
                value={countries}
                onChange={setCountries}
                className={style.queryItem}
                key="countries"
              >
                {countryList.map(v => (
                  <Select.Option key={v.country_name} value={v.country_code}>
                    <Tooltip title={v.country_name}>{v.country_name}</Tooltip>
                  </Select.Option>
                ))}
              </Select>
              <Select
                showSearch
                allowClear
                placeholder="商品ID"
                value={sku}
                onChange={setSku}
                className={style.queryItem}
                key="sku"
              >
                {skuList.map(v => (
                  <Select.Option key={v.sku} value={v.sku}>
                    <Tooltip title={v.sku}>{v.sku}</Tooltip>
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="类型"
                value={dataType}
                onChange={setDataType}
                className={style.queryItem}
                key="dataType"
              >
                <Select.Option key="dau" value="dau">
                  dau
                </Select.Option>
                <Select.Option key="user" value="user">
                  新用户
                </Select.Option>
              </Select>
              <Select
                placeholder="渠道"
                value={channel}
                onChange={setChannel}
                className={style.queryItem}
                key="channel"
              >
                <Select.Option key="" value="">
                  所有渠道
                </Select.Option>
                <Select.Option key="put" value="put">
                  投放渠道
                </Select.Option>
                <Select.Option key="organic" value="organic">
                  自然渠道
                </Select.Option>
              </Select>
              <MyDatePicker
                style={{ width: 250, margin: 8 }}
                value={[startDate, endDate]}
                onChange={(values) => {
                  setStartDate(values[0]);
                  setEndDate(values[1]);
                }}
              />
              <Button type="primary" onClick={search}>
                查询
              </Button>
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
      {dataType === 'dau' ? (
        <div>
          <div>
            <DownLoadButton
              className={style.queryItem}
              key="导出"
              filename="dau试用转化"
              columns={dauConvertColumns}
              data={dauConvertList}
            />
            <RadioGroup
              key="日月"
              style={{ marginBottom: 8 }}
              value={dataSpan}
              onChange={e => setDataSpan(e.target.value)}
              buttonStyle="solid"
            >
              <RadioButton key="day" value="day">
                日
              </RadioButton>
              <RadioButton key="month" value="month">
                月
              </RadioButton>
            </RadioGroup>
          </div>
          <Table
            dataSource={dauConvertList}
            columns={dauConvertColumns}
            bordered
            pagination={{
              hideOnSinglePage: true,
            }}
            scroll={{ x: 'max-content' }}
          />
          <h3>dau转化率曲线图</h3>
          <div id="dauConvertChart" key="dauConvertChart" />
        </div>
      ) : (
        <div>
          <div>
            <DownLoadButton
              className={style.queryItem}
              key="导出转化"
              title="导出转化"
              filename="新用户试用转化"
              columns={userConvertColumns}
              data={userConvertList}
            />
            <RadioGroup
              key="日月"
              style={{ marginBottom: 8 }}
              value={dataSpan}
              onChange={e => setDataSpan(e.target.value)}
              buttonStyle="solid"
            >
              <RadioButton key="day" value="day">
                日
              </RadioButton>
              <RadioButton key="month" value="month">
                月
              </RadioButton>
            </RadioGroup>
          </div>
          <Table
            dataSource={userConvertList}
            columns={userConvertColumns}
            bordered
            pagination={{
              hideOnSinglePage: true,
            }}
            scroll={{ x: 'max-content' }}
          />
          <Collapse onChange={changePanel} defaultActiveKey={['1']}>
            <Collapse.Panel header="新用户首日转化率曲线" key="1">
              <div id="userConvertChart" key="userConvertChart" />
            </Collapse.Panel>
          </Collapse>

          <div className={style.tableChartWrapper}>
            <DownLoadButton
              className={style.queryItem}
              key="导出试用"
              title="导出试用"
              filename="新用户试用率"
              columns={userRateColumns}
              data={userRateList}
            />
            <p />
            <Table
              dataSource={userRateList}
              columns={userRateColumns}
              bordered
              // rowSelection={rowSelection}
              pagination={{
                hideOnSinglePage: true,
              }}
              scroll={{ x: 'max-content' }}
            />
          </div>
          <Collapse onChange={changePanel} defaultActiveKey={['2']}>
            <Collapse.Panel header="新用户试用率曲线" key="2">
              <div id="userRateChart" key="userRateChart" />
            </Collapse.Panel>
          </Collapse>

          <div className={style.tableChartWrapper}>
            <DownLoadButton
              className={style.queryItem}
              key="导出付费"
              title="导出付费"
              filename="新用户试用转付费"
              columns={userToPayColumns}
              data={userToPayList}
            />
            <p />
            <Table
              dataSource={userToPayList}
              columns={userToPayColumns}
              bordered
              // rowSelection={rowSelection}
              pagination={{
                hideOnSinglePage: true,
              }}
              scroll={{ x: 'max-content' }}
            />
          </div>
          <Collapse onChange={changePanel} defaultActiveKey={['3']}>
            <Collapse.Panel header="新用户注册后在第n天试用的试用转付费率曲线" key="3">
              <div id="userToPayChart" key="userToPayChart" />
            </Collapse.Panel>
          </Collapse>
        </div>
      )}
    </div>
  );
};
