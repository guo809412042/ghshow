import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, DatePicker, Button, Radio,
} from 'antd';
import { getData } from '../../../../../utils/request';
import { countrySQL, apiCategorySQL, apiNameSQL } from './sqlTemplate';
import { createSqlWhere, getCountryAndAppVersionAndChannel } from '../../../../../utils/utils';

export default ({ search, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  // 地区
  const [country, setCountry] = useState(search.country || []);
  const [countryList, setCountryList] = useState([]);
  const [apiCategory, setApiCategory] = useState(search.apiCategory);
  const [apiCategoryList, setApiCategoryList] = useState([]);
  const [product, setProduct] = useState(search.product);
  const [appVersionList, setAppVersionList] = useState([]);
  const [appVersion, setAppVersion] = useState(search.appVersion);
  const [apiName, setApiName] = useState(search.apiName);
  const [apiNameList, setApiNameList] = useState([]);
  const getCountryList = async () => {
    const res = await getData(countrySQL);
    setCountryList(res);
  };
  const getApiCategoryList = async () => {
    const res = await getData(apiCategorySQL);
    setApiCategoryList(res);
  };
  const getAppVersionList = async () => {
    const res = await getCountryAndAppVersionAndChannel(product, 2);
    setAppVersionList(res.appVersionList);
  };
  const getAPiNameList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: apiNameSQL,
        type: apiCategory || '',
      }),
    );
    setApiNameList(res);
  };
  useEffect(() => {
    getCountryList();
    getApiCategoryList();
  }, []);
  useEffect(() => {
    getAppVersionList();
  }, [product]);
  useEffect(() => {
    getAPiNameList();
  }, [apiCategory]);
  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      country,
      apiCategory,
      product,
      apiName,
      appVersion,
    });
  };
  return (
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <Radio.Group
          value={product}
          style={{ marginRight: '8px' }}
          onChange={(e) => {
            setProduct(e.target.value);
          }}
        >
          <Radio.Button value="1" key="1">
            Android
          </Radio.Button>
          <Radio.Button value="2" key="2">
            iOS
          </Radio.Button>
        </Radio.Group>
        <Select
          style={{ width: 200, marginRight: '8px' }}
          value={country}
          onChange={setCountry}
          mode="multiple"
          placeholder="地区"
        >
          {countryList.map(v => (
            <Select.Option value={v.country} key={v.country}>
              {v.country}
            </Select.Option>
          ))}
        </Select>
        <Select
          style={{ width: 100, marginRight: '8px' }}
          placeholder="版本"
          value={appVersion}
          onChange={setAppVersion}
        >
          {appVersionList.map(v => (
            <Select.Option key={v.value} value={v.value}>
              {v.value}
            </Select.Option>
          ))}
        </Select>
        <Select
          style={{ width: 200, marginRight: '8px' }}
          value={apiCategory}
          onChange={setApiCategory}
          placeholder="api分类"
        >
          {apiCategoryList.map(v => (
            <Select.Option value={v.api_category} key={v.api_category}>
              {v.api_category}
            </Select.Option>
          ))}
        </Select>
        <Select style={{ width: 200, marginRight: '8px' }} value={apiName} onChange={setApiName} placeholder="api名称">
          {apiNameList.map(v => (
            <Select.Option value={v.api_name} key={v.api_name}>
              {v.api_name}
            </Select.Option>
          ))}
        </Select>
        <DatePicker.RangePicker
          style={{ margin: '8px 8px 8px 0' }}
          value={[startDate, endDate]}
          onChange={(value) => {
            setStartDate(value[0]);
            setEndDate(value[1]);
          }}
        />
        <Button onClick={handleSearch} type="primary">
          查询
        </Button>
      </Collapse.Panel>
    </Collapse>
  );
};
