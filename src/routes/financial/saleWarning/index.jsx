import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, message, Spin } from 'antd';
import Query from './components/Query';

import { GetFinancialWarningList } from '../../business/advStatistics/services';

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(1, 'month'),
    endDate: moment().subtract(0, 'month'),
    channel: undefined,
    product: undefined,
    moneyType: 'rmb',
  });
  const [warningData, setWarningData] = useState([]);
  const [spinning, setSpinning] = useState(false);

  const onSearch = (value) => {
    setSearch(value);
  };

  const getWhere = () => ({
    channel: search.channel,
    product: search.product,
    cash_type: search.moneyType || 'rmb',
    start_date: moment(search.startDate).format('YYYYMM'),
    end_date: moment(search.endDate).format('YYYYMM'),
  });

  const getWarningData = async () => {
    setSpinning(true);
    try {
      const res = await GetFinancialWarningList(getWhere());
      setWarningData(res.data || []);
    } catch (error) {
      message.warning(error);
    } finally {
      setSpinning(false);
    }
  };

  const Columns = [
    {
      title: '偏差',
      dataIndex: 'offset',
      key: 'offset',
    },
    {
      title: '偏差率',
      dataIndex: 'offset_rate',
      key: 'offset_rate',
    },
    {
      title: '操作',
      dataIndex: 'operator',
      key: 'operator',
    },
  ];

  useEffect(() => {
    getWarningData();
  }, [search]);

  return (
    <div>
      <Query search={search} onSearch={onSearch} />
      <h3 style={{ margin: 10 }}>告警</h3>
      <Spin spinning={spinning}>
        <Table dataSource={warningData} columns={Columns} bordered rowKey="key" scroll={{ x: 1500 }} />
      </Spin>
    </div>
  );
};
