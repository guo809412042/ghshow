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
  Collapse, Select, Button, message, DatePicker, Switch, Tag, Row,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import * as sqlTemplate from './sqlTemplate';
import { BreadcrumbMenu } from '../common/BreadcrumbMenu';
import { literalOptions, numberOptions } from '../common/constants';
import { getCountryAndAppVersionAndChannel, selectAttr, versionNumber } from '../../utils/utils';
import styles from '../../styles/index.less';
import ChartView from './ChartView';
import { getTempoChannelList } from './tempo/requst';

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
    productId: this.props.productId,
  };

  async componentDidMount() {
    this.getCountryAndAppVersionAndChannelList();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.productId !== nextProps.productId) {
      this.setState(
        {
          productId: nextProps.productId,
          ghPlatform: '1',
        },
        this.getCountryAndAppVersionAndChannelList,
      );
    }
  }

  getCountryAndAppVersionAndChannelList = async () => {
    const { countryList, appVersionList, channelList } = await getCountryAndAppVersionAndChannel(
      this.state.ghPlatform,
      this.state.productId,
    );
    if (this.props.product === 'tempo') {
      const c = await getTempoChannelList();
      channelList.splice(0, channelList.length, ...c);
    }
    this.setState({
      countryList,
      appVersionList,
      channelList,
    });
  };

  addQuery = () => {
    const {
      selectAppVersion,
      appVersionOperation,
      selectCountry,
      countryOperation,
      selectChannel,
      channelOperation,
      tags,
    } = this.state;
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
    const { app, product, productId } = this.props;
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
          onChange={value => this.setState({ ghPlatform: value }, this.getCountryAndAppVersionAndChannelList)}
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
              <Select.Option key="中东" value="中东">
                中东
              </Select.Option>
              <Select.Option key="独联体" value="独联体">
                独联体
              </Select.Option>
              <Select.Option key="欧美" value="欧美">
                欧美
              </Select.Option>
              <Select.Option key="拉美" value="拉美">
                拉美
              </Select.Option>
              <Select.Option key="东南亚十国" value="东南亚十国">
                东南亚十国
              </Select.Option>
              <Select.Option key="俄语区" value="俄语区">
                俄语区
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
                  {item.key}
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" onClick={this.addQuery}>
              添加
            </Button>
          </Collapse.Panel>
        </Collapse>
        <div style={{ margin: '10px 0' }}>
          {tags.map((x, index) => (
            <Tag key={x} closable color={colorArr[index % 4]} onClose={() => this.dismiss(x)}>
              {x}
            </Tag>
          ))}
        </div>
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
            product_type={product}
            hideNormal={hideNormal}
          />
          <ChartView
            colNum={colNum}
            title={Number(ghPlatform) === 1 ? productId === 18 ? '新用户次留' : '次日留存' : '次日留存(真实)'}
            graphDefinition={graphDefinition}
            graphName={Number(ghPlatform) === 1 ? '次日留存' : '次日留存(真实)'}
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.stayRegSQL}
            tags={tags}
            chartFunc="stayRegData"
            hideNormal={hideNormal}
            product_type={product}
            suffix
          />
          {productId === 18 && <ChartView
            colNum={colNum}
            title="新用户7日Rolling留存"
            graphDefinition={graphDefinition}
            graphName="新用户7日Rolling留存"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.stayRollRegSQL}
            tags={tags}
            chartFunc="stayRollling7RegData"
            hideNormal={hideNormal}
            product_type={product}
            appverNoFromat
            suffix
            selectList={[
              {
                name: '新用户',
                value: '(1)',
              },
            ]}
          />}
          {productId === 18 && <ChartView
            colNum={colNum}
            title="老用户7日Rolling留存"
            graphDefinition={graphDefinition}
            graphName="老用户7日Rolling留存"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.stayRollRegSQL}
            tags={tags}
            chartFunc="oldstayRollling7RegData"
            hideNormal={hideNormal}
            product_type={product}
            appverNoFromat
            suffix
            selectList={[
              {
                name: '老用户',
                value: '(2, 3, 100)',
              },
              {
                name: '一周',
                value: '(2)',
              },
              {
                name: '一月',
                value: '(3)',
              },
              {
                name: '一月以上',
                value: '(100)',
              },
            ]}
          />}
          <ChartView
            colNum={colNum}
            title={productId === 18 ? '老用户次留' : '老用户留存'}
            graphDefinition={graphDefinition}
            graphName="老用户留存"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.olStayRegSQL}
            tags={tags}
            chartFunc="oldStayRegData"
            hideNormal={hideNormal}
            product_type={product}
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
            product_type={product}
          />
          {productId === 10 && <ChartView
            colNum={colNum}
            title="每日累计用户量"
            graphDefinition={graphDefinition}
            graphName="每日累计用户量"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.tempCumulativeUsers}
            tags={tags}
            chartFunc="cumulativeUsers"
            hideNormal={hideNormal}
            product_type={product}
          />}
        </Row>
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
