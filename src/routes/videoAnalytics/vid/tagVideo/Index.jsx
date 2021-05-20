import React from 'react';
import { Tabs } from 'antd';
import AllView from './components/AllView';
import DetailView from './components/DetailView';

const Index = () => <div>
  <Tabs defaultActiveKey="1">
    <Tabs.TabPane tab="汇总数据" key="1" >
      <AllView/>
    </Tabs.TabPane>
    <Tabs.TabPane tab="明细数据" key="2" >
      <DetailView/>
    </Tabs.TabPane>
  </Tabs>
</div>;

export default Index;
