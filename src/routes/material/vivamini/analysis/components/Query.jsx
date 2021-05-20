import React, { useState } from 'react';
import {
  DatePicker, Collapse, Radio, Button,
} from 'antd';

const dateFormat = 'YYYY-MM-DD';
export default ({ search, onSearch }) => {
  const [currentDate, setCurrentDate] = useState(search.currentDate);
  const [platform, setPlatform] = useState(search.platform);
  return <Collapse defaultActiveKey={['1']}>
    <Collapse.Panel
      header="查询"
      key="1"
    >
      <Radio.Group
        value={platform}
        onChange={(e) => { setPlatform(e.target.value); }}
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
      <DatePicker
        defaultValue={currentDate}
        format={dateFormat}
        onChange={(value) => { setCurrentDate(value); }}
        style={{ margin: '0 20px' }}
      />
      <Button type="primary" onClick={() => {
        onSearch({
          currentDate,
          platform,
        });
      }}>查询</Button>
    </Collapse.Panel>
  </Collapse>;
};
