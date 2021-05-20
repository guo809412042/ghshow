import G2 from '@antv/g2';

const names = {
  shared_vdo_pv_cnt: '分享视频次数',
  shared_wx_pv_cnt: '分享微信好友次数',
  shared_wxp_pv_cnt: '分享微信朋友圈次数',
  shared_bili_pv_cnt: '分享B站次数',
  shared_dou_pv_cnt: '分享抖音次数',
  shared_other_pv_cnt: '分享其他次数',
  shared_whatsapp_pv_cnt: '分享whatsapp次数',
  shared_instagram_pv_cnt: '分享instagram次数',
  shared_facebook_pv_cnt: '分享facebook次数',
  shared_tiktok_pv_cnt: '分享tiktok次数',
};

function removeChartNode(nodeId) {
  const node = document.getElementById(nodeId);
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export const pieChartView = (nodeId, list) => {
  const node = document.getElementById(`chart-${nodeId}`);
  removeChartNode(`chart-${nodeId}`);
  if (!list.length) {
    return;
  }
  let num = 0;
  Object.keys(list[0]).forEach((item) => {
    if (item !== 'ds') {
      num += list[0][item];
    }
  });
  const data = [];
  Object.keys(list[0]).forEach((item) => {
    if (item !== 'ds') {
      data.push({
        item: names[item],
        count: list[0][item],
        percent: list[0][item] && num ? Number((list[0][item] / num).toFixed(4)) : 0,
      });
    }
  });
  const chart = new G2.Chart({
    container: node,
    forceFit: true,
    height: 400,
  });
  chart.source(data, {
    percent: {
      formatter: function formatter(val) {
        val = `${(val * 100).toFixed(2)}%`;
        return val;
      },
    },
  });
  chart.coord('theta');
  chart.tooltip({
    showTitle: false,
    itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
  });
  chart
    .intervalStack()
    .position('percent')
    .color('item')
    .label('percent', {
      formatter: function formatter(val, item) {
        return `${item.point.item}: ${val}`;
      },
    })
    .tooltip('item*percent', (item, percent) => {
      percent = `${(percent * 100).toFixed(2)}%`;
      return {
        name: item,
        value: percent,
      };
    })
    .style({
      lineWidth: 1,
      stroke: '#fff',
    });
  chart.render();
};
