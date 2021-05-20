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
  const [product, setProduct] = useState(search.product);

  // 结算平台
  const [channel, setChannel] = useState(search.channel);
  const [channelList, setChannelList] = useState([]);

  const getChannelList = async () => {
    const res = await GetFinancialChannelList();
    setChannelList(res.data || []);
  };

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      channel: channel || [],
      moneyType,
      product,
    });
  };
  useEffect(() => {
    getChannelList();
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
            value={product}
            onChange={setProduct}
            placeholder="账号"
            allowClear
          >
            {productList.map(v => (
              <Select.Option value={v.product} key={v.product}>
                {v.product}
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
