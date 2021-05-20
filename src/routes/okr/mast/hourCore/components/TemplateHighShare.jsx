/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import {
  Card, DatePicker, Table, Select,
} from 'antd';
import moment from 'moment';

import { DownLoadButton } from '../../../../common/DownLoadButton';

import { getData } from '../../../../../utils/request';

const timeFormatQuery = 'YYYYMMDD';
const timeFormatShow = 'YYYY-MM-DD';
class TemplateHighShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().format(timeFormatQuery),
      dataList: [],
      langList: [],
      channelList: [],
      community: 'all',
      channel: 'all',
    };
  }

  componentDidMount() {
    this.getList();
    this.getLangList();
    this.getChannelList();
  }

  getLangList = async () => {
    const sql = 'SELECT DISTINCT(community) from rpt_vid_log_tmpl_shr_1d;';
    const res = await getData(sql);
    this.setState({ langList: res });
  }

  getChannelList = async () => {
    const sql = 'SELECT DISTINCT(share) from rpt_vid_log_tmpl_shr_1d;';
    const res = await getData(sql);
    this.setState({ channelList: res });
  }

  getList = async () => {
    const {
      date, community, channel,
    } = this.state;
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
        ds = ${date}
        and community = '${community}'
        and share = '${channel}'
      ORDER BY share_cnt DESC 
    `;
    const dataList = await getData(sql);
    this.setState({ dataList });
  }

  dateChange = (_, dateStrings) => {
    this.setState({
      date: dateStrings.replace(/-/g, ''),
    }, this.getList);
  }

  langChange = (community) => {
    this.setState({ community }, this.getList);
  }

  channelChange = (channel) => {
    this.setState({ channel }, this.getList);
  }

  render() {
    const {
      dataList,
      langList,
      channelList,
      community,
      channel,
    } = this.state;
    const columns = [
      {
        title: '日期',
        dataIndex: 'ds',
        key: 'ds',
      }, {
        title: '社区',
        dataIndex: 'community',
        key: 'community',
      }, {
        title: '渠道',
        dataIndex: 'share',
        key: 'share',
      }, {
        title: '模板名称',
        dataIndex: 'template_name',
        key: 'template_name',
      }, {
        title: '模板ID',
        dataIndex: 'template_id',
        key: 'template_id',
      }, {
        title: '分享次数',
        dataIndex: 'share_cnt',
        key: 'share_cnt',
      }, {
        title: '分享设备数',
        dataIndex: 'share_dvc_cnt',
        key: 'share_dvc_cnt',
      },
    ];
    return (
      <>
        <Card title="高分享模板报表" style={{ marginBottom: '10px' }}>
          <label>社区：</label>
          <Select
            style={{ width: 200, marginRight: '15px' }}
            defaultValue="all"
            value={community}
            onChange={this.langChange}
            placeholder="社区"
          >
            {langList.map(v => <Select.Option key={v.community} value={v.community}>{v.community}</Select.Option>)}
          </Select>
          <label>渠道：</label>
          <Select
            style={{ width: 200, marginRight: '15px' }}
            defaultValue="all"
            value={channel}
            onChange={this.channelChange}
            placeholder="渠道"
          >
            {channelList.map(v => <Select.Option key={v.share} value={v.share}>{v.share}</Select.Option>)}
          </Select>
          <DatePicker
            defaultValue={moment()}
            format={timeFormatShow}
            onChange={this.dateChange}
            style={{ marginRight: '20px' }}
          />
          <DownLoadButton
            filename="高分享模板报表"
            columns={columns}
            data={dataList}
          />
          <Table
            style={{ marginTop: '15px' }}
            dataSource={dataList}
            columns={columns}
            bordered
            pagination={{
              pageSize: 20,
              showTotal: total => `共${total}条数据`,
              total: dataList.length,
            }}
          />
        </Card>
      </>
    );
  }
}

export default TemplateHighShare;
