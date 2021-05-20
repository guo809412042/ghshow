import { Chart } from '@antv/g2';

/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/4/23
 * day: 上午10:43
 *
 */
export function chartBarRender(data, node) {
  // 移除所有子节点
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
  // 判断 data 是否为空
  if (data.length === 0) {
    return;
  }
  const chart = new Chart({
    container: node,
    forceFit: true,
    height: 300,
    padding: 'auto',
  });
  chart.source(data);
  chart.axis('percent', {
    label: {
      formatter: function formatter(text) {
        return `${text}%`;
      },
    },
    title: {
      offset: 80,
    },
  });
  chart.legend({
    position: 'top',
    itemWrap: true,
  });
  chart.intervalStack()
    .position('day*percent')
    .color('type', ['#0050b3', '#9AC0CD', '#F4A460', '#EE0000'])
    .opacity(1);
  chart.render();
}

export function chartLineRender(data, node) {
  // 移除所有子节点
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
  // 判断 data 是否为空
  if (data.length === 0) {
    return;
  }
  // 图表样式配置
  const chart = new Chart({
    container: node,
    forceFit: true,
    height: 300,
    padding: 'auto',
  });
  chart.legend({
    position: 'top',
    itemWrap: true,
  });
  // 图表数据配置
  chart.source(data);
  chart.scale('day', {
    alias: '日期',
  });
  chart.scale('value', { alias: '数值' });
  chart.scale('type', { alias: '类型' });
  chart.line()
    .position('day*value')
    .color('type', ['#0050b3', '#9AC0CD', '#F4A460', '#EE0000'])
    .size(2);
  chart.point()
    .position('day*value')
    .color('type', ['#0050b3', '#9AC0CD', '#F4A460', '#EE0000'])
    .size(4)
    .shape('circle')
    .style({
      stroke: '#fff',
      lineWidth: 1,
    });
  chart.render();
}

export function chartBarRender2(data, node) {
  // 移除所有子节点
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
  // 判断 data 是否为空
  if (data.length === 0) {
    return;
  }
  // 图表样式配置
  const chart = new Chart({
    container: node,
    forceFit: true,
    height: 300,
    padding: 'auto',
  });
  chart.legend({
    position: 'top',
    itemWrap: true,
    title: {},
  });
  // 图表数据配置
  chart.source(data);
  chart.scale('day', {
    alias: '日期',
  });
  chart.scale('value', { alias: '数值' });
  chart.scale('type', { alias: '类型' });
  chart.interval()
    .position('day*barValue')
    .color('type', ['#0050b3', '#9AC0CD', '#F4A460', '#EE0000'])
    .adjust([{
      type: 'dodge',
      marginRatio: 1 / 32,
    }]);
  chart.render();
}
