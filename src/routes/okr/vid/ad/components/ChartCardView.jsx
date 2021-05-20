/* eslint-disable react/prop-types */
import React from 'react';
import {
  Col, Row, DatePicker,
} from 'antd';
import moment from 'moment';
import CardTemplateView from '../../../../common/CardTemplateView';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import { getData } from '../../../../../utils/request';
import { createSqlWhere } from '../../../../../utils/utils';
import { chartLineRender } from '../../../../common/chartFunc/chartLineRender';

const sqlTemplate = `select 
sum (#molecular#) as #molecular#,
sum (#denominator#) as #denominator#,
ad_ver,
#day#
from 
#database# 
where 1=1 
#where# 
group by #day# ,ad_ver
order by #day# 
  `;
const sqlTemplateNoDenominator = `select 
  sum (#molecular#) as #molecular#,
  ad_ver,
  #day#
  from 
  #database# 
  where 1=1 
  #where# 
  group by #day# ,ad_ver
  order by #day# 
    `;

const sqlTemplateArray = `
select 
  sum (#molecular#) as #molecular#,
  sum (#molecular1#) as #molecular1#,
  sum (#denominator#) as #denominator#,
  sum (#denominator1#) as #denominator1#,
  ad_ver,
  #day#
  from 
  #database# 
  where 1=1 
  #where# 
  group by #day# ,ad_ver
  order by #day# 
`;
const { RangePicker } = DatePicker;
class ChartCardView extends React.Component {
  state={
    startDate: moment().subtract(1, 'days'),
    endDate: moment().subtract(1, 'days'),
    dataSource: [],
  }

  componentDidMount() {
    this.getList();
  }

  getList=async () => {
    const { startDate, endDate } = this.state;
    const {
      day, database, suffix,
    } = this.props;
    const {
      denominator, molecular, noDenominator,
    } = this.props;
    const betweekDays = endDate.diff(startDate, 'days') < 8 ? 8 : endDate.diff(startDate, 'days') + 1;
    const $Where = `
    and ${day} >= ${moment(endDate).subtract(betweekDays, 'days').format('YYYYMMDD')}
    and ${day} <= ${moment(endDate).format('YYYYMMDD')}
    `;
    let sql = createSqlWhere({
      sql: noDenominator ? sqlTemplateNoDenominator : Array.isArray(denominator) ? sqlTemplateArray : sqlTemplate,
      where: $Where,
      day,
      denominator: Array.isArray(denominator) ? denominator[0] : denominator,
      molecular: Array.isArray(molecular) ? molecular[0] : molecular,
      database,
    });
    if (Array.isArray(denominator)) {
      sql = sql.replace(/#denominator1#/g, denominator[1])
        .replace(/#molecular1#/g, molecular[1]);
    }
    const res = await getData(sql);
    // const chartData = res.map(v => ({
    //   day: (moment(v[day].toString()).format('YYYY-MM-DD')).toString(),
    //   value: getNumber(v[molecular], v[denominator]),
    //   type: title,
    // }));
    const list = [];
    res.forEach((v) => {
      if (denominator && !Array.isArray(denominator)) {
        list.push({
          day: moment((v.ds ? v.ds : v.day).toString()).format('YYYY-MM-DD'),
          value: !v[denominator]
            ? 0.0
            : suffix
              ? parseFloat(((v[molecular] * 100) / v[denominator]).toFixed(2))
              : parseFloat((v[molecular] / v[denominator]).toFixed(2)),
          type: v.ad_ver,
        });
      }
      if (Array.isArray(denominator)) {
        list.push({
          day: moment((v.ds ? v.ds : v.day).toString()).format('YYYY-MM-DD'),
          value: !(v[denominator[0]] + v[denominator[1]])
            ? 0.0
            : suffix
              ? parseFloat((((v[molecular[0]] + v[molecular[1]]) * 100) / (v[denominator[0]] + v[denominator[1]])).toFixed(2))
              : parseFloat(((v[molecular[0]] + v[molecular[1]]) / (v[denominator[0]] + v[denominator[1]])).toFixed(2)),
          type: v.ad_ver,
        });
      }
      if (!denominator) {
        list.push({
          day: moment((v.ds ? v.ds : v.day).toString()).format('YYYY-MM-DD'),
          value: v[molecular],
          type: v.ad_ver,
        });
      }
    });
    this.setState({
      dataSource: list,
    });
    const molecularTitle = Array.isArray(molecular) ? molecular[0] + molecular[1] : molecular;
    const denominatorTitle = Array.isArray(denominator) ? denominator[0] + denominator[1] : denominator;
    chartLineRender(list, document.getElementById(`chart-${molecularTitle}-${denominatorTitle}`, 200));

    // cardChartRender(res, molecular, denominator, '#FF7F50', suffix);
    // cardChartRender(chartData, `chart-${molecularTitle}-${denominatorTitle}`, '#FF7F50');
  }

  render() {
    const {
      title, graphName, molecular, denominator,
    } = this.props;
    const {
      startDate, endDate, dataSource,
    } = this.state;
    const CardTemplateViewProps = {
      title,
      loading: false,
      graphName,
    };
    const molecularTitle = Array.isArray(molecular) ? molecular[0] + molecular[1] : molecular;
    const denominatorTitle = Array.isArray(denominator) ? denominator[0] + denominator[1] : denominator;
    return <Col
      span={12}
      id={`chartDiv-${molecularTitle}-${denominatorTitle}`}
      style={{ marginBottom: 10 }}
    >
      <CardTemplateView {...CardTemplateViewProps} >
        <RangePicker
          value={[startDate, endDate]}
          onChange={value => this.setState({
            startDate: value[0],
            endDate: value[1],
          }, this.getList)}
        />
        <DownLoadButton
          filename={title}
          columns={[
            { key: 'day', title: 'day' },
            { key: 'value', title: 'value' },
          ]}
          data={dataSource}
          buttonText={false}
        />

        <Row>
          <div id={`chart-${molecularTitle}-${denominatorTitle}`} style={{ width: '100%' }}/>
        </Row>
      </CardTemplateView>
    </Col>;
  }
}

export default ChartCardView;
