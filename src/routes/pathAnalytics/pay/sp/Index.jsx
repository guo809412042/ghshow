/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-10 09:22:57
 * @LastEditTime: 2020-04-23 15:21:30
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
import QueryIndex from '../components/QueryIndex';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { paySQL, payDetailSQL, listSQL } from '../components/sqlTemplate';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';
import DetailTableModal from '../../components/DetailTableModal';
import { listColumns } from '../const';

export default () => {
  const [search, setSearch] = useState({
    where: ' and new_user =  \'Y\' and platform = \'1\'',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    platform: '1',
  });
  const [listDataSource, setListDataSource] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [lodaing, setLoading] = useState(false);
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
      'pay_entry_cnt_1d/home_entry_cnt_1d': `${getNumber(v.pay_entry_cnt_1d, v.home_entry_cnt_1d)}%`,
      'pay_clk_cnt_1d/pay_entry_cnt_1d': `${getNumber(v.pay_clk_cnt_1d, v.pay_entry_cnt_1d)}%`,
      'pay_clk_cnt_1d/home_entry_cnt_1d': `${getNumber(v.pay_clk_cnt_1d, v.home_entry_cnt_1d)}%`,
      '(pay_year_cnt_1d+pay_month_cnt_1d)/pay_clk_cnt_1d': `${((Number(v.pay_year_cnt_1d || 0) + Number(v.pay_month_cnt_1d || 0)) * 100 / v.pay_clk_cnt_1d).toFixed(2)}%`,
      '(pay_year_cnt_1d+pay_month_cnt_1d)/pay_entry_cnt_1d': `${((Number(v.pay_year_cnt_1d || 0) + Number(v.pay_month_cnt_1d || 0)) * 100 / v.pay_entry_cnt_1d).toFixed(2)}%`,
      'pay_year_cnt_1d+pay_month_cnt_1d': Number(v.pay_year_cnt_1d || 0) + Number(v.pay_month_cnt_1d || 0),
    }));
    setDataSource(dataSource);
    const data = _.clone(initData);
    const row = res.length ? res[0] : {};
    data[0].value = row.home_entry_cnt_1d;
    data[0].percent[0].percent = `${getNumber(row.pay_entry_cnt_1d, row.home_entry_cnt_1d)}%`;
    data[1].value = row.pay_entry_cnt_1d;
    data[1].percent[0].percent = `${getNumber(row.pay_clk_cnt_1d, row.pay_entry_cnt_1d)}%`;
    data[2].value = row.pay_clk_cnt_1d;
    data[2].percent[0].percent = `${((Number(row.pay_year_cnt_1d || 0) + Number(row.pay_month_cnt_1d || 0)) * 100 / row.pay_clk_cnt_1d).toFixed(2)}%`;
    data[3].value = Number(row.pay_year_cnt_1d || 0) + Number(row.pay_month_cnt_1d || 0);
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
      product: 3,
    });
    sql = sql.replace(/new_user/g, 'is_new_dvc').replace(/#sub_type#/, search.subType ? ` and sub_type = '${search.subType}'` : '')
      .replace(/country_name/g, 'country');
    const res = await getData(sql);
    setListDataSource(res);
  };
  const columns = [
    {
      dataIndex: 'home_entry_cnt_1d',
      key: 'home_entry_cnt_1d',
      title: '进入首页',
    },
    {
      dataIndex: 'pay_entry_cnt_1d',
      key: 'pay_entry_cnt_1d',
      title: '进入购买页',
    },
    {
      dataIndex: 'pay_entry_cnt_1d/home_entry_cnt_1d',
      key: 'pay_entry_cnt_1d/home_entry_cnt_1d',
      title: '购买页进入率',
    },
    {
      dataIndex: 'pay_clk_cnt_1d',
      key: 'pay_clk_cnt_1d',
      title: '购买点击',
    },
    {
      dataIndex: 'pay_clk_cnt_1d/pay_entry_cnt_1d',
      key: 'pay_clk_cnt_1d/pay_entry_cnt_1d',
      title: '购买点击率',
    },
    {
      dataIndex: 'pay_year_cnt_1d+pay_month_cnt_1d',
      key: 'pay_year_cnt_1d+pay_month_cnt_1d',
      title: '购买成功',
    },
    {
      dataIndex: '(pay_year_cnt_1d+pay_month_cnt_1d)/pay_clk_cnt_1d',
      key: '(pay_year_cnt_1d+pay_month_cnt_1d)/pay_clk_cnt_1d',
      title: '购买成功率',
    },
    {
      dataIndex: '(pay_year_cnt_1d+pay_month_cnt_1d)/pay_entry_cnt_1d',
      key: '(pay_year_cnt_1d+pay_month_cnt_1d)/pay_entry_cnt_1d',
      title: '购买率',
    },
    {
      dataIndex: 'pay_year_cnt_1d',
      key: 'pay_year_cnt_1d',
      title: '年包购买',
    },
    {
      dataIndex: 'pay_month_cnt_1d',
      key: 'pay_month_cnt_1d',
      title: '月包购买',
    },
    {
      dataIndex: 'action',
      title: '详情',
      key: 'action',
      render: (text, row) => <DetailTableModal
        title="用户购买使用路径"
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
      product="3"
    />
    <Spin spinning={lodaing}>
      <DownLoadButton
        filename="购买路径"
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
        filename="购买路径"
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
        rowKey="home_entry_cnt_1d"
      />
    </Spin>
  </div>;
};
