/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Col, Spin, Select } from 'antd';
import moment from 'moment';
import CardBox from '../../../home/common/CardBox';
import {
  createSqlWhere, versionNumber, getNumber, selectAttr,
} from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import { ChartRender } from '../../../common/drawChart';
import { DownLoadButton } from '../../../common/DownLoadButton';

export default ({
  searchWhere,
  info: {
    title, sql, keys, type, value, noType, denominator, molecular, suffix, nochannel, selectList = [],
  },
  platform,
}) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectValue, setSelectValue] = useState('');
  const fecthData = async () => {
    setLoading(true);
    let where = '';
    if (searchWhere.channelOperation && searchWhere.selectChannel && !nochannel) {
      if (searchWhere.selectChannel === 'null') {
        where += ` and channel ${searchWhere.channelOperation === '=' ? ' is ' : ' is not '} ${searchWhere.selectChannel}`;
      } else {
        where += ` and channel ${searchWhere.channelOperation} '${searchWhere.selectChannel}'`;
      }
    }
    const countryName = title === '每日累计用户量' ? 'country_code' : 'country';
    if (searchWhere.selectCountry && searchWhere.countryOperation) {
      where += ` and ${countryName} ${searchWhere.countryOperation} ${searchWhere.selectCountry}`;
    }
    if (searchWhere.appVersionOperation && searchWhere.selectAppVersion) {
      where += ` and app_version ${searchWhere.appVersionOperation} '${versionNumber(searchWhere.selectAppVersion)}'`;
    }
    where += ` and platform =  ${platform} `;
    if (selectValue && selectList.length) {
      where += ` and resolution = '${selectValue}' `;
    }
    if (!selectValue && selectList.length) {
      where += ' and resolution is not null ';
    }
    const fetchSQL = createSqlWhere({
      sql,
      startDate: searchWhere.startDate,
      endDate: searchWhere.endDate,
      where,
      denominator,
      molecular,
    });
    const res = await getData(fetchSQL);
    let chartData = [];
    if (noType) {
      if (title === '导出崩溃率') {
        chartData = res.map((i) => {
          const exp_start_cnt_1d = i.exp_start_cnt_1d || 0;
          const exp_suced_cnt_1d = i.exp_suced_cnt_1d || 0;
          const exp_failed_cnt_1d = i.exp_failed_cnt_1d || 0;
          const exp_cancel_cnt_1d = i.exp_cancel_cnt_1d || 0;
          if (!exp_start_cnt_1d) {
            return {
              value: 0,
              day: moment(i.ds.toString()).format('YYYY-MM-DD'),
              type: title,
            };
          }
          return {
            value: Number(
              (
                ((exp_start_cnt_1d - exp_suced_cnt_1d - exp_failed_cnt_1d - exp_cancel_cnt_1d) * 100)
                / exp_start_cnt_1d
              ).toFixed(2),
            ),
            day: moment(i.ds.toString()).format('YYYY-MM-DD'),
            type: title,
          };
        });
      } else {
        chartData = res.map(i => ({
          value: i[value],
          day: moment(i.ds.toString()).format('YYYY-MM-DD'),
          type: title,
        }));
      }
    } else if (denominator) {
      for (const i of res) {
        if (keys) {
          const keyList = Object.keys(keys);
          if (keyList.includes(i[type].toString())) {
            chartData.push({
              value: getNumber(i[denominator], i[molecular], suffix),
              day: moment(i.ds.toString()).format('YYYY-MM-DD'),
              type: keys[i[type]],
            });
          }
        } else {
          chartData.push({
            value: getNumber(i[denominator], i[molecular], suffix),
            day: moment(i.ds.toString()).format('YYYY-MM-DD'),
            type: title,
          });
        }
      }
    } else {
      const keyList = Object.keys(keys);
      for (const i of res) {
        if (keyList.includes(i[type].toString())) {
          chartData.push({
            value: Number(i[value]),
            day: moment(i.ds.toString()).format('YYYY-MM-DD'),
            type: keys[i[type]],
          });
        }
      }
    }
    setDataSource(chartData);
    ChartRender(chartData, `${type}-${value}`);
    setLoading(false);
  };
  useEffect(() => {
    fecthData();
  }, [searchWhere, platform, selectValue]);
  return (
    <Col span={12}>
      <CardBox title={title}>
        <Spin spinning={loading}>
          <DownLoadButton
            filename={title}
            data={dataSource}
            columns={[
              { key: 'day', title: 'day' },
              { key: 'value', title: 'value' },
              { key: 'type', title: 'type' },
            ]}
          />
          {selectList.length ? <Select
            {...selectAttr}
            value={selectValue}
            onChange={setSelectValue}
          >
            {<Select.Option key="" value="">整体</Select.Option>}
            {selectList.map(v => <Select.Option key={v.value} value={v.value}>{v.label}</Select.Option>)}
          </Select> : ''}
          <div id={`chart-${type}-${value}`} />
        </Spin>
      </CardBox>
    </Col>
  );
};
