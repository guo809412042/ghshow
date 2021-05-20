import React from 'react';
import { DatePicker, Input, Table } from 'antd';
import moment from 'moment';
import UploadExcelButton from '../../../../common/UploadExcelButton';
import { videoSql } from '../sqlTemplate';
import { createSqlWhere } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { TabPaneVideo } from '../contants';
import { DownLoadButton } from '../../../../common/DownLoadButton';

class TabPaneThree extends React.Component {
  state={
    auidList: [],
    puidList: [],
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(1, 'days'),
    loading: false,
    dataSource: [],
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData=async () => {
    const {
      auidList, startDate, endDate, puidList,
    } = this.state;
    this.setState({
      loading: true,
    });
    let $where = '';
    if (auidList.length) {
      $where += ` and auid in (${auidList.join(',')})`;
    }
    if (puidList.length) {
      $where += ` and puid in (${puidList.join(',')})`;
    }

    const sql = createSqlWhere({
      sql: videoSql,
      startDate,
      endDate,
      where: $where,
    });
    const res = await getData(sql);
    const dataSource = res.map(item => ({
      ...item,
      play_count: !item.play_count ? 0 : item.play_count,
      download_count: !item.download_count ? 0 : item.download_count,
      'play_count／exposure_count':
          !item.exposure_count || !item.play_count ? '0.00%' : `${(item.play_count * 100 / item.exposure_count).toFixed(2)}%`,
      'download_count/exposure_count':
          !item.exposure_count || !item.download_count ? '0.00%' : `${(item.download_count * 100 / item.exposure_count).toFixed(2)}%`,
    }));
    this.setState({
      loading: false,
      dataSource,
    });
  }

  render() {
    const {
      startDate, endDate, loading, dataSource,
    } = this.state;
    return <div>
      <UploadExcelButton
        fetchExc={this.fetchExc}
        uploadKey="auid"
        title="上传auidExcel查询"
      />
      <UploadExcelButton
        style={{ marginLeft: 10 }}
        fetchExc={this.fetchExc}
        uploadKey="puid"
        title="上传/puidExcel查询"
      />
      <Input.Search
        placeholder="auid查询"
        onSearch={search => this.setState({ auidList: search ? [search] : [] }, this.fetchData)}
        style={{ width: 120, margin: '0 10px' }}
      />
      <Input.Search
        placeholder="puid查询"
        onSearch={search => this.setState({ puidList: search ? [search] : [] }, this.fetchData)}
        style={{ width: 120 }}
      />
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={value => this.setState({
          startDate: value[0],
          endDate: value[1],
        }, this.fetchData)}
        style={{ width: 250, margin: '0 10px' }}
      />
      <DownLoadButton
        title="视频明细"
        columns={TabPaneVideo.columns}
        data={dataSource}
      />
      <Table
        dataSource={dataSource}
        bordered
        style={{ marginTop: 20 }}
        columns={TabPaneVideo.columns}
        loading={loading}
      />
    </div>;
  }
}
export default TabPaneThree;
