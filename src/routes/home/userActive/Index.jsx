/* eslint-disable react/no-unused-state */
import React from 'react';
import { Icon, Tooltip } from 'antd';
import styles from '../../../styles/index.less';
import UserActiveCard from './components/UserActiveCard';
import UserActiveChartView from './components/UserActiveChartView';
import NewOldUserActiveChartView from './components/NewOldUserActiveChartView';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';
import UserActiveChartViewVid from './components/UserActiveChartViewVid';
import NewOldUserActiveChartViewVid from './components/NewOldUserActiveChartViewVid';
import UserCardView from './components/UserCardView';
// import DailyNewOldActiveChartView from './components/DailyNewOldActiveChartView';

export default ({ product }) => (
  <div style={{ marginTop: 30 }}>
    {BreadcrumbMenu()}
    <p className={styles.homeTitle}>
      新增&活跃
      <Tooltip
        overlay={
          <div>
            <p>环比: 与昨天进行比较</p>
            <p>同比: 与七天前比较</p>
            <p>新增: 为服务端新增</p>
          </div>
        }
      >
        <Icon type="question-circle" style={{ marginLeft: 10 }} />
      </Tooltip>
    </p>
    {product === 'vid' ? <UserActiveCard product={product} /> : <UserCardView product={product} />}
    {/* 用户活跃趋势 */}
    {product === 'vid' ? <UserActiveChartViewVid /> : <UserActiveChartView product={product} />}

    {/* 新老用户活跃趋势 */}
    {product === 'vid' ? <NewOldUserActiveChartViewVid /> : <NewOldUserActiveChartView product={product} />}

    {/* 每日新老用户活跃占比 */}
    {/* <DailyNewOldActiveChartView product={product} /> */}
  </div>
);
