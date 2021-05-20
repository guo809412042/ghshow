/* eslint-disable prefer-const */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Card,
  Tooltip,
  Icon,
  DatePicker,
  // notification,
  Radio,
  Select,
} from 'antd';
import moment from 'moment';
import { DownLoadButton } from './DownLoadButton';
import getChartDataFun from './getChartData';
import { ChartRender } from './drawChart';
import { createSql } from '../../utils/utils';
import { getData, getHoloData } from '../../utils/request';
import { countryLevel2, countryLevel3, countryLevel1 } from './countrySelect';
import { ANNOTATION } from '../../utils/const';

const { RangePicker } = DatePicker;
class ChartView extends React.Component {
  state = {
    startDate: this.props.startDate,
    endDate: this.props.endDate,
    columns: [],
    dataSource: [],
    tags: this.props.tags,
    ghPlatform: this.props.ghPlatform,
    colNum: 12,
    hideNormal: this.props.hideNormal,
    exportData: [],
    selectValue: this.props.selectList.length ? this.props.selectList[0].value : '',
    radioValue: this.props.radioList.length ? this.props.radioList[0].value : '',
    userSelectValue: '',
    selectList: [],
    country: this.props.country || 'country_name',
    support: false,
  };

  componentDidMount() {
    this.getFetch();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate !== this.state.startDate || nextProps.endDate !== this.state.endDate) {
      this.setState(
        {
          startDate: nextProps.startDate,
          endDate: nextProps.endDate,
        },
        this.getFetch,
      );
    }
    if (nextProps.selectList !== this.state.selectList) {
      this.setState({
        selectList: nextProps.selectList,
        selectValue: nextProps.selectList.length ? nextProps.selectList[0].value : '',
      });
    }
    if (nextProps.ghPlatform !== this.state.ghPlatform) {
      this.setState(
        {
          ghPlatform: nextProps.ghPlatform,
          // selectValue: nextProps.selectList.length ? nextProps.selectList[0].value : '',
        },
        this.getFetch,
      );
    }

