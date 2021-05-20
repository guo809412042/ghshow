import G2 from '@antv/g2';
import DataSet from '@antv/data-set';

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

  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 500,
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
        return `${row.type}:${row.value}(${row.ratio}%)`;
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
    .position('ratio')
    .color('type')
    .label('ratio', {
      formatter: function formatter(val, type) {
        return `${type.point.type}: ${val}%`;
      },
    })
    .tooltip('type*ratio*value', (type, ratio, value) => ({
      name: type,
      value: `${value}(${ratio}%)`,
    }))
    .style({
      lineWidth: 1,
      stroke: '#fff',
    });
  chart.render();
};
