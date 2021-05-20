/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { Modal, DatePicker } from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { getData } from '../../../../utils/request';
import { getFixed, getNumber } from '../../../../utils/utils';
import { chartLineRender } from '../../../common/chartFunc/chartLineRender';

const sql = `
SELECT
  #factor#,
  ds
  FROM rpt_vid_log_dp_cnt_1d
  where   ds >= #startDate#
  and     ds <= #endDate#
   and share_type= 'ALL'
   and media_source = #media_source#
   and is_new_dvc = #Bol#
  #where#
  group by ds
 `;

const { useState } = React;
const ChannelActionModal = ({
  visible, factor, searchValues, onCancel, is_new_dvc, media_source, campaign,
}) => {
  const [startDate, setStartDate] = useState(searchValues?.seartDate || moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(searchValues?.endDate || moment().subtract(1, 'days'));
  const [data, setData] = useState([]);
  const getSql = () => {
    const realSql = sql.replace(/#Bol#/g, `'${is_new_dvc}'`).replace(/#startDate#/g, startDate.format('YYYYMMDD')).replace(/#endDate#/g, endDate.format('YYYYMMDD')).replace(/#factor#/g, factor.includes('/') ? `sum(${factor.split('/')[0]}) as ${factor.split('/')[0]}, sum(${factor.split('/')[1]}) as ${factor.split('/')[1]}` : `sum(${factor}) as ${factor}`)
      .replace(/#media_source#/g, `'${media_source}'`)
      .replace(/#where#/g, campaign ? `and campaign = '${campaign}'` : '');
    return realSql;
  };

  const getList = async () => {
    const fetchSql = getSql();
    const res = await getData(fetchSql);
    setData(res);
    const chartData = [];
    res?.forEach((i) => {
      chartData.push({
        value: factor.includes('/') ? getNumber(i[factor.split('/')[0]], i[factor.split('/')[1]], true) : Number(getFixed(i[factor], 0)),
        type: `${media_source}-${factor}`,
        day: moment(i.ds.toString()).format('YYYY-MM-DD'),
      });
    });
    chartLineRender(chartData, document.getElementById(`chart-${media_source}`));
  };

  useEffect(() => {
    if (visible) {
      getList();
    }
  }, [visible]);
  return (
    <Modal visible={visible} title={`${media_source} ${campaign || ''}`} onCancel={() => onCancel()} width={800}>
      <div>
        <DownLoadButton
          filename={`${media_source} ${campaign || ''}`}
          data={data}
          columns={[{ key: 'value', title: 'value' }, { key: 'type', title: 'type' }, { key: 'day', title: 'day' }]}
        />
        <DatePicker.RangePicker
          value={[startDate, endDate]}
          onChange={(values) => {
            setStartDate(values[0]);
            setEndDate(values[1]);
          }}
          style={{ float: 'right' }}
        />
        <div id={`chart-${media_source}`} />
      </div>
    </Modal>
  );
};

export default ChannelActionModal;
