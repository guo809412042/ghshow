/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-10 15:34:54
 * @LastEditTime: 2020-04-15 16:57:19
 * @LastEditors: ssssslf
 */

import G2 from '@antv/g2';
import { removeChartNode } from '../../common/chartFunc/removeChartNode';

const colors = ['#fba540', '#FF7F50', '#02ba5a', '#d13adf', '#03d0ea', '#ED5565', '#14abef', '#f5365c', '#A0D468'];
export function chartRender(data, nodeId) {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height: 250,
    // width: node.offsetWidth,
    padding: 'auto',
    forceFit: true,
  });
  chart.source(data);
  chart
    .line()
    .position('day*value')
    .color('type', colors);
  chart
    .point()
    .position('day*value')
    .size(4)
    .shape('circle')
    .color('type', colors)
    .style({
      stroke: '#fff',
      lineWidth: 1,
    });
  chart
    .area()
    .position('day*value')
    .color('type', colors);

  chart.render();
}
