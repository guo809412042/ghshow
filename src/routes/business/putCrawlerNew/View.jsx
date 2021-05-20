/* eslint-disable react/no-this-in-sfc */
import React, { useState, useEffect } from 'react';
import {
  Table, Tooltip, Radio, Row, Col, Checkbox, Popover, Button,
} from 'antd';
import moment from 'moment';
import Query from './components/Query';
import { getData } from '../../../utils/request';
import { listSQL } from './components/sqlTemplate';
import { whereSql } from './components/utils';
import { filterEmptyObj, createSqlWhere } from '../../../utils/utils';
import { DownLoadButton } from '../../common/DownLoadButton';
import { ALL_MEDIA_SOURCE, ALL_AD_MEDIA_SOURCE } from './components/constant';

const dataFilterList = [
  { title: '投放新增', key: 'install' },
  { title: '投放成本', key: 'spend' },
  { title: '投放单价', key: 'ad_cpi' },
  { title: '展示量', key: 'impressions' },
  { title: '点击量', key: 'clicks' },
  { title: '点击率', key: 'ad_ctr' },
  { title: '下载率', key: 'ad_install_rate' },
  { title: 'af新增', key: 'af_retn_newusr_num' },
  { title: '真实收入', key: 'new_real_revenue' },
  { title: '修正收入', key: 'real_revenue' },
  { title: '利润', key: 'profit' },
  { title: 'Arpu', key: 'arpu' },
  { title: 'ROI', key: 'roi' },
  { title: '年试用数', key: 'year_free_num' },
  { title: '年试用率(%)', key: 'free_trail_year_rate' },
  { title: '年付费数', key: 'year_pay_num' },
  { title: '年付费数率(%)', key: 'purchase_year_rate' },
  { title: '年续费数', key: 'year_renew_pay_num' },
  { title: '月试用数', key: 'month_free_num' },
  { title: '月付费数', key: 'month_pay_num' },
  { title: '月续费数', key: 'month_renew_pay_num' },
  { title: '周试用数', key: 'week_free_num' },
  { title: '周付费数', key: 'week_pay_num' },
  { title: '周续费数', key: 'week_renew_pay_num' },
  { title: '永久试用数', key: 'purchase_free_num' },
  { title: '总试用数', key: 'free_trail_total_num' },
  { title: '总试用率(%)', key: 'free_trail_total_rate' },
  { title: '总付费数', key: 'purchase_total_num' },
  { title: '总付费率(%)', key: 'purchase_total_rate' },
  { title: '总续费数', key: 'purchase_renew_total_num' },
];

