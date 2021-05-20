/* eslint-disable react/prop-types */
/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/3/20
 * Time: 上午10:16
 *
 */
import React from 'react';
import {
  Card, Tooltip, Icon, Spin,
} from 'antd';
import { connect } from 'dva';
import { ANNOTATION } from '../../utils/const';

class CardTemplateView extends React.Component {
  componentDidMount() {}

  render() {
    const {
      title, app, graphName, children, loading, noGraphDefinition = false,
    } = this.props;
    let graphDefinition = '';
    const find = app.graphDefinition.find(v => v.graph_name === graphName);
    if (find) {
      graphDefinition = find.graph_definition;
    }
    return (
      <Spin spinning={loading}>
        <Card
          title={<Tooltip title={title}>{title}</Tooltip>}
          extra={
            !noGraphDefinition ? (
              <Tooltip title={ANNOTATION[title] || graphDefinition}>
                <Icon type="question-circle" />
              </Tooltip>
            ) : (
              ''
            )
          }
        >
          {children}
        </Card>
      </Spin>
    );
  }
}

export default connect(({ app }) => ({ app }))(CardTemplateView);
