import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Icon, Spin, Table, Tooltip,
} from 'antd';
import Query from './components/Query';
import { getHoloData as getData } from '../../../utils/request';
import { DownLoadButton } from '../../common/DownLoadButton';
import styles from './styles/index.less';
import { getListSQL, getTableListSQL } from './components/sqlTemplate';
import {
  AllValue, Platform, StayRateColumns, UserType, VIP,
} from './const';
import { AppProductList } from '../../business/advStatistics/components/utils';
import { getNumber } from '../../../utils/utils';
import { chartLineRender } from '../../business/advLTV/components/chartRender';

export default () => {
  const [search, setSearch] = useState({
    product: '2',
    platform: '',
    vip: '',
    userType: '',
    countries: [],
    mediaSources: [],
    versions: [],
    groupBy: 'platform',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
  });

  const onSearch = (params) => {
    setSearch(params);
  };

  const [stay1dList, setStay1dList] = useState([]);
  const [stay1dRateList, setStay1dRateList] = useState([]);
  const [stay7dList, setStay7dList] = useState([]);
  const [stay7dRateList, setStay7dRateList] = useState([]);
  const [stay30dList, setStay30dList] = useState([]);
  const [stay30dRateList, setStay30dRateList] = useState([]);
  const [stayMake1dList, setStayMake1dList] = useState([]);
  const [stayMake1dRateList, setStayMake1dRateList] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [spinning, setSpinning] = useState(false);

  const getWhere = () => {
    let where = ' where 1=1 ';
    where += ` and ds >='${moment(search.startDate).format('YYYYMMDD')}'`;
    where += ` and ds <='${moment(search.endDate).format('YYYYMMDD')}'`;

    if (search.product) {
      where += ` and a.product_id in ('${search.product}')`;
    }

    if (search.platform) {
      where += ` and a.platform in ('${search.platform}')`;
    }

    if (search.countries.length > 0) {
      where += ` and a.country in (${search.countries
        .flat()
        .map(v => `'${v}'`)
        .join()})`;
    }

    if (search.mediaSources.length > 0) {
      where += ` and a.media_source in (${search.mediaSources
        .flat()
        .map(v => `'${v}'`)
        .join()})`;
    }

    if (search.versions.length > 0) {
      where += ` and a.app_version in (${search.versions
        .flat()
        .map(v => `'${v}'`)
        .join()})`;
    }

    if (search.vip) {
      where += ` and a.is_vip in ('${search.vip}')`;
    }

    if (search.userType) {
      where += ` and a.user_type in ('${search.userType}')`;
    }

    return where;
  };

  const getInnerWhere = () => {
    let where = ' where 1=1 ';
    where += ` and ds >='${moment(search.startDate).format('YYYYMMDD')}'`;
    where += ` and ds <='${moment(search.endDate).format('YYYYMMDD')}'`;

    if (search.product) {
      where += ` and product_id in ('${search.product}')`;
    }

    if (search.platform) {
      where += ` and platform in ('${search.platform}')`;
    }

    if (search.countries.length > 0) {
      where += ` and country in (${search.countries
        .flat()
        .map(v => `'${v}'`)
        .join()})`;
    }

    if (search.mediaSources.length > 0) {
      where += ` and media_source in (${search.mediaSources
        .flat()
        .map(v => `'${v}'`)
        .join()})`;
    }

    if (search.versions.length > 0) {
      where += ` and app_version in (${search.versions
        .flat()
        .map(v => `'${v}'`)
        .join()})`;
    }

    if (search.vip) {
      where += ` and is_vip in ('${search.vip}')`;
    }

    if (search.userType) {
      where += ` and user_type in ('${search.userType}')`;
    }

    return where;
  };

  const getChartType = (item) => {
    switch (search.groupBy) {
      case 'product_id':
        return AppProductList[item[search.groupBy]];
      case 'platform':
        return Platform[item[search.groupBy]];
      case 'media_source':
        return item[search.groupBy];
      case 'user_type':
        return UserType[item[search.groupBy]];
      case 'is_vip':
        return VIP[item[search.groupBy]];
      case 'app_version':
        return item[search.groupBy];
      case 'country_name':
        return item[search.groupBy];
      default:
        return item[search.groupBy];
    }
  };

  const setDataList = (dataType, list = []) => {
    switch (dataType) {
      case 'act_bef_1d_cnt':
        console.log('list', list);
        setStay1dList(list);
        chartLineRender(list, 'chart1dCnt');
        break;
      case 'act_bef_7d_cnt':
        setStay7dList(list);
        chartLineRender(list, 'chart7dCnt');
        break;
      case 'act_bef_30d_cnt':
        setStay30dList(list);
        chartLineRender(list, 'chart30dCnt');
        break;
      case 'mk_bef_1d_cnt':
        setStayMake1dList(list);
        chartLineRender(list, 'chartMake1dCnt');
        break;
      case 'new_act_bef_1d_cnt':
        setStay1dRateList(list);
        chartLineRender(list, 'chart1dRate');
        break;
      case 'new_act_bef_7d_cnt':
        setStay7dRateList(list);
        chartLineRender(list, 'chart7dRate');
        break;
      case 'new_act_bef_30d_cnt':
        setStay30dRateList(list);
        chartLineRender(list, 'chart30dRate');
        break;
      case 'new_mk_bef_1d_cnt':
        setStayMake1dRateList(list);
        chartLineRender(list, 'chartMake1dRate');
        break;
      default:
        break;
    }
  };

  const getDataList = async (dataType, dataType2, dataType3) => {
    setSpinning(true);
    const where = getWhere();
    const innerWhere = getInnerWhere();
    const sql = getListSQL
      .replace(/#type#/g, dataType)
      .replace(/#type2#/g, dataType2)
      .replace(/#type3#/g, dataType3)
      .replace(/#whereInner#/g, innerWhere)
      .replace(/#where#/g, where)
      .replace(/#groupby#/g, search.groupBy)
      .replace(/#allvalue#/, AllValue[search.groupBy]);
    try {
      const res = (await getData(sql)) || [];
      const resultArr = res.map(item => ({
        day: moment(item.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: +item[dataType],
        type: getChartType(item),
      }));
      setDataList(dataType, resultArr);

      const resultArr2 = res.map(item => ({
        day: moment(item.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: getNumber(Number(+item[dataType3]), Number(+item[dataType2]), true),
        type: getChartType(item),
      }));
      setDataList(dataType2, resultArr2);
    } catch (error) {
      console.error(error);
    } finally {
      setSpinning(false);
    }
  };

  const getTableDataList = async () => {
    const where = getInnerWhere();
    const res = await getData(getTableListSQL.replace(/#where#/g, where));
    res.forEach((item) => {
      item.act_bef_1d_stay_rate = item.act_bef_1d_stay_rate.toFixed(2);
      item.act_bef_2d_stay_rate = item.act_bef_2d_stay_rate.toFixed(2);
      item.act_bef_3d_stay_rate = item.act_bef_3d_stay_rate.toFixed(2);
      item.act_bef_4d_stay_rate = item.act_bef_4d_stay_rate.toFixed(2);
      item.act_bef_5d_stay_rate = item.act_bef_5d_stay_rate.toFixed(2);
      item.act_bef_6d_stay_rate = item.act_bef_6d_stay_rate.toFixed(2);
      item.act_bef_7d_stay_rate = item.act_bef_7d_stay_rate.toFixed(2);
      item.act_bef_14d_stay_rate = item.act_bef_14d_stay_rate.toFixed(2);
      item.act_bef_30d_stay_rate = item.act_bef_30d_stay_rate.toFixed(2);
      item.mk_bef_1d_stay_rate = item.mk_bef_1d_stay_rate.toFixed(2);
    });
    setTableData(res || []);
  };

  useEffect(() => {
    getDataList('act_bef_1d_cnt', 'new_act_bef_1d_cnt', 'act_bef_1d_cnt_newusr');
    getDataList('act_bef_7d_cnt', 'new_act_bef_7d_cnt', 'act_bef_7d_cnt_newusr');
    getDataList('act_bef_30d_cnt', 'new_act_bef_30d_cnt', 'act_bef_30d_cnt_newusr');
    getDataList('mk_bef_1d_cnt', 'new_mk_bef_1d_cnt', 'mk_bef_1d_cnt_newusr');

    getTableDataList();
  }, [search]);

  return (
    <div className={styles.wrapper}>
      <Query search={search} onSearch={onSearch} />
      <div>
        <Spin spinning={spinning}>
          <div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>次日留存数</span>
                <DownLoadButton filename="次日留存数" data={stay1dList} />
              </div>
              <div>
                <div id="chart1dCnt" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>次日留存率</span>
                <DownLoadButton filename="次日留存率" data={stay1dRateList} />
              </div>
              <div>
                <div id="chart1dRate" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>7日留存数</span>
                <Tooltip title="第7日依旧活跃的用户数">
                  <Icon type="question-circle" />
                </Tooltip>
                <DownLoadButton filename="7日留存数" data={stay7dList} />
              </div>
              <div>
                <div id="chart7dCnt" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>7日留存率</span>
                <DownLoadButton filename="7日留存率" data={stay7dRateList} />
              </div>
              <div>
                <div id="chart7dRate" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>30日留存数</span>
                <Tooltip title="第30日依旧活跃的用户数">
                  <Icon type="question-circle" />
                </Tooltip>
                <DownLoadButton filename="30日留存数" data={stay30dList} />
              </div>
              <div>
                <div id="chart30dCnt" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>30日留存率</span>
                <DownLoadButton filename="30日留存率" data={stay30dRateList} />
              </div>
              <div>
                <div id="chart30dRate" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>制作用户次日留存数</span>
                <Tooltip title="制作用户第2日依旧活跃的用户数">
                  <Icon type="question-circle" />
                </Tooltip>
                <DownLoadButton filename="制作用户次日留存数" data={stayMake1dList} />
              </div>
              <div>
                <div id="chartMake1dCnt" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>制作用户次日留存率</span>
                <DownLoadButton filename="制作用户次日留存率" data={stayMake1dRateList} />
              </div>
              <div>
                <div id="chartMake1dRate" />
              </div>
            </div>
            <div>
              <div style={{ textAlign: 'center', marginTop: 50, padding: 5 }}>
                <span style={{ fontSize: 16, fontWeight: 500 }}>留存率明细表</span>
              </div>
              <Table columns={StayRateColumns} dataSource={tableData} bordered />
            </div>
          </div>
        </Spin>
      </div>
      <div />
    </div>
  );
};
