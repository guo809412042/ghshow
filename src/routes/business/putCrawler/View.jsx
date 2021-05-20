/* eslint-disable react/no-this-in-sfc */
import React, { useState, useEffect } from 'react';
import { Table, Tooltip } from 'antd';
import moment from 'moment';
import Query from './components/Query';
import { getData } from '../../../utils/request';
import { dayListSQL } from './components/sqlTemplate';
import { whereSql } from './components/utils';
import { filterEmptyObj } from '../../../utils/utils';
import { DownLoadButton } from '../../common/DownLoadButton';

export default () => {
  const [loading, setLoading] = useState(false);

  const [tableList, setTableList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState({
    startDate: moment().subtract(2, 'days'),
    endDate: moment().subtract(1, 'days'),
    countryOpt: 'in',
    countries: ['美国'],
    platform: '2',
    product: '10',
    mediaSources: ['FBad'],
  });

  const onSearch = (params) => {
    setSearch(params);
  };

  const width = 140;

  // const sorter = () => function sort(a, b) {
  //   return a[this.key] - b[this.key];
  // };

  const columns = [
    {
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
      width,
      fixed: 'left',
    },
    {
      title: '地区',
      dataIndex: 'country_name',
      key: 'country_name',
      width,
      fixed: 'left',
    },
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
    },
    {
      title: '投放单价（CPI）',
      dataIndex: 'CPI',
      key: 'CPI',
      width,
      tooltip: '投放成本/投放新增(后台)',
    },
    {
      title: '分成后真实收入（revenue）',
      dataIndex: 'after_revenue',
      key: 'after_revenue',
      width,
    },
    {
      title: '展示量（impression）',
      dataIndex: 'impressions',
      key: 'impressions',
      width,
    },
    {
      title: '点击量（clicks）',
      dataIndex: 'clicks',
      key: 'clicks',
      width,
    },
    {
      title: '点击率（CTR)',
      dataIndex: 'CTR',
      key: 'CTR',
      width,
      tooltip: '点击量(Clicks)/展示量(Impression)*100%',
    },
    {
      title: '商店页转化率（CVR）',
      dataIndex: 'CVR',
      key: 'CVR',
      width,
      tooltip: '投放新增(后台)/点击量(Clicks)*100%',
    },
    {
      title: '投放新增（AF归因）',
      dataIndex: 'af_retn_newusr_num',
      key: 'af_retn_newusr_num',
      width,
      tooltip: '',
    },
    {
      title: 'ROAS',
      dataIndex: 'ROAS',
      key: 'ROAS',
      width,
      tooltip: '分成后真实收入(revenue)/投放成本',
    },
    {
      title: 'ROI',
      dataIndex: 'ROI',
      key: 'ROI',
      width,
      tooltip: '(分成后真实收入(revenue)-投放成本)/投放成本',
    },
    {
      title: '新增arpu',
      dataIndex: 'arpu',
      key: 'arpu',
      width,
      tooltip: '分成后真实收入(revenue)/投放新增(AF归因)',
    },
    {
      title: '年试用数',
      dataIndex: 'year_trial_num',
      key: 'year_trial_num',
      width,
    },
    {
      title: '年试用率（%）',
      dataIndex: 'year_trial_rate',
      key: 'year_trial_rate',
      width,
      tooltip: '年试用数/投放新增(AF归因)*100%',
    },
    {
      title: '年付费数',
      dataIndex: 'year_pay_num',
      key: 'year_pay_num',
      width,
    },
    {
      title: '年付费成功率（%）',
      dataIndex: 'year_success_rate',
      key: 'year_success_rate',
      width,
      tooltip: '年付费数/年试用数*100%',
    },
    {
      title: '年付费率（%）',
      dataIndex: 'year_pay_rate',
      key: 'year_pay_rate',
      width,
      tooltip: '年付费数/投放新增(AF归因)*100%',
    },
    {
      title: '年续费数',
      dataIndex: 'year_renew_pay_num',
      key: 'year_renew_pay_num',
      width,
    },
    {
      title: '月试用数',
      dataIndex: 'month_trial_num',
      key: 'month_trial_num',
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
      dataIndex: 'week_trial_num',
      key: 'week_trial_num',
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
      title: '永久付费',
      dataIndex: 'purchase_forever_num',
      key: 'purchase_forever_num',
      width,
    },
  ];

  // // 增加汇总行
  // const addTotal = (tableRes) => {
  //   if (tableRes && tableRes.length > 1) {
  //     const total = {};
  //     tableRes.forEach((v) => {
  //       for (const key in v) {
  //         if (Object.prototype.hasOwnProperty.call(v, key)) {
  //           total[key] = tableRes.reduce((total, curr) => getFixed(total + curr[key]), 0);
  //         }
  //       }
  //     });
  //     total.ds = '合计';
  //     total.country_name = '合计';
  //     total.CPI = getFixed(total.spend / total.install);
  //     total.CTR = getFixed((100 * total.clicks) / total.impressions);
  //     total.CVR = getFixed((100 * total.install) / total.clicks);
  //     total.ROAS = getFixed(total.after_revenue / total.spend);
  //     total.ROI = getFixed((total.after_revenue - total.spend) / total.spend);
  //     total.arpu = getFixed(total.after_revenue / total.af_retn_newusr_num);
  //     total.year_trial_rate = getFixed((100 * total.year_trial_num) / total.af_retn_newusr_num);
  //     total.year_pay_rate = getFixed((100 * total.year_pay_num) / total.af_retn_newusr_num);
  //     total.year_success_rate = getFixed((100 * total.year_pay_num) / total.year_trial_num);

  //     tableRes.unshift(total);
  //   }
  // };

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
      if (search.countryOpt === 'in') {
        conditions.country_name__in = countryList.length > 0 ? countryList : undefined;
      } else {
        conditions.country_name__notIn = countryList.length > 0 ? countryList : undefined;
      }

      if (search.mediaSources.length > 0 && !search.mediaSources.includes(' ')) {
        conditions.media_source__in = search.mediaSources;
      }
      const where = whereSql(filterEmptyObj(conditions));
      const tableSql = dayListSQL.replace(/\?/g, where ? ` where ${where}` : '');
      const tableRes = await getData(tableSql);
      setTableList(tableRes || []);
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
  }, [search]);

  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <DownLoadButton key="导出" filename="投放爬虫数据" columns={columns} data={tableList} />
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
