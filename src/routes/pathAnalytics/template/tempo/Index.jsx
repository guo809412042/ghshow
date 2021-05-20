import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Modal, Spin } from 'antd';
import QueryIndex from '../components/QueryIndex';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { templateTempoSQL, templateTempoDetailSQL } from '../components/sqlTemplate';
import { getData } from '../../../../utils/request';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';
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
    ttid: undefined,
    ttname: undefined,
    newUser: 'N',
  });
  const [dataSource, setDataSource] = useState([]);
  const [lodaing, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [chartName, setChartName] = useState('');
  const [visible, setVisible] = useState(false);
  const [chartData, setChartData] = useState([]);
  const chartColumns = [
    { key: 'day', title: 'day' },
    { key: 'value', title: 'value' },
  ];
  const onSearch = (values) => {
    setSearch(values);
  };

  const getSQLWhere = () => {
    let where = '';
    const {
      selectCountry, countryOperation, selectAppVersion, newUser,
      appVersionOperation, ttid, ttname, platform,
    } = search;
    if (selectCountry) {
      where += `and country ${countryOperation} '${selectCountry}'`;
    }
    if (selectAppVersion) {
      where += ` and app_version ${appVersionOperation} '${selectAppVersion}' `;
    }
    if (newUser) {
      where += ` and new_user =  '${newUser}' `;
    }
    if (ttid) {
      where += ` and ttid =  '${ttid}' `;
    }
    if (ttname) {
      where += ` and tt_name =  '${ttname}' `;
    }
    where += ` and platform = '${platform}' `;
    return where;
  };


  const getFetchData = async () => {
    setLoading(true);
    const where = getSQLWhere();
    const sql = createSqlWhere({
      sql: templateTempoSQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where,
    });
    const res = await getData(sql);
    const dataSource = res.map(v => ({
      ...v,
      'c_click_dvc_cnt/c_view_dvc_cnt': getNumber(v.c_click_dvc_cnt, v.c_view_dvc_cnt),
      'use_dvc_cnt/d_view_dvc_cnt': getNumber(v.use_dvc_cnt, v.d_view_dvc_cnt),
      'save_dvc_cnt/edit_dvc_cnt': getNumber(v.save_dvc_cnt, v.edit_dvc_cnt),
      'save_dvc_cnt/c_view_dvc_cnt': getNumber(v.save_dvc_cnt, v.c_view_dvc_cnt),
      'share_dvc_cnt/save_dvc_cnt': getNumber(v.share_dvc_cnt, v.save_dvc_cnt),
    }));
    setDataSource(dataSource);
    setLoading(false);
  };
  const chartShow = async (row, title) => {
    setChartName(`${row.ttid}-${title}`);
    setVisible(true);
    setSpinning(true);
    let where = getSQLWhere();
    if (!where.includes('ttid')) {
      where += ` and ttid = '${row.ttid}'`;
    }
    const chartSql = createSqlWhere({
      sql: templateTempoDetailSQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where,
    });
    const res = await getData(chartSql);
    const chartDate = res.map((v) => {
      let value = 0;
      if (title === '封面点击率') {
        value = getNumber(v.c_click_dvc_cnt, v.c_view_dvc_cnt);
      } else if (title === '使用率') {
        value = getNumber(v.use_dvc_cnt, v.d_view_dvc_cnt);
      } else if (title === '导出率') {
        value = getNumber(v.save_dvc_cnt, v.edit_dvc_cnt);
      } else if (title === '总完成率') {
        value = getNumber(v.save_dvc_cnt, v.c_view_dvc_cnt);
      } else {
        value = getNumber(v.share_dvc_cnt, v.save_dvc_cnt);
      }
      return ({
        day: moment(v.ds).format('YYYY-MM-DD'),
        type: title,
        value,
      });
    });
    setChartData(chartDate);
    chartLineRender(chartDate, document.getElementById('template-chart'));
    setSpinning(false);
  };
  const columns = [
    { dataIndex: 'ttid', key: 'ttid', title: 'ttid' },
    { dataIndex: 'tt_name', key: 'tt_name', title: '主题名' },
    {
      dataIndex: 'c_view_dvc_cnt',
      key: 'c_view_dvc_cnt',
      defaultSortOrder: 'descend',
      title: '封面曝光',
      sorter: (a, b) => a.c_view_dvc_cnt - b.c_view_dvc_cnt,
    },
    {
      dataIndex: 'c_click_dvc_cnt',
      key: 'c_click_dvc_cnt',
      title: '封面点击',
      sorter: (a, b) => a.c_click_dvc_cnt - b.c_click_dvc_cnt,
    },
    {
      dataIndex: 'c_click_dvc_cnt/c_view_dvc_cnt',
      key: 'c_click_dvc_cnt/c_view_dvc_cnt',
      title: '封面点击率',
      onCell: record => ({
        onClick: () => chartShow(record, '封面点击率'),
      }),
      render: text => `${text}%`,
    },
    {
      dataIndex: 'd_view_dvc_cnt',
      key: 'd_view_dvc_cnt',
      title: '详情页曝光',
      sorter: (a, b) => a.d_view_dvc_cnt - b.d_view_dvc_cnt,
    },
    {
      dataIndex: 'use_dvc_cnt',
      key: 'use_dvc_cnt',
      title: '素材使用',
      sorter: (a, b) => a.use_dvc_cnt - b.use_dvc_cnt,
    },
    {
      dataIndex: 'use_dvc_cnt/d_view_dvc_cnt',
      key: 'use_dvc_cnt/d_view_dvc_cnt',
      title: '使用率',
      render: text => `${text}%`,
      onCell: record => ({
        onClick: () => chartShow(record, '使用率'),
      }),
    },
    {
      dataIndex: 'edit_dvc_cnt',
      key: 'edit_dvc_cnt',
      title: '素材编辑',
      sorter: (a, b) => a.edit_dvc_cnt - b.edit_dvc_cnt,
    },
    {
      dataIndex: 'save_dvc_cnt',
      key: 'save_dvc_cnt',
      title: '素材保存',
      sorter: (a, b) => a.save_dvc_cnt - b.save_dvc_cnt,
    },
    {
      dataIndex: 'save_dvc_cnt/edit_dvc_cnt',
      key: 'save_dvc_cnt/edit_dvc_cnt',
      title: '导出率',
      render: text => `${text}%`,
      onCell: record => ({
        onClick: () => chartShow(record, '导出率'),
      }),
    },
    {
      dataIndex: 'save_dvc_cnt/c_view_dvc_cnt',
      key: 'save_dvc_cnt/c_view_dvc_cnt',
      title: '总完成率',
      render: text => `${text}%`,
      onCell: record => ({
        onClick: () => chartShow(record, '总完成率'),
      }),
    },
    {
      dataIndex: 'share_dvc_cnt',
      key: 'share_dvc_cnt',
      title: '素材分享',
      sorter: (a, b) => a.share_dvc_cnt - b.share_dvc_cnt,
    },
    {
      dataIndex: 'share_dvc_cnt/save_dvc_cnt',
      key: 'share_dvc_cnt/save_dvc_cnt',
      title: '分享率',
      render: text => `${text}%`,
      onCell: record => ({
        onClick: () => chartShow(record, '分享率'),
      }),
    },
  ];
  useEffect(() => {
    getFetchData();
  }, [search]);
  return <div>
    <QueryIndex
      onSearch={onSearch}
      product="10"
      defaultNewUser="N"
      search={search}
    />
    <DownLoadButton
      filename="用户素材使用路径"
      data={dataSource}
      columns={columns}
    />
    <Table
      columns={columns}
      bordered
      dataSource={dataSource}
      style={{ marginTop: 20 }}
      loading={lodaing}
      rowKey="ttid"
      scroll={{ x: 2000 }}
    />
    <Modal
      visible={visible}
      title={chartName}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      width={800}
    >
      <DownLoadButton
        filename={chartName}
        data={chartData}
        columns={chartColumns}
      />
      <Spin spinning={spinning}>
        <div id="template-chart" />
      </Spin>
    </Modal>
  </div>;
};
