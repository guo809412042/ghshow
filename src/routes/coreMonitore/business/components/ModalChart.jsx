/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Modal, Collapse, DatePicker, Select, Button, Tag, message, Spin,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { selectAttr, getCountryAndAppVersionAndChannel, createSqlWhere } from '../../../../utils/utils';
import { numberOptions, literalOptions } from '../../../common/constants';
import { listDetailSQL } from './sqlTemplate';
import { getHoloData } from '../../../../utils/request';
import { ChartRender } from './ChartRender';

export default ({
  visible, setVisible, business = 'IAP', productId = '2', product = 'viva',
}) => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [platform, setPlatform] = useState('android');
  const [countryOperation, setCountryOperation] = useState('=');
  const [appVersionOperation, setAppVersionOperation] = useState('=');
  const [selectCountry, setSelectCountry] = useState(undefined);
  const [selectAppVersion, setSelectAppVersion] = useState(undefined);
  const [countryList, setCountryList] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const getCountryAndAppVersion = async () => {
    const { countryList, appVersionList } = await getCountryAndAppVersionAndChannel(platform, productId);
    setCountryList(countryList);
    setAppVersionList(appVersionList);
  };
  const [tags, setTags] = useState(['=||=']);
  const handleSearch = () => {
    const country = countryOperation + (!selectCountry ? '' : `'${selectCountry}'`);
    const appVersion = appVersionOperation + (!selectAppVersion ? '' : `'${selectAppVersion}'`);
    const values = `${country}||${appVersion}`;
    if (tags.includes(values)) {
      message.warn('该筛选条件已经存在');
    } else {
      setTags(tags.concat([values]));
    }
  };
  const dismiss = (x) => {
    const tag = tags.filter(v => x !== v);
    setTags(tag);
  };
  const getSQL = (where) => {
    const sql = createSqlWhere({
      sql: listDetailSQL,
      startDate: `${moment(currentDate).format('YYYY-MM-DD')} 00:00:00`,
      endDate: `${moment(currentDate).format('YYYY-MM-DD')} 23:59:59`,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      product,
      where,
      platform,
      type: business,
    });
    return sql;
  };
  const getList = async () => {
    setLoading(true);
    const chartData = [];
    for (const tag of tags) {
      let where = '';
      if (tag === '=||=') {
        where = '';
      } else {
        const country = tag.split('||')[0] === '=' ? '' : ` and country ${tag.split('||')[0]}`;
        const appVersion = tag.split('||')[1] === '=' ? '' : ` and app_version ${tag.split('||')[1]}`;
        where = country + appVersion;
      }
      const sql = getSQL(where);
      const list = await getHoloData(sql);
      list.forEach((v) => {
        const arr = {
          type: tag,
          value: Number((Number(v.ratio) * 100).toFixed(2)),
          day: v.date_time,
          results: v.results,
          error_code: v.error_code,
        };
        chartData.push(arr);
      });
    }
    ChartRender(chartData, `${business}-chart`, tags.length);
    setLoading(false);
  };
  useEffect(() => {
    getCountryAndAppVersion();
  }, [platform, productId]);
  useEffect(() => {
    if (visible) {
      getList();
    }
  }, [visible, platform, productId, business, currentDate, tags]);
  return (
    <Modal
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setTags(['=||=']);
        setPlatform('1');
        setSelectCountry(undefined);
        setSelectAppVersion(undefined);
        setCountryOperation('=');
        setAppVersionOperation('=');
      }}
      onOk={() => {
        setVisible(false);
        setVisible(false);
        setTags(['=||=']);
        setPlatform('1');
        setSelectCountry(undefined);
        setSelectAppVersion(undefined);
        setCountryOperation('=');
        setAppVersionOperation('=');
      }}
      title={business}
      width={900}
    >
      <DatePicker defaultValue={currentDate} format="YYYY-MM-DD" onChange={setCurrentDate} />
      <Select style={{ margin: 10, width: 120 }} value={platform} onChange={setPlatform}>
        <Select.Option key="android" value="android">
          Android
        </Select.Option>
        <Select.Option key="ios" value="ios">
          iOS
        </Select.Option>
      </Select>
      <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select {...selectAttr} value={countryOperation} onChange={setCountryOperation}>
            {literalOptions}
          </Select>
          <Select {...selectAttr} placeholder="地区" value={selectCountry} onChange={setSelectCountry}>
            {_.map(countryList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Select {...selectAttr} value={appVersionOperation} onChange={setAppVersionOperation}>
            {numberOptions}
          </Select>
          <Select placeholder="版本" {...selectAttr} value={selectAppVersion} onChange={setSelectAppVersion}>
            {_.map(appVersionList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Button onClick={handleSearch} type="primary">
            添加
          </Button>
        </Collapse.Panel>
      </Collapse>
      <div style={{ margin: '10px 0' }}>
        {tags.map(v => (
          <Tag closable key={v} onClose={() => dismiss(v)} value={v}>
            {v}
          </Tag>
        ))}
      </div>
      <Spin spinning={loading}>
        <div id={`${business}-chart`} />
      </Spin>
    </Modal>
  );
};
