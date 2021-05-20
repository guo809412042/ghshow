import React from 'react';
import { Row } from 'antd';
import { cardData } from './contants';
import ChartCardView from './components/ChartCardView';
import ExportTemplateUser from './components/ExportTemplateUser';
import KeywordsRank from './components/KeywordsRank';

export default () => (
  <div style={{ padding: 10 }}>
    <Row gutter={16}>
      {cardData.map((v, index) => (
        <ChartCardView {...v} key={index} />
      ))}
    </Row>
    <Row gutter={16}>
      <ExportTemplateUser />
    </Row>
    <Row gutter={16}>
      <KeywordsRank/>
    </Row>
  </div>
);
