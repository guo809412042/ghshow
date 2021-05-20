/* eslint-disable no-return-assign */
/*
 * @Author: tab
 * @Date: 2020-07-08 16:44:42
 * @Last Modified by: tab
 * @Last Modified time: 2020-07-08 17:37:30
 */

import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import {
  Row, DatePicker, Table, Spin, Tag, Select, Form, Collapse, Button,
} from 'antd';


import styles from './index.less';
import {
  coreSql, NumSql, remainSql, campaignListSql, advCampaignSQL, advPlatformSQL,
} from './sqlTemplate';
import {
  CAMPAIGN, KEYS, MEDIA_SOURCE, tagColors,
} from './constant';
import { getData } from '../../../../utils/request';
import { getBeforeWeek } from '../../../../utils/getBeforeWeekDate';

import CardView from './CardView';
import NewUserChart from './NewUserChart';
import TableChartModal from './TableChartModal';
import exportParams from '../../../../utils/exportExecl';
import MoreExportView from './MoreExportView';
// import Page from '../../../components/Page/Page';

const { RangePicker } = DatePicker;
export default class Index extends React.Component {
  dateFormat = 'YYYYMMDD'

  state = {
    dateSpan: [
      moment()
        .subtract(8, 'days'),
      moment()
        .subtract(1, 'days'),
    ],
    dataSource1: [],
    dataSource2: [],
    numCount: [],
    numCountBefore: [],
    numLoading: false,
    coreKey: MEDIA_SOURCE,
    coreTags: [],
    remainKey: MEDIA_SOURCE,
    remainTags: [],
    coreOrganic: {},
    remainOrganic: {},
    coreTotal: 0,
    newUserChartVisible: false,
    moreExportVisible: false,
    newUserRow: {},
    tableChartVisible: false,
    tableData: {},
    campaignList: [],
    coreLoading: false,
    remainLoading: false,
    selectCampaignName: undefined,
  }

