import React from 'react';
import { Divider } from 'antd';
import ChannelAction from './components/ChannelAction';
import Retention from './components/Retention';

export default () => (
  <>
    <Retention />
    <Divider style={{ margin: '26px 0px' }} />
    <ChannelAction />
  </>
);
