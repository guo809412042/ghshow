import React, { useState } from 'react';
import { Radio } from 'antd';
import moment from 'moment';
import Query from '../components/Query';
import TabView from '../components/TabView';
import TableView from '../components/TableView';
import MyDatePicker from '../../../components/MyDatePicker';

export default ({ product }) => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [platform, setPlatform] = useState('Android');
  const [search, setSearch] = useState({ userType: 'Y' });
  const onSearch = (values) => {
    setSearch(values);
  };
  return <div>
    <MyDatePicker
      value={[startDate, endDate]}
      onChange={(value) => {
        setStartDate(value[0]);
        setEndDate(value[1]);
      }}
      style={{ marginBottom: 10 }}
    />
    <Radio.Group
      style={{ marginLeft: 10 }}
      buttonStyle="solid"
      defaultValue={platform}
      onChange={e => setPlatform(e.target.value)}
    >
      <Radio.Button key="Android" value="Android">
      国内安卓
      </Radio.Button>
      <Radio.Button key="IOS" value="IOS">
      iOS
      </Radio.Button>
      <Radio.Button key="GP" value="GP">
      海外GP
      </Radio.Button>
    </Radio.Group>
    <Query
      product={product}
      onSearch={onSearch}
      platform={platform}
    />
    <TabView
      platform={platform}
      startDate={startDate}
      endDate={endDate}
      search={search}
    />
    <TableView
      platform={platform}
      startDate={startDate}
      endDate={endDate}
      search={search}
    />
  </div>;
};
