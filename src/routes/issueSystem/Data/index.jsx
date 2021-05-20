import React from 'react';
import { Tabs } from 'antd';
import OverviewView from './components/OverviewView';
import FeedbackView from './components/FeedbackView';

const TabPane = Tabs.TabPane;
export default () => (
  <Tabs defaultActiveKey="1">
    <TabPane tab="进线概览" key="1">
      <OverviewView />
    </TabPane>
    <TabPane tab="反馈数据" key="2">
      <FeedbackView />
    </TabPane>
  </Tabs>
);
