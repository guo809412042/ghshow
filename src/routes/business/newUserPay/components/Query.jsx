/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Select, Button, Tooltip,
} from 'antd';
import { getData } from '../../../../utils/request';
import { countryNameSQL, skuTypeSQL, appProductSQL } from './sqlTemplate';
import { APP_LIST } from '../const';
import { COUNTRY_NAME_COMMON_LIST } from '../../../common/countrySelect';
import { createSqlWhere } from '../../../../utils/utils';
import MyDatePicker from '../../../components/MyDatePicker';

export default ({ search, onSearch }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);

  // app 类型
  const [appProduct, setAppProduct] = useState(search.appProduct);
  const [appProductList, setAppProductList] = useState([]);
  // 地区
  const [countryName, setCountryName] = useState(search.countryName);
  const [countryCode, setCountryCode] = useState(search.countryCode);
  const [conutryOperator, setConutryOperator] = useState(search.conutryOperator);
  const [countryNameList, setCountryodeList] = useState([]);
  const [platform, setPlatform] = useState(search.platform);
  const [skuId, setSkuId] = useState(search.skuId);
  const [skuTdList, setSkuIdList] = useState([]);
  const [type, setType] = useState(search.type);
  const [channel, setChannel] = useState(search.channel);

  const getCountryNameList = async () => {
    const res = await getData(countryNameSQL);
    setCountryodeList(res);
  };
  const getSkuList = async () => {
    let where = '';
    if (appProduct) {
      where += ` and product_id = '${appProduct}'`;
    }
    if (countryName.length) {
      where += ` and country_name ${conutryOperator} (${countryName.map(v => `'${v}'`).join(',')})`;
    }
    const res = await getData(
      createSqlWhere({
        sql: skuTypeSQL,
        where,
      }),
    );
    setSkuIdList(res);
  };
  const getAppProductList = async () => {
    const res = await getData(appProductSQL);
    setAppProductList(res);
  };
  useEffect(() => {
    getCountryNameList();
    getAppProductList();
  }, []);
  useEffect(() => {
    getSkuList();
  }, [appProduct, countryName, conutryOperator]);
  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      appProduct,
      countryName,
      countryCode,
      skuId,
      platform,
      type,
      conutryOperator,
      channel,
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
            placeholder="app名称"
          >
            <Select.Option key="" value="">
              整体
            </Select.Option>
            {appProductList.map(v => (
              <Select.Option value={v.product_id} key={v.product_id}>
                {APP_LIST[v.product_id]}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="平台"
            value={platform}
            onChange={e => setPlatform(e)}
          >
            <Select.Option key="1,3" value="1,3">
              Andorid
            </Select.Option>

            <Select.Option key="2" value="2">
              iOS
            </Select.Option>
          </Select>
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
            value={countryName}
            onChange={(value, values) => {
              setCountryName(values.map(v => v.key));
              setCountryCode(value);
            }}
            mode="multiple"
            placeholder="地区"
            showSearch
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
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
          <Select placeholder="渠道" value={channel} onChange={setChannel} allowClear style={{ width: 200, marginRight: '8px' }}>
            <Select.Option key="organic" value="0">自然渠道</Select.Option>
            <Select.Option key="non" value="1">投放渠道</Select.Option>
          </Select>
          <div />
          <Select
            style={{ width: 400, marginRight: '8px' }}
            value={skuId}
            onChange={setSkuId}
            mode="multiple"
            placeholder="商品id"
            showSearch
            filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
          >
            {skuTdList.map(v => (
              <Select.Option value={v.sku_id} key={v.sku_id}>
                {v.sku_id}
              </Select.Option>
            ))}
          </Select>
          <Select style={{ width: 100, marginRight: '8px' }} placeholder="类型" value={type} onChange={e => setType(e)}>
            <Select.Option key="pay_usr_cnt_1d" value="pay_usr_cnt_1d">
              按人数
            </Select.Option>

            <Select.Option key="pay_amt_total" value="pay_amt_total">
              按金额
            </Select.Option>
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
