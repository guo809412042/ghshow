import G2 from '@antv/g2';

const removeChart = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
export const chartRender = (
  list,
  id,
  lineColor = '#008b8b',
  areaColor = 'l(100) 0:#008b8b 1:#fff',
  area = true,
  min0 = true,
) => {
  const node = document.getElementById(id);
  removeChart(node);
  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 280,
    padding: 'auto',
  });
  if (min0) {
    chart.source(list, {
      value: {
        min: 0,
      },
    });
  } else {
    chart.source(list);
  }

  if (area) {
    chart
      .area()
      .position('day*value')
      // .shape('smooth')˜
      .color(areaColor)
      .opacity(0.75);
  } else {
    chart
      .line()
      .position('day*value')
      .color(lineColor)
      .shape('smooth');
  }

  // chart
  //   .point()
  //   .position('day*value')
  //   .size(4)
  //   .color(lineColor)
  //   .shape('circle')
  //   .style({
  //     stroke: '#fff',
  //     lineWidth: 1,
  //   });
  chart.render();
};
