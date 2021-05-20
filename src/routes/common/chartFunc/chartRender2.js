import G2 from '@antv/g2';

const removeChart = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
//  areaColor = 'l(100) 0:#008b8b 1:#fff'
export const chartRender2 = (list, id, ponitColor, area, areaColor) => {
  const node = document.getElementById(id);
  removeChart(node);
  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 280,
    padding: 'auto',
  });
  chart.source(list);
  chart.axis('day');
  chart
    .line()
    .position('day*value')
    .color('type', ponitColor)
    .shape('smooth');
  if (area) {
    chart
      .area()
      .position('day*value')
      .shape('smooth')
      .color('type', areaColor)
      .opacity(0.25);
  }
  // chart
  //   .point()
  //   .position('day*value')
  //   .size(4)
  //   .color('type', ponitColor)
  //   .shape('circle')
  //   .style({
  //     stroke: '#fff',
  //     lineWidth: 1,
  //   });
  chart.render();
};
