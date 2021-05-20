/* eslint-disable react/prop-types */
import React from 'react';
import UserActiveIndex from './userActive/Index';
import UserRetainIndex from './userRetain/Index';
import Retained from './vid/retained';

export default ({ product }) => (
  <div>
    <UserActiveIndex product={product} />
    <UserRetainIndex product={product} />
    {['vid', 'mast'].includes(product) ? <Retained product={product} /> : ''}
  </div>
);
