/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-24 15:13:06
 * @LastEditTime: 2020-03-25 13:54:49
 * @LastEditors: ssssslf
 */
/* eslint-disable no-undef */
/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/3/19
 * Time: 上午11:38
 *
 */

import G2 from '@antv/g2';
import _ from 'lodash';
import { removeChartNode } from '../../../../common/chartFunc/removeChartNode';

export function findMaxMin(data) {
  let newData = _.clone(data);
  newData = newData.sort((a, b) => a.value - b.value);
  return {
    min: newData[0],
    max: newData[newData.length - 1],
  };
}

export function cardChartRender(data, divisor, Denominator, color, unit) {
  const nodeId = `chart-${divisor}-${Denominator}`;
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height: 100,
    // width: node.offsetWidth,
    padding: 'auto',
    forceFit: true,
  });
  const minMax = findMaxMin(data);

  chart.source(data);
  chart.scale({
    value: {
      formatter: val => `${val} ${unit}`,
    },
  });
  chart.guide().dataMarker({
    top: true,
    content: `${minMax.max.value}${unit}`,
    position: [minMax.max.day, minMax.max.value],
    style: {
      text: {
        fontSize: 14,
        stroke: 'white',
        lineWidth: 4,
      },
    },
    lineLength: 0,
  });
  chart.guide().dataMarker({
    top: true,
    content: `${minMax.min.value}${unit}`,
    position: [minMax.min.day, minMax.min.value],
    style: {
      text: {
        fontSize: 14,
        stroke: 'white',
        lineWidth: 4,
      },
    },
    lineLength: 0,
  });
  chart
    .line()
    .position('day*value')
    .color(color)
    .shape('smooth');
  chart
    .point()
    .position('day*value')
    .size(4)
    .shape('circle')
    .color(color)
    .style({
      stroke: '#fff',
      lineWidth: 1,
    });
  chart
    .area()
    .position('day*value')
    .color(color)
    .shape('smooth');

  chart.axis('day', {
    title: null,
    line: null,
    grid: null,
    label: null,
  });
  chart.axis('value', {
    title: null,
    line: null,
    grid: null,
    label: null,
  });
  chart.render();
}
