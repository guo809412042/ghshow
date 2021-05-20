import React from 'react';
import { Tooltip, Icon } from 'antd';
import { ANNOTATION } from '../../utils/const';

export const columns = [
  { dataIndex: 'ttid', title: 'ttid', key: 'ttid' },
  {
    dataIndex: 'exps_usr_cnt',
    title: '曝光人数',
    key: 'exps_usr_cnt',
    sorter: (a, b) => a.exps_usr_cnt - b.exps_usr_cnt,
  },
  {
    dataIndex: 'clik_usr_cnt',
    title: '封面点击人数',
    key: 'clik_usr_cnt',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.clik_usr_cnt - b.clik_usr_cnt,
  },
  {
    dataIndex: 'enter_usr_cnt',
    title: '剪辑页进入人数',
    key: 'enter_usr_cnt',
    sorter: (a, b) => a.enter_usr_cnt - b.enter_usr_cnt,
  },
  {
    dataIndex: 'expr_usr_cnt',
    title: '导出人数',
    key: 'expr_usr_cnt',
    sorter: (a, b) => a.expr_usr_cnt - b.expr_usr_cnt,
  },
  {
    dataIndex: 'save_usr_cnt',
    title: '保存人数',
    key: 'save_usr_cnt',
    sorter: (a, b) => a.save_usr_cnt - b.save_usr_cnt,
  },
  {
    dataIndex: 'shared_usr_cnt',
    title: '分享人数',
    key: 'shared_usr_cnt',
    sorter: (a, b) => a.shared_usr_cnt - b.shared_usr_cnt,
  },
  {
    dataIndex: 'enterUsrCnt',
    title: (
      <div>
        模版进入率
        <Tooltip title={ANNOTATION['模版进入率'] || '进入剪辑页的用户数/有模版曝光的用户数'}>
          <Icon type="question-circle" />
        </Tooltip>
      </div>
    ),
    key: 'enterUsrCnt',
    sorter: (a, b) => a.enterUsrCnt - b.enterUsrCnt,
    render: text => `${text}%`,
  },
  {
    dataIndex: 'saveUsrCnt',
    title: (
      <div>
        模版完成率
        <Tooltip title={ANNOTATION['模版完成率'] || '导出人数/剪辑页进入人数'}>
          <Icon type="question-circle" />
        </Tooltip>
      </div>
    ),
    key: 'saveUsrCnt',
    sorter: (a, b) => a.saveUsrCnt - b.saveUsrCnt,
    render: text => `${text}%`,
  },
  {
    dataIndex: 'shareUsrCnt',
    title: (
      <div>
        模版分享率
        <Tooltip title={ANNOTATION['模版分享率'] || '分享人数/导出人数'}>
          <Icon type="question-circle" />
        </Tooltip>
      </div>
    ),
    key: 'shareUsrCnt',
    sorter: (a, b) => a.shareUsrCnt - b.shareUsrCnt,
    render: text => `${text}%`,
  },
];
export const exportColumns = [
  { dataIndex: 'ttid', title: 'ttid', key: 'ttid' },
  {
    dataIndex: 'exps_usr_cnt',
    title: '曝光人数',
    key: 'exps_usr_cnt',
    sorter: (a, b) => a.exps_usr_cnt - b.exps_usr_cnt,
  },
  {
    dataIndex: 'clik_usr_cnt',
    title: '封面点击人数',
    key: 'clik_usr_cnt',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.clik_usr_cnt - b.clik_usr_cnt,
  },
  {
    dataIndex: 'enter_usr_cnt',
    title: '剪辑页进入人数',
    key: 'enter_usr_cnt',
    sorter: (a, b) => a.enter_usr_cnt - b.enter_usr_cnt,
  },
  {
    dataIndex: 'expr_usr_cnt',
    title: '导出人数',
    key: 'expr_usr_cnt',
    sorter: (a, b) => a.expr_usr_cnt - b.expr_usr_cnt,
  },
  {
    dataIndex: 'save_usr_cnt',
    title: '保存人数',
    key: 'save_usr_cnt',
    sorter: (a, b) => a.save_usr_cnt - b.save_usr_cnt,
  },
  {
    dataIndex: 'shared_usr_cnt',
    title: '分享人数',
    key: 'shared_usr_cnt',
    sorter: (a, b) => a.shared_usr_cnt - b.shared_usr_cnt,
  },
  {
    dataIndex: 'enterUsrCnt',
    title: '模版进入率',
    key: 'enterUsrCnt',
    sorter: (a, b) => a.enterUsrCnt - b.enterUsrCnt,
    render: text => `${text}%`,
  },
  {
    dataIndex: 'saveUsrCnt',
    title: '模版完成率',
    key: 'saveUsrCnt',
    sorter: (a, b) => a.saveUsrCnt - b.saveUsrCnt,
    render: text => `${text}%`,
  },
  {
    dataIndex: 'shareUsrCnt',
    title: '模版分享率',
    key: 'shareUsrCnt',
    sorter: (a, b) => a.shareUsrCnt - b.shareUsrCnt,
    render: text => `${text}%`,
  },
];
export const shareColumns = [
  { dataIndex: 'ttid', title: 'ttid', key: 'ttid' },
  {
    dataIndex: 'shared_vdo_pv_cnt',
    title: '分享视频次数',
    key: 'shared_vdo_pv_cnt',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.shared_vdo_pv_cnt - b.shared_vdo_pv_cnt,
  },
  {
    dataIndex: 'shared_vdo_uv_cnt',
    title: '分享视频人数',
    key: 'shared_vdo_uv_cnt',
    sorter: (a, b) => a.shared_vdo_uv_cnt - b.shared_vdo_uv_cnt,
  },
  {
    dataIndex: 'shared_wx_pv_cnt',
    title: '分享微信好友次数',
    key: 'shared_wx_pv_cnt',
    sorter: (a, b) => a.shared_wx_pv_cnt - b.shared_wx_pv_cnt,
  },
  {
    dataIndex: 'shared_wx_uv_cnt',
    title: '分享微信好友人数',
    key: 'shared_wx_uv_cnt',
    sorter: (a, b) => a.shared_wx_uv_cnt - b.shared_wx_uv_cnt,
  },
  {
    dataIndex: 'shared_wxp_pv_cnt',
    title: '分享微信朋友圈次数',
    key: 'shared_wxp_pv_cnt',
    sorter: (a, b) => a.shared_wxp_pv_cnt - b.shared_wxp_pv_cnt,
  },
  {
    dataIndex: 'shared_wxp_uv_cnt',
    title: '分享微信朋友圈人数',
    key: 'shared_wxp_uv_cnt',
    sorter: (a, b) => a.shared_wxp_uv_cnt - b.shared_wxp_uv_cnt,
  },
  {
    dataIndex: 'shared_bili_pv_cnt',
    title: '分享B站次数',
    key: 'shared_bili_pv_cnt',
    sorter: (a, b) => a.shared_bili_pv_cnt - b.shared_bili_pv_cnt,
  },
  {
    dataIndex: 'shared_bili_uv_cnt',
    title: '分享B站人数',
    key: 'shared_bili_uv_cnt',
    sorter: (a, b) => a.shared_bili_uv_cnt - b.shared_bili_uv_cnt,
  },
  {
    dataIndex: 'shared_dou_pv_cnt',
    title: '分享抖音次数',
    key: 'shared_dou_pv_cnt',
    sorter: (a, b) => a.shared_dou_pv_cnt - b.shared_dou_pv_cnt,
  },
  {
    dataIndex: 'shared_dou_uv_cnt',
    title: '分享抖音人数',
    key: 'shared_dou_uv_cnt',
    sorter: (a, b) => a.shared_dou_uv_cnt - b.shared_dou_uv_cnt,
  },
  {
    dataIndex: 'shared_other_pv_cnt',
    title: '分享其他次数',
    key: 'shared_other_pv_cnt',
    sorter: (a, b) => a.shared_other_pv_cnt - b.shared_other_pv_cnt,
  },
  {
    dataIndex: 'shared_other_uv_cnt',
    title: '分享其他人数',
    key: 'shared_other_uv_cnt',
    sorter: (a, b) => a.shared_other_uv_cnt - b.shared_other_uv_cnt,
  },
];

