import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Row } from 'antd';
import { createSqlWhere } from '../../../../utils/utils';
import { vidActiveUserSQL } from '../../common/sqlTemplate';
import { getData } from '../../../../utils/request';
import CardBox from '../../common/CardBox';
import { chartRender } from '../../../common/chartFunc/chartRender';
import { DownLoadButton } from '../../../common/DownLoadButton';

export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(180, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(0, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const getList = async () => {
    const sql = createSqlWhere({
      sql: vidActiveUserSQL,
      endDate,
      startDate,
    });
    const res = await getData(sql);

    const userRetainData = res.map(v => ({
      type: '用户活跃次留',
      day: moment(v.bizdate.toString()).subtract(1, 'days').format('YYYY-MM-DD'),
      value: v.dau_stay ? Number(((v.dau_stay) * 100).toFixed(2)) : 0,
    }));
    const newRetainData = res.map(v => ({
      type: '新用户活跃留存趋势',
      day: moment(v.bizdate.toString()).subtract(1, 'days').format('YYYY-MM-DD'),
      value: v.dau_stay ? Number(((v.new_dau_stay) * 100).toFixed(2)) : 0,
    }));
    const oldRetainData = res.map(v => ({
      type: '老用户活跃留存趋势',
      day: moment(v.bizdate.toString()).subtract(1, 'days').format('YYYY-MM-DD'),
      value: v.dau_stay ? Number(((v.old_dau_stay) * 100).toFixed(2)) : 0,
    }));
    setDataSource([...userRetainData, ...newRetainData, ...oldRetainData]);
    chartRender(userRetainData, 'user_active_retain_chart', '#0250c5', 'l(100) 0:#0250c5 1:#fff');
    chartRender(newRetainData, 'user_new_retain_chart', '#0c3483', 'l(100) 0:#0c3483 1:#fff');
    chartRender(oldRetainData, 'user_old_retain_chart', '#0c3483', 'l(100) 0:#0c3483 1:#fff');
  };
  useEffect(() => {
    getList();
  }, [startDate, endDate]);
  return <div>
    <div style={{ marginBottom: 20 }}>
      <DownLoadButton
        filename="留存"
        data={dataSource}
        columns={[{ title: 'day', key: 'day' },
          { title: 'value', key: 'value' },
          { title: 'type', key: 'type' }]}
      />
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(value) => {
          setStartDate(value[0]);
          setEndDate(value[1]);
        }}
      />
    </div>
    <Row >
      <CardBox title="用户活跃次留趋势">
        <div id="user_active_retain_chart" />
      </CardBox>

    </Row>
    <Row >
      <CardBox title=" 新用户活跃留存趋势">
        <div id="user_new_retain_chart" />
      </CardBox>
    </Row>
    <Row >
      <CardBox title=" 老用户活跃留存趋势">
        <div id="user_old_retain_chart" />
      </CardBox>
    </Row>
  </div>;
};
