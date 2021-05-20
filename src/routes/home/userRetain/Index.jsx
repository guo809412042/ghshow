import React from 'react';
import styles from '../../../styles/index.less';
import RetainView from './components/RetainView';
import RetainViewVid from './components/RetainViewVid';

export default ({ product }) => (
  <div>
    <p className={styles.homeTitle}>用户留存</p>
    {product === 'vid' ? <RetainViewVid /> : <RetainView product={product} />}
  </div>
);
