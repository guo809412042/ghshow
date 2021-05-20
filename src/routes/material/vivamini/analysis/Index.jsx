/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Row, Table,
} from 'antd';
import _ from 'lodash';
import Query from './components/Query';
import { cardData, columns } from './const';
import CardView from './components/CardView';
import { getData } from '../../../../utils/request';
import { createSqlWhere, getNumber, getPrecision } from '../../../../utils/utils';
import { cardSQL, chartSQL, listSQL } from './components/sqlTemplate';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { ChartRenderHHMM } from '../../../common/chartFunc/chartRenderHHMM';
import QueryDetail from './components/QueryDetail';

export default () => {
  const [search, setSearch] = useState({
    currentDate: moment().subtract(0, 'days'),
    platform: '',
  });
  const [searchDetail, setSearchDetail] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(0, 'days'),
    platform: '',
    type: 'uv',
    selectTTid: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [cardList, setCardList] = useState(cardData);
  const [clickType, setClickType] = useState('1');
  const [dataSource, setDataSource] = useState([]);

  const onSearch = (value) => {
    setSearch(value);
  };
  const onSearchDetail = (value) => {
    setSearchDetail(value);
  };

  const getCardData = async () => {
    let platform = '';
    if (search.platform) {
      platform = ` and os = ${search.platform}`;
    }
    let sql = createSqlWhere({
      sql: cardSQL,
      startDate: moment(search.currentDate).subtract(1, 'days'),
      endDate: search.currentDate,
      platform,
    });
    const currentHours = moment(search.currentDate).hour();
    const hours = currentHours <= 1 ? currentHours : currentHours - 2;
    sql = sql.replace(/#hh#/g,
      moment(search.currentDate).format('YYYY-MM-DD') !== (moment().subtract(0, 'days')).format('YYYY-MM-DD') ? '24'
        : `'${hours}'`);
    const res = await getData(sql);
    const data = _.clone(cardList);
    if (res.length) {
      const arr = res[0];
      for (const i of data) {
        if (!i.denominator) {
          const num = arr[`${i.molecular}uv`];
          i.value = num;
          if (res.length >= 2) {
            const beforeArr = res[1];
            const beforeNum = beforeArr[`${i.molecular}uv`];
            i.pecision = getPrecision(num, beforeNum);
          }
        } else {
          const num = getNumber(arr[`${i.molecular}uv`],
            arr[`${i.denominator}uv`]);
          i.value = num;
          if (res.length >= 2) {
            const beforeArr = res[1];
            const beforeNum = getNumber(beforeArr[`${i.molecular}uv`],
              beforeArr[`${i.denominator}uv`]);
            i.pecision = getPrecision(num, beforeNum);
          }
        }
      }
    }
    setCardList(data);
  };
  const getChartData = async () => {
    const arr = cardData[clickType - 1];
    let platform = '';
    if (search.platform) {
      platform = ` and os = ${search.platform}`;
    }
    const weekday = moment(search.currentDate).subtract(7, 'days').format('YYYYMMDD');
    const yestoday = moment(search.currentDate).subtract(1, 'days').format('YYYYMMDD');
    const sql = createSqlWhere({
      sql: chartSQL,
      startDate: search.currentDate,
      platform,
      weekday,
      yestoday,
    });
    const data = await getData(sql);
    const chartData = [];
    data.forEach((v) => {
      chartData.push({
        day: `${moment(search.currentDate).format('YYYY-MM-DD')} ${v.hh}:00`,
        value: arr.denominator ? getNumber(v[`${arr.molecular}uv`], v[`${arr.denominator}uv`]) : v[`${arr.molecular}uv`],
        type: Number(moment(search.currentDate).format('YYYYMMDD')) === Number(v.ds) ? '当天' : (Number(yestoday) === Number(v.ds) ? '昨天' : '一周前'),
      });
    });
    ChartRenderHHMM(chartData, 'chart');
  };
  const getTableData = async () => {
    setLoading(true);
    const {
      selectTTid, type, startDate, endDate,
    } = searchDetail;
    let platform = '';
    if (searchDetail.platform) {
      platform = ` and os = ${searchDetail.platform}`;
    }
    const sql = createSqlWhere({
      sql: listSQL,
      startDate,
      endDate,
      platform,
      where: selectTTid ? ` and ttid = '${selectTTid}'` : '',
    });
    const res = await getData(sql);
    const data = res.map(v => ({
      show_: v[`show_${type}`],
      ds: v.ds,
      ttid: v.ttid,
      ttname: v.ttname,
      make_: v[`make_${type}`],
      share_: v[`share_${type}`],
      click_make_: v[`click_make_${type}`],
      make_succ_: v[`make_succ_${type}`],
      make_fail_: v[`make_fail_${type}`],
      del_: v[`del_${type}`],
      make_show_: `${getNumber(v[`make_${type}`], v[`show_${type}`])}`,
      share_make_: `${getNumber(v[`share_${type}`], v[`make_${type}`])}`,
      del_make_: `${getNumber(v[`del_${type}`], v[`make_${type}`])}`,
      click_make_show_: `${getNumber(v[`click_make_${type}`], v[`show_${type}`])}`,
      make_fail_make_: `${getNumber(v[`make_fail_${type}`], v[`make_${type}`])}`,
      key: `${v.ttid}-${v.ttname}`,
    }));
    setDataSource(data);
    setLoading(false);
  };
  useEffect(() => {
    getCardData();
  }, [search]);
  useEffect(() => {
    getChartData();
  }, [clickType, search]);
  useEffect(() => {
    getTableData();
  }, [searchDetail]);
  return (
    <div>
      <p style={{ fontSize: 26, marginBottom: 10 }}>整体数据</p>
      <Query search={search} onSearch={onSearch} />
      <Row gutter={12}>
        {cardData.map((v, index) => (
          <CardView {...v} clickType={clickType} setClickType={setClickType} type={index + 1} />
        ))}
      </Row>
      <div id="chart" />
      <hr style={{ margin: '30px 0' }} />
      <p style={{ fontSize: 26, marginBottom: 10 }}>细则信息</p>
      <QueryDetail
        searchDetail={searchDetail}
        onSearchDetail={onSearchDetail}
      />
      <DownLoadButton filename="素材分析" data={dataSource} columns={columns} />
      <Table
        bordered
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="key"
        scroll={{ x: columns.length * 120 }}
      />
    </div>
  );
};
