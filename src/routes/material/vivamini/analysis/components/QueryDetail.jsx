import React, { useState } from 'react';
import {
  DatePicker, Collapse, Radio, Input, Button,
} from 'antd';

export default ({ searchDetail, onSearchDetail }) => {
  const [startDate, setStartDate] = useState(searchDetail.startDate);
  const [endDate, setEndDate] = useState(searchDetail.endDate);
  const [platform, setPlatform] = useState(searchDetail.platform);
  const [selectTTid, setSelectTTid] = useState(searchDetail.selectTTid);
  const [type, setType] = useState(searchDetail.type);
  return <Collapse defaultActiveKey={['1']}>
    <Collapse.Panel
      header="查询"
      key="1"
    >
      <Input.Search
        style={{ width: 200, marginRight: 8 }}
        placeholder="查询ttid"
        onSearch={setSelectTTid}
      />
      <Radio.Group
        value={platform}
        style={{ magin: 8 }}
        onChange={(e) => {
          setPlatform(e.target.value);
        }}
      >
        <Radio.Button value="" key="">
          全部
        </Radio.Button>
        <Radio.Button value="1" key="1">
          Android
        </Radio.Button>
        <Radio.Button value="2" key="2">
          iOS
        </Radio.Button>
      </Radio.Group>

      <Radio.Group
        defaultValue={type}
        buttonStyle="solid"
        style={{ margin: 8 }}
        onChange={e => setType(e.target.value)}
      >
        <Radio.Button value="uv" key="uv">
          UV数据
        </Radio.Button>
        <Radio.Button value="pv" key="pv">
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
        platform,
        type,
        selectTTid,
      })}>查询</Button>
    </Collapse.Panel>
  </Collapse>;
};
