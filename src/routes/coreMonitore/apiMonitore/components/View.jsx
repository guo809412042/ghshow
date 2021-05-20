/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  DatePicker, Select, Tooltip, Icon,
} from 'antd';
import Query from './Query';
import { selectAttr } from '../../../../utils/utils';
import Throughput from './Throughput';
import SuccessView from './SuccessView';
import WholeLinkSuccessView from './WholeLinkSuccessView';
import { productInfos } from '../../../../utils/enum';
// import StatusCodeTop5View from '../components/StatusCodeTop5View';

const dateFormat = 'YYYY-MM-DD';
export default ({
  noAndroid = false, noIos = false, product = 'viva', productValue = '',
  product_id = '2', noStatuscode = false, database = '', test = false,
}) => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(0, 'days'));
  const [platform, setPlatform] = useState(noAndroid ? '2' : '1');
  // 初始默认值
  const [productInfo, setProductInfo] = useState({
    productValue: 'viva',
    product_id: '2',
    database: 'holo_viva_log_#type#_mon_api_statuscode_10m',
  });
  const [where, setWhere] = useState('');

  const onSearch = ({ where }) => {
    setWhere(where);
  };
  return <div>
    <DatePicker
      defaultValue={currentDate}
      format={dateFormat}
      onChange={setCurrentDate}
      style={{ marginRight: 20, marginBottom: 20 }}
    />
    <Select {...selectAttr} allowClear={false} placeholder="平台" value={platform} onChange={setPlatform}>
      {noAndroid ? (
        ''
      ) : (
        <Select.Option key="1" value="1">
                Andorid
        </Select.Option>
      )}
      {noIos ? (
        ''
      ) : (
        <Select.Option key="2" value="2">
                iOS
        </Select.Option>
      )}
    </Select>

    <Select {...selectAttr}
      allowClear={false}
      placeholder="产品"
      defaultValue="2"
      onChange={e => setProductInfo(productInfos.find(item => item.product_id === e))}>
      {productInfos.map(item => (
        <Select.Option key={item.product_id} value={item.product_id}>{item.productValue}</Select.Option>
      ))}
    </Select>

    <Query
      onSearch={onSearch}
      platform={platform}
      product={product}
      productValue={productValue}
      database={database}
      currentDate={currentDate}
      productInfo={productInfo}
    />
    <div>
      <h3>吞吐量</h3>
      <Throughput
        product={product}
        where={where}
        platform={platform}
        currentDate={currentDate}
        productValue={productValue}
        database={database}
        productInfo={productInfo}
        test={test}
      />
    </div>
    <div>
      <h3>成功率</h3>
      <SuccessView
        where={where}
        platform={platform}
        currentDate={currentDate}
        product={product}
        productValue={productValue}
        noStatuscode={noStatuscode}
        database={database}
        productInfo={productInfo}
        test={test}
      />
    </div>
    <div>
      <h3>全链路-成功率 <Tooltip title={<div>
        <p> -20  DNS解析失败</p>
        <p>-40  准备建立链接失败</p>
        <p>-50  Https建立链接失败</p>
        <p>-80  取得链接</p>
        <p>-90  发送请求报文Header失败</p>
        <p>-110 发送请求报文Body失败</p>
        <p>-130 服务器开始返回Header失败</p>
        <p>-150 服务器开始返回Body失败</p>
      </div>}>
        <Icon type="question-circle" />
      </Tooltip></h3>
      <WholeLinkSuccessView
        where={where}
        platform={platform}
        currentDate={currentDate}
        productValue={productValue}
        product={product}
        noStatuscode={noStatuscode}
        database={database}
        productInfo={productInfo}
        test={test}
      />
    </div>

  </div>;
};
