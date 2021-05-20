/*
 * @Author: ssssslf
 * @Date: 2020-01-15 14:36:50
 * @LastEditTime : 2020-03-02 13:41:51
 * @LastEditors  : ssssslf
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/coreMonitore/apiMonitore/components/drawChart.js
 */
import G2 from '@antv/g2';
import moment from 'moment';

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


export function ChartRenderWithTool(data, nodeId, suffix, list) {
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
  chart.axis('value', {
    label: {
      formatter: function formatter(val) {
        return `${val}%`;
      },
    },
  });
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
  if (list.length) {
    chart.on('tooltip:change', (ev) => {
      const items = ev.items; // tooltip显示的项
      const data = list.filter(v => moment(v.date_time).format('HH:mm') === items[0].title);
      data.forEach((v) => {
        items.push({
          name: v.status_code,
          value: Number((v.ratio * 100).toFixed(2)),
        });
      });
    });
  }
}

export function BarChartRender(data, nodeId) {
  const node = document.getElementById(nodeId);
  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 250,
    padding: 'auto',
  });
  chart.source(data, {
    day: {
      alias: '时间',
      type: 'time',
      mask: 'HH:mm',
      tickCount: 24,
      nice: false,
    },
    value: {
      max: 100,
      min: 0,
      nice: true,
    },
  });

  chart.axis('value', false);
  chart.intervalStack()
    .position('day*value')
    .color('type')
    .opacity(1);
  chart.render();
}
