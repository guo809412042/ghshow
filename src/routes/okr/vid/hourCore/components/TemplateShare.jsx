/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import {
  Card, DatePicker, Radio, Select,
} from 'antd';
import moment from 'moment';
import { Chart } from '@antv/g2';

import { removeChartNode } from '../../../../common/chartFunc/removeChartNode';
import { DownLoadButton } from '../../../../common/DownLoadButton';

import { getData } from '../../../../../utils/request';

const timeFormatQuery = 'YYYYMMDD';
const timeFormatShow = 'YYYY-MM-DD';
const containerId = 'export-template-user';
const { RangePicker } = DatePicker;
class TemplateShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment().subtract(1, 'months').format(timeFormatQuery),
      endTime: moment().format(timeFormatQuery),
      dvcList: [],
      numList: [],
      type: 'num',
      langList: [],
      community: 'all',
    };
  }

  componentDidMount() {
    this.getList();
    this.getLangList();
  }

  getLangList = async () => {
    const sql = 'SELECT DISTINCT(community) from rpt_vid_log_tmpl_shr_1d;';
    const res = await getData(sql);
    this.setState({ langList: res });
  }

  getList = async () => {
    const { startTime, endTime, community } = this.state;
    const sql = `
      SELECT 
        ds
        ,community
        ,share
        ,template_name
        ,template_id
        ,share_cnt
        ,share_dvc_cnt
      FROM
        rpt_vid_log_tmpl_shr_1d
      where
        ds >= ${startTime}
        and ds <= ${endTime}
        and community = '${community}'
      ORDER BY share_cnt DESC 
    `;
    const listData = await getData(sql);
    const { dvcList, numList } = this.handleData(listData);
    this.setState({
      dvcList,
      numList,
    }, this.paint);
  }

  handleData = (dataList) => {
    const obj = {};
    const dvcList = [];
    const numList = [];
    dataList.map((item) => {
      if (obj[`${item.ds}_${item.share}`] && obj[`${item.ds}_${item.share}`].dvc) {
        obj[`${item.ds}_${item.share}`].dvc = Number(obj[`${item.ds}_${item.share}`].dvc) + Number(item.share_dvc_cnt);
      } else if (obj[`${item.ds}_${item.share}`]) {
        obj[`${item.ds}_${item.share}`].dvc = Number(item.share_dvc_cnt);
      } else {
        obj[`${item.ds}_${item.share}`] = {
          dvc: Number(item.share_dvc_cnt),
        };
      }

      if (obj[`${item.ds}_${item.share}`] && obj[`${item.ds}_${item.share}`].num) {
        obj[`${item.ds}_${item.share}`].num = Number(obj[`${item.ds}_${item.share}`].num) + Number(item.share_cnt);
      } else if (obj[`${item.ds}_${item.share}`]) {
        obj[`${item.ds}_${item.share}`].num = Number(item.share_cnt);
      } else {
        obj[`${item.ds}_${item.share}`] = {
          num: Number(item.share_cnt),
        };
      }
    });

    for (const key in obj) {
      const [ds, share] = key.split('_');
      dvcList.push({
        ds,
        share,
        value: obj[key].dvc,
      });
      numList.push({
        ds,
        share,
        value: obj[key].num,
      });
    }
    return { dvcList, numList };
  }

  paint = () => {
    const {
      dvcList,
      numList,
      type,
    } = this.state;
    removeChartNode(containerId);
    const chart = new Chart({
      container: containerId,
      forceFit: true,
      height: 600,
    });
    const listData = type === 'num' ? numList : dvcList;
    chart.source(listData, {
      // ds: {
      //   type: 'linear',
      //   // tickInterval: 1,
      // },
    });
    // chart.axis('ds');
    // chart.axis('share_cnt');
    // chart.legend({
    //   position: 'right-center',
    // });
    chart.areaStack().position('ds*value').color('share');
    chart.lineStack().position('ds*value').color('share');
    chart.render();
  }

  dateChange = (_, dateStrings) => {
    this.setState({
      startTime: dateStrings[0].replace(/-/g, ''),
      endTime: dateStrings[1].replace(/-/g, ''),
    }, this.getList);
  }

  typeChange = (e) => {
    this.setState({ type: e.target.value }, this.paint);
  }

  langChange = (community) => {
    this.setState({ community }, this.getList);
  }

  render() {
    const {
      type,
      dvcList,
      numList,
      langList,
      community,
    } = this.state;
    const columns = [
      {
        title: '日期',
        dataIndex: 'ds',
        key: 'ds',
      }, {
        title: '渠道',
        dataIndex: 'share',
        key: 'share',
      }, {
        title: type === 'num' ? '分享次数' : '分享设备数',
        dataIndex: 'value',
        key: 'value',
      },
    ];
    return (
      <>
        <Card title="模板分享平台分布" style={{ marginBottom: '10px' }}>
          <Radio.Group
            defaultValue="num"
            value={type}
            onChange={this.typeChange}
            buttonStyle="solid"
            style={{ marginRight: '15px' }}
          >
            <Radio.Button value="num">分享次数</Radio.Button>
            <Radio.Button value="dvc">分享设备数</Radio.Button>
          </Radio.Group>
          <Select
            style={{ width: 200, marginRight: '15px' }}
            defaultValue="all"
            value={community}
            onChange={this.langChange}
          >
            {langList.map(v => <Select.Option key={v.community} value={v.community}>{v.community}</Select.Option>)}
          </Select>
          <RangePicker
            defaultValue={[moment(moment().subtract(1, 'months'), timeFormatShow), moment(moment(), timeFormatShow)]}
            format={timeFormatShow}
            onChange={this.dateChange}
            style={{ marginRight: '20px' }}
          />
          <DownLoadButton
            filename="模板分享平台分布"
            columns={columns}
            data={(type === 'num' ? numList : dvcList).sort((a, b) => a.ds - b.ds)}
          />
          <div id={containerId} style={{ marginTop: '20px' }} />
        </Card>
      </>
    );
  }
}

export default TemplateShare;
