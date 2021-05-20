/*
 * @Author: tab
 * @Date: 2020-07-08 16:31:46
 * @Last Modified by:   tab
 * @Last Modified time: 2020-07-08 16:31:46
 */

export const MEDIA_SOURCE_VID = {
  pId: null,
  value: 'media_source',
  text: 'media_source',
  cId: 'CAMPAIGN_VID',
  id: 'MEDIA_SOURCE_VID',
};
export const CAMPAIGN_VID = {
  pId: 'MEDIA_SOURCE_VID',
  value: 'campaign_name',
  text: 'campaign_name',
  cId: 'ADSET_VID',
  id: 'CAMPAIGN_VID',
};
export const ADSET_VID = {
  pId: 'CAMPAIGN_VID',
  value: 'adset',
  text: 'adset',
  cId: 'ADNAME',
  id: 'ADSET_VID',
};
export const MEDIA_SOURCE = {
  pId: null,
  value: 'media_source',
  text: 'media_source',
  cId: 'CAMPAIGN',
};
export const CAMPAIGN = {
  pId: 'MEDIA_SOURCE',
  value: 'campaign',
  text: 'campaign',
  cId: 'ADSET',
};
// export const CHANNEL = {
//   pId: 'CAMPAIGN',
//   value: 'channel',
//   text: 'channel',
//   cId: 'ADSET',
// }
export const ADSET = {
  pId: 'CAMPAIGN',
  value: 'adset',
  text: 'adset',
  cId: 'ADNAME',
};

export const ADNAME = {
  pId: 'ADSET',
  value: 'adname',
  text: 'adname',
  cId: null,
};

export const KEYS = {
  MEDIA_SOURCE,
  CAMPAIGN,
  // CHANNEL,
  ADSET,
  ADNAME,
};
export const KEYS_VID = {
  MEDIA_SOURCE_VID,
  CAMPAIGN_VID,
  ADSET_VID,
  ADNAME,
};

export const tagColors = [
  'magenta', 'red', 'volcano', 'orange', 'gold',
];
