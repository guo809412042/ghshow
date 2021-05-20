/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import {
  Col, Row, Statistic, Icon, Tooltip,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { sourceCardData } from '../constant';
import styles from '../../components/index.less';
import { createSqlWhere, getPrecision } from '../../../../utils/utils';
import { listSql } from '../sqlTemplate';
import { getData } from '../../../../utils/request';
import { cardChartRender } from '../../../common/chartFunc/cardChartRenderWIthoutAxis';

const CardView = ({
  query: {
    startDate, endDate, country, platform,
  },
}) => {
  const [exportData, setExportData] = useState([]);
  const columns = [
    { key: 'reg_num', title: 'reg_num' },
    { key: 'put_num', title: 'put_num' },
    { key: 'organic_num', title: 'organic_num' },
    { key: 'ds', title: 'ds' },
  ];
  const [cardData, setCardData] = useState(sourceCardData);
  const getFetch = async () => {
    let dayNums = moment(endDate).diff(moment(startDate), 'days');
    dayNums = dayNums >= 7 ? dayNums : 7;
    console.log(country, 325);
    const sql = createSqlWhere({
      sql: listSql,
      startDate,
      endDate,
      country: country.length ? ` and country_name in (${country.map(v => `'${v}'`).join(',')})` : '',
      product: platform,
      yestoday: moment().subtract(1, 'days').format('YYYYMMDD'),
    });
    const beforeSQL = createSqlWhere({
      sql: listSql,
      startDate: moment(startDate).subtract(dayNums, 'days'),
      endDate: moment(endDate).subtract(dayNums, 'days'),
      country: country.length ? ` and country_name in (${country.map(v => `'${v}'`).join(',')})` : '',
      product: platform,
      yestoday: moment().subtract(1, 'days').format('YYYYMMDD'),
    });
    const res = await getData(sql);
    const beforeRes = await getData(beforeSQL);
    const data = {
      currentRegNum: 0,
      beforeRegNum: 0,
      cuttentPutNum: 0,
      beforePutNum: 0,
      currentOrganicNum: 0,
      beforeOrganicNum: 0,
    };
    for (const i of res) {
      data.currentRegNum += i.reg_num;
      data.cuttentPutNum += i.put_num;
      data.currentOrganicNum += i.organic_num;
    }
    for (const i of beforeRes) {
      data.beforeRegNum += i.reg_num;
      data.beforePutNum += i.put_num;
      data.beforeOrganicNum += i.organic_num;
    }
    data.currentRegNum = (data.currentRegNum / res.length).toFixed(2);
    data.cuttentPutNum = (data.cuttentPutNum / res.length).toFixed(2);
    data.currentOrganicNum = (data.currentOrganicNum / res.length).toFixed(2);
    data.beforeRegNum = (data.beforeRegNum / beforeRes.length).toFixed(2);
    data.beforePutNum = (data.beforePutNum / beforeRes.length).toFixed(2);
    data.beforeOrganicNum = (data.beforeOrganicNum / beforeRes.length).toFixed(2);
    const newCardData = _.clone(cardData);
    newCardData[0].num = data.currentRegNum;
    newCardData[0].percent = getPrecision(data.currentRegNum, data.beforeRegNum);
    newCardData[1].num = data.cuttentPutNum;
    newCardData[1].percent = getPrecision(data.cuttentPutNum, data.beforePutNum);
    newCardData[2].num = data.currentOrganicNum;
    newCardData[2].percent = getPrecision(data.currentOrganicNum, data.beforeOrganicNum);
    setCardData(newCardData);
    const regData = [];
    const putData = [];
    const organicData = [];
    res.forEach((v) => {
      regData.push({
        type: 'reg_num',
        day: v.ds.toString(),
        value: v.reg_num,
      });
      putData.push({
        type: 'put_num',
        day: v.ds.toString(),
        value: v.put_num,
      });
      organicData.push({
        type: 'organic_num',
        day: v.ds.toString(),
        value: v.organic_num,
      });
    });

    setExportData(res);
    cardChartRender(regData, `myChart-${cardData[0].type}`, cardData[0].bg, 120);
    cardChartRender(putData, `myChart-${cardData[1].type}`, cardData[1].bg, 120);
    cardChartRender(organicData, `myChart-${cardData[2].type}`, cardData[2].bg, 120);
  };
  useEffect(() => {
    if (platform) {
      getFetch();
    }
  }, [startDate, endDate, country, platform]);
  return <div style={{ marginTop: 20 }}>
    <DownLoadButton
      filename="来源分析"
      data={exportData}
      columns={columns}
    />
    <Row gutter={20}>
      {cardData.map(v => <Col span={8} key={v.type}>
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
                suffix={<div>%  <Tooltip title="本周平均值与上周平均值对比">
                  <Icon type="question-circle" style={{ fontSize: 12 }} />
                </Tooltip></div>}
              />
            </div>

          </div>
          <div className={styles.panelFooter}>
            <div id={`myChart-${v.type}`} />
          </div>
        </div>
      </Col>)}
    </Row>

  </div>;
};

export default CardView;
