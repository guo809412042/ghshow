import G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import { removeChartNode } from '../../../common/chartFunc/removeChartNode';

const removeChart = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
export const pieChartRender = (list, id) => {
  const node = document.getElementById(id);
  removeChart(node);
  if (!list.length) {
    return;
  }
  const ds = new DataSet();
  const dv = ds.createView().source(list);
  dv.transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    as: 'percent',
  });

  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 450,
    padding: 'auto',
    background: {
      opacity: 1, // 图表整体透明度
      lineWidth: 3, // 图表边框粗度
    },
    plotBackground: {
      opacity: 1, // 图表整体透明度
      lineWidth: 3, // 图表边框粗度
    },
  });

  const view = chart.view({
    start: {
      x: 0,
      y: 0,
    }, // 视图绘图区域的起始点，x、y 数值在 0 - 1 范围内
    end: {
      x: 1,
      y: 0.7,
    }, // 视图绘图区域的结束点，x、y 数值在 0 - 1 范围内
  });
  view.source(dv);
  view.coord('theta', {
    radius: 0.9,
  });

  chart.legend('type', {
    // custom: true,
    position: 'bottom-center',
    layout: 'horizontal',
    offsetY: -80,
    offsetX: 50,
    itemGap: 20,
    itemMarginBottom: 8,
    itemWidth: 260,
    itemFormatter(value) {
      const row = dv.rows.find(v => v.type === value);
      if (row) {
        return `${row.type}:${~~row.value}(${(100 * row.percent).toFixed(2)}%)`;
      }
      return value;
    },
    textStyle: {
      fontSize: 14,
      fill: 'rgba(0, 0, 0, 0.65)', // 文本的颜色
      fontWeight: '400', // 文本粗细
    },
    marker: 'square',
  });

  chart.tooltip(true, {
    showTitle: false,
    inPlot: false,
  });

  view.intervalStack()
    .position('percent')
    .color('type')
    // .label('percent', {
    //   formatter: function formatter(val, type) {
    //     return `${type.point.type}: ${(val * 100).toFixed(2)}%`;
    //   },
    // })
    .tooltip('type*percent*value', (type, percent, value) => {
      percent = `${(percent * 100).toFixed(2)}%`;
      return {
        name: type,
        value: `${value}(${percent})`,
      };
    })
    .style({
      lineWidth: 1,
      stroke: '#fff',
    });
  chart.render();
};

export function chartLineRender(data, node, height = 300, unit = '', colors = []) {
  // 移除所有子节点
  removeChartNode(node);

  // 判断 data 是否为空
  if (data.length === 0) {
    return;
  }
  // 图表样式配置
  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height,
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
  chart.scale('value', { alias: '数值', formatter: val => `${val} ${unit}` });
  chart.scale('type', { alias: '类型' });
  let line;
  if (colors.length) {
    line = chart
      .line()
      .position('day*value')
      .size(2)
      .color('type', colors);
    chart
      .point()
      .position('day*value')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      })
      .color('type', colors);
  } else {
    line = chart
      .line()
      .position('day*value')
      .size(2)
      .color('type');
    chart
      .point()
      .position('day*value')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      })
      .color('type');
  }

  chart.render();
  return line;
}
