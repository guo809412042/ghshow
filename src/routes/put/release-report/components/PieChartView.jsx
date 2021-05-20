/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/4/20
 * Time: 下午5:55
 *
 */
import React from 'react';
import { Row, Col, Button } from 'antd';
import G2 from '@antv/g2';
import exportParams from '../../../../utils/exportExecl';

export default class PieChartView extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { title, data } = nextProps;
    const node = document.getElementById(`chart-${title}`);
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    // 判断 data 是否为空
    if (data.length === 0) {
      return;
    }
    const chart = new G2.Chart({
      container: node,
      forceFit: true,
      height: 350,
    });
    chart.source(data);
    // 重要：绘制饼图时，必须声明 theta 坐标系
    chart.coord('theta', {
      radius: 1,
    });
    chart.tooltip({
      showTitle: false,
    });
    chart.legend(false);
    chart.intervalStack()
      .position('percent')
      .color('item')
      .tooltip('item*percent')
      .label('percent', {
        formatter: function formatter(val, item, index) {
          return index < 5 ? `${item.point.item}: ${val}%` : '';
        },
      })
      .style({
        lineWidth: 1,
        stroke: '#fff',
      });
    chart.render();
  }

  render() {
    const { title, data } = this.props;
    const columns = [];
    data.length && Object.keys(data[0])
      .forEach((v) => {
        columns.push({
          dataIndex: v,
          key: v,
          title: v,
        });
      });
    return (
      <Col
        span={12}
        style={{
          padding: 20,
        }}
      >
        <h3>{title}</h3>
        <Button
          style={{ marginTop: 20 }}
          type="primary"
          onClick={() => exportParams({
            filename: '投放报表',
            columns,
            data,
          })}
        >导出</Button>
        <Row
          style={{
            background: '#fff',
          }}
        >
          <div id={`chart-${title}`}/>
        </Row>
      </Col>
    );
  }
}
