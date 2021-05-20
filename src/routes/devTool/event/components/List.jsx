/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-05-11 17:01:38
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React from 'react';
import { Table, Tag } from 'antd';

// import HistoryVersion from './HistoryVersion';
import DevState from './DevState';
import Del from './Del';
import Edit from './Edit';
import Collection from './Collection';

import { baseColumns } from './TableColumn';
import {
  STATEMAP,
  STATEMAPColor,
} from '../const';

//  以下两种状态不显示编辑和删除
const hideHandle = [1, 2];
const List = ({
  listData,
  searchEventName,
  listLoading,
  androidDevList,
  iosDevList,
  appVersionList,
  tagList,
  formFields,
  IDpageDict,
  IDpageList,
  IDmoduleDict,
  IDmoduleList,
  IDcontrolDict,
  IDcontrolList,
  IDactionDict,
  IDactionList,
  reFresh,
  myEventList,
  devList,
}) => {
  const columns = [
    {
      title: '版本',
      dataIndex: 'version',
      fixed: 'left',
      width: 100,
    },
    ...baseColumns,
    {
      title: '安卓负责人',
      dataIndex: 'android_dev',
      width: 160,
      render: (text, row) => (text ? <span>{text}：<Tag color={STATEMAPColor[row.android_state]}>{STATEMAP[row.android_state]}</Tag></span> : null),
    },
    {
      title: 'iOS负责人',
      dataIndex: 'ios_dev',
      width: 160,
      render: (text, row) => (text ? <span>{text}：<Tag color={STATEMAPColor[row.ios_state]}>{STATEMAP[row.ios_state]}</Tag></span> : null),
    },
    {
      title: '操作',
      dataIndex: 'handle',
      width: 200,
      fixed: 'right',
      render: (text, row) => (
        <div>
          <Collection key={`${row.id}Collection`} id={row.id} callback={reFresh} myEventList={myEventList || []} />
          <Edit
            key={`${row.id}Copy`}
            record={row}
            title="复制"
            formFields={formFields}
            appVersionList={appVersionList}
            tagList={tagList}
            androidDevList={androidDevList}
            iosDevList={iosDevList}
            reFresh={reFresh}
            IDpageDict={IDpageDict}
            IDpageList={IDpageList}
            IDmoduleDict={IDmoduleDict}
            IDmoduleList={IDmoduleList}
            IDcontrolDict={IDcontrolDict}
            IDcontrolList={IDcontrolList}
            IDactionDict={IDactionDict}
            IDactionList={IDactionList}
          />
          <DevState
            key={`${row.id}DevState`}
            content={row}
            iosdev={iosDevList}
            androiddev={androidDevList}
            callback={reFresh}
          />
          {
            hideHandle.includes(Number(row.android_state)) || hideHandle.includes(Number(row.ios_state))
              ? null : <Del key={`${row.id}del`} id={row.id} callback={reFresh} />
          }
        </div>
      ),
    },
  ];
  const TableProps = {
    columns,
    loading: listLoading,
    pagination: { showSizeChanger: true },
    scroll: { x: 1800 },
    dataSource: searchEventName ? listData.filter(item => `${item.event_id}-${item.event_name}-${item.id}` === searchEventName) : listData,
    rowKey: 'id',
  };
  return (<Table {...TableProps} style={{ marginTop: '15px' }} />);
};

export default List;
