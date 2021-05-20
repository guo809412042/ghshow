import React, { Component } from 'react';
// import { Select } from 'antd';
import { connect } from 'dva';

import Query from './components/Query';
import List from './components/List';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchEventName: null
    };
  }

  componentWillMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    const { product: oldProduct } = this.props;
    const { product: newProduct } = nextProps;
    if (oldProduct !== newProduct) {
      this.init(newProduct);
    }
  }

  init = product => {
    this.initFormFields(product);
    this.getList();
    this.initData();
    this.initOnce();
  };

  initFormFields = propsProduct => {
    const { dispatch, product } = this.props;
    dispatch({
      type: 'pageConfig/saveFormFields',
      payload: {
        data: { product: propsProduct || product }
      }
    });
  };

  initData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'pageConfig/initOtherData' });
  };

  initOnce = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'pageConfig/initOnce' });
  };

  getList = async () => {
    const { dispatch } = this.props;
    dispatch({ type: 'pageConfig/listInit' });
    dispatch({ type: 'pageConfig/getMyEvent' });
  };

  render() {
    const { searchEventName } = this.state;
    const {
      dispatch,
      pageConfig: {
        listData,
        listLoading,
        formFields,

        classList,
        versionList,
        appVersionList,
        moduleList,
        moduleListAll,
        tagList,
        androidDevList,
        iosDevList,
        myEventList
      }
    } = this.props;
    const { product } = formFields;
    const comProps = {
      listData,
      searchEventName,
      listLoading,
      formFields,

      classList,
      versionList,
      appVersionList,
      moduleList,
      moduleListAll,
      tagList,
      androidDevList,
      iosDevList,
      myEventList,

      dispatch,
      product,
      initData: this.initData,
      getMyEvent: this.getMyEvent,
      reFresh: this.getList
    };
    return (
      <div>
        <Query {...comProps} />
        <List {...comProps} />
      </div>
    );
  }
}

export default connect(({ pageConfig }) => ({ pageConfig }))(Index);
