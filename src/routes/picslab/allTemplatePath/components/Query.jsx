/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import QueryTemplate from '../../../common/QueryTemplate';
import { PLAFORM_LIST } from '../../../../utils/const';
import { literalOptions, numberOptions } from '../../../common/constants';
import { selectAttr, createSqlWhere } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import { appVersionSQL, countrySQL } from '../sqlTemplate';
import { NEW_USER_LIST } from '../../const';

export default ({ search, setSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [platform, setPlatform] = useState(search.platform);
  const [countryOperator, setCountryOperator] = useState(search.countryOperator);
  const [country, setCountry] = useState(search.country);
  const [countryList, setCountryList] = useState([]);

  const [appVersionOperator, setAppVersionOperator] = useState(search.appVersionOperator);
  const [appVersion, setAppVersion] = useState(search.appVersion);
  const [appVersionList, setAppVersionList] = useState([]);

  const [newUser, setNewUser] = useState(search.newUser);

  const getAppVersionList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: appVersionSQL,
        platform,
      }),
    );
    const data = res.map(v => ({
      value: v.appkey,
      label: v.app_version,
    }));
    setAppVersionList(data);
  };

  const getCountryList = async () => {
    const res = await getData(countrySQL);
    const data = res.map(v => ({
      value: v.country,
      label: v.country,
    }));
    setCountryList(data);
  };

  const platformList = Object.keys(PLAFORM_LIST).map(v => ({
    value: v,
    label: PLAFORM_LIST[v],
  }));

  const newUserList = Object.keys(NEW_USER_LIST).map(v => ({
    value: v,
    label: NEW_USER_LIST[v],
  }));

  useEffect(() => {
    getAppVersionList();
  }, [platform]);
  useEffect(() => {
    getCountryList();
  }, []);
  return (
    <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <QueryTemplate allowClear={false} data={platformList} value={platform} title="平台" setValue={setPlatform} />
        <QueryTemplate
          type="rangePicker"
          title="创建时间"
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <div />
        <Select {...selectAttr} allowClear={false} value={countryOperator} onChange={setCountryOperator}>
          {literalOptions}
        </Select>

        <QueryTemplate data={countryList} value={country} title="地区" setValue={setCountry} />

        <Select {...selectAttr} value={appVersionOperator} onChange={setAppVersionOperator} allowClear={false}>
          {numberOptions}
        </Select>

        <QueryTemplate data={appVersionList} value={appVersion} title="版本" setValue={setAppVersion} />
        <QueryTemplate data={newUserList} value={newUser} title="用户" setValue={setNewUser} />
        <Button
          type="primary"
          onClick={() => setSearch({
            country,
            appVersion,
            countryOperator,
            appVersionOperator,
            startDate,
            endDate,
            platform,
            newUser,
          })
          }
        >
          查询
        </Button>
      </Collapse.Panel>
    </Collapse>
  );
};
