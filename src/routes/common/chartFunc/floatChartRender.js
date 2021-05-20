/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/3/28
 * Time: 下午2:46
 *
 */
/* eslint-disable no-undef */
import G2 from '@antv/g2';
import { ABSOLUTE } from '../constant';
import { removeChartNode } from './removeChartNode';

export function vivashowplaycountplotData(data, type) {
  const keys = Object.keys(data[0]).filter(v => v !== 'day');
  const list = [];
  data = data.map((i) => {
    let total = 0;
    keys.forEach((j) => {
      total += i[j] ? i[j] : 0;
    });
    return {
      ...i,
      total,
    };
  });
  data.forEach((i) => {
    keys.forEach((j) => {
      const percent = parseFloat(((i[j] * 100) / i.total).toFixed(2));
      list.push({
        day: i.day.toString(),
        value: type === ABSOLUTE.value ? i[j] : percent,
        // value: `${i[j]}-${percent}`,
        type: j,
        percent,
      });
    });
  });
  return list;
}

export function vivashowconsumcountplotData(data) {
  const keys = Object.keys(data[0]).filter(v => v !== 'day');
  data = data.map((i) => {
    let total = 0;
    keys.forEach((j) => {
      total += i[j] ? i[j] : 0;
    });
    return {
      ...i,
      total,
    };
  });
}

export function floatChartRender(data, type, nodeId) {
  removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  let list = [];
  list = vivashowplaycountplotData(data, type);
  const chart = new G2.Chart({
    container: document.getElementById(nodeId),
    forceFit: true,
    height: 300,
  });
  chart.source(list, {
    value: {
      // alias: "数值"
      // formatter: function formatter(value, a, b) {
      //   const num = value.split("-");
      //   return type === ABSOLUTE.value ? `${num[0]} (${num[1]}%)` : `${num[1]}% (${num[0]})`;
      // }
    },
  });
  // chart.axis("value", {
  //   formatter(value) {
  //     console.log(type === ABSOLUTE.value ? parseFloat(value.split(" (")[0]) : parseFloat(value.split("%")[0]));
  //     return type === ABSOLUTE.value ? parseFloat(value.split(" (")[0]) : parseFloat(value.split("%")[0]);
  //   },
  //   title: null
  // });
  chart.tooltip({
    useHtml: true,
  });
  if (type === ABSOLUTE.value) {
    chart
      .intervalStack()
      .position('day*value')
      .color('type')
      .opacity(1);
  } else {
    chart
      .line()
      .position('day*value')
      .color('type')
      .shape('smooth');
    chart
      .point()
      .position('day*value')
      .size(4)
      .shape('circle')
      .color('type')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      });
  }
  chart.render();
}
