/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import {
  Col, Card, Statistic, Icon, Modal, DatePicker,
} from 'antd';
import moment from 'moment';
import { createSqlWhere, getNumber } from '../../../../../utils/utils';
import { modalChartSQL } from '../sqlTemplate';
import { getData } from '../../../../../utils/request';
import { chartLineRender } from '../../../../common/chartFunc/chartLineRender';
import { DownLoadButton } from '../../../../common/DownLoadButton';

export default ({
  title, pecision = 0.0, value = 0.0, type, clickType, setClickType, suffix, molecular, denominator, search, product,
}) => {
  const [visible, setVisible] = useState(false);
  const [modalRow, setModalRow] = useState({});
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [chartData, setChartData] = useState([]);
  const getSQLData = async (sql) => {
    let $Where = '';
    if (product === 'vid' && search.community !== 'all') {
      $Where = `and community = '${search.community}'`;
    } else {
      $Where = `and product_id = ${product === 'vid' ? 6 : 42}`;
    }
    const res = await getData(createSqlWhere({
      sql, startDate, endDate, type: search.usrType, database: product === 'vid' && search.community !== 'all' ? 'rpt_vid_log_template_cnt_1d' : 'rpt_india_log_tmpl_per_1d', where: $Where,
    }));
    return res;
  };
  const getModalData = async () => {
    const res = await getSQLData(modalChartSQL);
    const chartData = [];
    for (const i of res) {
      if (modalRow.denominator) {
        const value = getNumber(getNumber(i[modalRow.molecular], i[modalRow.denominator]), i.tem_cnt);
        chartData.push({
          day: moment(i.ds).format('YYYY-MM-DD'),
          value,
          type: modalRow.title,
        });
      } else {
        chartData.push({
          day: moment(i.ds).format('YYYY-MM-DD'),
          value: i[modalRow.molecular],
          type: modalRow.title,
        });
      }
    }
    setChartData(chartData);
    chartLineRender(chartData, document.getElementById(`chart-${modalRow.molecular}-${modalRow.denominator || ''}`));
  };
  useEffect(() => {
    if (visible) {
      getModalData();
    }
  }, [visible, startDate, endDate]);
  return <Col
    span={8}
    style={{ margin: '10px 0' }}
  >
    <div
      style={{
        border: Number(clickType) === Number(type) ? '1px solid #1890ff' : '1px solid #d9d9d9',
        cursor: 'pointer',
      }}
    >
      <Card>
        <Statistic
          title={<p
            style={{ fontSize: 22 }}
          >
            <span
              onClick={() => setClickType(type)}
            >
              {title}
            </span>
            <span
              style={{ fontSize: 30, float: 'right', fontWeight: 600 }}
              onClick={() => {
                setModalRow({
                  title,
                  molecular,
                  denominator,
                });
                setVisible(true);
              }}
            >{value}{suffix ? '%' : ''}
            </span>
          </p>}
          value={pecision}
          precision={2}
          valueStyle={{ color: pecision > 0 ? '#3f8600' : '#cf1322' }}
          prefix={<Icon type={pecision > 0 ? 'arrow-up' : 'arrow-down'} />}
          suffix="%"
        />
      </Card>
    </div>
    <Modal
      title={modalRow.title}
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={() => setVisible(false)}
      width={800}
    >
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(values) => {
          setStartDate(values[0]);
          setEndDate(values[1]);
        }}
      />
      <DownLoadButton
        columns={[
          { key: 'day', title: 'day' },
          { key: 'value', title: 'value' },
          { key: 'type', title: 'type' },
        ]}
        data={chartData}
        filename={modalRow.title}
      />
      <div id={`chart-${modalRow.molecular}-${modalRow.denominator || ''}`} />
    </Modal>
  </Col>;
};
