import React, { useState } from 'react';
import moment from 'moment';
import { listSQL } from './sqlTemplate';
import DetailView from './DetailView';
import PageIndexWithoutSelect from '../../../common/PageIndexWithoutSelect';
import PtrChart from './PtrChart';

export default () => {
  const [startDate] = useState(moment().subtract(1, 'days'));
  const [endDate] = useState(moment().subtract(1, 'days'));
  const columns = [{
    title: '播放总数',
    dataIndex: 'play_puid_total',
  }, {
    title: '有效播放总数',
    dataIndex: 'play_puid_3s',
  }, {
    title: '曝光总数',
    dataIndex: 'exposure_puid_total',
  }, {
    title: '播放人数',
    dataIndex: 'play_uv_total',
  }, {
    title: '播放人数(>3s)',
    dataIndex: 'play_uv_3s',
  }, {
    title: '曝光人数',
    dataIndex: 'exposure_uv_total',
  }, {
    title: 'ptr(%)',
    dataIndex: 'ptr',
  }, {
    title: 'ptr(%)(>3s)',
    dataIndex: 'ptr>3s',
  }, {
    title: '灰度版本',
    dataIndex: 'ab_version',
  },
  {
    title: '详情',
    dataIndex: 'action',
    render: (text, row) => <DetailView
      row={row}
      startDate={startDate}
      endDate={endDate}
    />,
  },
  ];
  return <div>
    <PageIndexWithoutSelect
      rowKey="video_trace"
      columns={columns}
      listSQL={listSQL}
      search={{
        startDate, endDate,
      }}
      calculateData={[
        {
          key: 'ptr', value: ['play_puid_total', 'exposure_puid_total'], suffix: true,
        },
        {
          key: 'ptr>3s', value: ['play_puid_3s', 'exposure_puid_total'], suffix: true,
        },
      ]}
    />
    <PtrChart/>
  </div>;
};
