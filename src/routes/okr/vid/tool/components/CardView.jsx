/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import {
  Col, Statistic, Row, Modal, DatePicker, Spin, Icon, Select,
} from 'antd';
import moment from 'moment';
import styles from '../../../../../styles/index.less';
import { createSqlWhere, getNumber, getPrecision } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { cardChartRender } from './cardChartRender';
import { chartLineRender } from '../../../../common/chartFunc/chartLineRender';
import { DownLoadButton } from '../../../../common/DownLoadButton';

const sqlTemplate = `
select #select#,ds
 from #database#
 where 
  ds >= #startDate#
and ds <= #endDate#
#type#
#duration#
group by ds
order by ds asc
limit   1000
`;
const colorArr = ['#2db7f5', '#87d068', '#108ee9', '#f50'];
export default ({
  row, usr_type, index, tabs, database = 'rpt_vid_log_dvc_type_cnt_1d', durationFlag = false, showSuffix = false, // 强制*100展示百分比
}) => {
  const [value, setValue] = useState(0);
  const [percent, setPercent] = useState('0.0');
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [duration, setDuration] = useState('1');
  const getSQLData = async (startDate, endDate, select) => {
    let sql = createSqlWhere({
      sql: sqlTemplate,
      startDate,
      endDate,
      select,
      type: database === 'rpt_vid_log_dvc_type_cnt_1d' ? `and usr_type = '${usr_type}'` : '',
      database,
    });
    sql = sql.replace(/#duration#/g, durationFlag ? ` and duration = ${duration}` : '');
    const res = await getData(sql);
    return res;
  };
  const getFetchData = async () => {
    let num = 8;
    if (durationFlag && duration === '3') {
      num = 30;
    }
    const chartData = [];
    let $select = '';
    let res;
    if (!row.num.includes('%')) {
      $select = ` sum (${row.num}) as ${row.num}`;
      res = await getSQLData(moment(currentDate).subtract(num, 'days'), currentDate, $select);
      if (res.length) {
        setValue(res[res.length - 1][row.num]);
        for (const i of res) {
          chartData.push({
            day: moment(i.ds.toString()).format('YYYY-MM-DD'),
            value: i[row.num],
          });
        }
        if (res.length >= 8) {
          const berforeNum = res[res.length - 8][row.num];
          const currentNum = res[res.length - 1][row.num];
          setPercent(getPrecision(currentNum, berforeNum).toString());
        }
      }
    } else {
      const selects = row.num.split('%');
      $select = ` sum (${selects[0]}) as ${selects[0]} , sum (${selects[1]}) as ${selects[1]}`;
      res = await getSQLData(moment(currentDate).subtract(num, 'days'), currentDate, $select);
      if (res.length) {
        setValue(getNumber(res[res.length - 1][selects[0]], res[res.length - 1][selects[1]], showSuffix ? true : !durationFlag));
        for (const i of res) {
          chartData.push({
            day: moment(i.ds.toString()).format('YYYY-MM-DD'),
            value: getNumber(i[selects[0]], i[selects[1]], showSuffix ? true : !durationFlag),
          });
        }
        if (res.length >= 8) {
          const berforeNum = getNumber(res[res.length - 8][selects[0]], res[res.length - 8][selects[1]], showSuffix ? true : !durationFlag);
          const currentNum = getNumber(res[res.length - 1][selects[0]], res[res.length - 1][selects[1]], showSuffix ? true : !durationFlag);
          setPercent(getPrecision(currentNum, berforeNum).toString());
        }
      }
    }
    setDataSource(chartData);
    cardChartRender(chartData, `${row.num}-${usr_type}-${tabs}-chart`, colorArr[index % 4], true);
    setLoading(false);
  };
  const handleModalClick = async () => {
    let chartData = [];
    if (!row.num.includes('%')) {
      const weekRes = await getSQLData(startDate, endDate, ` sum (${row.num}) as ${row.num}`);
      chartData = weekRes.map(v => ({
        day: moment(v.ds).format('YYYY-MM-DD'),
        value: v[row.num],
        type: row.num,
      }));
    } else {
      const nums = row.num.split('%');
      const weekRes = await getSQLData(startDate, endDate, ` sum (${nums[0]}) as ${nums[0]}, sum (${nums[1]}) as ${nums[1]}`);
      chartData = weekRes.map(v => ({
        day: moment(v.ds).format('YYYY-MM-DD'),
        value: getNumber(v[nums[0]], v[nums[1]], showSuffix ? true : !durationFlag),
        type: row.num,
      }));
    }
    chartLineRender(chartData, document.getElementById(`${row.num}-${usr_type}-${tabs}-modal-chart`));
    setChartData(chartData);
  };
  useEffect(() => {
    getFetchData();
    setStartDate(moment(currentDate).subtract(7, 'days'));
    setEndDate(currentDate);
  }, [currentDate, duration]);

  useEffect(() => {
    if (visible) {
      handleModalClick();
    }
  }, [visible, startDate, endDate]);

  return <Col span={6} style={{ marginBottom: 12 }}>
    <div className={styles.homeCard} >
      <Spin spinning={loading}>
        <Row className={styles.homeCardBody}>
          <DatePicker
            defaultValue={currentDate}
            format="YYYY-MM-DD"
            onChange={setCurrentDate}
            style={{ marginRight: 20, marginBottom: 20 }}
          />
          {durationFlag ? <Select
            style={{ width: 120 }}
            value={duration}
            onChange={setDuration}
          >
            <Select.Option key="1" value="1">日</Select.Option>
            <Select.Option key="2" value="2">周</Select.Option>
            <Select.Option key="3" value="3">月</Select.Option>
          </Select> : ''}
          <DownLoadButton
            filename={row.title}
            columns={[
              { key: 'day', title: 'day' },
              { key: 'value', title: 'value' },
            ]}
            data={dataSource}
            buttonText={false}
          />
          <div >
            <Statistic
              title={<p style={{ color: '#636262', fontSize: 14 }}>{row.title}</p>}
              value={value}
              valueStyle={{ fontSize: 20 }}
              style={{
                display: 'inline-block',
              }}
            />
            <span style={{ color: percent.includes('-') ? '#3f8600' : '#cf1322', marginLeft: 10 }}>
              <Icon type={percent.includes('-') ? 'arrow-down' : 'arrow-up'}/>
              {percent}
            </span>
          </div>
          <div id={`${row.num}-${usr_type}-${tabs}-chart`} onClick={() => setVisible(true)} />
        </Row>
      </Spin>
    </div>
    <Modal
      title={row.title}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      visible={visible}
      width={800}
    >
      <DatePicker.RangePicker
        style={{ margin: '8px 8px 8px 0' }}
        value={[startDate, endDate]}
        onChange={(value) => {
          setStartDate(value[0]);
          setEndDate(value[1]);
        }}
      />
      <DownLoadButton
        filename={row.title}
        data={chartData}
        columns={[
          { key: 'day', title: 'day' },
          { key: 'value', title: 'value' },
          { key: 'type', title: 'type' },
        ]}
      />
      <div id={`${row.num}-${usr_type}-${tabs}-modal-chart`} />
    </Modal>
  </Col>;
};
