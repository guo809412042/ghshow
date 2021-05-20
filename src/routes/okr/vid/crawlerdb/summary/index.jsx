/*
 * @Date: 2020-06-09 09:36:18
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-12-09 20:43:50
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Tabs, DatePicker, Card } from 'antd';
import { getSummaryData } from '../service';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import { chartLineRender } from '../../../../common/chartFunc/chartLineRender';

const { TabPane } = Tabs;
export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(0, 'days'));
  const [data, setData] = useState([]);
  const [appnameData, setAppnameData] = useState([]);
  const [tabsKey, setTabsKey] = useState('1');
  const getData = async () => {
    const res = await getSummaryData(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD')).then(res => res.filter(i => i.appname !== 'Vfly'));
    const appname = [];
    for (const i of res) {
      if (!appname.includes(i.appname)) {
        if (i.appname === 'Mvmaster') {
          appname.unshift(i.appname);
        } else {
          appname.push(i.appname);
        }
      }
    }
    // console.log('appname', appname);
    // console.log('res', res);
    setAppnameData(appname);
    setData(res);
    if (tabsKey === '2') {
      for (const i of appname) {
        const list = res.filter(v => v.appname === i);
        const chartData = list.map(v => ({
          day: moment(v.creat_time).format('YYYY-MM-DD'),
          value: v.category,
          type: i,
        }));
        chartLineRender(chartData, document.getElementById(`${i}-Category`));
      }
    } else {
      for (const i of appname) {
        const list = res.filter(v => v.appname === i);
        const chartData = list.map(v => ({
          day: moment(v.creat_time).format('YYYY-MM-DD'),
          value: v.template_count,
          type: i,
        }));
        chartLineRender(chartData, document.getElementById(`${i}-Template`));
      }
    }
  };
  useEffect(() => {
    getData();
  }, [startDate, endDate, tabsKey]);
  return <div >
    <DatePicker.RangePicker
      value={[startDate, endDate]}
      onChange={
        (value) => {
          setStartDate(value[0]);
          setEndDate(value[1]);
        }
      }
    />
    <DownLoadButton
      columns={data.length ? Object.keys(data[0]).map(v => ({
        key: v, title: v,
      })) : []}
      filename="竞品监控数据"
      data={data}
    />
    <Tabs activeKey={tabsKey} onChange={setTabsKey} >

      <TabPane tab="Template" key="1">
        {appnameData.map(v => <div style={{ margin: '20px 0' }}>
          <Card title={v}>
            <div id={`${v}-Template`}/>
          </Card>
        </div>)}
      </TabPane>
      <TabPane tab="Category" key="2">
        {appnameData.map(v => <div style={{ margin: '20px 0' }}>
          <Card title={v}>
            <div id={`${v}-Category`}/>
          </Card>
        </div>)}
      </TabPane>
    </Tabs>
  </div>;
};
