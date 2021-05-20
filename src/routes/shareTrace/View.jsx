import React, { Fragment } from 'react';
import Share from './components/Share';
import Trace from './components/Trace';
import Stay from './components/Stay';
import ShareChart from './components/ShareChart';

export default () => (
  <Fragment>
    <Share />
    <ShareChart />
    <Trace />
    <Stay />
  </Fragment>
);
