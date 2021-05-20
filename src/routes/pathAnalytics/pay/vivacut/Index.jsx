/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-10 09:22:57
 * @LastEditTime: 2020-07-06 16:59:57
 * @LastEditors: ssssslf
 */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Icon, Row, Table, Statistic, Col, Spin, Tooltip,
} from 'antd';
import _ from 'lodash';
import { initData } from './contants';
import QueryIndex from '../components/QueryIndex';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { listVivacutSQL, payVivacutSQL, payDetailVivacutSQL } from '../components/sqlTemplate';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';
import DetailTableModal from '../../components/DetailTableModal';
import { listColumns } from '../const';

export default () => {
  const [search, setSearch] = useState({
    where: ' and is_new_dvc =  \'N\'  and platform = \'2\'',
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
      sql: payVivacutSQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where: search.where,
      product: 15,
    });
    const res = await getData(sql.replace(/new_user/g, 'is_new_dvc').replace(/#sub_type#/, search.subType ? ` and sub_type = '${search.subType}'` : ''));
    const dataSource = res.map(v => ({
      ...v,
      'enter_buy_home_dvc_cnt/app_start_dvc_cnt': getNumber(v.enter_buy_home_dvc_cnt, v.app_start_dvc_cnt),
      'click_buy_dvc_cnt/enter_buy_home_dvc_cnt': getNumber(v.click_buy_dvc_cnt, v.enter_buy_home_dvc_cnt),
      'buy_dvc_cnt/click_buy_dvc_cnt': getNumber(v.buy_dvc_cnt, v.click_buy_dvc_cnt),
      // 'buy_dvc_cnt/enter_home_dvc_cnt': getNumber(v.buy_dvc_cnt, v.enter_home_dvc_cnt),
    }));
    setDataSource(dataSource);
    const data = _.clone(initData);
    const row = res.length ? res[0] : {};
    data[0].value = row.app_start_dvc_cnt;
    data[0].percent[0].percent = `${getNumber(row.enter_buy_home_dvc_cnt, row.app_start_dvc_cnt)}%`;
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
      sql: listVivacutSQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where: search.where,
      product: 15,
    });
    sql = sql.replace(/new_user/g, 'is_new_dvc').replace(/#sub_type#/, search.subType ? ` and sub_type = '${search.subType}'` : '');
    const res = await getData(sql);
    setListDataSource(res);
  };
  const columns = [
    {
      dataIndex: 'app_start_dvc_cnt',
      key: 'app_start_dvc_cnt',
      title: '启动',
    },
    {
      dataIndex: 'enter_home_dvc_cnt',
      key: 'enter_home_dvc_cnt',
      title: '进入首页',
    },
    {
      dataIndex: 'enter_buy_home_dvc_cnt',
      key: 'enter_buy_home_dvc_cnt',
      title: '进入购买页',
    },
    {
      dataIndex: 'enter_buy_home_dvc_cnt/enter_home_dvc_cnt',
      key: 'enter_buy_home_dvc_cnt/enter_home_dvc_cnt',
      title: '购买页进入率',
    },
    {
      dataIndex: 'click_buy_dvc_cnt',
      key: 'click_buy_dvc_cnt',
      title: '购买点击',
    },
    {
      dataIndex: 'click_buy_dvc_cnt/enter_buy_home_dvc_cnt',
      key: 'click_buy_dvc_cnt/enter_buy_home_dvc_cnt',
      title: '购买点击率',
    },
    {
      dataIndex: 'buy_dvc_cnt',
      key: 'buy_dvc_cnt',
      title: '购买成功',
    },
    {
      dataIndex: 'buy_dvc_cnt/click_buy_dvc_cnt',
      key: 'buy_dvc_cnt/click_buy_dvc_cnt',
      title: '购买成功率',
    },
    {
      dataIndex: 'buy_dvc_cnt/enter_home_dvc_cnt',
      key: 'buy_dvc_cnt/enter_home_dvc_cnt',
      title: '购买率',
    },
    {
      dataIndex: 'action',
      title: '详情',
      key: 'action',
      render: (text, row) => <DetailTableModal
        title="用户购买使用路径"
        row={row}
        colum={columns.slice(0, -1)}
        detailSQL = {payDetailVivacutSQL}
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
      product="15"
      defaultPlatform="2"
      defaultNewUser="N"
      countryName="country"
    />
    <Spin spinning={lodaing}>
      <p />
      <DownLoadButton
        filename="购买路径"
        data={listDataSource}
        columns={listColumns}
      />
      <Tooltip title="其他购买数为负时，说明同一用户年月周包有重复购买">
        <Icon type="question-circle" style={{ fontSize: 18, lineHeight: '26px' }}/>
      </Tooltip>
      <p />
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
      {/* <Table
        columns={columns}
        bordered
        dataSource={dataSource}
        style={{ marginTop: 20 }}
        rowKey="home_entry_total"
      /> */}
    </Spin>
  </div>;
};
