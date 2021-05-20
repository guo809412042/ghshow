/*
 * @Author: tab
 * @Date: 2020-07-08 19:28:45
 * @Last Modified by: tab
 * @Last Modified time: 2020-07-08 20:45:21
 */

import React from 'react';
import {
  DatePicker, Select, Collapse, Row, Table, Button, Modal, Spin,
} from 'antd';
import moment from 'moment';
import intl from 'react-intl-universal';

import {
  chartSQL, languageSQL, operatorSQL, tableSQL1, tableSQL2, tableDetailSQL1, tableDetailSQL2,
  pieSQL,
} from './sqlTemplate';
import { getData } from '../../../../utils/request';
import {
  getSQL, sum, returnDateFormat, getTableData2, getTableData1, commomColumns,
} from './untils';
import { getBeforeWeek } from '../../../../utils/getBeforeWeekDate';

import CardView from './CardView';
import PieChartView from './PieChartView';
import exportParams from '../../../../utils/exportExecl';

const { RangePicker } = DatePicker;
export default class Index extends React.Component {
  state = {
    startDate: moment()
      .subtract(1, 'days'),
    endDate: moment()
      .subtract(1, 'days'),
    dataSource1: [],
    dataSource2: [],
    operatorList: [],
    langugeList: [],
    selectLanguage: [],
    selectOperator: [],
    spend: [0, 0],
    cpi: [0, 0],
    install: [0, 0],
    chartData: [],
    visible: false,
    loading1: false,
    loading2: false,
    detailDataSource: [],
    detailColumns: [],
    pieData: {
      item1: [],
      item2: [],
      item3: [],
      item4: [],
    },
    platform: undefined,
  }

  dateFormat = 'YYYYMMDD'

  async componentDidMount() {
    await this.getLanguageData();
    await this.getOperatorData();
    await this.getData();
  }

  getData = async () => {
    this.setState({ loading1: true }, async () => {
      await this.getChartData();
      await this.getTableData1();
      await this.getTableData2();
      await this.getPieData();
      this.setState({ loading1: false });
    });
  }

