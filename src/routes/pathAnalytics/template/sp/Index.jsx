import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Modal, Spin } from 'antd';
import QueryIndex from '../components/QueryIndex';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { templateListSQLSP, templateListDetailSQLSP } from '../components/sqlTemplate';
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
    newUser: 'Y',
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
      selectCountry,
      countryOperation,
      selectAppVersion,
      newUser,
      appVersionOperation,
      ttid,
      ttname,
      platform,
    } = search;
    if (selectCountry) {
      where += `and country_name ${countryOperation} '${selectCountry}'`;
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

  const chartShow = async (row, title) => {
    setChartName(`${row.ttid}-${title}`);
    setVisible(true);
    setSpinning(true);
    let where = getSQLWhere();
    if (!where.includes('ttid')) {
      where += ` and ttid = '${row.ttid}'`;
    }
    if (!where.includes('tt_name')) {
      where += ` and tt_name = '${row.ttname}'`;
    }
    const chartSql = createSqlWhere({
      sql: templateListDetailSQLSP,
      startDate: search.startDate,
      endDate: search.endDate,
      where,
    });
    const res = await getData(chartSql);
    const chartDate = res.map((v) => {
      let value = 0;
      if (title === '预览率') {
        value = getNumber(v.home_template_preview_total, v.home_template_show_total);
      } else if (title === '使用率') {
        value = getNumber(v.home_template_create_total, v.home_template_preview_total);
      } else if (title === '点击率') {
        value = getNumber(v.cover_click_cnt_1d, v.home_template_show_total);
      } else if (title === '导出率') {
        value = (
          Number(v.save_button_click_total * 100)
          / (Number(v.home_template_create_total) + Number(v.edit_template_apply_total))
        ).toFixed(2);
      } else if (title === '总完成率') {
        value = (
          Number(v.share_savetogallery_total * 100)
          / (Number(v.home_template_create_total) + Number(v.edit_template_apply_total))
        ).toFixed(2);
      } else {
        value = getNumber(v.share_button_click_total, v.share_savetogallery_total);
      }
      return {
        day: moment(v.ds).format('YYYY-MM-DD'),
        type: title,
        value: value * 1,
      };
    });
    setChartData(chartDate);
    chartLineRender(chartDate, document.getElementById('template-chart'));
    setSpinning(false);
  };
  const columns = [
    { dataIndex: 'ttid', key: 'ttid', title: 'ttid' },
    { dataIndex: 'ttname', key: 'ttname', title: '主题名' },
    {
      dataIndex: 'home_template_show_total',
      key: 'home_template_show_total',
      defaultSortOrder: 'descend',
      title: '展示',
      sorter: (a, b) => a.home_template_show_total - b.home_template_show_total,
    },
    {
      dataIndex: 'cover_click_cnt_1d',
      key: 'cover_click_cnt_1d',
      title: '点击',
      sorter: (a, b) => a.cover_click_cnt_1d - b.cover_click_cnt_1d,
    },
    {
      dataIndex: 'cover_click_cnt_1d/home_template_show_total',
      key: 'cover_click_cnt_1d/home_template_show_total',
      title: '点击率',
      onCell: record => ({
        onClick: () => chartShow(record, '点击率'),
      }),
      render: text => `${text}%`,
    },
    {
      dataIndex: 'home_template_preview_total',
      key: 'home_template_preview_total',
      title: '预览',
      sorter: (a, b) => a.home_template_preview_total - b.home_template_preview_total,
    },
    {
      dataIndex: 'home_template_preview_total/home_template_show_total',
      key: 'home_template_preview_total/home_template_show_total',
      title: '预览率',
      onCell: record => ({
        onClick: () => chartShow(record, '预览率'),
      }),
      render: text => `${text}%`,
    },
    {
      dataIndex: 'home_template_create_total',
      key: 'home_template_create_total',
      title: '主题创作',
      sorter: (a, b) => a.home_template_create_total - b.home_template_create_total,
    },
    {
      dataIndex: 'home_template_create_total/home_template_preview_total',
      key: 'home_template_create_total/home_template_preview_total',
      title: '使用率',
      render: text => `${text}%`,
      onCell: record => ({
        onClick: () => chartShow(record, '使用率'),
      }),
    },
    {
      dataIndex: 'edit_template_apply_total',
      key: 'edit_template_apply_total',
      title: '编辑主题应用',
      sorter: (a, b) => a.edit_template_apply_total - b.edit_template_apply_total,
    },
    {
      dataIndex: 'save_button_click_total',
      key: 'save_button_click_total',
      title: '导出点击',
      sorter: (a, b) => a.save_button_click_total - b.save_button_click_total,
    },
    {
      dataIndex: 'share_savetogallery_total',
      key: 'share_savetogallery_total',
      title: '导出成功',
      sorter: (a, b) => a.share_savetogallery_total - b.share_savetogallery_total,
    },
    {
      dataIndex: 'save_button_click_total/(home_template_create_total+edit_template_apply_total)',
      key: 'save_button_click_total/(home_template_create_total+edit_template_apply_total)',
      title: '导出率',
      render: text => `${text}%`,
      onCell: record => ({
        onClick: () => chartShow(record, '导出率'),
      }),
    },
    {
      dataIndex: 'share_savetogallery_total/(home_template_create_total+edit_template_apply_total)',
      key: 'share_savetogallery_total/(home_template_create_total+edit_template_apply_total)',
      title: '总完成率',
      render: text => `${text}%`,
      onCell: record => ({
        onClick: () => chartShow(record, '总完成率'),
      }),
    },
    {
      dataIndex: 'share_button_click_total',
      key: 'share_button_click_total',
      title: '分享点击',
      sorter: (a, b) => a.share_button_click_total - b.share_button_click_total,
    },
    {
      dataIndex: 'share_button_click_total/share_savetogallery_total',
      key: 'share_button_click_total/share_savetogallery_total',
      title: '分享率',
      render: text => `${text}%`,
      onCell: record => ({
        onClick: () => chartShow(record, '分享率'),
      }),
    },
  ];
  const getFetchData = async () => {
    setLoading(true);
    const where = getSQLWhere();
    const sql = createSqlWhere({
      sql: templateListSQLSP,
      startDate: search.startDate,
      endDate: search.endDate,
      where,
    });
    const res = await getData(sql);
    const dataSource = res.map((v, index) => ({
      ...v,
      'home_template_preview_total/home_template_show_total': getNumber(
        v.home_template_preview_total,
        v.home_template_show_total,
      ),
      'home_template_create_total/home_template_preview_total': getNumber(
        v.home_template_create_total,
        v.home_template_preview_total,
      ),
      'cover_click_cnt_1d/home_template_show_total': getNumber(v.cover_click_cnt_1d, v.home_template_show_total),
      // 'save_button_click_total/(home_template_create_total+edit_template_apply_total)':
      // ((v.home_template_create_total || 0) + (v.edit_template_apply_total || 0)) && v.save_button_click_total
      //   ? Number((v.save_button_click_total / ((v.home_template_create_total || 0) + (v.edit_template_apply_total || 0)) * 100).toFixed(2))
      //   : 0,
      'save_button_click_total/(home_template_create_total+edit_template_apply_total)': (
        Number(v.save_button_click_total * 100)
        / (Number(v.home_template_create_total) + Number(v.edit_template_apply_total))
      ).toFixed(2),
      'share_savetogallery_total/(home_template_create_total+edit_template_apply_total)': (
        Number(v.share_savetogallery_total * 100)
        / (Number(v.home_template_create_total) + Number(v.edit_template_apply_total))
      ).toFixed(2),
      'share_button_click_total/share_savetogallery_total': getNumber(
        v.share_button_click_total,
        v.share_savetogallery_total,
      ),
      key: index,
    }));
    setDataSource(dataSource);
    setLoading(false);
  };
  useEffect(() => {
    getFetchData();
  }, [search]);
  return (
    <div>
      <QueryIndex onSearch={onSearch} product="3" search={search} />
      <DownLoadButton filename="用户素材使用路径" data={dataSource} columns={columns} />
      <Table
        columns={columns}
        bordered
        dataSource={dataSource}
        style={{ marginTop: 20 }}
        loading={lodaing}
        rowKey="key"
        scroll={{ x: 2000 }}
      />
      <Modal
        visible={visible}
        title={chartName}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={800}
      >
        <DownLoadButton filename={chartName} data={chartData} columns={chartColumns} />
        <Spin spinning={spinning}>
          <div id="template-chart" />
        </Spin>
      </Modal>
    </div>
  );
};
