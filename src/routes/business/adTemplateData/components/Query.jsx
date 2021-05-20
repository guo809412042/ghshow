import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, Button, Tooltip,
} from 'antd';
import { getData } from '../../../../utils/request';
import {
  countryNameSQL, appProductSQL, mediaSourceSQL,
} from './sqlTemplate';
import { APP_LIST } from '../const';
import { COUNTRY_NAME_COMMON_LIST } from '../../../common/countrySelect';
import MyDatePicker from '../../../components/MyDatePicker';

export default ({ search, onSearch, allTtidList }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);

  // app 类型
  const [appProduct, setAppProduct] = useState(search.appProduct);
  const [appPlatform, setAppPlatform] = useState(undefined);
  const [appProductList, setAppProductList] = useState([]);
  const [appTtid, setAppTtid] = useState([]);
  // 地区
  const [countryName, setCountryName] = useState(search.countryName);
  const [countryCode, setCountryCode] = useState(search.countryCode);
  const [countryNameList, setCountryodeList] = useState([]);
  const [mediaSource, setMediaSource] = useState([]);
  const [mediaSourceValue, setMediaSourceValue] = useState(undefined);

  const getCountryNameList = async () => {
    const res = await getData(countryNameSQL);
    setCountryodeList(res);
  };
  const getAppProductList = async () => {
    const res = await getData(appProductSQL);
    setAppProductList(res);
  };
  const getMediaSourceList = async () => {
    const res = await getData(mediaSourceSQL);
    setMediaSource(res);
  };
  useEffect(() => {
    getCountryNameList();
    getAppProductList();
    getMediaSourceList();
  }, []);

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      appProduct,
      platform: appPlatform,
      countryName,
      countryCode,
      conutryOperator: 'in',
      mediaSource: mediaSourceValue,
      appTtid,
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
            placeholder="产品id"
          >
            {appProductList.map(v => (
              <Select.Option value={v.product_id} key={v.product_id}>
                {APP_LIST[v.product_id]}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={appPlatform}
            onChange={setAppPlatform}
            allowClear
            placeholder="平台"
          >
            <Select.Option value="1" key="1">
              安卓
            </Select.Option>
            <Select.Option value="2" key="2">
              iOS
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
            value={appTtid}
            onChange={setAppTtid}
            mode="multiple"
            placeholder="素材id"
            filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {allTtidList.map(v => (
              <Select.Option value={v.ttid} key={v.ttid}>
                {v.ttid}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={mediaSourceValue}
            allowClear
            onChange={setMediaSourceValue}
            placeholder="渠道"
          >
            {mediaSource.map(v => (
              <Select.Option value={v.media_source} key={v.media_source}>
                {v.media_source}
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
          <Button onClick={handleSearch} type="primary">
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
