/* eslint-disable react/prop-types */
/**
 * @File: Query.jsx
 * @Author: Zero
 * @Date: 2020/05/12
 * @Copyright(c) QuVideo F2E Team
 * @Email: zerong.peng@quvideo.com
 * @comment: 查询组件
 */

import React, { useState, useEffect } from 'react';
import { Select, Radio } from 'antd';
import _ from 'lodash';
import { createSqlWhere } from '../../../utils/utils';
import { COUNTRY_NAME_COMMON_LIST } from '../const';
import { DownLoadButton } from '../../common/DownLoadButton';
import { getData } from '../../../utils/request';
import { sourceNameSQL } from './sqlTemplate';
import styles from '../styles/index.less';
import MyDatePicker from '../../components/MyDatePicker';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Query = ({
  onSearch,
  noIos = false,
  noAndroid = false,
  compign = '',
  search,
  columns,
  chartData,
  changeSpan,
}) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [platform, setPlatform] = useState(search.platform);
  const [country, setCountry] = useState(search.country);
  const [type, setType] = useState(search.type);
  const [sourceList, setSourceList] = useState([]);
  const [source, setSource] = useState(search.source);
  const [countrys, setCountrys] = useState([]);

  const getCountryList = async () => {
    const sql = `select distinct(country) from rpt_viva_att_act_nd where country not
     in ('第一梯度','第二梯度','第三梯度','全部')`;
    const res = await getData(sql);
    setCountrys(res);
  };
  useEffect(() => {
    onSearch({
      startDate,
      endDate,
      platform,
      country,
      source,
      type,
      compign,
    });
  }, [startDate, endDate, platform, country, type, compign, source]);

  const getSourceList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: sourceNameSQL,
      }),
    );
    setSourceList(res || []);
  };

  useEffect(() => {
    getCountryList();
    getSourceList();
  }, []);

  return (
    <div className={styles.queryWrapper}>
      {/* <Collapse defaultActiveKey={['1']}> */}
      {/* <Collapse.Panel key="1" header="查询"> */}
      <Select
        className={`${styles.queryItem} ${styles.platformLabel}`}
        placeholder="请选择平台"
        value={platform}
        onChange={e => setPlatform(e)}
      >
        <Select.Option key="" value="">
          全部
        </Select.Option>
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
      <RadioGroup
        buttonStyle="solid"
        className={`${styles.queryItem} ${styles.typeLabel}`}
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <RadioButton key="country" value="country">
          地区
        </RadioButton>
        <RadioButton key="media_source" value="media_source">
          来源
        </RadioButton>
      </RadioGroup>
      <Select
        allowClear
        value={country}
        className={`${styles.queryItem} ${styles.countryLabel}`}
        placeholder="请选择地区"
        // value={country}
        onChange={setCountry}
        mode="multiple"
      >
        {_.map(COUNTRY_NAME_COMMON_LIST, item => (
          <Select.Option key={item.country_code} value={item.country_code}>
            {item.country_name}
          </Select.Option>
        ))}
        {countrys.map(v => (
          <Select.Option key={v.country} value={v.country}>
            {v.country}
          </Select.Option>
        ))}
      </Select>
      <Select
        allowClear
        showSearch
        className={`${styles.queryItem} ${styles.sourceLabel}`}
        placeHolder="请选择来源"
        value={source}
        onChange={setSource}
        mode="multiple"
      >
        <Select.Option key="" value="">
          全部来源
        </Select.Option>
        {sourceList.map(source => (
          <Select.Option key={source.source_name} value={source.source_name}>
            {source.source_name}
          </Select.Option>
        ))}
      </Select>
      <MyDatePicker
        className={`${styles.queryItem} ${styles.dateLabel}`}
        value={[startDate, endDate]}
        onChange={(values) => {
          setStartDate(values[0]);
          setEndDate(values[1]);
        }}
      />
      <RadioGroup
        buttonStyle="solid"
        className={`${styles.queryItem} 
      ${styles.spanLabel}`}
        onChange={e => changeSpan(e.target.value)}
        defaultValue="day"
      >
        <RadioButton key="day" value="day">
          日
        </RadioButton>
        <RadioButton key="week" value="week">
          周
        </RadioButton>
        <RadioButton key="month" value="month">
          月
        </RadioButton>
      </RadioGroup>
      <DownLoadButton filename="归因-活跃数据" columns={columns} data={chartData} />
    </div>
  );
};

export default Query;
