import React from 'react';
import VivaIndex from './viva/Index';
import VidIndex from './vid/Index';
import VivacutIndex from './vivacut/Index';
import MastIndex from './mast/index';
import View from './View';

export default (props) => {
  const { product } = props.match.params;
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
    picsfox: 33,
    mast: 42,
    beatstarr: 50,
    vivavideoindia: 44,
    multirecorder: 51,
  };

  if (product === 'viva') {
    return <VivaIndex />;
  }

  if (product === 'vid') {
    return <VidIndex />;
  }

  if (product === 'vivacut') {
    return <VivacutIndex />;
  }
  if (product === 'mast') {
    return <MastIndex/>;
  }
  return <View product={product} productId={ProductIdList[product]} />;
};