  async componentDidMount() {
    await this.fetchData();
    await this.getCampaignList();
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

  fetchData = async () => {
    await this.fetch();
    await this.fetchCore();
    await this.fetchRemain();
    await this.getCampaignList();
  }

  fetch = async () => {
    this.setState({ numLoading: true });
    const { dateSpan } = this.state;
    const sql = NumSql.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat));
    const dayNums = (new Date(dateSpan[1]) - new Date(dateSpan[0])) / (1000 * 60 * 60 * 24) + 1;
    const beforeWeekSql = NumSql.replace(/#startDate#/g, getBeforeWeek(dateSpan[0], dayNums <= 7 ? 7 : dayNums))
      .replace(/#endDate#/g, getBeforeWeek(dateSpan[1], dayNums <= 7 ? 7 : dayNums));
    const res = await getData(sql);
    const resBefore = await getData(beforeWeekSql);
    this.setState({
      numCount: res,
      numCountBefore: resBefore,
    });
    this.setState({ numLoading: false });
  }

  fetchCore = async () => {
    this.setState({ coreLoading: true });
    const {
      coreKey, dateSpan, coreTags, selectCampaignName,
    } = this.state;
    let where = '';
    coreTags.forEach((v) => {
      v.name === 'null' || !v.name ? where += `and ${v.tag.value} is null ` : where += `and ${v.tag.value} = '${v.name}'`;
    });
    if (selectCampaignName) where += `and campaign = '${selectCampaignName}'`;
    where = where.replace(/\$/g, '#');
    const sql = coreSql.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat))
      .replace(/#name#/g, coreKey.value)
      .replace(/#where#/, where)
      .replace(/#/g, '$');
    let advSql = coreKey === MEDIA_SOURCE ? advPlatformSQL : advCampaignSQL;
    advSql = advSql.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat));
    const res = await getData(sql);
    const advRes = await getData(advSql);
    let flag = -1;
    let data = res.map((v) => {
      let arr = {
        ...v,
        'play_uv/reg_num': v.play_uv && v.reg_num ? `${(v.play_uv * 100 / v.reg_num).toFixed(2)}%` : 0,
        'play_pv/play_uv': v.play_pv && v.play_uv ? (v.play_pv / v.play_uv).toFixed(2) : 0,
        'use_period/1000': v.use_period ? (v.use_period / 1000 / v.reg_num).toFixed(2) : 0,
        [coreKey.value]: v[coreKey.value] ? v[coreKey.value] : 'null',
      };
      if (v[coreKey.value] === 'FBad') {
        const find = advRes.find(i => i.platform === 'FB');
        arr = { ...arr, ...find };
        arr.ctr = find && find.clicks ? (find.clicks * 100 / find.impressions).toFixed(2) : '';
        arr.cpa = find && find.spend ? `$${(find.spend / find.install).toFixed(3)}` : '';
      }
      if (v[coreKey.value] === 'UAC source') {
        const find = advRes.find(i => i.platform === 'UAC');
        arr = { ...arr, ...find };
        arr.ctr = find && find.clicks ? (find.clicks * 100 / find.impressions).toFixed(2) : '';
        arr.cpa = find && find.spend ? `$${(find.spend / find.install).toFixed(3)}` : '';
      }
      if (coreKey === CAMPAIGN) {
        const find = advRes.find(i => i.campaign_name === v[coreKey.value]);
        arr = { ...arr, ...find };
        arr.ctr = find && find.clicks ? (find.clicks * 100 / find.impressions).toFixed(2) : '';
        arr.cpa = find && find.spend ? `$${(find.spend / find.install).toFixed(3)}` : '';
      }
      return arr;
    });
    data = data.sort((a, b) => b.reg_num - a.reg_num);
    data.forEach((v, index) => {
      if (v[coreKey.value] === 'Organic') {
        flag = index;
      }
    });
    let dataSource1 = [];
    if (data.length) {
      if (flag === -1) {
        const { coreOrganic } = this.state;
        coreOrganic[coreKey.value] = coreOrganic[(coreKey.pId)]
          ? coreOrganic[(coreKey.pId)] : 'Organic';
        dataSource1 = [coreOrganic].concat(data);
      } else {
        dataSource1 = [].concat([data[flag]], data.slice(0, flag), data.slice(flag + 1));
        this.setState({ coreOrganic: dataSource1[0] });
      }
    }
    let total = 0;
    if (coreKey === MEDIA_SOURCE) {
      dataSource1.forEach(v => total += v.reg_num);
      this.setState({
        coreTotal: total,
      });
    } else {
      for (let i = 1; i < dataSource1.length; i++) {
        total += dataSource1[i].reg_num;
      }
    }
    this.setState({
      dataSource1,
      coreLoading: false,
      coreTotal: total,
    });
  }

