/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Row } from 'antd';
import CardTemplateView from '../../../../common/CardTemplateView';
import { createSqlWhere } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { ChartRender } from './drawChart';
import { DownLoadButton } from '../../../../common/DownLoadButton';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
const sqlTemplate = `select  sum(#molecular#) as #molecular#
,ds,channel
from    #database#
where   #day# >= #startDate#
and     #day# <= #endDate#
#otherWhere#
group by #day#,channel
order by #day#
limit   10000
;
`;
const sqlTotal = `select  sum(#molecular#) as #molecular#
,ds
from    #database#
where   #day# >= #startDate#
and     #day# <= #endDate#
#otherWhere#
group by #day#
order by #day#
limit   10000
;
`;
export default ({
  molecular,
  denominator,
  title,
  graphName,
  day,
  otherWhere,
  database = '',
}) => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [fourDayAgo, setFourDayAgo] = useState(moment().subtract(7, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const CardTemplateViewProps = {
    title,
    loading: false,
    graphName,
  };
  const getChartData = async () => {
    const sql = createSqlWhere({
      sql: sqlTemplate,
      startDate: moment(fourDayAgo),
      endDate: moment(currentDate),
      molecular,
      database,
      otherWhere,
      day,
    });
    const res = await getData(sql);
    const channelDataList = [];
    for (const data of res) {
      channelDataList.push({
        value: Number(data[molecular]),
        day: moment(data.ds).format(dateFormat),
        type: data.channel,
      });
    }
    return channelDataList;
  };
  const getTotalData = async () => {
    const sql = createSqlWhere({
      sql: sqlTotal,
      startDate: moment(fourDayAgo),
      endDate: moment(currentDate),
      molecular,
      database,
      day,
    });
    const res = await getData(sql);
    const channelDataList = [];
    return channelDataList;
  };
  const getFetchData = async () => {
    let chartData = await getTotalData();
    chartData = chartData.concat(await getChartData());
    setDataSource(chartData);
    ChartRender(chartData, `hour-${molecular}-${title}`);
  };
  useEffect(() => {
    getFetchData();
  }, [currentDate]);
  return <Row
    id={`chartDiv-${molecular}-${denominator}`}
    style={{ marginBottom: 10 }}
  >
    <CardTemplateView {...CardTemplateViewProps} >
      <RangePicker
        value={[fourDayAgo, currentDate]}
        onChange={(value) => {
          setCurrentDate(value[1]);
          setFourDayAgo(value[0]);
        }}
      />
      <DownLoadButton
        filename={title}
        data={dataSource}
        columns={[
          { key: 'day', title: '日期' },
          { key: 'type', title: '渠道' },
          { key: 'value', title: '首次安装人数' },
        ]}
      />
      <div id={`hour-${molecular}-${title}`} />
    </CardTemplateView>
  </Row>;
};
