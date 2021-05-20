import React, { useState, useEffect } from 'react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {
  Collapse, Select, DatePicker, Button,
} from 'antd';
import {
  DATA_TYPE, TYPES, APP_PRODUCT_LIST, COUNTRY_LISTS,
} from '../const';
import { countryNameSQL } from '../../../business/newUserPay/components/sqlTemplate';
import { getData } from '../../../../utils/request';


export default ({ search, onSearch }) => {
  const [country, setCountry] = useState(search.country);
  const [dataType, setDataType] = useState(search.dataType);
  const [type, setType] = useState(search.type);
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [product, setProduct] = useState(search.product);
  const [countryList, setCountryList] = useState([]);

  const getCountryList = async () => {
    const where = ` where country_code_2 not in (${Object.keys(COUNTRY_LISTS[product]).map(v => `'${v}'`)})`;
    const res = await getData(countryNameSQL + where);
    setCountryList(res.map(v => ({ country_code: v.country_code, country_name: v.country_name })));
  };

  useEffect(() => {
    getCountryList();
  }, [product]);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <span>产品：</span>
        <Select placeholder="产品" value={product} onChange={setProduct} style={{ width: 120, margin: '0 10px' }}>
          {Object.keys(APP_PRODUCT_LIST).map(v => (
            <Select.Option key={v} value={v}>
              {APP_PRODUCT_LIST[v]}
            </Select.Option>
          ))}
        </Select>
        <span>地区：</span>
        <Select
          placeholder="地区"
          value={country}
          allowClear
          showSearch
          optionFilterProp="children"
          onChange={setCountry}
          style={{ width: 120, margin: '0 10px' }}
        >
          {/* {console.log((Object.keys(COUNTRY_LISTS[product]).map(v => ({ country_code: v, country_name: COUNTRY_LISTS[product][v] }))).concat(countryList))} */}
          {/* {console.log(Object.assign({}, COUNTRY_LISTS[product], ...countryList))} */}
          {(Object.keys(COUNTRY_LISTS[product]).map(v => ({ country_code: v, country_name: COUNTRY_LISTS[product][v] }))).concat(countryList).map(v => (
            <Select.Option key={v.country_code} value={v.country_code}>
              {v.country_name}
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
            product,
          })
          }
        >
          查询
        </Button>
      </Collapse.Panel>
    </Collapse>
  );
};
