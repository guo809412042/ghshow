/*
 * @Date: 2020-12-09 20:11:03
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-03-29 17:34:10
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import jsCookie from 'js-cookie';
import { Modal, Table } from 'antd';
import { getEventCountData, createEventCountData, countEventNameList } from '../../../utils/request';

const PRODUCT_LIST = {
  2: 'viva',
  3: 'sp',
  6: 'vid',
  10: 'tempo',
  15: 'vivacut',
  16: 'vivamini',
  35: 'facee',
  43: 'gocut',
  36: 'glitchfx',
  18: 'vmix',
  39: 'veffecto',
  41: 'storybuff',
};

export default ({
  startDate, endDate, product, remark = '',
}) => {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState('0');
  const [dataSource, setDataSource] = useState([]);
  const createEventCount = async () => {
    const data = {
      startTime: moment(startDate).format('YYYY-MM-DD'),
      endTime: moment(endDate).format('YYYY-MM-DD'),
      username: jsCookie.get('email'),
      path: window.location.hash.split('#/')[1],
      remark,
      product: PRODUCT_LIST[product],
      platform: 12,
    };
    await createEventCountData(data);
  };
  const getEventCountList = async () => {
    const res = await getEventCountData(window.location.hash.split('#/')[1]);
    console.log('resresresres', res);
    setCount(res.data.count);
  };

  const eventCount = async () => {
    await createEventCount();
    await getEventCountList();
  };
  const getCountDetail = async () => {
    const res = await countEventNameList(PRODUCT_LIST[product]);
    setDataSource(res.data);
  };
  useEffect(() => {
    eventCount();
  }, [startDate, endDate, product, remark]);
  useEffect(() => {
    if (visible) {
      getCountDetail();
    }
  }, [visible]);
  return (
    <div style={{ float: 'right' }}>
      <a onClick={() => setVisible(true)}>访问次数：{count}</a>
      <Modal title="事件访问详情" visible={visible} onCancel={() => setVisible(false)} onOk={() => setVisible(false)}>
        <Table
          dataSource={dataSource}
          columns={[
            { key: 'remark', title: 'Event_Name', dataIndex: 'remark' },
            { key: 'count', title: 'count', dataIndex: 'count' },
          ]}
          rowKey="remark"
        />
      </Modal>
    </div>
  );
};
