import React, { useState, useEffect } from 'react';
import {
  DatePicker, Collapse, Button, Select, Radio,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import {
  selectAttr, getAppVersion, selectAttr1,
} from '../../../../../utils/utils';
import { numberOptions } from '../../../../common/constants';
import { getData } from '../../../../../utils/request';
import { fromSourceSQL } from './sqlTemplate';

export default ({
  onSearch,
  product,
  noAndroid,
  noIos,
  defaultPlatform = '1',
  defaultNewUser = '',
  defaultSource = 'all',
  defaultType = 'UV',
}) => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [appVersionOperation, setAppVersionOperation] = useState('=');
  const [selectAppVersion, setSelectAppVersion] = useState(undefined);
  const [platform, setPlatform] = useState(defaultPlatform);
  const [newUser, setNewUser] = useState(defaultNewUser);
  const [appVersionList, setAppVersionList] = useState([]);
  const [type, setType] = useState(defaultType);
  const [fromSource, setFromSource] = useState(defaultSource);
  const [sourceList, setSourceList] = useState([]);

  const getCountryAndAppVersion = async () => {
    const appVersionList = await getAppVersion(platform, product);
    setAppVersionList(appVersionList);
  };
  const getSourceList = async () => {
    const res = await getData(fromSourceSQL);
    setSourceList(res);
  };

  useEffect(() => {
    getCountryAndAppVersion();
    getSourceList();
  }, [platform]);

  const handleSearch = () => {
    let where = '';
    if (selectAppVersion) {
      where += ` and app_version ${appVersionOperation} '${selectAppVersion}' `;
    }
    if (newUser) {
      where += ` and new_user =  '${newUser}' `;
    }
    if (fromSource) {
      where += ` and from_source =  '${fromSource}' `;
    }
    onSearch({
      where,
      startDate,
      endDate,
      platform,
      type,
      fromSource,
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
          <Radio.Group style={{ marginRight: '8px' }} defaultValue="PV" value={type} onChange={({ target: { value } }) => setType(value)} >
            <Radio.Button value="PV">PV</Radio.Button>
            <Radio.Button value="UV">UV</Radio.Button>
          </Radio.Group>
          <DatePicker.RangePicker
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
              handleSearch();
            }}
          />
          <div style={{ marginTop: 10 }} />
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
              全部
            </Select.Option>
            <Select.Option key="1" value="1">
              新用户
            </Select.Option>
            <Select.Option key="2" value="2">
              老用户
            </Select.Option>
          </Select>
          <Select
            {...{ ...selectAttr, allowClear: false }}
            value={fromSource}
            onChange={setFromSource}
            allowClear
            placeholder="来源"
          >
            {sourceList.map(v => (
              <Select.Option key={v.from_source} value={v.from_source}>
                {v.from_source}
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
