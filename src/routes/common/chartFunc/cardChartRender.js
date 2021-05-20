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
import moment from 'moment';
import { removeChartNode } from './removeChartNode';
import { getNumber } from '../../../utils/utils';

export function findMaxMin(data) {
  let newData = _.clone(data);
  newData = newData.sort((a, b) => a.value - b.value);
  return {
    min: newData[0],
    max: newData[newData.length - 1],
  };
}

export function cardChartRender(data, divisor, Denominator, color, suffix = true, other = undefined) {
  const nodeId = other ? `chart-${divisor}-${Denominator}-${other}` : `chart-${divisor}-${Denominator}`;
  const node = document.getElementById(nodeId);
  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  const chart = new G2.Chart({
    container: node,
    height: other === 'modal' ? 400 : 100,
    // width: node.offsetWidth,
    padding: 'auto',
    forceFit: true,
  });
  const list = [];
  data.forEach((v) => {
    if (Denominator) {
      list.push({
        day: moment((v.ds ? v.ds : v.day).toString()).format('YYYY-MM-DD'),
        value: getNumber(v[divisor], v[Denominator], suffix) || 0,
      });
    }
    if (!Denominator) {
      list.push({
        day: moment((v.ds ? v.ds : v.day).toString()).format('YYYY-MM-DD'),
        value: Number(v[divisor]) || 0,
      });
    }
  });
  const minMax = findMaxMin(list);
  chart.source(list);
  chart.guide().dataMarker({
    top: true,
    content: `${minMax.max.value}`,
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
    content: `${minMax.min.value}`,
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
  if (other !== 'modal') {
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
  }

  chart.render();
}
