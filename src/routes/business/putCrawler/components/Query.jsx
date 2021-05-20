import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import moment from 'moment';
import { countryListSQL, mediaSourceListSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { whereSql } from './utils';
import styles from '../styles/index.less';
import { products } from './constant';
import MyDatePicker from '../../../components/MyDatePicker';

export default ({ search = {}, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(2, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));
  const [countryOpt, setCountryOpt] = useState(search.countryOpt || 'in');
  const [countries, setCountries] = useState(search.countries || '美国');
  const [countryList, setCountryList] = useState([]);
  const [platform, setPlatform] = useState(search.platform || '2');
  const [product, setProduct] = useState(search.product || '16');
  const [mediaSources, setMediaSources] = useState(search.mediaSources || ['FBad']);
  const [mediaSourceList, setMediaSourceList] = useState([]);

  const getCountryList = async () => {
    const where = whereSql({});
    const sql = countryListSQL + (where || '');
    const res = await getData(sql);
    const list = res.map(v => ({ value: v.country, country: v.country }));
    setCountryList(list);
  };

  const getMediaSourceList = async () => {
    const where = whereSql({});
    const sql = mediaSourceListSQL + (where || '');
    const res = await getData(sql);
    const list = res.map(v => ({ value: v.media_source, key: v.media_source }));
    setMediaSourceList(list);
  };

  const searchClick = () => {
    onSearch({
      startDate,
      endDate,
      countryOpt,
      countries,
      platform,
      product,
      mediaSources,
    });
  };

  useEffect(() => {
    Promise.all([getCountryList(), getMediaSourceList()]);
  }, []);

  return (
    <div>
      <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <div>
            <Select className={styles.queryItem} key="产品" placeholder="产品" value={product} onChange={setProduct}>
              <Select.Option key="" value="">
                所有产品
              </Select.Option>
              {products
                && Object.keys(products).map(v => (
                  <Select.Option key={v} value={v}>
                    {products[v]}
                  </Select.Option>
                ))}
            </Select>
            <Select className={styles.queryItem} key="平台" value={platform} onChange={setPlatform}>
              <Select.Option key="" value="">
                全部平台
              </Select.Option>
              <Select.Option key="Android" value="1">
                Android
              </Select.Option>
              <Select.Option key="iOS" value="2">
                iOS
              </Select.Option>
            </Select>
            <Select className={styles.queryItem} key="包含" value={countryOpt} onChange={setCountryOpt}>
              <Select.Option key="in" value="in">
                包含
              </Select.Option>
              <Select.Option key="not in" value="not in">
                不包含
              </Select.Option>
            </Select>
            <Select
              allowClear
              mode="multiple"
              showSearch
              className={styles.queryItem}
              key="地区"
              value={countries}
              placeholder="地区"
              onChange={setCountries}
            >
              <Select.Option key="全部地区" value=" ">
                全部地区
              </Select.Option>
              {countryList.map(v => (
                <Select.Option key={v.value} value={v.value}>
                  {v.country}
                </Select.Option>
              ))}
            </Select>
            <Select
              allowClear
              mode="multiple"
              showSearch
              className={styles.queryItem}
              key="来源"
              value={mediaSources}
              placeholder="来源"
              onChange={setMediaSources}
            >
              <Select.Option key="全部来源" value=" ">
                全部来源
              </Select.Option>
              {mediaSourceList.map(v => (
                <Select.Option key={v.value} value={v.value}>
                  {v.value}
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
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
