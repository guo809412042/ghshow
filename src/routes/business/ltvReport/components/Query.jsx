import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, Tooltip, Button,
} from 'antd';
import moment from 'moment';
import MyDatePicker from '../../../components/MyDatePicker';
import style from '../styles/index.less';
import { getData } from '../../../../utils/request';
import { COUNTRY_NAME_COMMON_LIST } from '../const';
import { CountryListSQL } from './sqlTemplate';

export default ({ search = {}, onSearch }) => {
  const [payway, setPayway] = useState(search.payway || 'GP');
  const [countries, setCountries] = useState(search.countries || []);
  const [countryList, setCountryList] = useState([]);
  const [channel, setChannel] = useState(search.channel || []);
  const [userType, setUserType] = useState(search.userType || []);
  const [sku, setSku] = useState(search.sku || []);
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));

  // 获取国家列表
  const getCountryList = async () => {
    const countryList = await getData(CountryListSQL);
    const list = COUNTRY_NAME_COMMON_LIST.concat(
      countryList.map(v => ({ country_code: [v.country_name], country_name: v.country_name })),
    );
    setCountryList(list);
  };

  const searchClick = () => {
    onSearch({
      payway,
      countries,
      channel,
      sku,
      startDate,
      endDate,
      userType,
    });
  };

  useEffect(() => {
    onSearch({
      payway,
      countries,
      channel,
      sku,
      startDate,
      endDate,
      userType,
    });
  }, [payway, countries, channel, sku, startDate, endDate, userType]);

  useEffect(() => {
    getCountryList();
  }, []);

  return (<div style={{ marginBottom: 20 }}>
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <div>
          <Select placeholder="平台" value={payway} onChange={setPayway} className={style.queryItem} key="payway">
            <Select.Option key="GP" value="GP">
              GP
            </Select.Option>
            <Select.Option key="IOS" value="IOS">
              iOS
            </Select.Option>
          </Select>
          <Select placeholder="渠道" allowClear mode="multiple" value={channel} onChange={setChannel} className={style.queryItem} key="channel">
            <Select.Option key="投放" value="投放">
              投放
            </Select.Option>
            <Select.Option key="自然" value="自然">
              自然
            </Select.Option>
          </Select>
          <Select
            placeholder="地区"
            allowClear
            mode="multiple"
            value={countries}
            onChange={setCountries}
            className={style.queryItem}
            key="countries"
          >
            {countryList.map(v => (
              <Select.Option key={v.country_name} value={v.country_code}>
                <Tooltip title={v.country_name}>{v.country_name}</Tooltip>
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="用户"
            allowClear
            mode="multiple"
            value={userType}
            onChange={setUserType}
            className={style.queryItem}
            key="userType"
          >
            <Select.Option key="new" value="新用户">
              新用户
            </Select.Option>
            <Select.Option key="old" value="老用户">
              老用户
            </Select.Option>
          </Select>

          <Select
            placeholder="商品"
            allowClear
            mode="multiple"
            value={sku}
            onChange={setSku}
            className={style.queryItem}
            key="sku"
          >
            <Select.Option key="year" value="年">
              年
            </Select.Option>
            <Select.Option key="month" value="月">
              月
            </Select.Option>
            <Select.Option key="forever" value="永久">
              永久
            </Select.Option>
          </Select>
          <MyDatePicker
            style={{ width: 250, margin: 8 }}
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
            }}
          />
          <Button type="primary" onClick={searchClick}>
            查询
          </Button>
        </div>
      </Collapse.Panel>
    </Collapse>
  </div>
  );
};
