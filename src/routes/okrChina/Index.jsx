import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import TemplateView from './TemplateView';
import { BreadcrumbMenu } from '../common/BreadcrumbMenu';

class Index extends React.PureComponent {
  render() {
    const { app } = this.props;
    const { product, graphDefinition } = app;
    return (
      <div style={{ padding: 20 }}>
        {BreadcrumbMenu()}
        <TemplateView product={product} graphDefinition={graphDefinition} />
      </div>
    );
  }
}
Index.propTypes = {
  app: PropTypes.object,
};
Index.defaultProps = {
  app: {},
};
export default connect(({ app }) => ({ app }))(Index);
