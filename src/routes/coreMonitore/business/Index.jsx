/* eslint-disable camelcase */
/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  DatePicker, Select, Tag, message, Spin, Col, Row, Card,
} from 'antd';
import Query from './components/Query';
import { createSqlWhere } from '../../../utils/utils';
import { listSQL } from './components/sqlTemplate';
import { getHoloData } from '../../../utils/request';
import { ChartRender } from './components/ChartRender';

const dateFormat = 'YYYY-MM-DD';

export default (props) => {
  let product = window.location.hash.split('/').pop();
  let product_id = '2';
  switch (product) {
    case 'tempo':
      product_id = '10';
      break;
    case 'vivacut':
      product_id = '15';
      break;
    case 'vid':
      product_id = '6';
      break;
    case 'sp':
      product = 'slideplus';
      product_id = '3';
      break;
    case 'vivamini':
      product_id = '16';
      break;
    default:
      product = 'viva';
      product_id = '2';
  }
  const [search] = useState({
    countryOperation: '=',
    appVersionOperation: '=',
    selectCountry: undefined,
    selectAppVersion: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([
    `${search.countryOperation + (search.selectCountry || '')}||${
      search.appVersionOperation
    }${search.selectAppVersion || ''}`,
  ]);
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [platform, setPlatform] = useState('android');
  const onSearch = (values) => {
    if (tags.includes(values)) {
      message.warn('该筛选条件已经存在');
    } else {
      setTags(tags.concat([values]));
    }
  };
  const getSQL = (type, where) => {
    const sql = createSqlWhere({
      sql: listSQL,
      startDate: `${moment(currentDate).format('YYYY-MM-DD')} 00:00:00`,
      endDate: `${moment(currentDate).format('YYYY-MM-DD')} 23:59:59`,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      product,
      where,
      platform,
    });
    return sql;
  };
  const dismiss = (x) => {
    const tag = tags.filter(v => x !== v);
    setTags(tag);
  };
  const getFecthData = async () => {
    setLoading(true);
    const IAPData = [];
    const UserLoginData = [];
    const ExportData = [];
    const UploadData = [];
    for (const tag of tags) {
      let where = '';
      if (tag === '=||=') {
        where = '';
      } else {
        const country = tag.split('||')[0] === '=' ? '' : ` and country ${tag.split('||')[0]}`;
        const appVersion = tag.split('||')[1] === '=' ? '' : ` and app_version ${tag.split('||')[1]}`;
        where = country + appVersion;
      }
      const sql = getSQL(tag, where);
      const list = await getHoloData(sql);
      list.forEach((v) => {
        const arr = {
          type: tag,
          value: Number((Number(v.ratio) * 100).toFixed(2)),
          day: v.date_time,
          results: v.results,
          error_code: v.error_code,
        };
        if (v.business === 'IAP') {
          IAPData.push(arr);
        } else if (v.business === 'UserLogin') {
          UserLoginData.push(arr);
        } else if (v.business === 'Export') {
          ExportData.push(arr);
        } else if (v.business === 'Upload') {
          UploadData.push(arr);
        }
      });
    }
    ChartRender(IAPData, 'chart-IAP', tags.length);
    ChartRender(UserLoginData, 'chart-UserLogin', tags.length);
    ChartRender(ExportData, 'chart-Export', tags.length);
    ChartRender(UploadData, 'chart-Upload', tags.length);
    setLoading(false);
  };
  useEffect(() => {
    getFecthData();
  }, [tags, currentDate, platform]);
  return (
    <div>
      <div>
        <DatePicker
          defaultValue={currentDate}
          format={dateFormat}
          onChange={setCurrentDate}
          style={{ marginBottom: 20 }}
        />
        <Select style={{ margin: '0 20px', width: 120 }} value={platform} onChange={setPlatform}>
          <Select.Option key="android" value="android">
            Android
          </Select.Option>
          <Select.Option key="ios" value="ios">
            iOS
          </Select.Option>
        </Select>
      </div>
      <Query search={search} onSearch={onSearch} product_id={product_id} platform={platform} />
      <div style={{ margin: '10px 0' }}>
        {tags.map(v => (
          <Tag closable key={v} onClose={() => dismiss(v)} value={v}>
            {v}
          </Tag>
        ))}
      </div>
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={12}>
            <Card title="IAP">
              <div id="chart-IAP" />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Export">
              <div id="chart-Export" />
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={12}>
            <Card title="Upload">
              <div id="chart-Upload" />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="UserLogin">
              <div id="chart-UserLogin" />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};
