import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Spin } from 'antd';
import Query from './components/Query';
import { getHoloData as getData } from '../../../utils/request';
import { DownLoadButton } from '../../common/DownLoadButton';
import styles from './styles/index.less';
import { getListSQL, topList } from './components/sqlTemplate';
import {
  AllValue, Platform, UserType, VIP,
} from './const';
import { AppProductList } from '../../business/advStatistics/components/utils';
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

  const onSearch = async (params) => {
    setSearch(params);
  };

  const [DAUList, setDAUList] = useState([]);
  const [MAUList, setMAUList] = useState([]);
  const [serverNewList, setServerNewList] = useState([]);
  const [allUserList, setAllUserList] = useState([]);

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
      console.log('search.countries', search.countries);
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

  const setDataList = async (dataType, list) => {
    const where = getWhere();
    const innerWhere = getInnerWhere();
    const sql = topList
      .replace(/#type#/g, dataType)
      .replace(/#whereInner#/g, innerWhere)
      .replace(/#where#/g, where)
      .replace(/#groupby#/g, search.groupBy)
      .replace(/#allvalue#/, AllValue[search.groupBy]);
    const res = (await getData(sql)) || [];
    const topWhere = res.map(item => getChartType(item));
    // console.log('topWhere', topWhere);
    switch (dataType) {
      case 'dau':
        // console.log('listlistlist', list);
        setDAUList(list);
        chartLineRender(list.filter(item => topWhere.includes(item.type) || item.type === '全部'), 'chartDAU');
        break;
      case 'mau':
        // console.log('listlistlist', list);
        const newListData = {};
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          if (newListData[`${moment(element.day).format('YYYYMM')}-${element.type}`]) {
            if (newListData[`${moment(element.day).format('YYYYMM')}-${element.type}`].value < element.value) {
              newListData[`${moment(element.day).format('YYYYMM')}-${element.type}`].value = element.value;
            }
          } else {
            newListData[`${moment(element.day).format('YYYYMM')}-${element.type}`] = element;
          }
        }
        // console.log('newListData', newListData);
        let newList = [];
        // eslint-disable-next-line guard-for-in
        for (const key in newListData) {
          newList.push({
            ...newListData[key],
            day: moment(key.split('-')[0]).format('YYYY-MM'),
            ds: moment(key.split('-')[0]).valueOf(),
          });
        }
        newList = newList.sort((a, b) => a.ds - b.ds);
        // console.log('newList', newList);
        setMAUList(newList);
        chartLineRender(newList.filter(item => topWhere.includes(item.type) || item.type === '全部'), 'chartMAU');
        break;
      case 'newser_user_cnt':
        setServerNewList(list);
        chartLineRender(list.filter(item => topWhere.includes(item.type) || item.type === '全部'), 'chartServerNew');
        break;
      case 'all_user_cnt':
        setAllUserList(list);
        chartLineRender(list.filter(item => topWhere.includes(item.type) || item.type === '全部'), 'chartAllUser');
        break;
      default:
        break;
    }
  };

  const getDataList = async (dataType) => {
    const where = getWhere();
    const innerWhere = getInnerWhere();
    const sql = getListSQL
      .replace(/#type#/g, dataType)
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
    } catch (error) {
      console.error(error);
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    setSpinning(true);
    ['dau', 'mau', 'newser_user_cnt', 'all_user_cnt'].forEach((item) => {
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
                <span>日活</span>
                <DownLoadButton filename="日活" data={DAUList} />
              </div>
              <div>
                <div id="chartDAU" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>月活</span>
                <DownLoadButton filename="月活" data={MAUList} />
              </div>
              <div>
                <div id="chartMAU" />
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>服务端新增</span>
                <DownLoadButton filename="服务端新增" data={serverNewList} />
              </div>
              <div>
                <div id="chartServerNew" />
              </div>
            </div>
            {/* <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>
              <span>客户端新增</span>
              <DownLoadButton filename="客户端新增" data={clientNewList} />
            </div>
            <div>
              <div id="chartClientNew" />
            </div>
          </div> */}
            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>
                <span>总用户量</span>
                <DownLoadButton filename="总用户量" data={allUserList} />
              </div>
              <div>
                <div id="chartAllUser" />
              </div>
            </div>
          </div>
        </Spin>
      </div>
      <div />
    </div>
  );
};
