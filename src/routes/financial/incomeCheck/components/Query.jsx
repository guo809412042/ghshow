import React, { useState, useEffect } from 'react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {
  DatePicker, Collapse, Select, Button,
} from 'antd';
import { QueryNodeData, GetFinancialChannelList } from '../../../business/advStatistics/services';

export default ({ onSearch, search }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [moneyType, setMoneyType] = useState(search.moneyType);
  const [account, setAccount] = useState(search.account);
  const [accountList, setAccountList] = useState([]);

  // 结算平台
  const [channel, setChannel] = useState(search.channel);
  const [channelList, setChannelList] = useState([]);

  const getChannelList = async () => {
    const res = await GetFinancialChannelList();
    setChannelList(res.data || []);
  };

  const getAccountList = async () => {
    const res = await QueryNodeData({ sql: 'select account from gh_financial_account group by account' });
    setAccountList(res.data || []);
  };

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      channel: channel || [],
      moneyType,
      account,
    });
  };
  useEffect(() => {
    getChannelList();
    getAccountList();
  }, []);
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select
            style={{ width: 200, marginRight: '8px', marginBottom: 8 }}
            value={channel}
            onChange={setChannel}
            placeholder="渠道"
            allowClear
          >
            {channelList.map(v => (
              <Select.Option value={v.channel} key={v.channel}>
                {v.channel}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 300, marginRight: '8px' }}
            value={account}
            onChange={setAccount}
            placeholder="账号"
            allowClear
          >
            {accountList.map(v => (
              <Select.Option value={v.account} key={v.account}>
                {v.account}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 80, marginRight: '8px' }}
            value={moneyType}
            onChange={setMoneyType}
            placeholder="类型"
          >
            <Select.Option key="dollar" value="dollar">
              美元
            </Select.Option>
            <Select.Option key="rmb" value="rmb">
              人民币
            </Select.Option>
          </Select>
          <div />
          <DatePicker.RangePicker
            locale={locale}
            style={{ margin: '8px 8px 8px 0' }}
            value={[startDate, endDate]}
            onPanelChange={(value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }}
            format="YYYY-MM"
            mode={['month', 'month']}
          />
          <Button onClick={handleSearch} type="primary">
            查询
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
