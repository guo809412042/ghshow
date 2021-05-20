import React, { useState, useEffect } from 'react';
import {
  DatePicker, Collapse, Select, Button,
} from 'antd';
import { getHoloData } from '../../../../utils/request';
import {
  appProductSQL, channelSQL, payWaySQL, skuTypeSQL, countryCodeSQL,
} from './sqlTemplate';

export default ({ onSearch, search }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [moneyType, setMoneyType] = useState(search.moneyType);
  // app 类型
  const [appProduct, setAppProduct] = useState(search.appProduct);
  const [appProductList, setAppProductList] = useState([]);

  // 结算平台
  const [channel, setChannel] = useState(search.channel);
  const [channelList, setChannelList] = useState([]);

  // 结算方式
  const [payWay, setPayWay] = useState(search.payWay);
  const [payWayList, setPayWayList] = useState([]);

  // 购买类型
  const [skuType, setSkuType] = useState(search.skuType);
  const [skuTypeList, setSkuTypeList] = useState([]);

  // 地区
  const [countryCode, setCountryCode] = useState(search.countryCode);
  const [countryCodeList, setCountryodeList] = useState([]);

  const getAppProduct = async () => {
    const res = await getHoloData(appProductSQL);
    setAppProductList(res);
  };
  const getChannelList = async () => {
    const res = await getHoloData(channelSQL);
    setChannelList(res);
  };
  const getPayWayList = async () => {
    const res = await getHoloData(payWaySQL);
    setPayWayList(res);
  };
  const getSkuTypeList = async () => {
    const res = await getHoloData(skuTypeSQL);
    setSkuTypeList(res);
  };
  const getCountryCodeList = async () => {
    const res = await getHoloData(countryCodeSQL);
    setCountryodeList(res);
  };
  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      countryCode: countryCode || [],
      payWay: payWay || [],
      channel: channel || [],
      appProduct: appProduct || [],
      skuType: skuType || [],
      moneyType,
    });
  };
  useEffect(() => {
    getChannelList();
    getAppProduct();
    getPayWayList();
    getSkuTypeList();
    getCountryCodeList();
  }, []);
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
            value={channel}
            onChange={setChannel}
            mode="multiple"
            placeholder="结算平台"
          >
            {channelList.map(v => (
              <Select.Option value={v.channel} key={v.channel}>
                {v.channel}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={payWay}
            onChange={setPayWay}
            mode="multiple"
            placeholder="结算方式"
          >
            {payWayList.map(v => (
              <Select.Option value={v.pay_way} key={v.pay_way}>
                {v.pay_way}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={skuType}
            onChange={setSkuType}
            mode="multiple"
            placeholder="购买类型"
          >
            {skuTypeList.map(v => (
              <Select.Option value={v.sku_type} key={v.sku_type}>
                {v.sku_type}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={countryCode}
            onChange={setCountryCode}
            mode="multiple"
            placeholder="地区"
          >
            {countryCodeList.map(v => (
              <Select.Option value={v.country_code} key={v.country_code}>
                {v.country_code}
              </Select.Option>
            ))}
          </Select>
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
          <div>
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
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
