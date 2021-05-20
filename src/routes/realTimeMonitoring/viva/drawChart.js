/*
 * @Author: ssssslf
 * @Date: 2020-01-15 14:36:50
 * @LastEditTime : 2020-01-15 16:11:32
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/coreMonitore/apiMonitore/components/drawChart.js
 */
import G2 from '@antv/g2';

function removeChartNode(nodeId) {
  const node = document.getElementById(nodeId);
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function ChartRender(data, nodeId, suffix, hideNormal) {
  const filterItem = [];
  if (hideNormal) {
    filterItem.push('默认');
  }
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
  if (suffix) {
    chart.axis('value', {
      label: {
        formatter: function formatter(val) {
          return `${val}%`;
        },
      },
    });
  } else {
    chart.axis('value', { alias: '数量' });
  }
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
