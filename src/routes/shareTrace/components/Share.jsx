import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import MyDatePicker from '../../components/MyDatePicker';
import { DownLoadButton } from '../../common/DownLoadButton';
import {
  shareLinkColumns, shareLinkSQL, shareDetailSQL, shareDetailColumns,
} from './sqlTemplate';
import { getData } from '../../../utils/request';
import styles from '../styles/index.less';

export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [dataList, setDataList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataType, setDataType] = useState('type'); // type||template

  const getDataList = async () => {
    const where = ` where ds>=${startDate.format('YYYYMMDD')} and ds<=${endDate.format('YYYYMMDD')}`;
    const res = await getData(shareLinkSQL.replace('?', where));
    setDataType('type');
    setColumns(shareLinkColumns);
    setDataList(res);
  };

  const sorter = () => function sort(a, b) {
    // eslint-disable-next-line react/no-this-in-sfc
    return a[this.key] - b[this.key];
  };

  const getDetailList = async (shareType) => {
    const where = ` where template_id is not null and ds>=${startDate.format('YYYYMMDD')} and ds<=${endDate.format(
      'YYYYMMDD',
    )} and share_type='${shareType}'`;
    const res = await getData(shareDetailSQL.replace(/\?/g, where));
    setDataType('template');
    setColumns(shareDetailColumns.map(v => ({ ...v, sorter: sorter() })));
    setDataList(res);
  };

  const shareClick = record => async function detail() {
    if (record) {
      getDetailList(record.share_type);
    }
  };

  const goBack = () => {
    setDataType('type');
    getDataList();
  };

  shareLinkColumns[0].render = (text, record) => (text && text.indexOf('emplate') > -1 ? <a onClick={shareClick(record)}>{text}</a> : text);

  useEffect(() => {
    getDataList();
  }, [startDate, endDate]);

  return (
    <div className={styles.content}>
      <div className={styles.headerWrapper}>
        {dataType === 'type' ? (
          <strong>分享链接追踪</strong>
        ) : (
          <Fragment>
            <span onClick={goBack}>
              <a style={{ fontWeight: 500, fontSize: 18, cursor: 'pointer' }}>&lt;</a>&nbsp;模板分享详情
            </span>
          </Fragment>
        )}
        <div className={styles.operator}>
          <MyDatePicker
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
            }}
          />
          <DownLoadButton filename="用户分享数据" columns={columns} data={dataList} />
        </div>
      </div>
      <Table columns={columns} dataSource={dataList} bordered pagination={{ hideOnSinglePage: true }} />
    </div>
  );
};
