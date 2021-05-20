import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import Query from './Query';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { columns } from './const';
import { listSQL } from './sqlTemplate';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';


export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    platform: '1',
    country: [],
    appVersion: [],
    ttid: undefined,
    ttname: undefined,
    newUser: '1',
  });
  const [dataSource, setDataSource] = useState([]);
  const getList = async () => {
    const {
      platform, country, startDate, endDate, appVersion,
      ttid, ttname, newUser,
    } = search;
    let where = '';
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    if (country.length) {
      where += ` and country in (${country.map(v => `'${v}'`).join(',')})`;
    }
    if (appVersion.length) {
      where += ` and app_version in (${appVersion.map(v => `'${v}'`).join(',')})`;
    }
    if (ttid) {
      where += ` and ttid = '${ttid}'`;
    }
    if (ttname) {
      where += ` and name = '${ttname}'`;
    }
    if (newUser) {
      where += ` and new_user = '${newUser}'`;
    }
    const res = await getData(createSqlWhere({
      sql: listSQL,
      startDate,
      endDate,
      where,
    }));
    const data = res.map(v => ({
      ...v,
      'coil_60_dvc_cnt_1d/pay_dvc_cnt_1d': getNumber(v.coil_60_dvc_cnt_1d, v.pay_dvc_cnt_1d),
      'coil_200_dvc_cnt_1d/pay_dvc_cnt_1d': getNumber(v.coil_200_dvc_cnt_1d, v.pay_dvc_cnt_1d),
      'month_pay_dvc_cnt_1d/pay_dvc_cnt_1d': getNumber(v.month_pay_dvc_cnt_1d, v.pay_dvc_cnt_1d),
      'year_pay_dvc_cnt_1d/pay_dvc_cnt_1d': getNumber(v.year_pay_dvc_cnt_1d, v.pay_dvc_cnt_1d),
      'pay_dvc_cnt_1d/view_dvc_cnt_1d': getNumber(v.pay_dvc_cnt_1d, v.view_dvc_cnt_1d),
      'temp_make_dvc_cnt_1d/view_dvc_cnt_1d': getNumber(v.temp_make_dvc_cnt_1d, v.view_dvc_cnt_1d),
      'make_dvc_cnt_1d/view_dvc_cnt_1d': getNumber(v.make_dvc_cnt_1d, v.view_dvc_cnt_1d),
      'share_dvc_cnt_1d/make_dvc_cnt_1d': getNumber(v.share_dvc_cnt_1d, v.make_dvc_cnt_1d),
      'make_fail_dvc_cnt_1d/make_dvc_cnt_1d': getNumber(v.make_fail_dvc_cnt_1d, v.make_dvc_cnt_1d),
      'del_dvc_cnt_1d/make_dvc_cnt_1d': getNumber(v.del_dvc_cnt_1d, v.make_dvc_cnt_1d),
    }));
    setDataSource(data);
  };
  useEffect(() => {
    getList();
  }, [search]);
  return <div>
    <Query
      search={search}
      setSearch={setSearch}
    />
    <DownLoadButton
      filename="素材付费"
      data={dataSource}
      columns={columns}
    />
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      style={{ marginTop: 10 }}
      scroll={{ x: columns.length * 120 }}
      rowKey="ttid"
    />
  </div>;
};
