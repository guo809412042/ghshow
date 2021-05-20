/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-10 15:34:54
 * @LastEditTime: 2020-05-15 17:34:30
 * @LastEditors: ssssslf
 */

import G2 from '@antv/g2';
import { removeChartNode } from '../../common/chartFunc/removeChartNode';

// const colors = ['#14abef', '#f5365c', '#02ba5a', '#03d0ea', '#fba540', '#d13adf', '#A0D468', '#ED5565'];
export function cardChartRender(data, nodeId) {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height: 300,
    // width: node.offsetWidth,
    padding: 'auto',
    forceFit: true,
  });
  chart.source(data);
  chart
    .line()
    .opacity(0.3)
    .adjust('stack')
    .position('day*value')
    .color('type');
  chart
    .area()
    .opacity(0.3)
    .adjust('stack')
    .position('day*value')
    .color('type');

  chart.render();
}
