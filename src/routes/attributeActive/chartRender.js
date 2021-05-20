/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-10 15:34:54
 * @LastEditTime: 2020-04-15 16:57:19
 * @LastEditors: ssssslf
 */
import moment from 'moment';
import { getFixed } from '../../utils/utils';

moment.locale('zh-cn');

export function removeChartNode(nodeId) {
  const node = document.getElementById(nodeId);
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

// const colors = ['#fba540', '#FF7F50', '#02ba5a', '#d13adf', '#03d0ea', '#ED5565', '#14abef', '#f5365c', '#A0D468'];
export function chartRender(chart, data, type) {
  // const node = document.getElementById(nodeId);
  // removeChartNode(nodeId);
  if (!data.length) {
    return;
  }
  // chart.animate(true);
  chart.clear();
  // chart.destroy();
  // const chart = new G2.Chart({
  //   container: node,
  //   height: 250,
  //   // width: node.offsetWidth,
  //   padding: 'auto',
  //   forceFit: true,
  // });
  // chart.source(data);
  chart.changeData(data);

  const line = chart
    .line()
    .opacity(0.5)
    .position('day*value')
    .color('type');
  // chart
  //   .point()
  //   .position('day*value')
  //   .size(4)
  //   .shape('circle')
  //   .color('type', colors)
  //   .style({
  //     stroke: '#fff',
  //     lineWidth: 1,
  //   });
  const area = chart
    .area()
    .opacity(0.3)
    .position('day*value')
    .color('type');

  if (type === 'stack') {
    line.adjust('stack');
    area.adjust('stack');
  }

  line.tooltip('day*value*type', (title, value, type) => {
    const currentData = line.get('data');
    const week = moment(title).format('dddd');
    const total = currentData.reduce((sum, v2) => (v2.day === title ? sum + v2.value : sum), 0);
    return {
      title: `<strong>
              <div style="border-bottom: 1px solid #e8e8e8;padding-left: 18px;max-width: 180px;">
                ${week},${title}
                <div style="display: flex;justify-content: space-between;margin: 5px 0;">
                <span>合计</span>
                <span>${getFixed(total)}</span>
                </div>
              </div>
              </strong>`,
      name: type,
      value,
    };
  });

  chart.render();
}
