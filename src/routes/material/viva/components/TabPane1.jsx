/* eslint-disable prefer-const */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
import React from 'react';
import {
  Table, Modal, Tabs, Select,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { getData } from '../../../../utils/request';
import { getNumber, createSqlWhere } from '../../../../utils/utils';
import { DownLoadButton } from '../../../common/DownLoadButton';

const sqlTempate = `select 
#select# 
from 
#database# 
where 1=1 
#where# 
group by #groupBy#  
order by #orderBy# 
`;
const tabsKeys = {
  1: '全球',
  2: '中国',
  3: '美国',
  4: '韩国',
  5: '日本',
  6: '台湾',
  7: '泰国',
  8: '巴西',
  9: '印度尼西亚',
};
class TabPane1 extends React.Component {
  state = {
    platform: this.props.platform || '1',
    searchItem: this.props.searchItem || {},
    info: this.props.info,
    visible: false,
    detailDatasource: [],
    tabsKey: '1',
    allDataSource: [],
    chinaDataSource: [],
    USDataSource: [],
    SKDataSource: [],
    JPDataSource: [],
    TWDataSource: [],
    TGDataSource: [],
    BXDataSource: [],
    YNDataSource: [],
    selectCategory: '',
    searchTTid: [],
    exportDetailData: [],
    allData: [],
    ttidList: [],
  };

  componentDidMount() {
    this.getFecth();
    this.getAllData();
    this.getTTidList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.platform !== this.state.platform) {
      this.setState(
        {
          platform: nextProps.platform,
        },
        () => {
          this.getFecth();
          this.getTTidList();
        },
      );
    }
    if (!_.isEqual(this.state.searchItem, nextProps.searchItem)) {
      this.setState(
        {
          searchItem: nextProps.searchItem,
        },
        this.getFecth,
      );
    }
  }

  getTTidList = async () => {
    let {
      searchItem: { model },
      platform,
    } = this.state;
    const sql = `SELECT DISTINCT(ttid)
    FROM ads_viva_log_material_ctgy_cnt_1d
  where   product = ${platform}
      and model ${model.includes(',') ? `in (${model})` : `= '${model}'`}`;
    const res = await getData(sql);
    this.setState({
      ttidList: res,
    });
  }

  getAllData = async () => {
    let {
      searchItem: { startDate, endDate, model },
      info: { exportDetailColumns, day, database },
      platform,
    } = this.state;
    let groupBy = ['country', 'app_version', 'new_user', 'category', 'ttid'];
    let $select = exportDetailColumns
      .filter(v => !v.key.includes('/'))
      .map((v) => {
        if (groupBy.includes(v.key)) {
          return v.key;
        }
        return ` sum(${v.key}) as ${v.key}`;
      });
    $select.splice(1, 0, 'app_version');
    let sql = `select ${$select.join(',')}
    from  ${database}
    where 1=1 and ${day} >= ${moment(startDate).format('YYYYMMDD')}
    and ${day} <= ${moment(endDate).format('YYYYMMDD')}
    and product = ${platform}
    and model ${model.includes(',') ? `in (${model})` : `= '${model}'`}
    group  by ${groupBy.join(',')}
    `;
    const res = await getData(sql);
    let KEYS = exportDetailColumns.filter(v => v.key.includes('/')).map(v => v.key);
    let allData = res.map((v) => {
      let arr = v;
      for (let i of KEYS) {
        let num1 = v[i.split('/')[0]];
        let num2 = v[i.split('/')[1]];
        arr[i] = getNumber(num1, num2);
      }
      return arr;
    });
    this.setState({
      allData,
    });
  };

  getFecth = async () => {
    let { tabsKey, visible, searchItem } = this.state;
    let name = tabsKey.toString() === '1' ? '' : tabsKeys[tabsKey];
    let res = await this.getSQL(name);
    if (visible) {
      let exportDetailData = res.map(v => ({
        country: name || '全球',
        new_user: searchItem.selectUserType === '1' ? '整体' : searchItem.selectUserType === '2' ? '新用户' : '老用户',
        ...v,
      }));
      this.setState({
        detailDatasource: res,
        exportDetailData,
      });
    } else {
      switch (Number(tabsKey)) {
        case 1:
          this.setState({
            allDataSource: res,
          });
          break;
        case 2:
          this.setState({
            chinaDataSource: res,
          });
          break;
        case 3:
          this.setState({
            USDataSource: res,
          });
          break;
        case 4:
          this.setState({
            SKDataSource: res,
          });
          break;
        case 5:
          this.setState({
            JPDataSource: res,
          });
          break;
        case 6:
          this.setState({
            TWDataSource: res,
          });
          break;
        case 7:
          this.setState({
            TGDataSource: res,
          });
          break;
        case 8:
          this.setState({
            BXDataSource: res,
          });
          break;
        case 9:
          this.setState({
            YNDataSource: res,
          });
          break;
        default:
          this.setState({
            allDataSource: res,
          });
          break;
      }
    }
  };

  getSQL = async () => {
    let {
      searchItem: {
        startDate, endDate, selectUserType, model,
      },
      visible,
      searchTTid,
      info: {
        columns, day, groupBy, orderBy, database,
      },
      selectCategory,
      tabsKey,
      platform,
    } = this.state;
    let $where = `and ${day} >= ${moment(startDate).format('YYYYMMDD')}
    and ${day} <= ${moment(endDate).format('YYYYMMDD')}
    and product = ${platform}
    and model ${model.includes(',') ? `in (${model})` : `= '${model}'`}
    `;
    let $select = columns
      .filter(v => !v.key.includes('/'))
      .map((v) => {
        if (groupBy.includes(v.key)) {
          return v.key;
        }
        return ` sum(${v.key}) as ${v.key}`;
      });
    let $groupby = groupBy;
    let $orderby = orderBy;
    if (visible) {
      if (!$groupby.includes('ttid')) {
        $groupby.push('ttid');
      }
      if (!$select.includes('ttid')) {
        $select.push('ttid');
      }
      $where += ` and category = '${selectCategory}'`;
    } else {
      $groupby = $groupby.filter(v => v !== 'ttid');
      $select = $select.filter(v => v !== 'ttid');
    }
    if (searchTTid.length) {
      $where += ` and ttid in (${searchTTid.map(v => `'${v}'`).join(',')})`;
    }
    if (tabsKeys[tabsKey] !== '全球') {
      $where += ` and country = '${tabsKeys[tabsKey]}'`;
    }
    if (Number(selectUserType) === 2) {
      // 新用户
      $where += ' and new_user  = 1';
    }
    if (Number(selectUserType) === 3) {
      // 老用户
      $where += ' and new_user  <> 1';
    }
    let sql = createSqlWhere({
      sql: sqlTempate,
      startDate,
      endDate,
      database,
      where: $where,
      select: $select.join(','),
    });
    sql = sql
      .replace(/#orderBy#/, $orderby.join(','))
      .replace(/#groupBy#/, $groupby.join(','));
    let res = await getData(sql);
    let KEYS = columns.filter(v => v.key.includes('/')).map(v => v.key);
    let dataSource = res.map((v) => {
      let arr = v;
      for (let i of KEYS) {
        let num1 = v[i.split('/')[0]];
        let num2 = v[i.split('/')[1]];
        arr[i] = getNumber(num1, num2);
      }
      return arr;
    });
    return dataSource;
  };

  detailTable = (category) => {
    this.setState(
      {
        visible: true,
        selectCategory: category,
      },
      this.getFecth,
    );
  };

  render() {
    const {
      visible,
      detailDatasource,
      info,
      tabsKey,
      searchTTid,
      exportDetailData,
      allData,
      allDataSource,
      chinaDataSource,
      USDataSource,
      SKDataSource,
      JPDataSource,
      TWDataSource,
      TGDataSource,
      BXDataSource,
      YNDataSource,
      ttidList,
    } = this.state;
    const columns = _.clone(info.columns);
    const { title } = this.props;
    columns[0].render = text => (visible ? text : <a onClick={() => this.detailTable(text)}>{text}</a>);
    const detailColumns = _.clone(info.columns);
    detailColumns.splice(1, 0, {
      dataIndex: 'ttid',
      title: 'ttid',
      key: 'ttid',
    });
    const allDataColumns = _.clone(info.exportDetailColumns);
    allDataColumns.splice(1, 0, { dataIndex: 'app_version', title: '版本', key: 'app_version' });
    return (
      <div>
        <Select
          style={{ width: 600, margin: 8 }}
          value={searchTTid}
          onChange={value => this.setState({ searchTTid: value }, this.getFecth)}
          mode="multiple"
          showSearch
          filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
          placeholder="ttid搜索"
        >
          {ttidList.map(v => <Select.Option key={v.ttid} value={v.ttid} >{v.ttid}</Select.Option>)}
        </Select>
        <DownLoadButton filename={title} data={allData} title="所有导出" columns={allDataColumns} />
        <Tabs
          activeKey={tabsKey}
          style={{ marginTop: 20 }}
          onChange={value => this.setState({ tabsKey: value }, this.getFecth)}
        >
          <Tabs.TabPane tab="全球" key="1">
            <Table columns={columns} dataSource={allDataSource} bordered rowKey="category" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="中国" key="2">
            <Table columns={columns} dataSource={chinaDataSource} bordered rowKey="category" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="美国" key="3">
            <Table columns={columns} dataSource={USDataSource} bordered rowKey="category" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="韩国" key="4">
            <Table columns={columns} dataSource={SKDataSource} bordered rowKey="category" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="日本" key="5">
            <Table columns={columns} dataSource={JPDataSource} bordered rowKey="category" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="台湾" key="6">
            <Table columns={columns} dataSource={TWDataSource} bordered rowKey="category" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="泰国" key="7">
            <Table columns={columns} dataSource={TGDataSource} bordered rowKey="category" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="巴西" key="8">
            <Table columns={columns} dataSource={BXDataSource} bordered rowKey="category" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="印度尼西亚" key="9">
            <Table columns={columns} dataSource={YNDataSource} bordered rowKey="category" />
          </Tabs.TabPane>
        </Tabs>
        <Modal
          visible={visible}
          closable={false}
          onCancel={() => this.setState({ visible: false })}
          onOk={() => this.setState({ visible: false })}
          width={800}
        >
          <DownLoadButton filename="素材" data={exportDetailData} columns={info.exportDetailColumns} />
          <Table
            columns={detailColumns}
            dataSource={detailDatasource}
            bordered
            rowKey="ttid"
            style={{ marginTop: 10 }}
          />
        </Modal>
      </div>
    );
  }
}

export default TabPane1;
