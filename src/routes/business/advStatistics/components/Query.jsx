import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Select, Button } from 'antd';
import MyDatePicker from '../../../components/MyDatePicker';
import AdvConfig from './AdvPlacementList';
import {
  PlatformList, AdvTypeList, StatiticsTypeList, AppProductList,
} from './utils';
import { getData } from '../../../../utils/request';
import {
  CountryListSQL, AdvCompanyListSQL, AdvPlacementListSQL, appProductListSQL,
} from './SqlTemplate';
import { QueryNodeData } from '../services';
import { getDataList } from '../../../customCountryGroup/service';
import {
  zhongdongCountryList,
  duliantiCountryList,
  oumeiCountryList,
  lameiCountryList,
  dongnanyashiguoCountryList,
  eyuquCountryList,
} from '../../../common/countrySelect';

const Option = Select.Option;

export default ({ search = {}, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate || moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(search.endDate || moment().subtract(1, 'days'));

  const [product, setProduct] = useState(search.product || undefined);
  const [productList, setProductList] = useState([]);

  const [platform, setPlatform] = useState(search.platform || undefined);
  const [platformList, setPlatformList] = useState([]);

  const [country, setCountry] = useState(search.country || undefined);
  const [countryList, setCountryList] = useState([]);

  const [advCompany, setAdvCompany] = useState(search.advCompany || undefined);
  const [advCompanyList, setAdvCompanyList] = useState([]);

  const [advPlacement, setAdvPlacement] = useState(search.advPlacement || undefined);
  const [advPlacementList, setAdvPlacementList] = useState([]);

  const [advType, setAdvType] = useState(search.advType || undefined);
  const [advTypeList, setAdvTypeList] = useState([]);

  const [statisticsType, setStatisticsType] = useState(search.statisticsType || 'day');
  const [statisticsTypeList, setStatisticsTypeList] = useState([]);

  const searchClick = () => {
    onSearch({
      product,
      platform,
      country,
      advCompany,
      advPlacement,
      advType,
      statisticsType,
      startDate,
      endDate,
    });
  };

  const getCountryList = async () => {
    const data = await getData(CountryListSQL);
    const { data: customCountry } = await getDataList();
    // console.log('datadatadata', data);
    // console.log('resresres', res);
    customCountry.forEach((item) => {
      item.country = item.country_codes;
    });
    setCountryList(customCountry.concat(data));
  };

  const getAppProductList = async () => {
    const data = await getData(appProductListSQL);
    setProductList(data.map(v => ({
      key: AppProductList[v.app_product],
      value: v.app_product,
    })));
  };

  const getAdvCompanyList = async () => {
    // const { data } = await QueryNodeData({ sql: AdvCompanyListSQL });
    const where = ` ${product ? ` where product_id in(${product})` : ''}`;
    const res = await getData(AdvCompanyListSQL.replace(/#where#/g, where));
    setAdvCompanyList(res);
  };

  const getAdvPlacementList = async () => {
    const where = ` where is_delete=0 ${product ? ` and product_id in(${product})` : ''}`;
    const { data } = await QueryNodeData({ sql: AdvPlacementListSQL.replace(/#where#/g, where) });
    setAdvPlacementList(data);
  };

  const updateView = async () => {
    await getAdvCompanyList();
    await getAdvPlacementList();
  };

  const handleChange = (e) => {
    let c = new Set();
    for (const i in e) {
      if (e[i] === '??????') {
        c = new Set([...c, ...zhongdongCountryList]);
      } else if (e[i] === '?????????') {
        c = new Set([...c, ...duliantiCountryList]);
      } else if (e[i] === '??????') {
        c = new Set([...c, ...oumeiCountryList]);
      } else if (e[i] === '??????') {
        c = new Set([...c, ...lameiCountryList]);
      } else if (e[i] === '???????????????') {
        c = new Set([...c, ...dongnanyashiguoCountryList]);
      } else if (e[i] === '?????????') {
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
    getAppProductList();
    setPlatformList(PlatformList);
    getCountryList();
    getAdvCompanyList();
    getAdvPlacementList();
    setAdvTypeList(AdvTypeList);
    setStatisticsTypeList(StatiticsTypeList);
  }, []);


  return (<div>
    <Select placeholder="app??????" key="app??????" style={{ width: 200, marginRight: 8 }} allowClear value={product} onChange={setProduct}>
      {productList.map(v => <Option key={v.key} value={v.value}>{v.key}</Option>)}
    </Select>
    <Select placeholder="??????" key="??????" style={{ width: 200, marginRight: 8 }} allowClear value={platform} onChange={setPlatform}>
      {platformList.map(v => <Option key={v.key} value={v.value}>{v.key}</Option>)}
    </Select>
    <Select placeholder="??????" key="??????" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={country} onChange={handleChange}>
      <Select.Option key="??????" value="??????">
        ??????
      </Select.Option>
      <Select.Option key="?????????" value="?????????">
        ?????????
      </Select.Option>
      <Select.Option key="??????" value="??????">
        ??????
      </Select.Option>
      <Select.Option key="??????" value="??????">
        ??????
      </Select.Option>
      <Select.Option key="???????????????" value="???????????????">
        ???????????????
      </Select.Option>
      <Select.Option key="?????????" value="?????????">
        ?????????
      </Select.Option>
      {countryList.map(v => <Option key={v.country} value={v.country}>{v.group_name || v.country}</Option>)}
    </Select>
    <Select placeholder="?????????" key="?????????" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={advCompany} onChange={setAdvCompany}>
      {advCompanyList.map(v => <Option key={v.company} value={v.company}>{v.company}</Option>)}
    </Select>
    <Select placeholder="?????????" key="?????????" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={advPlacement} onChange={setAdvPlacement}>
      {advPlacementList.map(v => <Option key={v.placement_name} value={v.placement_id}>{v.placement_name}</Option>)}
    </Select>
    <Select placeholder="????????????" key="????????????" mode="multiple" style={{ width: 200, marginRight: 8 }} allowClear value={advType} onChange={setAdvType}>
      {advTypeList.map(v => <Option key={v.key} value={v.value}>{v.key}</Option>)}
    </Select>
    <MyDatePicker
      style={{ width: 250, margin: 8 }}
      value={[startDate, endDate]}
      onChange={(values) => {
        setStartDate(values[0]);
        setEndDate(values[1]);
      }} />
    <Select placeholder="??????" key="??????" style={{ width: 200, marginRight: 8 }} value={statisticsType} onChange={setStatisticsType}>
      {statisticsTypeList.map(v => <Option key={v.key} value={v.value}>{v.key}</Option>)}
    </Select>
    <Button type="primary" onClick={searchClick} style={{ marginRight: 8 }}>
      ??????
    </Button>
    <AdvConfig appList={productList} updateView={updateView} />
  </div>);
};
