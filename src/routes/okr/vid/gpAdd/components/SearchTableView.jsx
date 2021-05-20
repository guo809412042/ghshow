/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/5/28
 * Time: 上午11:35
 *
 */
import React, { useState, useEffect } from 'react';
import { DatePicker, Table } from 'antd';
import moment from 'moment';
import { createSqlWhere } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { DownLoadButton } from '../../../../common/DownLoadButton';


const sqlTemplate = `select  sum(#molecular#) as #molecular#
,ds,key_word
from    #database#
where   #day# >= #startDate#
and     #day# <= #endDate#
#otherWhere#
group by #day#,key_word
order by #day#,sum(#molecular#) desc
limit   10000
;
`;


const { RangePicker } = DatePicker;
export default ({
  title, molecular, visible, database, otherWhere, day,
}) => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const getChartData = async () => {
    setLoading(true);
    const sql = createSqlWhere({
      sql: sqlTemplate,
      startDate,
      endDate,
      molecular,
      database,
      day,
      otherWhere,
    });
    const res = await getData(sql);
    const data = [];
    if (res.length) {
      res.forEach((v) => {
        data.push({
          day: moment(v.ds.toString()).format('YYYY-MM-DD'),
          value: v[molecular],
          key_word: v.key_word,
        });
      });
    }
    setDataSource(data);
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      getChartData();
    }
  }, [startDate, endDate]);
  const columns = [
    {
      title: '日期',
      dataIndex: 'day',
      key: 'day',
    },
    {
      title: '关键词',
      dataIndex: 'key_word',
      key: 'key_word',
    },
    {
      title: '首次安装人数',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
    },
  ];
  const tableOpts = {
    style: { backgroundColor: '#fff', marginTop: '10px' },
    loading,
    pagination: true,
    columns,
    dataSource,
  };
  return <div>
    <RangePicker
      value={[startDate, endDate]}
      onChange={(value) => {
        setEndDate(value[1]);
        setStartDate(value[0]);
      }}
    />
    <DownLoadButton
      filename={title}
      data={dataSource}
      columns={[
        { key: 'day', title: '日期' },
        { key: 'key_word', title: '关键字' },
        { key: 'value', title: '首次安装人数' },
      ]}
    />
    <Table {...tableOpts} />
  </div>;
};
