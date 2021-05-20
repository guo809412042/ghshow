import React, { useState, useEffect } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Select, Button } from 'antd';
import MyDatePicker from '../../../components/MyDatePicker';
// import AdvConfig from './AdvPlacementList';
import {
  PlatformList, AdvTypeList,
} from './utils';
import { getData } from '../../../../utils/request';
import {
  CountryListSQL, AdvPlacementListSQL, productListSQL, mediaSourceListSQL, campaignListSQL, platformNameListSQL, appkeyListSQL,
} from './SqlTemplate';
import { GetVCMAdvPlacementList } from '../services';
import {
  zhongdongCountryList,
  duliantiCountryList,
  oumeiCountryList,
  lameiCountryList,
  dongnanyashiguoCountryList,
  eyuquCountryList,
} from '../../../common/countrySelect';
import { selectAttr } from '../../../../utils/utils';
import { APPNAME_LIST, placementId } from './const';
import { getDataList } from '../../../customCountryGroup/service';

const Option = Select.Option;

export default ({ search = {}, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));

  const [product, setProduct] = useState(search.product || 'viva');
  const [productList, setProductList] = useState([]);

  const [platform, setPlatform] = useState(search.platform || undefined);
  const [platformList, setPlatformList] = useState([]);

  const [country, setCountry] = useState(search.country || undefined);
  const [countryList, setCountryList] = useState([]);

  const [advCompany, setAdvCompany] = useState(undefined);
  const [advCompanyList, setAdvCompanyList] = useState([]);

  const [advPlacement, setAdvPlacement] = useState(search.advPlacement || undefined);
  const [advPlacementList, setAdvPlacementList] = useState([]);
  const [vcmadvPlacementMap, setVcmadvPlacementMap] = useState({});

  const [advType, setAdvType] = useState(search.advType || undefined);
  const [advTypeList, setAdvTypeList] = useState([]);

  // const [statisticsType, setStatisticsType] = useState(search.statisticsType || 'day');
  // const [statisticsTypeList, setStatisticsTypeList] = useState([]);
  const [countryOperation, setCountryOperation] = useState('in');
  const [appVersionOperation, setAppVersionOperation] = useState('in');
  const [selectAppVersion, setSelectAppVersion] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [mediaSourceValue, setMediaSourceValue] = useState(undefined);
  const [campaignList, setCampaignList] = useState([]);
  const [campaignValue, setCampaignValue] = useState(undefined);

  const searchClick = () => {
    onSearch({
      product,
      platform,
      country,
      advCompany,
      advPlacement,
      advType,
      // statisticsType,
      startDate,
      endDate,
      mediaSourceValue,
      campaignValue,
      appVersionOperation,
      countryOperation,
      selectAppVersion,
    });
  };

  const getCountryAndAppVersionAndChannelList = async () => {
    const where = ` ${(product && product !== 2) ? ` and product_name in('${product}') and platform = ${platform}` : ''}`;
    const data = await getData(appkeyListSQL.replace(/#where#/g, where));
    setAppVersionList(data);
  };

  const getCountryList = async () => {
    const data = await getData(CountryListSQL);
    // console.log('CountryListSQL', data);
    const { data: customCountry } = await getDataList();
    // console.log('datadatadata', data);
    // console.log('resresres', res);
    customCountry.forEach((item) => {
      item.country = item.country_codes;
    });
    setCountryList(customCountry.concat(data));
  };

  const getCampaignList = async () => {
    if (mediaSourceValue && mediaSourceValue.length) {
      const where = ` and media_source in(${mediaSourceValue.map(v => `'${v}'`).join(',')}) `;
      const data = await getData(campaignListSQL.replace(/#where#/g, where));
      // console.log('CountryListSQL', data);
      setCampaignList(data);
    }
  };

  const getMediaSourceList = async () => {
    const data = await getData(mediaSourceListSQL);
    // console.log('CountryListSQL', data);
    setMediaSourceList(data);
  };

  const getAppProductList = async () => {
    const data = await getData(productListSQL);
    setProductList(data);
  };

  const getAdvCompanyList = async () => {
    // const { data } = await QueryNodeData({ sql: AdvCompanyListSQL });
    const where = ` ${product ? ` and product_name in('${product}')` : ''}`;
    const res = await getData(platformNameListSQL.replace(/#where#/g, where));
    // console.log('resres', res);
    setAdvCompanyList(res.filter(item => item !== ''));
  };

  const getAdvPlacementList = async () => {
    const where = ` ${product ? ` and product_name in('${product}')` : ''}`;
    const res = await getData(AdvPlacementListSQL.replace(/#where#/g, where));
    const { data } = await GetVCMAdvPlacementList({ product: APPNAME_LIST[product] });
    // console.log('resres', res);
    const dataMap = {};
    data.forEach((element) => {
      dataMap[element.code] = element.name;
    });
    setAdvPlacementList(res);
    setVcmadvPlacementMap(dataMap);
  };

  const updateView = async () => {
    await getAdvCompanyList();
    await getAdvPlacementList();
  };

  const handleChange = (e) => {
    let c = new Set();
    for (const i in e) {
      if (e[i] === '中东') {
        c = new Set([...c, ...zhongdongCountryList]);
      } else if (e[i] === '独联体') {
        c = new Set([...c, ...duliantiCountryList]);
      } else if (e[i] === '欧美') {
        c = new Set([...c, ...oumeiCountryList]);
      } else if (e[i] === '拉美') {
        c = new Set([...c, ...lameiCountryList]);
      } else if (e[i] === '东南亚十国') {
        c = new Set([...c, ...dongnanyashiguoCountryList]);
      } else if (e[i] === '俄语区') {
        c = new Set([...c, ...eyuquCountryList]);
      } else if (e[i].includes(',')) {
        const newCountrys = e[i].split(',');
        c = new Set([...c, ...newCountrys]);
      } else {
        c = new Set([...c, e[i]]);
      }
    }

    setCountry([...c]);
  };

  useEffect(() => {
    updateView();
  }, [product]);

  useEffect(() => {
    getCountryAndAppVersionAndChannelList();
  }, [product, platform]);
  useEffect(() => {
    getCampaignList();
  }, [mediaSourceValue]);

  useEffect(() => {
    getAppProductList();
    setPlatformList(PlatformList);
    getCountryList();
    getAdvCompanyList();
    getAdvPlacementList();
    setAdvTypeList(AdvTypeList);
    // setStatisticsTypeList(StatiticsTypeList);
    getMediaSourceList();
  }, []);

  const literalOptions = [
    <Option value="in" key="0">
      包含
    </Option>,
    <Option value="not in" key="1">
      不包含
    </Option>,
  ];

  return (<div>
    <Select placeholder="app类型" key="app类型" style={{ width: 200, marginRight: 8 }} allowClear value={product} onChange={setProduct}>
      {productList.map(v => <Option key={v.product_name} value={v.product_name}>{v.product_name}</Option>)}
    </Select>
    <Select placeholder="平台" key="平台" style={{ width: 200, marginRight: 8 }} allowClear value={platform} onChange={setPlatform}>
      {platformList.map(v => <Option key={v.key} value={v.value}>{v.key}</Option>)}
    </Select>
    <Select
      {...selectAttr}
      value={appVersionOperation}
      onChange={setAppVersionOperation}
    >
      {literalOptions}
    </Select>
    <Select
      placeholder="版本"
      {...selectAttr}
      value={selectAppVersion}
      mode="multiple"
      onChange={setSelectAppVersion}
    >
      {_.map(appVersionList, item => (
        <Select.Option key={item.app_version} value={item.app_version}>
          {item.app_version}
        </Select.Option>
      ))}
    </Select>
    <Select {...selectAttr} value={countryOperation} onChange={setCountryOperation}>
      {literalOptions}
    </Select>
    <Select placeholder="国家" key="国家" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={country} onChange={handleChange}>
      <Select.Option key="中东" value="中东">
        中东
      </Select.Option>
      <Select.Option key="独联体" value="独联体">
        独联体
      </Select.Option>
      <Select.Option key="欧美" value="欧美">
        欧美
      </Select.Option>
      <Select.Option key="拉美" value="拉美">
        拉美
      </Select.Option>
      <Select.Option key="东南亚十国" value="东南亚十国">
        东南亚十国
      </Select.Option>
      <Select.Option key="俄语区" value="俄语区">
        俄语区
      </Select.Option>
      {countryList.map(v => <Option key={v.country} value={v.country}>{v.group_name || v.country}</Option>)}
    </Select>
    <Select placeholder="来源" key="来源" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={mediaSourceValue} onChange={setMediaSourceValue}>
      {mediaSourceList.map(v => <Option key={v.media_source} value={v.media_source}>{v.media_source}</Option>)}
    </Select>
    <Select placeholder="campaign" key="campaign" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={campaignValue} onChange={setCampaignValue}>
      {campaignList.map(v => <Option key={v.campaign} value={v.campaign}>{v.campaign}</Option>)}
    </Select>
    <Select placeholder="广告商" key="广告商" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={advCompany} onChange={setAdvCompany}>
      {advCompanyList.map(v => <Option key={v.platform_id} value={v.platform_id}>{placementId[v.platform_id] || v.platform_id}</Option>)}
    </Select>
    <Select placeholder="广告位" key="广告位" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={advPlacement} onChange={setAdvPlacement}>
      {advPlacementList.map(v => <Option key={v.placement_id} value={v.placement_id}>{vcmadvPlacementMap[v.placement_id] || v.placement_id}</Option>)}
    </Select>
    <Select placeholder="广告形式" key="广告形式" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={advType} onChange={setAdvType}>
      {advTypeList.map(v => <Option key={v.key} value={v.key}>{v.value}</Option>)}
    </Select>
    <MyDatePicker
      style={{ width: 250, margin: 8 }}
      value={[startDate, endDate]}
      onChange={(values) => {
        setStartDate(values[0]);
        setEndDate(values[1]);
      }} />
    {/* <Select placeholder="维度" key="维度" style={{ width: 200, marginRight: 8 }} value={statisticsType} onChange={setStatisticsType}>
      {statisticsTypeList.map(v => <Option key={v.key} value={v.value}>{v.key}</Option>)}
    </Select> */}
    <Button type="primary" onClick={searchClick} style={{ marginRight: 8 }}>
      查询
    </Button>
    {/* <AdvConfig appList={productList} updateView={updateView} /> */}
  </div>);
};
