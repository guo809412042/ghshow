/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-04-29 14:03:17
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState } from 'react';
import moment from 'moment';
import { Select } from 'antd';
import Query from './components/Query';
import GPIOSView from './components/GPIOSView';
import ANDView from './components/ANDView';
import SelfGPIOSView from './components/SelfGPIOSView';
import SelfANDView from './components/SelfANDView';
import SelfChart from './components/SelfChart';
import Chart from './components/Chart';

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    appProduct: [],
    countryName: [],
    countryCode: [],
    conutryOperator: 'in',
  });

  const [sourceType, setSourceType] = useState('1');

  const onSearch = (values) => {
    setSearch(values);
  };
  return (
    <div>
      <div style={{ overflow: 'hidden' }}>
        <Select
          value={sourceType}
          onChange={setSourceType}
          style={{
            float: 'right',
            marginBottom: 5,
            marginRight: 5,
          }}
        >
          <Select.Option key="1" value="1">
            官方数据
          </Select.Option>
          <Select.Option key="2" value="2">
            自有数据
          </Select.Option>
        </Select>
      </div>
      <Query onSearch={onSearch} search={search} sourceType={sourceType} />
      {sourceType === '1' && <Chart search={search} />}
      {sourceType === '1' && <GPIOSView search={search} />}
      {sourceType === '1' && <ANDView search={search} />}
      {sourceType === '2' && <SelfChart search={search} />}
      {sourceType === '2' && <SelfGPIOSView search={search} />}
      {sourceType === '2' && <SelfANDView search={search} />}
    </div>
  );
};
