import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Spin } from 'antd';
import Query from './components/Query';
import { getData } from '../../../utils/request';
import { DownLoadButton } from '../../common/DownLoadButton';
import styles from './styles/index.less';
import { getListSQL, getProfitListSQL } from './components/sqlTemplate';
import {
  AllValue, Platform, UserType, VIP,
} from './const';
import { AppProductList } from '../../business/advStatistics/components/utils';
import { chartLineRender } from '../../business/advLTV/components/chartRender';

export default () => {
  const [search, setSearch] = useState({
    product: 2,
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

  const onSearch = async (params) => {
    setSearch(params);
  };

  const [saleList, setSaleList] = useState([]);
  const [profitList, setProfitList] = useState([]);
  const [refundList, setRefundList] = useState([]);
  const [costList, setCostList] = useState([]);

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

  const setDataList = (dataType, list) => {
    switch (dataType) {
      case 'sale_mnt':
        setSaleList(list);
        chartLineRender(list, 'chartSale');
        break;
      case 'profit':
        setProfitList(list);
        chartLineRender(list, 'chartProfit');
        break;
      case 'refund_mnt':
        setRefundList(list);
        chartLineRender(list, 'chartRefund');
        break;
      case 'cost':
        setCostList(list);
        chartLineRender(list, 'chartCost');
        break;
      default:
        break;
    }
  };

  const getDataList = async (dataType) => {
    setSpinning(true);
    const where = getWhere();
    const innerWhere = getInnerWhere();
    // 当查净利润时，sql取前4是按销售额取前4
    const sql = (dataType === 'profit' ? getProfitListSQL : getListSQL)
      .replace(/#type#/g, dataType === 'profit' ? 'sale_mnt' : dataType)
      .replace(/#whereInner#/g, innerWhere)
      .replace(/#where#/g, where)
      .replace(/#groupby#/g, search.groupBy)
      .replace(/#allvalue#/, AllValue[search.groupBy]);
    try {
      const res = (await getData(sql)) || [];
      const resultArr = res.map(item => ({
        day: moment(item.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
        value: item[dataType],
        type: getChartType(item),
      }));
      setDataList(dataType, resultArr);
    } catch (error) {
      console.error(error);
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    ['sale_mnt', 'refund_mnt', 'cost', 'profit'].forEach((item) => {
      getDataList(item);
    });
  }, [search]);

  return (
    <div className={styles.wrapper}>
      <Query search={search} onSearch={onSearch} />
      <div>
        <Spin spinning={spinning}>
          <div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>销售额</span>
                <DownLoadButton filename="销售额" data={saleList} />
              </div>
              <div>
                <div id="chartSale" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>净利润</span>
                <DownLoadButton filename="净利润" data={profitList} />
              </div>
              <div>
                <div id="chartProfit" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>退款</span>
                <DownLoadButton filename="退款" data={refundList} />
              </div>
              <div>
                <div id="chartRefund" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>投放花费</span>
                <DownLoadButton filename="投放花费" data={costList} />
              </div>
              <div>
                <div id="chartCost" />
              </div>
            </div>
          </div>
        </Spin>
      </div>
      <div />
    </div>
  );
};
