import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, Button, Tooltip,
} from 'antd';
import { getData } from '../../../../utils/request';
import {
  countryNameSQL, appProductSQL, payWaySQL, skuTypeSQL,
} from './sqlTemplate';
import { COUNTRY_NAME_COMMON_LIST } from '../../../common/countrySelect';
import MyDatePicker from '../../../components/MyDatePicker';

export default ({ search, onSearch }) => {
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
  const [payWay, setPayWay] = useState(search.payWay);
  const [payWayList, setPayWayList] = useState([]);
  const [skuId, setSkuId] = useState(search.skuId);
  const [skuTdList, setSkuIdList] = useState([]);
  const [isNew, setIsNew] = useState(search.isNew || '0');

  const getCountryNameList = async () => {
    const res = await getData(countryNameSQL);
    setCountryodeList(res);
  };
  const getSkuList = async () => {
    const res = await getData(skuTypeSQL);
    setSkuIdList(res);
  };
  const getAppProductList = async () => {
    const res = await getData(appProductSQL);
    setAppProductList(res);
  };
  const getPayWayList = async () => {
    const res = await getData(payWaySQL);
    setPayWayList(res);
  };
  useEffect(() => {
    getCountryNameList();
    getAppProductList();
    getPayWayList();
    getSkuList();
  }, []);

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      appProduct,
      countryName,
      countryCode,
      payWay,
      skuId,
      conutryOperator,
      isNew,
    });
  };
  return (
    <div style={{ marginBottom: 20 }}>
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
            filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {COUNTRY_NAME_COMMON_LIST.map(v => (
              <Select.Option key={v.country_code} value={v.country_code}>
                <Tooltip title={v.country_name}>{v.country_name}</Tooltip>
              </Select.Option>
            ))}
            {countryNameList.map(v => (
              <Select.Option value={v.country_code} key={v.country_name}>
                {v.country_name}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={payWay}
            onChange={setPayWay}
            mode="multiple"
            placeholder="pay_way"
          >
            {payWayList.map(v => (
              <Select.Option value={v.pay_way} key={v.pay_way}>
                {v.pay_way}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 400, marginRight: '8px' }}
            value={skuId}
            onChange={setSkuId}
            mode="multiple"
            placeholder="商品id"
          >
            {skuTdList.map(v => (
              <Select.Option value={v.sku} key={v.sku}>
                {v.sku}
              </Select.Option>
            ))}
          </Select>
          <MyDatePicker
            style={{ margin: '8px 8px 8px 0' }}
            value={[startDate, endDate]}
            onChange={(value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }}
          />
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={isNew}
            onChange={setIsNew}>
            <Select.Option key="0" value="0">全部</Select.Option>
            <Select.Option key="1" value="1">首购</Select.Option>
          </Select>
          <Button onClick={handleSearch} type="primary">
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
