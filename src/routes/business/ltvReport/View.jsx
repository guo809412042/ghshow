import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import Query from './components/Query';
import { DownLoadButton } from '../../common/DownLoadButton';
import { getData } from '../../../utils/request';
import { columns } from './const';
import { DataListSQL } from './components/sqlTemplate';

export default () => {
  const [search, setSearch] = useState({
    payway: 'GP',
    countries: [],
    channel: [],
    sku: [],
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    userType: [],
  });

  const [dataList, setDataList] = useState([]);

  const onSearch = (params = {}) => {
    setSearch(params);
  };

  // 获取数据列表
  const getList = async () => {
    const {
      payway, countries, channel, sku, startDate, endDate, userType,
    } = search;
    const fields = ['ds'];
    let where1 = '';
    let where = ` ds>='${startDate.format('YYYYMMDD')}' and ds<='${endDate.format('YYYYMMDD')}' `;
    const groupby = ['ds'];
    let activefield = '';
    let activegroup = '';
    let activeon = '';
    if (payway) {
      where += ` and platform='${payway}'`;
      fields.push(`'${payway}' AS platform`);
      activefield += ',platform';
      activegroup += ',platform ';
      activeon += ' and a.platform = c.platform';
    }

    if (countries.length === 0) {
      fields.push(' \'全部\' AS country_name');
    } else {
      where += ` and country_name in(${countries
        .flat()
        .map(v => `'${v}'`)
        .join(',')})`;
      fields.push('country_name');
      groupby.push('country_name');
      activefield += ',country_name';
      activegroup += ',country_name ';
      activeon += ' and a.country_name = c.country_name';
    }

    if (channel.length === 0) {
      fields.push(' \'全部\' AS media_source');
    } else {
      where += ` and media_source in(${channel.map(v => `'${v}'`).join(',')})`;
      fields.push('media_source');
      groupby.push('media_source');
      activefield += ',media_source';
      activegroup += ',media_source ';
      activeon += ' and a.media_source = c.media_source';
    }

    where1 = where;
    if (sku.length === 0) {
      fields.push(' \'全部\' AS sku_info');
    } else {
      where += ` and sku_info in(${sku.map(v => `'${v}'`).join(',')})`;
      fields.push('sku_info');
      groupby.push('sku_info');
    }

    if (userType.length === 0) {
      fields.push(' \'全部\' AS user_status');
    } else {
      where += ` and user_status in(${userType.map(v => `'${v}'`).join(',')})`;
      fields.push('user_status');
      groupby.push('user_status');
      activefield += ',user_status';
      activegroup += ',user_status ';
      activeon += ' and a.user_status = c.user_status';
    }

    const sql = DataListSQL.replace(/#activefield#/, activefield)
      .replace(/#activegroup#/, activegroup)
      .replace(/#activeon#/, activeon)
      .replace(/#fields#/, fields.join(','))
      .replace(/#where#/, ` WHERE ${where}`)
      .replace(/#where1#/, ` WHERE ${where1}`)
      .replace(/#groupby#/, ` GROUP BY ${groupby.join(',')}`);
    const res = await getData(sql);
    setDataList(res);
  };

  useEffect(() => {
    getList();
  }, [search]);

  return (
    <div>
      <Query onSearch={onSearch} />
      <DownLoadButton filename="ltv报表数据" data={dataList} columns={columns} />
      <Table
        dataSource={dataList}
        columns={columns}
        bordered
        // rowSelection={rowSelection}
        pagination={{
          hideOnSinglePage: true,
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};
