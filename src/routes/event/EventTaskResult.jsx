/*
 * @Date: 2021-03-11 15:21:46
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-03-31 10:30:04
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import View from './View';

import { getEventTaskDetail, eventManage } from '../eventTask/services';

const idProduct = {
  3: 'sp',
  16: 'vivamini',
  15: 'vivacut',
  2: 'viva',
  // 6: 'vid',
  10: 'tempo',
  35: 'facee',
  33: 'picsfox',
};

export default (props) => {
  const { taskId } = props.match.params;
  const [selectAppVersion, setSelectAppVersion] = useState(undefined);
  const [product, setProduct] = useState('');
  const [eventIdList, setEventIdList] = useState([]);

  useEffect(() => {
    getEventTaskDetail(taskId).then((res) => {
      if (res.code === 20000) {
        const versionList = res.data.version.split('.');
        if (versionList[1].length === 1) {
          versionList[1] = `0${versionList[1]}`;
        }
        if (versionList[2].length === 1) {
          versionList[2] = `0${versionList[2]}`;
        }
        setSelectAppVersion(versionList.join(''));
        setProduct(idProduct[res.data.product_id]);
      }
    });

    eventManage({
      task_id: taskId,
    }).then((res) => {
      if (res.code === 20000) {
        setEventIdList(res.data.map(item => item.event_id));
      }
    });
  }, []);

  if (selectAppVersion && product && eventIdList.length) {
    return <View product={product} selectAppVersion={selectAppVersion} eventIdList={eventIdList} />;
  }
  return null;
};
