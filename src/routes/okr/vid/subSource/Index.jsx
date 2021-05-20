/*
 * @Author: zhoutao
 * @Date: 2020-10-09 17:11:11
 * @Copyright(c) QuVideo F2E Team
 * @Email: tao.zhou@quvideo.com
 */
import * as React from 'react';
import moment from 'moment';
import { pieChartRender } from './components/chartRender';
import QueryIndex from './components/QueryIndex';
import { getPchsSQL } from './components/sqlTemplate';
import { getData } from '../../../../utils/request';
import { createSqlWhere } from '../../../../utils/utils';
import { DownLoadButton } from '../../../common/DownLoadButton';

const { useState, useEffect } = React;

export default (() => {
  const [search, setSearch] = useState({
    where: '',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
  });

  const [dataSource, setDataSource] = useState([]);
  const onSearch = (value) => {
    setSearch(value);
  };

  const getFetchData = async () => {
    const arrFlat = Object.create(null);
    const sql = createSqlWhere({
      sql: getPchsSQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where: search.where,
    });
    const res = await getData(sql);
    res.forEach((x) => {
      arrFlat[x.type] = x.value;
    });
    setDataSource([arrFlat]);
    pieChartRender(
      res,
      'pipeChart',
    );
  };


  useEffect(() => {
    getFetchData();
  }, [search]);
  return (
    <div>
      <QueryIndex
        onSearch={onSearch}
      />
      <div style={{ height: '20px' }}/>
      <DownLoadButton
        filename="订阅来源"
        data={dataSource}
        columns={Object.entries(dataSource.length ? dataSource[0] : []).map(x => ({ title: x[0], dataIndex: x[0], key: x[0] }))}
      />
      <div id="pipeChart"/>
    </div>
  );
});
