import React from 'react';
import { Card, DatePicker } from 'antd';
import moment from 'moment';
import { Chart } from '@antv/g2';

import { removeChartNode } from '../../../../common/chartFunc/removeChartNode';
import { DownLoadButton } from '../../../../common/DownLoadButton';

import { getData } from '../../../../../utils/request';

const timeFormatQuery = 'YYYYMMDD';
const timeFormatShow = 'YYYY-MM-DD';
const containerId = 'export-template-user';
const { RangePicker } = DatePicker;
class ExportTemplateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment().subtract(1, 'months').format(timeFormatQuery),
      endTime: moment().format(timeFormatQuery),
      listData: [],
      originData: [],
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = async () => {
    const { startTime, endTime } = this.state;
    const sql = `
      select 
      cnt_1,
      cnt_2,
      cnt_3,
      cnt_4,
      cnt_5,
      cnt_6,
      cnt_7,
      cnt_7_1,
      dvc_cnt,
      ds
      from rpt_vid_log_tmpl_exp_cnt_1d
      where ds >= ${startTime}
            and ds <= ${endTime}
      order by ds asc
      limit 1000
    `;
    const listData = await getData(sql);
    let newArray = [];
    const originData = [];
    listData.map((data) => {
      const sum = data.cnt_1 + data.cnt_2 + data.cnt_3 + data.cnt_4 + data.cnt_5 + data.cnt_6 + data.cnt_7 + data.cnt_7_1;
      originData.push({
        ...data,
        cnt_1_p: (data.cnt_1 / sum * 100).toFixed(2),
        cnt_2_p: (data.cnt_2 / sum * 100).toFixed(2),
        cnt_3_p: (data.cnt_3 / sum * 100).toFixed(2),
        cnt_4_p: (data.cnt_4 / sum * 100).toFixed(2),
        cnt_5_p: (data.cnt_5 / sum * 100).toFixed(2),
        cnt_6_p: (data.cnt_6 / sum * 100).toFixed(2),
        cnt_7_p: (data.cnt_7 / sum * 100).toFixed(2),
        cnt_7_1_p: (data.cnt_7_1 / sum * 100).toFixed(2),
      });
      newArray = newArray.concat([{
        time: data.ds,
        type: '1个',
        value: data.cnt_1,
        tip: `${data.cnt_1} (${(data.cnt_1 / sum * 100).toFixed(2)}%)`,
      }, {
        time: data.ds,
        type: '2个',
        value: data.cnt_2,
        tip: `${data.cnt_2} (${(data.cnt_2 / sum * 100).toFixed(2)}%)`,
      }, {
        time: data.ds,
        type: '3个',
        value: data.cnt_3,
        tip: `${data.cnt_3} (${(data.cnt_3 / sum * 100).toFixed(2)}%)`,
      }, {
        time: data.ds,
        type: '4个',
        value: data.cnt_4,
        tip: `${data.cnt_4} (${(data.cnt_4 / sum * 100).toFixed(2)}%)`,
      }, {
        time: data.ds,
        type: '5个',
        value: data.cnt_5,
        tip: `${data.cnt_5} (${(data.cnt_5 / sum * 100).toFixed(2)}%)`,
      }, {
        time: data.ds,
        type: '6个',
        value: data.cnt_6,
        tip: `${data.cnt_6} (${(data.cnt_6 / sum * 100).toFixed(2)}%)`,
      }, {
        time: data.ds,
        type: '7个',
        value: data.cnt_7,
        tip: `${data.cnt_7} (${(data.cnt_7 / sum * 100).toFixed(2)}%)`,
      }, {
        time: data.ds,
        type: '7个以上',
        value: data.cnt_7_1,
        tip: `${data.cnt_7_1} (${(data.cnt_7_1 / sum * 100).toFixed(2)}%)`,
      }]);
    });
    this.setState({ listData: newArray, originData }, this.paint);
  }

  paint = () => {
    const { listData } = this.state;
    removeChartNode(containerId);
    const chart = new Chart({
      container: containerId,
      forceFit: true,
      height: 600,
      padding: 'auto',
    });
    chart.source(listData);
    chart.axis('time');
    chart.axis('value');
    chart.legend({
      position: 'right-center',
    });
    chart
      .intervalStack()
      .position('time*value')
      .color('type', ['#aaa', '#1890ff', '#0050b3', '#CC99CC', '#CC66CC', '#996633', '#FF6633', '#ff0000'])
      .opacity(1)
      .tooltip('type*tip', (type, tip) => ({
        name: type,
        value: tip,
      }));
    chart.render();
  }

  dateChange = (_, dateStrings) => {
    this.setState({
      startTime: dateStrings[0].replace(/-/g, ''),
      endTime: dateStrings[1].replace(/-/g, ''),
    }, this.getList);
  }

  render() {
    const { originData } = this.state;
    const columns = [{
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
    }, {
      title: '1个',
      dataIndex: 'cnt_1',
      key: 'cnt_1',
    }, {
      title: '1个占比',
      dataIndex: 'cnt_1_p',
      key: 'cnt_1_p',
    }, {
      title: '2个',
      dataIndex: 'cnt_2',
      key: 'cnt_2',
    }, {
      title: '2个占比',
      dataIndex: 'cnt_2_p',
      key: 'cnt_2_p',
    }, {
      title: '3个',
      dataIndex: 'cnt_3',
      key: 'cnt_3',
    }, {
      title: '3个占比',
      dataIndex: 'cnt_3_p',
      key: 'cnt_3_p',
    }, {
      title: '4个',
      dataIndex: 'cnt_4',
      key: 'cnt_4',
    }, {
      title: '4个占比',
      dataIndex: 'cnt_4_p',
      key: 'cnt_4_p',
    }, {
      title: '5个',
      dataIndex: 'cnt_5',
      key: 'cnt_5',
    }, {
      title: '5个占比',
      dataIndex: 'cnt_5_p',
      key: 'cnt_5_p',
    }, {
      title: '6个',
      dataIndex: 'cnt_6',
      key: 'cnt_6',
    }, {
      title: '6个占比',
      dataIndex: 'cnt_6_p',
      key: 'cnt_6_p',
    }, {
      title: '7个',
      dataIndex: 'cnt_7',
      key: 'cnt_7',
    }, {
      title: '7个占比',
      dataIndex: 'cnt_7_p',
      key: 'cnt_7_p',
    }, {
      title: '7个以上',
      dataIndex: 'cnt_7_1',
      key: 'cnt_7_1',
    }, {
      title: '7个以上占比',
      dataIndex: 'cnt_7_1_p',
      key: 'cnt_7_1_p',
    }];
    return (
      <>
        <Card title="模板导出用户分层">
          <RangePicker
            defaultValue={[moment(moment().subtract(1, 'months'), timeFormatShow), moment(moment(), timeFormatShow)]}
            format={timeFormatShow}
            onChange={this.dateChange}
            style={{ marginRight: '20px' }}
          />
          <DownLoadButton filename="模板导出用户分层数据" columns={columns} data={originData} />
          <div id={containerId} style={{ marginTop: '20px' }} />
        </Card>
      </>
    );
  }
}

export default ExportTemplateUser;
