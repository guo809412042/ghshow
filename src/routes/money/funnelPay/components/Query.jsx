import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import _ from 'lodash';
import { selectAttr, createSqlWhere } from '../../../../utils/utils';
import { literalOptions } from '../../../common/constants';
import {
  appVersionSQL, categorySQL, functionSQL, fvalueSQL, countrySQL,
} from './sqlTemplate';
import { getData } from '../../../../utils/request';

export default ({ onSearch, platform }) => {
  const [countryOperation, setCountryOperation] = useState('=');
  const [appVersionOperation, setAppVersionOperation] = useState('=');
  const [selectCountry, setSelectCountry] = useState(undefined);
  const [selectAppVersion, setSelectAppVersion] = useState(undefined);
  const [userType, setUserType] = useState('Y');
  const [countryList, setCountryList] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);
  const [selectCategory, setSelectCategory] = useState(undefined);
  const [categoryList, setCategoryList] = useState([]);
  const [selectFunction, setSelectFunction] = useState(undefined);
  const [functionList, setFunctionList] = useState([]);
  const [selectEntrance, setSelectEntrance] = useState(undefined);
  const [entranceList, setEntranceList] = useState([]);

  const [search, setSearch] = useState(false);
  const handleSearch = () => {
    let where = '';
    if (selectCountry && selectCountry.length) {
      if (selectCountry.length <= 1) {
        where += `and country ${countryOperation} '${selectCountry}'`;
      } else {
        where += `and country ${countryOperation === '=' ? ' in ' : ' not in '} (${selectCountry
          .map(v => `'${v}'`)
          .join(',')}) `;
      }
    }
    if (selectAppVersion && selectAppVersion.length) {
      if (selectAppVersion.length <= 1) {
        where += `and app_version ${appVersionOperation} '${selectAppVersion}'`;
      } else {
        where += `and app_version ${appVersionOperation === '=' ? ' in ' : ' not in '} (${selectAppVersion
          .map(v => `'${v}'`)
          .join(',')}) `;
      }
    }
    onSearch({
      where,
      category: selectCategory,
      funtion: selectFunction,
      fvalue: selectEntrance,
      userType,
    });
  };
  const getCountry = async () => {
    const res = await getData(countrySQL.replace(/#platform#/, platform));
    setCountryList(res);
  };

  const getAppVersion = async () => {
    const res = await getData(appVersionSQL.replace(/#platform#/, platform));
    setAppVersionList(res);
  };
  const getCategory = async () => {
    const res = await getData(categorySQL.replace(/#platform#/, platform));
    setCategoryList(res);
  };
  const getFunctionList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: functionSQL,
        platform,
        type: selectCategory,
      }),
    );
    setFunctionList(res);
  };
  const getFvalueList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: fvalueSQL,
        platform,
        type: selectCategory,
      }).replace(/#funtion#/, selectFunction),
    );
    setEntranceList(res);
  };
  useEffect(() => {
    if (selectCategory) {
      getFunctionList();
    } else {
      setFunctionList([]);
    }
    setSelectFunction(undefined);
  }, [selectCategory]);

  useEffect(() => {
    if (selectFunction) {
      getFvalueList();
    } else {
      setEntranceList([]);
    }
    setSelectEntrance(undefined);
  }, [selectFunction]);

  useEffect(() => {
    handleSearch();
  }, [search]);

  useEffect(() => {
    setCountryOperation('=');
    setAppVersionOperation('=');
    setSelectCountry(undefined);
    setSelectAppVersion(undefined);
    setUserType('Y');
    setSelectCategory(undefined);
    setSelectFunction(undefined);
    setSelectEntrance(undefined);
    setSearch(!search);

    getCountry();
    getAppVersion();
    getCategory();
  }, [platform]);
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select {...selectAttr} value={countryOperation} onChange={setCountryOperation}>
            {literalOptions}
          </Select>
          <Select {...selectAttr} mode="multiple" placeholder="地区" value={selectCountry} onChange={setSelectCountry}>
            {_.map(countryList, item => (
              <Select.Option key={item.country} value={item.country}>
                {item.country}
              </Select.Option>
            ))}
          </Select>
          <Select {...selectAttr} value={appVersionOperation} onChange={setAppVersionOperation}>
            {literalOptions}
          </Select>
          <Select
            placeholder="版本"
            {...selectAttr}
            mode="multiple"
            value={selectAppVersion}
            onChange={setSelectAppVersion}
          >
            {_.map(appVersionList, item => (
              <Select.Option key={item.app_version} value={item.app_version}>
                {item.app_version}
              </Select.Option>
            ))}
          </Select>
          <Select placeholder="用户" {...selectAttr} value={userType} onChange={setUserType}>
            <Select.Option key="" value="">
              整体
            </Select.Option>
            <Select.Option key="Y" value="Y">
              新用户
            </Select.Option>
            <Select.Option value="N" key="N">
              老用户
            </Select.Option>
          </Select>
          <div style={{ marginTop: 10 }} />
          <Select placeholder="分类" {...selectAttr} value={selectCategory} onChange={setSelectCategory}>
            {categoryList.map(v => (
              <Select.Option key={v.category} value={v.category}>
                {v.category}
              </Select.Option>
            ))}
          </Select>
          <Select placeholder="功能" {...selectAttr} value={selectFunction} onChange={setSelectFunction}>
            {functionList.map(v => (
              <Select.Option key={v.funtion} value={v.funtion}>
                {v.funtion}
              </Select.Option>
            ))}
          </Select>
          <Select placeholder="入口" {...selectAttr} value={selectEntrance} onChange={setSelectEntrance}>
            {entranceList.map(v => (
              <Select.Option key={v.fvalue} value={v.fvalue}>
                {v.fvalue}
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
