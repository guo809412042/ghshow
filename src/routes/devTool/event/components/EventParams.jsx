/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-04-22 15:37:29
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React from 'react';
import { Popover } from 'antd';


const EventParams = ({
  eventParamStr,
  content: row,
}) => {
  if (row.extend) {
    try {
      const list = JSON.parse(row.extend);
      const content = list.map(item => (<span>key={item.key},value={item.remark}<br /></span>));
      const children = content.length > 2 ? <span>
        <span>{content.slice(0, 2)}</span>
        <a>查看全部</a>
      </span> : <div>{content}</div>;
      if (content.length > 2) {
        return (
          <Popover content={content} title="事件参数">
            {children}
          </Popover>
        );
      }
      return (
        <span>{content}</span>
      );
    } catch (error) {
      const eventParamList = eventParamStr.split('\n');
      const content = eventParamList.map(item => (<span>{item}<br /></span>));
      const children = content.length > 2 ? <span>
        <span>{content.slice(0, 2)}</span>
        <a>查看全部</a>
      </span> : <div>{content}</div>;

      if (content.length > 2) {
        return (
          <Popover content={content} title="事件参数">
            {children}
          </Popover>
        );
      }
      return (
        <span>{content}</span>
      );
    }
  } else {
    const eventParamList = eventParamStr.split('\n');
    const content = eventParamList.map(item => (<span>{item}<br /></span>));
    const children = content.length > 2 ? <span>
      <span>{content.slice(0, 2)}</span>
      <a>查看全部</a>
    </span> : <div>{content}</div>;

    if (content.length > 2) {
      return (
        <Popover content={content} title="事件参数">
          {children}
        </Popover>
      );
    }
    return (
      <span>{content}</span>
    );
  }
};

export default EventParams;
