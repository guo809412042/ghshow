/* eslint-disable no-restricted-syntax */
/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/10/28
 * Time: 下午5:24
 *
 */
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import {
  Collapse, Select, Button, message, DatePicker, Switch, Tag, Tooltip,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import * as sqlTemplate from './sqlTemplate';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';
import {
  literalOptions, numberOptions, chartRateListAndroid, chartRateListIOS,
} from '../../common/constants';
import { getCountryAndAppVersionAndChannel, selectAttr, versionNumber } from '../../../utils/utils';
import styles from '../../../styles/index.less';
import ChartView from '../../common/ChartView';
import { COUNTRY_COMMON_LIST } from '../../common/countrySelect';

const { RangePicker } = DatePicker;
class Index extends React.Component {
  state = {
    countryList: [],
    appVersionList: [],
    channelList: [],
    selectCountry: undefined,
    selectAppVersion: undefined,
    selectChannel: undefined,
    startDate: moment().subtract(31, 'days'),
    endDate: moment().subtract(1, 'days'),
    countryOperation: '=',
    appVersionOperation: '=',
    channelOperation: '=',
    tags: ['默认'],
    colNum: 12,
    hideNormal: false,
    ghPlatform: '1',
  };

  async componentDidMount() {
    this.getCountryAppVersionChannel(this.state.ghPlatform);
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.app.ghPlatform !== this.state.ghPlatform) {
      this.getCountryAppVersionChannel(nextProps.app.ghPlatform);
    }
  }

  getCountryAppVersionChannel = async (ghPlatform) => {
    const { countryList, appVersionList, channelList } = await getCountryAndAppVersionAndChannel(ghPlatform);
    this.setState({
      countryList,
      appVersionList,
      channelList,
      ghPlatform,
    });
  };

  query = async () => {
    const {
      selectAppVersion,
      appVersionOperation,
      selectCountry,
      countryOperation,
      selectChannel,
      channelOperation,
      tags,
    } = this.state;
    const findCountry = COUNTRY_COMMON_LIST.find(v => v.key === selectCountry);
    if (findCountry) {
      if (findCountry.key.includes('/')) {
        const newTags = _.clone(tags);
        const countryList = findCountry.key.split('/');
        countryList.forEach(async (i) => {
          const params = this.getAddQueryData(
            selectAppVersion,
            appVersionOperation,
            i,
            countryOperation,
            selectChannel,
            channelOperation,
          );
          if (!newTags.includes(params)) {
            newTags.push(params);
          }
        });
        this.setState({
          tags: newTags,
        });
      } else {
        this.addQuery();
      }
    } else {
      this.addQuery();
    }
  };

  getAddQueryData = (
    selectAppVersion,
    appVersionOperation,
    selectCountry,
    countryOperation,
    selectChannel,
    channelOperation,
  ) => {
    let params = '';
    if (!selectAppVersion && !selectCountry) {
      params = '默认';
    }
    if (selectCountry && countryOperation) {
      params += `${countryOperation} '${selectCountry}'`;
    }
    params += '||';
    if (selectAppVersion && appVersionOperation) {
      params += `${appVersionOperation} '${versionNumber(selectAppVersion)}'`;
    }
    params += '||';
    if (selectChannel && channelOperation) {
      params += `${channelOperation} '${selectChannel}'`;
    }
    return params;
  };

  addQuery = () => {
    const {
      selectAppVersion,
      appVersionOperation,
      selectCountry,
      countryOperation,
      selectChannel,
      channelOperation,
    } = this.state;
    const params = this.getAddQueryData(
      selectAppVersion,
      appVersionOperation,
      selectCountry,
      countryOperation,
      selectChannel,
      channelOperation,
    );
    this.isInTags(params);
  };

  isInTags = (params) => {
    const { tags } = this.state;
    if (tags.includes(params)) {
      message.error('该条件已经存在');
    } else {
      const newTags = _.clone(tags);
      newTags.push(params);
      this.setState({
        tags: newTags,
      });
    }
  };

  onCheck = (e) => {
    const { tags } = this.state;
    let newTags = _.clone(tags);
    if (e) {
      if (!newTags.includes('= \'中东\'||||')) {
        newTags.push('= \'中东\'||||');
      }
      if (!newTags.includes('= \'中国\'||||')) {
        newTags.push('= \'中国\'||||');
      }
      if (!newTags.includes('= \'印度\'||||')) {
        newTags.push('= \'印度\'||||');
      }
    } else {
      newTags = newTags.filter(i => i !== '= \'中东\'||||' && i !== '= \'中国\'||||' && i !== '= \'印度\'||||');
    }
    this.setState({
      tags: newTags,
    });
  };

  dismiss = (item) => {
    let { tags } = this.state;
    tags = tags.filter(i => i !== item);
    this.setState({
      tags,
    });
  };

  render() {
    const colorArr = ['#2db7f5', '#87d068', '#108ee9', '#f50'];
    const {
      countryList,
      channelList,
      appVersionList,
      selectAppVersion,
      selectChannel,
      selectCountry,
      countryOperation,
      appVersionOperation,
      channelOperation,
      startDate,
      endDate,
      tags,
      hideNormal,
      colNum,
      ghPlatform,
    } = this.state;
    const { app } = this.props;
    const { graphDefinition } = app;
    return (
      <div>
        {BreadcrumbMenu()}
        <RangePicker
          value={[startDate, endDate]}
          onChange={value => this.setState({ startDate: value[0], endDate: value[1] })}
          style={{ marginBottom: 10 }}
        />
        <Select
          style={{ marginLeft: 10, width: 120 }}
          value={ghPlatform}
          onChange={value => this.setState({ ghPlatform: value }, () => {
            this.getCountryAppVersionChannel(value);
          })
          }
        >
          <Select.Option key="1" value="1">
            Android
          </Select.Option>
          <Select.Option key="2" value="2">
            iOS
          </Select.Option>
        </Select>
        <Switch
          style={{ float: 'right' }}
          onChange={e => this.setState({ colNum: e ? 24 : 12 })}
          defaultChecked={false}
          checkedChildren="大图"
          unCheckedChildren="小图"
        />
        <Switch
          style={{ float: 'right', marginRight: 5 }}
          checkedChildren="隐藏默认"
          unCheckedChildren="显示默认"
          onChange={e => this.setState({ hideNormal: e })}
        />
        <Switch
          style={{ float: 'right', marginRight: 5 }}
          checkedChildren="常用地区"
          unCheckedChildren="常用地区"
          onChange={this.onCheck}
        />
        <Collapse defaultActiveKey={['1']}>
          <Collapse.Panel
            header={
              <div>
                <FormattedMessage id="common.search" />
              </div>
            }
            key="1"
          >
            <div className={classNames(styles.circle, styles.textPrimary)} />
            <Select {...selectAttr} value={countryOperation} onChange={e => this.setState({ countryOperation: e })}>
              {literalOptions}
            </Select>
            <Select
              {...selectAttr}
              placeholder="地区"
              value={selectCountry}
              onChange={e => this.setState({ selectCountry: e })}
            >
              {COUNTRY_COMMON_LIST.map(v => (
                <Select.Option ke={v.key} value={v.key}>
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
                <Select.Option key={item.key} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
            <div className={classNames(styles.circle, styles.textGreen)} />
            <Select
              {...selectAttr}
              value={appVersionOperation}
              onChange={e => this.setState({ appVersionOperation: e })}
            >
              {numberOptions}
            </Select>
            <Select
              placeholder="版本"
              {...selectAttr}
              value={selectAppVersion}
              onChange={value => this.setState({ selectAppVersion: value })}
            >
              {_.map(appVersionList, item => (
                <Select.Option key={item.key} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
            <div className={classNames(styles.circle, styles.textPink)} />
            <Select {...selectAttr} value={channelOperation} onChange={e => this.setState({ channelOperation: e })}>
              {numberOptions}
            </Select>
            <Select
              placeholder="渠道"
              {...selectAttr}
              value={selectChannel}
              onChange={value => this.setState({ selectChannel: value })}
            >
              {_.map(channelList, item => (
                <Select.Option key={item.key} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" onClick={this.query}>
              添加
            </Button>
          </Collapse.Panel>
        </Collapse>
        <div style={{ margin: '10px 0' }}>
          {tags.map((x, index) => (
            <Tag key={x} closable color={colorArr[index % 4]} afterClose={() => this.dismiss(x)}>
              {x}
            </Tag>
          ))}
        </div>

        <ChartView
          colNum={colNum}
          title="导出平均速率"
          graphDefinition={graphDefinition}
          graphName="导出平均速率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.exportAvgRateSQL}
          tags={tags}
          selectList={Number(ghPlatform) === 1 ? chartRateListAndroid : chartRateListIOS}
          chartFunc="exportAvgRateData"
          hideNormal={hideNormal}
          country="country"
        />
        <ChartView
          colNum={colNum}
          title="导出平均时长"
          graphDefinition={graphDefinition}
          graphName="导出平均时长"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.exportAvgTimeSQL}
          tags={tags}
          selectList={Number(ghPlatform) === 1 ? chartRateListAndroid : chartRateListIOS}
          chartFunc="exportAvgTimeData"
          hideNormal={hideNormal}
          country="country"
        />
        <ChartView
          colNum={colNum}
          title="导出成功率"
          graphDefinition={graphDefinition}
          graphName="导出成功率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.exportSuccessRateSQL}
          tags={tags}
          chartFunc="exportSuccessRateData"
          hideNormal={hideNormal}
          country="country"
          holo
        />
        <ChartView
          colNum={colNum}
          title="导出闪退率"
          graphDefinition={graphDefinition}
          graphName="导出闪退率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.exportExitRateSQL}
          tags={tags}
          chartFunc="exportExitRateData"
          hideNormal={hideNormal}
          country="country"
          holo
        />
        <ChartView
          colNum={colNum}
          title="APP导出失败率"
          graphDefinition={graphDefinition}
          graphName="APP导出失败率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.exportAppFailRateSQL}
          tags={tags}
          chartFunc="exportAppFailRateData"
          hideNormal={hideNormal}
          country="country"
          holo
        />
        <ChartView
          colNum={colNum}
          title="真实导出失败率"
          graphDefinition={graphDefinition}
          graphName="真实导出失败率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.exportFailRateSQL}
          tags={tags}
          chartFunc="exportFailRateData"
          hideNormal={hideNormal}
          country="country"
          holo
        />
        <ChartView
          colNum={colNum}
          title="导出取消率"
          graphDefinition={graphDefinition}
          graphName="导出取消率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.exportCancleRateSQL}
          tags={tags}
          chartFunc="exportCancleRateData"
          hideNormal={hideNormal}
          country="country"
          holo
        />
        <ChartView
          colNum={colNum}
          title="APP登录成功率"
          graphDefinition={graphDefinition}
          graphName="APP登录成功率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.appLoginSuccessRateSQL}
          tags={tags}
          chartFunc="appLoginSuccessRateData"
          hideNormal={hideNormal}
          country="country"
          holo
        />
        <ChartView
          colNum={colNum}
          title="APP登录失败率"
          graphDefinition={graphDefinition}
          graphName="APP登录失败率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.appLoginFailRateSQL}
          tags={tags}
          chartFunc="appLoginFailRateData"
          hideNormal={hideNormal}
          country="country"
          holo
        />
        <ChartView
          colNum={colNum}
          title="上传失败率"
          graphDefinition={graphDefinition}
          graphName="上传失败率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.uploadFailRateSQL}
          tags={tags}
          chartFunc="uploadFailRateData"
          hideNormal={hideNormal}
          country="country"
          holo
        />
        <ChartView
          colNum={colNum}
          title="上传取消率"
          graphDefinition={graphDefinition}
          graphName="上传取消率"
          startDate={startDate}
          endDate={endDate}
          ghPlatform={ghPlatform}
          sql={sqlTemplate.uploadCancelRateSQL}
          tags={tags}
          chartFunc="uploadFailCancelData"
          hideNormal={hideNormal}
          country="country"
          holo
        />
      </div>
    );
  }
}
Index.propTypes = {
  app: PropTypes.object,
};
Index.defaultProps = {
  app: PropTypes.object,
};
export default connect(({ app }) => ({ app }))(Index);
