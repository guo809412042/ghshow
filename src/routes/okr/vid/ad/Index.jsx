import React from 'react';
import { Row } from 'antd';
import { cardData } from './contants';
import ChartCardView from './components/ChartCardView';

export default () => (
  <div style={{ padding: 10 }}>
    <Row gutter={16}>
      {cardData.map((v, index) => (
        <ChartCardView {...v} key={index} />
      ))}
    </Row>
  </div>
);
