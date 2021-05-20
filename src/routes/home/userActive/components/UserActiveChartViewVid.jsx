import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Radio, DatePicker, Col } from 'antd';
import CardBox from '../../common/CardBox';
import { createSqlWhere } from '../../../../utils/utils';
import { vidActiveUserSQL } from '../../common/sqlTemplate';
import { getData } from '../../../../utils/request';
import { chartRender } from '../../../common/chartFunc/chartRender';
import styles from '../../../../styles/index.less';
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
    const res = await getData(sql);
    const chartData = res.map(v => ({
      type,
      day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
      value: v[type],
    }));
    setDataSource(chartData);
    chartRender(chartData, 'user_active_chart', '#008b8b', 'l(100) 0:#008b8b 1:#fff');
  };
  useEffect(() => {
    getList();
  }, [startDate, endDate, type]);
  return <CardBox
    title="用户活跃趋势"
    extra={
      <div style={{ display: 'inline-block', float: 'right' }}>
        <DownLoadButton
          filename="用户活跃趋势"
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

    } >
    <Col span={24} style={{ padding: 20 }} className={styles.homeCardLeft}>
      <div id="user_active_chart" />
    </Col>
    <Col
      span={12}
      style={{
        height: 30,
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        width: '100%',
      }}/>
  </CardBox>;
};
