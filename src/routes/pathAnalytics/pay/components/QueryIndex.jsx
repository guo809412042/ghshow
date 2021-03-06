import React, { useState, useEffect } from 'react';
import {
  DatePicker, Collapse, Button, Select,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import {
  selectAttr, getCountryAndAppVersionAndChannel, selectAttr1, createSqlWhere,
} from '../../../../utils/utils';
import { literalOptions, numberOptions } from '../../../common/constants';
import { getData } from '../../../../utils/request';
import { subTypeSQL } from './sqlTemplate';

export default ({
  onSearch,
  product,
  noAndroid,
  noIos,
  defaultPlatform = '1',
  defaultNewUser = 'Y',
  countryName = 'country_name',
}) => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [countryOperation, setCountryOperation] = useState('=');
  const [appVersionOperation, setAppVersionOperation] = useState('=');
  const [selectCountry, setSelectCountry] = useState(undefined);
  const [selectAppVersion, setSelectAppVersion] = useState(undefined);
  const [platform, setPlatform] = useState(defaultPlatform);
  const [countryList, setCountryList] = useState([]);
  const [newUser, setNewUser] = useState(defaultNewUser);
  const [appVersionList, setAppVersionList] = useState([]);
  const [subType, setSubType] = useState(undefined);
  const [subTypeList, setSubTypeList] = useState([]);

  const getCountryAndAppVersion = async () => {
    const { countryList, appVersionList } = await getCountryAndAppVersionAndChannel(platform, product);
    setCountryList(countryList);
    setAppVersionList(appVersionList);
  };
  const getSubType = async () => {
    const res = await getData(
      createSqlWhere({
        sql: subTypeSQL,
        product,
        platform,
      }),
    );
    setSubTypeList(res);
  };

  useEffect(() => {
    getCountryAndAppVersion();
  }, [platform]);
  useEffect(() => {
    getSubType();
  }, [platform]);
  const handleSearch = () => {
    let where = '';
    if (selectCountry) {
      where += `and ${countryName} ${countryOperation} '${selectCountry}'`;
    }
    if (selectAppVersion) {
      where += ` and app_version ${appVersionOperation} '${selectAppVersion}' `;
    }
    if (newUser) {
      where += ` and new_user =  '${newUser}' `;
    }
    where += ` and platform = '${platform}' `;
    onSearch({
      where,
      startDate,
      endDate,
      platform,
      subType,
    });
  };
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="??????" key="1">
          <Select {...selectAttr} allowClear={false} placeholder="??????" value={platform} onChange={setPlatform}>
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
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
              handleSearch();
            }}
          />
          <div style={{ marginTop: 10 }} />
          <Select {...selectAttr} value={countryOperation} onChange={setCountryOperation}>
            {literalOptions}
          </Select>
          <Select {...selectAttr} placeholder="??????" value={selectCountry} onChange={setSelectCountry}>
            {_.map(countryList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Select {...selectAttr} value={appVersionOperation} onChange={setAppVersionOperation}>
            {numberOptions}
          </Select>
          <Select placeholder="??????" {...selectAttr} value={selectAppVersion} onChange={setSelectAppVersion}>
            {_.map(appVersionList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Select {...{ ...selectAttr1, allowClear: false }} value={newUser} onChange={setNewUser} placeholder="??????">
            <Select.Option key="" value="">
              ??????
            </Select.Option>
            <Select.Option key="Y" value="Y">
              ?????????
            </Select.Option>
            <Select.Option key="N" value="N">
              ?????????
            </Select.Option>
          </Select>
          <Select
            {...{ ...selectAttr, allowClear: false }}
            value={subType}
            onChange={setSubType}
            allowClear
            placeholder="??????"
          >
            {subTypeList.map(v => (
              <Select.Option key={v.sub_type} value={v.sub_type}>
                {v.sub_type}
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" onClick={handleSearch}>
            ??????
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
