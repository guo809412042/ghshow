import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Collapse, Select, Button, message, DatePicker, Switch, Tag, Row, Tooltip,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import { literalOptions, numberOptions } from '../../common/constants';
import { getCountryAndAppVersionAndChannel, selectAttr, versionNumber } from '../../../utils/utils';
import styles from '../../../styles/index.less';
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
    ghPlatform: this.props.ghPlatform,
  };

  async componentDidMount() {
    this.getCountryAppVersionChannelList();
  }

  componentWillReceiveProps(nextPorps) {
    if (nextPorps.ghPlatform !== this.props.ghPlatform) {
      this.setState(
        {
          ghPlatform: nextPorps.ghPlatform,
        },
        this.getCountryAppVersionChannelList,
      );
    }
  }

  getCountryAppVersionChannelList = async () => {
    const { ghPlatform } = this.state;
    const { countryList, appVersionList, channelList } = await getCountryAndAppVersionAndChannel(ghPlatform);
    this.setState({
      countryList,
      appVersionList,
      channelList,
    });
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
    this.setState(
      {
        tags: newTags,
      },
      () => {
        this.props.queryButton({
          tags: newTags,
        });
      },
    );
  };

  dismiss = (item) => {
    let { tags } = this.state;
    tags = tags.filter(i => i !== item);
    this.setState(
      {
        tags,
      },
      () => {
        this.props.queryButton({
          tags,
        });
      },
    );
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
        this.setState(
          {
            tags: newTags,
          },
          () => this.props.queryButton({
            tags: newTags,
          }),
        );
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
      this.setState(
        {
          tags: newTags,
        },
        () => {
          const {
            colNum, hideNormal, startDate, endDate,
          } = this.state;
          this.props.queryButton({
            tags: newTags,
            colNum,
            hideNormal,
            startDate,
            endDate,
          });
        },
      );
    }
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
      tags,
    } = this.state;
    const { noChannel } = this.props;
    const colorArr = ['#2db7f5', '#87d068', '#108ee9', '#f50'];
    return (
      <Row>
        <RangePicker
          value={[startDate, endDate]}
          onChange={value => this.setState({ startDate: value[0], endDate: value[1] }, () => {
            this.props.queryButton({
              startDate: value[0],
              endDate: value[1],
            });
          })
          }
          style={{ marginBottom: 10 }}
        />

        <Switch
          style={{ float: 'right' }}
          onChange={e => this.setState({ colNum: e ? 24 : 12 }, () => {
            this.props.queryButton({
              colNum: e ? 24 : 12,
            });
          })
          }
          defaultChecked={false}
          checkedChildren="大图"
          unCheckedChildren="小图"
        />
        <Switch
          style={{ float: 'right', marginRight: 5 }}
          checkedChildren="隐藏默认"
          unCheckedChildren="显示默认"
          onChange={e => this.setState({ hideNormal: e }, () => {
            this.props.queryButton({
              hideNormal: e,
            });
          })
          }
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
            {noChannel ? '' : <div className={classNames(styles.circle, styles.textPink)} />}
            {noChannel ? (
              ''
            ) : (
              <Select {...selectAttr} value={channelOperation} onChange={e => this.setState({ channelOperation: e })}>
                {numberOptions}
              </Select>
            )}
            {noChannel ? (
              ''
            ) : (
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
            )}
            <Button type="primary" onClick={this.query}>
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
      </Row>
    );
  }
}
Index.propTypes = {
  ghPlatform: PropTypes.string,
  queryButton: PropTypes.func,
  noChannel: PropTypes.bool,
  noOther: PropTypes.bool,
};
Index.defaultProps = {
  ghPlatform: '1',
  queryButton: PropTypes.func,
  noChannel: false,
  noOther: false,
};
export default Index;
