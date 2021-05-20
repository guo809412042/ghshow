/*
 * @Date: 2020-04-02 10:47:20
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-04-02 15:40:35
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import {
  Popconfirm, message, Button, Icon,
} from 'antd';
import { collectionEvent, removeCollectionEvent } from '../service';


class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // button_disabled: false,
    };
  }

  async confirm() {
    const { callback, id, myEventList } = this.props;
    // this.setState({ button_disabled: true });
    if (myEventList.includes(id)) {
      const res = await removeCollectionEvent({ id });
      if (res.code === 20000) {
        message.success('操作成功');
        callback && callback();
      } else {
        message.warning('操作失败');
      }
    } else {
      const res = await collectionEvent({ id });
      if (res.code === 20000) {
        message.success('操作成功');
        callback && callback();
      } else {
        message.warning('操作失败');
      }
    }
    // this.setState({ button_disabled: false });
  }

  cancel() {
    // message.error(intl.get('common.tools.ClickCancel').defaultMessage('点击了取消'));
  }

  render() {
    const { id, myEventList } = this.props;
    return (
      <div style={{ display: 'inline-block', marginRight: 8 }}>
        <Popconfirm title={myEventList.includes(id) ? '确认取消收藏该事件？' : '确认收藏该事件？'} onConfirm={this.confirm.bind(this)} onCancel={this.cancel}>
          <Button type="primary" size="small"><Icon type="star" theme="filled"/>{myEventList.includes(id) ? '已收藏' : '收藏'}</Button>
        </Popconfirm>
      </div>
    );
  }
}

export default Collection;
