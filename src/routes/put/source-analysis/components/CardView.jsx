/* eslint-disable no-return-assign */
/*
 * @Author: tab
 * @Date: 2020-07-08 16:29:28
 * @Last Modified by: tab
 * @Last Modified time: 2020-07-08 17:19:27
 */

import React from 'react';
import { Col, Icon, Statistic } from 'antd';
import classnames from 'classnames';
import G2 from '@antv/g2';
import moment from 'moment';
import styles from './index.less';


export default class CardView extends React.Component {
  state = {
    percent: 0,
    num: 0,
    type: '',
    numCount: [],
    numCountBefore: [],
  }

  componentWillReceiveProps(nextProps) {
    const {
      bg,
      type,
      numCount,
      numCountBefore,
    } = nextProps;
    if (numCount !== this.state.numCount || numCountBefore !== this.state.numCountBefore || type !== this.state.type) {
      let count = 0;
      numCount.forEach(v => count += v[type]);
      let countBefore = 0;
      numCountBefore.forEach(v => countBefore += v[type]);
      const num = count ? (count / numCount.length).toFixed(2) : 0;
      const percent = count && countBefore
        ? (((count / numCount.length - countBefore / numCountBefore.length) * 100) / (countBefore / numCountBefore.length)).toFixed(2) : 0;
      this.setState({
        num,
        percent,
        type,
        numCountBefore,
        numCount,
      });
      const node = document.getElementById(`myChart${type}`);
      while (node && node.firstChild) {
        node.removeChild(node.firstChild);
      }
      const chart = new G2.Chart({
        container: node,
        height: 100,
        width: node.offsetWidth,
        padding: [10, 10, 10, 10],
        forceFit: true,
      });
      const list = numCount.map(v => ({
        day: moment((v.ds).toString()).format('YYYY-MM-DD'),
        value: v[type],
        type,
      }));
      chart.source(list);
      chart.area()
        .position('day*value')
        .color(bg)
        .shape('smooth');
      chart.line()
        .position('day*value')
        .color(bg)
        .shape('smooth');
      chart.point()
        .position('day*value')
        .size(4)
        .shape('circle')
        .color(bg)
        .style({
          stroke: '#fff',
          lineWidth: 1,
        });
      chart.axis('day', {
        title: null,
        line: null,
        grid: null,
        label: null,
      });
      chart.axis('value', {
        title: null,
        line: null,
        grid: null,
        label: null,
      });
      chart.render();
    }
  }

  render() {
    const {
      title,
      type,
    } = this.props;
    const {
      percent, num,
    } = this.state;
    return (<Col span={8}>
      <div className={classnames(styles.panel, styles.statsWidget)}>
        <div className={styles.panelBody}>
          <div className={classnames(styles.pullLeft)}>
            <p className={styles.statsInfo}>{title}</p>
            <p className={styles.statsNumber}>{title === '投放新增' ? num : num}</p>
          </div>
          <div className={classnames(styles.pullRight)}>
            <Statistic
              value={percent}
              precision={2}
              valueStyle={{
                color: percent > 0 ? '#3f8600' : '#EC5E69',
                textAlign: 'center',
                paddingTop: 10,
              }}
              prefix={percent > 0 ? <Icon type="arrow-up"/> : <Icon type="arrow-down"/>}
              suffix="%"
            />
          </div>

        </div>
        <div className={styles.panelFooter}>
          {/* <div ref="chart" /> */}
          <div>
            <div id={`myChart${type}`}/>
          </div>
        </div>
      </div>
    </Col>);
  }
}