  getPieData = async () => {
    const {
      startDate, endDate, selectOperator, selectLanguage, platform,
    } = this.state;
    let sqlLanguage = getSQL(pieSQL, startDate, endDate, selectOperator, selectLanguage, this.dateFormat, platform);
    sqlLanguage = sqlLanguage.replace(/#type#/g, 'language');
    let sqlOperatorName = getSQL(pieSQL, startDate, endDate, selectOperator, selectLanguage, this.dateFormat, platform);
    sqlOperatorName = sqlOperatorName.replace(/#type#/g, 'operator_name');
    const resLanguage = await getData(sqlLanguage);
    const resOperatorName = await getData(sqlOperatorName);
    const pieData = {
      item1: [],
      item2: [],
      item3: [],
      item4: [],
    };
    const total = [0, 0, 0, 0];
    resLanguage.forEach((v) => {
      total[0] += v.install;
      total[1] += v.spend;
    });
    resOperatorName.forEach((v) => {
      total[2] += v.install;
      total[3] += v.spend;
    });
    const item1 = [];
    const item2 = [];
    const item3 = [];
    const item4 = [];
    resLanguage.forEach((v) => {
      item1.push({
        item: v.language,
        count: parseFloat(parseFloat(v.install)
          .toFixed(2)),
        percent: total[0] ? parseFloat((v.install * 100 / total[0]).toFixed(2)) : 0,
      });
      item2.push({
        item: v.language,
        count: parseFloat(parseFloat(v.spend)
          .toFixed(2)),
        percent: total[1] ? parseFloat((v.spend * 100 / total[1]).toFixed(2)) : 0,
      });
    });
    resOperatorName.forEach((v) => {
      item3.push({
        item: v.operator_name,
        count: parseFloat(parseFloat(v.install)
          .toFixed(2)),
        percent: total[2] ? parseFloat((v.install * 100 / total[2]).toFixed(2)) : 0,
      });
      item4.push({
        item: v.operator_name,
        count: parseFloat(parseFloat(v.spend)
          .toFixed(2)),
        percent: total[3] ? parseFloat((v.spend * 100 / total[3]).toFixed(2)) : 0,
      });
    });
    pieData.item1 = item1.sort((a, b) => b.count - a.count);
    pieData.item2 = item2.sort((a, b) => b.count - a.count);
    pieData.item3 = item3.sort((a, b) => b.count - a.count);
    pieData.item4 = item4.sort((a, b) => b.count - a.count);
    this.setState({ pieData });
  }

  getTableData2 = async () => {
    const {
      startDate, endDate, selectOperator, selectLanguage, platform,
    } = this.state;
    const sql = getSQL(tableSQL2, startDate, endDate, selectOperator, selectLanguage, this.dateFormat, platform);
    const res = await getData(sql);
    const dataSource2 = getTableData2(res, startDate, endDate);
    this.setState({
      dataSource2,
    });
  }

  getTableData1 = async () => {
    const {
      startDate, endDate, selectOperator, selectLanguage, platform,
    } = this.state;
    const sql = getSQL(tableSQL1, startDate, endDate, selectOperator, selectLanguage, this.dateFormat, platform);
    const res = await getData(sql);
    const dataSource1 = getTableData1(res, startDate, endDate, platform);
    this.setState({
      dataSource1,
    });
  }

  getOperatorData = async () => {
    const { startDate, endDate } = this.state;
    const sql = operatorSQL.replace(/#startDate#/g, returnDateFormat(startDate))
      .replace(/#endDate#/g, returnDateFormat(endDate));
    const res = await getData(sql);
    this.setState({ operatorList: res });
  }

  getLanguageData = async () => {
    const { startDate, endDate } = this.state;
    const sql = languageSQL.replace(/#startDate#/g, returnDateFormat(startDate))
      .replace(/#endDate#/g, returnDateFormat(endDate));
    const res = await getData(sql);
    this.setState({ langugeList: res });
  }

  getChartData = async () => {
    const {
      startDate, endDate, selectOperator, selectLanguage, platform,
    } = this.state;
    const sql = getSQL(chartSQL, startDate, endDate, selectOperator, selectLanguage, this.dateFormat, platform);
    const beforeSql = getSQL(
      chartSQL, getBeforeWeek(startDate), getBeforeWeek(endDate), selectOperator, selectLanguage,
      this.dateFormat, platform,
    );
    const res = await getData(sql);
    const beforeRes = await getData(beforeSql);
    const install1 = sum(res, 'install');
    const install2 = sum(beforeRes, 'install');
    const spend1 = sum(res, 'spend');
    const spend2 = sum(beforeRes, 'spend');
    this.setState({
      spend: [spend1, spend2 ? parseFloat(((spend1 - spend2) * 100 / spend2).toFixed(2)) : 100],
      install: [install1, install2 ? parseFloat(((install1 - install2) * 100 / install2).toFixed(2)) : 100],
      cpi: [
        install1 ? parseFloat((spend1 / install1).toFixed(2)) : 0,
        install1 && install2 ? parseFloat(((spend1 / install1 - spend2 / install2) / spend2 / install2).toFixed(2)) : 100,
      ],
      chartData: res,
    });
  }

  dateChange = (values) => {
    this.setState({
      startDate: values[0],
      endDate: values[1],
    }, this.getData);
  }

  detailModal1 = async (row) => {
    this.setState({
      visible: true,
      loading2: true,
    });
    const detailDataSource = [];
    const { startDate, endDate, platform } = this.state;
    const sql = getSQL(
      tableDetailSQL1, startDate, endDate,
      row.agent === 'Total' ? [] : [row.agent],
      row.language === 'Total' ? [] : [row.language],
      this.dateFormat, platform,
    );
    const res = await getData(sql);
    res.forEach((i) => {
      detailDataSource.push({
        day: i.ds,
        language: row.language,
        agent: row.agent,
        install: (i.install).toFixed(2),
        spend: (i.spend).toFixed(2),
        cpi: i.install ? (i.spend / i.install).toFixed(3) : 0,
      });
    });
    const columns = [
      {
        title: 'Date',
        key: 'day',
        dataIndex: 'day',
      },
      {
        title: 'Agent',
        key: 'agent',
        dataIndex: 'agent',
      },
    ].concat(commomColumns);
    this.setState({
      detailDataSource,
      detailColumns: columns,
      loading2: false,
    });
  }

  detailModal2 = async (row) => {
    this.setState({
      visible: true,
      loading2: true,
    });
    const detailDataSource = [];
    const { startDate, endDate, platform } = this.state;
    const sql = getSQL(
      tableDetailSQL2, startDate, endDate, [],
      row.language === 'Total' ? [] : [row.language], this.dateFormat, platform,
    );
    const res = await getData(sql);
    res.forEach((i) => {
      detailDataSource.push({
        day: i.ds,
        language: row.language,
        install: (i.install).toFixed(2),
        spend: (i.spend).toFixed(2),
        cpi: i.install ? (i.spend / i.install).toFixed(2) : 0,
      });
    });
    const columns = [
      {
        title: 'Date',
        key: 'day',
        dataIndex: 'day',
      },
    ].concat(commomColumns);
    this.setState({
      detailDataSource,
      detailColumns: columns,
      loading2: false,
    });
  }

  render() {
    const {
      startDate, endDate, dataSource2, dataSource1, langugeList, operatorList, selectLanguage, selectOperator,
      spend, cpi, install, chartData, loading1, loading2, pieData, platform,
    } = this.state;

    const columns1 = [
      {
        title: 'Date',
        key: 'day',
        dataIndex: 'day',
      },
      {
        title: 'platform',
        key: 'platform',
        dataIndex: 'platform',
      },
      {
        title: 'Agent',
        key: 'agent',
        dataIndex: 'agent',
      },
    ].concat(commomColumns)
      .concat([{
        title: 'operation',
        key: 'action',
        dataIndex: 'action',
        render: (text, row) => <Button type="primary" onClick={() => this.detailModal1(row)}>{intl.get('put.details').defaultMessage('详情')}</Button>,
      }]);
    const columns2 = [
      {
        title: 'Date',
        key: 'day',
        dataIndex: 'day',
      },
    ].concat(commomColumns)
      .concat([{
        title: 'operation',
        key: 'action',
        dataIndex: 'action',
        render: (text, row) => <Button type="primary" onClick={() => this.detailModal2(row)}>{intl.get('put.details').defaultMessage('详情')}</Button>,
      }]);
    const chartColumns = [
      { dataIndex: 'impressions', title: 'impressions', key: 'impressions' },
      { dataIndex: 'clicks', title: 'clicks', key: 'clicks' },
      { dataIndex: 'spend', title: 'spend', key: 'spend' },
      { dataIndex: 'install', title: 'install', key: 'install' },
      { dataIndex: 'ds', title: 'ds', key: 'ds' },
    ];
    return (<div>
      <Spin spinning={loading1}>
        <Collapse
          defaultActiveKey={['1']}
          style={{
            marginTop: 20,
          }}
        >
          <Collapse.Panel header={intl.get('put.filter').defaultMessage('查询')} key="1">
            <Select
              showSearch
              allowClear
              mode="multiple"
              style={{
                width: 400,
                marginRight: 16,
              }}
              value={selectOperator}
              onChange={selectOperator => this.setState({
                selectOperator,
              }, this.getData)}
              placeholder={intl.get('put.ads_publisher').defaultMessage('用户筛选')}
            >
              {operatorList.map(v => (<Select.Option
                key={v.operator_name}
                value={v.operator_name}
              >{v.operator_name}
              </Select.Option>))}
            </Select>
            <Select
              showSearch
              allowClear
              mode="multiple"
              style={{
                width: 400,
                marginRight: 16,
              }}
              value={selectLanguage}
              onChange={selectLanguage => this.setState({
                selectLanguage,
              }, this.getData)}
              placeholder={intl.get('put.language').defaultMessage('语言筛选')}
            >
              {langugeList.map(v => (<Select.Option
                key={v.language}
                value={v.language}
              >{v.language}
              </Select.Option>))}
            </Select>
            <Select
              allowClear
              style={{
                width: 120,
              }}
              value={platform}
              onChange={value => this.setState({ platform: value }, this.getData)}
              placeholder={intl.get('put.platform').defaultMessage('平台筛选')}
            >
              <Select.Option key="FB" value="FB">FB</Select.Option>
              <Select.Option key="UAC" value="UAC">UAC</Select.Option>
            </Select>
            <RangePicker
              style={{ float: 'right' }}
              value={[startDate, endDate]}
              onChange={this.dateChange}
            />
          </Collapse.Panel>
        </Collapse>
        <Button
          style={{ marginTop: 20 }}
          type="primary"
          onClick={() => exportParams({
            filename: intl.get('put.ads_reports').defaultMessage('投放报表'),
            columns: chartColumns,
            data: chartData,
          })}
        >{intl.get('put.export').defaultMessage('导出')}</Button>
        <Row>
          <CardView
            title={intl.get('put.install').defaultMessage('Install变化趋势')}
            type="install"
            bg="#6eb8d4"
            num={install[0]}
            percent={install[1]}
            chartData={chartData}
          />
          <CardView
            title={intl.get('put.spend').defaultMessage('spend变化趋势')}
            type="spend"
            bg="#13c2c2"
            num={spend[0]}
            percent={spend[1]}
            chartData={chartData}
          />
          <CardView
            title={intl.get('put.cpi').defaultMessage('CPI变化趋势')}
            type="cpi"
            bg="#1d89cf"
            num={cpi[0]}
            percent={cpi[1]}
            chartData={chartData}
          />
        </Row>

        <Button
          style={{ marginTop: 20 }}
          type="primary"
          onClick={() => exportParams({
            filename: intl.get('put.ads_reports').defaultMessage('投放报表'),
            columns: columns1.slice(0, columns1.length - 2),
            data: dataSource1,
          })}
        >{intl.get('put.export').defaultMessage('导出')}</Button>

        <Row style={{
          background: '#fff',
          marginTop: 20,
        }}
        >

          <Table
            dataSource={dataSource1}
            columns={columns1}
          />
        </Row>
        <Button
          style={{ marginTop: 20 }}
          type="primary"
          onClick={() => exportParams({
            filename: intl.get('put.ads_reports').defaultMessage('投放报表'),
            columns: columns2.slice(0, columns1.length - 2),
            data: dataSource2,
          })}
        >{intl.get('put.export').defaultMessage('导出')}</Button>
        <Row style={{
          background: '#fff',
          marginTop: 20,
        }}
        >
          <Table
            dataSource={dataSource2}
            columns={columns2}
          />
        </Row>
      </Spin>
      <Row gutter={24}>
        <PieChartView
          data={pieData.item1}
          title="installs by language"
        />
        <PieChartView
          data={pieData.item2}
          title="cost by language"
        />
        <PieChartView
          data={pieData.item3}
          title="installs by agent"
        />
        <PieChartView
          data={pieData.item4}
          title="cost by agent"
        />
      </Row>
      <Modal
        width={1000}
        visible={this.state.visible}
        onCancel={() => this.setState({ visible: false })}
        footer={[<Button onClick={() => this.setState({ visible: false })}>{intl.get('put.close').defaultMessage('关闭')}</Button>]}
      >
        <Table
          dataSource={this.state.detailDataSource}
          columns={this.state.detailColumns}
          loading={loading2}
        />
      </Modal>
    </div>);
  }
}
