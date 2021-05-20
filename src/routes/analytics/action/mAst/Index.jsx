/*
 * @Date: 2020-12-09 20:11:03
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-01-26 19:05:54
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState } from 'react';
import { Row, Radio } from 'antd';
import { AbsCardData, PerCardData } from './contants';
import ChartCardView from './components/ChartCardView';
import KeywordsRank from './components/KeywordRank';

export default () => {
  const [type, setType] = useState('abs');
  const [userType, setUserType] = useState('all');
  return (
    <div style={{ padding: 10 }}>
      <Radio.Group defaultValue="abs" buttonStyle="solid" style={{ marginBottom: '12px' }} onChange={e => setType(e.target.value)}>
        <Radio.Button value="abs">绝对值</Radio.Button>
        <Radio.Button value="per">占比</Radio.Button>
      </Radio.Group>
      <Radio.Group value={userType} buttonStyle="solid" style={{ marginBottom: '12px', marginLeft: 16 }} onChange={e => setUserType(e.target.value)}>
        <Radio.Button value="all">all</Radio.Button>
        <Radio.Button value="new">新用户</Radio.Button>
        <Radio.Button value="old">老用户</Radio.Button>
      </Radio.Group>
      <Row gutter={16} type="flex">
        {(type === 'abs' ? [...AbsCardData] : [...PerCardData]).map(v => (
          <ChartCardView {...v} key={`${v.molecular} - ${v?.denominator}-${userType}`} userType={userType}/>
        ))}
      </Row>
      <Row gutter={16}>
        <KeywordsRank/>
      </Row>
    </div>
  );
};
