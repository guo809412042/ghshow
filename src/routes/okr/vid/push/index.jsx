import React, { useState, useEffect } from 'react';
import { Row } from 'antd';
import { cardData } from './const';
import ChartCardView from './components/ChartCardView';

import { getData } from '../../../../utils/request';


const appVersionSQL = `
SELECT DISTINCT(app_version)
  FROM mb_vid_push_dashboard
WHERE app_version  is not null
ORDER BY app_version desc`;

export default () => {
  const [appVersionList, setAppVersionList] = useState([]);
  const getAppVersion = async () => {
    const res = await getData(appVersionSQL);
    setAppVersionList(res);
  };
  useEffect(() => {
    getAppVersion();
  }, []);
  return <div style={{ padding: 10 }}>
    <Row gutter={16}>
      {cardData.map((v, index) => (
        <ChartCardView {...v} key={index} appVersionList={appVersionList}/>
      ))}
    </Row>
  </div>;
};
