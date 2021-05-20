import React, { useState, useEffect } from 'react';
import { Collapse, DatePicker, Select } from 'antd';
import moment from 'moment';
import { countryListSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { whereSql } from './utils';
import styles from '../styles/index.less';
import { products, CountryList } from './constant';

export default ({ search = {}, onSearch }) => {
  const [startDate, setStartDate] = useState(
    search.startDate
      || moment()
        .subtract(5, 'months')
        .startOf('month'),
  );
  const [endDate, setEndDate] = useState(
    search.endDate
      || moment()
        .subtract(1, 'month')
        .endOf('month'),
  );
  const [countries, setCountries] = useState(search.countries || [CountryList[1].value]);
  const [countryList, setCountryList] = useState([]);
  const [platform, setPlatform] = useState(search.platform || '1');
  const [product, setProduct] = useState(search.product || '');

  const getCountryList = async () => {
    const where = whereSql({});
    const sql = countryListSQL + (where || '');
    const res = await getData(sql);
    const list = CountryList.concat(res.map(v => ({ value: v.country, country: v.country })));
    setCountryList(list);
  };

  // 切换时间和payWay时自动搜索
  useEffect(() => {
    onSearch({
      startDate,
      endDate,
      countries,
      platform,
      product,
    });
  }, [startDate, endDate, platform, product, countries]);

  useEffect(() => {
    Promise.all([getCountryList()]);
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
              {countryList.map(v => (
                <Select.Option key={v.value} value={v.value}>
                  {v.country}
                </Select.Option>
              ))}
            </Select>
            <DatePicker.RangePicker
              mode={['month', 'month']}
              format="YYYY-MM"
              style={{ width: 250, margin: 8 }}
              value={[startDate, endDate]}
              onPanelChange={(values) => {
                setStartDate(moment(values[0]).startOf('month'));
                setEndDate(moment(values[1]).endOf('month'));
              }}
            />
            {/* <Button type="primary" className={styles.queryItem} onClick={searchClick}>查询</Button> */}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
