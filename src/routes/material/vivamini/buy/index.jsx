import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, Spin, Row, Icon, Col, Statistic,
} from 'antd';
import _ from 'lodash';
import Query from './Query';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { columns, initData, loudouColumns } from './const';
import { listSQL, loudouSQL, detailSQL } from './sqlTemplate';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import DetailTableModal from './DetailTableModal';

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    platform: '1',
    country: [],
    appVersion: [],
    newUser: 'Y',
  });
  const [lodaing, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loudouData, setLoudouData] = useState([]);
  const getSQLData = async (sql) => {
    const {
      platform, country, startDate, endDate, appVersion,
      newUser,
    } = search;
    let where = '';
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    if (country.length) {
      where += ` and country in (${country.map(v => `'${v}'`).join(',')})`;
    }
    if (appVersion.length) {
      where += ` and app_version in (${appVersion.map(v => `'${v}'`).join(',')})`;
    }
    if (newUser) {
      where += ` and is_new_dvc = '${newUser}'`;
    }
    const res = await getData(createSqlWhere({
      sql,
      startDate,
      endDate,
      where,
    }));
    return res;
  };
  const getList = async () => {
    const res = await getSQLData(listSQL);
    const data = res.map(v => ({
      ...v,
      'coil_60_dvc_cnt_1d/pay_dvc_cnt_1d': getNumber(v.coil_60_dvc_cnt_1d, v.pay_dvc_cnt_1d),
      'coil_200_dvc_cnt_1d/pay_dvc_cnt_1d': getNumber(v.coil_200_dvc_cnt_1d, v.pay_dvc_cnt_1d),
      'month_pay_dvc_cnt_1d/pay_dvc_cnt_1d': getNumber(v.month_pay_dvc_cnt_1d, v.pay_dvc_cnt_1d),
      'year_pay_dvc_cnt_1d/pay_dvc_cnt_1d': getNumber(v.year_pay_dvc_cnt_1d, v.pay_dvc_cnt_1d),
    }));
    setDataSource(data);
  };
  const getLoudouData = async () => {
    const res = await getSQLData(loudouSQL);
    const dataSource = res.map(v => ({
      ...v,
      'enter_buy_home_dvc_cnt/enter_home_dvc_cnt': getNumber(v.enter_buy_home_dvc_cnt, v.enter_home_dvc_cnt),
      'click_buy_dvc_cnt/enter_buy_home_dvc_cnt': getNumber(v.click_buy_dvc_cnt, v.enter_buy_home_dvc_cnt),
      'buy_dvc_cnt/click_buy_dvc_cnt': getNumber(v.buy_dvc_cnt, v.click_buy_dvc_cnt),
      'buy_dvc_cnt/enter_home_dvc_cnt': getNumber(v.buy_dvc_cnt, v.enter_home_dvc_cnt),
    }));
    setLoudouData(dataSource);
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
    getList();
    getLoudouData();
  }, [search]);
  return <div>
    <Query
      search={search}
      setSearch={setSearch}
    />
    <Spin spinning={lodaing}>
      <DownLoadButton
        filename="购买路径"
        data={dataSource}
        columns={columns}
      />
      <Table
        dataSource={dataSource}
        bordered
        rowKey="ds"
        columns={columns}
      />
      <DownLoadButton
        filename="购买路径"
        data={loudouData}
        columns={loudouColumns}
      />
      <Row>
        {data.map(v => htmlTemplate(v))}
      </Row>
      <Table
        columns={loudouColumns.concat([{
          dataIndex: 'action',
          title: '详情',
          key: 'action',
          render: (text, row) => <DetailTableModal
            title="用户购买使用路径"
            row={row}
            colum={loudouColumns}
            detailSQL = {detailSQL}
            search={search}
          />,
        }])}
        bordered
        dataSource={loudouData}
        style={{ marginTop: 20 }}
        rowKey="home_entry_total"
      />
    </Spin>

  </div>;
};
