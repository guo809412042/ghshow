/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/5/28
 * Time: 上午11:35
 *
 */
import React from 'react';
import { DatePicker, Row } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { sqlDataFormat } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';
import { cardChartRender } from '../../../../common/chartFunc/cardChartRender';

const { RangePicker } = DatePicker;

class CardChartModalView extends React.Component {
  state = {
    startDate: moment()
      .subtract(30, 'days'),
    endDate: moment()
      .subtract(1, 'days'),
    sql: this.props.sql,
  }

  componentDidMount() {
    this.fetch();
  }

  componentWillReceiveProps(nextPorps) {
    if (nextPorps.visible) {
      this.setState({
        sql: nextPorps.sql,
      }, this.fetch);
    }
  }

  fetch = async () => {
    const {
      denominator, molecular, color, suffix,
    } = this.props;
    const currentSql = sqlDataFormat(this.state.sql, this.state.startDate, this.state.endDate);
    const res = await getData(currentSql);
    cardChartRender(res, molecular, denominator, color, suffix, 'modal');
  }


  render() {
    const {
      startDate,
      endDate,
    } = this.state;
    const {
      molecular, denominator,
    } = this.props;
    return (<div key={`chart-${molecular}-${denominator}-modal`}>
      <RangePicker
        value={[startDate, endDate]}
        onChange={value => this.setState({
          startDate: value[0],
          endDate: value[1],
        }, this.fetch)}
      />
      <Row>
        <div id={`chart-${molecular}-${denominator}-modal`} style={{ width: '100%' }}/>
      </Row>
    </div>);
  }
}

CardChartModalView.propTypes = {
  molecular: PropTypes.string,
  denominator: PropTypes.string,
  sql: PropTypes.string,
  color: PropTypes.string,
  suffix: PropTypes.bool,
};

CardChartModalView.defaultProps = {
  molecular: '',
  denominator: '',
  color: '',
  suffix: false,
  sql: '',
};
export default CardChartModalView;
