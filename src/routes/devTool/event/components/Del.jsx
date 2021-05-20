/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import { Popconfirm, message, Button } from 'antd';
import { removeEvent } from '../service';


class Del extends Component {
  constructor(props) {
    super(props);
    this.state = {
      button_disabled: false,
    };
  }

  async confirm() {
    const { callback } = this.props;
    this.setState({ button_disabled: true });
    const res = await removeEvent(this.props.id);
    if (res.data) {
      message.success('操作成功');
      callback && callback();
    } else {
      message.warning('操作失败');
    }
    this.setState({ button_disabled: false });
  }

  cancel() {
    // message.error(intl.get('common.tools.ClickCancel').defaultMessage('点击了取消'));
  }

  render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <Popconfirm title="确定要删除这个事件吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel}>
          <Button disabled={ this.state.button_disabled } size="small">删除</Button>
        </Popconfirm>
      </div>
    );
  }
}

export default Del;
