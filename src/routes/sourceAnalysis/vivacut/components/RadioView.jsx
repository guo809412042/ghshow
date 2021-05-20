/* eslint-disable react/prop-types */
import React from 'react';
import { Radio, Row } from 'antd';

const RadioView = ({ radioValue, setRadioValue }) => <Row style={{ textAlign: 'center' }}>
  <Radio.Group
    style={{
      marginTop: 20,
    }}
    value={radioValue}
    onChange={e => setRadioValue(e.target.value)}
  >
    <Radio.Button key="all" value="all">所有数据</Radio.Button>
    <Radio.Button key="a" value="a" disabled>广告数据</Radio.Button>
    <Radio.Button key="b" value="b">变现数据</Radio.Button>
  </Radio.Group>
</Row>;
export default RadioView;
