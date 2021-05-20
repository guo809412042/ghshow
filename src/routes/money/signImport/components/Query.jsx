import React, { useState, useEffect } from 'react';
import {
  Collapse, Radio, Select, Button,
} from 'antd';
import RadioButton from 'antd/lib/radio/radioButton';
import moment from 'moment';
import { countryListSQL, mediaSourceListSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { whereSql } from './utils';
import styles from '../styles/index.less';
import MyDatePicker from '../../../components/MyDatePicker';
import xFetch from '../../../../utils/xFetch';

export default ({ search = {}, onSearch, product = 2 }) => {
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));
  const [countryOpt, setCountryOpt] = useState(search.countryOpt || '');
  const [countries, setCountries] = useState(search.countries || []);
  const [countryList, setCountryList] = useState([]);
  const [versionOpt, setVersionOpt] = useState(search.versionOpt || '');
  const [versions, setVersions] = useState(search.versions);
  const [versionList, setVersionList] = useState([]);
  const [userType, setUserType] = useState(search.userType);
  const [payWay, setPayWay] = useState(search.payWay || 'Android');
  const [mediaSource, setMediaSource] = useState(search.mediaSource);
  const [mediaSourceList, setMediaSourceList] = useState([]);

  const getCountryList = async () => {
    const where = whereSql({});
    const sql = countryListSQL + (where || '');
    const res = await getData(sql);
    setCountryList(res);
  };

  const getMediaSourceList = async () => {
    const where = whereSql({
      pay_way: payWay,
    });
    const sql = mediaSourceListSQL + (where ? ` where ${where}` : '');
    const res = await getData(sql);
    setMediaSourceList(res.map(v => ({ media_source: v.fvalue })));
  };

  const getVersionList = async () => {
    // const where = whereSql({ platform: search.payWay === 'IOS' ? '2' : '1' });
    // const sql = `${versionListSQL + (` where ${where}` || '')} order by app_version`;
    // const res = await getData(sql);
    // https://reports.quvideo.com/appinfo/1?product=2
    const url = `https://reports.quvideo.com/appinfo/${payWay === 'IOS' ? 2 : 1}?product=${product}`;
    const res = await xFetch(url, {});
    setVersionList(res.map(v => ({ app_version: v.key, version_name: v.value })));
  };

  // 点击搜索按钮
  const searchClick = () => {
    onSearch({
      startDate,
      endDate,
      countries,
      versions,
      userType,
      payWay,
      countryOpt,
      versionOpt,
      mediaSource,
    });
  };

  // 切换时间和payWay时自动搜索
  useEffect(() => {
    onSearch({
      startDate,
      endDate,
      countries,
      versions,
      userType,
      payWay,
      countryOpt,
      versionOpt,
      mediaSource,
    });
  }, [startDate, endDate]);

  useEffect(() => {
    getVersionList();
    setCountryOpt('');
    setCountries([]);
    setVersionOpt('=');
    setVersions([]);
    setUserType('');
    setMediaSource([]);
    setMediaSourceList([]);
    getMediaSourceList();

    onSearch({
      startDate,
      endDate,
      countries: [],
      versions: [],
      userType: '',
      payWay,
      countryOpt: '',
      versionOpt: '=',
      mediaSource: [],
    });
  }, [payWay]);

  useEffect(() => {
    Promise.all([getCountryList(), getVersionList(), getMediaSourceList()]);
  }, []);

  return (
    <div>
      <div>
        <MyDatePicker
          style={{ width: 250, margin: 8 }}
          value={[startDate, endDate]}
          onChange={(values) => {
            setStartDate(values[0]);
            setEndDate(values[1]);
          }}
        />
        <Radio.Group buttonStyle="solid" value={payWay} onChange={e => setPayWay(e.target.value)}>
          <RadioButton key="Android" value="Android">
            国内安卓
          </RadioButton>
          <RadioButton key="IOS" value="IOS">
            iOS
          </RadioButton>
          <RadioButton key="GP" value="GP">
            海外GP
          </RadioButton>
        </Radio.Group>
      </div>
      <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <div>
            <Select className={styles.queryItem} key="" value={countryOpt} onChange={setCountryOpt}>
              <Select.Option key="" value="">
                等于
              </Select.Option>
              <Select.Option key="not" value="not">
                不等于
              </Select.Option>
            </Select>
            <Select
              allowClear
              mode="multiple"
              showSearch
              className={styles.queryItem}
              key=""
              value={countries}
              placeholder="地区"
              onChange={setCountries}
            >
              {countryList.map(v => (
                <Select.Option key={v.country} value={v.country}>
                  {v.country}
                </Select.Option>
              ))}
            </Select>
            <Select className={styles.queryItem} key="" value={versionOpt} onChange={setVersionOpt}>
              <Select.Option key="=" value="=">等于</Select.Option>
              <Select.Option key="!=" value="!=">不等于</Select.Option>
              <Select.Option key=">=" value=">=">大于等于</Select.Option>
              <Select.Option key=">" value=">">大于</Select.Option>
              <Select.Option key="<=" value="<=">小于等于</Select.Option>
              <Select.Option key="<" value="<">小于</Select.Option>
            </Select>
            <Select
              allowClear
              showSearch
              className={styles.queryItem}
              key=""
              value={versions}
              placeholder="版本"
              onChange={setVersions}
            >
              {versionList.map(v => (
                <Select.Option key={v.app_version} value={v.app_version}>
                  {v.version_name}
                </Select.Option>
              ))}
            </Select>
            <Select
              allowClear
              mode="multiple"
              showSearch
              className={styles.queryItem}
              value={mediaSource}
              placeholder="订阅入口"
              onChange={setMediaSource}
            >
              {mediaSourceList.map(v => <Select.Option key={v.media_source} value={v.media_source}>{v.media_source}</Select.Option>)}
            </Select>
          </div>
          <div>
            <Select
              allowClear
              className={styles.queryItem}
              key=""
              value={userType}
              placeholder="新老用户"
              onChange={setUserType}
            >
              {/* <Select.Option key="" value="">全部用户</Select.Option> */}
              <Select.Option key="" value="Y">
                新用户
              </Select.Option>
              <Select.Option key="" value="N">
                老用户
              </Select.Option>
            </Select>
            <Button type="primary" className={styles.queryItem} onClick={searchClick}>
              查询
            </Button>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
