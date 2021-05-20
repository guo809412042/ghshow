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
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const getList = async () => {
    setLoading(true);
    let where = '';
    const {
      countryOperator,
      country,
      platform,
      appVersionOperator,
      appVersion,
      startDate,
      endDate,
      source,
      uitype,
      newUser,
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
    if (source) {
      where += ` and source = '${source}'`;
    }
    if (uitype) {
      where += ` and uitype = '${uitype}'`;
    }

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
        'ent_sub_dvc_cnt/app_start_dvc_cnt': getNumber(v.ent_sub_dvc_cnt, v.app_start_dvc_cnt),
        'click_dvc_cnt/ent_sub_dvc_cnt': getNumber(v.click_dvc_cnt, v.ent_sub_dvc_cnt),
        'buy_dvc_cnt/click_dvc_cnt': getNumber(v.buy_dvc_cnt, v.click_dvc_cnt),
        'buy_dvc_cnt/ent_sub_dvc_cnt': getNumber(v.buy_dvc_cnt, v.ent_sub_dvc_cnt),
        'buy_dvc_cnt/app_start_dvc_cnt': getNumber(v.buy_dvc_cnt, v.app_start_dvc_cnt),
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
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="ds"
        style={{ marginTop: 10 }}
      />
    </div>
  );
};
