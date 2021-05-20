/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import Query from './components/Query';
import { columns } from './constants';
import { getData } from '../../../../../utils/request';
import { createSqlWhere, getDistincetSQLData } from '../../../../../utils/utils';
import { DownLoadButton } from '../../../../common/DownLoadButton';

export default () => {
  const product = 51;

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchDetail, setSearchDetail] = useState({
    showType: '1',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(0, 'days'),
    new_user: '',
    platform: '2'
  });
  const [countryList, setCountryList] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);

  const getCountryList = async () => {
    const res = await getDistincetSQLData('country', 'vcm_vd_log_material_1h', ` and product_id = ${product}`);
    setCountryList(res);
  };
  const getAppVersionList = async () => {
    const res = await getDistincetSQLData(
      'app_version',
      'vcm_vd_log_material_1h',
      ` and product_id = ${product} and platform = ${searchDetail.platform} order by app_version desc`
    );
    setAppVersionList(res);
  };

  const getTableData = async () => {
    setLoading(true);

    let where = `AND product_id = ${product}`;
    if (searchDetail.platform) {
      where += ` AND platform = '${searchDetail.platform}'`;
    }
    if (searchDetail.new_user) {
      where += ` AND new_user = '${searchDetail.new_user}'`;
    }
    if (searchDetail.country) {
      where += ` AND country = '${searchDetail.country}'`;
    }
    if (searchDetail.app_version) {
      where += ` AND app_version = '${searchDetail.app_version}'`;
    }
    if (searchDetail.ttid) {
      where += ` AND ttid = '${searchDetail.ttid}'`;
    }
    if (searchDetail.name) {
      where += ` AND instr(name, '${searchDetail.name}')>1`;
    }

    if (searchDetail.showType === '1') {
      const sql = `
      /*+ engine= mpp*/
      SELECT ttid,
          name,
          IF(answer_a> 0, 'yes', 'no') as answer_a,
          IF(answer_b> 0, 'yes', 'no') as answer_b,
          IF(answer_c> 0, 'yes', 'no') as answer_c,
          IF(answer_d> 0, 'yes', 'no') as answer_d,
          answer_e
      FROM    vcm_pub_log_usr_quest_collect
      WHERE   ds >= '#startDate#'
      AND     ds <= '#endDate#' #where#
      ;`;

      const res = await getData(
        createSqlWhere({
          sql,
          startDate: searchDetail.startDate,
          endDate: searchDetail.endDate,
          where
        })
      );

      let id = 0;
      setDataSource(res.map(r => ({ id: id++, ...r })));
    } else {
      const sql = `
      /*+ engine= mpp*/
      SELECT  '全部' as ttid
          ,'全部' AS name
          ,sum(IF(answer_a>0,1,0)) AS answer_a
          ,sum(IF(answer_b>0,1,0)) AS answer_b
          ,sum(IF(answer_c>0,1,0)) AS answer_c
          ,sum(IF(answer_d>0,1,0)) AS answer_d
          ,sum(if(answer_e is not null,1,0)) as answer_e
      FROM    vcm_pub_log_usr_quest_collect
      WHERE   ds >= '#startDate#'
      AND     ds <= '#endDate#' #where#
      -- ttid 维度的汇总数据
      union all
      SELECT  ttid
          ,max(name)AS name
          ,sum(IF(answer_a>0,1,0)) AS answer_a
          ,sum(IF(answer_b>0,1,0)) AS answer_b
          ,sum(IF(answer_c>0,1,0)) AS answer_c
          ,sum(IF(answer_d>0,1,0)) AS answer_d
          ,sum(if(answer_e is not null,1,0)) as answer_e
      FROM    vcm_pub_log_usr_quest_collect
      WHERE   ds >= '#startDate#'
      AND     ds <= '#endDate#' #where#
      group by ttid
      ;`;

      const res = await getData(
        createSqlWhere({
          sql,
          startDate: searchDetail.startDate,
          endDate: searchDetail.endDate,
          where
        })
      );

      let id = 0;
      setDataSource(
        res
          .sort((a, b) => {
            if (a.name === '全部') {
              return -1;
            }
            return 0;
          })
          .map(r => ({ id: id++, ...r }))
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    getTableData();
  }, [searchDetail]);

  useEffect(() => {
    getTableData();
    getCountryList();
    getAppVersionList();
  }, []);
  return (
    <>
      <p style={{ fontSize: 26, marginBottom: 10 }}>问卷调查</p>
      <Query
        searchDetail={searchDetail}
        setSearchDetail={setSearchDetail}
        countryList={countryList}
        appVersionList={appVersionList}
      />
      <DownLoadButton
        filename="问卷调查"
        data={dataSource}
        columns={columns.map(v => ({
          ...v,
          key: v.dataIndex
        }))}
      />
      <Table
        sortDirections={['descend', 'ascend']}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        bordered
        loading={loading}
      />
    </>
  );
};
