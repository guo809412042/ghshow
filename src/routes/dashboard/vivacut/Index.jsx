/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Row, Col, Select, Spin, Radio, Icon,
} from 'antd';
import moment from 'moment';
import QueryIndex from '../../components/Query/Index';
import { cardData } from './constant';
import CardView from './components/CardView';
import CardBox from '../../home/common/CardBox';
import { expResoCntSQL, activeSQL } from './sqlTempalte';
import { createSqlWhere, versionNumber } from '../../../utils/utils';
import { getData } from '../../../utils/request';
import { pieChartRender } from '../../common/chartFunc/pieChartRender';
import { DownLoadButton } from '../../common/DownLoadButton';
import { ChartRender, areaChartRender, chartBarRender } from '../../common/drawChart';

export default () => {
  const [searchWhere, setSearchWhere] = useState({
    startDate: moment().subtract(31, 'days'),
    endDate: moment().subtract(1, 'days'),
  });
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('1');
  const [channelData, setChannelData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const getChannelData = async () => {
    const sql = `SELECT DISTINCT(channel)
    FROM vcm_vivacut_new_usr_cnt_1d_ow
  `;
    const res = await getData(sql);
    const data = res.map(v => ({
      key: v.channel || 'null',
      value: v.channel || 'null',
    }));
    setChannelData(data);
  };
  const onSearch = async (values) => {
    values.startDate = values.startDate || searchWhere.startDate;
    values.endDate = values.endDate || searchWhere.endDate;
    setSearchWhere(values);
  };

  const getPieData = async () => {
    let where = '';
    if (searchWhere.selectCountry && searchWhere.countryOperation) {
      where += ` and country ${searchWhere.countryOperation} ${searchWhere.selectCountry}`;
    }
    if (searchWhere.appVersionOperation && searchWhere.selectAppVersion) {
      where += ` and app_version ${searchWhere.appVersionOperation} '${versionNumber(searchWhere.selectAppVersion)}'`;
    }
    where += ` and platform = ${platform}`;
    const fetchSQL = createSqlWhere({
      sql: expResoCntSQL,
      startDate: searchWhere.startDate,
      endDate: searchWhere.endDate,
      where,
    });
    const res = await getData(fetchSQL);
    const data = res.map(v => ({
      type: v.resolution,
      value: v.exp_cnt_1d,
    }));
    setDataSource(data);
    pieChartRender(data, 'chart-exp_cnt_1d');
  };
  const getActiveData = async () => {
    setLoading(true);
    let where = '';
    if (searchWhere.selectCountry && searchWhere.countryOperation) {
      where += ` and country ${searchWhere.countryOperation} ${searchWhere.selectCountry}`;
    }
    if (searchWhere.appVersionOperation && searchWhere.selectAppVersion) {
      where += ` and app_version ${searchWhere.appVersionOperation} '${versionNumber(searchWhere.selectAppVersion)}'`;
    }
    if (searchWhere.channelOperation && searchWhere.selectChannel) {
      if (searchWhere.selectChannel === 'null') {
        where += ` and channel ${searchWhere.channelOperation === '=' ? ' is ' : ' is not '} ${
          searchWhere.selectChannel
        }`;
      } else {
        where += ` and channel ${searchWhere.channelOperation} '${searchWhere.selectChannel}'`;
      }
    }
    where += ` and platform = ${platform}`;
    const fetchSQL = createSqlWhere({
      sql: activeSQL,
      startDate: searchWhere.startDate,
      endDate: searchWhere.endDate,
      where,
    });
    const res = await getData(fetchSQL);
    const chartData = [];
    res.forEach((i) => {
      chartData.push({
        type: '整体',
        day: moment(i.bizdate).format('YYYY-MM-DD'),
        value: i.dau,
      });
      chartData.push({
        type: '新用户',
        day: moment(i.bizdate).format('YYYY-MM-DD'),
        value: i.dau_new_1d,
      });
      chartData.push({
        type: '老用户',
        day: moment(i.bizdate).format('YYYY-MM-DD'),
        value: i.dau_old_1d,
      });
    });
    setActiveData(chartData);
    setLoading(false);
    if (chartType === 'line') {
      ChartRender(chartData, 'active');
    } else if (chartType === 'bar') {
      chartBarRender(chartData, 'chart-active');
    } else {
      areaChartRender(chartData, 'chart-active');
    }
  };
  useEffect(() => {
    getPieData();
  }, [searchWhere, platform]);
  useEffect(() => {
    getActiveData();
  }, [searchWhere, platform, chartType]);
  useEffect(() => {
    getChannelData();
  }, []);
  return (
    <div>
      <Select style={{ marginBottom: 8, width: 120 }} value={platform} onChange={setPlatform}>
        <Select.Option key="1" value="1">
          Android
        </Select.Option>
        <Select.Option key="2" value="2">
          iOS
        </Select.Option>
      </Select>
      <QueryIndex ghPlatform="15" onSearch={onSearch} product={platform} channelData={channelData} />

      <Row gutter={24} style={{ marginTop: 10 }}>
        {cardData.map(v => (
          <CardView key={v.title} info={v} searchWhere={searchWhere} platform={platform} />
        ))}
        <Col span={12}>
          <CardBox title="导出开始时各分辨率占比">
            <DownLoadButton
              filename="导出开始时各分辨率占比"
              data={dataSource}
              columns={[{ key: 'value', title: '占比' }, { key: 'type', title: '类型' }]}
            />
            <div id="chart-exp_cnt_1d" />
          </CardBox>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <CardBox title="用户活跃趋势">
            <Spin spinning={loading}>
              <DownLoadButton
                filename="用户活跃趋势"
                data={activeData}
                columns={[
                  { key: 'day', title: '日期' },
                  { key: 'value', title: '活跃数' },
                  { key: 'type', title: '用户类型' },
                ]}
              />
              <Radio.Group value={chartType} onChange={e => setChartType(e.target.value)} style={{ float: 'right' }}>
                <Radio.Button value="line" key="line">
                  <Icon type="line-chart" />
                </Radio.Button>
                <Radio.Button value="area" key="area">
                  <Icon type="area-chart" />
                </Radio.Button>
                <Radio.Button value="bar" key="bar">
                  <Icon type="bar-chart" />
                </Radio.Button>
              </Radio.Group>
              <div id="chart-active" />
            </Spin>
          </CardBox>
        </Col>
      </Row>
    </div>
  );
};
