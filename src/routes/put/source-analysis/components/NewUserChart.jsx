/*
 * @Author: tab
 * @Date: 2020-07-08 16:35:49
 * @Last Modified by: tab
 * @Last Modified time: 2020-07-08 16:38:43
 */

import React from 'react';
import { Modal, Button, DatePicker } from 'antd';
import moment from 'moment';
import { coreSqlDetail } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { chartNewUserRender } from './chartRender';
import exportParams from '../../../../utils/exportExecl';

const { RangePicker } = DatePicker;
export default class NewUserChart extends React.Component {
  state = {
    visible: false,
    chartData: {},
    dateSpan: [],
    coreKey: {},
    coreTags: [],
    dataSource: [],
  }

  dateFormat = 'YYYYMMDD'

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps }, () => {
      nextProps.chartData[nextProps.coreKey.value] && this.getChartData();
    });
  }

  getChartData = async () => {
    const {
      dateSpan, coreKey, chartData, coreTags,
    } = this.state;
    let where = '';
    const name = chartData[coreKey.value] === 'Organic' ? 'media_source' : coreKey.value;
    coreTags.forEach((v) => {
      v.name === 'null' || !v.name ? where += `and ${v.tag.value} is null ` : where += `and ${v.tag.value} = '${v.name}'`;
    });
    where += (chartData[coreKey.value] === 'null' ? `and ${coreKey.value} is null ` : `and ${name} = '${chartData[coreKey.value]}'`);
    where = where.replace(/\$/g, '#');
    const sql = coreSqlDetail.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat))
      .replace(/#name#/g, coreKey.value)
      .replace(/#where#/g, where)
      .replace(/#/g, '$');
    const res = await getData(sql);
    const data = res.jsonResult.map(v => ({
      ...v,
      ds: (v.ds).toString(),
    }));
    this.setState({
      dataSource: res.jsonResult,
    });
    chartNewUserRender(data, 'source_user_new_user_chart');
  }

  close = () => {
    this.props.onCloseNewUserChart(false);
  }

  render() {
    const { dateSpan, coreKey, chartData } = this.state;
    return <div>
      <Modal
        width={800}
        title="新增用户"
        visible={this.state.visible}
        footer={[<Button onClick={this.close}>关闭</Button>]}
        onCancel={this.close}
      >
        <h2>{chartData[coreKey.value]}</h2>
        <Button
          style={{ margin: 20 }}
          type="primary"
          onClick={() => exportParams({
            filename: '新增用户',
            columns: [{
              key: 'reg_num',
              title: 'reg_num',
            }, {
              key: 'ds',
              title: 'ds',
            }],
            data: this.state.dataSource,
          })}
        >导出</Button>
        <RangePicker value={dateSpan} onChange={value => this.setState({ dateSpan: value }, this.getChartData)}/>
        <div id="source_user_new_user_chart"/>
      </Modal>
    </div>;
  }
}
