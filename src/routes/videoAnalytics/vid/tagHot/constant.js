export const columns = [
  {
    title: '标签名',
    dataIndex: 'tag_name',
  },
  {
    title: 'day',
    dataIndex: 'day',
  }, {
    title: '标签视频总数',
    dataIndex: 'tag_puid_all_total',
  }, {
    title: '新增标签视频数',
    dataIndex: 'tag_puid_total',
  }, {
    title: '标签视频占比(%)',
    dataIndex: 'tag_puid_all_total*100/puid_all_total',
  }, {
    title: '新增视频占比(%)',
    dataIndex: 'tag_puid_total*100／puid_total',
  }, {
    title: '曝光视频数',
    dataIndex: 'exposure_puid_total',
  }, {
    title: '总曝光',
    dataIndex: 'exposure_count',
  }, {
    title: '总播放',
    dataIndex: 'play_count',
  }, {
    title: '下载',
    dataIndex: 'download_count',
  }, {
    title: '点赞',
    dataIndex: 'like_count',
  }, {
    title: '转发',
    dataIndex: 'forward_count',
  }, {
    title: 'ptr(%)',
    dataIndex: 'ptr',
    render: text => `${text}%`,
  }, {
    title: 'dtr(%)',
    dataIndex: 'dtr',
    render: text => `${text}%`,
  }, {
    title: '有效播放人数',
    dataIndex: 'play_3s_uv',
  }, {
    title: '人均有效播放',
    dataIndex: 'play_count／play_3s_uv',
  }, {
    title: '曝光人数',
    dataIndex: 'exposure_uv',
  }, {
    title: '人均曝光',
    dataIndex: 'exposure_count／exposure_uv',
  }];
