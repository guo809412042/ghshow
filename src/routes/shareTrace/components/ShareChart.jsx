import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Select } from 'antd';
import MyDatePicker from '../../components/MyDatePicker';
import { shareChartSQL } from './sqlTemplate';
import { getData } from '../../../utils/request';
import styles from '../styles/index.less';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';

export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [dataType, setDataType] = useState('percent'); // value||percent

  const getDataList = async () => {
    const where = ` where ds>=${startDate.format('YYYYMMDD')} and ds<=${endDate.format('YYYYMMDD')}`;
    const res = await getData(shareChartSQL.replace('?', where));
    let chartList = res.map(v => ({
      day: moment(v.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
      value: v.install_uv,
      type: v.share_type,
    }));
    const unique = new Set();
    const all = [];
    res.forEach((v) => {
      if (!unique.has(v.ds)) {
        unique.add(v.ds);
        all.push({
          day: moment(v.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
          value: v.all_type_uv,
          type: 'share_link',
        });
      }
    });
    chartList = chartList.concat(all);
    chartLineRender(chartList, document.getElementById('share_chart'));
  };

  const getPercentList = async () => {
    const where = ` where ds>=${startDate.format('YYYYMMDD')} and ds<=${endDate.format('YYYYMMDD')}`;
    const res = await getData(shareChartSQL.replace('?', where));
    const chartList = res.map(v => ({
      day: moment(v.ds, 'YYYYMMDD').format('YYYY-MM-DD'),
      value: v.ratio,
      type: v.share_type,
    }));
    const chart = chartLineRender(chartList, document.getElementById('share_chart'));
    chart.tooltip('type*day*value', (type, day, percent) => {
      percent = `${percent.toFixed(2)}%`;
      return {
        name: type,
        value: percent,
      };
    });
  };

  useEffect(() => {
    if (dataType === 'value') {
      getDataList();
    } else {
      getPercentList();
    }
  }, [startDate, endDate, dataType]);

  return (
    <div className={styles.content}>
      <div className={styles.headerWrapper}>
        <strong>链接安装趋势图</strong>
        <div className={styles.operator}>
          <Select value={dataType} onChange={setDataType}>
            <Select.Option key="value" value="value">
              显示绝对值
            </Select.Option>
            <Select.Option key="percent" value="percent">
              显示占比
            </Select.Option>
          </Select>
          <MyDatePicker
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
            }}
          />
        </div>
      </div>
      <div id="share_chart" />
    </div>
  );
};
