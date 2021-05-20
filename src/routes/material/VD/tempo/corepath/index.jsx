/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import Query from './components/Query';
import columns from './constants';
import { getData } from '../../../../../utils/request';
import { createSqlWhere, getDistincetSQLData } from '../../../../../utils/utils';
import { DownLoadButton } from '../../../../common/DownLoadButton';

export default () => {
  const product = 10;

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchDetail, setSearchDetail] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(0, 'days'),
    new_user: '1',
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

    let where = ``;
    if (searchDetail.platform) {
      where += ` AND platform = '${searchDetail.platform}'`;
    }
    if (searchDetail.new_user) {
      where += ` AND is_new_dvc = '${searchDetail.new_user}'`;
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
      where += ` AND instr(ttname, '${searchDetail.name}')>1`;
    }

    const sql = `
      SELECT
        ttid,
        ttname,
        total_preview_video_loading_time / total_preview_video_loading_cnt AS avg_preview_video_loading_time,
        total_download_loading_time / total_download_loading_cnt AS avg_ownload_loading_time,
        total_edit_enter_loading_time / total_edit_enter_loading_cnt AS avg_edit_enter_loading_time,
        total_edit_save_loading_time / total_edit_save_loading_cnt AS avg_edit_save_loading_time 
      FROM
        (
        SELECT
          ttid,
          'all' AS ttname,
          sum( total_preview_video_loading_time ) AS total_preview_video_loading_time,
          sum( total_preview_video_loading_cnt ) AS total_preview_video_loading_cnt,
          sum( total_download_loading_time ) AS total_download_loading_time,
          sum( total_download_loading_cnt ) AS total_download_loading_cnt,
          sum( total_edit_enter_loading_time ) AS total_edit_enter_loading_time,
          sum( total_edit_enter_loading_cnt ) AS total_edit_enter_loading_cnt,
          sum( total_edit_save_loading_time ) AS total_edit_save_loading_time,
          sum( total_edit_save_loading_cnt ) AS total_edit_save_loading_cnt 
        FROM
          quvideo_gh.ads_tempo_templates_loading_time_statistics
        WHERE day >= '#startDate#'
          AND day <= '#endDate#' #where#
        GROUP BY
          ttid 
        ) UNION ALL
      SELECT
        ttid,
        ttname,
        total_preview_video_loading_time / total_preview_video_loading_cnt AS avg_preview_video_loading_time,
        total_download_loading_time / total_download_loading_cnt AS avg_ownload_loading_time,
        total_edit_enter_loading_time / total_edit_enter_loading_cnt AS avg_edit_enter_loading_time,
        total_edit_save_loading_time / total_edit_save_loading_cnt AS avg_edit_save_loading_time 
      FROM
        (
        SELECT
          ttid,
          ttname,
          sum( total_preview_video_loading_time ) AS total_preview_video_loading_time,
          sum( total_preview_video_loading_cnt ) AS total_preview_video_loading_cnt,
          sum( total_download_loading_time ) AS total_download_loading_time,
          sum( total_download_loading_cnt ) AS total_download_loading_cnt,
          sum( total_edit_enter_loading_time ) AS total_edit_enter_loading_time,
          sum( total_edit_enter_loading_cnt ) AS total_edit_enter_loading_cnt,
          sum( total_edit_save_loading_time ) AS total_edit_save_loading_time,
          sum( total_edit_save_loading_cnt ) AS total_edit_save_loading_cnt 
        FROM
          quvideo_gh.ads_tempo_templates_loading_time_statistics
        WHERE day >= '#startDate#'
        AND day <= '#endDate#' #where#
        GROUP BY
          ttid,
        ttname 
        )`;

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
          if (a.name === 'all') {
            return -1;
          }
          return 0;
        })
        .map(r => ({ id: id++, ...r }))
    );

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
      <p style={{ fontSize: 26, marginBottom: 10 }}>核心路径等待时长</p>
      <Query
        searchDetail={searchDetail}
        setSearchDetail={setSearchDetail}
        countryList={countryList}
        appVersionList={appVersionList}
      />
      <DownLoadButton
        filename="核心路径等待时长"
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
