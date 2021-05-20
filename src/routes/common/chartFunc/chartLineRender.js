/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2019-12-10 10:55:18
 * @LastEditTime: 2021-03-03 18:41:45
 * @LastEditors: dongqi.zhao
 */
import { Chart } from '@antv/g2';
// import DataSet from '@antv/data-set';

function unique(arr) {
  return Array.from(new Set(arr));
}

function sortDim(data) {
  const items = [];
  for (const item of data) {
    items.push(item.type);
  }
  return unique(items);
}

export function chartLineRender(data, node, height = 300, unit = '', colors = [], hasAll) {
  // 移除所有子节点
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }

  // 判断 data 是否为空
  if (data.length === 0) {
    return;
  }
  const legends = sortDim(data).concat(['ALL']);

  if (hasAll) {
    const dataAll = Object.assign(data[0], { type: 'ALL', value: 0 });
    data.push(dataAll);
  }
  // console.log

  // 图表样式配置
  const chart = new Chart({
    container: node,
    forceFit: true,
    height,
    padding: 'auto',
  });
  // console.log('hasAll', hasAll);
  // console.log('datadatadata', data);
  if (hasAll) {
    chart.legend({
      position: 'top',
      itemWrap: true,
      // useHtml: true,
      // hoverable: false,
      onClick: (ev) => {
        const item = ev.item;
        const value = item.value;
        const checked = ev.checked;
        // console.log('chart', );
        if (value === 'ALL') {
          if (checked) {
            chart.filter('type', val => legends.includes(val));
            chart.repaint();
          } else {
            chart.filter('type', val => val === 'DAU');
            chart.repaint();
          }
        } else {
          let hasType = sortDim(chart._attrs.filteredData);
          if (checked) {
            hasType = hasType.concat([value]);
            chart.filter('type', val => hasType.includes(val));
            chart.repaint();
          } else {
            hasType = hasType.filter(item => item !== value);
            chart.filter('type', val => hasType.includes(val));
            chart.repaint();
          }
        }
      },
    });
  } else {
    chart.legend({
      position: 'top',
      itemWrap: true,
      // useHtml: true,
      // hoverable: false,
    });
  }


  // 图表数据配置
  chart.source(data);
  chart.scale('day', {
    alias: '日期',
  });
  chart.scale('value', { alias: '数值', formatter: val => `${val} ${unit}` });
  chart.scale('type', { alias: '类型' });
  let line;
  if (colors.length) {
    line = chart
      .line()
      .position('day*value')
      .size(2)
      .color('type', colors);
    chart
      .point()
      .position('day*value')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      })
      .color('type', colors);
  } else {
    line = chart
      .line()
      .position('day*value')
      .size(2)
      .color('type');
    chart
      .point()
      .position('day*value')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      })
      .color('type');
  }

  chart.render();
  return line;
}
