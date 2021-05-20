import React, { useState } from 'react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {
  Collapse, Select, DatePicker, Button,
} from 'antd';
import { COUNTRY, DATA_TYPE, TYPES } from '../const';

export default ({ search, onSearch }) => {
  const [country, setCountry] = useState(search.country);
  const [dataType, setDataType] = useState(search.dataType);
  const [type, setType] = useState(search.type);
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <span>地区：</span>
        <Select
          placeholder="地区"
          value={country}
          onChange={setCountry}
          style={{ width: 120, margin: '0 10px' }}
          allowClear
        >
          {Object.keys(COUNTRY).map(v => (
            <Select.Option key={v} value={v}>
              {COUNTRY[v]}
            </Select.Option>
          ))}
        </Select>
        <span>数据类型：</span>
        <Select placeholder="数据类型" value={dataType} onChange={setDataType} style={{ width: 120, margin: '0 10px' }}>
          {Object.keys(DATA_TYPE).map(v => (
            <Select.Option key={v} value={v}>
              {DATA_TYPE[v]}
            </Select.Option>
          ))}
        </Select>
        <span>数据类型：</span>
        <Select placeholder="数据类型" value={type} onChange={setType} style={{ width: 120, margin: '0 10px' }}>
          {Object.keys(TYPES).map(v => (
            <Select.Option key={v} value={v}>
              {TYPES[v]}
            </Select.Option>
          ))}
        </Select>
        <DatePicker.RangePicker
          locale={locale}
          style={{ margin: '8px 8px 8px 0' }}
          value={[startDate, endDate]}
          onPanelChange={(value) => {
            setStartDate(value[0]);
            setEndDate(value[1]);
          }}
          format="YYYY-MM"
          mode={['month', 'month']}
        />
        <Button
          type="primary"
          onClick={() => onSearch({
            startDate,
            endDate,
            country,
            dataType,
            type,
          })
          }
        >
          查询
        </Button>
      </Collapse.Panel>
    </Collapse>
  );
};
