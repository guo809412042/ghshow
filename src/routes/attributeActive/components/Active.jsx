/* eslint-disable max-len */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-lonely-if */
/* eslint-disable no-restricted-syntax */
/**
 * @File: Index.jsx
 * @Author: Zero
 * @Date: 2020/05/12
 * @Copyright(c) QuVideo F2E Team
 * @Email: zerong.peng@quvideo.com
 * @comment: viva归因-活跃数据统计
 */

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Radio, Table, Checkbox, Select, Tag, Tooltip, Icon,
} from 'antd';
import G2 from '@antv/g2';
import Query from './Query';
// import StackPlot from '../components/StackPlot';
import { getData } from '../../../utils/request';
import { createSqlWhere, getFixed } from '../../../utils/utils';
import {
  attrActSQL,
  attrActNoCountrySQL,
  attrActNoDsSQL,
  attrActNoDsNoCountrySql,
  attrActSumNoDsSQL,
  attrActSumNoCountrySQL,
  campaignNameSQL,
  attrActSumSourceGroupBySQL,
} from './sqlTemplate';
import { chartRender } from '../chartRender';
import styles from '../styles/index.less';
import {
  COUNTRY_LIST, COLUMNS, TOTALCOLUMNS, SALECOLUMNS, tagColors,
} from '../const';
import { DownLoadButton } from '../../common/DownLoadButton';

