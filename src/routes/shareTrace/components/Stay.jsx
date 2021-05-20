import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Select } from 'antd';
import { DownLoadButton } from '../../common/DownLoadButton';
import { userStayColumns, userStaySQL } from './sqlTemplate';
import { getData } from '../../../utils/request';
import styles from '../styles/index.less';
import { groupSignal } from '../../business/trialConvertion/utils';
import MyDatePicker from '../../components/MyDatePicker';

export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(8, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [shareType, setShareType] = useState('ALL');
  const [dataList, setDataList] = useState([]);

  const getDataList = async () => {
    let where = ` where day>=${startDate.format('YYYYMMDD')} and day<=${endDate.format('YYYYMMDD')}`;
    if (shareType) {
      where += ` and share_type='${shareType}'`;
      if (shareType === 'ALL') {
        where += ' and media_source=\'ALL\'';
      }
    }
    const res = await getData(userStaySQL.replace('?', where));

    const groupby = groupSignal(res, 'day');
    const list = Object.keys(groupby).map((key) => {
      const item = {
        day: key,
      };
      groupby[key].forEach((v) => {
        item[`day${v.stay_seq}`] = v.stay_ratio;
      });
      return item;
    });
    list.sort((a, b) => b.day - a.day);
    setDataList(list);
  };

  useEffect(() => {
    getDataList();
  }, [startDate, endDate, shareType]);

  return (
    <div className={styles.content}>
      <div className={styles.headerWrapper}>
        <strong>留存分析</strong>
        <div className={styles.operator}>
          类型：
          <Select value={shareType} onChange={setShareType} style={{ width: 120 }}>
            <Select.Option key="all" value="ALL">
              all
            </Select.Option>
            <Select.Option key="organic" value="organic">
              organic
            </Select.Option>
            <Select.Option key="videoPage" value="videoPage">
              videoPage
            </Select.Option>
            <Select.Option key="templateShare" value="templateShare">
              templateShare
            </Select.Option>
            <Select.Option key="localTemplateVideo" value="localTemplateVideo">
              localTemplateVideo
            </Select.Option>
          </Select>
          <MyDatePicker
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
            }}
          />
          <DownLoadButton filename="用户留存数据" columns={userStayColumns} data={dataList} />
        </div>
      </div>
      <Table columns={userStayColumns} dataSource={dataList} bordered pagination={{ hideOnSinglePage: true }} />
    </div>
  );
};
