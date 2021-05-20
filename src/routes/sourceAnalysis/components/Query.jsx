import React, { useState, useEffect } from 'react';
import { Collapse, Select } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { getCountryAndAppVersionAndChannel, selectAttr } from '../../../utils/utils';
import MyDatePicker from '../../components/MyDatePicker';

const Query = ({
  product, onSearch, noIos = false, noAndroid = false,
}) => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [platform, setPlatform] = useState(noAndroid ? '2' : '1');
  const [countryList, setCountryList] = useState([]);
  const [country, setSelectCountry] = useState([]);
  const getCountryList = async () => {
    const { countryList } = await getCountryAndAppVersionAndChannel(platform, product);
    setCountryList(countryList);
  };
  useEffect(() => {
    getCountryList();
  }, [product]);

  useEffect(() => {
    onSearch({
      startDate,
      endDate,
      platform,
      country,
    });
  }, [startDate, endDate, platform, country]);
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel key="1" header="查询">
          <Select
            style={{ width: 300, marginRight: 8 }}
            placeholder="地区"
            value={country}
            onChange={e => setSelectCountry(e)}
            mode="multiple"
          >
            {_.map(countryList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Select {...selectAttr} allowClear={false} placeholder="平台" value={platform} onChange={e => setPlatform(e)}>
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
          <MyDatePicker
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
            }}
            style={{ float: 'right' }}
          />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default Query;
