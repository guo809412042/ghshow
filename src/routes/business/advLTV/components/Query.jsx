import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import moment from 'moment';
import {
  campaignListSQL, countryListSQL, mediaSourceListSQL, productListSQL,
} from './sqlTemplate';
import { getData } from '../../../../utils/request';
import styles from '../styles/index.less';
import MyDatePicker from '../../../components/MyDatePicker';

const { Option } = Select;

export default ({ search = {}, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));
  const [countryOpt, setCountryOpt] = useState(search.countryOpt || 'in');
  const [countries, setCountries] = useState(search.countries || []);
  const [countryList, setCountryList] = useState([]);
  const [platform, setPlatform] = useState(search.platform || '1');
  const [product, setProduct] = useState(search.product || 'VivaVideo');
  const [productList, setProductList] = useState([]);
  const [mediaSource, setMediaSource] = useState(search.mediaSource);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [campaign, setCampaign] = useState(search.campaign);
  const [campaignList, setCampaignList] = useState([]);

  const getProductList = async () => {
    const sql = productListSQL;
    const res = await getData(sql);
    const list = res.map(v => ({ key: v.product_name, value: v.product_name }));
    setProductList(list);
  };

  const getCountryList = async () => {
    const sql = countryListSQL;
    const res = await getData(sql);
    // const list = COUNTRY_NAME_COMMON_LIST.concat(
    const list = res.map(v => ({ country_code: [v.country], country_name: v.country }));
    // );
    setCountryList(list);
  };

  const getMediaSourceList = async () => {
    const where = ` where product_name in ('${product}')`;
    const sql = mediaSourceListSQL.replace(/#where#/g, where);
    const res = await getData(sql);
    setMediaSourceList(res);
  };

  const onMediaSourceChanged = async (media) => {
    setMediaSource(media);
    let where = ' where 1=1 ';
    if (product) {
      where += ` and product_name in ('${product}')`;
    }
    if (media) {
      where += `and media_source in ('${media}')`;
    }
    if (platform) {
      where += ` and platform in ('${platform}')`;
    }
    const sql = campaignListSQL.replace(/#where#/g, where);
    const res = await getData(sql);
    setCampaign();
    setCampaignList(res);
  };

  const searchClick = () => {
    onSearch({
      startDate,
      endDate,
      countryOpt,
      countries,
      platform,
      product,
      campaign,
      mediaSource,
    });
  };

  useEffect(() => {
    getCountryList();
    getProductList();
    getMediaSourceList();
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
              {productList.map(v => <Option key={v.key} value={v.value}>{v.key}</Option>)}
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
            <Select className={styles.queryItem} key="包含" value={countryOpt} onChange={setCountryOpt}>
              <Select.Option key="in" value="in">
                包含
              </Select.Option>
              <Select.Option key="not in" value="not in">
                不包含
              </Select.Option>
            </Select>
            <Select
              allowClear
              mode="multiple"
              showSearch
              className={styles.queryItem}
              style={{ width: 150 }}
              key="地区"
              value={countries}
              placeholder="地区"
              onChange={setCountries}
            >
              <Select.Option key="全部地区" value=" ">
                全部地区
              </Select.Option>
              <Select.Option key="CN" value="中国">
                中国
              </Select.Option>
              {countryList.map(v => (
                <Select.Option key={v.country_name} value={v.country_code}>
                  {v.country_name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="来源"
              allowClear
              showSearch
              className={styles.queryItem}
              style={{ width: 120 }}
              value={mediaSource}
              onChange={e => onMediaSourceChanged(e)}>
              {mediaSourceList.map(media => <Option key={media.media_source} value={media.media_source}>{media.media_source}</Option>)}
            </Select>
            <Select
              placeholder="campaign"
              allowClear
              showSearch
              className={styles.queryItem}
              style={{ width: 380 }}
              value={campaign}
              onChange={setCampaign}>
              {campaignList.map(camp => <Option key={camp.campaign_name} value={camp.campaign_name}>{camp.campaign_name}</Option>)}
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
