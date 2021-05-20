import React from 'react';
import View from './View';

export default props => {
  const { product } = props.match.params;

  return <View product={product} />;
};
