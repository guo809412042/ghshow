import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, DatePicker, Button,
} from 'antd';
import { getData } from '../../../utils/request';
import { createSqlWhere } from '../../../utils/utils';
import {
  mediaSourceSQL, countryNameSQL, appVersionSQL, paidTypeSQL,
} from './sqlTemplate';
import { numberOptions, literalOptions } from '../../common/constants';
import { DownLoadButton } from '../../common/DownLoadButton';

export default ({
  search, onSearch, product_id, filename = '', data = [], columns = [],
}) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [platform, setPlatform] = useState(search.platform);
  const [mediaSource, setMediaSource] = useState(search.MediaSource);
  const [countryList, setCountryList] = useState([]);
  const [country, setCountry] = useState(search.country);
  const [countryOperator, setCountryOperator] = useState(search.countryOperator);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);
  const [userType, setUserType] = useState(search.userType);
  const [appVersion, setAppVersion] = useState(search.appVersion);
  const [appVersionOperator, setAppVersionOperator] = useState(search.appVersionOperator);
  const [paidType, setPaidType] = useState(search.paidType);
  const [paidTypeList, setPaidTypeList] = useState([]);
  const [type, setType] = useState(search.type);

  const getMediaSourceList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: mediaSourceSQL,
        product: product_id,
      }),
    );
    setMediaSourceList(res);
  };
  const getCountryNameList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: countryNameSQL,
        product: product_id,
      }),
    );
    setCountryList(res);
  };
  const getAppVersionList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: appVersionSQL,
        platform,
        product: product_id,
      }),
    );
    const versionList = [];
    res.map((e) => {
      if (e && e.app_version && e.app_version.includes('.') && e.app_version.length < 8) versionList.push(e);
    });
    setAppVersionList(versionList);
  };
  const getPaidTypeList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: paidTypeSQL,
        product: product_id,
      }),
    );
    setPaidTypeList(res);
  };
  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      country,
      platform,
      mediaSource,
      appVersion,
      userType,
      paidType,
      countryOperator,
      appVersionOperator,
      type,
    });
  };
  useEffect(() => {
    getCountryNameList();
    getMediaSourceList();
    getPaidTypeList();
  }, [product_id]);
  useEffect(() => {
    getAppVersionList();
  }, [platform, product_id]);
  return (
    <div style={{ marginTop: 20 }}>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="??????" key="1">
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="????????????"
            value={type}
            onChange={e => setType(e)}
          >
            <Select.Option key="total" value="total">
              ?????????
            </Select.Option>

            {/* <Select.Option key="total_cnt" value="total_cnt">
              ??????
            </Select.Option> */}
          </Select>
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="??????"
            value={platform}
            onChange={e => setPlatform(e)}
          >
            <Select.Option key="1" value="1">
              Andorid
            </Select.Option>

            <Select.Option key="2" value="2">
              iOS
            </Select.Option>
          </Select>
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="??????"
            value={countryOperator}
            onChange={setCountryOperator}
          >
            {literalOptions}
          </Select>

          <Select
            style={{ width: 140, marginRight: '8px' }}
            placeholder="??????"
            value={country}
            allowClear
            showSearch
            onChange={setCountry}
          >
            {countryList.map(v => (
              <Select.Option key={v.country} value={v.country}>
                {v.country}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="??????"
            value={appVersionOperator}
            onChange={setAppVersionOperator}
          >
            {numberOptions}
          </Select>
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="??????"
            allowClear
            value={appVersion}
            onChange={setAppVersion}
          >
            {appVersionList.map(v => (
              <Select.Option key={v.app_version} value={v.app_version}>
                {v.app_version}
              </Select.Option>
            ))}
          </Select>

          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="????????????"
            value={userType}
            onChange={setUserType}
            allowClear
          >
            <Select.Option key=" = 1" value="= 1">
              ?????????
            </Select.Option>
            <Select.Option key="<> 1" value="<> 1">
              ?????????
            </Select.Option>
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            showSearch
            placeholder="??????"
            value={mediaSource}
            onChange={setMediaSource}
            allowClear
          >
            {mediaSourceList.map(v => (
              <Select.Option key={v.media_source} value={v.media_source}>
                {v.media_source}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="?????????"
            value={paidType}
            allowClear
            onChange={setPaidType}
          >
            {paidTypeList.map(v => (
              <Select.Option key={v.paid_type} value={v.paid_type}>
                {v.paid_type}
              </Select.Option>
            ))}
          </Select>
          <DatePicker.RangePicker
            style={{ margin: '8px 8px 8px 0', width: 250 }}
            value={[startDate, endDate]}
            onChange={(value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }}
          />
          <Button onClick={handleSearch} type="primary" style={{ marginRight: 10 }}>
            ??????
          </Button>
          <DownLoadButton filename={filename} data={data} columns={columns} buttonText={false} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
