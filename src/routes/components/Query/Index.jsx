import React from 'react';
import PropTypes from 'prop-types';
import {
  Select, Collapse, DatePicker, Button,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import { selectAttr, getCountryAndAppVersionAndChannel } from '../../../utils/utils';
import styles from '../../../styles/index.less';
import { literalOptions, numberOptions } from '../../common/constants';

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
    ghPlatform: this.props.ghPlatform,
    product: this.props.product,
    channelData: this.props.channelData || [],
  };

  componentDidMount() {
    this.getCountryAndAppVersionAndChannelList();
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
    if (nextProps.channelData !== this.state.channelData) {
      this.setState(
        {
          channelData: nextProps.channelData,
        },
        this.getCountryAndAppVersionAndChannelList,
      );
    }
  }

  getCountryAndAppVersionAndChannelList = async () => {
    const { ghPlatform, product, channelData = [] } = this.state;
    const { countryList, appVersionList, channelList } = await getCountryAndAppVersionAndChannel(product, ghPlatform);
    this.setState({
      countryList,
      appVersionList,
      channelList: channelData.length ? channelData : channelList,
    });
  };

  onSearch = () => {
    const {
      appVersionOperation, channelOperation, selectChannel, selectAppVersion, startDate, endDate,
    } = this.state;
    let { countryOperation, selectCountry } = this.state;
    if (selectCountry === '??????') {
      countryOperation = countryOperation === '=' ? 'in' : 'not in ';
      selectCountry = '(\'???????????????\',\'??????\',\'??????\',\'??????\',\'?????????\',\'?????????\',\'?????????\',\'?????????\', \'??????\',\'?????????\',\'???????????????\',\'?????????\',\'?????????\',\'????????????????????????\',\'????????????\',\'??????\',\'?????????\',\'?????????\')';
    } else if (selectCountry === '?????????') {
      countryOperation = countryOperation === '=' ? 'in' : 'not in ';
      selectCountry = '(\'????????????\',\'????????????\',\'????????????\',\'???????????????\',\'??????????????????\',\'????????????\',\'?????????\',\'???????????????\',\'??????????????????\')';
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
              placeholder="??????"
              value={selectCountry}
              onChange={e => this.setState({ selectCountry: e })}
            >
              <Select.Option key="??????" value="??????">
                ??????
              </Select.Option>
              <Select.Option key="?????????" value="?????????">
                ?????????
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
                placeholder="??????"
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
                placeholder="??????"
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
            )}
            <Button type="primary" onClick={this.onSearch}>
              ??????
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
};
Index.defaultProps = {
  ghPlatform: '1',
  noChannel: false,
  noAppversion: false,
  onSearch: () => {},
  operation: true,
};
export default Index;
