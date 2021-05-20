import React, { useState } from 'react';
import moment from 'moment';
import { VIDEOTRACE } from '../../../../utils/enum';
import { listSQL } from './sqlTemplate';
import DetailView from './DetailView';
import PageIndexWithoutSelect from '../../../common/PageIndexWithoutSelect';

export default () => {
  const [startDate] = useState(moment().subtract(1, 'days'));
  const [endDate] = useState(moment().subtract(1, 'days'));
  const columns = [{
    title: '视频总数',
    dataIndex: 'puid_cnt',
  }, {
    title: '视频状态',
    dataIndex: 'state',
  }, {
    title: '视频来源',
    dataIndex: 'video_trace',
    render: text => <span>{VIDEOTRACE[text] || text}</span>,
  }, {
    title: '详情',
    dataIndex: 'action',
    render: (text, row) => <DetailView
      row={row}
      search={{
        startDate, endDate,
      }}
    />,
  }];
  return <div>
    <PageIndexWithoutSelect
      rowKey="video_trace"
      columns={columns}
      listSQL={listSQL}
      search={{
        startDate, endDate,
      }}
    />
  </div>;
};
