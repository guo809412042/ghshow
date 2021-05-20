import React, { useState, useEffect } from 'react';
import {
  Col, Card, DatePicker, Icon, Tooltip, Radio,
} from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../common/DownLoadButton';
import { getData } from '../../utils/request';
import { ChartRender } from '../common/drawChart';
import getChartDataFun from '../common/getChartData';
import { ANNOTATION } from '../../utils/const';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYYMMDD';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const ChinaOkrChartView = ({
  title,
  graphDefinition,
  hideNormal,
  startDate,
  graphName,
  endDate,
  chartFunc,
  selectTtid,
  sql,
  suffix,
  uvpu,
  country,
}) => {
  let graphDefinitionText = '';
  const find = graphDefinition.find(v => v.graph_name === graphName);
  if (find) {
    graphDefinitionText = find.graph_definition;
  }
  const [currentStartDate, setCurrentStartDate] = useState(startDate);
  const [currentendDate, setCurrentEndDate] = useState(endDate);
  const [columns, setColumns] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [uvpuValue, setUvpyValue] = useState('a');
  const getFetch = async (startDate, endDate, selectTtid, uvpuValue) => {
    let query = '';
    if (selectTtid) {
      query += `and ttid in (${selectTtid})`;
    }

    const fetchSql = sql
      .replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat))
      .replace(/#type#/, selectTtid ? 2 : 1)
      .replace(/#country#/, country ? ` and country = '${country}' ` : '')
      .replace(/#ttid#/, query);
    const data = await getData(fetchSql);
    const { list, exportList } = getChartDataFun[chartFunc](data, title, uvpuValue);
    let columns = [];
    if (exportList.length) {
      columns = Object.keys(exportList[0]).map(i => ({ key: i, title: i }));
    }
    setColumns(columns);
    setExportData(exportList);
    setUvpyValue(uvpuValue);
    ChartRender(list, chartFunc, suffix, hideNormal);
  };
  useEffect(() => {
    setCurrentStartDate(startDate);
    setCurrentEndDate(endDate);
    getFetch(startDate, endDate, selectTtid, uvpuValue);
  }, [startDate, endDate, selectTtid, country]);

  return (
    <Col span={12} style={{ marginBottom: 12 }}>
      <Card
        bordered
        title={
          <div>
            <span style={{ marginRight: 5 }}>{title}</span>
            <Tooltip title={ANNOTATION[title] || graphDefinitionText}>
              <Icon type="question-circle" />
            </Tooltip>
          </div>
        }
      >
        <div>
          <RangePicker
            value={[currentStartDate, currentendDate]}
            style={{ width: 240, marginRight: 10 }}
            onChange={(value) => {
              setCurrentStartDate(value[0]);
              setCurrentEndDate(value[1]);
              getFetch(value[0], value[1], selectTtid, uvpuValue);
            }}
          />
          <DownLoadButton filename={title} columns={columns} data={exportData} buttonText={false} />
          {uvpu ? (
            <RadioGroup
              defaultValue="a"
              style={{ marginLeft: 10 }}
              onChange={(e) => {
                getFetch(currentStartDate, currentendDate, selectTtid, e.target.value);
              }}
            >
              <RadioButton value="a" key="a">
                次数
              </RadioButton>
              <RadioButton value="b" key="b">
                人数
              </RadioButton>
            </RadioGroup>
          ) : (
            ''
          )}
        </div>

        <div id={`chart-${chartFunc}`} width="100%" />
      </Card>
    </Col>
  );
};

export default ChinaOkrChartView;
