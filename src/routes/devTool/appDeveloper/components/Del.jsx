/*
 * @Date: 2020-04-23 11:06:01
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-04-29 18:01:01
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import { Popconfirm, message, Button } from 'antd';
import { deleteUser } from '../service';


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
    const res = await deleteUser(this.props.id);
    if (res.code === 20000) {
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
        <Popconfirm title="确定要删除吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel}>
          <Button disabled={ this.state.button_disabled } type="danger" size="small">删除</Button>
        </Popconfirm>
      </div>
    );
  }
}

export default Del;
