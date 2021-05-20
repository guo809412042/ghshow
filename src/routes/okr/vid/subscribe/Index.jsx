/*
 * @Author: zhoutao
 * @Date: 2020-10-09 13:31:39
 * @Copyright(c) QuVideo F2E Team
 * @Email: tao.zhou@quvideo.com
 */
import * as React from 'react';
import {
  Spin, Table, Row, Icon, Col, Statistic,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { subSQL } from './components/sqlTemplate';
import { getData } from '../../../../utils/request';
import QueryIndex from './components/QueryIndex';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { listColumns, initData, columns } from './const';
import { DownLoadButton } from '../../../common/DownLoadButton';

const { useState, useEffect } = React;

export default (() => {
  const [search, setSearch] = useState({
    where: ' and from_source =  \'all\'',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    type: 'UV',
  });
  const [listDataSource, setListDataSource] = useState([]);
  const [dataSource, setDataSource] = useState([]); // 订阅路径列表
  const [funnelData, setFunnelData] = useState([]); // 漏斗图数据
  const [lodaing, setLoading] = useState(false);
  const onSearch = (value) => {
    setSearch(value);
  };

  const getFetchData = async () => {
    setLoading(true);
    const sql = createSqlWhere({
      sql: subSQL(search.type === 'PV'),
      startDate: search.startDate,
      endDate: search.endDate,
      where: search.where,
    });
    const res = await getData(sql);
    const dataMap = res.map(v => ({
      ...v,
      subscribe_v_dau_v: getNumber(v.subscribe_v, v.dau_v),
      click_v_subscribe_v: getNumber(v.click_v, v.subscribe_v),
      pchs_v_click_v: getNumber(v.pchs_v, v.click_v),
      pchs_v_subscribe_v: getNumber(v.pchs_v, v.subscribe_v),
    }));
    setListDataSource(dataMap);
    setLoading(false);
  };

  const renderFunnel = async () => {
    const sql = createSqlWhere({
      sql: subSQL(search.type === 'PV', false),
      startDate: search.startDate,
      endDate: search.endDate,
      where: search.where,
    });
    const cloneData = _.clone(initData);
    const res = await getData(sql);
    const dataMap = res.map(v => ({
      ...v,
      subscribe_v_dau_v: getNumber(v.subscribe_v, v.dau_v),
      click_v_subscribe_v: getNumber(v.click_v, v.subscribe_v),
      pchs_v_click_v: getNumber(v.pchs_v, v.click_v),
      pchs_v_subscribe_v: getNumber(v.pchs_v, v.subscribe_v),
    }));
    setDataSource(dataMap);
    const row = dataMap.length ? dataMap[0] : {};
    cloneData[0].value = row.dau_v;
    cloneData[0].percent[0].percent = `${row.subscribe_v_dau_v}%`;
    cloneData[1].value = row.subscribe_v;
    cloneData[1].percent[0].percent = `${row.click_v_subscribe_v}%`;
    cloneData[2].value = row.click_v;
    cloneData[2].percent[0].percent = `${row.pchs_v_click_v}%`;
    cloneData[3].value = row.pchs_v;
    setFunnelData(cloneData);
  };

  useEffect(() => {
    getFetchData();
    renderFunnel();
  }, [search]);

  const htmlTemplate = ({
    span, offset, name, value, color, percent = [], double = false, data = [],
  }) => <Col span={span} offset={offset} key={Math.random()}>
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

  return (
    <div>
      <QueryIndex
        onSearch={onSearch}
        product="6"
        noIos
        defaultPlatform="1"
        defaultNewUser=""
        defaultType="UV"
      />
      <div style={{ height: '20px' }}/>
      <DownLoadButton
        filename="订阅路径"
        data={listDataSource}
        columns={listColumns}
      />
      <Spin spinning={lodaing}>
        <Table
          style={{ marginTop: 20 }}
          dataSource={listDataSource}
          bordered
          rowKey="ds"
          columns={listColumns}
        />
        <Row>
          {funnelData.map(v => htmlTemplate(v))}
        </Row>
        <div style={{ height: '20px' }}/>
        <DownLoadButton
          filename="订阅路径"
          data={dataSource}
          columns={columns}
        />
        <Table
          columns={columns}
          bordered
          dataSource={dataSource}
          style={{ marginTop: 10 }}
          rowKey="pchs_v_subscribe_v"
        />
      </Spin>
    </div>
  );
});
