import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Select } from 'antd';
import _ from 'lodash';
import QueryIndex from '../../components/Query/Index';
import { OrderText } from './constant';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';
import { activeSql } from './sqlTemplate';
import { createSql, getCountryAndAppVersionAndChannel } from '../../../utils/utils';
import { getData } from '../../../utils/request';

class Index extends React.Component {
  state = {
    order: 'country_name',
    startDate: moment().subtract(31, 'days'),
    endDate: moment().subtract(1, 'days'),
    selectAppVersion: undefined,
    selectChannel: undefined,
    selectCountry: undefined,
    ghPlatform: this.props.app.ghPlatform,
    countryList: [],
  };

  async componentDidMount() {
    let { countryList } = await getCountryAndAppVersionAndChannel(this.props.app.ghPlatform);
    countryList = countryList.map(v => v.value);
    this.setState(
      {
        countryList,
      },
      this.getList,
    );
  }

  getList = async () => {
    const {
      startDate,
      endDate,
      ghPlatform,
      countryList,
      selectCountry,
      selectAppVersion,
      selectChannel,
      order,
    } = this.state;
    let sql = createSql(activeSql, startDate, endDate, ghPlatform);
    if (_.isUndefined(selectCountry) || selectCountry === '') {
      sql = sql.replace(/and country_name = #country_name#/, '');
    } else {
      sql = sql.replace(/#country_name#/, `'${selectCountry}'`);
    }
    if (_.isUndefined(selectAppVersion) || selectAppVersion === '') {
      sql = sql.replace(/and app_version = #app_version#/, '');
    } else {
      sql = sql.replace(/#app_version#/, `'${selectAppVersion}'`);
    }
    if (_.isUndefined(selectChannel) || selectChannel === '') {
      sql = sql.replace(/and channel = #channel#/, '');
    } else {
      sql = sql.replace(/#channel#/, `'${selectChannel}'`);
    }
    sql = sql.replace(/#order#/g, order).replace(/#country#/, ` and country_name in ('${countryList.join('\',\'')}')`);
    const res = await getData(sql);
    console.log(res);
  };

  onSearch = (values) => {
    this.setState({ ...values }, this.getList);
  };

  render() {
    const { ghPlatform } = this.props.app;
    const { order } = this.state;
    const OrderClass = new OrderText();
    const orderList = OrderClass.orderList;
    return (
      <div>
        {BreadcrumbMenu()}
        <QueryIndex operation={false} ghPlatform={ghPlatform} onSearch={this.onSearch} />
        <Select
          style={{ width: 120, marginTop: 10 }}
          value={order}
          onChange={e => this.setState({ order: e }, this.getList)}
        >
          {orderList.map(v => (
            <Select.Option key={v.value} value={v.value}>
              {v.text}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  }
}
Index.propTypes = {
  app: PropTypes.object,
};
Index.defaultProps = {
  app: {
    ghPlatform: '1',
  },
};
export default connect(({ app }) => ({ app }))(Index);
