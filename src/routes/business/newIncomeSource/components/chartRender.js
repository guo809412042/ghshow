import moment from 'moment';
import G2 from '@antv/g2';

moment.locale('zh-cn');
export function removeChartNode(nodeId) {
  const node = document.getElementById(nodeId);
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

// const colors = ['#fba540', '#FF7F50', '#02ba5a', '#d13adf', '#03d0ea', '#ED5565', '#14abef', '#f5365c', '#A0D468'];
export function areaChartRender(data, nodeId) {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height: 350,
    // width: node.offsetWidth,
    padding: 'auto',
    forceFit: true,
  });
  chart.source(data);

  chart
    .line()
    .opacity(0.5)
    .position('day*value')
    .color('type');
  chart
    .area()
    .opacity(0.3)
    .position('day*value')
    .color('type');

  chart.render();
}

export function blockChartRender(data, nodeId) {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height: 350,
    // width: node.offsetWidth,
    padding: 'auto',
    forceFit: true,
  });
  chart.source(data);

  chart
    .intervalStack()
    .position('day*value')
    .color('type')
    .tooltip('type*tip', (type, tip) => ({
      name: type,
      value: tip,
    }));

  const margin = 2 / data.length;
  chart.scale('day', {
    range: [margin / 2, 1 - margin / 2],
  });

  // chart.legend({
  //   position: 'right-center',
  // });
  chart.render();
}
