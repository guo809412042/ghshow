import React, { useState, useEffect } from 'react';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { mainPtrSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';

const { Option } = Select;

export default () => {
  const [ptrType, setPtrType] = useState('ptr');
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const getFetchData = async () => {
    const sql = createSqlWhere({
      sql: mainPtrSQL,
      startDate,
      endDate,
    });
    const res = await getData(sql);
    const data = res.map((v) => {
      if (ptrType === 'ptr') {
        return ({
          day: moment(v.day.toString()).format('YYYY-MM-DD'),
          value: getNumber(v.play_puid_total, v.exposure_puid_total),
          type: v.ab_version,
        });
      }
      return ({
        day: moment(v.day.toString()).format('YYYY-MM-DD'),
        value: getNumber(v.play_puid_3s, v.exposure_puid_total),
        type: v.ab_version,
      });
    });
    chartLineRender(data, document.getElementById('chart-main-ptr'));
  };
  useEffect(() => {
    getFetchData();
  }, [startDate, endDate, ptrType]);
  return <div>
    <Select
      defaultValue={ptrType}
      style={{
        width: 120,
        marginRight: 30,
      }}
      onChange={setPtrType}
    >
      <Option value="ptr">ptr</Option>
      <Option value="ptr3s">ptr3s</Option>
    </Select>
    <DatePicker.RangePicker
      value={[startDate, endDate]}
      onChange={(value) => {
        setStartDate(value[0]);
        setEndDate(value[1]);
      }}
    />
    <div id="chart-main-ptr" />
  </div>;
};
