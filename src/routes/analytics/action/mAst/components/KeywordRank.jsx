import React from 'react';
import {
  Card, DatePicker, Table, Select,
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { DownLoadButton } from '../../../../common/DownLoadButton';

import { getData } from '../../../../../utils/request';

moment.locale('zh-cn');

const timeFormatQuery = 'YYYYMMDD';
const timeFormatShow = 'YYYY-MM-DD';
const { Option } = Select;
class KeywordsRank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment().subtract(1, 'days').format(timeFormatQuery),
      endTime: moment().format(timeFormatQuery),
      originData: [],
      hour: '',
      date: moment().subtract(1, 'days').format(timeFormatQuery),
      type: 'new', // new 新增  cumulative 累计
    };
  }

  componentDidMount() {
    this.getList();
  }


  getList = async () => {
    const {
      startTime, endTime, hour, date, type,
    } = this.state;
    // const sql = `
    //   select
    //   ds,
    //   keyword,
    //   result,
    //   sum(search_count) as search_count,
    //   sum(unique_user_cnt) as unique_user_cnt,
    //   rn
    //   from rpt_india_log_srch_cmty_cnt_1d
    //   where ds >= ${startTime}
    //         and ds <= ${endTime}
    //   group by ds,keyword,result,rn
    //   order by ds desc,rn
    //   limit 1000
    // `;
    let where = `
    ds = ${date}  and type_id='${type}'
    `;
    if (hour)where += `and hh='${hour}'`;
    const sql = `select
    ds,
    hh,
    keyword,
    result,
    sum(unique_user_cnt) as unique_user_cnt ,
    sum(search_cnt) as search_count,
    rn
    FROM   rpt_india_log_srch_cmty_cnt_3h
    WHERE  ${where}
    group by ds,hh,keyword,result,rn
    order by hh desc,rn
    limit   1000
    `;
    // const sql = `select
    // ds,
    // hh,
    // keyword,
    // result,
    // unique_user_cnt as unique_user_cnt ,
    // search_cnt as search_count,
    // rn
    // FROM   rpt_india_log_srch_cmty_cnt_3h
    // WHERE  ${where}
    // order by hh desc,rn
    // limit   1000
    // `;
    const listData = await getData(sql);
    this.setState({ originData: listData || [] }, this.paint);
  }

  dateChange = (_, dateStrings) => {
    this.setState({
      date: dateStrings.replace(/-/g, ''),
    }, this.getList);
  }

  getHour=(value) => {
    this.setState({ hour: value }, this.getList);
  }

  getType=(value) => {
    this.setState({ type: value }, this.getList);
  }

  render() {
    const { originData } = this.state;
    const type = [
      { key: 'new', value: '新增数据' },
      { key: 'cumulative', value: '累计数据' },
    ];
    const hours = ['03', '06', '09', '12', '15', '18', '21'];
    const columns = [{
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
    },
    {
      title: '小时',
      dataIndex: 'hh',
      key: 'hh',
      render: (_, record) => <div>{record.hh}</div>,
    },
    {
      title: '关键词',
      dataIndex: 'keyword',
      key: 'keyword',
    }, {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
    }, {
      title: '搜索次数',
      dataIndex: 'search_count',
      key: 'search_count',
    }, {
      title: '搜索设备数',
      dataIndex: 'unique_user_cnt',
      key: 'unique_user_cnt',
    }, {
      title: '排名',
      dataIndex: 'rn',
      key: 'rn',
    }];
    return (
      <>
        <Card style={{ marginTop: 10 }} title="用户关键词搜索">
          <div style={{ marginBottom: 10 }}>
            <Select
              defaultValue="new"
              style={{ width: 100, marginRight: 10 }}
              onChange={this.getType}
            >
              {type.map(i => <Option value={i.key} key={i.key}>{i.value}</Option>)}
            </Select>
            <DatePicker
              locale={locale}
              onChange={this.dateChange}
              style={{ marginRight: '20px' }}
              defaultValue={moment(moment().subtract(1, 'days'), timeFormatShow)}
              placeholder="日期"
            />
            <Select
              allowClear
              style={{ width: 100, marginRight: 10 }}
              onChange={this.getHour}
              placeholder="小时"
            >
              {hours.map(i => <Option value={i} key={i}>{i}</Option>)}
            </Select>
            <DownLoadButton filename="用户关键词搜索" columns={columns} data={originData} />
          </div>
          <Table
            dataSource={originData}
            columns={columns}
            rowKey={(_i, x) => x.toString()}
            bordered
            pagination={{ pageSize: 20 }}
          />
        </Card>
      </>
    );
  }
}

export default KeywordsRank;
