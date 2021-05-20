/* eslint-disable react/prop-types */
import React from 'react';
import { Row } from 'antd';
import styles from '../../../styles/index.less';
import { DownLoadButton } from '../../common/DownLoadButton';

const CardBox = ({
  title, children, extra, dataSource, columns, exportButton,
}) => (
  <Row className={styles.homeCard}>
    {title && (
      <div className={styles.homeCardHeader}>
        {title}
        {extra || ''}
        {exportButton ? (
          <div style={{ display: 'inline-block', float: 'right' }}>
            <DownLoadButton filename={title} columns={columns} data={dataSource} buttonText={false} />
          </div>
        ) : (
          ''
        )}
      </div>
    )}
    <Row className={styles.homeCardBody}>{children}</Row>
  </Row>
);

export default CardBox;
