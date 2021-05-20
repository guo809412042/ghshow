import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import Query from './components/Query';
import styles from './styles/index.less';
import { getData } from '../../../utils/request';
import { DownLoadButton } from '../../common/DownLoadButton';
import { estimateLTVColumns, realLTVColumns } from './const';
import { chartRender } from '../newUserPay/components/chartRender';
import { realLTVSQL, predictLTVSQL } from './components/sqlTemplate';
import { groupSignal } from '../trialConvertion/utils';
import { getNumber } from '../../../utils/utils';
import { chartLineRender } from './components/chartRender';

export default () => {
  const [search, setSearch] = useState({
    product: 'VivaVideo',
    platform: '1',
    countryOpt: 'in',
    countries: [],
    campaign: undefined,
    mediaSource: undefined,
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(1, 'days'),
  });

  const [estimateLTVList, setEstimateLTVList] = useState([]);
  const [realLTVList, setRealLTVList] = useState([]);
  const [stayChartList, setStayChartList] = useState([]);
  const [LTVChartList, setLTVChartList] = useState([]);

  const onSearch = async (params) => {
    setSearch(params);
  };

  const getWhere = () => {
    let where = ' where 1=1 ';
    where += ` and day >='${moment(search.startDate).format('YYYYMMDD')}'`;
    where += ` and day <='${moment(search.endDate).format('YYYYMMDD')}'`;

    if (search.product) {
      where += ` and product_name in ('${search.product}')`;
    }

    if (search.platform) {
      where += ` and platform in ('${search.platform}')`;
    }

    if (search.countries.length > 0) {
      where += ` and country ${search.countryOpt} (${search.countries
        .flat()
        .map(v => `'${v}'`)
        .join()})`;

      // 国家搜索条件为不包含时需要把is null的国家也统计进去
      if (search.countryOpt === 'not in') {
        where += ' and country is null';
      }
    }

    if (search.mediaSource) {
      where += ` and media_source = '${search.mediaSource}'`;
    }

    if (search.campaign) {
      where += ` and campaign_name = '${search.campaign}'`;
    }

    return where;
  };

  // 按日期分组，计算N天后留存率，聚合处理table数据
  const groupbyDS = (dataList) => {
    const ds = groupSignal(dataList, 'day') || {};
    const results = Object.keys(ds).map((field) => {
      // field:'20201210'
      const day = { reg_num: 0 };
      ds[field].forEach((v) => {
        day.day = field;
        day.reg_num = day.reg_num > v.reg_num ? day.reg_num : v.reg_num;
        day[`ltv_${v.ltv_days}`] = v.ltv;
        day[`stay_rate_${v.ltv_days}`] = getNumber(v.stay_num, v.reg_num, true);
      });
      return day;
    });
    return results.sort((a, b) => b.day - a.day);
  };

  // 按留存天数分组，计算所有记录中N天留存率平均值，聚合处理chart数据
  const groupbyDays = (dataList) => {
    const ltvDays = groupSignal(dataList, 'ltv_days') || {};
    const results = Object.keys(ltvDays).map((field) => {
      // field:'14'
      const days = {
        reg_num: 0,
        stay_num: 0,
        validCount: 0,
        [`ltv_${field}`]: 0,
      };
      ltvDays[field].forEach((v) => {
        if (v.reg_num !== null || v.reg_num !== undefined) {
          days.reg_num += Number(v.reg_num);
          days.stay_num += Number(v.stay_num);
          days[`ltv_${field}`] += Number(v.ltv);
          days.validCount++;
        }
      });
      days[`stay_rate_${field}`] = getNumber(days.stay_num, days.reg_num, true, 4);
      days[`ltv_${field}`] = getNumber(days[`ltv_${field}`], days.reg_num, false, 8);
      return days;
    });
    return results;
  };

  const getList = async () => {
    const where = getWhere();
    const resEstimate = await getData(predictLTVSQL.replace(/#where#/g, where));
    const resReal = await getData(realLTVSQL.replace(/#where#/g, where));

    setEstimateLTVList(groupbyDS(resEstimate));
    setRealLTVList(groupbyDS(resReal));

    const stayChart = resReal;
    const ltvChart = resReal;

    setStayChartList(stayChart);
    setLTVChartList(ltvChart);
  };

  const drawStayChart = async () => {
    const group = groupbyDays(stayChartList);
    const chartList = group.map((v, index) => ({
      day: index,
      type: '留存率(真实)',
      value: v[`stay_rate_${index}`],
    }));
    const chart = chartRender(chartList, 'stayRateChart');
    chart.legend({
      position: 'top',
      itemWrap: true,
    });
    chart.render();
  };

  const drawLTVChart = async () => {
    const group = groupbyDays(LTVChartList);
    const chartList = group.map((v, index) => ({
      day: index,
      type: '单个用户LTV(真实)',
      value: v[`ltv_${index}`],
    }));
    chartLineRender(chartList, 'LTVChart');
  };

  useEffect(() => {
    getList();
  }, [search]);

  useEffect(() => {
    drawStayChart();
  }, [stayChartList]);

  useEffect(() => {
    drawLTVChart();
  }, [LTVChartList]);

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className={styles.body}>
      <Query search={search} onSearch={onSearch} />
      <div>
        <div>
          <div className={styles.title}>
            <span>预估广告LTV</span>
            <DownLoadButton filename="预估广告LTV" data={estimateLTVList} />
          </div>
          <Table
            dataSource={estimateLTVList}
            columns={estimateLTVColumns}
            bordered
            pagination={{
              hideOnSinglePage: true,
            }}
            scroll={{ x: 'max-content' }}
          />
        </div>
        <div>
          <div className={styles.title}>
            <span>真实广告LTV</span>
            <DownLoadButton filename="真实广告LTV" data={realLTVList} />
          </div>
          <Table
            dataSource={realLTVList}
            columns={realLTVColumns}
            bordered
            pagination={{
              hideOnSinglePage: true,
            }}
            scroll={{ x: 'max-content' }}
          />
        </div>
        <div className={styles.title}>
          <span>留存率（真实）</span>
          <div id="stayRateChart" />
        </div>
        <div className={styles.title}>
          <span>单个用户LTV（真实）</span>
          <div id="LTVChart" />
        </div>
      </div>
      <div />
    </div>
  );
};
