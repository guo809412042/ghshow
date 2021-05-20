import React from 'react';
import {
  Select, Row, Col, DatePicker, Table,
} from 'antd';
import moment from 'moment';
import { consumeSQL } from '../sqlTemplate';
import { chartLineRender } from './remainChartRender';
import { TYPES_LIST } from '../contants';
import { createSqlWhere } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { DownLoadButton } from '../../../../common/DownLoadButton';

const { RangePicker } = DatePicker;
export default class ConsumeView extends React.Component {
  state = {
    startDate: moment()
      .subtract(8, 'days'),
    endDate: moment()
      .subtract(1, 'days'),
    type: 'income',
    dataSource: [],
    typesLen: 1,
    exportDataSource: [],
    exportColumns: [],
  }

  async componentDidMount() {
    this.initData();
  }

  initData = async () => {
    const {
      startDate, endDate, type,
    } = this.state;
    const sql = createSqlWhere({
      sql: consumeSQL, startDate, endDate, type,
    });
    const res = await getData(sql);
    const exportColumns = [];
    if (res.length) {
      Object.keys(res[0])
        .forEach((i) => {
          exportColumns.push({
            title: i,
            key: i,
            dataIndex: i,
          });
        });
    }
    this.setState({
      exportDataSource: res,
      exportColumns,
    });
    const ptrData = [];
    const dtrData = [];
    res.forEach((i) => {
      ptrData.push({
        type: i.type,
        day: moment(String(i.DAY))
          .format('YYYYMMDD'),
        value: parseFloat((i.play3s_count * 100 / i.exposure_count).toFixed(2)),
      });
      dtrData.push({
        type: i.type,
        day: moment(String(i.DAY))
          .format('YYYYMMDD'),
        value: parseFloat((i.download_count * 100 / i.exposure_count).toFixed(2)),
      });
    });
    chartLineRender(ptrData, document.getElementById('consume_line_ptr'));
    chartLineRender(dtrData, document.getElementById('consume_line_dtr'));
    this.getTableTable(res, type);
  }

  getTableTable = async (res, type) => {
    const types = TYPES_LIST[type] || [];
    const dates = [];
    res.forEach((i) => {
      if (!TYPES_LIST[type]) {
        !types.includes(i.type) && types.push(i.type);
      }
      !dates.includes(i.DAY) && dates.push(i.DAY);
    });
    const dataSource = [];
    res.forEach((i) => {
      dataSource.push({
        ...i,
        'hot_exp_v_cnt/pub_v_cnt': parseFloat((i.hot_exp_v_cnt * 100 / i.pub_v_cnt).toFixed(2)),
        'play3s_count/exposure_count': parseFloat((i.play3s_count * 100 / i.exposure_count).toFixed(2)),
        'download_count/exposure_count': parseFloat((i.download_count * 100 / i.exposure_count).toFixed(2)),
        'play3s_v_cnt/exp_v_cnt': parseFloat((i.play3s_v_cnt * 100 / i.exp_v_cnt).toFixed(2)),
        'download_v_cnt/exp_v_cnt': parseFloat((i.download_v_cnt * 100 / i.exp_v_cnt).toFixed(2)),
        'like_v_cnt/exp_v_cnt': parseFloat((i.like_v_cnt * 100 / i.exp_v_cnt).toFixed(2)),
        'pop_3_v_cnt/exp_v_cnt': parseFloat((i.pop_3_v_cnt * 100 / i.exp_v_cnt).toFixed(2)),
      });
    });
    this.setState({
      dataSource,
      typesLen: types.length,
    });
  }


  render() {
    const {
      startDate, endDate, type, dataSource, typesLen, exportColumns, exportDataSource,
    } = this.state;
    const columns = [
      {
        dataIndex: 'DAY',
        title: '日期',
        render: (text, row, index) => ({
          children: text,
          props: {
            rowSpan: index % typesLen === 0 ? typesLen : 0,
          },
        }),
      },
      {
        dataIndex: 'type',
        title: '用户类型',
      },
      {
        dataIndex: 'pub_v_cnt',
        title: '发布量',
      },
      {
        dataIndex: 'hot_exp_v_cnt',
        title: '热门曝光量',
      },
      {
        dataIndex: 'hot_exp_v_cnt/pub_v_cnt',
        title: '热门曝光率',
      },
      {
        dataIndex: 'exposure_count',
        title: '曝光量',
      },
      {
        dataIndex: 'play3s_count',
        title: '有效播放量',
      },
      {
        dataIndex: 'download_count',
        title: '下载量',
      },
      {
        dataIndex: 'play3s_count/exposure_count',
        title: 'PTR',
      },
      {
        dataIndex: 'download_count/exposure_count',
        title: 'DTR',
      },
      {
        dataIndex: 'exp_v_cnt',
        title: '曝光视频数量',
      },
      {
        dataIndex: 'play3s_v_cnt/exp_v_cnt',
        title: '有效播放率',
      },
      {
        dataIndex: 'download_v_cnt/exp_v_cnt',
        title: '下载率',
      },
      {
        dataIndex: 'like_v_cnt/exp_v_cnt',
        title: '点赞率',
      },
      {
        dataIndex: 'pop_3_v_cnt/exp_v_cnt',
        title: '上浮3通过率',
      },
    ];
    return (<div>
      <RangePicker
        value={[startDate, endDate]}
        onChange={values => this.setState({
          startDate: values[0],
          endDate: values[1],
        }, this.initData)}
      />
      <Select
        style={{
          width: 200,
          marginLeft: 20,
          marginRight: 20,
        }}
        placeholder="用户分层"
        defaultValue="income"
        value={type}
        onChange={value => this.setState({
          type: value,
        }, this.initData)}
      >
        <Select.Option key="income" value="income">收入分层</Select.Option>
        <Select.Option key="normal_creator" value="normal_creator">创作者状态</Select.Option>
        <Select.Option key="super" value="super">超级创作者状态</Select.Option>
        <Select.Option key="original" value="original">原创状态</Select.Option>
        <Select.Option key="upper_level" value="upper_level">流量扶持状态</Select.Option>
        <Select.Option key="coin_range" value="coin_range">金币分层</Select.Option>
        <Select.Option key="rewarded_withdraw" value="rewarded_withdraw">提现及奖励用户</Select.Option>
        <Select.Option key="reg" value="reg">成为创作者时间</Select.Option>
      </Select>
      <DownLoadButton
        filenam="消费情况"
        columns={exportColumns}
        data={exportDataSource}
      />
      <Row style={{ marginTop: 20 }}>
        <Col span={12}>
          <h3>PTR</h3>
          <div id="consume_line_ptr"/>
        </Col>
        <Col span={12}>
          <h3>DTR</h3>
          <div id="consume_line_dtr"/>
        </Col>
      </Row>
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 1600 }}
        bordered
        pagination={false}
      />
    </div>);
  }
}
