import React from 'react';
import Index from './Index';

export default (props) => {
  const { product } = props.match.params;
  return <Index product={product} />;
};
