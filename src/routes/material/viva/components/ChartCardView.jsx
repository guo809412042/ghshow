/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React from 'react';
import { Col } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import CardBox from '../../../home/common/CardBox';
import { getData } from '../../../../utils/request';
// import { chartRender } from '../../../common/chartFunc/chartRender';
import { ChartRender } from '../../../common/drawChart';

const sqlTempate = `select 
#select# 
from 
#database# 
where 1=1 
#where# 
group by #day#  
order by #day# 
`;

class ChartCardView extends React.Component {
  state = {
    info: this.props.info || {},
    platform: this.props.platform || '1',
    searchItem: this.props.searchItem || {},
    dataSource: [],
    columns: [],
  }

  componentDidMount() {
    this.getSQL();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.platform !== this.state.platform) {
      this.setState({
        platform: nextProps.platform,
      }, this.getSQL);
    }
    if (this.state.searchItem !== nextProps.searchItem) {
      this.setState({
        searchItem: nextProps.searchItem,
      }, this.getSQL);
    }
  }

  getSQL = async () => {
    const {
      info: {
        ios_molecular, ios_denominator, android_molecular, android_denominator,
        day, product, database, suffix,
      },
      platform,
      searchItem: {
        selectUserType, startDate, endDate, tags,
      },
    } = this.state;
    let $select = '';
    let denominator = '';
    let molecular = '';
    const dataSource = [];
    if (Number(platform) === 1) {
      molecular = android_molecular;
      denominator = android_denominator;
      $select = [
        `sum(${android_molecular}) as ${android_molecular}`,
        `sum(${android_denominator}) as ${android_denominator}`,
        day,
      ].join(',');
    } else if (Number(platform) === 2) {
      molecular = ios_molecular;
      denominator = ios_denominator;
      $select = [
        `sum(${ios_molecular}) as ${ios_molecular}`,
        `sum(${ios_denominator}) as ${ios_denominator}`,
        day,
      ].join(',');
    }
    let $where = '';
    $where = ` and ${day} >= ${moment(startDate).format('YYYYMMDD')}
    and ${day} <= ${moment(endDate).format('YYYYMMDD')}
    and ${product} = ${platform}
    `;
    if (Number(selectUserType) === 2) { // 新用户
      $where += ' and new_user  = 1';
    }
    if (Number(selectUserType) === 3) { // 老用户
      $where += ' and new_user  <> 1';
    }
    const data = [];
    for (const i of tags) {
      const country = i.includes('全球') ? '' : i.split('||')[0];
      const appVersion = i === '全球' ? '' : i.includes('全版本') ? '' : i.split('||')[1];
      let where = _.clone($where);
      if (country) {
        where += ` and country ${country}`;
      }
      if (appVersion) {
        where += ` and app_version ${appVersion}`;
      }
      const sql = sqlTempate.replace(/#select#/g, $select)
        .replace(/#where#/g, where)
        .replace(/#database#/g, database)
        .replace(/#day#/g, day);

      const res = await getData(sql);
      res.forEach((v) => {
        dataSource.push({
          ...v,
          value: v[molecular] && v[denominator]
            ? Number((v[molecular] * (suffix ? 100 : 1) / v[denominator]).toFixed(2))
            : (v[molecular] || 0),
          type: i,
        });
        data.push({
          day: (moment(v[day].toString()).format('YYYY-MM-DD')).toString(),
          // day: v[day].toString(),
          value: v[molecular] && v[denominator]
            ? Number((v[molecular] * (suffix ? 100 : 1) / v[denominator]).toFixed(2))
            : (v[molecular] || 0),
          type: i,
        });
      });
    }
    const columns = [];
    if (dataSource.length) {
      for (const i of Object.keys(dataSource[0])) {
        columns.push({
          key: i,
          title: i,
          dataIndex: i,
        });
      }
    }
    this.setState({
      columns,
      dataSource,
    });
    ChartRender(data, `${molecular}-${denominator || '__'}`, '#FF7F50', '', false, false);
  }

  render() {
    const {
      platform,
      info: {
        title, ios_molecular, ios_denominator, android_molecular, android_denominator,
      },
    } = this.props;
    const { dataSource, columns } = this.state;
    const molecular = Number(platform) === 1 ? android_molecular : ios_molecular;
    const denominator = Number(platform) === 1 ? android_denominator : ios_denominator;
    return <Col span={12}>
      <CardBox title={title} columns={columns} dataSource={dataSource} exportButton>
        <div id={`chart-${molecular}-${denominator || '__'}`} />
      </CardBox>
    </Col>;
  }
}

export default ChartCardView;
