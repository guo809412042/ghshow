import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import moment from 'moment';
import { countryListSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import styles from '../styles/index.less';
import MyDatePicker from '../../../components/MyDatePicker';
import { COUNTRY_NAME_COMMON_LIST } from '../../trialConvertion/const';
import { productMapping } from '../const';

export default ({ search = {}, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(31, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));
  const [countryOpt, setCountryOpt] = useState(search.countryOpt || 'in');
  const [countries, setCountries] = useState(search.countries || []);
  const [countryList, setCountryList] = useState([]);
  const [platform, setPlatform] = useState(search.platform || '');
  const [product, setProduct] = useState(search.product || '');

  const getCountryList = async () => {
    const sql = countryListSQL;
    const res = await getData(sql);
    const list = COUNTRY_NAME_COMMON_LIST.concat(res.filter(item => item.country_name !== '中国').map(v => ({ country_code: [v.country_name], country_name: v.country_name })));
    setCountryList(list);
  };

  const searchClick = () => {
    onSearch({
      startDate,
      endDate,
      countryOpt,
      countries,
      platform,
      product,
    });
  };

  useEffect(() => {
    getCountryList();
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
              {productMapping
                && Object.keys(productMapping).map(v => (
                  <Select.Option key={v} value={v}>
                    {productMapping[v]}
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
              <Select.Option key="CN" value="中国">
                中国
              </Select.Option>
              {countryList.map(v => (
                <Select.Option key={v.country_name} value={v.country_code}>
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
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
