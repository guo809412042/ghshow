/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-04-23 14:27:07
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React from 'react';
import { Table } from 'antd';
import Edit from './Edit';
import Del from './Del';
import {
  TYPEMAP,
} from '../const';

//  以下两种状态不显示编辑和删除
const List = ({
  listData,
  listLoading,
  reFresh,
}) => {
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: text => TYPEMAP[text],
    },
    {
      title: '英文名称',
      dataIndex: 'module_key',
    },
    {
      title: '中文名称',
      dataIndex: 'module_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '操作',
      dataIndex: 'handle',
      width: 200,
      fixed: 'right',
      render: (text, row) => (
        <div>
          <Edit
            key={`${row.id}DevState`}
            content={row}
            callback={reFresh}
          />
          <Del key={`${row.id}del`} id={row.id} callback={reFresh} />
        </div>
      ),
    },
  ];
  const TableProps = {
    columns,
    loading: listLoading,
    pagination: { showSizeChanger: true },
    scroll: { x: 1800 },
    dataSource: listData,
    rowKey: 'id',
  };
  return (<Table {...TableProps} style={{ marginTop: '15px' }} />);
};

export default List;
