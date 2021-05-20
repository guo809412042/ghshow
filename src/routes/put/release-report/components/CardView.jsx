/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/3/5
 * Time: 下午4:35
 *
 */
import React from 'react';
import { Col, Icon, Statistic } from 'antd';
import classnames from 'classnames';
import G2 from '@antv/g2';
import styles from './index.less';


export default class CardView extends React.Component {
  state = {
    percent: 0,
    num: 0,
    chartData: [],
    type: '',
    bg: '',
    title: '',
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps }, this.chartRender);
  }

  chartRender = () => {
    const {
      chartData, type, bg,
    } = this.state;
    const data = [];
    if (type === 'cpi') {
      chartData.forEach((v) => {
        data.push({
          day: v.ds,
          value: v.install ? parseFloat((v.spend / v.install).toFixed(2)) : 0,
        });
      });
    } else {
      chartData.forEach((v) => {
        data.push({
          day: v.ds,
          value: parseFloat(v[type].toFixed(2)),
        });
      });
    }
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
    chart.source(data);
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

  render() {
    const {
      percent, num, type, title,
    } = this.state;
    return (<Col span={8}>
      <div className={classnames(styles.panel, styles.statsWidget)}>
        <div className={styles.panelBody}>
          <div className={classnames(styles.pullLeft)}>
            <p className={styles.statsInfo}>{title}</p>
            <p className={styles.statsNumber}>{num}</p>
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
