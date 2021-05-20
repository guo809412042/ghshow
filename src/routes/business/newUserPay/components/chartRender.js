/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-17 16:17:09
 * @LastEditTime: 2020-03-17 16:19:49
 * @LastEditors: ssssslf
 */
import G2 from '@antv/g2';
import { removeChartNode } from '../../../common/chartFunc/removeChartNode';

/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/3/20
 * Time: 下午2:58
 *
 */

export const chartRender = (chartData, nodeId) => {
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 400,
  });
  chart.source(chartData, {
    day: {
      alias: '时长',
    },
    value: {
      alias: '百分比(%)',
      formatter: value => `${(isNaN(value) ? 0 : value).toFixed(2)}%`,
    },
  });
  chart.tooltip(true, {
    crosshairs: {
      type: 'line',
    },
  });
  chart.line()
    .position('day*value')
    .shape('smooth')
    .color('type');
  chart.point()
    .position('day*value')
    .size(4)
    .shape('circle')
    .color('type')
    .style({
      stroke: '#fff',
      lineWidth: 1,
    });
  chart.axis('type', { alias: '类型' });
  chart.render();
  return chart;
};