  fetchRemain = async () => {
    const {
      remainKey, remainTags, dateSpan, selectCampaignName,
    } = this.state;
    let where = '';
    remainTags.forEach((v) => {
      v.name === 'null' || !v.name ? where += `and ${v.tag.value} is null` : where += `and ${v.tag.value} = '${v.name}'`;
    });
    if (selectCampaignName) where += `and campaign = '${selectCampaignName}'`;
    where = where.replace(/\$/g, '#');
    const sql = remainSql.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat))
      .replace(/#name#/g, remainKey.value)
      .replace(/#where#/, where)
      .replace(/#/g, '$');
    const res = await getData(sql);
    const source = {};
    res.forEach((v) => {
      if (v[remainKey.value]) { // 有值
        if (!source[v[remainKey.value]]) {
          source[v[remainKey.value]] = {};
        }
        source[v[remainKey.value]].reg_num = v.reg_num;
        source[v[remainKey.value]][`stay_seq ${v.stay_seq}`] = v.stay_num && v.reg_num ? `${(v.stay_num * 100 / v.reg_num).toFixed(2)}%` : 0;
      } else { // 无值
        if (!source.null) {
          source.null = { reg_num: v.reg_num };
        }
        source.null[`stay_seq ${v.stay_seq}`] = v.stay_num && v.reg_num ? `${(v.stay_num * 100 / v.reg_num).toFixed(2)}%` : 0;
      }
    });
    let data = [];
    let flag = -1;
    for (const v of Object.keys(source)) {
      data.push({
        [remainKey.value]: v,
        ...source[v],
      });
    }
    data = data.sort((a, b) => b.reg_num - a.reg_num);
    data.forEach((v, index) => {
      if (v[remainKey.value] === 'Organic') {
        flag = index;
      }
    });
    let dataSource2 = [];
    if (data.length) {
      if (flag === -1) {
        const { remainOrganic } = this.state;
        remainOrganic[remainKey.value] = remainOrganic[(remainKey.pId)] ? remainOrganic[(remainKey.pId)] : 'Organic';
        dataSource2 = [remainOrganic].concat(data);
      } else {
        dataSource2 = [].concat([data[flag]], data.slice(0, flag), data.slice(flag + 1));
        this.setState({ remainOrganic: dataSource2[0] });
      }
    }
    this.setState({
      dataSource2,
      remainLoading: false,
    });
  }

  handleClick = (type, text, row) => () => {
    const {
      coreTags, remainTags, coreKey, remainKey,
    } = this.state;
    // if (type === 'core') {
    coreTags.push({
      tag: KEYS[coreKey.value.toUpperCase()],
      name: text,
    });
    this.setState({
      coreTags,
      coreKey: KEYS[coreKey.cId],
    }, this.fetchCore);
    // } else {
    remainTags.push({
      tag: KEYS[remainKey.value.toUpperCase()],
      name: text,
    });
    this.setState(
      {
        remainTags,
        remainKey: KEYS[remainKey.cId],
        coreTotal: row.reg_num,
      },
      this.fetchRemain,
    );
    // }
  }

  closeClick = (type, v, index) => () => {
    let { coreTags, remainTags } = this.state;
    // if (type === 'core') {
    coreTags = coreTags.slice(0, index);
    this.setState({
      coreTags,
      coreKey: coreTags.length
        ? KEYS[v.tag.value.toUpperCase()] : MEDIA_SOURCE,
    }, this.fetchCore);
    // } else {
    remainTags = remainTags.slice(0, index);
    this.setState({
      remainTags,
      remainKey: remainTags.length
        ? KEYS[v.tag.value.toUpperCase()] : MEDIA_SOURCE,
    }, this.fetchRemain);
    // }
  }

  onCloseNewUserChart = () => {
    this.setState({
      newUserChartVisible: false,
    });
  }

  onClosetableChart = () => {
    this.setState({
      tableChartVisible: false,
    });
  }

  onCloseMoreExportVisible = () => {
    console.log(34);
    this.setState({
      moreExportVisible: false,
    });
  }

  campaignChange = (value) => {
    let { coreKey, remainKey } = this.state;
    if (value) {
      coreKey = CAMPAIGN;
      remainKey = CAMPAIGN;
    } else {
      coreKey = MEDIA_SOURCE;
      remainKey = MEDIA_SOURCE;
    }
    this.setState({
      selectCampaignName: value,
      coreKey,
      remainKey,
    }, () => {
      this.fetchCore();
      this.fetchRemain();
    });
  }

  moreExport=() => {
    this.setState({
      moreExportVisible: true,
    });
  }

  render() {
    const {
      numLoading, coreKey, remainKey, coreTags, remainTags, numCount, numCountBefore,
      coreTotal, dataSource1, dataSource2, campaignList, remainLoading, coreLoading,
      moreExportVisible,
    } = this.state;
    const columns1 = [
      {
        title: coreKey.value,
        dataIndex: coreKey.value,
        key: coreKey.value,
        width: 400,
        render: (text, row) => (coreKey !== MEDIA_SOURCE && text === 'Organic'
          ? text : coreKey.cId
            ? <a
              style={{
                color: '#1d89cf',
                wordBreak: 'break-word',
              }}
              onClick={this.handleClick('core', text, row)}
            >{text}</a> : text),
      },
      {
        title: 'new user',
        dataIndex: 'reg_num',
        key: 'reg_num',
        width: 300,
        render: (text, row) => (coreKey !== MEDIA_SOURCE && row[coreKey.value] === 'Organic'
          ? text : <span>{text} ({!coreTotal ? 0 : (text * 100 / coreTotal).toFixed(2)}%)</span>),
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.reg_num - b.reg_num,
        onCellClick: (row) => {
          this.setState({
            newUserChartVisible: true,
            newUserRow: row,
          });
        },
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
    if (coreKey === MEDIA_SOURCE || coreKey === CAMPAIGN) {
      const advColumns = [
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
      ];
      columns1.splice(1, 0, ...advColumns);
    }
    const columns2 = [
      {
        title: remainKey.value,
        dataIndex: remainKey.value,
        key: remainKey.value,
        width: 400,
        render: (text, row) => (remainKey !== MEDIA_SOURCE && text === 'Organic' ? text : remainKey.cId
          ? <a
            style={{
              color: '#1d89cf',
              wordBreak: 'break-word',
            }}
            onClick={this.handleClick('remain', text, row)}
          >{text}</a> : text),
      }, {
        title: 'new user',
        dataIndex: 'reg_num',
        key: 'reg_num',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.reg_num - b.reg_num,
        onCellClick: (row) => {
          this.setState({
            tableData: row,
            tableChartVisible: true,
          });
        },
      },
    ];
    for (let i = 1; i < 8; i++) {
      columns2.push({
        title: intl.get(`put.${i}d`).defaultMessage(`${i}天后`),
        dataIndex: `stay_seq ${i}`,
        key: `stay_seq ${i}`,
        onCellClick: (row) => {
          this.setState({
            tableData: row,
            tableChartVisible: true,
          });
        },
      });
    }
    columns2.push({
      title: intl.get('put.14d').defaultMessage('14天后'),
      dataIndex: 'stay_seq 14',
      key: 'stay_seq 14',
      onCellClick: (row) => {
        this.setState({
          tableData: row,
          tableChartVisible: true,
        });
      },
    });
    columns2.push({
      title: intl.get('put.28d').defaultMessage('28天后'),
      dataIndex: 'stay_seq 28',
      key: 'stay_seq 28',
      onCellClick: (row) => {
        this.setState({
          tableData: row,
          tableChartVisible: true,
        });
      },
    });
    const chartColumns = [
      {
        key: 'reg_num',
        title: 'reg_num',
      },
      {
        key: 'organic_num',
        title: 'organic_num',
      },
      {
        key: 'put_num',
        title: 'put_num',
      },
      {
        key: 'ds',
        title: 'ds',
      },
    ];
    return (
      <div>
        <Row>
          <RangePicker
            style={{ float: 'right' }}
            value={this.state.dateSpan}
            onChange={(dateSpan) => {
              this.setState({ dateSpan }, this.fetchData);
            }}
          />
        </Row>
        <Button
          style={{ margin: '0 20px' }}
          type="primary"
          onClick={() => exportParams({
            filename: intl.get('put.ads_reports').defaultMessage('投放报表'),
            columns: chartColumns,
            data: numCount,
          })}
        >{intl.get('put.export').defaultMessage('导出')}</Button>
        <Row gutter={24}>
          <Spin spinning={numLoading}>
            <CardView
              title={intl.get('put.average_new_users').defaultMessage('平均整体新增')}
              bg="#6eb8d4"
              type="reg_num"
              numCount={numCount}
              numCountBefore={numCountBefore}
            />
            <CardView
              title={intl.get('put.average_ads_new_users').defaultMessage('平均投放新增')}
              bg="#13c2c2"
              type="put_num"
              numCount={numCount}
              numCountBefore={numCountBefore}
            />
            <CardView
              title={intl.get('put.average_organic_new_users').defaultMessage('平均自然新增')}
              bg="#1d89cf"
              type="organic_num"
              numCount={numCount}
              numCountBefore={numCountBefore}
            />
          </Spin>
        </Row>
        <Collapse
          defaultActiveKey={['1']}
          style={{
            marginLeft: 20,
            marginTop: 20,
          }}
        >
          <Collapse.Panel header={intl.get('put.campaign_names_filter').defaultMessage('campaign查询')} key="1">
            <Form layout="inline">
              <Form.Item label="campaign">
                <Select
                  style={{ width: 400 }}
                  showSearch
                  allowClear
                  onChange={this.campaignChange}
                >
                  <Select.Option value={-1} key={-1}>{intl.get('common.All').defaultMessage('全部')}</Select.Option>
                  {campaignList.map(v => (<Select.Option
                    key={v.campaign}
                    value={v.campaign}
                  >{v.campaign}</Select.Option>))}
                </Select>
              </Form.Item>
            </Form>
          </Collapse.Panel>
        </Collapse>
        <Button
          style={{ margin: '0 20px' }}
          type="primary"
          onClick={this.moreExport}
        >{intl.get('put.batch_export').defaultMessage('批量导出')}</Button>
        <Row>
          <Button
            style={{ margin: 20 }}
            type="primary"
            onClick={() => exportParams({
              filename: intl.get('put.core_indicator').defaultMessage('核心指标'),
              columns: columns1,
              data: dataSource1,
            })}
          >{intl.get('put.export').defaultMessage('导出')}</Button>
        </Row>
        <p className={styles.title}>{intl.get('put.core_indicator').defaultMessage('核心指标')}</p>
        <Row style={{
          marginLeft: 20,
          marginTop: 20,
        }}
        >
          {coreTags.map((v, index) => (<span>
            <Tag
              color={tagColors[index]}
              key={v.tag.value}
              closable
              onClose={this.closeClick('core', v, index)}
            >{v.tag.value}:{v.name}</Tag>
            {index === coreTags.length - 1 ? '' : ' / '}
          </span>))}
        </Row>
        <Row style={{
          margin: '20px 0 0 20px',
          background: '#fff',
        }}
        >
          <Table
            columns={columns1}
            dataSource={dataSource1}
            rowKey={coreKey.value}
            loading={coreLoading}
            scroll={{ x: 'max-content' }}
            bordered
          />
        </Row>
        <Row>
          <Button
            style={{ margin: 20 }}
            type="primary"
            onClick={() => exportParams({
              filename: intl.get('put.retention').defaultMessage('留存相关'),
              columns: columns2,
              data: dataSource2,
            })}
          >{intl.get('put.export').defaultMessage('导出')}</Button>
        </Row>
        <p className={styles.title}>{intl.get('put.retention').defaultMessage('留存相关')}</p>
        <Row style={{
          marginLeft: 20,
          marginTop: 20,
        }}
        >
          {remainTags.map((v, index) => (<span>
            <Tag
              color={tagColors[index]}
              key={v.tag.value}
              closable
              onClose={this.closeClick('remain', v, index)}
            >{v.tag.value}:{v.name}</Tag>
            {index === remainTags.length - 1 ? '' : ' / '}
          </span>))}
        </Row>
        <Row style={{
          margin: '20px 0 0 20px',
          background: '#fff',
        }}
        >
          <Table
            columns={columns2}
            dataSource={dataSource2}
            rowKey={row => row[remainKey.value]}
            loading={remainLoading}
            bordered
          />
        </Row>
        <NewUserChart
          visible={this.state.newUserChartVisible}
          chartData={this.state.newUserRow}
          dateSpan={this.state.dateSpan}
          coreKey={coreKey}
          onCloseNewUserChart={this.onCloseNewUserChart}
          coreTags={coreTags}
        />
        <TableChartModal
          visible={this.state.tableChartVisible}
          dateSpan={this.state.dateSpan}
          remainKey={remainKey}
          tableDate={this.state.tableData}
          onClosetableChart={this.onClosetableChart}
          remainTags={remainTags}
        />
        <MoreExportView
          visible={moreExportVisible}
          onCloseMoreExportVisible={this.onCloseMoreExportVisible}
        />
      </div>
    );
  }
}
