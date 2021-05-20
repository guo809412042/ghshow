/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import QueryTemplate from '../../../common/QueryTemplate';
import { PLAFORM_LIST } from '../../../../utils/const';
import { literalOptions, numberOptions } from '../../../common/constants';
import { selectAttr, createSqlWhere } from '../../../../utils/utils';
import { NEW_USER_LIST } from '../../const';
import { appVersionSQL, countrySQL } from '../sqlTemplate';
import { getData } from '../../../../utils/request';

export default ({ search, setSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [platform, setPlatform] = useState(search.platform);
  const [countryOperator, setCountryOperator] = useState(search.countryOperator);
  const [country, setCountry] = useState(search.country);
  const [countryList, setCountryList] = useState([]);

  const [ttid, setTtid] = useState(undefined);
  const [ttName, setTtname] = useState(undefined);
  const [newUser, setNewUser] = useState(search.newUser);
  const [appVersionOperator, setAppVersionOperator] = useState(search.appVersionOperator);
  const [appVersion, setAppVersion] = useState(search.appVersion);
  const [appVersionList, setAppVersionList] = useState([]);
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
  const newUserList = Object.keys(NEW_USER_LIST).map(v => ({
    value: v,
    label: NEW_USER_LIST[v],
  }));
  const platformList = Object.keys(PLAFORM_LIST).map(v => ({
    value: v,
    label: PLAFORM_LIST[v],
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
        <QueryTemplate data={platformList} value={platform} title="平台" setValue={setPlatform} allowClear={false} />
        <QueryTemplate
          type="rangePicker"
          title="创建时间"
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <div />
        <Select {...selectAttr} value={countryOperator} onChange={setCountryOperator} allowClear={false}>
          {literalOptions}
        </Select>

        <QueryTemplate data={countryList} value={country} title="地区" setValue={setCountry} />

        <Select {...selectAttr} value={appVersionOperator} onChange={setAppVersionOperator} allowClear={false}>
          {numberOptions}
        </Select>

        <QueryTemplate data={appVersionList} value={appVersion} title="版本" setValue={setAppVersion} />

        <QueryTemplate type="input" value={ttid} setValue={e => setTtid(e.target.value)} title="ttid" width={200} />
        <QueryTemplate type="input" value={ttName} setValue={e => setTtname(e.target.value)} title="主题" width={200} />
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
            ttName,
            ttid,
          })
          }
        >
          查询
        </Button>
      </Collapse.Panel>
    </Collapse>
  );
};
