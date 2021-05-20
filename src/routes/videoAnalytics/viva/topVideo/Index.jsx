/* eslint-disable no-await-in-loop */
import React from 'react';
import PageIndexWithIsSpider from '../../../common/PageIndexWithIsSpider';
import { listSQL } from './sqlTemplate';

export default () => {
  const columns = [
    {
      title: '视频标识',
      dataIndex: 'puiddigest',
      render: (text, row) => <a href={`https://xiaoying.tv/v/${text}/${row.ver}`} target="_blank">{text}</a>,
    }, {
      title: '用户昵称',
      dataIndex: 'username',
    }, {
      title: '是否为爬取视频',
      dataIndex: 'is_spider',
    }, {
      title: '站内播放总数',
      dataIndex: 'play_in_total',
    }, {
      title: '站外播放总数',
      dataIndex: 'play_out_total',
    }, {
      title: '播放总数',
      dataIndex: 'play_count_total',
    }, {
      title: '评论总数',
      dataIndex: 'comment_count_total',
    }, {
      title: '转发总数',
      dataIndex: 'forward_count_total',
    }, {
      title: '喜欢总数',
      dataIndex: 'like_count_total',
    },
  ];


  return <div>
    <PageIndexWithIsSpider
      columns={columns}
      rowKey="puiddigest"
      getName
      initOrder="play_count_total"
      initSQL={listSQL}
      orderList={[
        { key: 'play_in_total', label: '站内播放总数' },
        { key: 'play_out_total', label: '站外播放总数' },
        { key: 'play_count_total', label: '播放总数' },
        { key: 'comment_count_total', label: '评论总数' },
        { key: 'forward_count_total', label: '转发总数' },
        { key: 'like_count_total', label: '喜欢总数' },
      ]}
    />
  </div>;
};
