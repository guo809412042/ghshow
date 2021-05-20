/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  DatePicker, Collapse, Select, Table,
} from 'antd';
import {
  createSqlWhere, getNumber, selectAttr,
} from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';

const sqlTemplate = `
select  app_version
        ,#molecular#
        ,#denominator#
        ,ds
from    #database#
where  ds >= #startDate# and ds <= #endDate# #where#
order by ds desc,app_version desc
limit   10000
;
`;

export default (props) => {
  const { product } = props.match.params;
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [type, setType] = useState('all');
  const [userType, setUserType] = useState('_');
  const [appVersionList, setAppVersionList] = useState([]);
  const [currentAppVersion, setAppVersion] = useState();
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const getFetchData = async () => {
    let molecular = '';
    let denominator = '';
    if (userType === '_' || userType === '_old_' || userType === '_new_') {
      molecular = `${type}${userType}stay_cnt`;
      denominator = `${type}${userType}active_cnt`;
    } else {
      molecular = `${(type === 'all' ? '' : `${type}_`) + userType}_stay_cnt`;
      denominator = `${(type === 'all' ? '' : `${type}_`) + userType}_act_cnt`;
    }
    let where = '';
    if (product === 'mast') {
      if (currentAppVersion) where += `and app_version = '${currentAppVersion}'`;
      where += 'and product_id = 42';
    }
    const sql = createSqlWhere({
      sql: sqlTemplate,
      type,
      startDate,
      database: product === 'vid' ? 'rpt_vid_log_ver_stay_cnt_nd' : 'rpt_india_log_ver_stay_cnt_nd',
      endDate,
      denominator,
      where,
      molecular,
    });
    const res = await getData(sql);
    const dates = [];
    const appVersion = [];
    for (const i of res) {
      if (!dates.includes(i.ds)) {
        dates.push(i.ds);
      }
      if (!appVersion.includes(i.app_version)) {
        appVersion.push(i.app_version);
      }
    }
    const columns = [
      {
        dataIndex: 'app_version',
        key: 'app_version',
        title: 'app版本',
        render: v => <span>{v || 'unknow'}</span>,
      },
    ];
    for (const i of dates) {
      columns.push({
        key: i,
        title: i,
        dataIndex: i,
      });
    }
    setColumns(columns);
    const data = [];

    for (const i of appVersion) {
      const arr = {
        app_version: i,
      };
      const list = res.filter(v => v.app_version === i);
      for (const i of list) {
        arr[i.ds] = getNumber(i[molecular], i[denominator]);
      }
      data.push(arr);
    }
    setDataSource(data);
  };
  useEffect(() => {
    getFetchData();
  }, [startDate, endDate, userType, type, currentAppVersion, product]);

  useEffect(() => {
    getData('select  app_version from rpt_india_log_ver_stay_cnt_nd  where product_id = 42 group by app_version').then(res => setAppVersionList(res.filter(x => x?.app_version)));
  }, []);
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="用户类型"
            value={userType}
            onChange={setUserType}
          >
            <Select.Option key="_" value="_">
              整体
            </Select.Option>
            <Select.Option key="_new_" value="_new_">
              新用户
            </Select.Option>
            <Select.Option key="_old_" value="_old_">
              老用户
            </Select.Option>
            {
              product === 'vid' && (
                <Select.Option key="tool" value="tool">
                    工具用户
                </Select.Option>
              )
            }
            {
              product === 'vid' && (
                <Select.Option key="cmty" value="cmty">
                  社区用户
                </Select.Option>
              )
            }
          </Select>
          {
            product === 'mast' && (
              <Select
                placeholder="版本"
                {...selectAttr}
                value={currentAppVersion}
                onChange={setAppVersion}
              >
                {_.map(appVersionList, item => (
                  <Select.Option key={item.app_version} value={item.app_version}>
                    {item.app_version}
                  </Select.Option>
                ))}
              </Select>
            )
          }

          <Select style={{ width: 100, marginRight: '8px' }} placeholder="用户类型" value={type} onChange={setType}>
            <Select.Option key="all" value="all">
              总次留
            </Select.Option>
            <Select.Option key="app" value="app">
              app次留
            </Select.Option>
          </Select>
          <DatePicker.RangePicker
            style={{ marginBottom: 8, marginRight: '8px' }}
            value={[startDate, endDate]}
            onChange={(value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }}
          />
          <DownLoadButton filename="次留" data={dataSource} columns={columns} />
        </Collapse.Panel>
      </Collapse>

      <Table columns={columns} dataSource={dataSource} bordered style={{ marginTop: 20 }} rowKey="app_version" />
    </div>
  );
};
