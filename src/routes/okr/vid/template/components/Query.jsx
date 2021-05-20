import React, { useState, useEffect } from 'react';
import {
  DatePicker, Collapse, Button, Select,
} from 'antd';
import { communityList } from '../const';

const dateFormat = 'YYYY-MM-DD';
export default ({ search, onSearch, productId }) => {
  const [currentDate, setCurrentDate] = useState(search.currentDate);
  const [usrType, setUsrType] = useState(() => ('new')); // mast只有all
  const [community, setCommunity] = useState(() => ('all'));
  useEffect(() => {
    setUsrType('new');
    setCommunity('all');
  }, [productId]);
  return <Collapse defaultActiveKey={['1']}>
    <Collapse.Panel
      header="查询"
      key="1"
    >
      <DatePicker
        defaultValue={currentDate}
        format={dateFormat}
        onChange={(value) => {
          setCurrentDate(value);
        }}
      />
      {
        productId === 6 && (
          <>
            <Select value={usrType} onChange={setUsrType} style={{ width: 120, margin: '0 10px' }}>
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
          </>
        )
      }

      <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => onSearch({
        currentDate, usrType: productId === 6 ? usrType : 'all', community: productId === 6 ? community : 'all', productId,
      })}>查询</Button>
    </Collapse.Panel>
  </Collapse>;
};
