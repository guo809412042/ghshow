/* eslint-disable no-unused-vars */
import React from 'react';
import { Row } from 'antd';
import { cardData, gpSearchData } from './contants';
import ChartCardView from './components/ChartCardView';
import SearchChartCardView from './components/SearchChartCardView';
import SearchTableCardView from './components/SearchTableView';

export default () => (
  <div style={{ padding: 10 }}>
    <Row gutter={16}>
      {cardData.map((v, index) => (
        <ChartCardView {...v} key={index} />
      ))}
    </Row>
    <Row gutter={16}>
      <SearchChartCardView {...gpSearchData} key={2} />
    </Row>
    <Row gutter={16}>
      <SearchTableCardView {...gpSearchData} visible key={3} />
    </Row>
  </div>
);
