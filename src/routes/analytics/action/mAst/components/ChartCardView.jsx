/* eslint-disable react/prop-types */
import React from 'react';
import {
  Col, Row, DatePicker, Select, Statistic, Icon, Modal, Button,
} from 'antd';
import moment from 'moment';
import CardTemplateView from '../../../../common/CardTemplateView';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import styles from '../../../../../styles/index.less';
import { getData } from '../../../../../utils/request';
import { createSqlWhere, getPrecision, getNumber } from '../../../../../utils/utils';
import { cardChartRender } from '../../../../common/chartFunc/cardChartRender';

import CardChartModalView from './CardChartModalView';

const sqlTemplate = `select  #molecular#,
ds
from    rpt_india_log_tool_idx_1d
where #where#
order by ds
limit   1000`;

const noDenominatorSqlTemplate = `select  #molecular#, 
#denominator#,
ds
from    rpt_india_log_tool_idx_1d
where #where#
order by ds
limit   1000`;

const { RangePicker } = DatePicker;
class ChartCardView extends React.Component {
  state={
    startDate: moment().subtract(1, 'days'),
    endDate: moment().subtract(1, 'days'),
    typeValue: 'ds',
    dataSource: [],
    content: 0.00,
    rate: '0.00%',
    visible: false,
    fetchSql: '',
  }

  componentDidMount() {
    this.getList();
  }

  getList=async () => {
    const {
      startDate, endDate, typeValue,
    } = this.state;
    const {
      day, suffix,
    } = this.props;
    const {
      denominator, molecular, noDenominator, typeSelect, userType,
    } = this.props;
    let num = 8;
    if (typeSelect && typeValue === 'month') {
      num = 30;
    }
    const betweekDays = endDate.diff(startDate, 'days') < num ? num : endDate.diff(startDate, 'days') + 1;
    let $Where = `
    ${day} >= ${moment(endDate).subtract(betweekDays, 'days').format('YYYYMMDD')}
    and ${day} <= ${moment(endDate).format('YYYYMMDD')}
    and product_id = 42 and duration = '${typeValue}'
    `;
    if (userType !== undefined) {
      $Where += ` and user_type = '${userType}' `;
    }
    const sql = createSqlWhere({
      sql: noDenominator ? sqlTemplate : noDenominatorSqlTemplate,
      where: $Where,
      denominator,
      molecular,
    });
    const res = await getData(sql);
    if (res.length && !noDenominator) {
      const current = res[res.length - 1];
      const molecularNum = current[molecular];
      const denominatorNum = current[denominator];
      const content = getNumber(molecularNum, denominatorNum, suffix);
      let rate = 0.00;
      if (res.length >= 8) {
        const rateCurrent = res[res.length - 8];
        const rateMolecularNum = rateCurrent[molecular];
        const rateDenominatorNum = rateCurrent[denominator];
        const rateContent = getNumber(rateMolecularNum, rateDenominatorNum, suffix);
        rate = `${getPrecision(content, rateContent)}%`;
      }
      this.setState({
        content,
        rate: rate.toString(),
      });
    }
    if (res.length && noDenominator) {
      const current = res[res.length - 1];
      const molecularNum = current[molecular];
      const content = molecularNum;
      let rate = 0.00;
      if (res.length >= 8) {
        const rateCurrent = res[res.length - 8];
        const rateMolecularNum = rateCurrent[molecular];
        const rateContent = rateMolecularNum;
        rate = `${getPrecision(content, rateContent)}%`;
      }
      this.setState({
        content,
        rate: rate.toString(),
      });
    }
    if (!res.length) {
      this.setState({
        content: 0.0,
        rate: '0.0%',
      });
    }
    const list = [];
    res.forEach((v) => {
      if (denominator) {
        list.push({
          day: moment((v.ds ? v.ds : v.day).toString()).format('YYYY-MM-DD'),
          value: (!v[denominator]
            ? 0.0
            : suffix
              ? parseFloat(((v[molecular] * 100) / v[denominator]).toFixed(2))
              : parseFloat((v[molecular] / v[denominator]).toFixed(2))) || 0,
        });
      }
      if (!denominator) {
        list.push({
          day: moment((v.ds ? v.ds : v.day).toString()).format('YYYY-MM-DD'),
          value: v[molecular] || 0,
        });
      }
    });
    this.setState({
      dataSource: list,
    });

    cardChartRender(res, molecular, denominator, '#FF7F50', suffix);
    // cardChartRender(chartData, `chart-${molecular}-${denominator}`, '#FF7F50');
  }

  detailModalShow = () => {
    const {
      day, noDenominator, denominator, molecular, userType,
    } = this.props;
    const {
      typeValue,
    } = this.state;
    let $Where = `
    ${day} >= #startDate#
    and ${day} <= #endDate#
    and product_id = 42
    and duration = '${typeValue}'
    `;
    if (userType !== undefined) {
      $Where += ` and user_type = '${userType}' `;
    }
    const fetchSql = createSqlWhere({
      sql: !noDenominator ? noDenominatorSqlTemplate : sqlTemplate,
      where: $Where,
      denominator,
      molecular,
    });


    this.setState({
      visible: true,
      fetchSql,
    });
  }

  render() {
    const {
      title, graphName, suffix, molecular, denominator, typeSelect,
    } = this.props;
    const {
      startDate, endDate, dataSource, content, rate, typeValue,
    } = this.state;
    const CardTemplateViewProps = {
      title,
      loading: false,
      graphName,
    };
    return <Col
      span={6}
      id={`chartDiv-${molecular}-${denominator}`}
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
        <div style={{ marginTop: '10px' }}>
          {
            typeSelect ? <Select
              style={{
                width: 120,
                margin: '0px 5px 5px 0',
              }}
              value={typeValue}
              onChange={value => this.setState({ typeValue: value }, this.getList)}
            >
              <Select.Option value="ds" key="">日</Select.Option>
              <Select.Option value="week" key="1">周</Select.Option>
              <Select.Option value="month" key="0">月</Select.Option>
            </Select> : ''
          }
          <DownLoadButton
            filename={title}
            columns={[
              { key: 'day', title: 'day' },
              { key: 'value', title: 'value' },
            ]}
            data={dataSource}
            buttonText={false}
          />
        </div>
        <Row
          className={styles.chartNum}
          onClick={this.detailModalShow}
        >
          <Statistic
            value={content}
            style={{
              marginRight: 10,
              display: 'inline-block',
            }}
            valueStyle={{
              fontSize: 22,
            }}
            suffix={suffix ? '%' : ''}
          />
          <span style={{ color: rate.includes('-') ? '#3f8600' : '#cf1322' }}>
            <Icon type={rate.includes('-') ? 'arrow-down' : 'arrow-up'}/>
            {rate}
          </span>
          <Row>
            <div id={`chart-${molecular}-${denominator}`} style={{ width: '100%' }}/>
          </Row>
        </Row>
      </CardTemplateView>
      <Modal
        visible={this.state.visible}
        onCancel={() => this.setState({ visible: false })}
        footer={[<Button key="ok" onClick={() => this.setState({ visible: false })}>关闭</Button>]}
        title={title}
        width="80%"
        key={`chartModal-${molecular}-${denominator}`}
      >
        <CardChartModalView
          visible={this.state.visible}
          sql={this.state.fetchSql}
          title={title}
          denominator={denominator}
          molecular={molecular}
          color={this.props.color}
          suffix={this.props.suffix}
        />
      </Modal>
    </Col>;
  }
}

export default ChartCardView;
