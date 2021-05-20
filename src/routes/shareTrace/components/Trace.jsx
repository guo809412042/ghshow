import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Select } from 'antd';
import MyDatePicker from '../../components/MyDatePicker';
import { DownLoadButton } from '../../common/DownLoadButton';
import {
  traceNumberSQL, traceNumberColumns, tracePercentSQL, tracePercentColumns,
} from './sqlTemplate';
import { getData } from '../../../utils/request';
import styles from '../styles/index.less';

export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [dataList, setDataList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataType, setDataType] = useState('value'); // value||percent

  const getDataList = async () => {
    const where = ` where media_source='ALL' AND campaign='ALL' and is_new_dvc='Y' AND ds>=${startDate.format(
      'YYYYMMDD',
    )} and ds<=${endDate.format('YYYYMMDD')}`;
    const res = await getData(traceNumberSQL.replace('?', where));
    setColumns(traceNumberColumns);
    res.sort((a, b) => {
      if (a.share_type.indexOf('ALL') > -1) {
        return -1;
      }
      if (b.share_type.indexOf('ALL') > -1) {
        return 1;
      }
      return b.uv - a.uv;
    });
    setDataList(res);
  };

  const getPercentList = async () => {
    const where = ` where media_source='ALL' AND campaign='ALL' and is_new_dvc='Y' AND ds>=${startDate.format(
      'YYYYMMDD',
    )} and ds<=${endDate.format('YYYYMMDD')}`;
    const res = await getData(tracePercentSQL.replace('?', where));
    setColumns(tracePercentColumns);
    res.sort((a, b) => {
      if (a.share_type.indexOf('ALL') > -1) {
        return -1;
      }
      if (b.share_type.indexOf('ALL') > -1) {
        return 1;
      }
      return b.uv - a.uv;
    });
    setDataList(res);
  };

  useEffect(() => {
    if (dataType === 'value') {
      getDataList();
    } else {
      getPercentList();
    }
  }, [startDate, endDate, dataType]);

  return (
    <div className={styles.content}>
      <div className={styles.headerWrapper}>
        <strong>新用户当日行为分析</strong>
        <div className={styles.operator}>
          <Select value={dataType} onChange={setDataType}>
            <Select.Option key="value" value="value">
              显示绝对值
            </Select.Option>
            <Select.Option key="percent" value="percent">
              显示占比
            </Select.Option>
          </Select>
          <MyDatePicker
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
            }}
          />
          <DownLoadButton filename="用户行为追踪数据" columns={columns} data={dataList} />
        </div>
      </div>
      <Table columns={columns} dataSource={dataList} bordered pagination={{ hideOnSinglePage: true }} />
    </div>
  );
};
