/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: ssssslf
 * @LastEditTime: 2020-07-02 09:54:44
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  DatePicker, Collapse, Select, Button, Tooltip,
} from 'antd';
import { countryCodeSQL, appProductListSQL } from './sqlTemplate';
import { getData, getHoloData } from '../../../../utils/request';
import { COUNTRY_CODE_COMMON_LIST } from '../../../common/countrySelect';

export default ({ search, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [moneyType, setMoneyType] = useState(search.moneyType);
  // 地区
  const [countryCode, setCountryCode] = useState(search.countryCode || []);
  const [countryCodeList, setCountryodeList] = useState([]);
  // app 类型
  const [appProduct, setAppProduct] = useState(search.appProduct || []);
  const [appProductList, setAppProductList] = useState([]);
  // 查询包含不包含
  const [conutryOperator, setConutryOperator] = useState(search.conutryOperator);

  const handleSearch = async () => {
    onSearch({
      startDate,
      endDate,
      moneyType,
      appProduct,
      countryCode,
      conutryOperator,
    });
  };
  const getCountryCodeList = async () => {
    const res = await getData(countryCodeSQL);
    setCountryodeList(res);
  };

  const getAppProductList = async () => {
    const res = await getHoloData(appProductListSQL);
    setAppProductList(res || []);
  };

  useEffect(() => {
    getCountryCodeList();
    getAppProductList();
  }, []);
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select
            style={{ width: 80, marginRight: '8px' }}
            value={moneyType}
            onChange={setMoneyType}
            placeholder="类型"
          >
            <Select.Option key="dollar" value="dollar">
              美元
            </Select.Option>
            <Select.Option key="rmb" value="rmb">
              人民币
            </Select.Option>
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
            value={countryCode}
            onChange={setCountryCode}
            mode="multiple"
            placeholder="地区"
            filterOption={(input, option) => option.props.children.toString().indexOf(input) >= 0}
          >
            {COUNTRY_CODE_COMMON_LIST.map(v => (
              <Select.Option key={v.country_code} value={v.country_code}>
                <Tooltip title={v.country_name}>{v.country_name}</Tooltip>
              </Select.Option>
            ))}
            {countryCodeList.map(v => (
              <Select.Option value={v.country_code} key={v.country_code}>
                {v.country_name}
              </Select.Option>
            ))}
          </Select>
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
          <DatePicker.RangePicker
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
