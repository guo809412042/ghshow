import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import moment from 'moment';
import { countryListSQL, campaignListSQL, productListSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { whereSql } from './utils';
import styles from '../styles/index.less';
import { products, mediaSourceList } from './constant';
import MyDatePicker from '../../../components/MyDatePicker';
import { filterEmptyObj } from '../../../../utils/utils';

export default ({ search = {}, onSearch }) => {
  // 产品
  const [product, setProduct] = useState(search.product);
  const [productList, setProductList] = useState([]);
  // 平台
  const [platform, setPlatform] = useState(search.platform);
  // 来源
  const [mediaSources, setMediaSources] = useState(search.mediaSources);

  // 国家
  const [countries, setCountries] = useState(search.countries);
  const [countryList, setCountryList] = useState([]);
  // campaign
  const [campaigns, setCampaign] = useState(search.campaigns || null);
  const [campaignList, setCampaignList] = useState(search.campaigns);
  // 分组维度
  const [groupBy, setGroupBy] = useState(search.groupBy || null);
  // 日期
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(2, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));

  const getCountryList = async () => {
    const where = whereSql({});
    const sql = countryListSQL + (where || '');
    const res = await getData(sql);
    const list = res.map(v => ({ value: v.country, country: v.country }));
    setCountryList(list);
  };

  const getCampaignList = async () => {
    const conditions = {};
    if (product) {
      conditions.product_id = product;
    }
    if (platform) {
      conditions.platform = platform;
    }
    if (mediaSources.length > 0 && !mediaSources.includes(' ')) {
      conditions.media_source__in = mediaSources;
    }
    if (countries.length && !countries.includes(' ')) {
      conditions.country_name = countries;
    }
    const where = whereSql(filterEmptyObj(conditions));
    const sql = campaignListSQL.replace(/\?/g, where ? ` where ${where}` : '');
    const res = await getData(sql);
    const list = res.map(v => ({ value: v.campaign, key: v.campaign }));
    setCampaignList(list);
  };

  const mediaSourceChange = (value) => {
    setMediaSources(value);
    getCampaignList(value);
  };

  const getProductList = async () => {
    const sql = productListSQL;
    const res = await getData(sql);
    // 过滤产品id为 null 的情况
    const productList = res.filter(v => v.product_id && v.product_id !== 'null');
    const list = productList.map(v => ({ key: v.product_id, name: products[v.product_id] || v.product_id }));
    setProductList(list);
  };

  const searchClick = () => {
    onSearch({
      product,
      platform,
      mediaSources,
      countries,
      campaigns,
      groupBy,
      startDate,
      endDate,
    });
  };

  useEffect(() => {
    getCampaignList();
  }, [product, platform, mediaSources, countries]);

  useEffect(() => {
    Promise.all([getCountryList(), getCampaignList(), getProductList()]);
  }, []);

  return (
    <div>
      <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <div>
            <Select className={styles.queryItem} key="产品" placeholder="产品" value={product} onChange={setProduct}>
              <Select.Option key="" value="">
                所有产品
              </Select.Option>
              {productList.map(v => (
                <Select.Option key={v.key} value={v.key}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
            <Select className={styles.queryItem} key="平台" value={platform} onChange={setPlatform}>
              <Select.Option key="" value="">
                全部平台
              </Select.Option>
              <Select.Option key="Android" value="1">
                Android
              </Select.Option>
              <Select.Option key="iOS" value="2">
                iOS
              </Select.Option>
            </Select>
            <Select
              className={styles.queryItem2}
              style={{ width: 350 }}
              allowClear
              mode="multiple"
              showSearch
              key="来源"
              value={mediaSources}
              placeholder="来源"
              onChange={mediaSourceChange}
            >
              <Select.Option key="全部来源" value=" ">
                全部来源
              </Select.Option>
              <Select.Option key="全部广告来源" value="ALL">
                全部广告来源
              </Select.Option>
              {mediaSourceList.map(v => (
                <Select.Option key={v.value} value={v.value}>
                  {v.value}
                </Select.Option>
              ))}
            </Select>
            <Select
              className={styles.queryItem2}
              allowClear
              mode="multiple"
              showSearch
              key="地区"
              value={countries}
              placeholder="国家"
              onChange={setCountries}
            >
              <Select.Option key="全部国家" value=" ">
                全部地区
              </Select.Option>
              {countryList.map(v => (
                <Select.Option key={v.value} value={v.value}>
                  {v.country}
                </Select.Option>
              ))}
            </Select>
            <Select
              className={styles.queryItem2}
              style={{ width: 500 }}
              allowClear
              mode="multiple"
              showSearch
              key="campaigns"
              value={campaigns}
              placeholder="campaign"
              onChange={setCampaign}
            >
              {campaignList.map(v => (
                <Select.Option key={v.value} value={v.value}>{v.value}</Select.Option>
              ))}
            </Select>
            <Select
              className={styles.queryItem2}
              style={{ width: 320 }}
              allowClear
              mode="multiple"
              showSearch
              key="分组维度"
              value={groupBy}
              placeholder="分组维度"
              onChange={setGroupBy}
            >
              <Select.Option key="ds" value="ds">日期</Select.Option>
              <Select.Option key="country_name" value="country_name">国家</Select.Option>
              <Select.Option key="media_source" value="media_source">来源</Select.Option>
              <Select.Option key="campaign_name" value="campaign_name">campaign</Select.Option>
            </Select>
            <MyDatePicker
              style={{ width: 250, margin: 8 }}
              value={[startDate, endDate]}
              onChange={(values) => {
                setStartDate(values[0]);
                setEndDate(values[1]);
              }}
            />
            <Button type="primary" onClick={searchClick}>
              查询
            </Button>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
