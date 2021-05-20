import React, { useState, useEffect } from 'react';
import { Collapse, Select, Button } from 'antd';
import moment from 'moment';
import {
  countryListSQL, mediaSourceListSQL, productListSQL, versionListSQL,
} from './sqlTemplate';
import { getHoloData as getData } from '../../../../utils/request';
import styles from '../styles/index.less';
import MyDatePicker from '../../../components/MyDatePicker';
import { GroupBy } from '../const';
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
  const [mediaSources, setMediaSources] = useState(search.mediaSources || []);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [versions, setVersions] = useState(search.versions);
  const [versionList, setVersionList] = useState([]);
  const [groupBy, setGroupBy] = useState(search.groupBy || 'platform');
  const [vip, setVip] = useState(search.vip || '');
  const [userType, setUserType] = useState(search.userType || '');

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

  const getMediaSourceList = async () => {
    const where = getWhere();
    const sql = mediaSourceListSQL.replace(/#where#/g, where);
    const res = await getData(sql);
    setMediaSourceList(res);
  };

  const getVersionList = async () => {
    const where = getWhere();
    const sql = versionListSQL.replace(/#where#/g, where);
    let res = await getData(sql);
    res = res.filter((v) => {
      if (/^\w*(\d{1,2}\.){2,3}\d{1,2}\w*$/g.test(v.app_version)) {
        return true;
      }
      return false;
    });
    setVersionList(res);
  };

  const searchClick = () => {
    onSearch({
      startDate,
      endDate,
      countries,
      versions,
      platform,
      product,
      mediaSources,
      groupBy,
      vip,
      userType,
    });
  };

  useEffect(() => {
    getCountryList();
    getVersionList();
    getMediaSourceList();
  }, [product, platform]);

  useEffect(() => {
    getCountryList();
    getProductList();
    getVersionList();
    getMediaSourceList();
  }, []);

  return (
    <div>
      <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <div style={{ width: '85%' }}>
            <div className={styles.formItem}>
              <Select className={`${styles.queryItem} ${styles.productLabel}`} key="产品" value={product} onChange={setProduct}>
                {/* <Select.Option key="" value="">
                所有产品
                </Select.Option> */}
                {productList.map(v => <Option key={String(v.key)} value={String(v.value)}>{v.key}</Option>)}
              </Select>
              <Select className={`${styles.queryItem} ${styles.platformLabel}`} key="平台" value={platform} onChange={setPlatform}>
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
              <Select className={`${styles.queryItem} ${styles.vipLabel}`} key="会员" value={vip} onChange={setVip}>
                <Select.Option key="" value="">
                全部
                </Select.Option>
                <Select.Option key="VIP" value="Y">
                会员
                </Select.Option>
                <Select.Option key="noVIP" value="N">
                非会员
                </Select.Option>
              </Select>
              <Select className={`${styles.queryItem} ${styles.usertypeLabel}`} key="用户" value={userType} onChange={setUserType}>
                <Select.Option key="" value="">
                全部
                </Select.Option>
                <Select.Option key="new" value="1">
                新用户
                </Select.Option>
                <Select.Option key="old" value="2">
                老用户
                </Select.Option>
                <Select.Option key="renew" value="3">
                回流用户
                </Select.Option>
              </Select>
            </div>
            <div className={styles.formItem}>
              <Select
                placeholder="全部"
                allowClear
                showSearch
                mode="multiple"
                className={`${styles.queryItem} ${styles.mediasourceLabel}`}
                value={mediaSources}
                onChange={setMediaSources}>
                {mediaSourceList.map(media => <Option key={media.media_source} value={media.media_source}>{media.media_source}</Option>)}
              </Select>
              <Select
                placeholder="全部"
                allowClear
                showSearch
                mode="multiple"
                className={`${styles.queryItem} ${styles.versionLabel}`}
                value={versions}
                onChange={setVersions}>
                {versionList.map(camp => <Option key={camp.app_version} value={camp.app_version}>{camp.app_version}</Option>)}
              </Select>
              <Select
                allowClear
                mode="multiple"
                showSearch
                className={`${styles.queryItem} ${styles.countryLabel}`}
                key="地区"
                value={countries}
                placeholder="全部"
                onChange={handleChange}
              >
                <Select.Option key="全部地区" value=" ">
                全部地区
                </Select.Option>
                {countryList.map(v => (
                  <Select.Option key={v.country_name} value={v.country_name}>
                    {v.group_name || v.country_name}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className={styles.formItem}>
              <Select className={`${styles.queryItem} ${styles.groupbyLabel}`} key="分组" value={groupBy} onChange={setGroupBy}>
                {GroupBy.map(v => <Option key={v.value} value={v.value}>{v.key}</Option>)}
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
              查询
              </Button>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
