/* eslint-disable react/no-this-in-sfc */
import React, { useState, useEffect } from 'react';
import { Table, Tooltip, Icon } from 'antd';
import moment from 'moment';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';
import Query from '../components/Query';
import { getData } from '../../../../utils/request';
import { areaListSQL, stackListSQL, tableListSQL } from '../components/sqlTemplate';
import { whereSql } from '../components/utils';
import { areaChartRender, blockChartRender } from '../components/chartRender';
import { filterEmptyObj } from '../../../../utils/utils';
import { products } from '../components/constant';
import { DownLoadButton } from '../../../common/DownLoadButton';

export default () => {
  const [loading, setLoading] = useState(false);
  const [dataType, setDataType] = useState('reg_num');
  const [areaChartList, setAreaChartList] = useState([]);
  const [stackChartList, setStackChartList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState({
    startDate: moment()
      .subtract(5, 'months')
      .startOf('month'),
    endDate: moment()
      .subtract(1, 'month')
      .endOf('month'),
    countries: null,
    platform: '1',
    product: '',
  });

  const onSearch = (params) => {
    setSearch(params);
  };

  const width = 120;

  const sorter = () => function sort(a, b) {
    return a[this.key] - b[this.key];
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'ds',
      key: 'ds',
      width,
    },
    {
      title: '地区',
      dataIndex: 'country_name',
      key: 'country_name',
      width,
    },
    {
      title: '自然',
      dataIndex: '自然',
      key: '自然',
      children: [
        {
          title: 'arpu',
          dataIndex: 'arpu_organic',
          key: 'arpu_organic',
          width,
        },
        {
          title: '新用户销售额',
          dataIndex: 'amt_total_organic',
          key: 'amt_total_organic',
          width,
          sorter: sorter(),
        },
        {
          title: '新增',
          dataIndex: 'reg_num_organic',
          key: 'reg_num_organic',
          width,
          sorter: sorter(),
        },
        {
          title: '新用户销售额占比',
          dataIndex: 'new_amt_organic',
          key: 'new_amt_organic',
          width,
          render: text => `${text || 0}%`,
        },
        {
          title: '新增占比',
          dataIndex: 'new_usr_organic',
          key: 'new_usr_organic',
          width,
          render: text => `${text || 0}%`,
        },
      ],
    },
    {
      title: '投放',
      dataIndex: '投放',
      key: '投放',
      children: [
        {
          title: 'arpu',
          dataIndex: 'arpu_no_organic',
          key: 'arpu_no_organic',
          width,
        },
        {
          title: '新用户销售额',
          dataIndex: 'amt_total_no_organic',
          key: 'amt_total_no_organic',
          width,
          sorter: sorter(),
        },
        {
          title: '新增',
          dataIndex: 'reg_num_no_organic',
          key: 'reg_num_no_organic',
          width,
          sorter: sorter(),
        },
        {
          title: '新用户销售额占比',
          dataIndex: 'new_amt_no_organic',
          key: 'new_amt_no_organic',
          width,
          render: text => `${text || 0}%`,
        },
        {
          title: '新增占比',
          dataIndex: 'new_usr_no_organic',
          key: 'new_usr_no_organic',
          width,
          render: text => `${text || 0}%`,
        },
      ],
    },
  ];

  const drawChart = () => {
    let areaChartData = areaChartList.map(v => ({
      day: v.ds,
      value: v[dataType],
      type: products[v.product_id],
    }));
    areaChartData = areaChartData
      .filter(v => v.type) // 排除产品为空的
      .sort((a, b) => (a.day > b.day ? 1 : -1));

    let stackChartData = stackChartList.map(v => ({
      day: v.ds,
      value: v[dataType],
      type: v.media_source,
      tip: `${v[dataType]}(${(
        (100 * v[dataType])
        / stackChartList.filter(day => day.ds === v.ds).reduce((pre, current) => current[dataType] + pre, 0)
      ).toFixed(2)}%)`,
    }));
    stackChartData = stackChartData.sort((a, b) => (a.day > b.day ? 1 : -1));

    areaChartRender(areaChartData, 'areaChart');
    blockChartRender(stackChartData, 'blockChart');
  };

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
      conditions.country_name__in = countryList.length > 0 ? countryList : undefined;
      const where = whereSql(filterEmptyObj(conditions));
      const areasql = areaListSQL.replace('?', where ? ` where ${where}` : '');
      const stacksql = stackListSQL.replace('?', where ? ` where ${where}` : '');
      const tableSql = tableListSQL.replace('?', where ? ` where ${where}` : '');

      const areadata = await getData(areasql);
      const stackdata = await getData(stacksql);
      const tableRes = await getData(tableSql);

      setAreaChartList(areadata || []);
      setStackChartList(stackdata || []);
      setTableList(tableRes || []);
    } catch (ex) {
      console.error(ex);
      setAreaChartList([]);
      setStackChartList([]);
      setTableList([]);
    } finally {
      setLoading(false);
    }
  };

  const exportColumns = [
    {
      title: '时间',
      dataIndex: 'ds',
      key: 'ds',
      width,
    },
    {
      title: '地区',
      dataIndex: 'country_name',
      key: 'country_name',
      width,
    },
    {
      title: '自然arpu',
      dataIndex: 'arpu_organic',
      key: 'arpu_organic',
      width,
    },
    {
      title: '自然新用户销售额',
      dataIndex: 'amt_total_organic',
      key: 'amt_total_organic',
      width,
    },
    {
      title: '自然新增',
      dataIndex: 'reg_num_organic',
      key: 'reg_num_organic',
      width,
    },
    {
      title: '自然新用户销售额占比',
      dataIndex: 'new_amt_organic',
      key: 'new_amt_organic',
      width,
      render: text => `${text || 0}%`,
    },
    {
      title: '自然新增占比',
      dataIndex: 'new_usr_organic',
      key: 'new_usr_organic',
      width,
      render: text => `${text || 0}%`,
    },
    {
      title: '投放arpu',
      dataIndex: 'arpu_no_organic',
      key: 'arpu_no_organic',
      width,
    },
    {
      title: '投放新用户销售额',
      dataIndex: 'amt_total_no_organic',
      key: 'amt_total_no_organic',
      width,
    },
    {
      title: '投放新增',
      dataIndex: 'reg_num_no_organic',
      key: 'reg_num_no_organic',
      width,
    },
    {
      title: '投放新用户销售额占比',
      dataIndex: 'new_amt_no_organic',
      key: 'new_amt_no_organic',
      width,
      render: text => `${text || 0}%`,
    },
    {
      title: '投放新增占比',
      dataIndex: 'new_usr_no_organic',
      key: 'new_usr_no_organic',
      width,
      render: text => `${text || 0}%`,
    },
  ];

  // const exportExcel = () => {
  //   const filterVal = ['ds', 'country_name', 'arpu_organic', 'amt_total_organic', 'reg_num_organic',
  //     'new_amt_no_organic', 'new_usr_organic', 'arpu_no_organic', 'amt_total_no_organic', 'reg_num_no_organic',
  //     'new_amt_no_organic', 'new_usr_no_organic'];
  //   const list = tableList;
  //   const data = list.map(v => (filterVal.map(j => v[j])));
  //   export_json_to_excel({
  //     multiHeader: [['时间', '地区', '自然', '', '', '', '', '投放', '', '', '', '']],
  //     header: ['', '', 'arpu', '新用户销售额', '新增', '新用户销售额占比', '新增占比', 'arpu', '新用户销售额', '新增', '新用户销售额占比', '新增占比'],
  //     data,
  //     filename: '新用户收入来源',
  //     merges: ['A1:A2', 'B1:B2', 'C1:G1', 'H1:L1'],
  //   });
  // };

  useEffect(() => {
    drawChart();
  }, [areaChartList, stackChartList, dataType]);

  useEffect(() => {
    setCurrentPage(1);
    getDataList();
  }, [search]);

  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <RadioGroup
        style={{ marginBottom: 8 }}
        value={dataType}
        onChange={e => setDataType(e.target.value)}
        buttonStyle="solid"
      >
        <RadioButton key="" value="reg_num">
          新增用户
        </RadioButton>
        <RadioButton key="" value="amt_total">
          新用户销售
        </RadioButton>
      </RadioGroup>
      <div id="areaChart" />
      <div id="blockChart" />
      <div
        style={{
          padding: '10px 0 10px 0',
          borderTopWidth: 1,
          borderTopColor: '#e8e8e8',
          borderTopStyle: 'solid',
        }}
      >
        <DownLoadButton filename="新用户收入来源" columns={exportColumns} data={tableList} />
        <Tooltip overlayStyle={{ maxWidth: 420 }} placement="right" overlay={
          <div>
            <span>
              新增为客户端新增
              <br />
            </span>
            <span>
            数据为月度结算,当月新增用户在该月产生的销售额
              <br />
            </span>
          </div>
        }>
          <Icon style={{ fontSize: 18 }} type="question-circle" />
        </Tooltip>
      </div>
      <Table
        dataSource={tableList}
        columns={columns}
        loading={loading}
        bordered
        pagination={{
          hideOnSinglePage: true,
          current: currentPage,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
        scroll={{ x: 'max-content', y: 600 }}
      />
    </div>
  );
};
