/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-10 15:34:54
 * @LastEditTime: 2020-04-15 16:57:19
 * @LastEditors: ssssslf
 */

import G2 from '@antv/g2';
import { removeChartNode } from '../../common/chartFunc/removeChartNode';

// const colors = ['#fba540', '#FF7F50', '#02ba5a', '#d13adf', '#03d0ea', '#ED5565', '#14abef', '#f5365c', '#A0D468'];
export function chartRender(data, nodeId) {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height: 350,
    // width: node.offsetWidth,
    padding: 'auto',
    forceFit: true,
  });
  chart.source(data);

  const stack = chart.intervalStack();

  stack
    .position('day*value')
    .color('type')
    .tooltip('type*tip', (type, tip) => ({
      name: type,
      value: tip,
    }));

  // const margin = 2 / data.length;
  // chart.scale('day', {
  //   range: [margin / 2, 1 - margin / 2],
  // });

  // chart.legend({
  //   position: 'right-center',
  // });
  chart.render();
}
