/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  DatePicker, Row, Collapse, Select, Table, Col, Radio,
} from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../common/DownLoadButton';
import { getData } from '../../utils/request';
import styles from '../../styles/index.less';
import { pieChartView } from '../common/pieChartView';
import {
  columns, exportColumns, shareColumns, shareColumnsUS,
} from './constants';
import ChinaOkrChartView from './ChinaOkrChartView';
import * as sqls from '../okr/viva/sqlTemplate';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const TemplateView = ({ graphDefinition }) => {
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [ttid, setTtid] = useState('');
  const [expData, setExpData] = useState([]);
  const [shareData, setShareData] = useState([]);
  const [ttidList, setTtidList] = useState([]);
  const [product, setProduct] = useState('1');
  const [country, setCountry] = useState(undefined);
  const [countryList, setCountryList] = useState([]);
  const getTtidList = async () => {
    const sql = sqls.ttidListSQL;
    const list = await getData(sql);
    setTtidList(list);
  };
  const getCountryList = async () => {
    const res = await getData(sqls.countrySQL);
    setCountryList(res);
  };
  const getExpData = async () => {
    let query = '';
    if (ttid) {
      query += `and ttid in (${ttid})`;
    }
    query += product ? ` and flatform = ${product}` : '';
    const sql = sqls.listSQL
      .replace(/#startDate#/g, moment(startDate).format('YYYYMMDD'))
      .replace(/#endDate#/g, moment(endDate).format('YYYYMMDD'))
      .replace(/#flatform#/g, product ? ' ,flatform' : '')
      .replace(/#country#/, country ? ` and country = '${country}' ` : '')
      .replace(/#ttid#/, query);
    const res = await getData(sql);
    const ExpData = res.map(item => ({
      ...item,
      enterUsrCnt:
        item.enter_usr_cnt && item.exps_usr_cnt ? ((item.enter_usr_cnt * 100) / item.exps_usr_cnt).toFixed(2) : 0,
      saveUsrCnt:
        item.expr_usr_cnt && item.enter_usr_cnt ? ((item.expr_usr_cnt * 100) / item.enter_usr_cnt).toFixed(2) : 0,
      shareUsrCnt:
        item.shared_usr_cnt && item.expr_usr_cnt ? ((item.shared_usr_cnt * 100) / item.expr_usr_cnt).toFixed(2) : 0,
    }));
    setExpData(ExpData);
  };
  const getShareData = async () => {
    let query = '';
    if (ttid) {
      query += `and ttid in (${ttid})`;
    }
    query += product ? ` and flatform = ${product}` : '';
    const sql = sqls.shareList
      .replace(/#startDate#/g, moment(startDate).format('YYYYMMDD'))
      .replace(/#endDate#/g, moment(endDate).format('YYYYMMDD'))
      .replace(/#country#/, country ? ` and country = '${country}' ` : '')
      .replace(/#ttid#/, query)
      .replace(/#flatform#/g, product ? ' ,flatform' : '');
    const res = await getData(sql);
    setShareData(res);
  };
  const getShareCount = async () => {
    let query = '';
    if (ttid) {
      query += `and ttid in (${ttid})`;
    }
    query += product ? ` and flatform = ${product}` : '';
    let sql = country === '美国' ? sqls.shareCountUKSQL : sqls.shareCountSQL;
    sql = sql
      .replace(/#startDate#/g, moment(startDate).format('YYYYMMDD'))
      .replace(/#endDate#/g, moment(endDate).format('YYYYMMDD'))
      .replace(/#type#/g, ttid ? 2 : 1)
      .replace(/#groupflatform#/g, product ? ' group by flatform' : '')
      .replace(/#country#/, country ? ` and country = '${country}' ` : '')
      .replace(/#ttid#/, query);
    const res = await getData(sql);
    pieChartView('pie_shareCount', res);
  };
  useEffect(() => {
    getExpData();
    getShareData();
    getShareCount();
    getTtidList();
  }, [startDate, endDate, ttid, product, country]);

  useEffect(() => {
    getCountryList();
  }, []);
  return (
    <div>
      <Collapse defaultActiveKey={['1']} style={{ marginBottom: 20 }}>
        <Panel header="查询" key="1">
          <RangePicker
            value={[startDate, endDate]}
            onChange={(value) => {
              setEndDate(value[1]);
              setStartDate(value[0]);
            }}
          />
          <Select
            style={{ width: 500, marginLeft: 20 }}
            placeholder="ttid搜索"
            mode="multiple"
            onChange={value => setTtid(value.map(v => `'${v}'`).join(','))}
          >
            {ttidList.map(v => (
              <Select.Option key={v.ttid} value={v.ttid}>
                {v.ttid}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 120, marginLeft: 20 }}
            placeholder="country"
            value={country}
            onChange={value => setCountry(value)}
          >
            {countryList.map(v => (
              <Select.Option key={v.country} value={v.country}>
                {v.country}
              </Select.Option>
            ))}
          </Select>
        </Panel>
      </Collapse>

      <Row gutter={24}>
        <ChinaOkrChartView
          title="曝光占比"
          graphDefinition={graphDefinition}
          graphName="曝光占比"
          startDate={startDate}
          endDate={endDate}
          chartFunc="expsUsrCnt"
          selectTtid={ttid}
          sql={sqls.expsUsrCnt}
          suffix
          hideNormal={false}
          country={country}
        />
        <ChinaOkrChartView
          title="模版进入率"
          graphDefinition={graphDefinition}
          graphName="模版进入率"
          startDate={startDate}
          endDate={endDate}
          chartFunc="enterUsrCnt"
          selectTtid={ttid}
          sql={sqls.enterUsrCnt}
          suffix
          hideNormal={false}
          country={country}
        />
        <ChinaOkrChartView
          title="模版完成率"
          graphDefinition={graphDefinition}
          graphName="模版完成率"
          startDate={startDate}
          endDate={endDate}
          chartFunc="saveUsrCnt"
          selectTtid={ttid}
          sql={sqls.saveUsrCnt}
          suffix
          hideNormal={false}
          country={country}
        />
        <ChinaOkrChartView
          title="模版分享率"
          graphDefinition={graphDefinition}
          graphName="模版分享率"
          startDate={startDate}
          endDate={endDate}
          chartFunc="shareUsrCnt"
          selectTtid={ttid}
          sql={sqls.shareUsrCnt}
          suffix
          hideNormal={false}
          country={country}
        />
        <ChinaOkrChartView
          title="模版创作用户占比"
          graphDefinition={graphDefinition}
          graphName="模版创作用户占比"
          startDate={startDate}
          endDate={endDate}
          chartFunc="puidCnt"
          selectTtid={ttid}
          sql={sqls.puidCnt}
          suffix
          hideNormal={false}
          country={country}
        />
        <ChinaOkrChartView
          title="一键分享占比"
          graphDefinition={graphDefinition}
          graphName="一键分享占比"
          startDate={startDate}
          endDate={endDate}
          chartFunc="shareOne"
          selectTtid={ttid}
          sql={sqls.shareOne}
          suffix
          hideNormal={false}
          uvpu
        />
      </Row>
      <Radio.Group style={{ marginBottom: 10 }} defaultValue="1" onChange={e => setProduct(e.target.value)}>
        <Radio.Button value="" key="">
          全部
        </Radio.Button>
        <Radio.Button value="1" key="1">
          android
        </Radio.Button>
        <Radio.Button value="2" key="2">
          ios
        </Radio.Button>
      </Radio.Group>
      <div className={styles.okrTable}>
        <DownLoadButton filename="列表" columns={exportColumns} data={expData} buttonText={false} />
        <Table style={{ background: '#fff', margin: '10px 0' }} dataSource={expData} columns={columns} rowKey="ttid" />
        <DownLoadButton
          filename="分享列表"
          columns={country === '美国' ? shareColumnsUS : shareColumns}
          data={shareData}
          buttonText={false}
        />
        <Table
          style={{ background: '#fff' }}
          dataSource={shareData}
          columns={country === '美国' ? shareColumnsUS : shareColumns}
          scroll={{ x: 1500 }}
          rowKey="ttid"
        />
      </div>
      <Row gutter={24}>
        <Col span={12}>
          <div id="chart-pie_shareCount" style={{ marginTop: 20, background: '#fff' }} />
        </Col>
      </Row>
    </div>
  );
};

export default TemplateView;
