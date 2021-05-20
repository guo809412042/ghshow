/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Collapse, Select, DatePicker, Radio, Table, Tooltip,
} from 'antd';
import {
  countryNameSQL,
  mediaSourceSQL,
  listSQL,
  listAllSQL,
  listNoProductSQL,
  listAllNoProductSQL,
} from './sqlTemplate';
import { getData } from '../../../utils/request';
import {
  createSqlWhere, dateFormat, getNumber, getFixed,
} from '../../../utils/utils';
import { DownLoadButton } from '../../common/DownLoadButton';
import { cardChartRender } from './chartRender';
import { COUNTRY_NAME_COMMON_LIST } from '../../common/countrySelect';

export const APP_LIST = {
  2: 'VivaVideo',
  3: 'SlidePlus',
  // 6: 'VivaShow',
  10: 'Tempo',
  15: 'VivaCut',
  16: 'VivaMini',
  13: 'VivaLite',
  35: 'Facee',
  44: '小影印度马甲包',
};
export default () => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [appProduct, setAppProduct] = useState(undefined);
  const [countryNameList, setCountryNameList] = useState([]);
  const [platform, setPlatform] = useState('1');
  const [dateType, setDateType] = useState(undefined);
  const [dayType, setDayType] = useState('1');
  const [conutryOperator, setConutryOperator] = useState('in');
  // 地区
  const [countryName, setCountryName] = useState([]);
  const [mediaSource, setMediaSource] = useState(undefined);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [type, setType] = useState('spend');
  const [dataSource, setDataSource] = useState([]);
  const getSQL = async (sql) => {
    let where = '';
    if (appProduct) {
      where += ` and product_id = ${appProduct}`;
    }
    if (countryName.length) {
      where += ` and country_name ${conutryOperator} (${countryName.map(v => `'${v}'`).join(',')}) `;
    }
    if (mediaSource) {
      where += ` and media_source = '${mediaSource}'`;
    }
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    const res = await getData(
      createSqlWhere({
        sql,
        startDate,
        endDate,
        where,
      }),
    );

    return res;
  };
  const getTableData = async () => {
    const list = await getSQL(listAllSQL);
    const noPList = await getSQL(listAllNoProductSQL);
    const res = noPList.concat(list);
    const data = res
      .filter(v => v.spend)
      .map(v => ({
        ...v,
        product: APP_LIST[v.product_id] || '全部',
      }));
    setDataSource(data);
  };

  const getList = async () => {
    const data = await getSQL(listSQL);
    const noProRes = await getSQL(listNoProductSQL);
    const res = noProRes.concat(data);
    const chartData = [];
    const apps = Object.keys(APP_LIST);
    apps.unshift('1');
    if (dayType === '1') {
      for (const i of res) {
        if (i.spend) {
          chartData.push({
            type: APP_LIST[i.product_id] || '全部',
            value: i[type],
            day: dateFormat(i.reg_time, 'YYYY-MM-DD'),
          });
        }
      }
    } else if (dayType === '2') {
      const start = [];
      const end = [];
      for (const i of res) {
        const s = moment(i.reg_time.toString())
          .startOf('week')
          .format('YYYYMMDD');
        const e = moment(i.reg_time.toString())
          .endOf('week')
          .format('YYYYMMDD');
        if (!start.includes(s)) {
          start.push(s);
        }
        if (!end.includes(e)) {
          end.push(e);
        }
      }
      start.forEach((v, index) => {
        for (const p of apps) {
          const list = res.filter(
            i => i.reg_time >= v && i.reg_time <= end[index] && Number(i.product_id) === Number(p),
          );
          if (list.length) {
            let regNum = 0;
            let spend = 0;
            for (const i of list) {
              regNum += i.reg_num;
              spend += i.spend;
            }
            chartData.push({
              type: APP_LIST[p] || '全部',
              day: `${dateFormat(v, 'YYYYMMDD')}-${dateFormat(end[index], 'YYYYMMDD')}`,
              value:
                type === 'arpu' ? getNumber(spend, regNum, false, 4) : type === 'spend' ? getFixed(spend) * 1 : regNum,
            });
          }
        }
      });
    } else {
      const start = [];
      const end = [];
      for (const i of res) {
        const s = moment(i.reg_time.toString())
          .startOf('month')
          .format('YYYYMMDD');
        const e = moment(i.reg_time.toString())
          .endOf('month')
          .format('YYYYMMDD');
        if (!start.includes(s)) {
          start.push(s);
        }
        if (!end.includes(e)) {
          end.push(e);
        }
      }
      start.forEach((v, index) => {
        for (const p of apps) {
          const list = res.filter(
            i => i.reg_time >= v && i.reg_time <= end[index] && Number(i.product_id) === Number(p),
          );
          if (list.length) {
            let regNum = 0;
            let spend = 0;
            for (const i of list) {
              regNum += i.reg_num;
              spend += i.spend;
            }
            if (spend) {
              chartData.push({
                type: APP_LIST[p] || '全部',
                day: dateFormat(v, 'YYYYMM'),
                value:
                  type === 'arpu'
                    ? getNumber(spend, regNum, false, 4)
                    : type === 'spend'
                      ? getFixed(spend) * 1
                      : regNum,
              });
            }
          }
        }
      });
    }
    cardChartRender(chartData, 'chart');
  };
  const getCountryNameList = async () => {
    const res = await getData(countryNameSQL);
    const data = res.filter(v => !/[A-Z]/.test(v.country_name) && v.country_name);
    setCountryNameList(data);
  };
  const getMediaSourceList = async () => {
    const res = await getData(mediaSourceSQL);
    setMediaSourceList(res);
  };
  useEffect(() => {
    getCountryNameList();
    getMediaSourceList();
  }, []);
  useEffect(() => {
    getList();
  }, [startDate, endDate, appProduct, platform, type, mediaSource, countryName, dayType, conutryOperator]);
  useEffect(() => {
    if (dateType) {
      setStartDate(moment(endDate).subtract(dateType, 'days'));
    }
  }, [dateType]);
  useEffect(() => {
    getTableData();
  }, [startDate, endDate, appProduct, platform, mediaSource, countryName, conutryOperator]);
  const columns = [
    { title: '产品', key: 'product', dataIndex: 'product' },
    { title: '费用', key: 'spend', dataIndex: 'spend' },
    { title: '新增用户', key: 'reg_num', dataIndex: 'reg_num' },
    { title: '用户获取单价', key: 'arpu', dataIndex: 'arpu' },
  ];
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={appProduct}
            onChange={setAppProduct}
            allowClear
            placeholder="app类型"
          >
            {Object.keys(APP_LIST).map(v => (
              <Select.Option value={v} key={v}>
                {APP_LIST[v]}
              </Select.Option>
            ))}
          </Select>

          <Select
            style={{ width: 100, marginRight: '8px' }}
            placeholder="平台"
            value={platform}
            onChange={e => setPlatform(e)}
          >
            <Select.Option key="1" value="1">
              Andorid
            </Select.Option>

            <Select.Option key="2" value="2">
              iOS
            </Select.Option>
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={mediaSource}
            onChange={setMediaSource}
            allowClear
            placeholder="media_source"
          >
            {mediaSourceList.map(v => (
              <Select.Option value={v.media_source} key={v.media_source}>
                {v.media_source}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={conutryOperator}
            onChange={setConutryOperator}
            placeholder="地区筛选"
          >
            <Select.Option key="in" value="in">
              包含
            </Select.Option>
            <Select.Option key="not in" value="not in ">
              不包含
            </Select.Option>
          </Select>
          <Select
            style={{ width: 200, marginRight: '8px' }}
            value={countryName}
            onChange={setCountryName}
            placeholder="地区"
            mode="multiple"
            showSearch
            allowClear
          >
            {COUNTRY_NAME_COMMON_LIST.map(v => (
              <Select.Option key={v.country_code} value={v.country_code}>
                <Tooltip title={v.country_name}>{v.country_name}</Tooltip>
              </Select.Option>
            ))}
            {countryNameList.map(v => (
              <Select.Option value={v.country_name} key={v.country_name}>
                {v.country_name}
              </Select.Option>
            ))}
          </Select>
          <div />
          <DatePicker.RangePicker
            value={[startDate, endDate]}
            onChange={(value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }}
            style={{ marginRight: 8, marginTop: 8 }}
          />
          <Radio.Group onChange={e => setDateType(e.target.value)} value={dateType}>
            <Radio value="30">30天</Radio>
            <Radio value="60">60天</Radio>
            <Radio value="90">90天</Radio>
          </Radio.Group>
        </Collapse.Panel>
      </Collapse>
      <Radio.Group onChange={e => setType(e.target.value)} value={type} style={{ margin: '10px 0' }}>
        <Radio.Button value="spend">费用</Radio.Button>
        <Radio.Button value="reg_num">新增用户</Radio.Button>
        <Radio.Button value="arpu">用户获取单价</Radio.Button>
      </Radio.Group>
      <Radio.Group onChange={e => setDayType(e.target.value)} value={dayType} style={{ marginLeft: 10 }}>
        <Radio.Button value="1">日</Radio.Button>
        <Radio.Button value="2">周</Radio.Button>
        <Radio.Button value="3">月</Radio.Button>
      </Radio.Group>
      <div id="chart" />
      <DownLoadButton data={dataSource} columns={columns} filename="投放汇总" />
      <Table style={{ marginTop: 20 }} dataSource={dataSource} columns={columns} rowKey="product" bordered />
    </div>
  );
};
