/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  DatePicker, Collapse, Button, Select,
} from 'antd';
import moment from 'moment';
import { selectAttr1 } from '../../../../../utils/utils';

export default ({
  onSearch,
  defaultNewUser = '',
}) => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [newUser, setNewUser] = useState(defaultNewUser);


  const handleSearch = () => {
    let where = '';
    if (newUser) {
      where += ` and new_user =  '${newUser}' `;
    }
    onSearch({
      where,
      startDate,
      endDate,
    });
  };

  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <DatePicker.RangePicker
            style={{ marginRight: '8px' }}
            value={[startDate, endDate]}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
              handleSearch();
            }}
          />
          <Select {...{ ...selectAttr1, allowClear: false }} value={newUser} onChange={setNewUser} placeholder="用户">
            <Select.Option key="" value="">
              全部
            </Select.Option>
            <Select.Option key="1" value="1">
              新用户
            </Select.Option>
            <Select.Option key="2" value="2">
              老用户
            </Select.Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
