/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react';
import {
  Col, Card, Tooltip, Icon, DatePicker, Select,
} from 'antd';
import * as sqlTemplate from './sqlTemplate';
import { DownLoadButton } from '../../common/DownLoadButton';
import getChartDataFun from '../../common/getChartData';
import { ChartRender } from '../../common/drawChart';
import { createSql, numberTVersion } from '../../../utils/utils';
import { getData } from '../../../utils/request';
import {
  countryLevel1,
  countryLevel2,
  countryLevel3,
  zhongdongCountry,
  duliantiCountry,
  oumeiCountry,
  lameiCountry,
  dongnanyashiguoCountry,
  eyuquCountry,
} from '../../common/countrySelect';
import { ANNOTATION } from '../../../utils/const';

const { RangePicker } = DatePicker;

export default (props) => {
  const {
    graphDefinition,
    graphName,
    colNum,
    title,
    selectList = [],
    suffix,
    chartFunc,
    ghPlatform,
    product_type,
    tags,
    hideNormal,
    appverNoFromat,
  } = props;
  const [columns, setColumns] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);
  const [selectValue, setSelectValue] = useState(selectList.length ? selectList[1].value : '');
  const getFetch = async () => {
    let tempSql = props.sql;
    let dataSource = [];
    let exportData = [];
    const sqlMap = {
      stayData: {
        全部用户: 'staySQL',
        新用户: 'newActStaySQL',
        老用户: 'oldUserActStaySQL',
      },
      madeRateData: {
        全部用户PV: 'madeRateOfPVSQL',
        新用户PV: 'madeRateOfNewPVSQL',
        老用户PV: 'madeRateOfOldPVSQL',
        全部用户UV: 'madeRateOfUVSQL',
        新用户UV: 'madeRateOfNewUVSQL',
        老用户UV: 'madeRateOfOldUVSQL',
      },
      exportRateDataOfMast: {
        全部用户PV: 'exportRateOfPVSQL',
        新用户PV: 'exportRateOfNewPVSQL',
        老用户PV: 'exportRateOfOldPVSQL',
        全部用户UV: 'exportRateOfUVSQL',
        新用户UV: 'exportRateOfNewUVSQL',
        老用户UV: 'exportRateOfOldUVSQL',
      },
      shareRateData: {
        全部用户PV: 'shareRateOfPVSQL',
        新用户PV: 'shareRateOfNewPVSQL',
        老用户PV: 'shareRateOfOldPVSQL',
        全部用户UV: 'shareRateOfUVSQL',
        新用户UV: 'shareRateOfNewUVSQL',
        老用户UV: 'shareRateOfOldUVSQL',
      },
      homeExposeData: {
        全部用户: 'homeExposeSQL',
        新用户: 'homeExposeOfNewSQL',
        老用户: 'homeExposeOfOldSQL',
      },
      prePageExpData: {
        全部用户PV: 'prePageExpOfPVSQL',
        新用户PV: 'prePageExpOfNewPVSQL',
        老用户PV: 'prePageExpOfOldPVSQL',
        全部用户UV: 'prePageExpOfUVSQL',
        新用户UV: 'prePageExpOfNewUVSQL',
        老用户UV: 'prePageExpOfOldUVSQL',
      },
    };
    for (let i of tags) {
      let query = '';
      if (i !== '默认') {
        const v = i.split('||');
        if (v[0] && v[0] !== '默认') {
          if (v[0].includes('中东')) {
            if (v[0].includes('=')) {
              query += ` and reg_country in (${zhongdongCountry})`;
            } else {
              query += ` and reg_country not in (${zhongdongCountry})`;
            }
          } else if (v[0].includes('独联体')) {
            if (v[0].includes('=')) {
              query += ` and reg_country in (${duliantiCountry})`;
            } else {
              query += ` and reg_country not in (${duliantiCountry})`;
            }
          } else if (v[0].includes('第一梯度')) {
            const countryList = countryLevel1;
            if (v[0].includes('=')) {
              query += `and reg_country in (${countryList})`;
            } else {
              query += ` and reg_country not in (${countryList})`;
            }
          } else if (v[0].includes('第二梯度')) {
            const countryList = countryLevel2;
            if (v[0].includes('=')) {
              query += `and reg_country in (${countryList})`;
            } else {
              query += ` and reg_country not in (${countryList})`;
            }
          } else if (v[0].includes('第三梯度')) {
            const countryList = countryLevel3;
            if (v[0].includes('=')) {
              query += `and reg_country in (${countryList})`;
            } else {
              query += ` and reg_country not in (${countryList})`;
            }
          } else if (v[0].includes('欧美')) {
            if (v[0].includes('=')) {
              query += ` and reg_country in (${oumeiCountry})`;
            } else {
              query += ` and reg_country not in (${oumeiCountry})`;
            }
          } else if (v[0].includes('拉美')) {
            if (v[0].includes('=')) {
              query += ` and reg_country in (${lameiCountry})`;
            } else {
              query += ` and reg_country not in (${lameiCountry})`;
            }
          } else if (v[0].includes('东南亚十国')) {
            if (v[0].includes('=')) {
              query += ` and reg_country in (${dongnanyashiguoCountry})`;
            } else {
              query += ` and reg_country not in (${dongnanyashiguoCountry})`;
            }
          } else if (v[0].includes('俄语区')) {
            if (v[0].includes('=')) {
              query += ` and reg_country in (${eyuquCountry})`;
            } else {
              query += ` and reg_country not in (${eyuquCountry})`;
            }
          } else {
            query += ` and reg_country ${v[0]}`;
          }
        }
        if (v[1]) {
          query += ` and app_version ${`${v[1].split(' ')[0]} '${numberTVersion(v[1].split(' ')[1])}'`}`;
        }
        if (v[3]) {
          query += ` and channel ${v[3]}`;
        }
        if (v[2]) {
          let realV2 = v[2];
          if (chartFunc !== 'stayData') {
            realV2 = `${v[2]}${selectValue}`;
          } else {
            realV2 = v[2];
          }
          // 有些图表没有新老用户区分
          // 若是区分了新老用户的图表，需要根据条件拿到对应的sql
          if (sqlMap[chartFunc]) { tempSql = sqlTemplate[sqlMap[chartFunc][realV2]]; }
        }
      } else if (sqlMap[chartFunc] && chartFunc !== 'stayData') {
        tempSql = sqlTemplate[sqlMap[chartFunc][`全部用户${selectValue}`]];
      }

      let sql = createSql(tempSql, startDate, endDate, ghPlatform, 2);
      sql = sql.replace(/#querytype#/g, '').replace(/#product_type#/, product_type);
      let querySql = sql.replace(/#quersql#/g, query);
      //   if (selectList && selectList.length) {
      //     querySql = querySql.replace(/#selectValue#/g, selectValue);
      //     if (selectValue.includes('/')) {
      //       querySql = querySql
      //         .replace(/#selectValue1#/g, selectValue.split('/')[0])
      //         .replace(/#selectValue2#/g, selectValue.split('/')[1]);
      //     }
      //   }
      let res;
      res = await getData(querySql);

      let { list, exportList } = getChartDataFun[chartFunc](res, i);
      dataSource = dataSource.concat(list);
      exportList = exportList.map(v => ({
        ...v,
        type: i,
      }));
      exportData = exportData.concat(exportList);
    }
    let columns = [];
    if (exportData.length) {
      columns = Object.keys(exportData[0]).map(i => ({ key: i, title: i }));
    }
    setColumns(columns);
    setExportData(exportData);

    if (chartFunc === 'DAU') {
      // 总和数据
      const sumObj = {};
      for (let i in dataSource) {
        if (dataSource[i].type === '默认') {
          continue;
        }
        if (sumObj[dataSource[i].day]) {
          sumObj[dataSource[i].day] += dataSource[i].value;
        } else {
          sumObj[dataSource[i].day] = dataSource[i].value;
        }
      }

      for (let k in sumObj) {
        dataSource.push({
          day: k,
          value: sumObj[k],
          type: '总和',
        });
      }
    }
    ChartRender(dataSource, `${chartFunc}-${product_type}`, suffix, hideNormal);
  };
  let graphDefinitionText = '';
  const find = graphDefinition.find(v => v.graph_name === graphName);
  if (find) {
    graphDefinitionText = find.graph_definition;
  }
  useEffect(() => {
    setStartDate(props.startDate);
    setEndDate(props.endDate);
  }, [props.startDate, props.endDate]);
  useEffect(() => {
    getFetch();
  }, [
    props.product_type,
    props.tag,
    props.ghPlatform,
    props.tags,
    props.colNum,
    props.title,
    startDate,
    endDate,
    selectValue,
  ]);
  return (
    <Col span={colNum} style={{ marginBottom: 20, paddingRight: 20 }}>
      <Card
        title={<span style={{ marginRight: 5 }}>{title}</span>}
        bordered
        extra={
          <Tooltip title={ANNOTATION[title] || graphDefinitionText}>
            <Icon type="question-circle" />
          </Tooltip>
        }
      >
        <DownLoadButton filename={title} columns={columns} data={exportData} buttonText />
        <RangePicker
          value={[startDate, endDate]}
          style={{ width: 240 }}
          onChange={(values) => {
            setStartDate(values[0]);
            setEndDate(values[1]);
          }}
        />
        {selectList.length ? (
          <Select
            style={{ width: 120, marginBottom: 20, marginLeft: 10 }}
            value={selectValue}
            onChange={setSelectValue}
          >
            {selectList.map(v => (
              <Select.Option key={v.value} value={v.value}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <div style={{ marginBottom: 18 }} />
        )}

        <div id={`chart-${chartFunc}-${product_type}`} width="100%" />
      </Card>
    </Col>
  );
};
