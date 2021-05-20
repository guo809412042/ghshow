/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import {
  Col, Row, Statistic, Icon,
} from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import _ from 'lodash';
import styles from './index.less';
import { DownLoadButton } from '../../common/DownLoadButton';
import { clientCardData } from '../viva/constant';
import { createSqlWhere, getPrecision } from '../../../utils/utils';
import { clientCardSQL, clientSpendSql } from './sqlTemplate';
import { getData } from '../../../utils/request';
import { cardChartRender } from '../../common/chartFunc/cardChartRenderWIthoutAxis';
import { chartRender } from './chartRender';

export default ({
  query: {
    startDate, endDate, country = [], platform,
  }, product, database = 'cltusr',
}) => {
  const [exportData, setExportData] = useState([]);
  const [cardData, setCardData] = useState(clientCardData);

  const getFetch = async () => {
    let dayNums = moment(endDate).diff(moment(startDate), 'days');
    dayNums = dayNums >= 8 ? dayNums : 8;
    let countryValues = '';
    if (country.length) {
      countryValues = ` and  country_name in (${country.map(v => `'${v}'`).join(',')})`;
    }
    const sql = createSqlWhere({
      sql: clientCardSQL,
      startDate,
      endDate,
      country: countryValues,
      platform,
      product,
      yestoday: moment()
        .subtract(1, 'days')
        .format('YYYYMMDD'),
      database,
    });
    const beforeSQL = createSqlWhere({
      sql: clientCardSQL,
      startDate: moment(startDate).subtract(dayNums, 'days'),
      endDate: moment(endDate).subtract(dayNums, 'days'),
      country: countryValues,
      platform,
      product,
      yestoday: moment()
        .subtract(1, 'days')
        .format('YYYYMMDD'),
      database,
    });
    const spendSql = createSqlWhere({
      sql: clientSpendSql,
      startDate,
      endDate,
      country: countryValues,
      product,
      platform,
      yestoday: moment()
        .subtract(1, 'days')
        .format('YYYYMMDD'),
      database,
    });
    const beforeSpendSql = createSqlWhere({
      sql: clientSpendSql,
      startDate: moment(startDate).subtract(dayNums, 'days'),
      endDate: moment(endDate).subtract(dayNums, 'days'),
      country: countryValues,
      product,
      platform,
      yestoday: moment()
        .subtract(1, 'days')
        .format('YYYYMMDD'),
      database,
    });
    const res = await getData(sql);
    const beforeRes = await getData(beforeSQL);
    const spendRes = await getData(spendSql);
    const beforeSpendRes = await getData(beforeSpendSql);
    const data = {
      currentSpendNum: 0,
      beforeSpendNum: 0,
      currentRegNum: 0,
      beforeRegNum: 0,
      cuttentPutNum: 0,
      beforePutNum: 0,
      currentOrganicNum: 0,
      beforeOrganicNum: 0,
    };
    for (const i of res) {
      data.currentRegNum += Number(i.reg_num || 0);
      data.cuttentPutNum += Number(i.put_num || 0);
      data.currentOrganicNum += Number(i.organic_num || 0);
    }
    for (const i of beforeRes) {
      data.beforeRegNum += Number(i.reg_num || 0);
      data.beforePutNum += Number(i.put_num || 0);
      data.beforeOrganicNum += Number(i.organic_num || 0);
    }
    for (const i of spendRes) {
      data.currentSpendNum += Number(i.spend_num || 0);
    }
    for (const i of beforeSpendRes) {
      data.beforeSpendNum += Number(i.spend_num || 0);
    }
    data.currentSpendNum = Number((data.currentSpendNum / res.length).toFixed(2));
    data.currentRegNum = Number((data.currentRegNum / res.length).toFixed(2));
    data.cuttentPutNum = Number((data.cuttentPutNum / res.length).toFixed(2));
    data.currentOrganicNum = Number((data.currentOrganicNum / res.length).toFixed(2));
    data.beforeSpendNum = Number((data.beforeSpendNum / beforeRes.length).toFixed(2));
    data.beforeRegNum = Number((data.beforeRegNum / beforeRes.length).toFixed(2));
    data.beforePutNum = Number((data.beforePutNum / beforeRes.length).toFixed(2));
    data.beforeOrganicNum = Number((data.beforeOrganicNum / beforeRes.length).toFixed(2));
    const newCardData = _.clone(cardData);
    newCardData[0].num = data.currentSpendNum;
    newCardData[0].percent = getPrecision(data.currentSpendNum, data.beforeSpendNum);
    newCardData[1].num = data.currentRegNum;
    newCardData[1].percent = getPrecision(data.currentRegNum, data.beforeRegNum);
    newCardData[2].num = data.cuttentPutNum;
    newCardData[2].percent = getPrecision(data.cuttentPutNum, data.beforePutNum);
    newCardData[3].num = data.currentOrganicNum;
    newCardData[3].percent = getPrecision(data.currentOrganicNum, data.beforeOrganicNum);
    setCardData(newCardData);
    const spendData = [];
    const regData = [];
    const putData = [];
    const organicData = [];
    res.forEach((v) => {
      regData.push({
        type: 'reg_num',
        day: moment(v.ds.toString()).format('YYYYMMDD'),
        value: v.reg_num,
      });
      putData.push({
        type: 'put_num',
        day: moment(v.ds.toString()).format('YYYYMMDD'),
        value: v.put_num,
      });
      organicData.push({
        type: 'organic_num',
        day: moment(v.ds.toString()).format('YYYYMMDD'),
        value: v.organic_num,
      });
    });
    spendRes.map((v) => {
      spendData.push({
        type: 'spend_num',
        day: moment(v.ds.toString()).format('YYYYMMDD'),
        value: Number(v.spend_num.toFixed(2)),
      });
    });
    cardChartRender(spendData.sort((a, b) => a.day - b.day), `myChart-${cardData[0].type}`, cardData[0].bg, 120);
    cardChartRender(regData.sort((a, b) => a.day - b.day), `myChart-${cardData[1].type}`, cardData[1].bg, 120);
    cardChartRender(putData.sort((a, b) => a.day - b.day), `myChart-${cardData[2].type}`, cardData[2].bg, 120);
    cardChartRender(organicData.sort((a, b) => a.day - b.day), `myChart-${cardData[3].type}`, cardData[3].bg, 120);
    // setExportData([...spendData, ...regData, ...putData, ...organicData]);
    const reverse = [];
    for (let i = 0; i < spendData.length; i++) {
      reverse.push({
        ds: spendData[i].day,
        reg_num: regData[i].value,
        put_num: putData[i].value,
        organic_num: organicData[i].value,
        spend_num: spendData[i].value,
      });
    }
    setExportData(reverse);
    const nameList = {
      reg_num: '整体新增',
      put_num: '投放新增',
      organic_num: '自然新增',
      spend_num: '整体投放消耗',
    };
    const originData = putData.concat(organicData);
    const barData = originData
      .map(v => ({
        ...v,
        type: nameList[v.type],
        tip: `${v.value || 0}(${(
          (100 * v.value || 0)
          / originData.filter(i => i.day === v.day).reduce((pre, current) => pre + current.value || 0, 0)
        ).toFixed(2)}%)`,
        value: v.value || 0,
      }))
      .sort((a, b) => a.day - b.day);
    chartRender(barData, 'blockChart');
  };
  useEffect(() => {
    if (platform) {
      getFetch();
    }
  }, [startDate, endDate, country, platform]);
  return (
    <div style={{ marginTop: 20 }}>
      <DownLoadButton
        filename="来源分析"
        data={exportData}
        columns={[
          { key: 'ds', title: '日期' },
          { key: 'reg_num', title: '整体新增' },
          { key: 'put_num', title: '投放新增' },
          { key: 'organic_num', title: '自然新增' },
          { key: 'spend_num', title: '整体投放消耗' },
        ]}
      />
      <Row gutter={20}>
        {cardData.map(v => (
          <Col span={6} key={v.type}>
            <div className={classnames(styles.panel, styles.statsWidget)}>
              <div className={styles.panelBody}>
                <div className={classnames(styles.pullLeft)}>
                  <p className={styles.statsInfo}>{v.title}</p>
                  <p className={styles.statsNumber}>{v.num}</p>
                </div>
                <div className={classnames(styles.pullRight)}>
                  <Statistic
                    value={v.percent}
                    precision={2}
                    valueStyle={{
                      color: v.percent > 0 ? '#3f8600' : '#EC5E69',
                      textAlign: 'center',
                      paddingTop: 10,
                    }}
                    prefix={v.percent > 0 ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />}
                    suffix="%"
                  />
                </div>
              </div>
              <div className={styles.panelFooter}>
                <div id={`myChart-${v.type}`} />
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <div id="blockChart" />
    </div>
  );
};
