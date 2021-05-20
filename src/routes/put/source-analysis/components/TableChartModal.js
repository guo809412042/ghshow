/* eslint-disable react/jsx-filename-extension */
/*
 * @Author: tab
 * @Date: 2020-07-08 16:39:14
 * @Last Modified by: tab
 * @Last Modified time: 2020-07-08 16:40:25
 */

import React from 'react';
import {
  Table, Modal, Button, DatePicker,
} from 'antd';
import moment from 'moment';
import { remainDetailSql } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import exportParams from '../../../../utils/exportExecl';

const { RangePicker } = DatePicker;
export default class TableChartModal extends React.Component {
  state = {
    visible: false,
    dateSpan: [],
    tableDate: {},
    remainKey: {},
    dataSource: [],
    remainTags: [],
  }

  dateFormat = 'YYYYMMDD'

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps }, () => {
      nextProps.tableDate[nextProps.remainKey.value] && this.getDate();
    });
  }

  getDate = async () => {
    const {
      dateSpan, remainKey, tableDate, remainTags,
    } = this.state;
    const name = tableDate[remainKey.value] === 'Organic' ? 'media_source' : remainKey.value;
    let where = '';
    remainTags.forEach((v) => {
      v.name === 'null' || !v.name ? where += `and ${v.tag.value} is null ` : where += `and ${v.tag.value} = '${v.name}'`;
    });
    where += (tableDate[remainKey.value] === 'null' ? `and ${remainKey.value} is null ` : `and ${name} = '${tableDate[remainKey.value]}'`);
    where = where.replace(/\$/g, '#');
    const sql = remainDetailSql.replace(/#startDate#/g, moment(dateSpan[0])
      .format(this.dateFormat))
      .replace(/#endDate#/g, moment(dateSpan[1])
        .format(this.dateFormat))
      .replace(/#name#/g, name)
      .replace(/#where#/g, where)
      .replace(/#/g, '$');
    const res = await getData(sql);
    const dataSource = [];
    const dates = [];
    res.jsonResult.forEach(i => !dates.includes(i.ds) && dates.push(i.ds));
    dates.forEach((i) => {
      const list = res.jsonResult.filter(j => j.ds === i);
      const arr = {
        ds: i,
      };
      list.forEach((j) => {
        arr[`stay_seq ${j.stay_seq}`] = j.reg_num ? `${(j.stay_num * 100 / j.reg_num).toFixed(2)}%` : '0.00%';
        arr.reg_num = j.reg_num;
      });
      dataSource.push(arr);
    });
    this.setState({ dataSource });
  }

  render() {
    const {
      visible, dateSpan, tableDate, remainKey, dataSource,
    } = this.state;
    const columns = [
      {
        title: '日期',
        dataIndex: 'ds',
        key: 'ds',
      },
      {
        title: '新增用户',
        dataIndex: 'reg_num',
        key: 'reg_num',
      },
    ];
    for (let i = 1; i < 8; i++) {
      columns.push({
        title: `${i}天后`,
        dataIndex: `stay_seq ${i}`,
        key: `stay_seq ${i}`,
      });
    }
    columns.push({
      title: '14天后',
      dataIndex: 'stay_seq 14',
      key: 'stay_seq 14',
    });
    columns.push({
      title: '28天后',
      dataIndex: 'stay_seq 28',
      key: 'stay_seq 28',
    });
    return (<div>
      <Modal
        title="留存"
        width={1000}
        visible={visible}
        onCancel={this.props.onClosetableChart}
        footer={[<Button onClick={this.props.onClosetableChart}>关闭</Button>]}
      >
        <h2>{tableDate[remainKey.value]}</h2>
        <Button
          style={{ margin: 20 }}
          type="primary"
          onClick={() => exportParams({
            filename: '留存',
            columns,
            data: dataSource,
          })}
        >导出</Button>
        <RangePicker value={dateSpan} onChange={value => this.setState({ dateSpan: value }, this.getDate)} />
        <Table
          dataSource={dataSource}
          columns={columns}
        />
      </Modal>
    </div>);
  }
}
