/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-10 09:22:57
 * @LastEditTime: 2020-07-06 17:27:30
 * @LastEditors: ssssslf
 */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Icon, Row, Table, Statistic, Col, Spin,
} from 'antd';
import _ from 'lodash';
import { initData } from './contants';
import QueryIndex from './QueryIndex';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { listSQL } from '../components/sqlTemplate';
import { paySQL, payDetailSQL } from './sqlTemplate';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';
import DetailTableModal from '../../components/DetailTableModal';
import { listColumns } from '../const';

export default () => {
  const [search, setSearch] = useState({
    where: ' and new_user =  \'Y\'  and platform = \'2\'',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    platform: '2',
  });
  const [dataSource, setDataSource] = useState([]);
  const [lodaing, setLoading] = useState(false);
  const [listDataSource, setListDataSource] = useState([]);
  const [data, setData] = useState([]);
  const getFetchData = async () => {
    setLoading(true);
    const sql = createSqlWhere({
      sql: paySQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where: search.where,
    });
    const res = await getData(sql);
    const dataSource = res.map(v => ({
      ...v,
      'enter_buy_home_dvc_cnt/enter_home_dvc_cnt': getNumber(v.enter_buy_home_dvc_cnt, v.enter_home_dvc_cnt),
      'click_buy_dvc_cnt/enter_buy_home_dvc_cnt': getNumber(v.click_buy_dvc_cnt, v.enter_buy_home_dvc_cnt),
      'buy_dvc_cnt/click_buy_dvc_cnt': getNumber(v.buy_dvc_cnt, v.click_buy_dvc_cnt),
      'buy_dvc_cnt/enter_home_dvc_cnt': getNumber(v.buy_dvc_cnt, v.enter_home_dvc_cnt),
    }));
    setDataSource(dataSource);
    const data = _.clone(initData);
    const row = res.length ? res[0] : {};
    data[0].value = row.enter_home_dvc_cnt;
    data[0].percent[0].percent = `${getNumber(row.enter_buy_home_dvc_cnt, row.enter_home_dvc_cnt)}%`;
    data[1].value = row.enter_buy_home_dvc_cnt;
    data[1].percent[0].percent = `${getNumber(row.click_buy_dvc_cnt, row.enter_buy_home_dvc_cnt)}%`;
    data[2].value = row.click_buy_dvc_cnt;
    data[2].percent[0].percent = `${getNumber(row.buy_dvc_cnt, row.click_buy_dvc_cnt)}%`;
    data[3].value = row.buy_dvc_cnt;
    setData(data);
    setLoading(false);
  };
  const onSearch = (values) => {
    setSearch(values);
  };
  const getListData = async () => {
    let sql = createSqlWhere({
      sql: listSQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where: search.where,
      product: 35,
    });
    sql = sql.replace(/new_user/g, 'is_new_dvc').replace(/#sub_type#/, search.subType ? ` and sub_type = '${search.subType}'` : '');
    const res = await getData(sql);
    setListDataSource(res);
  };
  const columns = [
    {
      dataIndex: 'enter_home_dvc_cnt',
      key: 'enter_home_dvc_cnt',
      title: '????????????',
    },
    {
      dataIndex: 'enter_buy_home_dvc_cnt',
      key: 'enter_buy_home_dvc_cnt',
      title: '???????????????',
    },
    {
      dataIndex: 'enter_buy_home_dvc_cnt/enter_home_dvc_cnt',
      key: 'enter_buy_home_dvc_cnt/enter_home_dvc_cnt',
      title: '??????????????????',
    },
    {
      dataIndex: 'click_buy_dvc_cnt',
      key: 'click_buy_dvc_cnt',
      title: '????????????',
    },
    {
      dataIndex: 'click_buy_dvc_cnt/enter_buy_home_dvc_cnt',
      key: 'click_buy_dvc_cnt/enter_buy_home_dvc_cnt',
      title: '???????????????',
    },
    {
      dataIndex: 'buy_dvc_cnt',
      key: 'buy_dvc_cnt',
      title: '????????????',
    },
    {
      dataIndex: 'buy_dvc_cnt/click_buy_dvc_cnt',
      key: 'buy_dvc_cnt/click_buy_dvc_cnt',
      title: '???????????????',
    },
    {
      dataIndex: 'buy_dvc_cnt/enter_home_dvc_cnt',
      key: 'buy_dvc_cnt/enter_home_dvc_cnt',
      title: '?????????',
    },
    {
      dataIndex: 'action',
      title: '??????',
      key: 'action',
      render: (text, row) => <DetailTableModal
        title="????????????????????????"
        row={row}
        colum={columns.slice(0, -1)}
        detailSQL = {payDetailSQL}
        search={search}
      />,
    },
  ];
  const htmlTemplate = ({
    span, offset, name, value, color, percent = [], double = false, data = [],
  }) => <Col span={span} offset={offset}>
    <Row>
      {
        double ? data.map((v, index) => <Col key={index} span={11} offset={1} style={{
          backgroundColor: color, textAlign: 'center', padding: 10, borderRadius: 5,
        }}>
          <Statistic title={<h4 style={{ color: '#fff' }}>{v.name}</h4>} value={v.value} valueStyle={{ color: '#fff', fontSize: 14 }} />
        </Col>)
          : <div style={{
            backgroundColor: color, width: '100%', textAlign: 'center', padding: 10, borderRadius: 5,
          }}>
            <Statistic title={<h4 style={{ color: '#fff' }}>{name}</h4>} value={value} valueStyle={{ color: '#fff', fontSize: 14 }} />
          </div>
      }
    </Row>

    {percent.length ? percent.length === 1 ? <div style={{
      textAlign: 'center', fontSize: 14, color, margin: 10,
    }}>
      <Icon type="arrow-down" /><span>{percent[0].percentTitle}{percent[0].percent}</span>
    </div> : <Row >
      {percent.map((v, index) => <Col
        span={span / 2}
        offset={4}
        key={index}
        style={{ color, fontSize: 14, padding: 5 }}
      >
        <Icon type="arrow-down" /><span>{v.percentTitle}{v.percent}</span>
      </Col>)}
    </Row> : ''}
  </Col>;
  useEffect(() => {
    getFetchData();
    getListData();
  }, [search]);
  return <div>
    <QueryIndex
      onSearch={onSearch}
      product="35"
      defaultPlatform="2"
      defaultNewUser="Y"
      countryName="country"
    />
    <Spin spinning={lodaing}>
      <DownLoadButton
        filename="????????????"
        data={listDataSource}
        columns={listColumns}
      />
      <Table
        dataSource={listDataSource}
        bordered
        rowKey="ds"
        columns={listColumns}
      />
      <DownLoadButton
        filename="????????????"
        data={dataSource}
        columns={columns}
      />
      <Row>
        {data.map(v => htmlTemplate(v))}
      </Row>
      <Table
        columns={columns}
        bordered
        dataSource={dataSource}
        style={{ marginTop: 20 }}
        rowKey="home_entry_total"
      />
    </Spin>
  </div>;
};
