/* eslint-disable react/require-default-props */
/* eslint-disable quotes */
/*
 * @Author: tab
 * @Date: 2020-07-08 16:41:09
 * @Last Modified by: tab
 * @Last Modified time: 2020-07-08 17:40:32
 */

import React from 'react';
import intl from 'react-intl-universal';
import {
  Modal, Select, Table, DatePicker, Button, Row,
} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './index.less';
import {
  advCampaignSQL, campaignListSql, coreSql, remainSql,
} from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { CAMPAIGN } from './constant';
import exportParams from '../../../../utils/exportExecl';

const { RangePicker } = DatePicker;

class MoreExportView extends React.Component {
  state = {
    dataSource1: [],
    dataSource2: [],
    campaignList: [],
    coreLoading: false,
    coreTotal: 0,
    remainLoading: false,
    dateSpan: [
      moment()
        .subtract(8, 'days'),
      moment()
        .subtract(1, 'days'),
    ],
    campaignValues: [],
  }

  dateFormat = 'YYYYMMDD'

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    await this.fetchCore();
    await this.fetchRemain();
    await this.getCampaignList();
  }

  fetchCore = async () => {
    let { campaignValues } = this.state;
    const { dateSpan } = this.state;
    campaignValues = campaignValues.map(v => `'${v}'`);
    const where = campaignValues.length ? `and campaign in (${campaignValues.join(',')})` : '';
    const sql = coreSql.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat))
      .replace(/#name#/g, CAMPAIGN.value)
      .replace(/#where#/, where)
      .replace(/#/g, '$');
    const res = await getData(sql);
    let advSql = advCampaignSQL;
    advSql = advSql.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat));
    const advRes = await getData(advSql);
    let data = res.map((v) => {
      let arr = {
        ...v,
        'play_uv/reg_num': v.play_uv && v.reg_num ? `${(v.play_uv * 100 / v.reg_num).toFixed(2)}%` : 0,
        'play_pv/play_uv': v.play_pv && v.play_uv ? (v.play_pv / v.play_uv).toFixed(2) : 0,
        'use_period/1000': v.use_period ? (v.use_period / 1000 / v.reg_num).toFixed(2) : 0,
        campaign: v.campaign ? v.campaign : 'null',
      };
      if (v.campaign === 'FBad') {
        const find = advRes.find(i => i.platform === 'FB');
        arr = { ...arr, ...find };
        arr.ctr = find && find.clicks ? (find.clicks * 100 / find.impressions).toFixed(2) : '';
        arr.cpa = find && find.spend ? `$${(find.spend / find.install).toFixed(3)}` : '';
      }
      if (v.campaign === 'UAC source') {
        const find = advRes.find(i => i.platform === 'UAC');
        arr = { ...arr, ...find };
        arr.ctr = find && find.clicks ? (find.clicks * 100 / find.impressions).toFixed(2) : '';
        arr.cpa = find && find.spend ? `$${(find.spend / find.install).toFixed(3)}` : '';
      }
      const find = advRes.find(i => i.campaign_name === v.campaign);
      arr = { ...arr, ...find };
      arr.ctr = find && find.clicks ? (find.clicks * 100 / find.impressions).toFixed(2) : '';
      arr.cpa = find && find.spend ? `$${(find.spend / find.install).toFixed(3)}` : '';
      return arr;
    });
    data = data.sort((a, b) => b.reg_num - a.reg_num);
    let total = 0;
    for (let i = 1; i < data.length; i++) {
      total += data[i].reg_num;
    }
    this.setState({
      dataSource1: data,
      coreLoading: false,
      coreTotal: total,
    });
  }

  fetchRemain = async () => {
    let { campaignValues } = this.state;
    const { dateSpan } = this.state;
    campaignValues = campaignValues.map(v => `'${v}'`);
    const where = campaignValues.length ? `and campaign in (${campaignValues.join(',')})` : '';
    const sql = remainSql.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat))
      .replace(/#name#/g, CAMPAIGN.value)
      .replace(/#where#/, where)
      .replace(/#/g, '$');
    const res = await getData(sql);
    const source = {};
    res.forEach((v) => {
      if (v.campaign) { // 有值
        if (!source[v.campaign]) {
          source[v.campaign] = {};
        }
        source[v.campaign].reg_num = v.reg_num;
        source[v.campaign][`stay_seq ${v.stay_seq}`] = v.stay_num && v.reg_num ? `${(v.stay_num * 100 / v.reg_num).toFixed(2)}%` : 0;
      } else { // 无值
        if (!source.null) {
          source.null = { reg_num: v.reg_num };
        }
        source.null[`stay_seq ${v.stay_seq}`] = v.stay_num && v.reg_num ? `${(v.stay_num * 100 / v.reg_num).toFixed(2)}%` : 0;
      }
    });
    let data = [];
    for (const v of Object.keys(source)) {
      data.push({
        campaign: v,
        ...source[v],
      });
    }
    data = data.sort((a, b) => b.reg_num - a.reg_num);
    this.setState({
      dataSource2: data,
      remainLoading: false,
    });
  }

  getCampaignList = async () => {
    const { dateSpan } = this.state;
    const sql = campaignListSql.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat));
    const res = await getData(sql);
    const campaignList = res.filter(v => v.campaign);
    this.setState({ campaignList });
  }

  campaignChange = (values) => {
    this.setState({
      campaignValues: values,
    }, () => {
      this.fetchCore();
      this.fetchRemain();
    });
  }

  render() {
    const {
      dataSource1, dataSource2, campaignList, coreLoading, coreTotal, remainLoading,
    } = this.state;
    const columns1 = [
      {
        title: 'campaign',
        dataIndex: 'campaign',
        key: 'campaign',
        width: 400,
        render: text => <span
          style={{
            color: '#1d89cf',
            wordBreak: 'break-word',
          }}
        >{text}</span>,
      },
      {
        dataIndex: 'spend',
        title: 'cost',
        key: 'spend',
        render: text => (text ? parseFloat(text)
          .toFixed(2) : ''),
      },
      {
        dataIndex: 'impressions',
        title: 'impressions',
        key: 'impressions',
      },
      {
        title: 'click',
        dataIndex: 'clicks',
        key: 'clicks',
      },
      {
        title: 'ctr',
        dataIndex: 'ctr',
        key: 'ctr',
      },
      {
        title: 'install',
        dataIndex: 'install',
        key: 'install',
      },
      {
        title: 'cpa',
        dataIndex: 'cpa',
        key: 'cpa',
      },
      {
        title: 'new user',
        dataIndex: 'reg_num',
        key: 'reg_num',
        width: 300,
        render: text => <span>{text} ({!coreTotal ? 0 : (text * 100 / coreTotal).toFixed(2)}%)</span>,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.reg_num - b.reg_num,
      },
      {
        title: 'video_play_user',
        dataIndex: 'play_uv',
        key: 'play_uv',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.play_uv - b.play_uv,
      },
      {
        title: 'video_play_users_percentage',
        dataIndex: 'play_uv/reg_num',
        key: 'play_uv/reg_num',
        defaultSortOrder: 'descend',
        sorter: (a, b) => parseFloat(a['play_uv/reg_num']) - parseFloat(b['play_uv/reg_num']),
      },
      {
        title: 'numbers_of_videos_played_per_person',
        dataIndex: 'play_pv/play_uv',
        key: 'play_pv/play_uv',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a['play_pv/play_uv'] - b['play_pv/play_uv'],
      },
      {
        title: 'duration',
        dataIndex: 'use_period/1000',
        key: 'use_period/1000',
        defaultSortOrder: 'use_period',
        sorter: (a, b) => a.use_period - b.use_period,
      },
    ];
    const columns2 = [
      {
        title: 'campaign',
        dataIndex: 'campaign',
        key: 'campaign',
        width: 400,
        render: text => <span
          style={{
            color: '#1d89cf',
            wordBreak: 'break-word',
          }}
        >{text}</span>,
      }, {
        title: 'new user',
        dataIndex: 'reg_num',
        key: 'reg_num',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.reg_num - b.reg_num,
      },
    ];
    for (let i = 1; i < 8; i++) {
      columns2.push({
        title: intl.get(`put.${i}d`)
          .defaultMessage(`${i}天后`),
        dataIndex: `stay_seq ${i}`,
        key: `stay_seq ${i}`,
      });
    }
    columns2.push({
      title: intl.get('put.14d')
        .defaultMessage('14天后'),
      dataIndex: 'stay_seq 14',
      key: 'stay_seq 14',
    });
    columns2.push({
      title: intl.get('put.28d')
        .defaultMessage('28天后'),
      dataIndex: 'stay_seq 28',
      key: 'stay_seq 28',
    });
    return (<Modal
      visible={this.props.visible}
      title={intl.get('put.export')
        .defaultMessage('导出')}
      onCancel={this.props.onCloseMoreExportVisible}
      onOk={this.props.onCloseMoreExportVisible}
      width={1200}
    >
      <div>
        <Row>
          <RangePicker
            style={{ float: 'right' }}
            value={this.state.dateSpan}
            onChange={(dateSpan) => {
              this.setState({ dateSpan }, this.fetchData);
            }}
          />
          <Select
            style={{ width: 400 }}
            showSearch
            allowClear
            mode="multiple"
            placeholder="campaign"
            onChange={this.campaignChange}
          >
            {campaignList.map(v => (<Select.Option
              key={v.campaign}
              value={v.campaign}
            >{v.campaign}</Select.Option>))}
          </Select>
        </Row>

        <p className={styles.title}>{intl.get('put.core_indicator')
          .defaultMessage('核心指标')}</p>
        <Button
          style={{ margin: 20 }}
          type="primary"
          onClick={() => exportParams({
            filename: intl.get('put.core_indicator').defaultMessage('核心指标'),
            columns: columns1,
            data: dataSource1,
          })}
        >{intl.get('put.export').defaultMessage('导出')}</Button>
        <Table
          dataSource={dataSource1}
          columns={columns1}
          loading={coreLoading}
          scroll={{ x: 'max-content' }}
        />
        <p className={styles.title}>{intl.get('put.retention')
          .defaultMessage('留存相关')}</p>
        <Button
          style={{ margin: 20 }}
          type="primary"
          onClick={() => exportParams({
            filename: intl.get('put.retention').defaultMessage('留存相关'),
            columns: columns2,
            data: dataSource2,
          })}
        >{intl.get('put.export').defaultMessage('导出')}</Button>
        <Table
          dataSource={dataSource2}
          columns={columns2}
          loading={remainLoading}
          scroll={{ x: 1200 }}
        />
      </div>
    </Modal>);
  }
}

MoreExportView.propTypes = {
  visible: PropTypes.bool,
  onCloseMoreExportVisible: PropTypes.func,
};
export default MoreExportView;
