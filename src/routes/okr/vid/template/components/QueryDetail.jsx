/*
 * @Date: 2020-12-09 20:11:04
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-03-29 20:29:43
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState, useEffect } from 'react';
import {
  DatePicker, Collapse, Radio, Input, Button, Select, Popover,
} from 'antd';
import { communityList } from '../const';

export default ({
  searchDetail, onSearchDetail, productId, groupInfoSelectList, mediaSourceList, campaignList, adsetList,
}) => {
  const [startDate, setStartDate] = useState(searchDetail.startDate);
  const [endDate, setEndDate] = useState(searchDetail.endDate);
  const [selectTTid, setSelectTTid] = useState(searchDetail.selectTTid);
  const [searchTTName, setSearchTTName] = useState(searchDetail.searchTTName);
  const [type, setType] = useState(searchDetail.type);
  const [usrType, setUsrType] = useState('all');
  const [community, setCommunity] = useState(() => ('all'));
  const [groupCode, setGroupCode] = useState(() => ('all'));
  const [mediaSource, setMediaSource] = useState(() => ('all'));
  const [campaign, setCampaign] = useState(() => ('all'));
  const [adset, setAdset] = useState(() => ('all'));
  useEffect(() => {
    setUsrType('all');
    setCommunity('all');
    setGroupCode('all');
    setMediaSource('all');
    setCampaign('all');
    setAdset('all');
  }, [productId]);
  return <Collapse defaultActiveKey={['1']}>
    <Collapse.Panel
      header="查询"
      key="1"
    >
      <Input
        style={{ width: 200, marginRight: 8 }}
        placeholder="查询模版ID"
        onChange={e => setSelectTTid(e.target.value)}
      />
      <Input
        style={{ width: 200, marginRight: 8 }}
        placeholder="查询模版名称"
        onChange={e => setSearchTTName(e.target.value)}
      />
      {
        [6, 42].includes(productId) && (
          <>
            <Select value={usrType} onChange={setUsrType} style={{ width: 120, margin: '0 10px' }}>
              <Select.Option key="1" value="all">全部</Select.Option>
              <Select.Option key="old" value="old">老</Select.Option>
              <Select.Option key="new" value="new">新</Select.Option>
            </Select>
            <div style={{ display: 'inline-block' }}>
              <span>社区: </span>
              <Select value={community} onChange={setCommunity} style={{ width: 120, margin: '0 10px' }}>
                {
                  communityList.map(x => <Select.Option key={x} value={x}>{x}</Select.Option>)
                }
              </Select>
            </div>
            <div style={{ display: 'inline-block' }}>
              <span>素材包: </span>
              <Select value={groupCode} showSearch onChange={setGroupCode} style={{ width: 120, margin: '0 10px' }}>
                <Select.Option key="all" value="all">全部</Select.Option>
                {
                  groupInfoSelectList.map(x => <Select.Option key={`${x.code}_${x.name}`} value={`${x.code}_${x.name}`}>{x.name}</Select.Option>)
                }
              </Select>
            </div>
            <div style={{ display: 'inline-block' }}>
              <span>media_source: </span>
              <Select value={mediaSource} showSearch onChange={setMediaSource} style={{ width: 120, margin: '0 10px' }}>
                <Select.Option key="all" value="all">全部</Select.Option>
                {
                  mediaSourceList.map(x => <Select.Option key={x.media_source} value={x.media_source}><Popover placement="left" content={x.media_source}>
                    {x.media_source}
                  </Popover></Select.Option>)
                }
              </Select>
            </div>
            <div style={{ display: 'inline-block' }}>
              <span>campaign: </span>
              <Select value={campaign} showSearch onChange={setCampaign} style={{ width: 300, margin: '0 10px' }}>
                <Select.Option key="all" value="all">全部</Select.Option>
                {
                  campaignList.map(x => <Select.Option key={x.campaign} value={x.campaign}><Popover placement="left" content={x.campaign}>
                    {x.campaign}
                  </Popover></Select.Option>)
                }
              </Select>
            </div>
            <div style={{ display: 'inline-block' }}>
              <span>adset: </span>
              <Select value={adset} showSearch onChange={setAdset} style={{ width: 300, margin: '0 10px' }}>
                <Select.Option key="all" value="all">全部</Select.Option>
                {
                  adsetList.map(x => <Select.Option key={x.adset} value={x.adset}><Popover placement="left" content={x.adset}>
                    {x.adset}
                  </Popover></Select.Option>)
                }
              </Select>
            </div>
          </>
        )
      }
      <Radio.Group
        defaultValue={type}
        buttonStyle="solid"
        style={{ margin: 8 }}
        onChange={e => setType(e.target.value)}
      >
        <Radio.Button value="_dvc_" key="_dvc_">
          UV数据
        </Radio.Button>
        <Radio.Button value="_" key="_">
          PV数据
        </Radio.Button>
      </Radio.Group>
      <DatePicker.RangePicker
        style={{ margin: '8px 8px 8px 0' }}
        value={[startDate, endDate]}
        onChange={(value) => {
          setStartDate(value[0]);
          setEndDate(value[1]);
        }}
      />
      <Button type="primary" onClick={() => onSearchDetail({
        startDate,
        endDate,
        type,
        selectTTid,
        searchTTName,
        usrType: [6, 42].includes(productId) ? usrType : 'all',
        community: [6, 42].includes(productId) ? community : null,
        groupCode,
        mediaSource,
        campaign,
        adset,
      })}>查询</Button>
    </Collapse.Panel>
  </Collapse>;
};
