import G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import { removeChartNode } from './removeChartNode';

export function cardChartBarRender2(data, nodeId, colors) {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  // 计算每个柱子的占比
  const ds = new DataSet();
  const dv = ds
    .createView()
    .source(data)
    .transform({
      type: 'percent',
      field: 'value', // 统计销量
      dimension: 'type', // 每年的占比
      groupBy: ['day'], // 以不同产品类别为分组
      as: 'percent',
    });

  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 280,
    padding: 'auto',
  });
  chart.source(dv, {
    percent: {
      min: 0,
      formatter: function formatter(val) {
        return `${(val * 100).toFixed(2)}%`;
      },
    },
  });

  chart
    .intervalStack()
    .position('day*percent')
    .color('type', colors)
    .opacity(0.65)
    .label('percent', () => ({
      position: 'middle',
      offset: 0,
      textStyle: {
        fill: '#fff',
        fontSize: 10,
        // shadowBlur: 10,
        // shadowColor: 'rgba(0, 0, 0, .25)',
      },
    }));
  chart.render();
}
