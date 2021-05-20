/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, Tooltip, Button,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import {
  selectAttr,
  getCountryAndAppVersionAndChannel,
  createSqlWhere,
} from '../../../../utils/utils';
import { literalOptions, numberOptions } from '../../../common/constants';
import { apiListSQL, apiCatorySQL, apiListVivaSQL } from './sqlTemplate';
import { getHoloData } from '../../../../utils/request';

export default ({
  onSearch,
  platform,
  database = '',
  currentDate,
  productInfo,
}) => {
  // database = database.replace(
  //   /#type#/,
  //   Number(platform) === 1 ? 'android' : 'ios',
  // );
  database = productInfo.database.replace(
    /#type#/,
    Number(platform) === 1 ? 'android' : 'ios',
  );

  const [countryOperation, setCountryOperation] = useState('=');
  const [appVersionOperation, setAppVersionOperation] = useState('=');
  const [selectCountry, setSelectCountry] = useState(undefined);
  const [selectAppVersion, setSelectAppVersion] = useState(undefined);
  const [countryList, setCountryList] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);
  const [apiList, setApiList] = useState([]);
  const [apiName, setApiName] = useState(undefined);
  const [apiCategory, setApiCategory] = useState(undefined);
  const [apiCategoryList, setApiCategoryList] = useState([]);
  const getCountryAndAppVersion = async () => {
    const {
      countryList,
      appVersionList,
    } = await getCountryAndAppVersionAndChannel(platform, productInfo.product_id);
    setCountryList(countryList);
    setAppVersionList(appVersionList);
  };
  const getApiList = async () => {
    const sql = createSqlWhere({
      sql: Number(productInfo.product_id) === 2 ? apiListVivaSQL : apiListSQL,
      database,
      startDate: moment(currentDate).subtract(7, 'days'),
      endDate: moment(currentDate).subtract(1, 'days'),
      type: Number(platform) === 1 ? 144000 : 5000,
    });
    const res = await getHoloData(sql);
    setApiList(res);
  };
  const getApiCategory = async () => {
    const sql = createSqlWhere({
      sql: apiCatorySQL,
      database,
    });
    const res = await getHoloData(sql);
    setApiCategoryList(res);
  };
  const handleSearch = () => {
    let where = '';
    if (selectCountry) {
      where += `and country ${countryOperation} '${selectCountry}'`;
    }
    if (selectAppVersion) {
      where += ` and app_version ${appVersionOperation} '${selectAppVersion}' `;
    }
    if (apiName) {
      where += ` and api_name = '${apiName}'`;
    }
    if (apiCategory) {
      where += ` and api_category = '${apiCategory}'`;
    }
    // if (currentDate) {
    //   where += ` and date_time >= '${moment(currentDate).format(dateFormat)} 00:00:00' and date_time <= '${moment(currentDate).format(dateFormat)} 23:59:59'`;
    // }

    onSearch({
      where,
      // platform,
    });
  };
  useEffect(() => {
    getCountryAndAppVersion();
    getApiList();
    getApiCategory();
  }, [platform, productInfo.product_id]);
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select
            {...selectAttr}
            value={countryOperation}
            onChange={setCountryOperation}
          >
            {literalOptions}
          </Select>
          <Select
            {...selectAttr}
            placeholder="地区"
            value={selectCountry}
            onChange={setSelectCountry}
          >
            {_.map(countryList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Select
            {...selectAttr}
            value={appVersionOperation}
            onChange={setAppVersionOperation}
          >
            {numberOptions}
          </Select>
          <Select
            placeholder="版本"
            {...selectAttr}
            value={selectAppVersion}
            onChange={setSelectAppVersion}
          >
            {_.map(appVersionList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <div style={{ marginTop: 10 }} />
          <Select
            placeholder="api名称"
            {...selectAttr}
            value={apiName}
            onChange={setApiName}
            showSearch
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())
            }
            style={{ width: 400, marginRight: 8 }}
          >
            {_.map(apiList, item => (
              <Select.Option key={item.api_name} value={item.api_name}>
                <Tooltip title={item.api_name}>{item.api_name}</Tooltip>
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="api分类"
            {...selectAttr}
            value={apiCategory}
            showSearch
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())
            }
            onChange={setApiCategory}
            style={{ width: 400, marginRight: 8 }}
          >
            {_.map(apiCategoryList, item => (
              <Select.Option key={item.api_category} value={item.api_category}>
                <Tooltip title={item.api_category}>{item.api_category}</Tooltip>
              </Select.Option>
            ))}
          </Select>
          <Button onClick={handleSearch} type="primary">
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
