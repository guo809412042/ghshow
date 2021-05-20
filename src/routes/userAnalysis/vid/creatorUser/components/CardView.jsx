/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/2/15
 * Time: 上午10:34
 *
 */
import React from 'react';
import {
  Card, Spin, Modal, Button, Col, Statistic, Icon,
} from 'antd';

// import CardChartModal from './CardChartModal'

export default class CardView extends React.Component {
  state = {
    loading: false,
    rate: '0.00',
    content: '0.00',
    visible: false,
    currentData: {},
    beforeData: {},
    num: '',
    suffix: false,
    fixed: false,
  }

  dateFormat = 'YYYYMMDD'

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
      suffix: !!nextProps.suffix,
      fixed: !!nextProps.fixed,
    }, this.getRateAndContent);
  }

  getRateAndContent = () => {
    const {
      num, currentData, beforeData, fixed,
    } = this.state;
    let content = '';
    let rate = '';
    if (num.includes('/')) {
      if (currentData[num.replace('/', '_')]) {
        content = currentData[num.replace('/', '_')];
        content = fixed ? content.toFixed(2) : parseInt(content, 10);
      } else {
        content = '无数据';
      }
      if (content === '无数据' || !beforeData[num.replace('/', '_')]) {
        rate = '无数据';
      } else {
        rate = (((content - beforeData[num.replace('/', '_')]) * 100) / beforeData[num.replace('/', '_')]).toFixed(2);
      }
    } else if (num.includes('%')) {
      if (currentData[num.replace('%', '_')]) {
        content = currentData[num.replace('%', '_')];
        content = fixed ? content.toFixed(2) : parseInt(content, 10);
      } else {
        content = '无数据';
      }
      if (content === '无数据' || !beforeData[num.replace('%', '_')]) {
        rate = '无数据';
      } else {
        rate = (((content - beforeData[num.replace('%', '_')]) * 100) / beforeData[num.replace('%', '_')]).toFixed(2);
      }
    } else {
      if (currentData[num]) {
        content = currentData[num];
        content = fixed ? content.toFixed(2) : parseInt(content, 10);
      } else {
        content = '无数据';
      }
      if (num !== 'total_creator_cnt') {
        rate = currentData[num] && beforeData[num] ? ((currentData[num] - beforeData[num]) * 100 / beforeData[num]).toFixed(2) : '无数据';
      }
    }
    if (rate !== '无数据' && num !== 'total_creator_cnt') {
      rate > 0 ? rate = `+${rate}%` : rate = `${rate}%`;
    }
    this.setState({
      content,
      rate,
    });
  }

  closeModal = () => {
    this.setState({ visible: false });
  }

  showChart = () => {
    this.setState({ visible: true });
  }

  render() {
    const { title, before } = this.props;
    const { rate, content, suffix } = this.state;
    return (<Col lg={4} md={6} style={{ marginBottom: 20 }} >
      <Card
        title={title}
      >
        <Spin spinning={this.state.loading}>
          <Statistic
            value={content}
            style={{
              fontSize: 28,
              marginRight: 10,
              display: 'inline-block',
            }}
            suffix={suffix ? '%' : ''}
          />
          {/* <span style={{ color: rate.includes('-') ? '#3f8600' : '#cf1322' }}>
            <Icon type={rate.includes('-') ? 'arrow-down' : 'arrow-up'}/>
            {rate}
          </span> */}
          {before ? <div>
            <strong >环比： </strong>
            <span an style={{ fontSize: 12, color: rate.includes('-') ? '#3f8600' : '#cf1322' }}>
              {rate !== '无数据' ? <Icon type={rate.includes('-') ? 'arrow-up' : 'arrow-down'} /> : ''}
              {rate || 0}
            </span>
          </div> : ''}
        </Spin>
      </Card>
      <Modal
        visible={this.state.visible}
        title={title}
        onCancel={this.closeModal}
        footer={<Button onClick={this.closeModal}>关闭</Button>}
        width={800}
      >
        2358u
        {/* <CardChartModal
          num={this.props.num}
          title={title}
        /> */}
      </Modal>
    </Col>);
  }
}
