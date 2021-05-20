import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import Query from './components/Query';
import { getData } from '../../../utils/request';
import { createSqlWhere, getNumber } from '../../../utils/utils';
import { listSQL } from './sqlTemplate';
import { columns } from './const';
import { DownLoadButton } from '../../common/DownLoadButton';

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    platform: '2',
    countryOperator: '=',
    appVersionOperator: '=',
    newUser: '1',
  });
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const getList = async () => {
    setLoading(true);
    let where = '';
    const {
      countryOperator, country, platform, appVersionOperator, appVersion, newUser, startDate, endDate,
    } = search;
    where += ` and platform = '${platform}'`;
    if (newUser) {
      where += ` and new_user = '${newUser}'`;
    }
    if (countryOperator && country) {
      where += ` and country ${countryOperator} '${country}'`;
    }
    if (appVersionOperator && appVersion) {
      where += ` and appKey ${appVersionOperator} '${appVersion}'`;
    }
    const otherWhere = where;
    const res = await getData(
      createSqlWhere({
        sql: listSQL,
        startDate,
        endDate,
        where,
        otherWhere,
      }),
    );
    setDataSource(
      res.map(v => ({
        ...v,
        'click_dvc_cnt/m_view_dvc_cnt': getNumber(v.click_dvc_cnt, v.m_view_dvc_cnt),
        'cover_view_dvc_cnt/click_dvc_cnt': getNumber(v.cover_view_dvc_cnt, v.click_dvc_cnt),
        'make_dvc_cnt/cover_view_dvc_cnt': getNumber(v.make_dvc_cnt, v.cover_view_dvc_cnt),
        'make_succ_dvc_cnt/make_dvc_cnt': getNumber(v.make_succ_dvc_cnt, v.make_dvc_cnt),
        'save_dvc_cnt/make_succ_dvc_cnt': getNumber(v.save_dvc_cnt, v.make_succ_dvc_cnt),
        'share_dvc_cnt/save_dvc_cnt': getNumber(v.share_dvc_cnt, v.save_dvc_cnt),
        'm_edit_make_dvc_cnt/m_edit_view_dvc_cnt': getNumber(v.m_edit_make_dvc_cnt, v.m_edit_view_dvc_cnt),
      })),
    );
    setLoading(false);
  };
  useEffect(() => {
    getList();
  }, [search]);
  return (
    <div>
      <Query search={search} setSearch={setSearch} />
      <DownLoadButton filename="整体模板制作路径" data={dataSource} columns={columns} />
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        rowKey="ds"
        style={{ marginTop: 10 }}
        scroll={{ x: columns.length * 120 }}
        loading={loading}
      />
    </div>
  );
};
