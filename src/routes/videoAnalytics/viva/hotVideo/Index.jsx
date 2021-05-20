/* eslint-disable no-await-in-loop */
import React from 'react';
import PageIndexWithIsSpider from '../../../common/PageIndexWithIsSpider';
import { listSQL } from './sqlTemplate';

export default () => {
  const columns = [{
    title: '视频编码',
    dataIndex: 'puiddigest',
    render: (text, row) => <a href={`https://xiaoying.tv/v/${text}/${row.ver}`} target="_blank">{text}</a>,
  }, {
    title: '是否为爬取视频',
    dataIndex: 'is_spider',
  }, {
    title: '播放人数',
    dataIndex: 'play_uv',
  }, {
    title: '站内播放总数',
    dataIndex: 'play_in',
  }, {
    title: '站外播放总数',
    dataIndex: 'play_out',
  }, {
    title: '点赞人数',
    dataIndex: 'like_uv',
  }, {
    title: '评论人数',
    dataIndex: 'comment_uv',
  }, {
    title: '曝光总数',
    dataIndex: 'exposure_count',
  }, {
    title: '曝光人数',
    dataIndex: 'exposure_uv',
  }, {
    title: '热门模块播放人数',
    dataIndex: 'play_hot_uv',
  }, {
    title: '视频下载次数',
    dataIndex: 'video_download_count',
  }, {
    title: '曝光播放占比',
    dataIndex: 'ptr',
    sorter: (a, b) => parseFloat(a.ptr) - parseFloat(b.ptr),
  }];


  return <div>
    <PageIndexWithIsSpider
      columns={columns}
      rowKey="puiddigest"
      getName={false}
      initOrder="play_in"
      initSQL={listSQL}
      orderList={[
        { key: 'play_in', label: '站内播放总数' },
        { key: 'play_uv', label: '播放人数' },
        { key: 'like_uv', label: '点赞人数' },
        { key: 'comment_uv', label: '评论人数' },
        { key: 'exposure_count', label: '曝光总数' },
        { key: 'exposure_uv', label: '曝光人数' },
        { key: 'play_hot_uv', label: '热门模块播放人数' },
        { key: 'video_download_count', label: '视频下载次数' },
      ]}
    />
  </div>;
};
