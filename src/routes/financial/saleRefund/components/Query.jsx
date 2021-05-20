import React, { useState, useEffect } from 'react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {
  DatePicker, Collapse, Select, Button, Tooltip,
} from 'antd';
import { getData } from '../../../../utils/request';
import {
  appProductSQL, channelSQL, skuTypeSQL, countryCodeSQL, subTypeSQL,
} from './sqlTemplate';
import { COUNTRY_CODE_COMMON_LIST } from '../../../common/countrySelect';

export default ({ onSearch, search, kpCountryType }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [moneyType, setMoneyType] = useState(search.moneyType);
  // app 类型
  const [appProduct, setAppProduct] = useState(search.appProduct);
  const [appProductList, setAppProductList] = useState([]);

  // 结算平台
  const [channel, setChannel] = useState(search.channel);
  const [channelList, setChannelList] = useState([]);

  // 购买类型
  const [skuType, setSkuType] = useState(search.skuType);
  const [skuTypeList, setSkuTypeList] = useState([]);

  // 地区
  const [countryCode, setCountryCode] = useState(search.countryCode);
  const [kpCountryTypeValue, setKpCountryType] = useState(search.kpCountryTypeValue);
  const [countryCodeList, setCountryodeList] = useState([]);
  const [conutryOperator, setConutryOperator] = useState(search.conutryOperator);

  // 商品类型
  const [subType, setSubType] = useState([]);
  const [subTypeList, setSubTypeList] = useState([]);

  const getAppProduct = async () => {
    const res = await getData(appProductSQL);
    setAppProductList(res);
  };
  const getChannelList = async () => {
    const res = await getData(channelSQL);
    setChannelList(res);
  };
  const getSkuTypeList = async () => {
    const res = await getData(skuTypeSQL);
    setSkuTypeList(res);
  };
  const getCountryCodeList = async () => {
    const res = await getData(countryCodeSQL);
    setCountryodeList(res);
  };
  const getSubTypeList = async () => {
    const res = await getData(subTypeSQL);
    setSubTypeList(res);
  };
  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      countryCode: countryCode || [],
      channel: channel || [],
      appProduct: appProduct || [],
      skuType: skuType || [],
      moneyType,
      conutryOperator,
      subType,
      kpCountryTypeValue: kpCountryTypeValue || [],
    });
  };
  useEffect(() => {
    getChannelList();
    getSubTypeList();
    getAppProduct();
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
            style={{ width: 200, marginRight: '8px', marginBottom: 8 }}
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
          <Select placeholder="订阅包类型" mode="multiple" value={subType} onChange={setSubType} style={{ width: '120px', marginRight: '8px' }}>
            {
              subTypeList.map(x => <Select.Option value={x.subscription_type}>{x.subscription_type}</Select.Option>)
            }
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
          <div />
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
          >
            {COUNTRY_CODE_COMMON_LIST.map(v => (
              <Select.Option key={v.country_code} value={v.country_code}>
                <Tooltip title={v.country_name}>{v.country_name}</Tooltip>
              </Select.Option>
            ))}
            {countryCodeList.map(v => (
              <Select.Option value={v.country_code} key={v.country_code}>
                {v.country_code}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={kpCountryTypeValue}
            onChange={setKpCountryType}
            mode="multiple"
            placeholder="地区类型"
          >
            {kpCountryType.map(v => (
              <Select.Option value={v.kp_country_type} key={v.kp_country_type}>
                {v.kp_country_type}
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
          <Button onClick={handleSearch} type="primary">
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
