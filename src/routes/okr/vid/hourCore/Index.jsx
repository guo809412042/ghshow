/* eslint-disable no-unused-vars */
import React from 'react';
import { Row } from 'antd';
import { cardData, dayCardData } from './contants';
import ChartCardView from './components/ChartCardView';
import ChartCardViewDay from './components/ChartCardViewDay';
import TemplateShare from './components/TemplateShare';
import TemplateHighShare from './components/TemplateHighShare';

export default () => (
  <div style={{ padding: 10 }}>
    <Row gutter={16}>
      {dayCardData.map((v, index) => (
        <ChartCardViewDay {...v} key={index} />
      ))}
    </Row>
    <Row gutter={16}>
      {cardData.map((v, index) => (
        <ChartCardView {...v} key={index} />
      ))}
    </Row>
    <Row gutter={16}>
      <TemplateShare />
    </Row>
    <Row gutter={16}>
      <TemplateHighShare />
    </Row>
  </div>
);
