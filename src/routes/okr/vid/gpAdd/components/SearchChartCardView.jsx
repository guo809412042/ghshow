/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Row, Select } from 'antd';
import CardTemplateView from '../../../../common/CardTemplateView';
import { createSqlWhere, whereSql } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { ChartRender } from './drawChart';
import { getClass } from '../services';
import ClassManagerView from './KeywordClassModalView';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import KeywordSearchTransferView from './KeywordSearchTransferView';

const { RangePicker } = DatePicker;
const { Option } = Select;


const keywordListSql = 'select  key_word from rpt_pub_dp_keyword_gp_1d where product_id=6  group by key_word; ';

const sqlTemplate = `select  sum(#molecular#) as #molecular#
,ds,key_word
from    #database#
where   #day# >= #startDate#
and     #day# <= #endDate#
#otherWhere#
group by #day#,key_word
order by #day#
limit   10000
;
`;

const sqlClassTemplate = `select  sum(#molecular#) as #molecular#
,ds
from    #database#
where   #day# >= #startDate#
and     #day# <= #endDate#
#otherWhere#
group by #day#
order by #day#
limit   10000
;
`;

const sqlTotal = `select  sum(#molecular#) as #molecular#
,ds
from    #database#
where   #day# >= #startDate#
and     #day# <= #endDate#
#otherWhere#
group by #day#
order by #day#
limit   10000
;
`;
const dateFormat = 'YYYY-MM-DD';

