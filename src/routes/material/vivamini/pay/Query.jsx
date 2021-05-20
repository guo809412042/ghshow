import React, { useState, useEffect } from 'react';
import {
  DatePicker, Collapse, Radio, Select, Input, Button,
} from 'antd';
import { selectAttr, createSqlWhere } from '../../../../utils/utils';
import { countrySQL, appVersionSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';

export default ({ search, setSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [platform, setPlatform] = useState(search.platform);
  const [newUser, setNewUser] = useState(search.newUser);
  const [ttid, setTtid] = useState(search.ttid || undefined);
  const [ttname, setTtname] = useState(search.ttname || undefined);
  const [country, setCountry] = useState(search.country);
  const [appVersion, setAppVersion] = useState(search.appVersion);
  const [countryList, setCountryList] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);
  const getCountry = async () => {
    const res = await getData(
      createSqlWhere({
        sql: countrySQL,
        platform,
      }),
    );
    setCountryList(res);
  };
  const getAppVersion = async () => {
    const res = await getData(
      createSqlWhere({
        sql: appVersionSQL,
        platform,
      }),
    );
    setAppVersionList(res);
  };
  useEffect(() => {
    getCountry();
    getAppVersion();
  }, [platform]);
  return (
    <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <Radio.Group
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value);
          }}
          style={{ marginRight: 8 }}
        >
          <Radio.Button value="1" key="1">
            Android
          </Radio.Button>
          <Radio.Button value="2" key="2">
            iOS
          </Radio.Button>
        </Radio.Group>
        <Select placeholder="用户" {...selectAttr} value={newUser} style={{ marginRight: 8 }} onChange={setNewUser}>
          <Select.Option key="" value="">
            整体
          </Select.Option>
          <Select.Option key="1" value="1">
            新用户
          </Select.Option>
          <Select.Option value="0" key="0">
            老用户
          </Select.Option>
        </Select>
        <Select
          mode="multiple"
          showSearch
          allowClear
          value={country}
          onChange={setCountry}
          style={{ width: 200 }}
          placeholder="地区"
        >
          {countryList.map(v => (
            <Select.Option key={v.country} value={v.country}>
              {v.country}
            </Select.Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          showSearch
          allowClear
          value={appVersion}
          onChange={setAppVersion}
          style={{ margin: 8, width: 200 }}
          placeholder="版本"
        >
          {appVersionList.map(v => (
            <Select.Option key={v.app_version} value={v.app_version}>
              {v.app_version}
            </Select.Option>
          ))}
        </Select>
        <Input placeholder="ttid" value={ttid} onChange={e => setTtid(e.target.value)} style={{ width: 200 }} />
        <Input
          placeholder="模版名称"
          value={ttname}
          onChange={e => setTtname(e.target.value)}
          style={{ width: 200, margin: '0px 8px' }}
        />
        <DatePicker.RangePicker
          value={[startDate, endDate]}
          onChange={(values) => {
            setStartDate(values[0]);
            setEndDate(values[1]);
          }}
          style={{ marginRight: 8 }}
        />
        <Button
          type="primary"
          onClick={() => setSearch({
            ttid,
            ttname,
            startDate,
            endDate,
            newUser,
            platform,
            country,
            appVersion,
          })
          }
        >
          查询
        </Button>
      </Collapse.Panel>
    </Collapse>
  );
};
