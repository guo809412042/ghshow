/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import Com from './Components';

const CONFIG = {
  sp: {
    product: 'slid',
    product_id: 3,
    database: 'holo_slid_log_event_count',
  },
  vivamini: {
    product: 'vivamini',
    product_id: 16,
    database: 'holo_vivamini_log_event_count',
  },
  vivacut: {
    product: 'vivacut',
    product_id: 15,
    database: 'holo_vivacut_log_event_count',
    productName: 'platform',
  },
  viva: {
    product: 'viva',
    product_id: 2,
    database: 'holo_viva_log_event_count',
  },
  vid: {
    product: 'vid',
    product_id: 6,
    database: '',
    productName: 'platform',
  },
  tempo: {
    product: 'tempo',
    product_id: 10,
    database: 'holo_tempo_log_event_count',
    keyDatabase: 'holo_tempo_log_event_key_count_view',
    productName: 'platfrom',
  },
  picsfox: {
    product: 'picsfox',
    product_id: 33,
    database: 'holo_picsfox_log_event_count',
    productName: 'platform',
  },
  facee: {
    product: 'facee',
    product_id: 35,
    database: 'holo_facee_log_event_count',
    productName: 'platform',
  },
  glitchfx: {
    product: 'glitchfx',
    product_id: 36,
    database: 'holo_glitchfx_log_event_count',
    productName: 'platform',
  },
  vmix: {
    product: 'vmix',
    product_id: 18,
    database: 'holo_vmix_log_event_count',
    productName: 'platform',
  },
  gocut: {
    product: 'gocut',
    product_id: 43,
    database: 'holo_gocut_log_event_count',
    productName: 'platform',
  },
  veffecto: {
    product: 'veffecto',
    product_id: 39,
    database: 'holo_veffecto_log_event_count',
    productName: 'platform',
  },
  storybuff: {
    product: 'storybuff',
    product_id: 41,
    database: 'holo_storybuff_log_event_count',
    productName: 'platform',
  },
  mast: {
    product: 'mast',
    product_id: 42,
    database: 'holo_mast_log_event_count',
    productName: 'platform',
  },
  beatstarr: {
    product: 'beatstarr',
    product_id: 50,
    database: 'holo_beatstarr_log_event_count',
    productName: 'platform',
  },
  vivavideoindia: {
    product: 'vivavideoindia',
    product_id: 44,
    database: 'holo_vivavideoindia_log_event_count',
    productName: 'platform',
  },
  multirecorder: {
    product: 'multirecorder',
    product_id: 51,
    database: 'holo_multirecorder_log_event_count',
    productName: 'platform',
  },
};
// const ProductIdList = {
//   gocut: 43,
//   facee: 35,
//   glitchfx: 36,
//   vmix: 18,
//   vivamini: 16,
//   sp: 3,
//   tempo: 10,
//   veffecto: 39,
//   storybuff: 41,
// };

export default props => <Com {...CONFIG[props.match.params.product]} funnelType={props.match.params.funnelType || 1} history={props.history} />;
