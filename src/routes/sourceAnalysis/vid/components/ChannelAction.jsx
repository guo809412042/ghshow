/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Table, DatePicker, Icon, Radio, Select,
} from 'antd';
import moment from 'moment';
import styles from '../index.less';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { channelActionSql, campaignActionSql } from '../sqlTemplate';
import { AbsColumns, JColumns } from '../const';
import { getData } from '../../../../utils/request';
import ChannelActionModal from './ChannelActionModal';

const { RangePicker } = DatePicker;


export default () => {
  const [isNew, setNew] = useState('Y');
  const [source, setSource] = useState(null);
  const [type, setType] = useState('1');
  const [columns, setColumns] = useState([]);
  const [organic, setOrganic] = useState(null);
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCol, setCurrentCol] = useState(null);
  const [mediaSource, setMediaSource] = useState('');
  const [campaign, setCampaign] = useState();

  const AColumns = AbsColumns.map(x => ({
    ...x,
    onCell: row => ({
      onClick: () => {
        if (row.campaign) {
          setCampaign(row.campaign);
          setMediaSource(source);
        } else {
          setMediaSource(row.media_source);
        }
        setCurrentCol(x.dataIndex);
        setModalVisible(true);
      },
    }),
  }));

  const BColumns = JColumns.map(x => ({
    ...x,
    onCell: row => ({
      onClick: () => {
        if (row.campaign) {
          setCampaign(row.campaign);
          setMediaSource(source);
        } else {
          setMediaSource(row.media_source);
        }
        setCurrentCol(x.dataIndex);
        setModalVisible(true);
      },
    }),
  }));

  const getDataSource = async () => {
    const res = await getData(createSqlWhere({
      sql: channelActionSql,
      startDate,
      endDate,
      where: `AND is_new_dvc = '${isNew}'`,
    }));
    const data = res.map(v => ({
      ...v,
      'community_dau_uv/uv': getNumber(v.community_dau_uv, v.uv),
      'community_consume_uv/uv': getNumber(v.community_consume_uv, v.uv),
      'community_shr_uv/uv': getNumber(v.community_shr_uv, v.uv),
      'tmpl_dau_uv/uv': getNumber(v.tmpl_dau_uv, v.uv),
      'tmpl_exp_uv/uv': getNumber(v.tmpl_exp_uv, v.uv),
      'tmpl_shr_uv/uv': getNumber(v.tmpl_shr_uv, v.uv),
      'describe_uv/uv': getNumber(v.describe_uv, v.uv),
    }));
    if (!source) {
      setDataSource(data);
    }
    setOrganic(data.find(x => x.media_source === 'Organic'));
  };

  const getCampaign = async () => {
    const res = await getData(createSqlWhere({
      sql: campaignActionSql,
      startDate,
      endDate,
      where: `AND media_source = '${source}' AND is_new_dvc = '${isNew}'`,
    }));
    const data = res.map(v => ({
      ...v,
      'community_dau_uv/uv': getNumber(v.community_dau_uv, v.uv),
      'community_consume_uv/uv': getNumber(v.community_consume_uv, v.uv),
      'community_shr_uv/uv': getNumber(v.community_shr_uv, v.uv),
      'tmpl_dau_uv/uv': getNumber(v.tmpl_dau_uv, v.uv),
      'tmpl_exp_uv/uv': getNumber(v.tmpl_exp_uv, v.uv),
      'tmpl_shr_uv/uv': getNumber(v.tmpl_shr_uv, v.uv),
      'describe_uv/uv': getNumber(v.describe_uv, v.uv),
    }));
    data.unshift(organic);
    setDataSource(data);
  };

  useEffect(() => {
    getDataSource();
  }, [startDate, endDate, source, isNew]);

  useEffect(() => {
    if (source) getCampaign();
  }, [startDate, endDate, source, isNew]);

  useEffect(() => {
    setColumns([!source ? {
      title: 'media_source', dataIndex: 'media_source', key: 'media_source', render: v => (v === 'Organic' ? 'Organic' : <a onClick={() => setSource(v)}>{v}</a>),
    } : {
      title: 'campaign', dataIndex: 'campaign', key: 'campaign', width: 180, render: v => (v || 'Organic'),
    }, ...(type === '1' ? AColumns : BColumns)]);
  }, [source, type]);

  return (
    <div>
      <div className={styles.panel}>
        <strong>{!source ? '各渠道行为数据' : <a onClick={() => setSource(null)}><Icon type="left" />{source}数据</a>}</strong>
        <div>
          <RangePicker
            style={{ marginRight: '20px' }}
            value={[startDate, endDate]}
            onChange={(value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }}
          />
          <Select placeholder="请选择" value={isNew} onChange={e => setNew(e)} style={{ width: '100px', marginRight: '12px' }}>
            <Select.Option value="Y">新用户</Select.Option>
            <Select.Option value="N">老用户</Select.Option>
          </Select>
          <Radio.Group
            value={type}
            style={{ marginRight: '8px' }}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <Radio.Button value="1" key="1">
              绝对值
            </Radio.Button>
            <Radio.Button value="2" key="2">
              占比
            </Radio.Button>
          </Radio.Group>
          <DownLoadButton filename="行为数据" data={dataSource} columns={columns} />
        </div>
      </div>
      <ChannelActionModal visible={modalVisible} source={source} campaign={campaign} factor={currentCol} media_source={mediaSource} searchValues={{ startDate, endDate }} is_new_dvc={isNew} onCancel={() => {
        setModalVisible(false);
        setMediaSource(null);
        setCampaign(null);
      }}/>
      <Table columns={columns} dataSource={dataSource} bordered rowKey={(_i, x) => x.toString()} />
    </div>
  );
};
