import React from 'react';
import { connect } from 'dva';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';

class Index extends React.Component {
  state = {};

  componentDidMount() {}

  render() {
    return <div>{BreadcrumbMenu()}</div>;
  }
}

export default connect(({ app }) => ({ app }))(Index);
