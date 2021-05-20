/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import QueryTemplate from '../../../common/QueryTemplate';
import { PLAFORM_LIST } from '../../../../utils/const';
import { literalOptions, numberOptions } from '../../../common/constants';
import { selectAttr, createSqlWhere } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import {
  appVersionSQL, countrySQL, sourceSQL, uitypeSQL,
} from '../sqlTemplate';
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

  const [source, setSource] = useState(search.source);
  const [sourceList, setSourceList] = useState([]);

  const [uitype, setUitype] = useState(search.uitype);
  const [uitypeList, setUitypeList] = useState([]);
  const [newUser, setNewUser] = useState(search.newUser);

  const getSourceList = async () => {
    const res = await getData(sourceSQL);
    setSourceList(
      res.map(v => ({
        value: v.source,
        label: v.source,
      })),
    );
  };

  const getUniType = async () => {
    const res = await getData(uitypeSQL);
    setUitypeList(
      res.map(v => ({
        label: v.uitype,
        value: v.uitype,
      })),
    );
  };

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
  useEffect(() => {
    getAppVersionList();
  }, [platform]);
  useEffect(() => {
    getCountryList();
    getSourceList();
    getUniType();
  }, []);
  const newUserList = Object.keys(NEW_USER_LIST).map(v => ({
    value: v,
    label: NEW_USER_LIST[v],
  }));

  return (
    <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <QueryTemplate data={platformList} value={platform} title="平台" setValue={setPlatform} />
        <QueryTemplate
          type="rangePicker"
          title="创建时间"
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <div />
        <Select {...selectAttr} value={countryOperator} onChange={setCountryOperator}>
          {literalOptions}
        </Select>

        <QueryTemplate data={countryList} value={country} title="地区" setValue={setCountry} />

        <Select {...selectAttr} value={appVersionOperator} onChange={setAppVersionOperator}>
          {numberOptions}
        </Select>

        <QueryTemplate data={appVersionList} value={appVersion} title="版本" setValue={setAppVersion} />
        <QueryTemplate data={sourceList} value={source} title="source" setValue={setSource} />
        <QueryTemplate data={uitypeList} value={uitype} title="uitype" setValue={setUitype} />
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
            source,
            uitype,
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
