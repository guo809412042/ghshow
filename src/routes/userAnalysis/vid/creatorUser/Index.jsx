import React from 'react';
import { Tabs } from 'antd';
import styles from './index.less';
import TabPaneOne from './components/TabPaneOne';
import TabPaneTwo from './components/TabPaneTwo';
import TabPaneThree from './components/TabPaneThree';
import RemainView from './components/RemainView';
import PublishView from './components/PublishView';
import ConsumeView from './components/ConsumeView';

function Index() {
  return (<div className={styles.bg}>
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="总览" key="1">
        <TabPaneOne />
      </Tabs.TabPane>
      <Tabs.TabPane tab="用户明细" key="2">
        <TabPaneTwo />
      </Tabs.TabPane>
      <Tabs.TabPane tab="视频明细" key="3">
        <TabPaneThree />
      </Tabs.TabPane>
      <Tabs.TabPane tab="留存分析" key="4">
        <RemainView/>
      </Tabs.TabPane>
      <Tabs.TabPane tab="发布情况" key="5">
        <PublishView />
      </Tabs.TabPane>
      <Tabs.TabPane tab="消费情况" key="6">
        <ConsumeView />
      </Tabs.TabPane>
    </Tabs>
  </div>);
}


export default Index;
