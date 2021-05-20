import React from 'react';
import View from './View';

export default props => {
  return <View product={props.match.params.product} />;
};