const Index = ({ productId = 2 }) => {
  const [radio, setRadio] = useState('new_dvc_cnt');
  const [search, setSearch] = useState({
    country: ['全部'],
    platform: '',
    type: 'country',
    source: [''],
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
  });

  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [baseColumn, setBaseColumn] = useState(true);
  const [saleColumn, setSaleColumn] = useState(true);
  const [totalColumns, setTotalColumns] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [campaign, setCampaign] = useState([]);
  const [span, setSpan] = useState('day');
  const [chart, setChart] = useState();
  const [chartType, setChartType] = useState('stack');
  const [status, setStatus] = useState('hidden');
  const [loading, setLoading] = useState(false);
  const [groupBySource, setGroupBySource] = useState('');
  // const [groupTotalColumns, setGroupTotalColumns] = useState([]);
  const [groupTotalData, setGroupTotalData] = useState([]);
  const [totalGroupby, setTotalGroupby] = useState('campign');

  const columns = [
    {
      dataIndex: search.type,
      title: search.type === 'country' ? '地区' : '来源',
      extendInfo: search.type === 'country' ? '地区' : '来源',
      key: search.type,
      width: 120,
    },
  ].concat(COLUMNS);

  const getWheres = () => {
    const {
      type, country, platform, source,
    } = search;
    let where = ` and product_id=${productId} `;
    if (platform) {
      where += ` and plat_form = ${platform} `;
    }
    if (!source.includes('')) {
      if (source && source.length > 0) {
        where += ` and media_source in (${source.map(v => `'${v}'`).join(',')}) `;
      }
    }
    // 数据那边聚合过的统计数据，当查询全部时需要过滤掉
    const duplicate = ['全部', '第一梯度', '第二梯度', '第三梯度'];
    // 当地区包含全部选项且按地区维度查询时，需要查询“中美日韩台泰巴西印度尼西亚+其他”
    let otherWhere = where;
    if (country.length) {
      if (country.includes('全部')) {
        where += ` and (country is null or country not in (${duplicate.map(v => `'${v}'`).join(',')}))`;
        return { where };
      }
      if (country.includes('重点地区')) {
        if (type === 'country') {
          // 中美日韩台泰巴西印度尼西亚
          where += ` and country in (${country
            .filter(v => v !== '全部')
            .concat(COUNTRY_LIST['1'])
            .map(v => `'${v}'`)
            .join(',')})`;
          // 其他地区
          otherWhere += ` and (country is null or country not in (${COUNTRY_LIST['1']
            .concat(duplicate)
            .map(v => `'${v}'`)
            .join(',')}))`;
          return { where, otherWhere };
        }
        where += ` and (country is null or country not in (${duplicate.map(v => `'${v}'`).join(',')}))`;
        return { where };
      }
      where += ` and country in (${country.map(v => `'${v}'`).join(',')})`;

      return { where };
    }
  };

  // 增加汇总行
  const addTotal = (tableRes, type) => {
    if (tableRes && tableRes.length > 1) {
      const total = {};
      tableRes.forEach((v) => {
        for (const key in v) {
          if (Object.prototype.hasOwnProperty.call(v, key)) {
            total[key] = tableRes.reduce((total, curr) => getFixed(total + curr[key]), 0);
          }
        }
      });
      total[`${type}`] = '合计';
      total[`${totalGroupby}`] = '合计';
      total.arpdau = getFixed(total.cost / total.dau);
      tableRes.unshift(total);
    }
  };

  // 获取活跃数据
  const getList = async () => {
    const { type, startDate, endDate } = search;
    const { where, otherWhere = '' } = getWheres();
    // let res = await getData(
    //   createSqlWhere({
    //     sql: attrActSQL,
    //     startDate,
    //     endDate,
    //     type,
    //     where,
    //   }),
    // );
    // if (otherWhere) {
    //   const otherRes = await getData(
    //     createSqlWhere({
    //       sql: attrActNoCountrySQL,
    //       startDate,
    //       endDate,
    //       where: otherWhere,
    //     }),
    //   );
    //   res = res.concat(
    //     otherRes.map(v => ({
    //       ...v,
    //       [type]: '其他',
    //     })),
    //   );
    // }
    // // 导出数据需要按日期分组，所以导图表数据
    // setChartData(res);

    // 活跃表格数据
    let tableRes = await getData(
      createSqlWhere({
        sql: attrActNoDsSQL,
        startDate,
        endDate,
        type,
        where,
      }),
    );
    if (otherWhere) {
      const otherTableRes = await getData(
        createSqlWhere({
          sql: attrActNoDsNoCountrySql,
          startDate,
          endDate,
          where: otherWhere,
        }),
      );
      tableRes = tableRes.concat(
        otherTableRes.map(v => ({
          ...v,
          [type]: '其他',
        })),
      );
    }
    if (chart) {
      chart.clear();
      // chartRender(chart, [{ day: null, value: null, type: null }], chartType);
    }
    // 加入合计行
    addTotal(tableRes, type);
    // 地区或来源为空的，不展示
    tableRes = tableRes.filter(v => v[type]);
    setData(tableRes);
  };

  const getWeekIndex = (start, ds) => {
    const startDate = moment(start);
    const date = moment(ds, 'YYYYMMDD');
    const diff = date.diff(startDate, 'day');
    return Math.floor(diff / 7);
  };

  const getMonthIndex = (ds) => {
    const date = moment(ds, 'YYYYMMDD');
    return date.format('YYYY-MM');
  };

  // 刷新图表
  const drawChart = async () => {
    // 根据日周月分类处理chart数据
    let result = [];
    const tmpObj = {};
    const { type, startDate, endDate } = search;
    const { where, otherWhere = '' } = getWheres();
    let res = await getData(
      createSqlWhere({
        sql: attrActSQL,
        startDate,
        endDate,
        type,
        where,
      }).replace(/#radio#/g, radio),
    );
    if (otherWhere) {
      const otherRes = await getData(
        createSqlWhere({
          sql: attrActNoCountrySQL,
          startDate,
          endDate,
          where: otherWhere,
        }),
      );
      res = res.concat(
        otherRes.map(v => ({
          ...v,
          [type]: '其他',
        })),
      );
    }
    // 导出数据需要按日期分组，所以导图表数据
    // setChartData(res);
    // addTotal(res, type);

    const sixLine = data
      .sort((a, b) => b[radio] - a[radio])
      .slice(data.length > 1 ? 1 : 0, search.country.includes('重点地区') ? 9 : 7)
      .map(v => v[search.type]);
    let otherData = [];
    let showData = [];
    if (sixLine.length === (search.country.includes('重点地区') ? 8 : 6)) {
      const tempObj = {};
      res.forEach((v) => {
        if (sixLine.includes(v[search.type]) && v.country !== '其他') {
          showData.push(v);
        } else {
          // 剩下的都按ds分组累加到其他
          if (tempObj[v.ds]) {
            // tempObj[v.ds].value += v[radio];
            tempObj[v.ds].new_dvc_cnt += v.new_dvc_cnt;
            tempObj[v.ds].o_new_dvc_cnt += v.o_new_dvc_cnt;
            tempObj[v.ds].o_sale_amt += v.o_sale_amt;
            tempObj[v.ds].p_new_dvc_cnt += v.p_new_dvc_cnt;
            tempObj[v.ds].p_sale_amt += v.p_sale_amt;
            tempObj[v.ds].sale_amt += v.sale_amt;
          } else {
            tempObj[v.ds] = {
              [search.type]: '其他',
              ds: v.ds,
              new_dvc_cnt: v.new_dvc_cnt,
              o_new_dvc_cnt: v.o_new_dvc_cnt,
              o_sale_amt: v.o_sale_amt,
              p_new_dvc_cnt: v.p_new_dvc_cnt,
              p_sale_amt: v.p_sale_amt,
              sale_amt: v.sale_amt,
            };
          }
        }
      });
      const keys = Object.keys(tempObj);
      otherData = keys.map(v => tempObj[v]);
      showData = showData.concat(otherData);
    } else {
      showData = res;
    }

    setChartData(showData);

    showData.forEach((v) => {
      let wIndex = 0;
      let weekObj;
      let mIndex = 0;
      let monthObj;
      switch (span) {
        case 'week':
          // 获取该记录的ds在span的第几周
          wIndex = getWeekIndex(search.startDate, v.ds);
          weekObj = tmpObj[v[search.type] + wIndex] || { value: 0 };
          weekObj.type = v[search.type];
          weekObj.value += v[radio];
          weekObj.day = moment(search.startDate)
            .add(wIndex * 7, 'day')
            .format('YYYYMMDD');
          if (!tmpObj[v[search.type] + wIndex]) {
            result.push(weekObj);
            tmpObj[v[search.type] + wIndex] = weekObj;
          }
          break;
        case 'month':
          // 获取该记录的月
          mIndex = getMonthIndex(v.ds);
          monthObj = tmpObj[v[search.type] + mIndex] || { value: 0 };
          monthObj.type = v[search.type];
          monthObj.value += v[radio];
          monthObj.day = mIndex;
          if (!tmpObj[v[search.type] + mIndex]) {
            result.push(monthObj);
            tmpObj[v[search.type] + mIndex] = monthObj;
          }
          break;
        case 'day':
        default:
          result.push({
            type: v[search.type],
            value: v[radio],
            day: moment(v.ds).format('YYYY-MM-DD'),
          });
          break;
      }
    });

    console.time('chart');
    // 小数点处理
    result.forEach((v) => {
      v.value = getFixed(v.value);
    });
    // result = result.sort((a, b) => a.type - b.type);
    const groups = sixLine.reduce((sum, v) => {
      sum = sum.concat(result.filter(i => i.type === v));
      return sum;
    }, []);
    if (!search.country.includes('重点地区')) {
      result = groups.concat(result.filter(i => i.type === '其他'));
    }
    console.timeEnd('chart');
    // 绘制图表
    chartRender(chart, result, chartType);
    if (result.length === 0) {
      setStatus('nodata');
    } else {
      setStatus('hidden');
    }
  };

  const getTotalList = async () => {
    try {
      setLoading(true);
      const { type, startDate, endDate } = search;
      let { where, otherWhere = '' } = getWheres();
      if (!campaign.includes('')) {
        if (campaign && campaign.length > 0) {
          where += ` and campign in (${campaign.map(v => `'${v}'`).join(',')}) `;
        }
      }

      // 汇总表格数据
      let totalRes = await getData(
        createSqlWhere({
          sql: attrActSumNoDsSQL,
          startDate,
          endDate,
          type,
          where,
        }),
      );
      if (otherWhere) {
        if (!campaign.includes('')) {
          if (campaign && campaign.length > 0) {
            otherWhere += ` and campign in (${campaign.map(v => `'${v}'`).join(',')}) `;
          }
        }
        const otherTotalRes = await getData(
          createSqlWhere({
            sql: attrActSumNoCountrySQL,
            startDate,
            endDate,
            type,
            where: otherWhere,
          }),
        );
        totalRes = totalRes.concat(
          otherTotalRes.map(v => ({
            ...v,
            [type]: '其他',
          })),
        );
      }
      // 先计算arpdau值
      // totalRes.forEach(v => v.arpdau = v.revenue / v.dau);
      // 加入合计行
      addTotal(totalRes, type);
      totalRes = totalRes.sort((a, b) => b.INSTALL - a.INSTALL);
      totalRes = totalRes.filter(v => v[type]);
      setTotalData(totalRes);
    } catch (ex) {
      console.log(ex);
    } finally {
      setLoading(false);
    }
  };

  const getTotalGroupList = async () => {
    try {
      setLoading(true);
      const { type, startDate, endDate } = search;
      let { where } = getWheres();
      where += ` and media_source='${groupBySource}' `;
      if (!campaign.includes('')) {
        if (campaign && campaign.length > 0) {
          where += ` and campign in (${campaign.map(v => `'${v}'`).join(',')}) `;
        }
      }

      // 汇总表格数据
      let totalRes = await getData(
        createSqlWhere({
          sql: attrActSumSourceGroupBySQL.replace(/#totalGroupBy#/g, totalGroupby),
          startDate,
          endDate,
          type,
          where,
        }),
      );
      // 加入合计行
      addTotal(totalRes, type);
      totalRes = totalRes.sort((a, b) => b.INSTALL - a.INSTALL);
      // totalRes = totalRes.filter(v => v[type]);
      setGroupTotalData(totalRes);
    } catch (ex) {
      console.log(ex);
    } finally {
      setLoading(false);
    }
  };

  const getCampaignList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: campaignNameSQL,
        // product: productId ? ` and product_id = '${productId}'` : '',
        // platform: ' and platform=\'2\'', // search.platform ? ` and platform='${search.platform}'` : '',
      }),
    );
    setCampaignList(res || []);
  };

  const tagClose = () => {
    setGroupBySource('');
  };

  const groupByCampagin = (text, record) => {
    console.log(text, record);
    setGroupBySource(text);
    setGroupTotalData([]);
  };

  useEffect(() => {
    setStatus('loading');
    getList();
  }, [search]);

  useEffect(() => {
    if (groupBySource) {
      getTotalGroupList();
    } else {
      getTotalList();
    }
  }, [search, campaign, groupBySource, totalGroupby]);

  useEffect(() => {
    // // 刷新图表时表格数据先按radio类型排序
    setStatus('loading');
    drawChart();
  }, [data, radio, span, chartType]);

  useEffect(() => {
    setChart(
      new G2.Chart({
        container: document.getElementById('chart'),
        height: 300,
        // width: node.offsetWidth,
        padding: 'auto',
        forceFit: true,
        animate: true,
      }),
    );
    getCampaignList();
  }, []);

  useEffect(() => {
    let columns = [
      {
        dataIndex: search.type,
        title: search.type === 'country' ? '地区' : '来源',
        key: search.type,
        width: 120,
        render: (text, record) => {
          if (search.type === 'country' || record[`${search.type}`] === '合计') {
            return text;
          }
          return <a onClick={() => groupByCampagin(text, record)}>{text}</a>;
        },
      },
    ];
    if (baseColumn) {
      columns = columns.concat(TOTALCOLUMNS);
    }
    if (saleColumn) {
      columns = columns.concat(SALECOLUMNS);
    }
    if (groupBySource) {
      columns[0] = {
        dataIndex: totalGroupby,
        title: totalGroupby === 'country' ? '地区' : 'campign',
        key: totalGroupby,
        width: 120,
        render: text => text || '未知',
      };
    }
    setTotalColumns(columns);
  }, [search, baseColumn, saleColumn, groupBySource, totalGroupby]);

  return (
    <div>
      <div>
        <p
          style={{
            fontWeight: 500,
            fontSize: 18,
          }}
        >
          活跃数据
          <Tooltip title="新增为客户端新增">
            <Icon type="question-circle" />
          </Tooltip>
        </p>

        <Query onSearch={setSearch} search={search} colmuns={columns} chartData={chartData} changeSpan={setSpan} />
        <div>
          <Radio.Group
            buttonStyle="solid"
            key="1"
            style={{
              position: 'absolute',
              height: 50,
              lineHeight: '50px',
              paddingLeft: 20,
            }}
            value={chartType}
            onChange={e => setChartType(e.target.value)}
          >
            <Radio.Button key="1" value="stack">
              <svg title="堆积图" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                <path
                  d="M.952 10.76a.5.5 0 1 1-.822-.57l3.439-4.964a.5.5 0 0 1 .726-.103L8.893 8.86l4.178-5.596a.5.5 0 1 1 .801.599l-4.49 6.013a.5.5 0 0 1-.716.089L4.082 6.24.951 10.76z"
                  fill="currentColor"
                />
              </svg>
            </Radio.Button>
            <Radio.Button key="2" value="area">
              <svg title="面积图" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                <path d="M0 7h4v4H0V7zm5-2h4v6H5V5zm5-2h4v8h-4V3z" fill="currentColor" />
              </svg>
            </Radio.Button>
          </Radio.Group>
          <Radio.Group
            buttonStyle="solid"
            style={{ textAlign: 'center', margin: '10px auto', width: '100%' }}
            value={radio}
            key="2"
            onChange={e => setRadio(e.target.value)}
          >
            <Radio.Button key="new_dvc_cnt" value="new_dvc_cnt">
              总新增
            </Radio.Button>
            <Radio.Button key="o_new_dvc_cnt" value="o_new_dvc_cnt">
              自然新增
            </Radio.Button>
            <Radio.Button key="p_new_dvc_cnt" value="p_new_dvc_cnt">
              投放新增
            </Radio.Button>
            <Radio.Button key="sale_amt" value="sale_amt">
              总销售额
            </Radio.Button>
            <Radio.Button key="o_sale_amt" value="o_sale_amt">
              自然销售额
            </Radio.Button>
            <Radio.Button key="p_sale_amt" value="p_sale_amt">
              投放销售额
            </Radio.Button>
          </Radio.Group>
        </div>
        <div style={{ position: 'relative' }}>
          <div className={`${styles.maskWrapper} ${styles[status]}`} asdf={status}>
            {status === 'nodata' && (
              <div>
                <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(0 1)" fill="none" fillRule="evenodd">
                    <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7" />
                    <g fillRule="nonzero" stroke="#D9D9D9">
                      <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
                      <path
                        d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                        fill="#FAFAFA"
                      />
                    </g>
                  </g>
                </svg>
                <p style={{ color: 'rgba(0, 0, 0, 0.25)' }}>No Data</p>
              </div>
            )}
            {status === 'loading' && (
              <div>
                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIzMiIgaWQ9ImxvYWRpbmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Ik0xNCAwIEgxOCBWOCBIMTQgeiIgb3BhY2l0eT0iLjEiIHRyYW5zZm9ybT0icm90YXRlKDAgMTYgMTYpIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBiZWdpbj0iMCIgZHVyPSIxcyIgZnJvbT0iMSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHRvPSIuMSIvPjwvcGF0aD48cGF0aCBkPSJNMTQgMCBIMTggVjggSDE0IHoiIG9wYWNpdHk9Ii4xIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSAxNiAxNikiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGJlZ2luPSIwLjEyNXMiIGR1cj0iMXMiIGZyb209IjEiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB0bz0iLjEiLz48L3BhdGg+PHBhdGggZD0iTTE0IDAgSDE4IFY4IEgxNCB6IiBvcGFjaXR5PSIuMSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgMTYgMTYpIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBiZWdpbj0iMC4yNXMiIGR1cj0iMXMiIGZyb209IjEiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB0bz0iLjEiLz48L3BhdGg+PHBhdGggZD0iTTE0IDAgSDE4IFY4IEgxNCB6IiBvcGFjaXR5PSIuMSIgdHJhbnNmb3JtPSJyb3RhdGUoMTM1IDE2IDE2KSI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgYmVnaW49IjAuMzc1cyIgZHVyPSIxcyIgZnJvbT0iMSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHRvPSIuMSIvPjwvcGF0aD48cGF0aCBkPSJNMTQgMCBIMTggVjggSDE0IHoiIG9wYWNpdHk9Ii4xIiB0cmFuc2Zvcm09InJvdGF0ZSgxODAgMTYgMTYpIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBiZWdpbj0iMC41cyIgZHVyPSIxcyIgZnJvbT0iMSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHRvPSIuMSIvPjwvcGF0aD48cGF0aCBkPSJNMTQgMCBIMTggVjggSDE0IHoiIG9wYWNpdHk9Ii4xIiB0cmFuc2Zvcm09InJvdGF0ZSgyMjUgMTYgMTYpIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBiZWdpbj0iMC42NzVzIiBkdXI9IjFzIiBmcm9tPSIxIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdG89Ii4xIi8+PC9wYXRoPjxwYXRoIGQ9Ik0xNCAwIEgxOCBWOCBIMTQgeiIgb3BhY2l0eT0iLjEiIHRyYW5zZm9ybT0icm90YXRlKDI3MCAxNiAxNikiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGJlZ2luPSIwLjc1cyIgZHVyPSIxcyIgZnJvbT0iMSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHRvPSIuMSIvPjwvcGF0aD48cGF0aCBkPSJNMTQgMCBIMTggVjggSDE0IHoiIG9wYWNpdHk9Ii4xIiB0cmFuc2Zvcm09InJvdGF0ZSgzMTUgMTYgMTYpIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBiZWdpbj0iMC44NzVzIiBkdXI9IjFzIiBmcm9tPSIxIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdG89Ii4xIi8+PC9wYXRoPjwvZz48L3N2Zz4=" />
                <p>Loading</p>
              </div>
            )}
          </div>
          <div id="chart" />
        </div>
        <Table
          columns={columns.map(v => ({ ...v, title: <Tooltip title={v.key}>{v.extendInfo}</Tooltip> }))}
          dataSource={data.sort((a, b) => b[radio] - a[radio])}
          bordered
          pagination
          scroll={{ x: 'max-content' }}
        />
      </div>
      <div>
        <p
          style={{
            borderTop: '1px solid #e8e8e8',
            margin: '20px 0',
            fontWeight: 500,
            fontSize: 18,
            height: 50,
            lineHeight: '50px',
          }}
        >
          汇总数据
        </p>
        <div style={{ marginBottom: 10 }}>
          <Checkbox
            defaultChecked={baseColumn}
            key="1"
            onChange={(e) => {
              setBaseColumn(e.target.checked);
            }}
          >
            基础数据
          </Checkbox>
          <Checkbox
            defaultChecked={saleColumn}
            key="2"
            onChange={(e) => {
              setSaleColumn(e.target.checked);
            }}
          >
            订单数据
          </Checkbox>
          <Select
            allowClear
            showSearch
            style={{ width: 250, marginRight: 8 }}
            placeholder="请选择输入campaign"
            value={campaign}
            onChange={setCampaign}
            mode="multiple"
          >
            {/* <Select.Option key="" value="">
              全部campaign
            </Select.Option> */}
            {campaignList.map(campaign => (
              <Select.Option key={campaign.campaign_name} value={campaign.campaign_name}>
                {campaign.campaign_name}
              </Select.Option>
            ))}
          </Select>
          <DownLoadButton filename="活跃汇总数据" columns={totalColumns} data={totalData} />
          {campaign && campaign.length > 0 && (
            <div style={{ lineHeight: '50px' }}>
              {campaign.map((v, index) => (
                <Tag color={tagColors[index]} key={v} onClose={() => tagClose()}>
                  {v}
                </Tag>
              ))}
            </div>
          )}
        </div>
        {groupBySource ? (
          <div>
            <div>
              <Tag color={tagColors[2]} key={groupBySource} closable onClose={() => tagClose()}>
                {`media_source:${groupBySource}`}
              </Tag>
            </div>
            <Radio.Group
              buttonStyle="solid"
              style={{ marginBottom: 8, marginTop: 8 }}
              value={totalGroupby}
              onChange={(e) => {
                setTotalGroupby(e.target.value);
              }}
            >
              <Radio.Button key="campaign" value="campign">
                campaign
              </Radio.Button>
              <Radio.Button key="country" value="country">
                地区
              </Radio.Button>
            </Radio.Group>
            <Table
              columns={totalColumns.map(v => ({ ...v, title: <Tooltip title={v.extendInfo}>{v.key}</Tooltip> }))}
              dataSource={groupTotalData}
              bordered
              pagination
              loading={loading}
              scroll={{ x: 'max-content' }}
            />
          </div>
        ) : (
          <Table
            columns={totalColumns.map(v => ({ ...v, title: <Tooltip title={v.extendInfo}>{v.key}</Tooltip> }))}
            dataSource={totalData}
            bordered
            pagination
            loading={loading}
            scroll={{ x: 'max-content' }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
