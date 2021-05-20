/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import { Radio, Table, Select } from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { andColumns, andColumns1 } from '../const';
import {
  createSqlWhere, getNumber, dateFormat, getFixed,
} from '../../../../utils/utils';
import { andSQL, andMonthSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';

export default ({ search }) => {
  const [dayType, setDayType] = useState('1');
  const [type, setType] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [group, setGroup] = useState(['data_time']);
  const [columns, setColumns] = useState([]);

  const getColumns = () => {
    let prefix = [];
    let orderby = 'data_time';
    if (group.length === 0 || group.length === 2) {
      prefix = [{ dataIndex: 'data_time', key: 'data_time', title: '日期范围' },
        { dataIndex: 'country_code', key: 'country_code', title: '国家' },
      ];
      orderby = 'data_time,and_new_sub';
    } else if (group[0] === 'data_time') {
      prefix = [{ dataIndex: 'data_time', key: 'data_time', title: '日期范围' }];
      orderby = 'data_time';
    } else if (group[0] === 'country_code') {
      prefix = [{ dataIndex: 'country_code', key: 'country_code', title: '国家' }];
      orderby = 'and_new_sub';
    }
    setColumns(type === '1' ? prefix.concat(andColumns1) : prefix.concat(andColumns1.concat(andColumns)));
    return orderby;
  };

  const getSQL = async (sql, startDate, endDate) => {
    let where = '';
    if (search.appProduct.length) {
      where += ` and app_product in (${search.appProduct.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.countryCode.length) {
      where += ` and country_code ${search.conutryOperator} (${search.countryCode.map(v => `'${v}'`).join(',')}) `;
    }

    let fetchSQL = '';
    // 日
    if (dayType === '1') {
      fetchSQL = createSqlWhere({
        sql,
        startDate,
        endDate,
        type,
        where,
        group: group.length ? group.join(',') : 'data_time,country_code',
        order: getColumns(),
      });
    } else { // 月
      fetchSQL = createSqlWhere({
        sql,
        startDate,
        endDate,
        type,
        where,
      });
      getColumns();
      let innerFields = '';
      let outerFields = '';
      let groupMonth = '';
      let order = '';
      // 全选或不选，按日期+国家分组
      if (group.length === 0 || group.length === 2) {
        innerFields = 'left(data_time,6) as data_time,country_code';
        outerFields = 'data_time,country_code';
        groupMonth = 'left(data_time,6),country_code';
        order = 'data_time,and_new_sub';
      } else if (group[0] === 'data_time') {
        // 只选日期
        innerFields = 'left(data_time,6) as data_time';
        outerFields = 'data_time';
        groupMonth = 'left(data_time,6)';
        order = 'data_time,and_new_sub';
      } else if (group[0] === 'country_code') {
        // 只选国家
        innerFields = 'country_code';
        outerFields = 'country_code';
        groupMonth = 'country_code';
        order = 'and_new_sub';
      }
      fetchSQL = fetchSQL
        .replace(/#outerFields#/g, outerFields)
        .replace(/#innerFields#/g, innerFields)
        .replace(/#groupby#/g, groupMonth)
        .replace(/#orderby#/g, order);
    }

    const res = await getData(fetchSQL);
    const data = res.map(v => ({
      ...v,
      'and_new_sub_y_total/and_add_user_total': getNumber(v.and_new_sub_y_total, v.and_add_user_total),
      'and_new_sub_m_total/and_add_user_total': getNumber(v.and_new_sub_m_total, v.and_add_user_total),
      'and_nosub_new_y_total/and_add_user_total': getNumber(v.and_nosub_new_y_total, v.and_add_user_total),
      'and_nosub_new_m_total/and_add_user_total': getNumber(v.and_nosub_new_m_total, v.and_add_user_total),
      // and_new_sub: getFixed(v.and_new_sub_y_total * 1 + v.and_new_sub_m_total * 1 + v.and_new_sub_oth_total * 1),
      and_nosub_new: getFixed(v.and_nosub_new_y_total * 1 + v.and_nosub_new_m_total * 1 + v.and_nosub_new_oth_total * 1),
      and_old_sub: getFixed(v.and_old_sub_y_total * 1 + v.and_old_sub_m_total * 1 + v.and_old_sub_oth_total * 1),
      and_nosub_old: getFixed(v.and_nosub_old_y_total * 1 + v.and_nosub_old_m_total * 1 + v.and_nosub_old_oth_total * 1),
    }));
    return data;
  };

  const getAndGPData = async () => {
    if (dayType === '1') {
      const data = await getSQL(andSQL, search.startDate, search.endDate);
      setDataSource(data);
    } else {
      const data = await getSQL(andMonthSQL, search.startDate, search.endDate);
      setDataSource(data);
    }
  };

  useEffect(() => {
    getColumns();
    getAndGPData();
  }, [dayType, type, search, group]);
  return <div>
    <span
      style={{
        color: '#7d8c95',
        fontSize: 16,
        marginRight: 10,
      }}>国内安卓销售指标</span>
    <Radio.Group value={dayType} onChange={e => setDayType(e.target.value)}>
      <Radio.Button value="1" key="1">
          日
      </Radio.Button>
      <Radio.Button value="2" key="2">
          月
      </Radio.Button>
    </Radio.Group>
    <Radio.Group value={type} style={{ margin: 20 }} onChange={e => setType(e.target.value)}>
      <Radio.Button value="1" key="1">
          金额
      </Radio.Button>
      <Radio.Button value="2" key="2">
          人数
      </Radio.Button>
    </Radio.Group>
    <Select key="group" mode="multiple" allowClear value={group} onChange={setGroup} style={{ width: 120, marginRight: 20 }}>
      <Select.Option key="data_time" value="data_time">
        日期
      </Select.Option>
      <Select.Option key="country_code" value="country_code">
        国家
      </Select.Option>
      {/* <Select.Option key="data_time,country_code" value="data_time,country_code">
        日期+国家
      </Select.Option> */}
    </Select>
    <DownLoadButton
      filename="国内安卓销售指标-官方数据"
      columns={columns}
      data={dataSource}
    />
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      scroll={{ x: 2200 }}
    />
  </div>;
};
