/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/5/28
 * Time: 上午11:35
 *
 */
import React, { useState, useEffect } from 'react';
import { DatePicker, Select } from 'antd';
import moment from 'moment';
import { createSqlWhere, getNumber } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import { chartLineRender } from '../../../../common/chartFunc/chartLineRender';

const sqlTemplate = `select  #select#
,ds
from    #database#
where   ds >= #startDate#
and     ds <= #endDate#
#where# #otherWhere#
group by ds
order by ds
limit   10000
;
`;


const { RangePicker } = DatePicker;
export default ({
  currentDate, title, molecular, visible, database,
  denominator, suffix, unit, defaultAppVersion, appVersionList, otherWhere,
  molecularName,
}) => {
  const [startDate, setStartDate] = useState(moment(currentDate).subtract(6, 'days'));
  const [endDate, setEndDate] = useState(currentDate);
  const [dataSource, setDataSource] = useState([]);
  const [appVersion, setAppVersion] = useState(defaultAppVersion);
  const getNum = (arr) => {
    // value1 分子 value2分母
    let _molecular = 0;
    _molecular = arr[molecularName || molecular];
    const num = denominator ? getNumber(_molecular, arr[denominator], suffix) : _molecular;
    return num;
  };
  const getChartData = async () => {
    const select = [];
    select.push(` sum(${molecular}) as ${molecularName || molecular}`);
    if (denominator) {
      select.push(` sum(${denominator}) as ${denominator}`);
    }
    let where = '';
    if (appVersion) {
      where = ` and app_version = '${appVersion}'`;
    }
    const sql = createSqlWhere({
      sql: sqlTemplate,
      startDate,
      endDate,
      database,
      select: select.join(','),
      where,
      otherWhere,
    });
    const res = await getData(sql);
    const data = [];
    if (res.length) {
      res.forEach((v) => {
        data.push({
          day: moment(v.ds.toString()).format('YYYY-MM-DD'),
          value: getNum(v),
          type: title,
        });
      });
      setDataSource(data);
    }
    chartLineRender(data, document.getElementById(`chartModal-${molecular}-${denominator}`), undefined, unit);
  };

  useEffect(() => {
    if (visible) {
      getChartData();
    }
  }, [startDate, endDate, appVersion]);
  useEffect(() => {
    if (visible) {
      setStartDate(moment(currentDate).subtract(6, 'days'));
      setEndDate(currentDate);
    }
  }, [currentDate]);
  return <div>
    <RangePicker
      value={[startDate, endDate]}
      onChange={(value) => {
        setEndDate(value[1]);
        setStartDate(value[0]);
      }}
    />
    <Select
      style={{ width: 120, marginTop: 5 }}
      value={appVersion}
      onChange={setAppVersion}
      placeholder="版本"
      allowClear
    >
      {appVersionList.map(v => <Select.Option key={v.app_version} value={v.app_version} >{v.app_version}</Select.Option>)}
    </Select>
    <DownLoadButton
      filename={title}
      data={dataSource}
      columns={[
        { key: 'day', title: 'day' },
        { key: 'value', title: 'value' },
      ]}
    />

    <div id={`chartModal-${molecular}-${denominator}`} />
  </div>;
};
