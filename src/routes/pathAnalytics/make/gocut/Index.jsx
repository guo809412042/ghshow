import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import QueryIndex from '../components/QueryIndex';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { makeGocutPvSQL, makeGocutUvSQL } from '../components/sqlTemplate';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';

export default () => {
  const [search, setSearch] = useState({
    platform: '2',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    countryOperation: '=',
    appVersionOperation: '=',
    selectCountry: undefined,
    selectAppVersion: undefined,
    accessType: 'uv',
    newUser: 0,
  });
  const [dataSource, setDataSource] = useState([]);
  const [lodaing, setLoading] = useState(false);
  const onSearch = (values) => {
    setSearch(values);
  };

  const getSQLWhere = () => {
    let where = '';
    const {
      selectCountry, countryOperation, selectAppVersion, newUser, appVersionOperation, platform,
    } = search;
    if (selectCountry) {
      where += `and country ${countryOperation} '${selectCountry}'`;
    }
    if (selectAppVersion) {
      where += ` and app_version ${appVersionOperation} '${selectAppVersion}' `;
    }
    if (newUser) {
      where += ` and is_new_dvc =  ${newUser} `;
    }
    where += ` and os = ${platform} `;
    return where;
  };

  const getFetchData = async () => {
    setLoading(true);
    const where = getSQLWhere();
    const sql = createSqlWhere({
      sql: search.accessType === 'uv' ? makeGocutUvSQL : makeGocutPvSQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where,
    });
    const { platform } = search;
    const res = await getData(sql);
    console.log(res);
    const dataSource = res.map(v => ({
      ...v,
      'gallery_view_cnt/homepage_view_cnt': getNumber(v.gallery_view_cnt, v.homepage_view_cnt),
      'edit_view_cnt/gallery_view_cnt': getNumber(v.edit_view_cnt, v.gallery_view_cnt),
      'edit_view_cnt/homepage_view_cnt': getNumber(v.edit_view_cnt, v.homepage_view_cnt),
      'export_click_cnt/edit_view_cnt': getNumber(v.export_click_cnt, v.edit_view_cnt),
      'export_click_cnt/homepage_view_cnt': getNumber(v.export_click_cnt, v.homepage_view_cnt),
      'success_export_cnt/export_click_cnt': getNumber(v.success_export_cnt, v.export_click_cnt),
      'success_export_cnt/homepage_view_cnt': getNumber(v.success_export_cnt, v.homepage_view_cnt),
      'share_click_cnt/share_view_cnt': platform === '1' ? getNumber(v.share_click_cnt, v.success_export_cnt) : getNumber(v.share_click_cnt, v.share_view_cnt),
      'share_click_cnt/homepage_view_cnt': getNumber(v.share_click_cnt, v.homepage_view_cnt),
    }));
    setDataSource(dataSource);
    setLoading(false);
  };

  const columns = [
    { dataIndex: 'date', key: 'date', title: '日期' },
    { dataIndex: 'app_start_cnt', key: 'app_start_cnt', title: '启动' },
    { dataIndex: 'homepage_view_cnt', key: 'homepage_view_cnt', title: '主页曝光' },
    { dataIndex: 'gallery_view_cnt', key: 'gallery_view_cnt', title: '相册页曝光' },
    {
      dataIndex: 'gallery_view_cnt/homepage_view_cnt',
      key: 'gallery_view_cnt/homepage_view_cnt',
      title: '相册页进入率',
      render: text => `${text}%`,
    },
    { dataIndex: 'edit_view_cnt', key: 'edit_view_cnt', title: '编辑页曝光' },
    {
      dataIndex: 'edit_view_cnt/gallery_view_cnt',
      key: 'edit_view_cnt/gallery_view_cnt',
      title: '导入素材成功率',
      render: text => `${text}%`,
    },
    {
      dataIndex: 'edit_view_cnt/homepage_view_cnt',
      key: 'edit_view_cnt/homepage_view_cnt',
      title: '主页到编辑率',
      render: text => `${text}%`,
    },
    { dataIndex: 'export_click_cnt', key: 'export_click_cnt', title: '导出按钮点击' },
    {
      dataIndex: 'export_click_cnt/edit_view_cnt',
      key: 'export_click_cnt/edit_view_cnt',
      title: '导出率',
      render: text => `${text}%`,
    },
    {
      dataIndex: 'export_click_cnt/homepage_view_cnt',
      key: 'export_click_cnt/homepage_view_cnt',
      title: '主页到导出点击率',
      render: text => `${text}%`,
    },
    { dataIndex: 'success_export_cnt', key: 'success_export_cnt', title: '导出成功数' },
    { dataIndex: 'share_view_cnt', key: 'share_view_cnt', title: '分享页展示' },
    {
      dataIndex: 'success_export_cnt/export_click_cnt',
      key: 'success_export_cnt/export_click_cnt',
      title: '导出成功率',
      render: text => `${text}%`,
    },
    {
      dataIndex: 'success_export_cnt/homepage_view_cnt',
      key: 'success_export_cnt/homepage_view_cnt',
      title: '主页到导出成功率',
      render: text => `${text}%`,
    },
    { dataIndex: 'share_click_cnt', key: 'share_click_cnt', title: '分享点击' },
    {
      dataIndex: 'share_click_cnt/share_view_cnt',
      key: 'share_click_cnt/share_view_cnt',
      title: '分享率',
      render: text => `${text}%`,
    },
    {
      dataIndex: 'share_click_cnt/homepage_view_cnt',
      key: 'share_click_cnt/homepage_view_cnt',
      title: '主页到分享率',
      render: text => `${text}%`,
    },
  ];

  useEffect(() => {
    getFetchData();
  }, [search]);

  return (
    <div>
      <QueryIndex onSearch={onSearch} product="43" defaultNewUser="0" search={search} />
      <DownLoadButton filename="用户视频制作路径" data={dataSource} columns={columns} />
      <Table
        columns={columns}
        bordered
        dataSource={dataSource}
        style={{ marginTop: 20 }}
        loading={lodaing}
        rowKey="ttid"
        scroll={{ x: 2000 }}
      />
    </div>
  );
};
