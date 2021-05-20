/*
 * @Date: 2021-02-25 14:45:50
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-25 16:14:48
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, Radio, Spin,
} from 'antd';
import styles from './styles/index.less';
import Query from './components/Query';
// import { productMap } from './const';
import {
  getCompletion0Rate, getTableListProduct,
} from './components/sqlTemplate';
import { getData } from '../../../utils/request';
import { DownLoadButton } from '../../common/DownLoadButton';
import { chartLineRender } from '../../business/advLTV/components/chartRender';
import { AppProductList } from '../../business/advStatistics/components/utils';

/*
校验流程：
1：用户上传Excel，解析成json arr 存放rc.quvidep.vip/cdn/gh/{uuid}.json
2：将当前记录保存至数据库
3：校验流程：
    a：获取爬虫数据，比对偏差金额，计算偏差率
    b：提交审批，审批通过后，当月数据不允许变更及提交当月的数据
*/

export default () => {
  const [spinning, setSpinning] = useState(false);
  const [dayType, setDayType] = useState('1');
  const [dataList, setDataList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [chartDataMap, setChartDataMap] = useState({});
  const [search, setSearch] = useState({
    product: '',
    platform: '',
    vip: '',
    userType: '',
    countries: [],
    mediaSources: [],
    versions: [],
    campaignName: [],
    appVer: '',
    isVip: '',
    groupBy: 'platform',
    startDate: moment().subtract(31, 'days'),
    endDate: moment().subtract(1, 'days'),
  });

  const onSearch = async (params) => {
    console.log('params', params);
    setSearch(params);
  };

  const getWheres = () => {
    const {
      campaignName,
      countries,
      // endDate,
      mediaSources,
      platform,
      product,
      appVer,
      isVip,
      // startDate,
      // userType,
    } = search;
    let where = ' ';
    let where2 = ' ';
    let where3 = ' ';
    let where4 = ' ';
    let group = ' ';
    if (product) {
      where += ` and product_id=${product} `;
      where2 += ` and product_id=${product} `;
      where3 += ` and product_id=${product} `;
      where4 += ` and product_id=${product} `;
    }
    if (platform) {
      where += ` and platform = ${platform} `;
      where2 += ` and platform = ${platform} `;
      where3 += ` and platform = ${platform} `;
      where4 += ` and platform = ${platform} `;
    }
    if (isVip) {
      where += ` and is_vip = '${isVip}' `;
    }
    if (appVer) {
      where += ` and app_version_lst = '${appVer}' `;
    }
    if (mediaSources && mediaSources.length > 0) {
      where += ` and media_source in (${mediaSources.map(v => `'${v}'`).join(',')}) `;
      where2 += ` and media_source in (${mediaSources.map(v => `'${v}'`).join(',')}) `;
      where3 += ` and media_source in (${mediaSources.map(v => `'${v}'`).join(',')}) `;
      where4 += ` and media_source in (${mediaSources.map(v => `'${v}'`).join(',')}) `;
      group += ' ,media_source ';
    }
    if (campaignName && campaignName.length > 0) {
      // console.log('ca', campaignName);
      where += decodeURIComponent(encodeURIComponent(` and campaign_name in (${campaignName.map(v => `'${v}'`).join(',')}) `).replace(/%24%24/g, '######'));
      where2 += decodeURIComponent(encodeURIComponent(` and campaign_name in (${campaignName.map(v => `'${v}'`).join(',')}) `).replace(/%24%24/g, '######'));
      group += ' ,campaign_name ';
    }
    if (countries.length) {
      where += ` and country_name in (${countries.map(v => `'${v}'`).join(',')})`;
      where2 += ` and country_name in (${countries.map(v => `'${v}'`).join(',')})`;
      where3 += ` and country in (${countries.map(v => `'${v}'`).join(',')})`;
      where4 += ` and country in (${countries.map(v => `'${v}'`).join(',')})`;
      group += ' ,country_name ';
    }
    return {
      where, where2, where3, where4,
    };
  };

  const getFetchData = async () => {
    const dateFormat = 'YYYYMMDD';
    const {
      where,
    } = getWheres();
    console.log('wherewhere', where);
    const { startDate, endDate } = search;
    setSpinning(true);
    const chartSql = getCompletion0Rate.replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat))
      .replace(/#end1Date#/g, moment().subtract(1, 'days').format(dateFormat))
      .replace(/#end7Date#/g, moment().subtract(6, 'days').format(dateFormat))
      .replace(/#where#/g, where);
    console.log('chartSql', chartSql);
    const tableSql = dayType === '1' ? getTableListProduct.replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat))
      .replace(/#end1Date#/g, moment().subtract(1, 'days').format(dateFormat))
      .replace(/#end7Date#/g, moment().subtract(6, 'days').format(dateFormat))
      .replace(/#where#/g, where)
      .replace(/#select#/g, 'product_id')
      .replace(/#group#/g, 'product_id')
      .replace(/#order#/g, 'product_id') : getTableListProduct.replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat))
      .replace(/#end1Date#/g, moment().subtract(1, 'days').format(dateFormat))
      .replace(/#end7Date#/g, moment().subtract(6, 'days').format(dateFormat))
      .replace(/#where#/g, where)
      .replace(/#group#/g, 'ds')
      .replace(/#select#/g, 'ds')
      .replace(/#order#/g, 'ds desc');
    console.log('chartSql', chartSql);
    const chart1Data = await getData(chartSql);
    const dataList = await getData(tableSql);
    setDataList(dataList);
    const chartDataMap = {
      completion0Rate: [],
      d1ActiveRate: [],
      d7ExportRate: [],
      d7ActiveRate: [],
    };
    chart1Data.forEach((item) => {
      chartDataMap.completion0Rate.push({
        day: moment(item.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: item.completion0Rate ? +item.completion0Rate : 0,
        type: AppProductList[item.product_id],
      });
      chartDataMap.d1ActiveRate.push({
        day: moment(item.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: item.d1ActiveRate ? +item.d1ActiveRate : 0,
        type: AppProductList[item.product_id],
      });
      chartDataMap.d7ExportRate.push({
        day: moment(item.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: item.d7ExportRate ? +item.d7ExportRate : 0,
        type: AppProductList[item.product_id],
      });
      chartDataMap.d7ActiveRate.push({
        day: moment(item.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: item.d7ActiveRate ? +item.d7ActiveRate : 0,
        type: AppProductList[item.product_id],
      });
    });
    console.log('chartDataMap', chartDataMap);
    // setCompletion0Rate(resultArr);
    chartLineRender(chartDataMap.completion0Rate, 'chart1dCnt', 300, '', ['#391085', '#ff4d4f', '#820014', '#ffbb96', '#ad2102', '#ffd591', '#fa8c16', '#873800', '#ffc53d', '#874d00', '#fffb8f', '#fadb14', '#876800', '#40a9ff', '#0050b3', '#36cfc9', '#006d75', '#2f54eb', '#722ed1', '#531dab']);
    chartLineRender(chartDataMap.d1ActiveRate, 'chart2', 300, '', ['#391085', '#ff4d4f', '#820014', '#ffbb96', '#ad2102', '#ffd591', '#fa8c16', '#873800', '#ffc53d', '#874d00', '#fffb8f', '#fadb14', '#876800', '#40a9ff', '#0050b3', '#36cfc9', '#006d75', '#2f54eb', '#722ed1', '#531dab']);
    chartLineRender(chartDataMap.d7ExportRate, 'chart3', 300, '', ['#391085', '#ff4d4f', '#820014', '#ffbb96', '#ad2102', '#ffd591', '#fa8c16', '#873800', '#ffc53d', '#874d00', '#fffb8f', '#fadb14', '#876800', '#40a9ff', '#0050b3', '#36cfc9', '#006d75', '#2f54eb', '#722ed1', '#531dab']);
    chartLineRender(chartDataMap.d7ActiveRate, 'chart4', 300, '', ['#391085', '#ff4d4f', '#820014', '#ffbb96', '#ad2102', '#ffd591', '#fa8c16', '#873800', '#ffc53d', '#874d00', '#fffb8f', '#fadb14', '#876800', '#40a9ff', '#0050b3', '#36cfc9', '#006d75', '#2f54eb', '#722ed1', '#531dab']);
    setChartDataMap(chartDataMap);
    setSpinning(false);
  };

  const getColumns = () => {
    const columns = [
      {
        title: 'install',
        dataIndex: 'install',
        key: 'install',
      },
      {
        title: '首日活跃用户量',
        dataIndex: 'active_user_num_0d',
        key: 'active_user_num_0d',
      },
      {
        title: '首日制作用户量',
        dataIndex: 'export_user_num_0d',
        key: 'export_user_num_0d',
      },
      {
        title: '首日制作完成率',
        dataIndex: 'completion0Rate',
        key: 'completion0Rate',
      },
      {
        title: '次日活跃用户量',
        dataIndex: 'active_user_num_1d',
        key: 'active_user_num_1d',
      },
      {
        title: '次留',
        dataIndex: 'd1ActiveRate',
        key: 'd1ActiveRate',
      },
      {
        title: '次日制作用户量',
        dataIndex: 'export_user_num_1d',
        key: 'export_user_num_1d',
      },
      {
        title: '次日制作完成率',
        dataIndex: 'd1ExportRate',
        key: 'd1ExportRate',
      },
      {
        title: '第7日活跃用户量',
        dataIndex: 'active_user_num_7d',
        key: 'active_user_num_7d',
      },
      {
        title: '第7日留存率',
        dataIndex: 'd7ActiveRate',
        key: 'd7ActiveRate',
      },
      {
        title: '第7日制作用户量',
        dataIndex: 'export_user_num_7d',
        key: 'export_user_num_7d',
      },
      {
        title: '第7日制作完成率',
        dataIndex: 'd7ExportRate',
        key: 'd7ExportRate',
      },
    ];
    if (dayType === '1') {
      setColumns([{
        title: '产品',
        dataIndex: 'product_id',
        key: 'product_id',
        width: 100,
        fixed: 'left',
        render: text => (text ? AppProductList[text] : text),
      }].concat(columns));
    } else {
      setColumns([{
        title: '日期',
        dataIndex: 'ds',
        key: 'ds',
        width: 100,
        fixed: 'left',
      }].concat(columns));
    }
    // setColumns(columns);
  };

  useEffect(() => {
    getFetchData();
  }, [search, dayType]);
  useEffect(() => {
    getColumns();
  }, [dayType]);
  return (
    <div className={styles.wrapper}>
      <Spin spinning={spinning}>
        <Query search={search} onSearch={onSearch} />
        <div>
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>
              <span>首日制作完成率</span>
              <DownLoadButton filename="首日制作完成率" data={chartDataMap.completion0Rate || []} />
            </div>
            <div>
              <div id="chart1dCnt" />
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>
              <span>次留</span>
              <DownLoadButton filename="次留" data={chartDataMap.d1ActiveRate || []} />
            </div>
            <div>
              <div id="chart2" />
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>
              <span>第7日制作完成率</span>
              <DownLoadButton filename="第7日制作完成率" data={chartDataMap.d7ExportRate || []} />
            </div>
            <div>
              <div id="chart3" />
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>
              <span>第7日留存</span>
              <DownLoadButton filename="第7日留存" data={chartDataMap.d7ActiveRate || []} />
            </div>
            <div>
              <div id="chart4" />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16 } }/>
        <Radio.Group value={dayType} onChange={e => setDayType(e.target.value)}>
          <Radio.Button value="1" key="1">
            产品
          </Radio.Button>
          <Radio.Button value="2" key="2">
            日期
          </Radio.Button>
        </Radio.Group>
        <DownLoadButton filename="用户质量数据" columns={columns} data={dataList} />
        <Table columns={columns} dataSource={dataList} pagination={false} loading={spinning} scroll={{ x: 1500 }}/>
      </Spin>
    </div>
  );
};
