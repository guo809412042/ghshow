import React from 'react';
import { connect } from 'dva';
import { Row, Radio, Table } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';
import QueryIndex from '../../components/Query/Index';
import { getData } from '../../../utils/request';
import { duidAuidSQL } from './sqlTemplate';
import { createSql, dateFormat } from '../../../utils/utils';
import { ChartRender } from '../../common/drawChart';
import { DownLoadButton } from '../../common/DownLoadButton';

class Index extends React.Component {
  state = {
    tab: 'day',
    selectCountry: undefined,
    selectChannel: undefined,
    startDate: moment().subtract(31, 'days'),
    endDate: moment().subtract(1, 'days'),
    countryOperation: '=',
    channelOperation: '=',
    ghPlatform: this.props.app.ghPlatform,
    dataSource: [],
  };

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextPorps) {
    if (this.state.ghPlatform !== nextPorps.app.ghPlatform) {
      this.setState(
        {
          ghPlatform: nextPorps.app.ghPlatform,
        },
        this.getData,
      );
    }
  }

  getData = async () => {
    const {
      startDate,
      endDate,
      channelOperation,
      selectChannel,
      countryOperation,
      selectCountry,
      tab,
      ghPlatform,
    } = this.state;
    let sql = createSql(duidAuidSQL, startDate, endDate, ghPlatform);
    let where = '';
    if (channelOperation && selectChannel) {
      where += ` and channel ${channelOperation} '${selectChannel}'`;
    }
    if (selectCountry && countryOperation) {
      where += ` and country ${countryOperation} ${selectCountry}`;
    }
    sql = sql
      .replace(/#type#/, Number(ghPlatform) - 1)
      .replace(/#duration#/, tab)
      .replace(/#where#/, where);
    const res = await getData(sql);
    const chartData = [];
    res.forEach((v) => {
      chartData.push({
        value: v.duid_total,
        type: 'duid',
        day: dateFormat(v.day),
      });
      chartData.push({
        value: v.auid_total,
        type: 'auid',
        day: dateFormat(v.day),
      });
    });
    this.setState({ dataSource: res });
    ChartRender(chartData, 'active_device');
  };

  onSearch = (values) => {
    this.setState({ ...values }, this.getData);
  };

  render() {
    const { tab, ghPlatform, dataSource } = this.state;
    const columns = [
      { dataIndex: 'duid_total', key: 'duid_total', title: 'duid_total' },
      { dataIndex: 'auid_total', key: 'auid_total', title: 'auid_total' },
      { dataIndex: 'day', key: 'day', title: 'day' },
    ];
    return (
      <div>
        {BreadcrumbMenu()}
        <Row>
          <QueryIndex ghPlatform={ghPlatform} onSearch={this.onSearch} noAppversion />
        </Row>
        <Radio.Group
          style={{ margin: '30px 0' }}
          value={tab}
          onChange={e => this.setState({ tab: e.target.value }, this.getData)}
        >
          {ghPlatform === '1' && <Radio.Button value="day">每日统计</Radio.Button>}
          {ghPlatform === '1' && <Radio.Button value="week">每周统计</Radio.Button>}
          {ghPlatform === '1' && <Radio.Button value="month">每月统计</Radio.Button>}
          {ghPlatform === '2' && <Radio.Button value="day">每日统计(真实)</Radio.Button>}
          {ghPlatform === '2' && <Radio.Button value="week">每周统计(真实)</Radio.Button>}
          {ghPlatform === '2' && <Radio.Button value="month">每月统计(真实)</Radio.Button>}
        </Radio.Group>
        <div id="chart-active_device" />
        <div style={{ marginTop: 20 }} />
        <DownLoadButton filename="活跃设备" data={dataSource} columns={columns} />
        <Table dataSource={dataSource} columns={columns} bordered rowKey="day" style={{ marginTop: 20 }} />
      </div>
    );
  }
}
Index.propTypes = {
  app: PropTypes.object,
};
Index.defaultProps = {
  app: {
    ghPlatform: '1',
  },
};
export default connect(({ app }) => ({ app }))(Index);