export default () => {
  const [loading, setLoading] = useState(false);
  const [dayType, setDayType] = useState('1');

  const [tableList, setTableList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState({
    product: '10',
    platform: '',
    mediaSources: ['FBad'],
    countries: ['美国'],
    campaigns: [],
    groupBy: ['ds'],
    startDate: moment().subtract(2, 'days'),
    endDate: moment().subtract(1, 'days'),
  });

  const onSearch = (params) => {
    setSearch(params);
  };

  const width = 140;

  const filterColumns = [
    {
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
      width,
      fixed: 'left',
    },
    {
      title: '国家',
      dataIndex: 'country_name',
      key: 'country_name',
      width,
      fixed: 'left',
    },
    {
      title: '来源',
      dataIndex: 'media_source',
      key: 'media_source',
      width,
      fixed: 'left',
    },
    {
      title: 'campaign',
      dataIndex: 'campaign_name',
      key: 'campaign_name',
      width,
      fixed: 'left',
    },
  ];

  const baseColumns = [
    {
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
      width,
      fixed: 'left',
    },
  ];

  const initColumns = [
    {
      title: '投放新增',
      dataIndex: 'install',
      key: 'install',
      width,
    },
    {
      title: '投放成本',
      dataIndex: 'spend',
      key: 'spend',
      width,
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '真实收入',
      dataIndex: 'new_real_revenue',
      key: 'new_real_revenue',
      width,
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '修正收入',
      dataIndex: 'real_revenue',
      key: 'real_revenue',
      width,
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '投放单价（CPI）',
      dataIndex: 'ad_cpi',
      key: 'ad_cpi',
      width,
      tooltip: '投放成本/投放新增(后台)',
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '展示量',
      dataIndex: 'impressions',
      key: 'impressions',
      width,
    },
    {
      title: '点击量',
      dataIndex: 'clicks',
      key: 'clicks',
      width,
    },
    {
      title: '点击率(%)',
      dataIndex: 'ad_ctr',
      key: 'ad_ctr',
      width,
      tooltip: '点击量(Clicks)/展示量(Impression)*100%',
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '下载率(%)',
      dataIndex: 'ad_install_rate',
      key: 'ad_install_rate',
      width,
      tooltip: '投放新增(后台)/点击量(Clicks)*100%',
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: 'af新增',
      dataIndex: 'af_retn_newusr_num',
      key: 'af_retn_newusr_num',
      width,
    },
    {
      title: '利润',
      dataIndex: 'profit',
      key: 'profit',
      width,
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: 'Arpu',
      dataIndex: 'arpu',
      key: 'arpu',
      width,
      tooltip: '真实收入(revenue)/投放新增(AF归因)',
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      width,
      tooltip: '(真实收入/投放成本)*100%',
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '年试用数',
      dataIndex: 'year_free_num',
      key: 'year_free_num',
      width,
    },
    {
      title: '年试用率(%)',
      dataIndex: 'free_trail_year_rate',
      key: 'free_trail_year_rate',
      width,
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '年付费数',
      dataIndex: 'year_pay_num',
      key: 'year_pay_num',
      width,
    },
    {
      title: '年付费数率(%)',
      dataIndex: 'purchase_year_rate',
      key: 'purchase_year_rate',
      width,
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '年续费数',
      dataIndex: 'year_renew_pay_num',
      key: 'year_renew_pay_num',
      width,
    },
    {
      title: '月试用数',
      dataIndex: 'month_free_num',
      key: 'month_free_num',
      width,
    },
    {
      title: '月付费数',
      dataIndex: 'month_pay_num',
      key: 'month_pay_num',
      width,
    },
    {
      title: '月续费数',
      dataIndex: 'month_renew_pay_num',
      key: 'month_renew_pay_num',
      width,
    },
    {
      title: '周试用数',
      dataIndex: 'week_free_num',
      key: 'week_free_num',
      width,
    },
    {
      title: '周付费数',
      dataIndex: 'week_pay_num',
      key: 'week_pay_num',
      width,
    },
    {
      title: '周续费数',
      dataIndex: 'week_renew_pay_num',
      key: 'week_renew_pay_num',
      width,
    },
    {
      title: '永久试用数',
      dataIndex: 'purchase_free_num',
      key: 'purchase_free_num',
      width,
    },
    {
      title: '永久付费数',
      dataIndex: 'purchase_forever_num',
      key: 'purchase_forever_num',
      width,
    },
    {
      title: '总试用数',
      dataIndex: 'free_trail_total_num',
      key: 'free_trail_total_num',
      width,
    },
    {
      title: '总试用率(%)',
      dataIndex: 'free_trail_total_rate',
      key: 'free_trail_total_rate',
      width,
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '总付费数',
      dataIndex: 'purchase_total_num',
      key: 'purchase_total_num',
      width,
    },
    {
      title: '总付费率(%)',
      dataIndex: 'purchase_total_rate',
      key: 'purchase_total_rate',
      width,
      render: text => (text ? text.toFixed(2) : '0'),
    },
    {
      title: '总续费数',
      dataIndex: 'purchase_renew_total_num',
      key: 'purchase_renew_total_num',
      width,
    },
  ];

  const [fixColumns, setFixColumns] = useState([]);
  const [rightColums, setRightColums] = useState(initColumns);
  const [columns, setColumns] = useState([...baseColumns, ...initColumns]);

  const getDataList = async () => {
    setLoading(true);
    try {
      const conditions = {
        ds__gte: moment(search.startDate).format('YYYYMMDD'),
        ds__lte: moment(search.endDate).format('YYYYMMDD'),
        platform: search.platform,
        product_id: search.product === '' ? '' : search.product,
      };
      let countryList = [];
      if (search.countries.length > 0) {
        // 地区列表包含全部，都按全部条件搜
        if (!search.countries.includes(' ')) {
          search.countries.forEach((v) => {
            if (v) {
              countryList = countryList.concat(v);
            }
          });
        }
      }
      // 国家
      if (countryList.length) {
        conditions.country_name__in = countryList.length > 0 ? countryList : undefined;
      }
      // campaign
      if (search.campaigns.length && !search.mediaSources.includes(' ')) {
        // FIX campaigns 中含有 $$ 而 replace 方法会将 $$ 转化为 $, 从而查询不到数据
        const newCampaigns = search.campaigns.map(v => v.replace(/\$\$/g, '$$$$$$$$'));
        conditions.campaign_name = newCampaigns;
      }
      const unionCondition = { ...conditions };

      // 来源
      if (search.mediaSources.length > 0) {
        if (search.mediaSources.includes(' ')) {
          conditions.media_source__in = ['ASM'];
          unionCondition.media_source__in = ALL_MEDIA_SOURCE;
        } else if (search.mediaSources.includes('ALL')) {
          conditions.media_source__in = ['ASM'];
          unionCondition.media_source__in = ALL_AD_MEDIA_SOURCE;
        } else if (search.mediaSources.includes('ASM')) {
          // 区分 ASM 来源
          conditions.media_source__in = ['ASM'];
          const source = search.mediaSources.filter(v => v !== 'ASM');
          unionCondition.media_source__in = source;
        } else {
          conditions.media_source__in = [''];
          unionCondition.media_source__in = search.mediaSources;
        }
      } else {
        conditions.media_source__in = ['ASM'];
        unionCondition.media_source__in = ALL_MEDIA_SOURCE;
      }

      const where = whereSql(filterEmptyObj(conditions));
      const unionWhere = whereSql(filterEmptyObj(unionCondition));

      let querySql = '';
      let groupSql = '';
      let orderSql = '';

      // 分组维度查找
      if (search.groupBy.length) {
        // 显示 国家 来源 campaign 列
        const newFixColumns = filterColumns.filter(item => search.groupBy.includes(item.key));
        setFixColumns(newFixColumns);
        setColumns([...newFixColumns, ...rightColums]);
        // 查询字段 sql 替换
        const queryStr = `${search.groupBy.toString()}`;
        const hasDs = search.groupBy.includes('ds');
        // group sql 替换
        if (dayType === '2' && hasDs) {
          // 按月查找且包含日期维度
          querySql = `${queryStr},`.replace('ds', 'substr(ds,1,6) as ds');
          const _groupStr = queryStr.replace('ds', 'substr(ds,1,6)');
          groupSql = ` GROUP BY ${_groupStr}`;
        } else {
          // 按日查找且按月查找不包含日期维度
          querySql = `${queryStr},`;
          groupSql = ` GROUP BY ${queryStr}`;
        }
        orderSql = hasDs ? ' ds DESC, ' : '';
      } else {
        setFixColumns([]);
        setColumns(rightColums);
      }
      // 日期按日月查找
      const resSQL = createSqlWhere({
        sql: listSQL,
        query: querySql,
        group: groupSql,
        order: orderSql,
      });
      const tableSql = resSQL
        .replace(/\?/g, where ? `where ${where}` : '')
        .replace('#$#', unionWhere ? `where ${unionWhere}` : '');

      const tableRes = await getData(tableSql);
      // 判断返回数据为 [{}] 格式
      if (tableRes.length === 1 && JSON.stringify(tableRes[0]) === '{}') {
        setTableList([]);
      } else {
        setTableList(tableRes || []);
      }
    } catch (ex) {
      console.error(ex);
      setTableList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    getDataList();
  }, [dayType, search]);

  const onChange = (value) => {
    const newColumns = initColumns.filter(item => value.includes(item.key));
    setRightColums(newColumns);
    setColumns([...fixColumns, ...newColumns]);
  };

  const content = (
    <div style={{ width: 400 }}>
      <Checkbox.Group defaultValue={initColumns.map(item => item.key)} onChange={onChange}>
        <Row>
          {dataFilterList.map(item => (
            <Col span={8} style={{ marginBottom: 10 }} key={item.key}>
              <Checkbox value={item.key}>{item.title}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </div>
  );

  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <Row style={{ marginTop: 10, marginBottom: 10 }}>
        <Col span={20}>
          <span
            style={{
              color: '#7d8c95',
              fontSize: 14,
              marginRight: 10,
            }}
          >
            投放数据
          </span>
          <Radio.Group value={dayType} onChange={e => setDayType(e.target.value)}>
            <Radio.Button value="1" key="1">
              日
            </Radio.Button>
            <Radio.Button value="2" key="2">
              月
            </Radio.Button>
          </Radio.Group>
        </Col>
        <Col span={2}>
          <Popover title={null} content={content} trigger="click" placement="left">
            <Button style={{ marginRight: 10 }}>数据筛选</Button>
          </Popover>
        </Col>
        <Col span={2}>
          <DownLoadButton key="导出" filename="投放爬虫数据" columns={columns} data={tableList} />
        </Col>
      </Row>
      <Table
        dataSource={tableList}
        columns={columns.map(v => ({
          ...v,
          title: v.tooltip ? <Tooltip title={v.tooltip}>{v.title}</Tooltip> : v.title,
        }))}
        loading={loading}
        bordered
        pagination={{
          pageSize: 20,
          hideOnSinglePage: true,
          current: currentPage,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};
