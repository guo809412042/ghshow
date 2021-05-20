/*
 * @Date: 2021-03-11 15:21:46
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-03-31 10:16:00
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React from 'react';
import EventView from './components/EventView';
import EventTaskView from './components/EventTaskView';

const ProductIdList = {
  gocut: 43,
  facee: 35,
  glitchfx: 36,
  vmix: 18,
  vivamini: 16,
  sp: 3,
  tempo: 10,
  veffecto: 39,
  storybuff: 41,
  vivacut: 15,
  picsfox: 33,
  mast: 42,
  multirecorder: 51,
  vivavideoindia: 44,
  beatstarr: 50,
};
export default (props) => {
  const { product, selectAppVersion, eventIdList } = props;
  const CONFIG = {
    sp: {
      database: 'holo_slid_log_event_count',
      keyDatabase: 'holo_slid_log_event_key_count',
      noAuidTotal: true,
    },
    vivamini: {
      keyDatabase: 'holo_vivmini_log_event_key_count',
      eventNameCN: true,
    },
    vivacut: {
      noAuidTotal: true,
      productName: 'platform',
      appVersionApi: true,
      channelName: 'media_source',
    },
    viva: {
      eventNameCN: true,
    },
    tempo: {
      noAuidTotal: true,
      productName: 'platfrom',
      channelName: 'media_source',
      database: 'holo_tempo_log_event_count_view',
      keyDatabase: 'holo_tempo_log_event_key_count_view',
    },
    facee: {
      noAuidTotal: true,
      productName: 'platform',
      defaultProduct: '2',
    },
    picsfox: {
      noAuidTotal: true,
      productName: 'platform',
      defaultProduct: '2',
    },
  };
  const defaultCOnfig = {
    title: `${product}自定义`,
    ghPlatform: ProductIdList[product],
    database: `holo_${product}_log_event_count`,
    keyDatabase: `holo_${product}_log_event_key_count`,
    selectAppVersion,
  };

  const params = CONFIG[product]
    ? {
      ...defaultCOnfig,
      ...CONFIG[product],
    }
    : {
      ...defaultCOnfig,
      noAuidTotal: true,
      productName: 'platform',
    };

  if (eventIdList) {
    return <EventTaskView {...params} eventIdList={eventIdList} />;
  }
  return <EventView {...params} />;
};
