/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-12 10:15:41
 * @LastEditTime: 2020-03-12 10:16:26
 * @LastEditors: ssssslf
 */
import G2 from '@antv/g2';

function removeChartNode(nodeId) {
  const node = document.getElementById(nodeId);
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function ChartRenderHHMM(data, nodeId) {
  const filterItem = [];
  const node = document.getElementById(nodeId);

  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height: 250,
    forceFit: true,
    width: 'auto',
    padding: 'auto',
  });
  chart.filter('type', val => !filterItem.includes(val));
  chart.source(data, {
    day: {
      alias: '时间',
      type: 'time',
      mask: 'HH:mm',
      tickCount: 24,
      nice: false,
    },
  });
  chart
    .line()
    .position('day*value')
    .color('type')
    .shape('smooth');
  chart.legend('type', {
    position: 'top',
  });

  chart.axis('day');
  chart.axis('value', { alias: '数量' });
  chart.axis('type', { alias: '类型' });
  chart
    .point()
    .position('day*value')
    .size(4)
    .shape('circle')
    .color('type')
    .style({
      stroke: '#fff',
      lineWidth: 1,
    });
  chart.render();
}
