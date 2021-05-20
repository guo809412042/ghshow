import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

import Query from './components/Query';
import List from './components/List';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchEventName: null,
    };
  }

  componentWillMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: { product: oldProduct },
      },
    } = this.props;
    const {
      match: {
        params: { product: newProduct },
      },
    } = nextProps;
    if (oldProduct !== newProduct) {
      this.init(newProduct);
    }
  }

  init = (product) => {
    this.initFormFields(product);
    this.getList();
    this.initData();
    this.initOnce();
  };

  initFormFields = (propsProduct) => {
    const {
      dispatch,
      match: {
        params: { product },
      },
    } = this.props;
    dispatch({
      type: 'devToolEvent/saveFormFields',
      payload: {
        data: { product: propsProduct || product },
      },
    });
  };

  initData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'devToolEvent/initOtherData' });
  };

  initOnce = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'devToolEvent/initOnce' });
  };

  getList = async () => {
    const { dispatch } = this.props;
    dispatch({ type: 'devToolEvent/listInit' });
    dispatch({ type: 'devToolEvent/getMyEvent' });
  };

  render() {
    const { searchEventName } = this.state;
    const {
      dispatch,
      devToolEvent: {
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
        myEventList,
        IDpageDict,
        IDpageList,
        IDmoduleDict,
        IDmoduleList,
        IDcontrolDict,
        IDcontrolList,
        IDactionDict,
        IDactionList,
        devList,
      },
    } = this.props;
    const comProps = {
      listData,
      searchEventName,
      listLoading,
      formFields,
      IDpageDict,
      IDpageList,
      IDmoduleDict,
      IDmoduleList,
      IDcontrolDict,
      IDcontrolList,
      IDactionDict,
      IDactionList,
      classList,
      versionList,
      appVersionList,
      moduleList,
      moduleListAll,
      tagList,
      androidDevList,
      iosDevList,
      devList,
      myEventList,

      dispatch,
      initData: this.initData,
      getMyEvent: this.getMyEvent,
      reFresh: this.getList,
    };
    return (
      <div>
        <Query {...comProps} />
        <div style={{ height: '60px' }}>
          <Select
            style={{ margin: '15px 0', float: 'right', width: 400 }}
            showSearch
            allowClear
            placeholder="输入名称过滤"
            onChange={value => this.setState({
              searchEventName: value,
            })
            }
          >
            {listData.map(item => (
              <Select.Option
                key={`${item.event_id}-${item.event_name}-${item.id}`}
                value={`${item.event_id}-${item.event_name}-${item.id}`}
              >{`${item.event_id}-${item.event_name}-${item.id}`}</Select.Option>
            ))}
          </Select>
        </div>
        <List {...comProps} />
      </div>
    );
  }
}

export default connect(({ devToolEvent }) => ({ devToolEvent }))(Index);
