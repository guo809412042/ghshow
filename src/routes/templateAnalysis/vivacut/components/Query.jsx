import * as React from 'react';
import moment from 'moment';
import {
  Collapse, Select, DatePicker, Radio, Button,
} from 'antd';
import { coutryList } from '../const';

const { useState, useEffect } = React;
export default (({ onSearch }) => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [country, setCountry] = useState(coutryList[0].value);
  const [platform, setPlatform] = useState('');
  const [newUser, setNewUser] = useState('');

  const search = () => {
    onSearch({
      currentDate: moment(currentDate).format('YYYY-MM-DD'), country, platform, newUser,
    });
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <Collapse defaultActiveKey={['1']}>
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
        <DatePicker
          defaultValue={currentDate}
          format="YYYY-MM-DD"
          allowClear={false}
          onChange={setCurrentDate}
          style={{ marginRight: '12px' }}
        />
        <Button type="primary" onClick={() => search()}>查询</Button>
      </Collapse.Panel>
    </Collapse>
  );
});
