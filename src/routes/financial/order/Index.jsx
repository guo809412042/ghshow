import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Checkbox, Table, Select } from 'antd';
import Query from './components/Query';
import {
  columnsKeys, basicColumns, saleColumns, costColumns, refundColumns, incomeColumns,
} from './contants';
import { DownLoadButton } from '../../common/DownLoadButton';
import { createSqlWhere, getFixed } from '../../../utils/utils';
import { orderSQL } from './components/sqlTemplate';
import { getHoloData } from '../../../utils/request';

export default () => {
  const [tabelKey, setTableKey] = useState(['1', '2', '3', '4']);
  const [moneyType, setMoneyType] = useState('rmb');
  const [search, setSearch] = useState({
    startDate: moment().subtract(1, 'days'),
    endDate: moment().subtract(1, 'days'),
    appProduct: ['VivaVideo'],
    payWay: [],
    skuType: [],
    countryCode: [],
    channel: [],
  });
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const onSearch = (value) => {
    setSearch(value);
  };
  const getFetch = async () => {
    let where = '';
    if (search.startDate) {
      where += ` and data_time >= '${moment(search.startDate).format('YYYYMMDD')}'`;
      where += ` and data_time <= '${moment(search.endDate).format('YYYYMMDD')}'`;
    }
    if (search.payWay.length) {
      where += ` and pay_way in (${search.payWay.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.appProduct.length) {
      where += ` and app_product in (${search.appProduct.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.channel.length) {
      where += ` and channel in (${search.channel.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.skuType.length) {
      where += ` and sku_type in (${search.skuType.map(v => `'${v}'`).join(',')}) `;
    }
    if (search.countryCode.length) {
      where += ` and country_code in (${search.countryCode.map(v => `'${v}'`).join(',')}) `;
    }
    where += ` and charged_type = '${moneyType}'`;
    const sql = createSqlWhere({
      sql: orderSQL,
      where,
    });
    const res = await getHoloData(sql);
    const data = res.map((v, index) => ({
      ...v,
      key: index,
      charged_amount: getFixed(Number(v.charged_amount)),
      tax_fee: getFixed(Number(v.tax_fee)),
      tax_rate: getFixed(Number(v.tax_rate)),
      channel_fee: getFixed(Number(v.channel_fee)),
      net_revenue: getFixed(Number(v.net_revenue)),
      offset_revenue: getFixed(Number(v.offset_revenue)),
      handling_fee: getFixed(Number(v.handling_fee)),
      refund_amount: getFixed(Number(v.refund_amount)),
      channel_fee_return: getFixed(Number(v.channel_fee_return)),
      tax_return: getFixed(Number(v.tax_return)),
      handling_fee_return: getFixed(Number(v.handling_fee_return)),
      net_refund_amount: getFixed(Number(v.net_refund_amount)),
    }));
    setDataSource(data);
  };
  const getColumns = async () => {
    let newColumns = basicColumns;
    if (tabelKey.includes('1')) {
      newColumns = newColumns.concat(saleColumns);
    }
    if (tabelKey.includes('2')) {
      newColumns = newColumns.concat(costColumns);
    }
    if (tabelKey.includes('3')) {
      newColumns = newColumns.concat(refundColumns);
    }
    if (tabelKey.includes('4')) {
      newColumns = newColumns.concat(incomeColumns);
    }
    setColumns(newColumns);
  };

  useEffect(() => {
    getFetch();
  }, [search, moneyType]);
  useEffect(() => {
    getColumns();
  }, [tabelKey]);
  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <h1 style={{ margin: '10px 0' }}>订单数据明细</h1>
      <DownLoadButton filename="订单数据" columns={columns} data={dataSource} />
      <Checkbox.Group options={columnsKeys} defaultValue={tabelKey} onChange={setTableKey} style={{ marginLeft: 20 }} />
      <Select style={{ width: 80, marginRight: '8px' }} value={moneyType} onChange={setMoneyType} placeholder="类型">
        <Select.Option key="dollar" value="dollar">
          美元
        </Select.Option>
        <Select.Option key="rmb" value="rmb">
          人民币
        </Select.Option>
      </Select>
      <Table
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: columns.length * 120 }}
        bordered
        rowKey="key"
      />
    </div>
  );
};
