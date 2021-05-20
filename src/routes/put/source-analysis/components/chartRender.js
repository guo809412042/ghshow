/*
 * @Author: tab
 * @Date: 2020-07-08 16:38:26
 * @Last Modified by:   tab
 * @Last Modified time: 2020-07-08 16:38:26
 */

import G2 from '@antv/g2';

export function chartNewUserRender(data, nodeId) {
  const node = document.getElementById(nodeId);
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height: 350,
    // width: node.offsetWidth,
    padding: 50,
    forceFit: true,
  });
  chart.source(data);
  chart.line()
    .position('ds*reg_num');
  chart.area()
    .position('ds*reg_num');
  chart.render();
}
