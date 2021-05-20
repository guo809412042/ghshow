/*
 * @Date: 2020-12-09 20:11:03
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-03-26 13:57:00
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import moment from 'moment';
import { chartLines } from '../const';
import { chartSQL, chartMonthSQL } from './sqlTemplate';
import { createSqlWhere } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';


export default ({ search }) => {
  const [dayType, setDayType] = useState('1');
  const [type, setType] = useState('1');
  const [chartList, setChartList] = useState([]);
  const [lineType, setLineType] = useState('GP首购');
  console.log('search', search);
  const getSQL = async (sql, startDate, endDate) => {
    let where = '';
    if (search.appProduct.length) {
      where += ` and app_product in (${search.appProduct.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.countryCode.length) {
      where += ` and country_code ${search.conutryOperator} (${search.countryCode.map(v => `'${v}'`).join(',')}) `;
    }

    const fetchSQL = createSqlWhere({
      sql,
      startDate,
      endDate,
      type,
      where,
    });
    const res = await getData(fetchSQL);
    return res;
  };

  const getChartList = async () => {
    const sql = dayType === '1' ? chartSQL : chartMonthSQL;
    const data = await getSQL(sql, search.startDate, search.endDate);
    setChartList(data);
  };

  const drawChart = () => {
    const fields = chartLines[lineType] || [];
    const chartValues = [];
    chartList.forEach((data) => {
      fields.forEach((field) => {
        chartValues.push({
          day: moment(data.data_time, 'YYYYMMDD').format('YYYY-MM-DD'),
          value: data[field.key],
          type: field.title,
        });
      });
    });

    chartLineRender(chartValues, document.getElementById('guanfang_chart'));
  };

  useEffect(() => {
    getChartList();
  }, [search, lineType, dayType, type]);

  useEffect(() => {
    drawChart();
  }, [chartList]);

  return <div>
    <Radio.Group value={dayType} onChange={e => setDayType(e.target.value)}>
      <Radio.Button value="1" key="1">
        日
      </Radio.Button>
      <Radio.Button value="2" key="2">
        月
      </Radio.Button>
    </Radio.Group>
    <Radio.Group value={type} style={{ margin: 20 }} onChange={e => setType(e.target.value)}>
      <Radio.Button value="1" key="1">
        金额
      </Radio.Button>
      <Radio.Button value="2" key="2">
        人数
      </Radio.Button>
    </Radio.Group>
    <div style={{ textAlign: 'center', margin: 10 }}>
      <Radio.Group value={lineType} onChange={e => setLineType(e.target.value)}>
        {/* {['GP首购', 'GP复购', 'iOS首购', 'iOS复购', '国内安卓首购', '国内安卓复购'].map(v => (<Radio.Button>{v}</Radio.Button>))} */}
        {Object.keys(chartLines).map(v => (<Radio.Button key={v} value={v}>{v}</Radio.Button>))}
      </Radio.Group>
    </div>
    <div id="guanfang_chart" />
  </div>;
};
