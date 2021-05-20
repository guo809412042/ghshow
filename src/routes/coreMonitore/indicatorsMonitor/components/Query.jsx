import React, { useState, useEffect } from 'react';
import {
  Collapse, Button, DatePicker, Select, Radio,
} from 'antd';
import moment from 'moment';
import { getData } from '../../../../utils/request';
import { countryNameSQL } from './sqlTemplate';
import { getCountryAndAppVersionAndChannel } from '../../../../utils/utils';

export default ({ search, onSearch, platform }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);

  const [country, setCountry] = useState(search.country);
  const [countryNameList, setCountryNameList] = useState([]);
  const [selectAppVersion, setSelectAppVersion] = useState(search.appVersion);
  const [appVersionList, setAppVersionList] = useState([]);
  const [compareEndDate, setCompareEndDate] = useState(moment(search.startDate).subtract(1, 'days'));
  const [type, setType] = useState('country');

  const getCountryNameList = async () => {
    const res = await getData(countryNameSQL);
    setCountryNameList(res);
  };
  const getAppVersionList = async () => {
    const res = await getCountryAndAppVersionAndChannel(platform, 2);
    setAppVersionList(res.appVersionList);
  };
  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      country,
      compareEndDate,
      appVersion: selectAppVersion,
      type,
    });
  };
  useEffect(() => {
    getCountryNameList();
  }, []);
  useEffect(() => {
    getAppVersionList();
  }, [platform]);
  useEffect(() => {
    setCompareEndDate(moment(startDate).subtract(1, 'days'));
  }, [startDate]);
  useEffect(() => {
    if (type === 'app_version') {
      setCountry([]);
    } else {
      setCountry([
        '中国',
        '美国',
        '日本',
        '韩国',
        '台湾',
        '泰国',
        '印度',
        '印度尼西亚',
        '巴西',
        '伊朗',
        '俄罗斯',
        '菲律宾',
        '巴基斯坦',
        '中东',
      ]);
    }
  }, [type]);
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Radio.Group
            value={type}
            onChange={e => setType(e.target.value)}
            style={{
              marginRight: 8,
            }}
          >
            <Radio.Button value="country" key="country">
              地区
            </Radio.Button>
            <Radio.Button value="app_version" key="app_version">
              版本
            </Radio.Button>
          </Radio.Group>
          <Select
            style={{ width: 400, marginRight: '8px' }}
            value={country}
            onChange={setCountry}
            mode="multiple"
            placeholder="地区"
            showSearch
          >
            <Select.Option key="中东" value="中东">
              中东
            </Select.Option>
            {countryNameList.map(v => (
              <Select.Option value={v.country} key={v.country}>
                {v.country}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="版本"
            style={{ width: 200, marginRight: '8px' }}
            value={selectAppVersion}
            onChange={setSelectAppVersion}
            showSearch
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            mode="multiple"
          >
            {appVersionList.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <div />
          <DatePicker.RangePicker
            style={{ margin: '8px 8px 8px 0' }}
            value={[startDate, endDate]}
            onChange={(value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }}
          />
          <span>对比时间：</span>
          <DatePicker
            disabled
            format="YYYY-MM-DD"
            style={{ width: 130 }}
            value={moment(compareEndDate).subtract(endDate.diff(startDate, 'days'), 'days')}
          />
          ～
          <DatePicker format="YYYY-MM-DD" style={{ width: 130 }} value={compareEndDate} onChange={setCompareEndDate} />
          <Button onClick={handleSearch} type="primary" style={{ marginLeft: 8 }}>
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