    if (nextProps.tags !== this.state.tags) {
      this.setState(
        {
          tags: nextProps.tags,
        },
        this.getFetch,
      );
    }
    if (nextProps.colNum !== this.state.colNum) {
      this.setState(
        {
          colNum: nextProps.colNum,
        },
        () => {
          ChartRender(this.state.dataSource, nextProps.chartFunc, nextProps.suffix, nextProps.hideNormal);
        },
      );
    }
    if (nextProps.hideNormal !== this.state.hideNormal) {
      this.setState(
        {
          hideNormal: nextProps.colNum,
        },
        () => {
          ChartRender(this.state.dataSource, nextProps.chartFunc, nextProps.suffix, nextProps.hideNormal);
        },
      );
    }
    if (nextProps.support !== this.state.support) {
      this.setState(
        {
          support: nextProps.support,
        },
        () => {
          this.getFetch();
        },
      );
    }
  }

  getFetch = async () => {
    const {
      startDate, endDate, ghPlatform, selectValue, radioValue, userSelectValue, country,
    } = this.state;
    const {
      type,
      tags,
      chartFunc,
      suffix,
      hideNormal,
      database,
      databaseName,
      databaseAppVersionName,
      radioList,
      userSelect,
      selectList,
      holo,
      product_type,
      app_version = 'app_version_col',
    } = this.props;
    let sql = createSql(this.props.sql, startDate, endDate, ghPlatform, 2);
    sql = sql
      .replace(/#querytype#/g, type ? ` and type = ${Number(ghPlatform) === 1 ? 0 : 1}` : '')
      .replace(/#product_type#/, product_type);
    let dataSource = [];
    let exportData = [];
    await Promise.all(
      tags.map(async (i) => {
        let query = '';
        let databaseCurrentName = databaseName;
        if (i !== '默认') {
          const v = i.split('||');
          if (v[0] && v[0] !== '默认') {
            if (v[0].includes('中东')) {
              if (v[0].includes('=')) {
                query += `and ${country} in (\'阿尔及利亚\',\'巴林\',\'埃及\',\'约旦\',\'科威特\',\'黎巴嫩\',\'利比亚\',\'摩洛哥\',\'阿曼\',\'卡塔尔\',\'沙特阿拉伯\',\'突尼斯\',\'阿联酋\',\'阿拉伯联合酋长国\',\'巴勒斯坦\',\'也门\',\'伊拉克\',\'叙利亚\')`;
              } else {
                query += ` and ${country} not  in (\'阿尔及利亚\',\'巴林\',\'埃及\',\'约旦\',\'科威特\',\'黎巴嫩\',\'利比亚\',\'摩洛哥\',\'阿曼\',\'卡塔尔\',\'沙特阿拉伯\',\'突尼斯\',\'阿联酋\',\'阿拉伯联合酋长国\',\'巴勒斯坦\',\'也门\',\'伊拉克\',\'叙利亚\')`;
              }
            } else if (v[0].includes('独联体')) {
              if (v[0].includes('=')) {
                query += ` and ${country} in (\'亚美尼亚\',\'阿塞拜疆\',\'白俄罗斯\',\'哈萨克斯坦\',\'吉尔吉斯斯坦\',\'摩尔多瓦\',\'俄罗斯\',\'塔吉克斯坦\',\'乌兹别克斯坦\')`;
              } else {
                query += ` and ${country} not in (\'亚美尼亚\',\'阿塞拜疆\',\'白俄罗斯\',\'哈萨克斯坦\',\'吉尔吉斯斯坦\',\'摩尔多瓦\',\'俄罗斯\',\'塔吉克斯坦\',\'乌兹别克斯坦\')`;
              }
            } else if (v[0].includes('第一梯度')) {
              const countryList = countryLevel1;
              if (v[0].includes('=')) {
                query += `and ${country} in (${countryList})`;
              } else {
                query += ` and ${country} not  in (${countryList})`;
              }
            } else if (v[0].includes('第二梯度')) {
              const countryList = countryLevel2;
              if (v[0].includes('=')) {
                query += `and ${country} in (${countryList})`;
              } else {
                query += ` and ${country} not  in (${countryList})`;
              }
            } else if (v[0].includes('第三梯度')) {
              const countryList = countryLevel3;
              if (v[0].includes('=')) {
                query += `and ${country} in (${countryList})`;
              } else {
                query += ` and ${country} not  in (${countryList})`;
              }
            } else {
              query += ` and ${country} ${v[0]}`;
            }
          }
          if (v[1]) {
            query += ` and ${app_version} ${v[1]}`;
            databaseCurrentName = databaseAppVersionName;
          }
          if (v[2]) {
            query += ` and channel ${v[2]}`;
          }
        }
        let querySql = sql.replace(/#quersql#/g, query);
        if (database) {
          querySql = querySql.replace(/#database#/g, databaseCurrentName);
        }
        if (selectList && selectList.length) {
          querySql = querySql.replace(/#selectValue#/g, selectValue);
          if (selectValue.includes('/')) {
            querySql = querySql
              .replace(/#selectValue1#/g, selectValue.split('/')[0])
              .replace(/#selectValue2#/g, selectValue.split('/')[1]);
          }
        }
        if (radioList.length) {
          querySql = querySql.replace(/#radioValue#/g, radioValue);
        }
        if (userSelect) {
          querySql = querySql.replace(/#userValue#/g, userSelectValue);
        }
        let res;
        if (holo) {
          res = await getHoloData(querySql);
        } else {
          res = await getData(querySql);
        }
        let { list, exportList } = getChartDataFun[chartFunc](res, i, radioValue, userSelectValue);
        dataSource = dataSource.concat(list);
        exportList = exportList.map(v => ({
          ...v,
          type: i,
        }));
        exportData = exportData.concat(exportList);
      }),
    );

    let columns = [];
    if (exportData.length) {
      columns = Object.keys(exportData[0]).map(i => ({ key: i, title: i }));
    }
    this.setState({
      dataSource,
      exportData,
      columns,
    });
    ChartRender(dataSource, chartFunc, suffix, hideNormal);
  };

  render() {
    // console.log(this.state);
    const {
      title, graphDefinition, graphName, chartFunc, userSelect, selectList, radioList, style,
    } = this.props;
    const {
      startDate,
      endDate,
      columns,
      colNum,
      exportData,
      radioValue,
      userSelectValue,
      selectValue,
      support,
    } = this.state;
    let graphDefinitionText = '';
    const find = graphDefinition.find(v => v.graph_name === graphName);
    if (find) {
      graphDefinitionText = find.graph_definition;
    }
    return (
      <Col span={colNum} style={{ marginBottom: 20, paddingRight: 20, ...style }}>
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
            onChange={value => this.setState({ startDate: value[0], endDate: value[1] }, this.getFetch)}
          />
          {radioList.length ? (
            <Radio.Group
              style={{ marginLeft: 10 }}
              buttonStyle="solid"
              defaultValue={radioValue}
              onChange={e => this.setState({ radioValue: e.target.value }, this.getFetch)}
            >
              {radioList.map(v => (
                <Radio.Button key={v.value} value={v.value}>
                  {v.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          ) : (
            ''
          )}
          {userSelect ? (
            <Radio.Group
              buttonStyle="solid"
              defaultValue={userSelectValue}
              onChange={e => this.setState({ userSelectValue: e.target.value }, this.getFetch)}
              style={{ marginLeft: 10 }}
            >
              <Radio.Button key="" value="">
                所有用户
              </Radio.Button>
              <Radio.Button key="and new_user = 1" value="and new_user = 1">
                新用户
              </Radio.Button>
              <Radio.Button key="and new_user = 2" value="and new_user = 2">
                老用户
              </Radio.Button>
            </Radio.Group>
          ) : (
            ''
          )}
          {selectList.length ? (
            <Select
              style={{ width: 120, marginBottom: 20, marginLeft: 10 }}
              value={selectValue}
              onChange={e => this.setState({ selectValue: e }, this.getFetch)}
            >
              {selectList.map(v => (
                <Select.Option key={v.value} value={v.value}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <div style={{ marginBottom: 20 }} />
          )}
          {support ? (
            <>
              <strong>{support}</strong>
            </>
          ) : (
            <div style={{ minHeight: 250 }} id={`chart-${chartFunc}`} width="100%" />
          )}
        </Card>
      </Col>
    );
  }
}
ChartView.propTypes = {
  startDate: PropTypes.object,
  ghPlatform: PropTypes.string,
  endDate: PropTypes.object,
  tags: PropTypes.array,
  hideNormal: PropTypes.bool,
  colNum: PropTypes.number,
  title: PropTypes.string,
  graphDefinition: PropTypes.array,
  graphName: PropTypes.string,
  chartFunc: PropTypes.string,
  userSelect: PropTypes.bool,
  type: PropTypes.bool,
  sql: PropTypes.string,
  suffix: PropTypes.bool,
  databaseName: PropTypes.string,
  databaseAppVersionName: PropTypes.string,
  database: PropTypes.bool,
  selectList: PropTypes.array,
  radioList: PropTypes.array,
  style: PropTypes.object,
};
ChartView.defaultProps = {
  startDate: moment().subtract(31, 'days'),
  ghPlatform: '1',
  endDate: moment().subtract(1, 'days'),
  tags: [],
  hideNormal: false,
  colNum: 12,
  title: '',
  graphDefinition: [],
  graphName: '',
  chartFunc: '',
  userSelect: false,
  type: false,
  sql: '',
  suffix: false,
  databaseName: undefined,
  databaseAppVersionName: undefined,
  database: false,
  selectList: [],
  radioList: [],
  style: {},
};

export default ChartView;
