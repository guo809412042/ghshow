/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: ssssslf
 * @LastEditTime: 2020-07-02 09:53:56
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, Button, Tooltip,
} from 'antd';
import { getData } from '../../../../utils/request';
import { countryNameSQL, appProductSQL } from './sqlTemplate';

import { COUNTRY_CODE_COMMON_LIST } from '../../../common/countrySelect';
import MyDatePicker from '../../../components/MyDatePicker';

export default ({ search, onSearch, sourceType }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);

  // app 类型
  const [appProduct, setAppProduct] = useState(search.appProduct);
  const [appProductList, setAppProductList] = useState([]);
  // 地区
  const [countryName, setCountryName] = useState(search.countryName);
  const [countryCode, setCountryCode] = useState(search.countryCode);
  const [conutryOperator, setConutryOperator] = useState(search.conutryOperator);
  const [countryNameList, setCountryodeList] = useState([]);
  const [channel, setChannel] = useState();

  const getCountryNameList = async () => {
    const res = await getData(countryNameSQL);
    setCountryodeList(res);
  };

  const getProductList = async () => {
    const res = await getData(appProductSQL);
    setAppProductList(res);
  };

  useEffect(() => {
    getCountryNameList();
    getProductList();
  }, []);

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      appProduct,
      countryName,
      countryCode,
      conutryOperator,
      sourceType,
      channel,
    });
  };
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={appProduct}
            onChange={setAppProduct}
            mode="multiple"
            placeholder="app类型"
          >
            {appProductList.map(v => (
              <Select.Option value={v.app_product} key={v.app_product}>
                {v.app_product}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={conutryOperator}
            onChange={setConutryOperator}
            placeholder="地区筛选"
          >
            <Select.Option key="in" value="in">
              包含
            </Select.Option>
            <Select.Option key="not in" value="not in ">
              不包含
            </Select.Option>
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={countryName}
            onChange={(value, values) => {
              setCountryName(values.map(v => v.key));
              setCountryCode(value);
            }}
            mode="multiple"
            placeholder="地区"
            filterOption={(inputValue, option) => option.props.children.toString().includes(inputValue)}
          >
            {COUNTRY_CODE_COMMON_LIST.map(v => (
              <Select.Option key={v.country_code} value={v.country_code}>
                <Tooltip title={v.country_name}>{v.country_name}</Tooltip>
              </Select.Option>
            ))}
            {countryNameList.map(v => (
              <Select.Option value={v.country_code} key={v.country_code}>
                {v.country_name}
              </Select.Option>
            ))}
          </Select>
          {sourceType === '2' && <Select
            style={{ width: 200, marginRight: '8px' }}
            value={channel}
            onChange={setChannel}
            placeholder="渠道"
            allowClear
          >
            <Select.Option key="1" value="1">
              自然渠道
            </Select.Option>
            <Select.Option key="2" value="2">
              投放渠道
            </Select.Option>
          </Select>}
          <MyDatePicker
            style={{ margin: '8px 8px 8px 0' }}
            value={[startDate, endDate]}
            onChange={(value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }}
          />
          <Button onClick={handleSearch} type="primary">
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
