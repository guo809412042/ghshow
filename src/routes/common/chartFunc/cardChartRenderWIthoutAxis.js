import G2 from '@antv/g2';
import { removeChartNode } from './removeChartNode';

export function cardChartRender(data = [], nodeId, color, height = 30) {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height,
    // width: node.offsetWidth,
    padding: [10, 0, 0, 0],
    forceFit: true,
  });
  chart.source(data);
  chart
    .line()
    .position('day*value')
    .color(color)
    .shape('smooth');
  chart
    .area()
    .position('day*value')
    .color(color)
    .shape('smooth');

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
