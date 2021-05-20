import G2 from '@antv/g2';
import { removeChartNode } from './removeChartNode';

export function cardChartBarRender(list, nodeId, colors, line = false, lineColor = []) {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  G2.Shape.registerShape('interval', 'borderRadius', {
    draw: function draw(cfg, container) {
      const points = cfg.points;
      let path = [];
      path.push(['M', points[0].x, points[0].y]);
      path.push(['L', points[1].x, points[1].y]);
      path.push(['L', points[2].x, points[2].y]);
      path.push(['L', points[3].x, points[3].y]);
      path.push('Z');
      path = this.parsePath(path); // 将 0 - 1 转化为画布坐标
      return container.addShape('rect', {
        attrs: {
          x: path[1][1], // 矩形起始点为左上角
          y: path[1][2],
          width: path[2][1] / 2 - path[1][1] / 2,
          height: path[0][2] - path[1][2],
          fill: cfg.color,
          radius: (path[2][1] - path[1][1]) / 4,
        },
      });
    },
  });
  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 280,
    padding: ['auto', 'auto', 50, 'auto'],
  });
  chart.source(list);
  if (line) {
    chart
      .line()
      .position('day*value')
      .color('type', lineColor)
      .shape('smooth')
      .adjust([
        {
          type: 'dodge',
          marginRatio: 1 / 8,
        },
      ]);
    chart
      .point()
      .position('day*value')
      .size(4)
      .color('type', lineColor)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      })
      .adjust([
        {
          type: 'dodge',
          marginRatio: 1 / 8,
        },
      ]);
  }
  chart
    .interval()
    .position('day*value')
    .color('type', colors)
    .shape('borderRadius')
    .adjust([
      {
        type: 'dodge',
        marginRatio: 1 / 32,
      },
    ])
    .opacity(1);
  chart.render();
}
