/* eslint-disable react/prop-types */
import React from 'react';
import {
  Col, Row, DatePicker, Select, Statistic, Tooltip, Icon, Modal, Button, Radio,
} from 'antd';
import moment from 'moment';
import CardTemplateView from '../../../common/CardTemplateView';
import { HOT_LIST } from '../contants';
import { DownLoadButton } from '../../../common/DownLoadButton';
import styles from '../../../../styles/index.less';
import { getData } from '../../../../utils/request';
import { createSqlWhere, getNumber, getPrecision } from '../../../../utils/utils';
// import { chartRender } from '../../../common/chartFunc/chartRender';
// import { cardChartRender } from '../../../common/chartFunc/cardChartRenderWIthoutAxis';
import { cardChartRender } from '../../../common/chartFunc/cardChartRender';

import CardChartModalView from './CardChartModalView';

const sqlTemplate = `select 
sum (#molecular#) as #molecular#,
sum (#denominator#) as #denominator#,
#day#
from 
#database# 
where 1=1 
#where# 
group by #day# 
order by #day# 
  `;
const { RangePicker } = DatePicker;
class ChartCardView extends React.Component {
  state={
    startDate: moment().subtract(1, 'days'),
    endDate: moment().subtract(1, 'days'),
    hotValue: '_vivashow_',
    columns: [{
      key: 'day', title: 'day',
    }, {
      key: 'value', title: 'value',
    }],
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
    const { startDate, endDate, hotValue } = this.state;
    const {
      day, database, suffix, title,
    } = this.props;
    let {
      denominator, molecular,
    } = this.props;
    molecular = molecular.replace(/#type#/, hotValue);
    denominator = denominator.replace(/#type#/, hotValue);
    const betweekDays = endDate.diff(startDate, 'days') < 8 ? 8 : endDate.diff(startDate, 'days') + 1;
    let $Where = `
    and ${day} >= ${moment(endDate).subtract(betweekDays, 'days').format('YYYYMMDD')}
    and ${day} <= ${moment(endDate).format('YYYYMMDD')}
    `;
    if (title === '次留(%)') {
      $Where += 'AND stay_seq = \'1\'';
    }
    const sql = createSqlWhere({
      sql: sqlTemplate,
      where: $Where,
      day,
      denominator,
      molecular,
      type: hotValue,
      database,
    });
    const res = await getData(sql);
    if (res.length) {
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
    // const chartData = res.map(v => ({
    //   day: (moment(v[day].toString()).format('YYYY-MM-DD')).toString(),
    //   value: getNumber(v[molecular], v[denominator]),
    //   type: title,
    // }));
    const list = [];
    res.forEach((v) => {
      if (denominator) {
        list.push({
          day: moment((v.ds ? v.ds : v.day).toString()).format('YYYY-MM-DD'),
          value: !v[denominator]
            ? 0.0
            : suffix
              ? parseFloat(((v[molecular] * 100) / v[denominator]).toFixed(2))
              : parseFloat((v[molecular] / v[denominator]).toFixed(2)),
        });
      }
      if (!denominator) {
        list.push({
          day: moment((v.ds ? v.ds : v.day).toString()).format('YYYY-MM-DD'),
          value: v[molecular],
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
    const { hotValue } = this.state;
    const {
      day, database, title,
    } = this.props;
    let {
      denominator, molecular,
    } = this.props;
    molecular = molecular.replace(/#type#/, hotValue);
    denominator = denominator.replace(/#type#/, hotValue);
    let $Where = `
    and ${day} >= #startDate#
    and ${day} <= #endDate#
    `;
    if (title === '次留(%)') {
      $Where += 'AND stay_seq = \'1\'';
    }
    const fetchSql = createSqlWhere({
      sql: sqlTemplate,
      where: $Where,
      day,
      denominator,
      molecular,
      type: hotValue,
      database,
    });

    this.setState({
      visible: true,
      fetchSql,
    });
  }

  render() {
    let {
      molecular, denominator,
    } = this.props;
    const {
      title, graphName, hotSelect, suffix, onlyHotSelect, onlyAllSelect,
    } = this.props;
    const {
      startDate, endDate, hotValue, columns, dataSource, content, rate,
    } = this.state;
    molecular = molecular.replace(/#type#/, hotValue);
    denominator = denominator.replace(/#type#/, hotValue);
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
        {
          hotSelect && <Select
            value={hotValue}
            style={{
              width: 120,
              margin: '10px 5px 5px 0',
            }}
            onChange={value => this.setState({ hotValue: value }, this.getList)}
          >
            {HOT_LIST.map(v => <Select.Option key={v.value} value={v.value}>{v.title}</Select.Option>)}
          </Select>
        }
        {onlyHotSelect && <Radio.Group
          value="a"
          style={{ margin: '10px 5px 5px 0' }}
        >
          <Radio.Button value="a">热门</Radio.Button>
        </Radio.Group>}
        {onlyAllSelect && <Radio.Group
          value="a"
          style={{ margin: '10px 5px 5px 0' }}
        >
          <Radio.Button value="a">整体</Radio.Button>
        </Radio.Group>}
        <DownLoadButton
          filename={title}
          columns={columns}
          data={dataSource}
          buttonText={false}
        />

        <Row
          className={styles.chartNum}
          onClick={this.detailModalShow}
        >
          <Statistic
            value={content}
            style={{
              fontSize: 28,
              marginRight: 10,
              display: 'inline-block',
            }}
            suffix={suffix ? '%' : ''}
          />
          <span style={{ color: rate.includes('-') ? '#3f8600' : '#cf1322' }}>
            <Icon type={rate.includes('-') ? 'arrow-down' : 'arrow-up'}/>
            {rate}
            {graphName.includes('人均播放视频数') && <Tooltip
              title={'当所选区间小于等于7天时；\n'
              + '百分比展示的是和七天前数据的变化，展示的是提升的相对百分比，而不是绝对百分比。\n'
              + '例如1月10日的社区用户占比10%，1月3日的社区用户占比20%，那么展示的就会是（10%-20%）/20%=-50%\n'
              + '当所选区间大于7天时：\n'
              + '如果选择一段时间区间的，那么展示的就是这个时间区间的社区用户占比和紧邻这个区间且同样区间长度的时间区间的社区用户'
              + '占比的对比。例如1月16日-1月28日的社区用户占比为20%，那么展示的就是1月16日-1月28日的社区用户占比和1月3日-1月'
              + '15日的社区用户占比（假设为10%）的相对值，那么结果就是（20%-10%）/10%=100%'}
              trigger="hover"
            >
              <Icon type="question-circle" className={styles.rateIcon}/>
            </Tooltip>}
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
