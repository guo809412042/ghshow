import React from 'react';
import {
  Statistic, Card, Row, Col, Icon, Radio, DatePicker, Collapse, Input, Table, Modal, Select,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { DownLoadButton } from '../common/DownLoadButton';
import {
  viewUsrCntSql, useUsrCntSql, saveUsrCntSql, chartSql, tableSql, modalSql,
} from './sqlTemplate';
import { getData } from '../../utils/request';
import { chartRender } from '../common/chartFunc/chartRender';

const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';
const { Panel } = Collapse;

class Index extends React.Component {
  state = {
    radioValue1: 'all',
    radioValue2: '_usr_',
    radioValue3: '_usr_',
    dataSource: [],
    visible: false,
    date1: moment().subtract(0, 'days'),
    date2: moment().subtract(0, 'days'),
    selectValue: 'view#type#cnt',
    exportData2: [],
    pecision1: 0,
    value1: 0,
    pecision2: 0,
    value2: 0,
    pecision3: 0,
    value3: 0,
    clickType: '1',
    ttid: '',
    selectTTid: '',
  };

  async componentDidMount() {
    await this.getStaticData();
    await this.getTableData();
  }

  getStaticData = async () => {
    await this.getStatisticSQLData(viewUsrCntSql, 1);
    await this.getStatisticSQLData(useUsrCntSql, 2);
    await this.getStatisticSQLData(saveUsrCntSql, 3);
    await this.getChartData();
    await this.getTableData();
  };

  getTableData = async () => {
    const {
      date1, radioValue1, radioValue2, selectTTid,
    } = this.state;
    const sql = tableSql
      .replace(/#day#/, moment(date1).format('YYYYMMDD'))
      .replace(/#type#/g, radioValue2)
      .replace(
        /#where#/,
        radioValue1 === 'all' ? '' : radioValue1 === 'Android' ? ' and os = \'Android\'' : ' and os = \'iPhone OS\'',
      )
      .replace(/#ttid#/, selectTTid ? ` and ttid = '${selectTTid}'` : '');
    const res = await getData(sql);
    const dataSource = res.map(v => ({
      ...v,
      click: v.click_cnt && v.view_cnt ? ((v.click_cnt * 100) / v.view_cnt).toFixed(2) : 0,
      share: v.share_cnt && v.save_cnt ? ((v.share_cnt * 100) / v.save_cnt).toFixed(2) : 0,
      use_save: v.share_cnt && v.use_cnt ? ((v.share_cnt * 100) / v.use_cnt).toFixed(2) : 0,
      tik_tok_share: v.tik_tok_share_cnt && v.save_cnt ? ((v.tik_tok_share_cnt * 100) / v.save_cnt).toFixed(2) : 0,
    }));
    this.setState({
      dataSource,
    });
  };

  getChartData = async () => {
    const { clickType, date1, radioValue1 } = this.state;
    let type = '';
    if (clickType === '1') {
      type = 'view_usr_cnt';
    } else if (clickType === '2') {
      type = 'use_usr_cnt';
    } else {
      type = 'save_usr_cnt';
    }
    const yestoday = moment(moment(date1).subtract(1, 'days'));
    const week = moment(moment(date1).subtract(7, 'days'));
    const todaySql = chartSql
      .replace(/#day#/, moment(date1).format('YYYYMMDD'))
      .replace(/#os#/, radioValue1)
      .replace(/#type#/, type);
    const yestodaySql = chartSql
      .replace(/#day#/, moment(yestoday).format('YYYYMMDD'))
      .replace(/#os#/, radioValue1)
      .replace(/#type#/, type);
    const weekSql = chartSql
      .replace(/#day#/, moment(week).format('YYYYMMDD'))
      .replace(/#os#/, radioValue1)
      .replace(/#type#/, type);
    const todayRes = await getData(todaySql);
    const yesTodayRes = await getData(yestodaySql);
    const weekRes = await getData(weekSql);
    this.chartDraw(todayRes, yesTodayRes, weekRes, 'chart');
  };

  chartDraw = async (todayRes, yesTodayRes, weekRes, nodeId) => {
    const todayDaysNum = {};
    const yestodayDaysNum = {};
    const weekNum = {};
    const chartData = [];
    todayRes.forEach((v) => {
      todayDaysNum[v.hours] = v.num;
    });
    yesTodayRes.forEach((v) => {
      yestodayDaysNum[v.hours] = v.num;
    });
    weekRes.forEach((v) => {
      weekNum[v.hours] = v.num;
    });
    for (let i = 0; i < 24; i++) {
      chartData.push({
        value: todayDaysNum[i] || 0,
        day: `${i}时`,
        type: '今日',
      });
      chartData.push({
        value: yestodayDaysNum[i] || 0,
        day: `${i}时`,
        type: '昨日',
      });
      chartData.push({
        value: weekNum[i] || 0,
        day: `${i}时`,
        type: '7天前',
      });
    }
    if (nodeId === 'chartModal') {
      this.setState({
        exportData2: chartData,
      });
    }
    chartRender(chartData, nodeId);
  };

  allDateChange = (date) => {
    this.setState(
      {
        date1: date,
        date2: date,
      },
      this.getStaticData,
    );
  };

  detailDateChange = (date) => {
    this.setState(
      {
        date2: date,
      },
      this.drawDetailChart,
    );
  };

  drawDetailChart = async () => {
    const {
      date2, selectValue, radioValue3, ttid,
    } = this.state;
    let todayNum = [];
    let yestodayNum = [];
    let weekNum = [];
    let sql = modalSql.replace(/#day#/, moment(date2).format('YYYYMMDD')).replace(/#ttid#/, ttid);
    const yestoday = moment(moment(date2).subtract(1, 'days'));
    let yesSql = modalSql.replace(/#day#/, moment(yestoday).format('YYYYMMDD')).replace(/#ttid#/, ttid);
    const week = moment(moment(date2).subtract(7, 'days'));
    let weekSql = modalSql.replace(/#day#/, moment(week).format('YYYYMMDD')).replace(/#ttid#/, ttid);
    if (selectValue.includes('/')) {
      const value1 = selectValue.split('/')[0];
      const value2 = selectValue.split('/')[1];
      const sql1 = sql.replace(/#value#/, value1.replace(/#type#/g, radioValue3));
      const yesSql1 = yesSql.replace(/#value#/, value1.replace(/#type#/g, radioValue3));
      const weekSql1 = weekSql.replace(/#value#/, value1.replace(/#type#/g, radioValue3));
      const sql2 = sql.replace(/#value#/, value2.replace(/#type#/g, radioValue3));
      const yesSql2 = yesSql.replace(/#value#/, value2.replace(/#type#/g, radioValue3));
      const weekSql2 = weekSql.replace(/#value#/, value2.replace(/#type#/g, radioValue3));
      const res1 = await getData(sql1);
      const res2 = await getData(sql2);
      const resYes1 = await getData(yesSql1);
      const resYes2 = await getData(yesSql2);
      const weekRes1 = await getData(weekSql1);
      const weekRes2 = await getData(weekSql2);
      res1.forEach((v, index) => {
        todayNum.push({
          num: v.num && res2[index].num ? Number(((v.num * 100) / res2[index].num).toFixed(2)) : 0,
          hours: v.hours,
        });
      });
      resYes1.forEach((v, index) => {
        yestodayNum.push({
          num: v.num && resYes2[index].num ? Number(((v.num * 100) / resYes2[index].num).toFixed(2)) : 0,
          hours: v.hours,
        });
      });
      weekRes1.forEach((v, index) => {
        weekNum.push({
          num: v.num && weekRes2[index].num ? Number(((v.num * 100) / weekRes2[index].num).toFixed(2)) : 0,
          hours: v.hours,
        });
      });
    } else {
      sql = sql.replace(/#value#/, selectValue.replace(/#type#/g, radioValue3));
      yesSql = yesSql.replace(/#value#/, selectValue.replace(/#type#/g, radioValue3));
      weekSql = weekSql.replace(/#value#/, selectValue.replace(/#type#/g, radioValue3));
      todayNum = await getData(sql);
      yestodayNum = await getData(yesSql);
      weekNum = await getData(weekSql);
    }
    this.chartDraw(todayNum, yestodayNum, weekNum, 'chartModal');
  };

  onRowClick = (row) => {
    this.setState(
      {
        visible: true,
        ttid: row.ttid,
      },
      this.drawDetailChart,
    );
  };

  allRadioChange = (value) => {
    this.setState(
      {
        radioValue1: value,
      },
      this.getStaticData,
    );
  };

  detailRadioChange = (value) => {
    this.setState(
      {
        radioValue2: value,
      },
      this.getTableData,
    );
  };

  detailModalRadioChange = (value) => {
    this.setState(
      {
        radioValue3: value,
      },
      this.drawDetailChart,
    );
  };

  getStatisticSQLData = async (sql, type) => {
    const { date1, radioValue1 } = this.state;
    const yestoday = moment(moment(date1).subtract(1, 'days'));
    const diff = moment()
      .subtract(0, 'days')
      .diff(date1, 'days');
    const hours = moment().get('hours') - 2;
    const todaySql = sql
      .replace(/#day#/, moment(date1).format('YYYYMMDD'))
      .replace(/#os#/, radioValue1)
      .replace(/#hours#/, diff ? '' : ` and hours <= ${hours} `);
    const yestodaySql = sql
      .replace(/#day#/, moment(yestoday).format('YYYYMMDD'))
      .replace(/#os#/, radioValue1)
      .replace(/#hours#/, diff ? '' : ` and hours <= ${hours} `);
    const todayRes = await getData(todaySql);
    const yesTodayRes = await getData(yestodaySql);
    let pecision = 0;
    if (todayRes.length && yesTodayRes.length) {
      pecision = ((todayRes[0].num - yesTodayRes[0].num) * 100) / yesTodayRes[0].num;
    }
    this.setState({
      [`pecision${type}`]: pecision,
      [`value${type}`]: todayRes.length ? todayRes[0].num : 0,
    });
  };

  StatisticTem = (title, pecision, value, type) => (
    <Col span={8}>
      <div
        style={{
          border: this.state.clickType === type ? '1px solid #FF7F50' : '',
          cursor: 'pointer',
        }}
        onClick={() => this.setState({ clickType: type }, this.getChartData)}
      >
        <Card>
          <Statistic
            title={
              <p style={{ fontSize: 22 }}>
                {title}
                <span style={{ fontSize: 30, float: 'right', fontWeight: 600 }}>{value}</span>
              </p>
            }
            value={pecision}
            precision={2}
            valueStyle={{ color: pecision > 0 ? '#3f8600' : '#cf1322' }}
            prefix={<Icon type={pecision > 0 ? 'arrow-up' : 'arrow-down'} />}
            suffix="%"
          />
        </Card>
      </div>
    </Col>
  );

  render() {
    const columns = [
      { dataIndex: 'tt_name', key: 'tt_name', title: '模版名称' },
      { dataIndex: 'ttid', key: 'ttid', title: 'ttid' },
      { dataIndex: 'create_time', key: 'create_time', title: '上线时间' },
      {
        dataIndex: 'view_cnt',
        key: 'view_cnt',
        title: '封面曝光',
        sorter: (a, b) => a.view_cnt - b.view_cnt,
      },
      {
        dataIndex: 'click_cnt',
        key: 'click_cnt',
        title: '封面点击',
        sorter: (a, b) => a.click_cnt - b.click_cnt,
      },
      {
        dataIndex: 'click',
        key: 'click',
        title: '封面点击率(%)',
        sorter: (a, b) => a.click - b.click,
        render: text => `${text}%`,
      },
      {
        dataIndex: 'use_cnt',
        key: 'use_cnt',
        title: '点击"使用模版"进入制作页',
        sorter: (a, b) => a.use_cnt - b.use_cnt,
      },
      {
        dataIndex: 'save_cnt',
        key: 'save_cnt',
        title: '保存或完成导出',
        sorter: (a, b) => a.save_cnt - b.save_cnt,
      },
      {
        dataIndex: 'use_save',
        key: 'use_save',
        title: '模版完成率(%)',
        sorter: (a, b) => a.use_save - b.use_save,
        render: text => `${text}%`,
      },
      {
        dataIndex: 'share_cnt',
        key: 'share_cnt',
        title: '分享数',
        sorter: (a, b) => a.share_cnt - b.share_cnt,
      },
      {
        dataIndex: 'share',
        key: 'share',
        title: '分享率(%)',
        sorter: (a, b) => a.share - b.share,
        render: text => `${text}%`,
      },
      {
        dataIndex: 'tik_tok_share_cnt',
        key: 'tik_tok_share_cnt',
        title: '抖音分享数',
        sorter: (a, b) => a.tik_tok_share_cnt - b.tik_tok_share_cnt,
      },
      {
        dataIndex: 'tik_tok_share',
        key: 'tik_tok_share',
        title: '抖音分享率(%)',
        sorter: (a, b) => a.tik_tok_share - b.tik_tok_share,
        render: text => `${text}%`,
      },
    ];
    const {
      radioValue1,
      radioValue2,
      dataSource,
      value1,
      value2,
      value3,
      pecision1,
      pecision2,
      pecision3,
      visible,
      date1,
      date2,
      radioValue3,
      selectValue,
      exportData2,
    } = this.state;
    return (
      <div>
        <p style={{ fontSize: 26, marginBottom: 10 }}>整体数据</p>
        <div style={{ marginBottom: 20, background: '#fff' }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="查询" key="1">
              <Radio.Group
                defaultValue={radioValue1}
                buttonStyle="solid"
                style={{ marginRight: 20 }}
                onChange={e => this.allRadioChange(e.target.value)}
              >
                <Radio.Button value="all" key="all">
                  全部
                </Radio.Button>
                <Radio.Button value="Android" key="Android">
                  Android
                </Radio.Button>
                <Radio.Button value="iPhone OS" key="iPhone OS">
                  iOS
                </Radio.Button>
              </Radio.Group>
              <DatePicker defaultValue={date1} format={dateFormat} onChange={this.allDateChange} />
            </Panel>
          </Collapse>
        </div>
        <Row gutter={16}>
          {this.StatisticTem('曝光总人数', pecision1, value1, '1')}
          {this.StatisticTem('制作总人数', pecision2, value2, '2')}
          {this.StatisticTem('完成总人数', pecision3, value3, '3')}
        </Row>
        <div id="chart" style={{ background: '#fff', margin: '10px 0' }} />
        <hr style={{ margin: '30px 0' }} />
        <p style={{ fontSize: 26, marginBottom: 10 }}>细则信息</p>
        <Search
          placeholder="查询ttid"
          style={{ width: 400 }}
          onSearch={value => this.setState({ selectTTid: value }, this.getTableData)}
        />
        <Radio.Group
          defaultValue={radioValue2}
          buttonStyle="solid"
          style={{ margin: 20 }}
          onChange={e => this.detailRadioChange(e.target.value)}
        >
          <Radio.Button value="_usr_" key="_usr_">
            UV数据
          </Radio.Button>
          <Radio.Button value="_" key="_">
            PV数据
          </Radio.Button>
        </Radio.Group>
        <DownLoadButton filename="细则信息" columns={columns} data={dataSource} buttonText={false} />
        <Table
          style={{ marginTop: 20, background: '#fff' }}
          dataSource={dataSource}
          columns={columns}
          onRow={record => ({
            onClick: () => this.onRowClick(record),
          })}
          bordered
        />
        <Modal
          title="细则详情"
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          onOk={() => this.setState({ visible: false })}
          width={1000}
        >
          <p style={{ fontSize: 22, marginBottom: 10 }}>{this.state.ttid}</p>
          <Select
            style={{ width: 200 }}
            value={selectValue}
            onChange={e => this.setState({ selectValue: e }, this.drawDetailChart)}
          >
            <Select.Option key="view_cnt" value="view#type#cnt">
              封面曝光
            </Select.Option>
            <Select.Option key="click_cnt" value="click#type#cnt">
              封面点击
            </Select.Option>
            <Select.Option key="click_cnt/view_cnt" value="click#type#cnt/view#type#cnt">
              封面点击率(%)
            </Select.Option>
            <Select.Option key="use_cnt" value="use#type#cnt">
              点击&rdquo;使用模版&rdquo;进入制作页
            </Select.Option>
            <Select.Option key="save_cnt" value="save#type#cnt">
              保存或完成导出
            </Select.Option>
            <Select.Option key="use_save/save_cnt" value="use#type#save/save#type#cnt">
              模版完成率(%)
            </Select.Option>
            <Select.Option key="share_save" value="share#type#save">
              分享数
            </Select.Option>
            <Select.Option key="share_save/save_cnt" value="share#type#save/save#type#cnt">
              分享率(%)
            </Select.Option>
            <Select.Option key="tik_tok_share_cnt" value="tik_tok_share#type#cnt">
              抖音分享数
            </Select.Option>
            <Select.Option key="tik_tok_share_cnt/" value="tik_tok_share#type#cnt/save#type#cnt">
              抖音分享率(%)
            </Select.Option>
          </Select>
          <Radio.Group
            defaultValue={radioValue3}
            buttonStyle="solid"
            style={{ margin: 20 }}
            onChange={e => this.detailModalRadioChange(e.target.value)}
          >
            <Radio.Button value="_usr_" key="_usr_">
              UV数据
            </Radio.Button>
            <Radio.Button value="_" key="_">
              PV数据
            </Radio.Button>
          </Radio.Group>
          <DatePicker
            defaultValue={date2}
            format={dateFormat}
            onChange={this.detailDateChange}
            style={{ marginRight: 20 }}
          />
          <DownLoadButton
            filename="细则详情"
            columns={[
              { key: 'type', title: 'type' },
              { key: 'value', title: 'value' },
              { key: 'hours', title: 'hours' },
            ]}
            data={exportData2}
            buttonText={false}
          />
          <div id="chartModal" style={{ background: '#fff', margin: '10px 0' }} />
        </Modal>
      </div>
    );
  }
}
export default connect(({ app }) => ({ app }))(Index);
