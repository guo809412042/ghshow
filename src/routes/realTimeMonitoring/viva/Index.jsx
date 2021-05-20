/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Collapse, DatePicker, Select, Radio, Button, Tooltip,
} from 'antd';
import _ from 'lodash';
import {
  selectAttr, createSqlWhere, getNumber, numberTVersion,
} from '../../../utils/utils';
import { literalOptions, numberOptions } from '../../common/constants';
import { getData } from '../../../utils/request';
import { countrySQL, appVersionSQL, listSQL } from './sqlTemplate';
import { ChartRender } from './drawChart';
import {
  COUNTRY_COMMON_LIST, countryLevel1, countryLevel2, countryLevel3,
} from '../../common/countrySelect';

const dateFormat = 'YYYY-MM-DD';
export default () => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(0, 'days'));
  const [countryOperation, setCountryOperation] = useState('=');
  const [appVersionOperation, setAppVersionOperation] = useState('=');
  const [selectCountry, setSelectCountry] = useState(undefined);
  const [selectAppVersion, setSelectAppVersion] = useState(undefined);
  const [countryList, setCountryList] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);
  const [platform, setPlatform] = useState('1');
  const getCountry = async () => {
    const res = await getData(countrySQL.replace(/#platform#/, platform));
    setCountryList(res);
  };

  const getAppVersion = async () => {
    const res = await getData(appVersionSQL.replace(/#platform#/, platform));
    const list = res.map(v => ({
      ...v,
      label: numberTVersion(v.app_version),
    }));
    console.log(list);
    setAppVersionList(list);
  };

  const getFetchData = async () => {
    let where = '';
    if (selectCountry) {
      if (selectCountry.includes('中东')) {
        if (countryOperation.includes('=')) {
          where
            += 'and country in (\'阿尔及利亚\',\'巴林\',\'埃及\',\'约旦\',\'科威特\',\'黎巴嫩\',\'利比亚\',\'摩洛哥\',\'阿曼\',\'卡塔尔\',\'沙特阿拉伯\',\'突尼斯\',\'阿联酋\',\'阿拉伯联合酋长国\',\'巴勒斯坦\',\'也门\',\'伊拉克\',\'叙利亚\')';
        } else {
          where
            += ' and country not  in (\'阿尔及利亚\',\'巴林\',\'埃及\',\'约旦\',\'科威特\',\'黎巴嫩\',\'利比亚\',\'摩洛哥\',\'阿曼\',\'卡塔尔\',\'沙特阿拉伯\',\'突尼斯\',\'阿联酋\',\'阿拉伯联合酋长国\',\'巴勒斯坦\',\'也门\',\'伊拉克\',\'叙利亚\')';
        }
      } else if (selectCountry.includes('独联体')) {
        if (countryOperation.includes('=')) {
          where
            += ' and country in (\'亚美尼亚\',\'阿塞拜疆\',\'白俄罗斯\',\'哈萨克斯坦\',\'吉尔吉斯斯坦\',\'摩尔多瓦\',\'俄罗斯\',\'塔吉克斯坦\',\'乌兹别克斯坦\')';
        } else {
          where
            += ' and country not in (\'亚美尼亚\',\'阿塞拜疆\',\'白俄罗斯\',\'哈萨克斯坦\',\'吉尔吉斯斯坦\',\'摩尔多瓦\',\'俄罗斯\',\'塔吉克斯坦\',\'乌兹别克斯坦\')';
        }
      } else if (selectCountry.includes('第一梯度')) {
        const countryList = countryLevel1;
        if (countryOperation.includes('=')) {
          where += `and country in (${countryList})`;
        } else {
          where += ` and country not  in (${countryList})`;
        }
      } else if (selectCountry.includes('第二梯度')) {
        const countryList = countryLevel2;
        if (countryOperation.includes('=')) {
          where += `and country in (${countryList})`;
        } else {
          where += ` and country not  in (${countryList})`;
        }
      } else if (selectCountry.includes('第三梯度')) {
        const countryList = countryLevel3;
        if (countryOperation.includes('=')) {
          where += `and country in (${countryList})`;
        } else {
          where += ` and country not  in (${countryList})`;
        }
      } else if (selectCountry.includes('/')) {
        const countryList = selectCountry.split('/').map(v => `'${v}'`);
        if (countryOperation.includes('=')) {
          where += `and country in (${countryList})`;
        } else {
          where += ` and country not  in (${countryList})`;
        }
      } else {
        where += `and country ${countryOperation} '${selectCountry}'`;
      }
    }
    if (selectAppVersion) {
      where += ` and app_version_cal ${appVersionOperation} '${selectAppVersion}' `;
    }
    const curSql = createSqlWhere({
      sql: listSQL,
      startDate: currentDate,
      where,
      platform,
    });
    const res = await getData(curSql);
    const beforeSql = createSqlWhere({
      sql: listSQL,
      startDate: moment(currentDate).subtract(1, 'days'),
      where,
      platform,
    });
    const beforeRes = await getData(beforeSql);
    const exportNumData = [];
    const activeNumAddNum = [];
    const activeNum = [];
    const exportUserData = [];
    const date = moment(currentDate).format(dateFormat);
    res.forEach((v) => {
      activeNum.push({
        type: '当天',
        value: v.active_num,
        day: `${date} ${v.hh}:00:00`,
      });
      exportNumData.push({
        type: '当天',
        value: v.export_num,
        day: `${date} ${v.hh}:00:00`,
      });
      activeNumAddNum.push({
        type: '当天',
        value: v.active_add_num,
        day: `${date} ${v.hh}:00:00`,
      });
      exportUserData.push({
        type: '当天',
        value: getNumber(v.export_uv, v.active_num),
        day: `${date} ${v.hh}:00:00`,
      });
    });
    beforeRes.forEach((v) => {
      activeNum.push({
        type: '昨天',
        value: v.active_num,
        day: `${date} ${v.hh}:00:00`,
      });
      exportNumData.push({
        type: '昨天',
        value: v.export_num,
        day: `${date} ${v.hh}:00:00`,
      });
      activeNumAddNum.push({
        type: '昨天',
        value: v.active_add_num,
        day: `${date} ${v.hh}:00:00`,
      });
      exportUserData.push({
        type: '昨天',
        value: getNumber(v.export_uv, v.active_num),
        day: `${date} ${v.hh}:00:00`,
      });
    });
    ChartRender(activeNum, 'active_num');
    // ChartRender(activeNumAddNum, 'active_add_num');
    ChartRender(exportNumData, 'export_num');
    ChartRender(exportUserData, 'export_uv_num');
  };
  useEffect(() => {
    getFetchData();
  }, [currentDate, platform]);
  useEffect(() => {
    getCountry();
    getAppVersion();
  }, [platform]);

  return (
    <div>
      <DatePicker
        defaultValue={currentDate}
        format={dateFormat}
        onChange={setCurrentDate}
        style={{ marginRight: 20, marginBottom: 20 }}
      />
      <Radio.Group
        style={{ marginLeft: 10 }}
        buttonStyle="solid"
        defaultValue={platform}
        onChange={e => setPlatform(e.target.value)}
      >
        <Radio.Button key="2" value="2">
          国内安卓
        </Radio.Button>
        <Radio.Button key="3" value="3">
          iOS
        </Radio.Button>
        <Radio.Button key="1" value="1">
          海外GP
        </Radio.Button>
      </Radio.Group>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select {...selectAttr} value={countryOperation} onChange={setCountryOperation}>
            {literalOptions}
          </Select>
          <Select {...selectAttr} placeholder="地区" value={selectCountry} onChange={setSelectCountry}>
            {COUNTRY_COMMON_LIST.map(v => (
              <Select.Option key={v.key} value={v.key}>
                <Tooltip title={v.value}>{v.value}</Tooltip>
              </Select.Option>
            ))}
            <Select.Option key="中东" value="中东">
              中东
            </Select.Option>
            <Select.Option key="独联体" value="独联体">
              独联体
            </Select.Option>
            {_.map(countryList, item => (
              <Select.Option key={item.country} value={item.country}>
                {item.country}
              </Select.Option>
            ))}
          </Select>
          <Select {...selectAttr} value={appVersionOperation} onChange={setAppVersionOperation}>
            {numberOptions}
          </Select>
          <Select placeholder="版本" {...selectAttr} value={selectAppVersion} onChange={setSelectAppVersion}>
            {_.map(appVersionList, item => (
              <Select.Option key={item.app_version} value={item.app_version}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" onClick={getFetchData}>
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
      <h3>活跃数</h3>
      <div id="active_num" />
      {/* <h3>新增活跃数</h3>
    <div id="active_add_num" /> */}
      <h3>视频导出量</h3>
      <div id="export_num" />
      <h3>导出用户占比</h3>
      <div id="export_uv_num" />
    </div>
  );
};
