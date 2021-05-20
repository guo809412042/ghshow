import React, { Component } from 'react';
import { Row, DatePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import StaticNumberShowView from '../../common/StaticNumberShowView';
import { allActvieUserSQL, vidActiveUserSQL } from '../../common/sqlTemplate';
import { getData } from '../../../../utils/request';
import { createSql } from '../../../../utils/utils';
// 活跃用户数新增用户数 颜色表

const getPrecision = (a, b) => (a && b ? (((a - b) * 100) / b).toFixed(2) : 0);
const colors = ['#f5365c', '#02ba5a', '#14abef'];
const initData = [
  {
    title: 'DAU',
    value: 0,
    precision: 0,
    userIcon: 'usergroup-add',
    data: [],
    show: true,
  },
  {
    title: 'Android-DAU',
    value: 0,
    precision: 0,
    userIcon: 'usergroup-add',
    data: [],
    show: true,
  },
  {
    title: 'iOS-DAU',
    value: 0,
    precision: 0,
    userIcon: 'usergroup-add',
    data: [],
    show: true,
  },
  {
    title: '新增-DAU',
    value: 0,
    precision: 0,
    userIcon: 'user-add',
    data: [],
    show: true,
  },
  {
    title: 'Android新增-DAU',
    value: 0,
    precision: 0,
    userIcon: 'user-add',
    data: [],
    show: true,
  },
  {
    title: 'iOS新增-DAU',
    value: 0,
    precision: 0,
    userIcon: 'user-add',
    data: [],
    show: true,
  },
  {
    title: 'MAU',
    value: 0,
    precision: 0,
    userIcon: 'usergroup-add',
    data: [],
    show: true,
  },
  {
    title: 'Android-MAU',
    value: 0,
    precision: 0,
    userIcon: 'usergroup-add',
    data: [],
    show: true,
  },
  {
    title: 'iOS-MAU',
    value: 0,
    precision: 0,
    userIcon: 'usergroup-add',
    data: [],
    show: true,
  },
];
class UserActiveCard extends Component {
  state = {
    currentDate: moment().subtract(1, 'days'),
    product: this.props.product,
    cardData: [],
  };

  componentDidMount() {
    this.getCurrentAll();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product !== this.state.product) {
      this.setState(
        {
          product: nextProps.product,
        },
        this.getCurrentAll,
      );
    }
  }

  getCurrentAll = async () => {
    const { product } = this.state;
    const cardData = _.cloneDeep(initData);
    const { currentDate } = this.state;
    const allActive = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 第一个当天活跃 第二个昨天活跃， 第三个一周前活跃，第四个当天新增...
    const allAndroid = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 第一个当天活跃 第二个昨天活跃， 第三个一周前活跃，第四个当天新增...
    const allIos = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 第一个当天活跃 第二个昨天活跃， 第三个一周前活跃，第四个当天新增...
    const dauChart = [];
    const dauNewChart = [];
    const mauChart = [];

    const dauAndChart = [];
    const dauNewAndChart = [];
    const mauAndChart = [];

    const dauIosChart = [];
    const dauNewIosChart = [];
    const mauIosChart = [];
    if (product === 'vid') {
      const res = await this.getList(1, currentDate, vidActiveUserSQL);
      if (res.length) {
        cardData[1].title = 'DAU(APP)';
        cardData[2].title = '新增';
        cardData[3].title = '新增-DAU';
        cardData[4].title = '新增-DAU(APP)';
        allActive[0] = res[res.length - 1].dau;
        allAndroid[0] = res[res.length - 1].app_dau;
        allIos[0] = res[res.length - 1].new_1d;
        allActive[3] = res[res.length - 1].dau_new_1d;
        allAndroid[3] = res[res.length - 1].dau_app_new_1d;
        res.forEach((v) => {
          dauChart.push({
            type: cardData[0].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.dau,
          });
          dauAndChart.push({
            type: cardData[1].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.app_dau,
          });
          dauIosChart.push({
            type: cardData[2].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.new_1d,
          });
          dauNewChart.push({
            type: cardData[3].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.dau_new_1d,
          });
          dauNewAndChart.push({
            type: cardData[4].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.dau_app_new_1d,
          });
        });
      }
      if (res.length > 1) {
        allActive[1] = res[res.length - 2].dau;
        allAndroid[1] = res[res.length - 2].app_dau;
        allIos[1] = res[res.length - 2].new_1d;
        allActive[4] = res[res.length - 2].dau_new_1d;
        allAndroid[4] = res[res.length - 2].dau_app_new_1d;
      }
      if (res.length >= 7) {
        allActive[2] = res[res.length - 7].dau;
        allAndroid[2] = res[res.length - 7].app_dau;
        allIos[2] = res[res.length - 7].new_1d;
        allActive[5] = res[res.length - 7].dau_new_1d;
        allAndroid[5] = res[res.length - 7].dau_app_new_1d;
      }
      cardData[5].show = false;
      cardData[6].show = false;
      cardData[7].show = false;
      cardData[8].show = false;
    } else {
      const androidRes = await this.getList(1, currentDate);
      const iosRes = await this.getList(2, currentDate);
      if (androidRes.length && iosRes.length) {
        androidRes.forEach((v, index) => {
          dauChart.push({
            type: cardData[0].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.dau + iosRes[index].dau,
          });

          dauNewChart.push({
            type: cardData[3].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.dau_new_1d + iosRes[index].dau_new_1d,
          });
          dauAndChart.push({
            type: cardData[1].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.dau,
          });
          dauNewAndChart.push({
            type: cardData[4].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.dau_new_1d,
          });
          dauIosChart.push({
            type: cardData[2].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: iosRes[index].dau,
          });
          dauNewIosChart.push({
            type: cardData[5].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: iosRes[index].dau_new_1d,
          });
          mauChart.push({
            type: cardData[6].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.mau + iosRes[index].mau,
          });
          mauAndChart.push({
            type: cardData[7].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: v.mau,
          });
          mauIosChart.push({
            type: cardData[8].title,
            day: moment(v.bizdate.toString()).format('YYYY-MM-DD'),
            value: iosRes[index].mau,
          });
        });
        allActive[0] = androidRes[androidRes.length - 1].dau + iosRes[iosRes.length - 1].dau;
        allActive[3] = androidRes[androidRes.length - 1].dau_new_1d + iosRes[iosRes.length - 1].dau_new_1d;
        allAndroid[0] = androidRes[androidRes.length - 1].dau;
        allAndroid[3] = androidRes[androidRes.length - 1].dau_new_1d;
        allIos[0] = iosRes[iosRes.length - 1].dau;
        allIos[3] = iosRes[iosRes.length - 1].dau_new_1d;
        allActive[6] = androidRes[androidRes.length - 1].mau + iosRes[iosRes.length - 1].mau;
        allAndroid[6] = androidRes[androidRes.length - 1].mau;
        allIos[6] = iosRes[iosRes.length - 1].mau + iosRes[iosRes.length - 1].mau;
      }
      if (androidRes.length > 1) {
        allActive[1] = androidRes[androidRes.length - 2].dau + iosRes[androidRes.length - 2].dau;
        allActive[4] = androidRes[androidRes.length - 2].dau_new_1d + iosRes[androidRes.length - 2].dau_new_1d;
        allAndroid[1] = androidRes[androidRes.length - 2].dau;
        allAndroid[4] = androidRes[androidRes.length - 2].dau_new_1d;
        allIos[1] = iosRes[androidRes.length - 2].dau;
        allIos[4] = iosRes[androidRes.length - 2].dau_new_1d;
        allActive[7] = androidRes[androidRes.length - 2].mau + iosRes[iosRes.length - 2].mau;
        allAndroid[7] = androidRes[androidRes.length - 2].mau;
        allIos[7] = iosRes[iosRes.length - 2].mau + iosRes[iosRes.length - 2].mau;
      }
      if (androidRes.length >= 7) {
        allActive[2] = androidRes[androidRes.length - 7].dau + iosRes[androidRes.length - 7].dau;
        allActive[5] = androidRes[androidRes.length - 7].dau_new_1d + iosRes[androidRes.length - 7].dau_new_1d;
        allAndroid[2] = androidRes[androidRes.length - 7].dau;
        allAndroid[5] = androidRes[androidRes.length - 7].dau_new_1d;
        allIos[2] = iosRes[androidRes.length - 7].dau;
        allIos[5] = iosRes[androidRes.length - 7].dau_new_1d;
        allActive[8] = androidRes[androidRes.length - 7].mau + iosRes[iosRes.length - 7].mau;
        allAndroid[8] = androidRes[androidRes.length - 7].mau;
        allIos[8] = iosRes[iosRes.length - 7].mau + iosRes[iosRes.length - 7].mau;
      }
      cardData[2].show = true;
      cardData[5].show = true;
    }
    cardData[0].value = allActive[0];
    cardData[0].data = dauChart;
    cardData[0].precision = getPrecision(allActive[0], allActive[1]);
    cardData[0].precision1 = getPrecision(allActive[0], allActive[2]);

    cardData[1].value = allAndroid[0];
    cardData[1].data = dauAndChart;
    cardData[1].precision = getPrecision(allAndroid[0], allAndroid[1]);
    cardData[1].precision1 = getPrecision(allAndroid[0], allAndroid[2]);

    cardData[2].value = allIos[0];
    cardData[2].data = dauIosChart;
    cardData[2].precision = getPrecision(allIos[0], allIos[1]);
    cardData[2].precision1 = getPrecision(allIos[0], allIos[2]);

    cardData[3].value = allActive[3];
    cardData[3].data = dauNewChart;
    cardData[3].precision = getPrecision(allActive[3], allActive[4]);
    cardData[3].precision1 = getPrecision(allActive[3], allActive[5]);

    cardData[4].value = allAndroid[3];
    cardData[4].data = dauNewAndChart;
    cardData[4].precision = getPrecision(allAndroid[3], allAndroid[4]);
    cardData[4].precision1 = getPrecision(allAndroid[3], allAndroid[5]);

    cardData[5].value = allIos[3];
    cardData[5].data = dauNewIosChart;
    cardData[5].precision = getPrecision(allIos[3], allIos[4]);
    cardData[5].precision1 = getPrecision(allIos[3], allIos[5]);

    cardData[6].value = allActive[6];
    cardData[6].data = mauChart;
    cardData[6].precision = getPrecision(allActive[6], allActive[7]);
    cardData[6].precision1 = getPrecision(allActive[6], allActive[8]);

    cardData[7].value = allAndroid[6];
    cardData[7].data = mauAndChart;
    cardData[7].precision = getPrecision(allAndroid[6], allAndroid[7]);
    cardData[7].precision1 = getPrecision(allAndroid[6], allAndroid[8]);

    cardData[8].value = allIos[6];
    cardData[8].data = mauIosChart;
    cardData[8].precision = getPrecision(allIos[6], allIos[7]);
    cardData[8].precision1 = getPrecision(allIos[6], allIos[8]);

    this.setState({
      cardData,
    });
  };

  getList = async (platform, currentDate, fetchSql = allActvieUserSQL) => {
    const { product } = this.state;
    const startDate = moment(currentDate).subtract(7, 'day');
    const sql = createSql(fetchSql, startDate, currentDate, product, platform);
    const res = await getData(sql);
    return res;
  };

  render() {
    const { currentDate, cardData } = this.state;
    return (
      <div>
        <DatePicker
          value={currentDate}
          style={{ marginBottom: 20 }}
          onChange={v => this.setState({ currentDate: v }, this.getCurrentAll)}
        />
        <Row gutter={18}>
          {cardData.map(
            (v, index) => v.show && <StaticNumberShowView {...v} color={colors[index % 3]} key={index} id={`card_chart${index}`} />,
          )}
        </Row>
      </div>
    );
  }
}
UserActiveCard.propTypes = {
  product: PropTypes.string,
};
UserActiveCard.defaultProps = {
  product: 'viva',
};
export default UserActiveCard;
