/* eslint-disable react/prop-types */
import React from 'react';
import {
  Col, Statistic, Row, Icon, Tooltip,
} from 'antd';
// import PropTypes from 'prop-types';
import styles from '../../../styles/index.less';
import { cardChartRender } from '../../common/chartFunc/cardChartRenderWIthoutAxis';
import { DownLoadButton } from '../../common/DownLoadButton';
import { ANNOTATION } from '../../../utils/const';

class StaticNumberShowView extends React.Component {
  componentDidMount() {
    const { id, color, data } = this.props;
    cardChartRender(data, id, color);
  }

  componentWillReceiveProps(nextProps) {
    const { id, color, data } = nextProps;
    cardChartRender(data, id, color);
  }

  render() {
    const {
      title,
      value = 0,
      precision = 0,
      id,
      //  userIcon, color,
      precision1 = 0,
    } = this.props;
    const annotation = ANNOTATION[title];
    return (
      <Col span={4}>
        <div className={styles.homeCard}>
          <Row className={styles.homeCardBody}>
            <div style={{ float: 'right' }}>
              <DownLoadButton
                filename={title}
                columns={[
                  { key: 'day', title: 'day' },
                  { key: 'value', title: 'value' },
                  { key: 'type', title: 'type' },
                ]}
                buttonText={false}
                data={this.props.data}
              />
            </div>
            <Statistic
              title={
                <p style={{ color: '#636262', fontSize: 14 }}>
                  {title}
                  {annotation ? (
                    <Tooltip title={annotation}>
                      <Icon type="question-circle" style={{ marginLeft: 10 }} />
                    </Tooltip>
                  ) : (
                    ''
                  )}
                </p>
              }
              value={value}
              valueStyle={{ fontSize: 20 }}
            />
            {/* <Col span={4}>
              <div
                style={{
                  padding: 10,
                  color,
                  fontSize: 28,
                  borderRadius: 40,
                }}
              >
                <Icon type={userIcon} />
              </div>
            </Col> */}
          </Row>
          <div>
            <strong style={{ marginLeft: 15 }}>环比： </strong>
            <span an style={{ marginLeft: 5, fontSize: 12, color: Number(precision) > 0 ? '#3f8600' : '#cf1322' }}>
              <Icon type={Number(precision) > 0 ? 'arrow-up' : 'arrow-down'} />
              {precision || 0}%
            </span>
          </div>
          <div>
            <strong style={{ marginLeft: 15 }}>同比： </strong>
            <span an style={{ marginLeft: 5, fontSize: 12, color: Number(precision1) > 0 ? '#3f8600' : '#cf1322' }}>
              <Icon type={Number(precision1) > 0 ? 'arrow-up' : 'arrow-down'} />
              {precision1 || 0}%
            </span>
          </div>
          <div id={id} style={{ height: 30 }} />
        </div>
      </Col>
    );
  }
}

export default StaticNumberShowView;
