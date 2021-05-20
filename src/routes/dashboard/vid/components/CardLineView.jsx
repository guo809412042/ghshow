/* eslint-disable no-restricted-syntax */
import React from 'react';
import moment from 'moment';
import { DatePicker, Select } from 'antd';
import CardTemplateView from '../../../common/CardTemplateView';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { createSqlWhere } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import { ChartRender } from '../../../common/drawChart';
import { CHART_LINE_NAMES } from '../contants';

const { RangePicker } = DatePicker;
class CardLineView extends React.Component {
  state ={
    loading: false,
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(0, 'days'),
    dataSource: [],
    columns: [],
    selectValue: '_',
  }

  componentDidMount() {
    this.getFetch();
  }

  getFetch = async () => {
    const { startDate, endDate, selectValue } = this.state;
    let { sql } = this.props;
    const { day, id } = this.props;

    sql = createSqlWhere({
      sql, startDate, endDate, type: selectValue,
    });
    const dataSource = await getData(sql);
    const chartData = [];
    let columns = [];
    if (dataSource.length) {
      const KEYS = Object.keys(dataSource[0]).filter(v => v !== day);
      columns = Object.keys(dataSource[0]).map(v => ({
        key: v,
        title: v,
        dataIndex: v,
      }));
      for (const i of dataSource) {
        for (const j of KEYS) {
          chartData.push({
            type: CHART_LINE_NAMES[j] || j,
            value: i[j],
            day: moment((i[day]).toString()).format('YYYY-MM-DD'),
          });
        }
      }
    }

    this.setState({
      dataSource, columns,
    });
    ChartRender(chartData, id);
  }

  render() {
    const {
      title, graphName, id, type, source,
    } = this.props;
    const {
      loading, startDate, endDate, dataSource, columns, selectValue,
    } = this.state;
    const CardTemplateViewProps = {
      title, graphName, loading,
    };
    return <div style={{ marginBottom: 20 }}>
      <CardTemplateView {...CardTemplateViewProps} >
        <DownLoadButton
          filename={title}
          columns={columns}
          data={dataSource}
        />
        {type ? <Select
          style={{
            width: 200,
            marginRight: 16,
          }}
          value={selectValue}
          onChange={value => this.setState({ selectValue: value }, this.getFetch)}
        >
          <Select.Option value="_" key="_">all</Select.Option>
          <Select.Option value="_3s_" key="_3s_">有效</Select.Option>
        </Select> : ''}
        {source ? <Select
          value={selectValue}
          style={{
            width: 120,
            margin: '0px 8px',
          }}
          onChange={value => this.setState({ selectValue: value }, this.getFetch)}
        >
          <Select.Option value="_">整体</Select.Option>
          <Select.Option value="_vivashow_">vivashow</Select.Option>
          <Select.Option value="_status_">status</Select.Option>
          <Select.Option value="_search_">search</Select.Option>
          <Select.Option value="_follow_">follow</Select.Option>
        </Select> : ''}
        <RangePicker
          value={[startDate, endDate]}
          onChange={values => this.setState({
            startDate: values[0],
            endDate: values[1],
          }, this.getFetch)}
        />
        <div id={`chart-${id}`} />
      </CardTemplateView>
    </div>;
  }
}

export default CardLineView;
