/* eslint-disable react/prop-types */
import React from 'react';
import {
  Select, DatePicker, Button, Tag, message,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { literalOptions, numberOptions } from '../../../common/constants';
import { selectAttr1, getCountryAndAppVersionAndChannel } from '../../../../utils/utils';

const { RangePicker } = DatePicker;
class Query extends React.Component {
  state = {
    appVersionList: [],
    countryOperation: '=',
    selectCountry: undefined,
    appVersionOperation: '=',
    selectAppVersion: undefined,
    selectUserType: '1',
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(1, 'days'),
    platform: this.props.platform,
    tags: ['全球'],
  };

  async componentDidMount() {
    this.getAppVersion();
  }

  componentWillReceiveProps(nextPorps) {
    if (nextPorps.platform !== this.state.platform) {
      this.setState(
        {
          platform: nextPorps.platform,
        },
        this.getAppVersion,
      );
    }
  }

  getAppVersion = async () => {
    const { platform } = this.state;
    const { appVersionList } = await getCountryAndAppVersionAndChannel(platform);
    this.setState({
      appVersionList,
    });
  };

  onSearch = () => {
    const {
      countryOperation,
      selectCountry,
      appVersionOperation,
      selectAppVersion,
      selectUserType,
      startDate,
      endDate,
      tags,
    } = this.state;

    if (!selectCountry && !selectAppVersion) {
      message.warning('改搜索条件已经存在');
      return;
    }
    const $search = `${countryOperation + (selectCountry ? `'${selectCountry}'` : '全球')}||${appVersionOperation}${
      selectAppVersion ? `'${selectAppVersion}'` : '全版本'
    }`;
    if (!tags.includes($search)) {
      tags.push($search);
    } else {
      message.warning('改搜索条件已经存在');
      return;
    }
    this.props.onSearch({
      selectUserType,
      startDate,
      endDate,
      tags,
    });
  };

  dismiss = (x) => {
    let { tags } = this.state;
    tags = tags.filter(v => v !== x);
    this.setState(
      {
        tags,
      },
      () => {
        this.props.onSearch({
          tags,
        });
      },
    );
  };

  render() {
    const colorArr = ['#2db7f5', '#87d068', '#108ee9', '#f50'];
    const {
      countryOperation,
      selectCountry,
      selectUserType,
      appVersionOperation,
      selectAppVersion,
      appVersionList,
      startDate,
      endDate,
      tags,
    } = this.state;
    return (
      <div style={{ marginTop: 10 }}>
        <Select {...selectAttr1} value={countryOperation} onChange={e => this.setState({ countryOperation: e })}>
          {literalOptions}
        </Select>
        <Select
          {...selectAttr1}
          value={selectCountry}
          onChange={e => this.setState({ selectCountry: e })}
          placeholder="地区"
        >
          <Select.Option key="中国" value="中国">
            中国
          </Select.Option>
          <Select.Option key="美国" value="美国">
            美国
          </Select.Option>
          <Select.Option key="韩国" value="韩国">
            韩国
          </Select.Option>
          <Select.Option key="日本" value="日本">
            日本
          </Select.Option>
          <Select.Option key="台湾" value="台湾">
            台湾
          </Select.Option>
          <Select.Option key="泰国" value="泰国">
            泰国
          </Select.Option>
          <Select.Option key="巴西" value="巴西">
            巴西
          </Select.Option>
          <Select.Option key="印度尼西亚" value="印度尼西亚">
            印度尼西亚
          </Select.Option>
        </Select>
        <div style={{ display: 'inline-block', width: 16 }} />
        <Select {...selectAttr1} value={appVersionOperation} onChange={e => this.setState({ appVersionOperation: e })}>
          {numberOptions}
        </Select>
        <Select
          placeholder="版本"
          {...selectAttr1}
          value={selectAppVersion}
          onChange={value => this.setState({ selectAppVersion: value })}
        >
          {_.map(appVersionList, item => (
            <Select.Option key={item.key} value={item.value}>
              {item.value}
            </Select.Option>
          ))}
        </Select>
        <div style={{ display: 'inline-block', width: 16 }} />
        <Select
          {...{ ...selectAttr1, allowClear: false }}
          value={selectUserType}
          onChange={e => this.setState({ selectUserType: e }, () => {
            this.props.onSearch({
              selectUserType: e,
            });
          })
          }
          placeholder="用户"
        >
          <Select.Option key="1" value="1">
            整体
          </Select.Option>
          <Select.Option key="2" value="2">
            新用户
          </Select.Option>
          <Select.Option key="3" value="3">
            老用户
          </Select.Option>
        </Select>
        <RangePicker
          value={[startDate, endDate]}
          onChange={value => this.setState({ startDate: value[0], endDate: value[1] }, () => {
            this.props.onSearch({
              startDate: value[0],
              endDate: value[1],
            });
          })
          }
          style={{ marginLeft: 8, width: 250 }}
        />
        <Button onClick={this.onSearch} type="primary" style={{ margin: '10px 0 0 0' }}>
          搜索
        </Button>
        <div>
          {tags.map((x, index) => (
            <Tag key={x} closable={x !== '全球'} color={colorArr[index % 4]} afterClose={() => this.dismiss(x)}>
              {x}
            </Tag>
          ))}
        </div>
      </div>
    );
  }
}

export default Query;
