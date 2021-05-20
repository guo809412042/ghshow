/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, Radio, Button, Spin,
} from 'antd';
import { getHoloData } from '../../../utils/request';
import {
  countrySQL,
  appVersionSQL,
  subscriptionDurationSQL,
  skuTypeSQL,
  skuIdSQL,
  mediaSourceSQL,
  campaignNameSQL,
  categorySQL,
  funtionSQL,
  fvalueSQL,
} from './sqlTemplate';
import { createSqlWhere } from '../../../utils/utils';
import { APP_LIST } from './const';
import MyDatePicker from '../../components/MyDatePicker';

export default ({ search, onSearch, searchFlag }) => {
  // app 类型
  const [productId, setProductId] = useState(search.productId);
  const [spinning, setSpinning] = useState(true);
  const [countryName, setCountryName] = useState(search.countryName);
  const [countryNameList, setCountryNameList] = useState([]);
  const [platform, setPlatform] = useState(search.platform);
  const [selectAppVersion, setSelectAppVersion] = useState(search.selectAppVersion);
  const [appVersionList, setAppVersionList] = useState([]);
  const [newUser, setNewUser] = useState(search.newUser);
  const [subscriptionDuration, setSubscriptionDuration] = useState(search.subscriptionDuration);
  const [subscriptionDurationList, setSubscriptionDurationList] = useState([]);
  const [skuType, setSkuType] = useState(search.skuType);
  const [skuTypeList, setSkuTypeList] = useState([]);
  const [skuId, setSkuId] = useState(search.skuId);
  const [skuIdList, setSkuIdList] = useState([]);
  const [mediaSource, setMediaSource] = useState(search.mediaSource);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [campaign, setCampaign] = useState(search.campaign);
  const [campaignList, setcampaignList] = useState([]);
  const [category, setCategory] = useState(search.category);
  const [categoryList, setCategoryList] = useState([]);
  const [funtion, setFuntion] = useState(search.funtion);
  const [funtionList, setFuntionList] = useState([]);
  const [fvalue, setFvalue] = useState(search.fvalue);
  const [fvalueList, setFvalueList] = useState([]);
  const [evtIntervalDay, setEvtIntervalDay] = useState(search.evtIntervalDay);
  const [dayType, setDayType] = useState(search.dayType);
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [groupBy1, setGroupBy1] = useState(search.groupBy1);
  const [groupBy2, setGroupBy2] = useState(search.groupBy2);
  const [compare, setCompare] = useState(search.compare);

  const getCountryNameList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: countrySQL,
        product: productId ? ` and product_id = '${productId}'` : '',
      }),
    );
    setCountryNameList(res);
  };
  const getAppVersionList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: appVersionSQL,
        product: productId ? ` and product_id = '${productId}'` : '',
        platform,
      }),
    );
    setAppVersionList(res);
  };
  const getSubscriptionDurationList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: subscriptionDurationSQL,
        product: productId ? ` and product_id = '${productId}'` : '',
        platform,
      }),
    );
    setSubscriptionDurationList(res);
  };
  const getSkuTypeList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: skuTypeSQL,
        product: productId ? ` and product_id = '${productId}'` : '',
        platform,
      }),
    );
    setSkuTypeList(res);
  };
  const getSkuIdList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: skuIdSQL,
        product: productId ? ` and product_id = '${productId}'` : '',
        platform,
      }),
    );
    setSkuIdList(res);
  };
  const getMediaSourceList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: mediaSourceSQL,
        product: productId ? ` and product_id = '${productId}'` : '',
        platform,
      }),
    );
    setMediaSourceList(res);
  };
  const getCampaignList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: campaignNameSQL,
        product: productId ? ` and product_id = '${productId}'` : '',
        platform,
      }),
    );
    setcampaignList(res);
  };
  const getCategoryList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: categorySQL,
        product: productId ? ` and product_id = '${productId}'` : '',
        platform,
      }),
    );
    setCategoryList(res);
  };
  const getFunctionList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: funtionSQL,
        product: productId ? ` and product_id = '${productId}'` : '',
        platform,
      }),
    );
    setFuntionList(res);
  };
  const getFvalueList = async () => {
    const res = await getHoloData(
      createSqlWhere({
        sql: fvalueSQL,
        product: productId ? ` and product_id = '${productId}'` : '',
        platform,
      }),
    );
    setFvalueList(res);
  };
  const getSQLData = async () => {
    setSpinning(true);
    await getAppVersionList();
    await getSkuTypeList();
    await getSubscriptionDurationList();
    await getSkuIdList();
    await getMediaSourceList();
    await getCampaignList();
    await getCategoryList();
    await getFunctionList();
    await getFvalueList();
    setSpinning(false);
  };
  useEffect(() => {
    if (searchFlag) {
      getCountryNameList();
    }
  }, [productId, searchFlag]);
  useEffect(() => {
    if (searchFlag) {
      getSQLData();
    }
  }, [platform, productId, searchFlag]);
  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      countryName,
      skuId,
      platform,
      funtion,
      fvalue,
      selectAppVersion,
      subscriptionDuration,
      skuType,
      mediaSource,
      campaign,
      category,
      dayType,
      groupBy1,
      groupBy2,
      productId,
      newUser,
      evtIntervalDay,
      compare,
    });
  };
  return (
    <Spin style={{ marginBottom: 20 }} spinning={spinning}>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={productId}
            onChange={setProductId}
            placeholder="app名称"
          >
            {Object.keys(APP_LIST).map(v => (
              <Select.Option value={v} key={v}>
                {APP_LIST[v]}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="平台"
            value={platform}
            onChange={e => setPlatform(e)}
          >
            <Select.Option key="1" value="1">
              Andorid
            </Select.Option>

            <Select.Option key="2" value="2">
              iOS
            </Select.Option>
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={countryName}
            onChange={setCountryName}
            mode="multiple"
            placeholder="地区"
            showSearch
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
          >
            {countryNameList.map(v => (
              <Select.Option value={v.country_name} key={v.country_name}>
                {v.country_name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="版本"
            mode="multiple"
            showSearch
            style={{ width: 200, marginRight: '8px' }}
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            value={selectAppVersion}
            onChange={setSelectAppVersion}
          >
            {appVersionList.map(item => (
              <Select.Option key={item.app_version} value={item.app_version}>
                {item.app_version}
              </Select.Option>
            ))}
          </Select>
          <Select style={{ width: 100, marginRight: '8px' }} placeholder="平台" value={newUser} onChange={setNewUser}>
            <Select.Option key="=" value="=">
              新用户
            </Select.Option>

            <Select.Option key="<>" value="<>">
              老用户
            </Select.Option>
          </Select>
          <Select
            placeholder="订单类型"
            showSearch
            allowClear
            style={{ width: 200, marginRight: '8px' }}
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            value={skuType}
            onChange={setSkuType}
          >
            {skuTypeList.map(item => (
              <Select.Option key={item.sku_type} value={item.sku_type}>
                {item.sku_type}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="订阅周期"
            showSearch
            allowClear
            style={{ width: 200, marginRight: '8px' }}
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            value={subscriptionDuration}
            onChange={setSubscriptionDuration}
          >
            {subscriptionDurationList.map(item => (
              <Select.Option key={item.subscription_duration} value={item.subscription_duration}>
                {item.subscription_duration}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="商品ID"
            showSearch
            style={{ width: 200, marginRight: '8px' }}
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            value={skuId}
            onChange={setSkuId}
            allowClear
          >
            {skuIdList.map(item => (
              <Select.Option key={item.sku_id} value={item.sku_id}>
                {item.sku_id}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="渠道"
            showSearch
            style={{ width: 200, marginRight: '8px', marginTop: 8 }}
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            value={mediaSource}
            onChange={setMediaSource}
            allowClear
          >
            {mediaSourceList.map(item => (
              <Select.Option key={item.media_source} value={item.media_source}>
                {item.media_source}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="campaign"
            showSearch
            allowClear
            style={{ width: 400, marginRight: '8px', marginBottom: 8 }}
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            value={campaign}
            onChange={setCampaign}
          >
            {campaignList.map(item => (
              <Select.Option key={item.campaign_name} value={item.campaign_name}>
                {item.campaign_name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="分类"
            showSearch
            style={{ width: 200, marginRight: '8px' }}
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            value={category}
            onChange={setCategory}
            allowClear
          >
            {categoryList.map(item => (
              <Select.Option key={item.category} value={item.category}>
                {item.category}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="功能"
            showSearch
            style={{ width: 200, marginRight: '8px' }}
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            value={funtion}
            onChange={setFuntion}
            allowClear
          >
            {funtionList.map(item => (
              <Select.Option key={item.funtion} value={item.funtion}>
                {item.funtion}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="入口"
            showSearch
            style={{ width: 200, marginRight: '8px' }}
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
            value={fvalue}
            onChange={setFvalue}
            allowClear
          >
            {fvalueList.map(item => (
              <Select.Option key={item.fvalue} value={item.fvalue}>
                {item.fvalue}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="统计周期"
            value={evtIntervalDay}
            onChange={setEvtIntervalDay}
            allowClear
          >
            {['0', '1', '2', '3', '4', '5', '6', '7', '14', '30'].map(v => (
              <Select.Option key={v} value={v}>
                {`第${v}天`}
              </Select.Option>
            ))}
            <Select.Option key=" > '30'" value=" > '30'">
              30天后
            </Select.Option>
          </Select>
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="统计周期"
            value={dayType}
            onChange={setDayType}
          >
            <Select.Option key="1" value="1">
              日
            </Select.Option>

            {/* <Select.Option key="7" value="7">
              周
            </Select.Option>
            <Select.Option key="30" value="30">
              月
            </Select.Option> */}
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
            style={{ width: 150, marginRight: '8px' }}
            placeholder="维度1"
            value={groupBy1}
            onChange={setGroupBy1}
            allowClear
          >
            <Select.Option key="fvalue" value="fvalue">
              入口
            </Select.Option>
            <Select.Option key="media_source" value="media_source">
              来源
            </Select.Option>
            <Select.Option key="country_name" value="country_name">
              地区
            </Select.Option>
            <Select.Option key="app_version" value="app_version">
              版本
            </Select.Option>
            <Select.Option key="campaign_name" value="campaign_name">
              campaign_name
            </Select.Option>
          </Select>
          <Select
            style={{ width: 150, marginRight: '8px' }}
            placeholder="维度2"
            value={groupBy2}
            onChange={setGroupBy2}
            allowClear
          >
            <Select.Option key="fvalue" value="fvalue">
              入口
            </Select.Option>
            <Select.Option key="media_source" value="media_source">
              来源
            </Select.Option>
            <Select.Option key="country_name" value="country_name">
              地区
            </Select.Option>
            <Select.Option key="app_version" value="app_version">
              版本
            </Select.Option>
            <Select.Option key="campaign_name" value="campaign_name">
              campaign_name
            </Select.Option>
          </Select>
          <Radio.Group value={compare} onChange={e => setCompare(e.target.value)}>
            <Radio.Button value="1" key="1">
              显示对比
            </Radio.Button>
            <Radio.Button value="2" key="2">
              不显示对比
            </Radio.Button>
          </Radio.Group>
          <Button onClick={handleSearch} type="primary">
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </Spin>
  );
};
