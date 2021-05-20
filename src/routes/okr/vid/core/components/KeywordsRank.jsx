import React from 'react';
import {
  Card, DatePicker, Table, Select,
} from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../../../../common/DownLoadButton';

import { getData } from '../../../../../utils/request';

const timeFormatQuery = 'YYYYMMDD';
const timeFormatShow = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
class KeywordsRank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment().subtract(1, 'days').format(timeFormatQuery),
      endTime: moment().format(timeFormatQuery),
      listData: [],
      originData: [],
      langList: [],
      lang: 'all',
      type: '1',
    };
  }

  componentDidMount() {
    this.getLangList();
    this.getList();
  }

  getLangList = async () => {
    const sql = `
    SELECT DISTINCT(lang) from rpt_vid_log_srch_cmty_cnt_1d order by lang;
    `;
    const res = await getData(sql);
    this.setState({ langList: res });
  }

  getList = async () => {
    const {
      startTime, endTime, lang, type,
    } = this.state;
    const sql = `
      select 
      ds,
      keyword,
      sum(search_count) as search_count,
      sum(unique_user_cnt) as unique_user_cnt,
      rn
      from rpt_vid_log_srch_cmty_cnt_1d
      where ds >= ${startTime}
            and ds <= ${endTime}
            and type = ${type}
            ${lang ? ' and lang=' + `'${lang}'` : ''}
      group by ds,keyword,rn
      order by ds desc,rn
      limit 1000
    `;
    const listData = await getData(sql);
    this.setState({ originData: listData || [] }, this.paint);
  }

  langChange = (lang) => {
    this.setState({
      lang,
    }, this.getList);
  }

  typeChange = (type) => {
    this.setState({ type }, this.getList);
  }

  dateChange = (_, dateStrings) => {
    this.setState({
      startTime: dateStrings[0].replace(/-/g, ''),
      endTime: dateStrings[1].replace(/-/g, ''),
    }, this.getList);
  }

  render() {
    const { originData, langList, lang } = this.state;
    const columns = [{
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
    }, {
      title: '关键词',
      dataIndex: 'keyword',
      key: 'keyword',
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
            <label>来源：</label>
            <Select style={{ width: 200, marginRight: 10 }} defaultValue="1" onChange={this.typeChange}>
              <Select.Option value="1">社区</Select.Option>
              <Select.Option value="2">模板</Select.Option>
            </Select>
            <label>社区：</label>
            <Select style={{ width: 200, marginRight: 10 }} defaultValue={lang} key="" onChange={this.langChange}>
              {/* <Select.Option key="" value="">全部社区</Select.Option> */}
              {langList.map(v => <Select.Option key={v.lang} value={v.lang}>{v.lang}</Select.Option>)}
            </Select>
            <RangePicker
              defaultValue={[moment(moment().subtract(1, 'days'), timeFormatShow), moment(moment().subtract(1, 'days'), timeFormatShow)]}
              format={timeFormatShow}
              onChange={this.dateChange}
              style={{ marginRight: '20px' }}
            />
            <DownLoadButton filename="用户关键词搜索" columns={columns} data={originData} />
          </div>
          <Table
            dataSource={originData}
            columns={columns}
            bordered
            pagination={{ pageSize: 20 }}
          />
        </Card>
      </>
    );
  }
}

export default KeywordsRank;
