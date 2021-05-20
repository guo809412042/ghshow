/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-04-29 17:55:44
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React from 'react';
import { Table } from 'antd';
import Del from './Del';

//  以下两种状态不显示编辑和删除
const List = ({
  listData,
  listLoading,
  reFresh,
}) => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '平台',
      dataIndex: 'platform',
      render: text => (
        text === 1 ? '安卓' : 'iOS'
      ),
    },
    {
      title: '操作',
      dataIndex: 'handle',
      width: 200,
      fixed: 'right',
      render: (text, row) => (
        <div>
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
