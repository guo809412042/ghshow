/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-06 11:26:00
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React from 'react';
import { Tag } from 'antd';
import EventParams from './EventParamsShowAll';

import {
  defaultProduct,
} from '../const';

const jump = (row) => {
  if (Number(row.product) !== Number(defaultProduct)) {
    return false;
  }
  const dict = {
    2: 'viva',
  };
  const url = `//vcm.quvideo.vip/page?p=1110&pt=1110&g=9#/gh/event/${dict[Number(row.product)]}`;
  window.location.href = url;
};
const baseColumns = [
  {
    title: '事件名称',
    dataIndex: 'event_name',
    width: 200,
  },
  {
    title: '事件id',
    dataIndex: 'event_id',
    width: 200,
  },
  {
    title: '事件参数',
    dataIndex: 'event_params',
    width: 200,
    render: (value, row) => <EventParams eventParamStr={value} content={row}/>,
  },
  // {
  //   title: '更新说明',
  //   dataIndex: 'remark',
  //   width: 150,
  // },
  {
    title: '业务描述',
    dataIndex: 'remark_desc',
    width: 150,
  },
  // {
  //   title: '分类',
  //   dataIndex: 'class_name',
  //   width: 200,
  // },
  // {
  //   title: '模块',
  //   dataIndex: 'module_name',
  //   width: 200,
  // },
  {
    title: '标签',
    dataIndex: 'tag',
    width: 200,
  },
  {
    title: '平台',
    dataIndex: 'platform',
    width: 160,
    render: (text, row) => text.split('/').map(item => (
      <Tag
        key={item}
        color={item === 'iOS' ? '#2db7f5' : '#108ee9'}
        onClick={() => jump(row)}
      >
        {item}
      </Tag>
    )),
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    width: 160,
  },
];

export {
  baseColumns,
};
