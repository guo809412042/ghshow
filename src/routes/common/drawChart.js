/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2019-10-29 16:19:17
 * @LastEditTime: 2020-09-29 14:32:22
 * @LastEditors: ssssslf
 */
import G2 from '@antv/g2';
import moment from 'moment';

function removeChartNode(nodeId) {
  const node = document.getElementById(nodeId);
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function ChartRender(data, nodeId, suffix, hideNormal, colors = '') {
  const filterItem = [];
  if (hideNormal) {
    filterItem.push('默认');
  }
  const node = document.getElementById(`chart-${nodeId}`);
  removeChartNode(`chart-${nodeId}`);
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
  chart.source(data);

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
  chart.legend('type', {
    position: 'top',
  });
  chart
    .line()
    .position('day*value')
    .color('type', colors)
    .shape('smooth');

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
  chart.render();
}

export function areaChartRender(data, nodeId, colors) {
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
  chart.legend('type', {
    position: 'top',
  });
  chart.source(data);
  chart
    .area()
    .opacity(0.3)
    .adjust('stack')
    .position('day*value')
    .color('type', colors);
  chart.render();
}

export function chartBarRender(json, nodeId, colors) {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  // 判断 data 是否为空
  const data = json
    .map(v => ({
      ...v,
      day: moment(v.day).format('YYYYMMDD'),
    }))
    .sort((a, b) => a.day - b.day);
  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 300,
  });
  chart.source(data);
  chart.legend('type', {
    position: 'top',
  });

  chart
    .interval()
    .position('day*value')
    .color('type', colors)
    .adjust([
      {
        type: 'dodge',
        marginRatio: 1 / 32,
      },
    ]);
  chart.render();
}
