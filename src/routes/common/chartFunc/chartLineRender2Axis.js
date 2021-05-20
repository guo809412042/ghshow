/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2019-12-10 10:55:18
 * @LastEditTime: 2021-02-08 17:32:34
 * @LastEditors: dongqi.zhao
 */
import { Chart } from '@antv/g2';

function formatterValue(value) {
  if (value > 10000) {
    return `${(value / 10000).toFixed(1)}w`;
  } if (value > 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value;
}

const rateList = ['click_rate', 'show_rate', 'fill_rate'];

export function chartLineRender({
  data, node, height = 300, colors = [], y1, y2, keymap,
}) {
  // 移除所有子节点
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }

  console.log('data', data);

  // 判断 data 是否为空
  if (data.length === 0) {
    return;
  }
  // 图表样式配置
  const chart = new Chart({
    container: node,
    forceFit: true,
    height,
    padding: [50, 80, 60, 60],
  });
  // chart.legend({
  //   position: 'top',
  //   itemWrap: true,
  // });
  // 图表数据配置
  chart.source(data);
  // chart.scale('day', {
  //   alias: '日期',
  // });
  chart.scale({
    day: {
      alias: '日期',
      type: 'time',
    },
    [y1]: {
      alias: keymap[y1],
      min: 0,
      sync: true,
      nice: true,
      formatter: value => formatterValue(value),
    },
    [y2]: {
      alias: keymap[y2],
      formatter: value => formatterValue(value),
      sync: true,
      nice: true,
    },
  });
  chart.axis(y1, {
    title: {},
  });
  chart.axis(y2, {
    grid: null,
    title: {},
  });
  chart.tooltip({
    showCrosshairs: true,
    shared: true,
  });
  chart.legend(false);
  if (rateList.includes(y1)) {
    chart.scale(y1, { formatter: val => `${(val * 100).toFixed(2)}` });
  }
  if (rateList.includes(y2)) {
    chart.scale(y2, { formatter: val => `${(val * 100).toFixed(2)}` });
  }
  // chart.scale('value', { alias: '数值', formatter: val => `${val} ${unit}` });
  // chart.scale('type', { alias: '类型' });
  chart
    .line()
    .position(`day*${y1}`)
    .color('#4FAAEB');
  chart
    .line()
    .position(`day*${y2}`)
    .color('#9AD681');
  // .shape('dash');
  chart
    .point()
    .position(`day*${y1}`)
    .size(4)
    .shape('circle')
    .style({
      stroke: '#fff',
      lineWidth: 1,
    })
    .color('#4FAAEB');
  // if (rateList.includes(y1)) {
  //   chart.tooltip(`day*${y1}`, (name, value) => ({
  //     name,
  //     value: `${(value * 100).toFixed(2)}%`,
  //   }));
  //   // chart.scale(y2, { formatter: val => `${(val * 100).toFixed(2)}%` });
  // }
  chart
    .point()
    .position(`day*${y2}`)
    .size(4)
    .shape('circle')
    .style({
      stroke: '#fff',
      lineWidth: 1,
    })
    .color('#9AD681');
  // if (rateList.includes(y2)) {
  //   chart.tooltip(`day*${y2}`, (name, value) => ({
  //     name,
  //     value: `${(value * 100).toFixed(2)}%`,
  //   }));
  //   // chart.scale(y2, { formatter: val => `${(val * 100).toFixed(2)}%` });
  // }
  chart.render();
  return chart;
}