export const shareColumnsUS = [
  { dataIndex: 'ttid', title: 'ttid', key: 'ttid' },
  {
    dataIndex: 'shared_vdo_pv_cnt',
    title: '分享视频次数',
    key: 'shared_vdo_pv_cnt',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.shared_vdo_pv_cnt - b.shared_vdo_pv_cnt,
  },
  {
    dataIndex: 'shared_vdo_uv_cnt',
    title: '分享视频人数',
    key: 'shared_vdo_uv_cnt',
    sorter: (a, b) => a.shared_vdo_uv_cnt - b.shared_vdo_uv_cnt,
  },
  {
    dataIndex: 'shared_whatsapp_pv_cnt',
    title: '分享whatsapp次数',
    key: 'shared_whatsapp_pv_cnt',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.shared_whatsapp_pv_cnt - b.shared_whatsapp_pv_cnt,
  },
  {
    dataIndex: 'shared_whatsapp_uv_cnt',
    title: '分享whatsapp人数',
    key: 'shared_whatsapp_uv_cnt',
    sorter: (a, b) => a.shared_whatsapp_uv_cnt - b.shared_whatsapp_uv_cnt,
  },
  {
    dataIndex: 'shared_instagram_pv_cnt',
    title: '分享instagram次数',
    key: 'shared_instagram_pv_cnt',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.shared_instagram_pv_cnt - b.shared_instagram_pv_cnt,
  },
  {
    dataIndex: 'shared_instagram_uv_cnt',
    title: '分享instagram人数',
    key: 'shared_instagram_uv_cnt',
    sorter: (a, b) => a.shared_instagram_uv_cnt - b.shared_instagram_uv_cnt,
  },
  {
    dataIndex: 'shared_facebook_pv_cnt',
    title: '分享facebook次数',
    key: 'shared_facebook_pv_cnt',
    sorter: (a, b) => a.shared_facebook_pv_cnt - b.shared_facebook_pv_cnt,
  },
  {
    dataIndex: 'shared_facebook_uv_cnt',
    title: '分享facebook人数',
    key: 'shared_facebook_uv_cnt',
    sorter: (a, b) => a.shared_facebook_uv_cnt - b.shared_facebook_uv_cnt,
  },
  {
    dataIndex: 'shared_tiktok_pv_cnt',
    title: '分享tiktok次数',
    key: 'shared_tiktok_pv_cnt',
    sorter: (a, b) => a.shared_tiktok_pv_cnt - b.shared_tiktok_pv_cnt,
  },
  {
    dataIndex: 'shared_tiktok_uv_cnt',
    title: '分享tiktok人数',
    key: 'shared_tiktok_uv_cnt',
    sorter: (a, b) => a.shared_tiktok_uv_cnt - b.shared_tiktok_uv_cnt,
  },
];
