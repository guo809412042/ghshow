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
  Collapse, Select, Button, message, DatePicker, Switch, Tag, Row, Tabs, Tooltip,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import * as sqlTemplate from './sqlTemplate';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';
import { literalOptions, numberOptions } from '../../common/constants';
import { getCountryAndAppVersionAndChannel, selectAttr, versionNumber } from '../../../utils/utils';
import styles from '../../../styles/index.less';
import ChartView from '../../common/ChartView';
import { COUNTRY_COMMON_LIST } from '../../common/countrySelect';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
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
    console.log(tags);
    let support = true;
    if (tags && tags.length > 0) {
      const find = tags.find((v) => {
        const conds = v.split('||');
        if (conds.length > 1) {
          if (conds[1]) {
            return true;
          }
        } else {
          return false;
        }
      });
      if (find) {
        support = false;
      }
    }
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
                  {item.group_name || item.value}
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="核心指标" key="1">
            <Row>
              <ChartView
                colNum={colNum}
                title={Number(ghPlatform) === 1 ? 'DAU' : 'DAU(真实)'}
                graphDefinition={graphDefinition}
                graphName="DAU"
                startDate={startDate}
                endDate={endDate}
                ghPlatform={ghPlatform}
                sql={sqlTemplate.DAU}
                tags={tags}
                chartFunc="DAU"
                product_type="viva"
                hideNormal={hideNormal}
                top
              />
              <ChartView
                colNum={colNum}
                title="新增设备数"
                graphDefinition={graphDefinition}
                graphName="新增设备数"
                startDate={startDate}
                endDate={endDate}
                ghPlatform={ghPlatform}
                sql={sqlTemplate.deviceAdditionSQL}
                tags={tags}
                chartFunc="deviceAdditionData"
                hideNormal={hideNormal}
                product_type="viva"
                top
              />
              <ChartView
                colNum={colNum}
                title={Number(ghPlatform) === 1 ? '次日留存' : '次日留存(真实)'}
                graphDefinition={graphDefinition}
                graphName={Number(ghPlatform) === 1 ? '次日留存' : '次日留存(真实)'}
                startDate={startDate}
                endDate={endDate}
                ghPlatform={ghPlatform}
                sql={sqlTemplate.stayRegSQL}
                tags={tags}
                chartFunc="stayRegData"
                hideNormal={hideNormal}
                product_type="viva"
                suffix
                style={{ marginBottom: 18 }}
              />
              <ChartView
                colNum={colNum}
                title="老用户留存"
                graphDefinition={graphDefinition}
                graphName="老用户留存"
                startDate={startDate}
                endDate={endDate}
                ghPlatform={ghPlatform}
                sql={sqlTemplate.olStayRegSQL}
                tags={tags}
                chartFunc="oldStayRegData"
                hideNormal={hideNormal}
                product_type="viva"
                suffix
                selectList={[
                  {
                    name: '一周',
                    value: '2',
                  },
                  {
                    name: '一月',
                    value: '3',
                  },
                  {
                    name: '一月以上',
                    value: '100',
                  },
                ]}
              />
              <ChartView
                colNum={colNum}
                title="工具用户次留"
                graphDefinition={graphDefinition}
                graphName="工具用户次留"
                startDate={startDate}
                endDate={endDate}
                ghPlatform={ghPlatform}
                sql={sqlTemplate.toolUserStaySQL}
                tags={tags}
                chartFunc="toolUserStayData"
                hideNormal={hideNormal}
                product_type="viva"
                suffix
              />
              <ChartView
                colNum={colNum}
                title="push点击"
                graphDefinition={graphDefinition}
                graphName="push点击"
                startDate={startDate}
                endDate={endDate}
                ghPlatform={ghPlatform}
                sql={sqlTemplate.pushClickSQL}
                tags={tags}
                chartFunc="pushClickData"
                hideNormal={hideNormal}
                radioList={[
                  { value: 'duid_total', name: '整体' },
                  { value: 'remote_duid_total', name: '运营推送' },
                  { value: 'local_duid_total', name: '本地推送' },
                ]}
                country="country"
              />
              <ChartView
                colNum={colNum}
                title="服务端次日留存"
                graphDefinition={graphDefinition}
                graphName="服务端次日留存"
                startDate={startDate}
                endDate={endDate}
                ghPlatform={ghPlatform}
                sql={sqlTemplate.Server1StaySQL}
                tags={tags}
                chartFunc="Server1StayData"
                hideNormal={hideNormal}
                product_type="2"
                suffix
                style={{ marginBottom: 18 }}
                radioList={[
                  { value: '', name: '整体' },
                  { value: ' and (media_source = \'Organic\' or media_source is null)', name: '自然' },
                  { value: ' and media_source <> \'Organic\'', name: '投放' },
                ]}
                support={support ? null : '该图表不支持版本筛选项'}
              />
              <ChartView
                colNum={colNum}
                title="服务端3日留存"
                graphDefinition={graphDefinition}
                graphName="服务端3日留存"
                startDate={startDate}
                endDate={endDate}
                ghPlatform={ghPlatform}
                sql={sqlTemplate.Server2StaySQL}
                tags={tags}
                chartFunc="Server2StayData"
                hideNormal={hideNormal}
                product_type="2"
                suffix
                style={{ marginBottom: 18 }}
                radioList={[
                  { value: '', name: '整体' },
                  { value: ' and (media_source = \'Organic\' or media_source is null)', name: '自然' },
                  { value: ' and media_source <> \'Organic\'', name: '投放' },
                ]}
                support={support ? null : '该图表不支持版本筛选项'}
              />
              <ChartView
                colNum={colNum}
                title="服务端7日留存"
                graphDefinition={graphDefinition}
                graphName="服务端7日留存"
                startDate={startDate}
                endDate={endDate}
                ghPlatform={ghPlatform}
                sql={sqlTemplate.Server6StaySQL}
                tags={tags}
                chartFunc="Server6StayData"
                hideNormal={hideNormal}
                product_type="2"
                suffix
                style={{ marginBottom: 18 }}
                radioList={[
                  { value: '', name: '整体' },
                  { value: ' and (media_source = \'Organic\' or media_source is null)', name: '自然' },
                  { value: ' and media_source <> \'Organic\'', name: '投放' },
                ]}
                support={support ? null : '该图表不支持版本筛选项'}
              />
            </Row>
          </TabPane>
        </Tabs>
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
