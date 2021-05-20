/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/5/28
 * Time: 上午11:35
 *
 */
import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { createSqlWhere } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import { chartLineRender } from '../../../../common/chartFunc/chartLineRender';

const sqlTemplate = `select  sum(#molecular#) as #molecular#
,ds
from    #database#
where   ds >= #startDate#
and     ds <= #endDate#
#otherWhere#
group by ds
order by ds
limit   10000
;
`;


const { RangePicker } = DatePicker;
export default ({
  currentDate, title, molecular, visible, database, otherWhere,
}) => {
  const [startDate, setStartDate] = useState(moment(currentDate).subtract(6, 'days'));
  const [endDate, setEndDate] = useState(currentDate);
  const [dataSource, setDataSource] = useState([]);
  const getChartData = async () => {
    const sql = createSqlWhere({
      sql: sqlTemplate,
      startDate,
      endDate,
      molecular,
      database,
      otherWhere,
    });
    const res = await getData(sql);
    const data = [];
    if (res.length) {
      res.forEach((v) => {
        data.push({
          day: moment(v.ds.toString()).format('YYYY-MM-DD'),
          value: v[molecular],
          type: title,
        });
      });
      setDataSource(data);
    }
    chartLineRender(data, document.getElementById(`chartModal-${molecular}-${title}`));
  };

  useEffect(() => {
    if (visible) {
      getChartData();
    }
  }, [startDate, endDate]);
  useEffect(() => {
    if (visible) {
      setStartDate(moment(currentDate).subtract(6, 'days'));
      setEndDate(currentDate);
    }
  }, [currentDate]);
  return <div>
    <RangePicker
      value={[startDate, endDate]}
      onChange={(value) => {
        setEndDate(value[1]);
        setStartDate(value[0]);
      }}
    />
    <DownLoadButton
      filename={title}
      data={dataSource}
      columns={[
        { key: 'day', title: 'day' },
        { key: 'value', title: 'value' },
      ]}
    />
    <div id={`chartModal-${molecular}-${title}`} />
  </div>;
};
