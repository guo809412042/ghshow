/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Row, Col, Select, DatePicker, Button, Tooltip,
} from 'antd';
import moment from 'moment';
import { PLAFORM_LIST } from '../../../../utils/const';
import { getDistincetSQLData, createSqlWhere } from '../../../../utils/utils';
import {
  createTimeEum, groups, APP_PRODUCT_LIST, subscribePeriodEum,
} from '../const';
import { getData } from '../../../../utils/request';
import { getDataList } from '../../../customCountryGroup/service';

export default ({ search, setSearch }) => {
  const [productId, setProductId] = useState(search.productId || '');
  const [platform, setPlatform] = useState(search.platform || '');
  const [subscribePeriod, setSubscribePeriod] = useState(search.subscribePeriod || '');
  const [createTime, setCreateTime] = useState(search.createTime || '');
  const [campaignData, setCampaignData] = useState([]);
  const [campaign, setCampaign] = useState(search.campaign || '');
  const [entranceData, setEntranceData] = useState([]);
  const [entrance, setEntrance] = useState(search.entrance || []);
  const [skuId, setSkuId] = useState(search.skuId || []);
  const [skuIdData, setSkuData] = useState([]);
  const [mediaSource, setMediaSource] = useState(search.mediaSource || []);
  const [mediaSourceData, setMediaSourceData] = useState([]);
  const [country, setCountry] = useState(search.country || []);
  const [countryData, setCountryData] = useState([]);
  const [group, setGroup] = useState(search.group || []);
  const [ltvDay, setLtvDay] = useState('180');
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const init = async () => {
    // 来源
    const mediaSourceRes = await getDistincetSQLData('media_source', 'vcm_vd_sub_dvc_cnt_nd');
    setMediaSourceData(mediaSourceRes);

    // 国家
    const countryRes = await getDistincetSQLData('country', 'vcm_vd_sub_dvc_cnt_nd');
    const { data: customCountry } = await getDataList();
    // console.log('datadatadata', data);
    // console.log('resresres', res);
    customCountry.forEach((item) => {
      item.country = item.country_codes;
    });
    setCountryData(customCountry.concat(countryRes));
  };

  const getEntranceData = async () => {
    // 入口
    let where = '';
    if (productId) {
      where += ` and product_id = '${productId}'`;
    }
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    const entranceRes = await getData(
      createSqlWhere({
        sql: `
        /*+ engine= mpp*/
      SELECT  entrance
FROM    (
            SELECT  entrance
            FROM    vcm_vd_trd_sub_track_detail
            WHERE   entrance != ''
            AND     entrance IS NOT NULL ${where}
            UNION ALL
            SELECT  entrance
            FROM    vcm_vd_sub_dvc_cnt_nd
            WHERE   entrance != ''
            AND     entrance IS NOT NULL ${where}
        ) a
GROUP BY entrance
;
`,
      }),
    );
    setEntranceData(entranceRes);
  };

  const getSkuData = async () => {
    let where = '';
    if (productId) {
      where += ` and product_id = '${productId}'`;
    }
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    if (subscribePeriod) {
      where += ` and subscribe_period = '${subscribePeriod}'`;
    }
    // 商品id
    const skuIDRes = await getDistincetSQLData('sku_id', 'vcm_vd_sub_dvc_cnt_nd', where);
    const skuIDList = [];
    for (const i of skuIDRes) {
      const j = i.sku_id.split(',');
      for (const item of j) {
        if (!skuIDList.includes(item)) {
          skuIDList.push(item);
        }
      }
    }
    setSkuData(skuIDList);
  };

  const getCampaginData = async () => {
    // campaign
    let where = '';
    if (productId) {
      where += ` and product_id = '${productId}'`;
    }
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    if (mediaSource && mediaSource.length) {
      where += ` and media_source in (${mediaSource.map(v => `'${v}'`).join(',')}) `;
    }
    const campaignRes = await getDistincetSQLData('campaign', 'vcm_vd_sub_dvc_cnt_nd', where);
    setCampaignData(campaignRes);
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

    setCountry([...c]);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setSkuId([]);
    getSkuData();
  }, [productId, platform, subscribePeriod]);
  useEffect(() => {
    setEntrance([]);
    getEntranceData();
  }, [productId, platform]);
  useEffect(() => {
    setCampaign('');
    getCampaginData();
  }, [productId, platform, mediaSource]);

  return (
    <div>
      <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <div>
            <Row gutter={24}>
              <Col span={5}>
                <Select value={productId} onChange={setProductId} style={{ width: '100%' }} placeholder="产品">
                  {Object.keys(APP_PRODUCT_LIST).map(v => (
                    <Select.Option key={v} value={v}>
                      {APP_PRODUCT_LIST[v]}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select value={platform} onChange={setPlatform} style={{ width: '100%' }} placeholder="平台" allowClear>
                  <Select.Option key="" value="">
                    全部平台
                  </Select.Option>
                  {Object.keys(PLAFORM_LIST).map(v => (
                    <Select.Option key={v} value={v}>
                      {PLAFORM_LIST[v]}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  value={subscribePeriod}
                  onChange={setSubscribePeriod}
                  style={{ width: '100%' }}
                  placeholder="订阅周期"
                  allowClear
                >
                  <Select.Option key="" value="">
                    全部周期
                  </Select.Option>
                  {Object.keys(subscribePeriodEum).map(v => (
                    <Select.Option key={v} value={v}>
                      {subscribePeriodEum[v]}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  value={createTime}
                  onChange={setCreateTime}
                  style={{ width: '100%', marginBottom: 12 }}
                  placeholder="订单生成时间"
                  allowClear
                >
                  <Select.Option key="" value="">
                    全部时间
                  </Select.Option>
                  {Object.keys(createTimeEum).map(v => (
                    <Select.Option key={v} value={v}>
                      {createTimeEum[v]}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  value={mediaSource}
                  onChange={setMediaSource}
                  style={{ width: '100%', marginBottom: 12 }}
                  placeholder="来源"
                  allowClear
                  mode="multiple"
                  showSearch
                  // filterOption={(inputValue, option) => option.props.children.includes(inputValue)}
                >
                  {mediaSourceData.map(v => (
                    <Select.Option key={v.media_source} value={v.media_source}>
                      {v.media_source}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  value={campaign}
                  onChange={setCampaign}
                  style={{ width: '100%' }}
                  placeholder="campaign"
                  showSearch
                  // filterOption={(input, option) => option.key.includes(input)}
                  allowClear
                >
                  <Select.Option key="" value="">
                    全部campaign
                  </Select.Option>
                  {campaignData.map(v => (
                    <Select.Option key={v.campaign} value={v.campaign}>
                      <Tooltip title={v.campaign}>{v.campaign}</Tooltip>
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  value={entrance}
                  onChange={setEntrance}
                  style={{ width: '100%' }}
                  placeholder="入口"
                  allowClear
                  mode="multiple"
                  showSearch
                  // filterOption={(inputValue, option) => option.props.children.includes(inputValue)}
                >
                  {entranceData.map(v => (
                    <Select.Option key={v.entrance} value={v.entrance}>
                      {v.entrance}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  value={skuId}
                  onChange={setSkuId}
                  style={{ width: '100%' }}
                  placeholder="商品id"
                  allowClear
                  mode="multiple"
                  showSearch
                  // filterOption={(inputValue, option) => option.props.children.includes(inputValue)}
                >
                  {skuIdData.map(v => (
                    <Select.Option key={v} value={v}>
                      <Tooltip title={v}>{v}</Tooltip>
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={5}>
                <Select
                  value={country}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                  placeholder="国家"
                  mode="multiple"
                  showSearch
                  // filterOption={(inputValue, option) => option.props.children.includes(inputValue)}
                >
                  {countryData.map(v => (
                    <Select.Option key={v.country} value={v.country}>
                      {v.group_name || v.country}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  value={group}
                  onChange={setGroup}
                  style={{ width: '100%' }}
                  placeholder="分组纬度"
                  mode="multiple"
                  showSearch
                  filterOption={(inputValue, option) => option.props.children.includes(inputValue)}
                >
                  {Object.keys(groups).map(v => (
                    <Select.Option key={v} value={v}>
                      {groups[v]}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Select
                  value={ltvDay}
                  onChange={setLtvDay}
                  style={{ width: '100%' }}
                  placeholder="ltv 周期"
                  // mode="multiple"
                  showSearch
                >
                  <Select.Option key="30" value="30">ltv 周期(30)</Select.Option>
                  <Select.Option key="60" value="60">ltv 周期(60)</Select.Option>
                  <Select.Option key="90" value="90">ltv 周期(90)</Select.Option>
                  <Select.Option key="180" value="180">ltv 周期(180)</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row gutter={24} style={{ marginTop: 12 }}>
              <Col span={10}>
                <DatePicker.RangePicker
                  value={[startDate, endDate]}
                  onChange={(values) => {
                    setStartDate(values[0]);
                    setEndDate(values[1]);
                  }}
                  ranges={{
                    最近7天: [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
                    最近30天: [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
                    最近60天: [moment().subtract(60, 'days'), moment().subtract(1, 'days')],
                    最近90天: [moment().subtract(90, 'days'), moment().subtract(1, 'days')],
                  }}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  onClick={() => setSearch({
                    startDate,
                    endDate,
                    skuId,
                    productId,
                    platform,
                    subscribePeriod,
                    createTime,
                    campaign,
                    entrance,
                    mediaSource,
                    country,
                    group,
                    ltvDay,
                  })
                  }
                >
                  查询
                </Button>
              </Col>
            </Row>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
