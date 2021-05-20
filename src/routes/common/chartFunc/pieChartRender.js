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
  dv.transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    as: 'percent',
  });

  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 250,
    padding: 14,
  });
  chart.source(dv);
  chart.coord('theta', {
    radius: 0.8,
  });
  chart
    .intervalStack()
    .position('percent')
    .color('type')
    .label('percent', {
      formatter: function formatter(val, type) {
        return `${type.point.type}: ${(val * 100).toFixed(2)}%`;
      },
    })
    .tooltip('type*percent', (type, percent) => {
      percent = `${(percent * 100).toFixed(2)}%`;
      return {
        name: type,
        value: percent,
      };
    })
    .style({
      lineWidth: 1,
      stroke: '#fff',
    });
  chart.render();
};
