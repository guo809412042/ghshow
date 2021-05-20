import React from 'react';
import {
  Collapse, Radio, Select, Button, DatePicker,
} from 'antd';
import { MEDIA_SOURCE_LIST, } from '../../../../utils/const';

export default ({
  search, setSearch, countryList,
}) => <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
  <Collapse.Panel header="查询" key="1" >
    <Radio.Group
      value={search.platform || ''}
      onChange={e => setSearch({
        ...search,
        platform: e.target.value,
      })}>
      <Radio.Button key="" value="">全部</Radio.Button>
      <Radio.Button key="1" value="1">Android</Radio.Button>
      <Radio.Button key="2" value="2">iOS</Radio.Button>
    </Radio.Group>
    <Select
      allowClear
      style={{ width: 120, margin: '0 8px' }}
      value={search.new_user}
      onChange={e => setSearch({
        ...search,
        new_user: e,
      })}
    >
      <Select.Option key="1" value="1">新用户</Select.Option>
      <Select.Option key="0" value="0">老用户</Select.Option>
    </Select>
    <Select
      allowClear
      style={{ width: 200 }}
      value={search.country}
      onChange={e => setSearch({
        ...search,
        country: e,
      })}
      showSearch
      placeholder="地区"
    >
      {countryList.map(v => <Select.Option key={v.country} value={v.country}>{v.country}</Select.Option>)}
    </Select>
    <DatePicker
      value={search.date}
      style={{ width: 120, margin: '0 8px' }}
      onChange={e => setSearch({
        ...search, date: e,
      })}
    />
    <Select
      allowClear
      style={{ width: 200 }}
      value={search.media_source}
      onChange={e => setSearch({
        ...search,
        media_source: e,
      })}
      showSearch
      placeholder="渠道"
    >
      {Object.keys(MEDIA_SOURCE_LIST).map(v => <Select.Option key={v} value={MEDIA_SOURCE_LIST[v]}>{v}</Select.Option>)}
    </Select>
    <Button type="primary" onClick={() => setSearch(search)}>查询</Button>
  </Collapse.Panel>
</Collapse>;
