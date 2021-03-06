import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import moment from 'moment';
import {
  countryListSQL, mediaSourceListSQL, productListSQL, campaignNameListSQL, appVerListSQL,
} from './sqlTemplate';
import { getData } from '../../../../utils/request';
import styles from '../styles/index.less';
import MyDatePicker from '../../../components/MyDatePicker';
import { AppProductList } from '../../../business/advStatistics/components/utils';
import { getDataList } from '../../../customCountryGroup/service';

const { Option } = Select;

export default ({ search = {}, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(31, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));
  const [countries, setCountries] = useState(search.countries || []);
  const [countryList, setCountryList] = useState([]);
  const [platform, setPlatform] = useState(search.platform || '');
  const [product, setProduct] = useState(search.product || '');
  const [productList, setProductList] = useState([]);
  const [appVerList, setAppVerList] = useState([]);
  const [appVer, setAppVer] = useState(search.appVer || '');
  const [mediaSources, setMediaSources] = useState(search.mediaSources || []);
  const [campaignName, setCampaignName] = useState([]);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [campaignNameList, setCampaignNameList] = useState([]);
  // const [userType, setUserType] = useState(search.userType || '');
  const [isVip, setIsVip] = useState(search.isVip || '');

  const getProductList = async () => {
    const sql = productListSQL;
    const res = await getData(sql);
    const list = res.map(v => ({ key: AppProductList[v.product_id], value: v.product_id }));
    setProductList(list);
  };

  const getWhere = () => {
    let where = ' 1=1';
    if (product) {
      where += ` and product_id in ('${product}')`;
    }
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    return where;
  };

  const getCountryList = async () => {
    const where = getWhere();
    const sql = countryListSQL.replace(/#where#/g, where);
    const res = await getData(sql);
    // const list = COUNTRY_NAME_COMMON_LIST.concat(
    const list = res.map(v => ({ country_code: [v.country], country_name: v.country }));
    // );
    const { data: customCountry } = await getDataList();
    // console.log('datadatadata', data);
    // console.log('resresres', res);
    // console.log('customCountry', customCountry);
    customCountry.forEach((item) => {
      item.country_code = item.country_codes.split(',');
      item.country_name = item.country_codes;
    });
    // console.log('list', list);
    setCountryList(customCountry.concat(list));
  };

  const handleChange = (e) => {
    let c = new Set();
    for (const i in e) {
      if (e[i].includes(',')) {
        const newCountrys = e[i].split(',');
        c = new Set([...c, ...newCountrys]);
      } else {
        c = new Set([...c, e[i]]);
      }
    }

    setCountries([...c]);
  };

  const getAppVerList = async () => {
    const where = getWhere();
    const sql = appVerListSQL.replace(/#where#/g, where);
    const res = await getData(sql);
    setAppVerList(res);
  };

  const getMediaSourceList = async () => {
    const where = getWhere();
    const sql = mediaSourceListSQL.replace(/#where#/g, where);
    const res = await getData(sql);
    setMediaSourceList(res);
  };

  const getCampaignNameList = async () => {
    const where = getWhere();
    const sql = campaignNameListSQL.replace(/#where#/g, where);
    const res = await getData(sql);
    setCampaignNameList(res);
  };


  const searchClick = () => {
    onSearch({
      startDate,
      endDate,
      countries,
      platform,
      product,
      mediaSources,
      appVer,
      isVip,
      campaignName,
    });
  };

  useEffect(() => {
    getCountryList();
    getMediaSourceList();
    getCampaignNameList();
    getAppVerList();
  }, [product, platform]);

  useEffect(() => {
    getCountryList();
    getProductList();
    getCampaignNameList();
    getMediaSourceList();
  }, []);

  return (
    <div>
      <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
        <Collapse.Panel header="??????" key="1">
          <div style={{ width: '85%' }}>
            <div className={styles.formItem}>
              <Select className={`${styles.queryItem} ${styles.productLabel}`} key="??????" value={product} onChange={setProduct}>
                <Select.Option key="" value="">
                ????????????
                </Select.Option>
                {productList.map(v => <Option key={v.key} value={v.value}>{v.key}</Option>)}
              </Select>
              <Select className={`${styles.queryItem} ${styles.platformLabel}`} key="??????" value={platform} onChange={setPlatform}>
                <Select.Option key="" value="">
                ????????????
                </Select.Option>
                <Select.Option key="Android" value="1">
                Android
                </Select.Option>
                <Select.Option key="iOS" value="2">
                iOS
                </Select.Option>
              </Select>
              <Select className={`${styles.queryItem} ${styles.vipLabel}`} key="??????" value={isVip} onChange={setIsVip}>
                <Select.Option key="" value="">
                ??????
                </Select.Option>
                <Select.Option key="Y" value="Y">
                ???
                </Select.Option>
                <Select.Option key="N" value="N">
                ???
                </Select.Option>
              </Select>
              <Select className={`${styles.queryItem} ${styles.versionLabel}`} key="??????" value={appVer} onChange={setAppVer}>
                <Select.Option key="" value="">
                ????????????
                </Select.Option>
                {appVerList.map(v => <Option key={v.app_version_lst} value={v.app_version_lst}>{v.app_version_lst}</Option>)}
              </Select>
              {/* <Select className={`${styles.queryItem} ${styles.usertypeLabel}`} key="??????" value={userType} onChange={setUserType}>
                <Select.Option key="" value="">
                ??????
                </Select.Option>
                <Select.Option key="new" value="1">
                ?????????
                </Select.Option>
                <Select.Option key="old" value="2">
                ?????????
                </Select.Option>
              </Select> */}
              <Select
                placeholder="??????"
                allowClear
                showSearch
                mode="multiple"
                className={`${styles.queryItem} ${styles.mediasourceLabel}`}
                value={mediaSources}
                onChange={setMediaSources}>
                {mediaSourceList.map(media => <Option key={media.media_source} value={media.media_source}>{media.media_source}</Option>)}
              </Select>
              <Select
                placeholder="??????"
                allowClear
                showSearch
                mode="multiple"
                className={`${styles.queryItem} ${styles.campaignNameLabel}`}
                value={campaignName}
                onChange={setCampaignName}>
                {campaignNameList.map(media => <Option key={media.campaign_name} value={media.campaign_name}>{media.campaign_name}</Option>)}
              </Select>
            </div>
            <div className={styles.formItem}>
              <Select
                allowClear
                mode="multiple"
                showSearch
                className={`${styles.queryItem} ${styles.countryLabel}`}
                key="??????"
                value={countries}
                placeholder="??????"
                onChange={handleChange}
              >
                <Select.Option key="????????????" value=" ">
                ????????????
                </Select.Option>
                {countryList.map(v => (
                  <Select.Option key={v.country_name} value={v.country_name}>
                    {v.group_name || v.country_name}
                  </Select.Option>
                ))}
              </Select>
              <MyDatePicker
                className={styles.dateLabel}
                value={[startDate, endDate]}
                onChange={(values) => {
                  setStartDate(values[0]);
                  setEndDate(values[1]);
                }}
              />
              <Button className={styles.searchBtn} type="primary" onClick={searchClick}>
              ??????
              </Button>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
