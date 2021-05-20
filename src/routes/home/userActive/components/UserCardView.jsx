/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DatePicker, Row } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { cardList, MAU_DATA } from './const';
import StaticNumberShowView from '../../common/StaticNumberShowView';
import { getData } from '../../../../utils/request';
import { createSqlWhere, getPrecision } from '../../../../utils/utils';
import { DownLoadButton } from '../../../common/DownLoadButton';

const colors = ['#f5365c', '#02ba5a', '#14abef'];
const dateFormat = 'YYYY-MM-DD';
const sqlTemplate = `select bizdate,
sum(#molecular#) as #molecular#
from vcm_app_comm_daliy_data
where type= '#product#' 
and bizdate >= '#startDate#' and bizdate<='#endDate#' 
#otherWhere#
group by bizdate
order by bizdate
`;
const sqlTemplateMonth = `
select bizdate,
sum(#molecular#) as #molecular#
from vcm_app_comm_daliy_data
where type= '#product#' 
and bizdate in (#type#) 
#otherWhere#
group by bizdate
order by bizdate
`;
export default ({ product }) => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [currentMonth, setCurrentMonth] = useState(moment().subtract(1, 'month'));
  const [cardData, setCardData] = useState([]);
  const [cardMonthData, setCardMonthData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const getFetchData = async () => {
    const data = [];
    const weekday = moment(currentDate).subtract(6, 'days').format('YYYYMMDD');
    const yestoday = moment(currentDate).subtract(1, 'days').format('YYYYMMDD');
    for (const i of cardList) {
      const res = await getData(createSqlWhere({
        sql: sqlTemplate,
        product,
        endDate: currentDate,
        startDate: weekday,
        molecular: i.molecular,
        otherWhere: i.otherWhere,
      }));
      let yesFind = res.find(v => (v.bizdate).toString() === yestoday);
      let weekFind = res.find(v => (v.bizdate).toString() === weekday);
      let currentFind = res.find(v => (v.bizdate).toString() === moment(currentDate).format('YYYYMMDD'));
      yesFind = yesFind || {};
      weekFind = weekFind || {};
      currentFind = currentFind || {};
      const chartData = res.map(v => ({
        type: i.title,
        day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
        value: v[i.molecular],
      }));
      data.push({
        title: i.title,
        value: currentFind[i.molecular],
        precision: getPrecision(currentFind[i.molecular], yesFind[i.molecular]),
        precision1: getPrecision(currentFind[i.molecular], weekFind[i.molecular]),
        data: chartData,
      });
    }
    setCardData(data);
  };
  const getMonthData = async () => {
    const data = [];
    const weekMonth = moment(currentMonth).subtract(6, 'month').endOf('month').format('YYYYMMDD');
    const yestoMonth = moment(currentMonth).subtract(1, 'month').endOf('month').format('YYYYMMDD');
    const current = moment(currentMonth).endOf('month').format('YYYYMMDD');
    const dates = [];
    for (let i = 0; i <= 6; i++) {
      dates.push(moment(currentMonth).subtract(i, 'month').endOf('month').format('YYYYMMDD'));
    }
    for (const i of MAU_DATA) {
      const res = await getData(createSqlWhere({
        sql: sqlTemplateMonth,
        product,
        type: dates.join(','),
        molecular: i.molecular,
        otherWhere: i.otherWhere,
      }));
      let yesFind = res.find(v => (v.bizdate) === moment(yestoMonth).format('YYYYMMDD'));
      let weekFind = res.find(v => (v.bizdate) === moment(weekMonth).format('YYYYMMDD'));
      let currentFind = res.find(v => (v.bizdate) === current);
      yesFind = yesFind || {};
      weekFind = weekFind || {};
      currentFind = currentFind || {};
      const chartData = res.map(v => ({
        type: i.title,
        day: moment(v.bizdate).format('YYYY-MM-DD'),
        value: v[i.molecular],
      }));
      data.push({
        title: i.title,
        value: currentFind[i.molecular],
        precision: currentFind && yesFind ? getPrecision(currentFind[i.molecular], yesFind[i.molecular]) : 0,
        precision1: currentFind && weekFind ? getPrecision(currentFind[i.molecular], weekFind[i.molecular]) : 0,
        data: chartData,
      });
    }
    setCardMonthData(data);
  };
  const allMonthData = async () => {
    const data = [];
    const dates = [];
    const month = moment(currentMonth).month();
    const year = moment(currentMonth).year();
    for (let i = 0; i <= (year - 2018) * 12 + month; i++) {
      dates.push(moment(currentMonth).subtract(i, 'month').endOf('month').format('YYYYMMDD'));
    }
    for (const i of MAU_DATA) {
      const res = await getData(createSqlWhere({
        sql: sqlTemplateMonth,
        product,
        type: dates.map(v => `'${v}'`).join(','),
        molecular: i.molecular,
        otherWhere: i.otherWhere,
      }));
      res.forEach((v) => {
        data.push({
          value: v.mau,
          type: i.title,
          day: moment(v.bizdate).format('YYYY-MM-DD'),
        });
      });
    }
    setMonthData(data);
  };
  useEffect(() => {
    getFetchData();
  }, [currentDate, product]);
  useEffect(() => {
    getMonthData();
  }, [currentMonth, product]);
  useEffect(() => {
    allMonthData();
  }, [product]);
  return <div>
    <DatePicker
      defaultValue={currentDate}
      format={dateFormat}
      onChange={setCurrentDate}
      style={{ marginRight: 20, marginBottom: 20 }}
    />
    <Row gutter={18}>
      {cardData.map((v, index) => <StaticNumberShowView
        {...v}
        color={colors[index % 3]} key={v.id} id={`card_chart${index}`}
      />)}
    </Row>
    <DatePicker.MonthPicker
      defaultValue={currentMonth}
      onChange={setCurrentMonth}
      style={{ marginRight: 20, marginBottom: 20 }}
    />
    <DownLoadButton
      filename="mau"
      data={monthData}
      columns={[
        { key: 'type', value: 'type' },
        { key: 'day', value: 'day' },
        { key: 'value', value: 'value' },
      ]}
    />
    <Row gutter={18}>
      {cardMonthData.map((v, index) => <StaticNumberShowView
        {...v}
        color={colors[index % 3]} key={v.id} id={`card_chartMonth-${v.title}`}
      />)}
    </Row>

  </div>;
};
