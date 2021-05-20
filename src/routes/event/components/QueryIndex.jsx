/* eslint-disable no-restricted-syntax */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Select, Collapse, DatePicker, Button,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import {
  selectAttr, getCountryAndAppVersionAndChannel, numberTVersion, versionNumber,
} from '../../../utils/utils';
import styles from '../../../styles/index.less';
import { literalOptions, numberOptions } from '../../common/constants';
import { getHoloData } from '../../../utils/request';

const { RangePicker } = DatePicker;
class Index extends React.Component {
  state = {
    countryList: [],
    appVersionList: [],
    channelList: [],
    selectCountry: undefined,
    selectAppVersion: this.props.selectAppVersion,
    selectChannel: undefined,
    startDate: moment().subtract(31, 'days'),
    endDate: moment().subtract(1, 'days'),
    countryOperation: '=',
    appVersionOperation: '=',
    channelOperation: '=',
    ghPlatform: this.props.ghPlatform,
    product: this.props.product,
    database: this.props.database,
    productName: this.props.productName || 'product',
    channelName: this.props.channelName,
  };

  async componentDidMount() {
    await this.getCountryAndAppVersionAndChannelList();
    this.onSearch();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ghPlatform !== this.state.ghPlatform) {
      this.setState(
        {
          ghPlatform: nextProps.ghPlatform,
        },
        this.getCountryAndAppVersionAndChannelList,
      );
    }
    if (nextProps.product !== this.state.product) {
      this.setState(
        {
          product: nextProps.product,
        },
        this.getCountryAndAppVersionAndChannelList,
      );
    }
    if (nextProps.selectAppVersion && nextProps.selectAppVersion !== this.state.selectAppVersion) {
      this.setState(
        {
          selectAppVersion: nextProps.selectAppVersion,
        },
      );
    }
  }

  getCountryAndAppVersionAndChannelList = async () => {
    const {
      ghPlatform, product, database, productName,
    } = this.state;
    const {
      noAndroid, noIOS, appVersionApi, noChannel,
    } = this.props;
    const { countryList, appVersionList } = await getCountryAndAppVersionAndChannel(product, ghPlatform);
    const appversionSql = `select DISTINCT(app_version) from ${database} ${
      !noAndroid && !noIOS ? `where ${productName}='${product}'` : ''
    } order by app_version desc  `;
    const res = await getHoloData(appversionSql);
    const appVersionRes = appVersionApi
      ? appVersionList.map(v => ({
        key: versionNumber(v.value),
        value: v.value,
      }))
      : res.map(v => ({
        key: v.app_version,
        value: numberTVersion(v.app_version),
      }));
    if (!noChannel) {
      const channelRes = await getHoloData(`select DISTINCT(channel) from ${database}`);
      if (ghPlatform * 1 === 2) {
        const data = [
          'FBad',
          'douyin',
          'firebase_source',
          'linkedme_source',
          'ASM',
          'Organic',
          'UAC source',
          'tempo_share',
          'tiktok',
        ].map(v => ({ channel: v }));
        for (const i of channelRes) {
          if (
            ![
              'FBad',
              'douyin',
              'firebase_source',
              'linkedme_source',
              'ASM',
              'Organic',
              'UAC source',
              'tempo_share',
              'tiktok',
            ].includes(i.channel)
          ) {
            data.push(i);
          }
        }
        this.setState({
          channelList: data,
        });
      } else {
        this.setState({
          channelList: channelRes,
        });
      }
    }
    this.setState({
      countryList,
      appVersionList: appVersionRes,
    });
  };

  onSearch = () => {
    const {
      appVersionOperation, channelOperation, selectChannel, selectAppVersion, startDate, endDate,
    } = this.state;
    let { countryOperation, selectCountry } = this.state;
    if (selectCountry === '中东') {
      countryOperation = countryOperation === '=' ? 'in' : 'not in ';
      selectCountry = '(\'阿尔及利亚\',\'巴林\',\'埃及\',\'约旦\',\'科威特\',\'黎巴嫩\',\'利比亚\',\'摩洛哥\', \'阿曼\',\'卡塔尔\',\'沙特阿拉伯\',\'突尼斯\',\'阿联酋\',\'阿拉伯联合酋长国\',\'巴勒斯坦\',\'也门\',\'伊拉克\',\'叙利亚\')';
    } else if (selectCountry === '独联体') {
      countryOperation = countryOperation === '=' ? 'in' : 'not in ';
      selectCountry = '(\'亚美尼亚\',\'阿塞拜疆\',\'白俄罗斯\',\'哈萨克斯坦\',\'吉尔吉斯斯坦\',\'摩尔多瓦\',\'俄罗斯\',\'塔吉克斯坦\',\'乌兹别克斯坦\')';
    } else if (selectCountry) {
      selectCountry = `'${selectCountry}'`;
    }
    this.props.onSearch({
      appVersionOperation,
      countryOperation,
      channelOperation,
      selectChannel,
      selectAppVersion,
      selectCountry,
      startDate,
      endDate,
    });
  };

  render() {
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
      channelName,
    } = this.state;
    const { noChannel, noAppversion, operation } = this.props;
    return (
      <div>
        <RangePicker
          value={[startDate, endDate]}
          onChange={value => this.setState({ startDate: value[0], endDate: value[1] }, this.onSearch)}
          style={{ marginBottom: 10 }}
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
            {operation && (
              <Select {...selectAttr} value={countryOperation} onChange={e => this.setState({ countryOperation: e })}>
                {literalOptions}
              </Select>
            )}
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
              {_.map(countryList, item => (
                <Select.Option key={item.key} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
            {noAppversion ? '' : <div className={classNames(styles.circle, styles.textGreen)} />}
            {noAppversion
              ? ''
              : operation && (
                <Select
                  {...selectAttr}
                  value={appVersionOperation}
                  onChange={e => this.setState({ appVersionOperation: e })}
                >
                  {numberOptions}
                </Select>
              )}
            {noAppversion ? (
              ''
            ) : (
              <Select
                placeholder="版本"
                {...selectAttr}
                defaultValue={selectAppVersion}
                onChange={(value) => {
                  this.setState({ selectAppVersion: value });
                }}
              >
                {_.map(appVersionList, item => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>
            )}
            {noChannel ? '' : <div className={classNames(styles.circle, styles.textPink)} />}
            {noChannel
              ? ''
              : operation && (
                <Select
                  {...selectAttr}
                  value={channelOperation}
                  onChange={e => this.setState({ channelOperation: e })}
                >
                  {literalOptions}
                </Select>
              )}
            {noChannel ? (
              ''
            ) : (
              <Select
                placeholder={channelName}
                {...selectAttr}
                value={selectChannel}
                onChange={value => this.setState({ selectChannel: value })}
              >
                {_.map(channelList, item => (
                  <Select.Option key={item.channel} value={item.channel}>
                    {item.channel}
                  </Select.Option>
                ))}
              </Select>
            )}
            <Button type="primary" onClick={this.onSearch}>
              查询
            </Button>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}
Index.propTypes = {
  ghPlatform: PropTypes.string,
  noChannel: PropTypes.bool,
  noAppversion: PropTypes.bool,
  onSearch: PropTypes.func,
  operation: PropTypes.bool,
  channelName: PropTypes.string,
};
Index.defaultProps = {
  ghPlatform: '1',
  noChannel: false,
  noAppversion: false,
  onSearch: () => {},
  operation: true,
  channelName: '渠道',
};
export default Index;
