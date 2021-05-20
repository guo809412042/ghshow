import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Radio, DatePicker, Row } from 'antd';
import { createSqlWhere } from '../../../../utils/utils';
import { vidActiveUserSQL } from '../../common/sqlTemplate';
import { getData } from '../../../../utils/request';
import CardBox from '../../common/CardBox';
import { chartRender } from '../../../common/chartFunc/chartRender';
import { DownLoadButton } from '../../../common/DownLoadButton';

export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(180, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(0, 'days'));
  const [type, setType] = useState('dau');
  const [dataSource, setDataSource] = useState([]);
  const getList = async () => {
    const sql = createSqlWhere({
      sql: vidActiveUserSQL,
      endDate,
      startDate,
    });
    const newUserData = [];
    const oldUserData = [];
    const res = await getData(sql);
    res.forEach((v) => {
      newUserData.push({
        type: '新用户',
        day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
        value: type === 'dau' ? v.dau_new_1d : v.dau_app_new_1d,
      });
      oldUserData.push({
        type: '老用户',
        day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
        value: type === 'dau' ? v.dau_old_1d : v.dau_app_old_1d,
      });
    });
    setDataSource([...newUserData, ...oldUserData]);
    chartRender(newUserData, 'new_user_chart', '#40a9ff', 'l(100) 0:#40a9ff 1:#fff');
    chartRender(oldUserData, 'old_user_chart', '#14abef', 'l(100) 0:#14abef 1:#fff');
  };
  useEffect(() => {
    getList();
  }, [startDate, endDate, type]);
  return <div>
    <div style={{ marginBottom: 20 }}>
      <DownLoadButton
        filename="活跃趋势"
        data={dataSource}
        columns={[{ title: 'day', key: 'day' },
          { title: 'value', key: 'value' },
          { title: 'type', key: 'type' }]}
      />
      <Radio.Group
        value={type}
        onChange={e => setType(e.target.value)}
        style={{ marginRight: 20 }}
      >
        <Radio.Button key="dau" value="dau">DAU</Radio.Button>
        <Radio.Button key="app_dau" value="app_dau">DAU(APP)</Radio.Button>
      </Radio.Group>
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(value) => {
          setStartDate(value[0]);
          setEndDate(value[1]);
        }}
      />
    </div>
    <Row >
      <CardBox title="新用户活跃趋势">
        <div id="new_user_chart" />
      </CardBox>
    </Row>
    <Row>
      <CardBox title="老用户活跃趋势">
        <div id="old_user_chart" />
      </CardBox>
    </Row>
  </div>;
};