export default ({
  molecular,
  denominator,
  title,
  graphName,
  day,
  database = '',
  otherWhere,
}) => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [fourDayAgo, setFourDayAgo] = useState(moment().subtract(14, 'days'));
  const [keywordList, setKeywordList] = useState([]);
  const [keywordSelect, setKeywordSelect] = useState([]);
  const [classList, setClassList] = useState([]);
  const [classListSelect, setClassListSelect] = useState([]);
  const [classDict, setClassDict] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const CardTemplateViewProps = {
    title,
    loading: false,
    graphName,
  };
  /**
   * 初始化关键字数据
   */
  const initKeywordList = async () => {
    const res = await getData(keywordListSql);
    const effectiveDataList = res.filter(e => !!e.key_word);
    setKeywordList(effectiveDataList.map(e => ({ key: e.key_word, value: e.key_word })));
  };
  /**
   * 初始化分类数据
   */
  const initClassList = async () => {
    const res = await getClass(6);
    const dataList = res.data;
    const classDictTemp = {};
    dataList.forEach((e) => {
      classDictTemp[e.id] = e;
    });
    setClassDict(classDictTemp);
    setClassList(dataList.map(e => ({ key: e.id, value: e.class_name })));
    setClassListSelect(dataList.map(e => e.id.toString()));
  };

  /**
   * 获取图表数据
   * @param {Array} classKeywordList
   * @param {String} charType
   */
  const getChartData = async (classKeywordList, charType) => {
    if (keywordSelect.length === 0 && classKeywordList.length === 0) return [];
    let whereSqlStr = ' 1=1';
    const defaultDataList = [];
    if (keywordSelect.length > 0) {
      whereSqlStr = whereSql({ key_word__in: keywordSelect });
      keywordSelect.forEach((e) => {
        defaultDataList.push({
          type: e,
        });
      });
    } else if (classKeywordList.length > 0) {
      whereSqlStr = whereSql({ key_word__in: classKeywordList });
      classKeywordList.forEach((e) => {
        defaultDataList.push({
          type: e,
        });
      });
    }
    let sql;
    if (charType) {
      sql = createSqlWhere({
        sql: sqlClassTemplate,
        startDate: moment(fourDayAgo),
        endDate: moment(currentDate),
        molecular,
        database,
        day,
        otherWhere: `${otherWhere} and ${whereSqlStr}`,
      });
    } else {
      sql = createSqlWhere({
        sql: sqlTemplate,
        startDate: moment(fourDayAgo),
        endDate: moment(currentDate),
        molecular,
        database,
        day,
        otherWhere: `${otherWhere} and ${whereSqlStr}`,
      });
    }

    const res = await getData(sql);
    const channelDataList = [];
    for (const data of res) {
      channelDataList.push({
        value: Number(data[molecular]),
        day: moment(data.ds).format(dateFormat),
        type: charType || data.key_word,
      });
    }
    return channelDataList.length > 0 ? channelDataList : defaultDataList;
  };
  /**
   * 获取总计数据
   */
  const getTotalData = async () => {
    let whereSqlStr = ' 1=1';
    if (keywordSelect.length > 0) {
      whereSqlStr = whereSql({ key_word__in: keywordSelect });
    } else if (classListSelect.length > 0) {
      // 分类不用统计总数
      return [];
    }
    const sql = createSqlWhere({
      sql: sqlTotal,
      startDate: moment(fourDayAgo),
      endDate: moment(currentDate),
      molecular,
      database,
      day,
      otherWhere: `${otherWhere} and ${whereSqlStr}`,
    });
    const res = await getData(sql);
    const channelDataList = [];
    for (const data of res) {
      channelDataList.push({
        value: Number(data[molecular]),
        day: moment(data.ds).format(dateFormat),
        type: '总计',
      });
    }
    return channelDataList;
  };
  /**
   * 获取图标数据
   */
  const getFetchData = async () => {
    let chartData = await getTotalData();
    if (keywordSelect.length > 0) {
      chartData = chartData.concat(await getChartData([]));
    } else if (classListSelect.length > 0) {
      const res = await Promise.all(classListSelect.map((e) => {
        const classInfo = classDict[Number(e)];
        return getChartData(classInfo.keyword.split(','), classInfo.class_name);
      }));
      chartData = res.reduce((x, y) => x.concat(y));
    }
    setDataSource(chartData);
    ChartRender(chartData, `hour-${molecular}-${title}`);
  };
  useEffect(() => {
    getFetchData();
  }, [currentDate, keywordSelect, classListSelect]);
  useEffect(() => {
    initKeywordList();
    initClassList();
  }, []);
  return <Row
    id={`chartDiv-${molecular}-${denominator}`}
    style={{ marginBottom: 10 }}
  >
    <CardTemplateView {...CardTemplateViewProps} >
      <>
      <label>分类：</label>
      {/* <Select
        showSearch
        style={{ width: '200px', display: 'none' }}
        mode="multiple"
        value={classListSelect}
        onChange={(value) => {
          setClassListSelect(value);
        }}
      >
        {classList.map(e => <Option key={`${e.key}`}>{e.value}</Option>)}
      </Select> */}
      <KeywordSearchTransferView key={1} keywordList={classList.map(e => ({ key: e.key, title: e.value }))} setKeywordSelect={setClassListSelect} selectList={classListSelect.map(e => Number(e))} />
      <label>关键词：</label>
      {/* <Select
        showSearch
        style={{ width: '170px', display: 'none' }}
        mode="multiple"
        maxTagCount={1}
        disabled
        value={keywordSelect}
      >
        {keywordList.map(e => <Option key={`${e.key}`}>{e.value}</Option>)}
      </Select> */}
      <KeywordSearchTransferView key={2} keywordList={keywordList.map(e => ({ key: e.key, title: e.key }))} setKeywordSelect={setKeywordSelect} selectList={keywordSelect} />
      <RangePicker
        value={[fourDayAgo, currentDate]}
        onChange={(value) => {
          setCurrentDate(value[1]);
          setFourDayAgo(value[0]);
        }}
      />
      <DownLoadButton
        filename={title}
        data={dataSource}
        columns={[
          { key: 'day', title: '日期' },
          { key: 'type', title: '关键字/分类' },
          { key: 'value', title: '首次安装人数' },
        ]}
      />
      <ClassManagerView keywordList={keywordList} keywordListSql={keywordListSql} refreshMethod={initClassList} />
      </>
      <div id={`hour-${molecular}-${title}`} />
    </CardTemplateView>
  </Row>;
};
