import React, { useState, useEffect } from 'react';
import { DatePicker, Collapse, Button, Select, Input } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { selectAttr, getCountryAndAppVersionAndChannel, selectAttr1 } from '../../../../utils/utils';
import { literalOptions, numberOptions } from '../../../common/constants';

export default ({ onSearch, product, noAndroid, noIos, defaultNewUser = '1', search }) => {
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(2, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));
  const [countryOperation, setCountryOperation] = useState(search.countryOperation || '=');
  const [accessType, setAccessType] = useState(search.accessType || 'uv');
  const [appVersionOperation, setAppVersionOperation] = useState(search.appVersionOperation || '=');
  const [selectCountry, setSelectCountry] = useState(search.selectCountry || undefined);
  const [selectAppVersion, setSelectAppVersion] = useState(search.selectAppVersion || undefined);
  const [platform, setPlatform] = useState(search.platform || '2');
  const [countryList, setCountryList] = useState([]);
  const [newUser, setNewUser] = useState(defaultNewUser);
  const [appVersionList, setAppVersionList] = useState([]);

  const getCountryAndAppVersion = async () => {
    const { countryList, appVersionList } = await getCountryAndAppVersionAndChannel(platform, product);
    setCountryList(countryList);
    setAppVersionList(appVersionList);
  };

  useEffect(() => {
    getCountryAndAppVersion();
  }, [platform]);

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      countryOperation,
      selectCountry,
      appVersionOperation,
      selectAppVersion,
      newUser,
      platform,
      accessType
    });
  };

  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select {...selectAttr} allowClear={false} placeholder="平台" value={platform} onChange={setPlatform}>
            {noAndroid ? (
              ''
            ) : (
              <Select.Option key="1" value="1">
                Andorid
              </Select.Option>
            )}
            {noIos ? (
              ''
            ) : (
              <Select.Option key="2" value="2">
                iOS
              </Select.Option>
            )}
          </Select>

          <DatePicker.RangePicker
            style={{ marginRight: 8 }}
            value={[startDate, endDate]}
            onChange={values => {
              setStartDate(values[0]);
              setEndDate(values[1]);
              handleSearch();
            }}
          />
          <Select {...selectAttr} value={accessType} onChange={setAccessType}>
            <Select.Option value="uv">UV</Select.Option>
            <Select.Option value="pv">PV</Select.Option>
          </Select>
          <div style={{ marginTop: 10 }} />
          <Select {...selectAttr} value={countryOperation} onChange={setCountryOperation}>
            {literalOptions}
          </Select>
          <Select {...selectAttr} placeholder="地区" value={selectCountry} onChange={setSelectCountry}>
            {_.map(countryList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Select {...selectAttr} value={appVersionOperation} onChange={setAppVersionOperation}>
            {numberOptions}
          </Select>
          <Select placeholder="版本" {...selectAttr} value={selectAppVersion} onChange={setSelectAppVersion}>
            {_.map(appVersionList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Select {...{ ...selectAttr1, allowClear: false }} value={newUser} onChange={setNewUser} placeholder="用户">
            <Select.Option key="" value="">
              整体
            </Select.Option>
            <Select.Option key="1" value="1">
              新用户
            </Select.Option>
            <Select.Option key="0" value="0">
              老用户
            </Select.Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
