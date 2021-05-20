/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, Select, Row, Col, Spin, Card,
} from 'antd';
import Query from './components/Query';
import { DownLoadButton } from '../../common/DownLoadButton';
import {
  listDaysql, listplacementsql, listDayplacementsql,
} from './components/SqlTemplate';
import { getData } from '../../../utils/request';
import { chartLineRender } from '../../common/chartFunc/chartLineRender2Axis';
import {
  columnsMap, StatiticsTypeList, chartKey, chartKeyMap,
} from './components/utils';
// import { getCountryAndAppVersionAndChannel } from '../../../utils/utils';
import { GetVCMAdvPlacementList } from './services';
import { APPNAME_LIST } from './components/const';
// import { groupSignal } from '../trialConvertion/utils';

const Option = Select.Option;

export default () => {
  const useMergeState = (initialState) => {
    const [state, setState] = useState(initialState);
    const setMergedState = newState => setState(prevState => Object.assign({}, prevState, newState));
    return [state, setMergedState];
  };
  const [search, setSearch] = useMergeState({
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(1, 'days'),
    product: 'viva',
    platform: '1',
    country: undefined,
    advCompany: [],
    advPlacement: [],
    appVersionOperation: 'in',
    countryOperation: 'in',
    advType: '',
    statisticsType: ['day'],
    selectAppVersion: undefined,
    mediaSourceValue: undefined,
    campaignValue: undefined,
    // selectAppVersion: []
  });

  const [dataList, setDataList] = useState([]);
  const [chartkeyinfo, setchartkeyinfo] = useMergeState({
    chartkeynum1: 'dau',
    chartkeynum2: 'request_num',
    chartkeynum3: 'fill_rate',
    chartkeynum4: 'show_rate',
  });

  // const dynamicColumn = {
  //   key: search.statisticsType,
  //   dataIndex: search.statisticsType,
  //   title: search.statisticsType,
  //   render: text => text,
  // };

  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  // console.log('appInfo', appInfo);
  // 获取where查询条件
  const getWhereGroup = (type, notype = false) => {
    if (type === 1) {
      let where = ' where 1=1 ';
      let group = ' group by ';
      if (search.platform) {
        where += ` and platform in('${search.platform}')`;
        group += ' platform ';
      }
      if (search.startDate) {
        where += ` and ds>=${moment(search.startDate).format('YYYYMMDD')}`;
        if (JSON.stringify(search.statisticsType) !== '["placement_name"]' || notype) {
          group += ' ,ds ';
        }
      }
      if (search.endDate) {
        where += ` and ds<=${moment(search.endDate).format('YYYYMMDD')}`;
      }
      if (search.mediaSourceValue && search.mediaSourceValue.length > 0) {
        where += ` and media_source in(${search.mediaSourceValue.map(v => `'${v}'`).join(',')})`;
      }
      if (search.campaignValue && search.campaignValue.length > 0) {
        where += ` and campaign_name in(${search.campaignValue.map(v => `'${v}'`).join(',')})`;
      }
      if (search.advCompany && search.advCompany.length > 0) {
        where += ` and platform_id in(${search.advCompany.map(v => `'${v}'`).join(',')})`;
        group += ' ,platform_id ';
      }
      if (search.advPlacement && search.advPlacement.length > 0) {
        where += ` and placement_id in(${search.advPlacement
          .map(v => v.split(',').map(str => `'${str}'`))
          .flat()
          .join(',')})`;
        // group += ' ,placement_id ';
      }
      if (JSON.stringify(search.statisticsType) !== '["day"]' && group.indexOf(',placement_id' !== -1) && !notype) {
        group += ' ,placement_id ';
      }
      if (search.advType && search.advType.length > 0) {
        where += ` and display_type in(${search.advType.map(v => `'${v}'`)})`;
        group += ' ,display_type ';
      }
      // if (JSON.stringify(search.statisticsType) === '["placement_name"]' && group.indexOf(',display_type' !== -1) && !notype) {
      //   group += ' ,display_type ';
      // }
      if (search.country && search.country.length > 0) {
        where += ` and country ${search.countryOperation}(${search.country.map(v => `'${v}'`)})`;
        // group += ' ,country ';
      }
      if (search.selectAppVersion && search.selectAppVersion.length > 0) {
        where += ` and app_version ${search.appVersionOperation}(${search.selectAppVersion.map(v => `'${v}'`)})`;
      }
      if (search.product) {
        where += ` and product_name in('${search.product}')`;
        group += ' ,product_name ';
      }
      return { where, group };
    } if (type === 2) {
      let where = ' where 1=1 ';
      let group = ' group by ';
      if (search.platform) {
        where += ` and platform in('${search.platform}')`;
        group += ' platform ';
      }
      if (search.startDate) {
        where += ` and ds>=${moment(search.startDate).format('YYYYMMDD')}`;
        if (JSON.stringify(search.statisticsType) !== '["placement_name"]' || notype) {
          group += ' ,ds ';
        }
      }
      if (search.advPlacement && search.advPlacement.length > 0) {
        where += ` and placement_id in(${search.advPlacement
          .map(v => v.split(',').map(str => `'${str}'`))
          .flat()
          .join(',')})`;
        // group += ' ,placement_id ';
      }
      if (search.advType && search.advType.length > 0) {
        where += ` and display_type in(${search.advType.map(v => `'${v}'`)})`;
        // group += ' ,display_type ';
      }
      if (search.endDate) {
        where += ` and ds<=${moment(search.endDate).format('YYYYMMDD')}`;
      }
      if (JSON.stringify(search.statisticsType) !== '["day"]' && group.indexOf(',placement_id' !== -1) && !notype) {
        group += ' ,placement_id ';
      }
      // if (JSON.stringify(search.statisticsType) === '["placement_name"]' && group.indexOf(',placement_id' !== -1) && !notype) {
      //   group += ' ,placement_id ';
      // }
      // if (JSON.stringify(search.statisticsType) === '["placement_name"]' && group.indexOf(',display_type' !== -1) && !notype) {
      //   group += ' ,display_type ';
      // }
      if (search.mediaSourceValue && search.mediaSourceValue.length > 0) {
        where += ` and media_source in(${search.mediaSourceValue.map(v => `'${v}'`).join(',')})`;
      }
      if (search.campaignValue && search.campaignValue.length > 0) {
        where += ` and campaign_name in(${search.campaignValue.map(v => `'${v}'`).join(',')})`;
      }
      if (search.country && search.country.length > 0) {
        where += ` and country ${search.countryOperation}(${search.country.map(v => `'${v}'`)})`;
        // group += ' ,country ';
      }
      if (search.selectAppVersion && search.selectAppVersion.length > 0) {
        where += ` and app_version ${search.appVersionOperation}(${search.selectAppVersion.map(v => `'${v}'`)})`;
      }
      if (search.product) {
        where += ` and product_name in('${search.product}')`;
        group += ' ,product_name ';
      }
      return { where, group };
    }
    let where = ' where 1=1 ';
    let group = ' group by ';
    if (search.platform) {
      where += ` and platform in('${search.platform}')`;
      group += ' platform ';
    }
    if (search.startDate) {
      where += ` and ds>=${moment(search.startDate).format('YYYYMMDD')}`;
      if (JSON.stringify(search.statisticsType) !== '["placement_name"]' || notype) {
        group += ' ,ds ';
      }
    }
    if (search.endDate) {
      where += ` and ds<=${moment(search.endDate).format('YYYYMMDD')}`;
    }
    if (search.mediaSourceValue && search.mediaSourceValue.length > 0) {
      where += ` and media_source in(${search.mediaSourceValue.map(v => `'${v}'`).join(',')})`;
    }
    if (search.country && search.country.length > 0) {
      where += ` and country ${search.countryOperation}(${search.country.map(v => `'${v}'`)})`;
      group += ' ,country ';
    }
    if (search.selectAppVersion && search.selectAppVersion.length > 0) {
      where += ` and app_version ${search.appVersionOperation}(${search.selectAppVersion.map(v => `'${v}'`)})`;
    }
    if (search.product) {
      where += ` and product_name in('${search.product}')`;
      group += ' ,product_name ';
    }
    return { where, group };
  };

  const getColumns = () => {
    // const dau_arpu_columns = search.statisticsType === 'day' || search.statisticsType === 'country'
    //   ? [
    //     {
    //       key: 'DAU',
    //       dataIndex: 'DAU',
    //       title: 'DAU',
    //     },
    //     {
    //       key: 'ARPU',
    //       dataIndex: 'ARPU',
    //       title: 'ARPU',
    //     },
    //   ]
    //   : [];
    // const curr = [dynamicColumn];
    if (JSON.stringify(search.statisticsType) === '["day"]') {
      setColumns(columnsMap.day);
    } else if (JSON.stringify(search.statisticsType) === '["placement_name"]') {
      setColumns(columnsMap.placement_name);
    } else {
      setColumns(columnsMap.day_placement_name);
    }
    // return curr;
  };
  // 获取表格数据
  const getList = async () => {
    // const resres = await getData(listsql);
    // console.log('resresres', resres);
    setLoading(true);

    const { where, group } = getWhereGroup(1);
    const { where: where2, group: group2 } = getWhereGroup(2);
    const { where: where3, group: group3 } = getWhereGroup(3);
    // const groupby = ` ${statisticsType}`;
    try {
      // listplacementsql
      let sql = '';
      if (JSON.stringify(search.statisticsType) === '["day"]') {
        sql = listDaysql;
      } else if (JSON.stringify(search.statisticsType) === '["placement_name"]') {
        sql = listplacementsql;
      } else {
        sql = listDayplacementsql;
      }
      // console.log('sqlsqlsqlsql', sql);
      // console.log('where', where2);
      // console.log('group', group2);
      sql = sql.replace(/#where1#/g, where)
        .replace(/#group1#/g, group)
        .replace(/#where2#/g, where2)
        .replace(/#where3#/g, where3)
        .replace(/#group2#/g, group2)
        .replace(/#group3#/g, group3);
      console.log('sqlsqlsqlsql', sql);
      const res = await getData(sql);
      const { data } = await GetVCMAdvPlacementList({ product: APPNAME_LIST[search.product] });
      // console.log('resres', res);
      const dataMap = {};
      data.forEach((element) => {
        dataMap[element.code] = element.name;
      });
      // if (res.length) {
      //   setColumns(Object.keys(res[0]).map(item => ({
      //     key: item,
      //     dataIndex: item,
      //     title: item,
      //   })));
      // }
      // const days = moment(search.endDate).diff(search.startDate, 'days') + 1;
      setDataList(res.map((item, index) => {
        item.key = `${item.ds + item.placement_id}${index}`;
        item.day = moment(item.ds, 'YYYYMMDD').format('YYYY-MM-DD');
        item.placementIdMap = dataMap;
        return item;
      }));
    } catch (ex) {
      console.log(ex);
    } finally {
      setLoading(false);
    }
  };

  // 获取图表数据
  const getChartList = async () => {
    setChartLoading(true);
    // const { where } = getWhereGroup();
    try {
      const { where, group } = getWhereGroup(1, true);
      const { where: where2, group: group2 } = getWhereGroup(2, true);
      const { where: where3 } = getWhereGroup(3, true);
      let sql = listDaysql;
      sql = sql.replace(/#where1#/g, where)
        .replace(/#group1#/g, group)
        .replace(/#where2#/g, where2)
        .replace(/#group2#/g, group2)
        .replace(/#where3#/g, where3);
      // console.log('sqlsqlsqlsql', sql);
      const res = await getData(sql);
      const dataList = res.map((item, index) => {
        item.key = `${item.ds + item.placement_id}${index}`;
        item.day = moment(item.ds, 'YYYYMMDD').format('YYYY-MM-DD');
        return item;
      });
      chartLineRender({
        data: dataList.flat(), node: document.getElementById('lineChart1'), y1: chartkeyinfo.chartkeynum1, y2: chartkeyinfo.chartkeynum2, keymap: chartKeyMap,
      });
      chartLineRender({
        data: dataList.flat(), node: document.getElementById('lineChart2'), y1: chartkeyinfo.chartkeynum3, y2: chartkeyinfo.chartkeynum4, keymap: chartKeyMap,
      });
    } catch (ex) {
      console.log(ex);
    } finally {
      setChartLoading(false);
    }
  };

  const onSearch = (params) => {
    setSearch(params);
  };

  useEffect(() => {
    getList();
    getColumns();
    getChartList();
  }, [search]);

  useEffect(() => {
    getChartList();
    // getChartList();
  }, [chartkeyinfo]);

  return (
    <div>
      <Query search={search} onSearch={onSearch}/>
      {/* <Spin spinning={chartLoading}>
        <div id="lineChart" />
      </Spin> */}
      {/* <p /> */}
      {/* <p /> */}
      <Row style={{ marginTop: 20, marginBottom: 20 }} gutter={16}>
        <Col span={12}>
          <Spin spinning={chartLoading}>
            <Card>
              <Select key="chartkey1" style={{ width: 200, marginRight: 8 }} value={chartkeyinfo.chartkeynum1} onChange={value => setchartkeyinfo({ chartkeynum1: value })}>
                {chartKey.map(v => <Option key={v.key} value={v.key}>{v.title}</Option>)}
              </Select>
              <span style={{ marginRight: 8 }}>和</span>
              <Select key="chartkey2" style={{ width: 200, marginRight: 8 }} value={chartkeyinfo.chartkeynum2} onChange={value => setchartkeyinfo({ chartkeynum2: value })}>
                {chartKey.map(v => <Option key={v.key} value={v.key}>{v.title}</Option>)}
              </Select>
              <div id="lineChart1" style={{ width: '100%' }}/>
            </Card>
          </Spin>
        </Col>
        <Col span={12}>
          <Spin spinning={chartLoading}>
            <Card>
              <Select key="chartkey3" style={{ width: 200, marginRight: 8 }} value={chartkeyinfo.chartkeynum3} onChange={value => setchartkeyinfo({ chartkeynum3: value })}>
                {chartKey.map(v => <Option key={v.key} value={v.key}>{v.title}</Option>)}
              </Select>
              <span style={{ marginRight: 8 }}>和</span>
              <Select key="chartkey4" style={{ width: 200, marginRight: 8 }} value={chartkeyinfo.chartkeynum4} onChange={value => setchartkeyinfo({ chartkeynum4: value })}>
                {chartKey.map(v => <Option key={v.key} value={v.key}>{v.title}</Option>)}
              </Select>
              <div id="lineChart2" style={{ width: '100%' }}/>
            </Card>
          </Spin>
        </Col>
      </Row>
      <Select placeholder="维度" mode="multiple" key="维度" style={{ width: 200, marginRight: 8 }} value={search.statisticsType} onChange={value => setSearch({ statisticsType: value })}>
        {StatiticsTypeList.map(v => <Option key={v.value} value={v.value}>{v.key}</Option>)}
      </Select>
      <DownLoadButton filename="广告业务数据分析" data={dataList} columns={columns} />
      <Table loading={loading} dataSource={dataList} columns={columns} />
    </div>
  );
};
