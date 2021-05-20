import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  DatePicker, Collapse, Radio, Button, Select, Input,
} from 'antd';
import { coutryList, getCategory } from '../const';
import { getData } from '../../../../utils/request';

export default ({ onSearchDetail }) => {
  const [startDate, setStartDate] = useState(moment().subtract(3, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(0, 'days'));
  const [publishStart, setPublishStart] = useState('');
  const [publishEnd, setPublishEnd] = useState('');
  const [platform, setPlatform] = useState('');
  const [country, setCountry] = useState(coutryList[0].value);
  const [newUser, setNewUser] = useState('');
  const [category, setCategory] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isLock, setLock] = useState('');
  const [isPro, setPro] = useState('');
  const [categoryList, setList] = useState([]);
  const [isPv, setPv] = useState(true);


  const onSearch = () => {
    onSearchDetail({
      startDate,
      endDate,
      platform,
      publishStart,
      publishEnd,
      category,
      isLock,
      isPro,
      newUser,
      country,
      projectId,
      isPv,
    });
  };


  useEffect(() => {
    getData(getCategory).then(res => setList(res));
    onSearch();
  }, []);

  return <Collapse defaultActiveKey={['1']}>
    <Collapse.Panel
      header="查询"
      key="1"
    >
      <Radio.Group
        value={platform}
        onChange={e => setPlatform(e.target.value)}
        buttonStyle="solid"
        style={{ marginRight: '12px' }}
      >
        <Radio.Button key="" value="">
          全部
        </Radio.Button>
        <Radio.Button key="1" value="1">
          Android
        </Radio.Button>
        <Radio.Button key="2" value="2">
          IOS
        </Radio.Button>
      </Radio.Group>
      <Radio.Group
        value={isPv}
        onChange={e => setPv(e.target.value)}
        style={{ marginRight: '12px' }}
      >
        <Radio.Button key="1" value>
          PV
        </Radio.Button>
        <Radio.Button key="2" value={false}>
          UV
        </Radio.Button>
      </Radio.Group>
      <DatePicker.RangePicker
        allowClear={false}
        style={{ margin: '8px 8px 8px 0' }}
        value={[startDate, endDate]}
        onChange={(value) => {
          setStartDate(value[0]);
          setEndDate(value[1]);
        }}
      />
      <Select placeholder="请选择国家" style={{ width: '100px', marginRight: '12px' }} value={country} onChange={e => setCountry(e)}>
        {
          coutryList.map(x => <Select.Option value={x.value} key={x.value}>{x.name}</Select.Option>)
        }
      </Select>
      <Select placeholder="请选择" style={{ width: '100px', marginRight: '12px' }} value={newUser} onChange={e => setNewUser(e)}>
        <Select.Option value="">所有用户</Select.Option>
        <Select.Option value="1">新用户</Select.Option>
        <Select.Option value="2">老用户</Select.Option>
      </Select>
      <span>是否VIP：</span>
      <Select placeholder="是否VIP" style={{ width: '100px', marginRight: '12px' }} value={isPro} onChange={e => setPro(e)}>
        <Select.Option value="">全部</Select.Option>
        <Select.Option value="1">是</Select.Option>
        <Select.Option value="0">否</Select.Option>
      </Select>
      <span>是否广告锁：</span>
      <Select placeholder="是否广告锁" style={{ width: '100px', marginRight: '12px' }} value={isLock} onChange={e => setLock(e)}>
        <Select.Option value="">全部</Select.Option>
        <Select.Option value="1">是</Select.Option>
        <Select.Option value="0">否</Select.Option>
      </Select>
      <span>模版id：</span>
      <Input placeholder="请输入模版id" style={{ width: '150px', marginRight: '12px' }} value={projectId} onChange={e => setProjectId(e.target.value)}/>
      <span>模版分类：</span>
      <Select placeholder="请选择模版分类" style={{ width: '100px', marginRight: '12px' }} value={category} onChange={e => setCategory(e)}>
        {
          categoryList?.filter(v => v?.category !== 'all')?.map(x => <Select.Option key={x?.category} value={x?.category}>{x?.category}</Select.Option>)
        }
      </Select>
      <span>发布时间：</span>
      <DatePicker.RangePicker
        style={{ margin: '8px 8px 8px 0' }}
        value={[publishStart, publishEnd]}
        placeholder={['发布时间', '发布时间']}
        onChange={(value) => {
          setPublishStart(value[0]);
          setPublishEnd(value[1]);
        }}
      />
      <Button type="primary" onClick={() => onSearch()}>查询</Button>
    </Collapse.Panel>
  </Collapse>;
};
