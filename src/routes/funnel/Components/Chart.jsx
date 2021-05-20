/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import {
  Form, Input, Row, Card, Col, Statistic, Icon, Table, Breadcrumb, Radio,
} from 'antd';
import moment from 'moment';
import ChartQuery from './ChartQuery';
import { getData } from '../../../utils/request';
import { createSqlWhere, getNumber } from '../../../utils/utils';
import {
  rateSQL, rateSQLNew, tableSQL, tableSQLNew,
} from './sqlTemplate';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';
import { getFunnelEvent } from '../service';
import styles from './index.less';
import { PRODUCT_LIST_MIN } from '../../../utils/const';
import { areaChartRender, chartBarRender } from '../../common/drawChart';

const colors = ['#eea2a2', '#bbc1bf', '#57c6e1', '#b49fda', '#7ac5d8'];
export default (props) => {
  const { product, id, funnelType } = props.match.params;
  const [search, setSearch] = useState({
    startDate: moment().subtract(10, 'days'),
    endDate: moment().subtract(1, 'days'),
    country: undefined,
    countryOperator: '=',
    platform: '1',
    mediaSource: undefined,
    appVersion: undefined,
    appVersionOperator: '=',
    userType: undefined,
    paidType: undefined,
    type: 'total',
  });
  const [row, setRow] = useState({});
  const [funnelData, setFunnelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [chartType, setChartType] = useState('line');
  const getSQLData = async (fetchSQL) => {
    const {
      country,
      countryOperator,
      startDate,
      endDate,
      appVersion,
      appVersionOperator,
      userType,
      paidType,
      mediaSource,
      platform,
      type,
    } = search;
    let where = ` and funnel_id = ${id} and product_id = ${product}`;
    if (country) {
      where += ` and country ${countryOperator} '${country}' `;
    }
    if (appVersion) {
      where += ` and app_version ${appVersionOperator} '${appVersion}' `;
    }
    if (userType) {
      where += ` and new_user ${userType} `;
    }
    if (paidType) {
      where += ` and paid_type = '${paidType}' `;
    }
    if (mediaSource) {
      where += ` and media_source = '${mediaSource}' `;
    }
    if (platform) {
      where += ` and platform = '${platform}' `;
    }

    const sql = createSqlWhere({
      sql: fetchSQL,
      startDate,
      endDate,
      type,
      where,
    });
    const res = await getData(sql);
    return res;
  };
  const getRateList = async () => {
    const getName = await getFunnelEvent({
      product_id: product,
      funnelId: id,
      step: 1,
    });
    if (getName.data.length) {
      setRow({
        name: getName.data[0].name,
      });
    }

    const sqlParam = Number(funnelType) === 2 ? rateSQLNew : rateSQL;
    let res = await getSQLData(sqlParam);

    res = res.sort((a, b) => a.step - b.step);
    const data = [];
    res.forEach((v, index) => {
      const arr = {
        percentTitle: !index ? '总转化率' : '',
        percent: index ? getNumber(v.total, res[index - 1].total) : getNumber(res[res.length - 1].total, v.total),
        event_name: v.event_name,
        total: v.total,
        step: v.step,
      };
      data.push(arr);
    });
    setFunnelData(data);
  };

  const getTabelList = async () => {
    const date = [];
    const data = [];
    const sql = Number(funnelType) === 2 ? tableSQLNew : tableSQL;
    const res = await getSQLData(sql);
    for (const i of res) {
      if (!date.includes(i.ds)) {
        date.push(i.ds);
      }
    }
    const chartData = [];

    for (const i of date) {
      let list = res.filter(v => v.ds === i);
      list = list.sort((a, b) => a.step - b.step);
      const arr = {
        日期: i,
      };
      arr['总转化率'] = `${getNumber(list[list.length - 1].total, list[0].total)}%`;
      chartData.push({
        type: '总转化率',
        day: moment(i).format('YYYY-MM-DD'),
        value: getNumber(list[list.length - 1].total, list[0].total),
      });
      list.forEach((j) => {
        if (Number(j.step) !== 1) {
          // 第${j.step}步转化率`
          // arr[`第${j.step}步转化率`] = getNumber(j.total, list[j.step - 2].total);
          arr[`show-${j.step - 1}`] = `${getNumber(j.total, list[j.step - 2].total)}%`;
          chartData.push({
            type: `第${j.step - 1}步转化率`,
            day: moment(i).format('YYYY-MM-DD'),
            value: getNumber(j.total, list[j.step - 2].total),
          });
        }
        arr[`${j.event_name}(${j.step})`] = j.total;
      });
      data.push(arr);
    }
    if (data.length) {
      const columns = Object.keys(data[0]).map(v => ({
        dataIndex: v,
        key: v,
        title: v.includes('show-') ? '' : v.split('(')[0],
        width: v.includes('show-') ? 100 : 120,
        align: 'center',
        render: text => (!v.includes('show-') ? (
          text
        ) : (
          <div>
            <span className={styles.text} style={{ background: colors[v.split('show-')[1] % colors.length] }}>
              {text}
            </span>
            <span style={{ borderColor: colors[v.split('show-')[1] % colors.length] }} className={styles.right} />
          </div>
        )),
      }));
      setColumns(columns);
      setDataSource(data);
    } else {
      setColumns([]);
      setDataSource([]);
    }
    setChartData(chartData);
  };
  useEffect(() => {
    getRateList();
    getTabelList();
  }, [search]);
  useEffect(() => {
    if (chartData.length) {
      if (chartType === 'line') {
        chartLineRender(chartData, document.getElementById('chart'), undefined, undefined, colors);
      } else if (chartType === 'bar') {
        chartBarRender(chartData, 'chart', colors);
      } else {
        areaChartRender(chartData, 'chart', colors);
      }
    }
  }, [chartData, chartType]);
  return (
    <div>
      <Breadcrumb separator=">" style={{ marginBottom: 20 }}>
        <Breadcrumb.Item
          onClick={() => props.history.push(`/gh/funnel/${PRODUCT_LIST_MIN[product]}`)}
          style={{ cursor: 'pointer' }}
        >
          漏斗管理
        </Breadcrumb.Item>
        <Breadcrumb.Item>漏斗分析</Breadcrumb.Item>
      </Breadcrumb>
      <Form layout="inline">
        <Form.Item label="漏斗名称">
          <Input value={row.name} disabled />
        </Form.Item>
      </Form>
      <ChartQuery
        search={search}
        onSearch={setSearch}
        product_id={product}
        filename="漏斗分析"
        data={dataSource}
        columns={columns}
      />
      <Row gutter={12} style={{ marginTop: 10 }}>
        <Col span={12}>
          {funnelData.length ? (
            <Card style={{ height: 390, overflowY: 'auto' }}>
              {funnelData.map((v, index) => (
                <div>
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      color: colors[index],
                      margin: 10,
                    }}
                  >
                    <Icon type="arrow-down" />
                    <span>
                      {v.percentTitle}
                      {v.percent}%
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: colors[index % colors.length],
                      textAlign: 'center',
                      padding: 10,
                      borderRadius: 5,
                    }}
                  >
                    <Statistic
                      title={<h3 style={{ color: '#fff' }}>{v.event_name}</h3>}
                      value={v.total}
                      valueStyle={{ color: '#fff', fontSize: 14 }}
                    />
                  </div>
                </div>
              ))}
            </Card>
          ) : (
            <Card>暂无数据</Card>
          )}
        </Col>

        <Col span={12}>
          {chartData.length ? (
            <Card>
              <Radio.Group
                value={chartType}
                onChange={(e) => {
                  setChartType(e.target.value);
                }}
                style={{ float: 'right' }}
              >
                <Radio.Button value="line" key="line">
                  <Icon type="line-chart" />
                </Radio.Button>
                <Radio.Button value="area" key="area">
                  <Icon type="area-chart" />
                </Radio.Button>
                <Radio.Button value="bar" key="bar">
                  <Icon type="bar-chart" />
                </Radio.Button>
              </Radio.Group>
              <div id="chart" style={{ marginTop: 40 }} />
            </Card>
          ) : (
            <Card>暂无数据</Card>
          )}
        </Col>
      </Row>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="日期"
        style={{ marginTop: 20 }}
        scroll={{ x: columns.length * 120 }}
      />
    </div>
  );
};
