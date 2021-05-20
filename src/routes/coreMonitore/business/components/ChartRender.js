/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 14:10:16
 * @LastEditTime: 2020-06-03 15:04:00
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

export function ChartRender(list, nodeId, length) {
  const data = list.filter(v => v.results === 'Success');
  const CancelData = list.filter(v => v.results === 'Cancel');
  const FailData = list.filter(v => v.results === 'Fail');
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
      // tickCount: 24,
    },
  });
  chart.scale({
    value: {
      min: 0,
    },
  });
  chart.axis('day');
  chart.axis('value', { alias: '数量' });
  chart.axis('type', { alias: '类型' });
  chart
    .line()
    .position('day*value')
    .color('type')
    .shape('smooth');
  // chart
  //   .area()
  //   .position('day*value')
  //   .color('type')
  //   .shape('smooth');
  chart.legend('type', {
    position: 'top',
  });
  // chart
  //   .point()
  //   .position('day*value')
  //   .size(3)
  //   .shape('circle')
  //   .color('type')
  //   .style({
  //     stroke: '#fff',
  //     lineWidth: 1,
  //   });
  chart.render();
  if (length === 1) {
    chart.on('tooltip:change', (ev) => {
      const items = ev.items; // tooltip显示的项
      const failList = FailData.filter(v => moment(v.day).format('HH:mm') === items[0].title);
      const cancleList = CancelData.filter(v => moment(v.day).format('HH:mm') === items[0].title);
      cancleList.forEach((v) => {
        items.push({
          name: v.results,
          value: v.value,
        });
      });
      failList.forEach((v) => {
        items.push({
          name: `${v.results}--${v.error_code}`,
          value: v.value,
        });
      });
    });
  }
}

export function ChartRenderSimple(data, node) {
  removeChartNode(node);
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
      // tickCount: 24,
    },
  });
  chart.scale({
    value: {
      min: 0,
    },
  });
  chart.axis('day');
  chart.axis('value', { alias: '数量' });
  chart.axis('type', { alias: '类型' });
  chart
    .line()
    .position('day*value')
    .color('type')
    .shape('smooth');
  // chart
  //   .area()
  //   .position('day*value')
  //   .color('type')
  //   .shape('smooth');
  chart.legend('type', {
    position: 'top',
  });
  // chart
  //   .point()
  //   .position('day*value')
  //   .size(3)
  //   .shape('circle')
  //   .color('type')
  //   .style({
  //     stroke: '#fff',
  //     lineWidth: 1,
  //   });
  chart.render();
}
