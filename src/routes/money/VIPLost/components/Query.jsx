import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, Button, Tooltip, Icon,
} from 'antd';
import moment from 'moment';
import { countryListSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { whereSql } from '../../signImport/components/utils';
import styles from '../styles/index.less';
import { CountryList } from './constant';
import MyDatePicker from '../../../components/MyDatePicker';

export default ({ search = {}, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));
  const [platform, setPlatform] = useState(search.platform || '');
  const [countries, setCountries] = useState(search.countries || ['']);
  const [countryList, setCountryList] = useState([]);

  const getCountryList = async () => {
    const where = whereSql({});
    const sql = countryListSQL + (where || '');
    const res = await getData(sql);
    const list = CountryList.concat(res.map(v => ({ value: v.country_name, country_name: v.country_name })));
    setCountryList(list);
  };

  // 点击搜索按钮
  const searchClick = () => {
    onSearch({
      startDate,
      endDate,
      countries,
      platform,
    });
  };

  // 切换条件时自动搜索
  useEffect(() => {
    onSearch({
      startDate,
      endDate,
      countries,
      platform,
    });
  }, [startDate, endDate, countries, platform]);

  useEffect(() => {
    onSearch({
      startDate,
      endDate,
      countries: [],
      platform,
    });
  }, []);

  useEffect(() => {
    Promise.all([getCountryList()]);
  }, []);

  return (
    <div>
      <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <div>
            <Select className={styles.queryItem} placeholder="平台" value={platform} key="" onChange={setPlatform}>
              <Select.Option key="" value="">
                全部平台
              </Select.Option>
              <Select.Option key="GP" value="GP">
                GP
              </Select.Option>
              <Select.Option key="IOS" value="IOS">
                iOS
              </Select.Option>
            </Select>
            <Select
              allowClear
              showSearch
              className={styles.queryItem}
              mode="multiple"
              key=""
              value={countries}
              placeholder="地区"
              onChange={setCountries}
            >
              {countryList.map(v => (
                <Select.Option key={v.country_name} value={v.value}>
                  {v.country_name}
                </Select.Option>
              ))}
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
            <Tooltip title="数据以2020年05月21日以后的为准">
              <Icon type="question-circle" style={{ fontSize: 18, marginLeft: 10 }} />
            </Tooltip>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
