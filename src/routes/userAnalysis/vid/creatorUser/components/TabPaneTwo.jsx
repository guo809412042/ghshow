import React from 'react';
import {
  DatePicker, Select, Input, Table, Tag,
} from 'antd';
import moment from 'moment';
import UploadExcelButton from '../../../../common/UploadExcelButton';
import { userSql } from '../sqlTemplate';
import { createSqlWhere } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { DownLoadButton } from '../../../../common/DownLoadButton';

const statusList = {
  1: '创作者',
  2: '待激活超级创造者',
  3: '超级创作者',
};
const TabPaneUser = {
  columns: [
    {
      title: 'auid',
      dataIndex: 'auid',
      key: 'auid',
    },
    {
      title: '创作者状态',
      dataIndex: 'state',
      key: 'state',
    }, {
      title: '创作者等级',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'original',
      dataIndex: 'original',
      key: 'original',
      render: (text) => {
        if (text === undefined || Number(text) === 0) {
          return <Tag color="#FF8800">未申请</Tag>;
        }
        switch (Number(text)) {
          case -1:
            return <Tag color="#f50">审核不通过</Tag>;
          case 1:
            return <Tag color="#108ee9">审核中</Tag>;
          case 2:
            return <Tag color="#87d068">审核通过</Tag>;
          default:
            return <Tag color="#2db7f5">原创标签</Tag>;
        }
      },
    },
    {
      title: '发布数量',
      dataIndex: 'publish_count',
      key: 'publish_count',
    },
    {
      title: '水印视频占比',
      dataIndex: 'watermark_vc/publish_count',
      key: 'watermark_vc/publish_count',
    },
    {
      title: '曝光视频数量',
      dataIndex: 'exposure_vc',
      key: 'exposure_vc',
    },
    {
      title: '曝光量',
      dataIndex: 'exposure_count',
      key: 'exposure_count',
    },
    {
      title: '播放量',
      dataIndex: 'play_3s_count',
      key: 'play_3s_count',
    },
    {
      title: 'PTR',
      dataIndex: 'play_3s_count／exposure_count',
      key: 'play_3s_count／exposure_count',
    },
    {
      title: 'DTR',
      dataIndex: 'download_count/exposure_count',
      key: 'download_count/exposure_count',
    },
    {
      title: '收益',
      dataIndex: 'coin',
    },
  ],
};
class TabPaneTwo extends React.Component {
  state = {
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(1, 'days'),
    level: '0',
    original: '',
    dataSource: [],
    auidList: [],
    loading: false,
  }

  componentDidMount() {
    this.getFetch();
  }

  getFetch=async () => {
    const {
      auidList, startDate, endDate, level, original,
    } = this.state;
    this.setState({
      loading: true,
    });
    let $where = '';
    if (auidList.length > 1) {
      $where += ` and auid in (${auidList.join(',')})`;
    } else if (auidList.length === 1) {
      $where += ` and auid = '${auidList[0]}'`;
    }
    if (level === '1') {
      $where += ' and level is not null';
    } else {
      $where += ' and level is null';
    }
    if (original) {
      $where += original !== 'null' ? ` and original = ${original}` : ' and (original is null or original = 0 ) ';
    }
    const sql = createSqlWhere({
      sql: userSql,
      startDate,
      endDate,
      where: $where,
    });
    const res = await getData(sql);
    const dataSource = res.map(item => ({
      ...item,
      state: statusList[item.state],
      'watermark_vc/publish_count': item.publish_count === 0 ? '0.00%' : `${(item.watermark_vc * 100 / item.publish_count).toFixed(2)}%`,
      'play_3s_count／exposure_count': !item.exposure_count || !item.play_3s_count ? '0.00%' : `${(item.play_3s_count * 100 / item.exposure_count).toFixed(2)}%`,
      'download_count/exposure_count': !item.exposure_count || !item.download_count ? '0.00%' : `${(item.download_count * 100 / item.exposure_count).toFixed(2)}%`,
    }));
    this.setState({
      dataSource,
      loading: false,
    });
  }

  fetchExc = async (value) => {
    this.setState({
      auidList: value,
    }, this.getFetch);
  }

  render() {
    const {
      startDate, endDate, level, original, dataSource, loading,
    } = this.state;
    return <div>
      <UploadExcelButton
        fetchExc={this.fetchExc}
        uploadKey="auid"
      />
      <Input.Search
        placeholder="auid查询"
        style={{ width: 150, margin: '0 20px' }}
        onSearch={e => this.setState({ auidList: e ? [e] : [] }, this.getFetch)}
      />
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={value => this.setState({
          startDate: value[0],
          endDate: value[1],
        }, this.getFetch)}
        style={{ width: 250 }}
      />
      <Select
        value={level}
        style={{ width: 120, margin: '0 20px' }}
        onChange={e => this.setState({ level: e }, this.getFetch)}
      >
        <Select.Option value="0" key="0">all</Select.Option>
        <Select.Option value="1" key="1">强运营创作者</Select.Option>
        <Select.Option value="2" key="2">创作者</Select.Option>
      </Select>
      <Select
        value={original}
        style={{ width: 120, marginRight: 20 }}
        onChange={value => this.setState({
          original: value,
        }, this.getFetch)}
      >
        <Select.Option value="" key="">全部</Select.Option>
        <Select.Option value="null" key="null">未申请</Select.Option>
        <Select.Option value="1" key="1">审核中</Select.Option>
        <Select.Option value="2" key="2">审核通过</Select.Option>
        <Select.Option value="-1" key="-1">审核不通过</Select.Option>
        <Select.Option value="829" key="829">原创标签</Select.Option>
      </Select>
      <DownLoadButton
        title="用户明细"
        columns={TabPaneUser.columns}
        data={dataSource}
      />
      <Table
        columns={TabPaneUser.columns}
        dataSource={dataSource}
        style={{ marginTop: 20 }}
        bordered
        loading={loading}
      />
    </div>;
  }
}
export default TabPaneTwo;
