/* eslint-disable no-await-in-loop */
/* eslint-disable for-direction */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Radio, Table } from 'antd';
import Query from './components/Query';
import { DownLoadButton } from '../../common/DownLoadButton';
import { createSqlWhere, dateFormat } from '../../../utils/utils';
import { listSQL, listMouthSQL } from './components/sqlTemplate';
import { getHoloData } from '../../../utils/request';
import { columns } from './contants';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    appProduct: ['VivaVideo'],
    payWay: [],
    skuType: [],
    countryCode: [],
    channel: [],
    moneyType: 'rmb',
  });
  const [dayType, setDayType] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const onSearch = (value) => {
    setSearch(value);
  };
  const getSQL = (sql, startDate, endDate) => {
    let where = '';
    if (search.startDate) {
      where += ` and bizday >= '${moment(startDate).format('YYYYMMDD')}'`;
      where += ` and bizday <= '${moment(endDate).format('YYYYMMDD')}'`;
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

    where += ` and charged_type = '${search.moneyType}'`;
    const fetchSQL = createSqlWhere({
      sql,
      where,
    });
    return fetchSQL;
  };
  const getFetch = async () => {
    const sql = getSQL(listSQL, search.startDate, search.endDate);
    const res = await getHoloData(sql);
    const data = res.map((v, index) => ({
      ...v,
      key: index,
    }));
    setDataSource(data);
    setLoading(false);
  };

  const getFetchData = async (list, startDate, endDate) => {
    const res = await getHoloData(getSQL(list, startDate, endDate));
    const data = res.map((v, index) => ({
      ...v,
      key: index,
      bizday: `${dateFormat(startDate)}-${dateFormat(endDate)}`,
    }));
    return data;
  };
  const getMonthData = async () => {
    const startYear = moment(search.startDate).year();
    const endYear = moment(search.endDate).year();
    const startMon = moment(search.startDate).month() + 1;
    const endMon = moment(search.endDate).month() + 1;
    if (startYear === endYear && startMon === endMon) {
      const data = await getFetchData(listMouthSQL, search.startDate, search.endDate);
      setDataSource(data);
    } else if (startYear === endYear && startMon !== endMon) {
      let list = [];
      const list1 = await getFetchData(listMouthSQL, search.startDate, moment(search.startDate).endOf('month'));
      const list2 = await getFetchData(listMouthSQL, moment(search.endDate).startOf('month'), search.endDate);
      list = list.concat(list2);
      if (Number(endMon) - Number(startMon) > 1) {
        for (let i = endMon - 1; i > startMon; i--) {
          const list2 = await getFetchData(
            listMouthSQL,
            moment(`${startYear}-${i}-01`),
            moment(`${startYear}-${i}-01`).endOf('month'),
          );
          list = list.concat(list2);
        }
      }
      list = list.concat(list1);
      setDataSource(list);
    } else if (Number(endYear) - Number(startYear) === 1) {
      let list = [];
      for (let i = endMon; i >= 1; i--) {
        if (i === endMon) {
          const data = await getFetchData(listMouthSQL, moment(search.endDate).startOf('month'), search.endDate);
          list = list.concat(data);
        } else {
          const data = await getFetchData(
            listMouthSQL,
            moment(`${endYear}-${i}-01`).startOf('month'),
            moment(`${endYear}-${i}-01`).endOf('month'),
          );
          list = list.concat(data);
        }
      }
      for (let i = 12; i >= startMon; i--) {
        if (i === startMon) {
          const data = await getFetchData(listMouthSQL, search.startDate, moment(search.startDate).endOf('month'));
          list = list.concat(data);
        } else {
          const data = await getFetchData(
            listMouthSQL,
            moment(`${startYear}-${i}-01`).startOf('month'),
            moment(`${startYear}-${i}-01`).endOf('month'),
          );
          list = list.concat(data);
        }
      }
      setDataSource(list);
    } else {
      let list = [];
      for (let i = endYear; i >= startYear; i--) {
        if (i === endYear) {
          for (let j = endMon; j >= 1; j--) {
            if (j === endMon) {
              const data = await getFetchData(listMouthSQL, moment(search.endDate).startOf('month'), search.endDate);
              list = list.concat(data);
            } else {
              const data = await getFetchData(
                listMouthSQL,
                moment(`${endYear}-${j}-01`).startOf('month'),
                moment(`${endYear}-${j}-01`).endOf('month'),
              );
              list = list.concat(data);
            }
          }
        } else if (i !== startYear && i !== endYear) {
          for (let j = 12; j >= 1; j--) {
            const data = await getFetchData(
              listMouthSQL,
              moment(`${i}-${j}-01`).startOf('month'),
              moment(`${i}-${j}-01`).endOf('month'),
            );
            list = list.concat(data);
          }
        } else if (i === startYear) {
          for (let j = 12; j >= startMon; j--) {
            if (j === startMon) {
              const data = await getFetchData(listMouthSQL, search.startDate, moment(search.startDate).endOf('month'));
              list = list.concat(data);
            } else {
              const data = await getFetchData(
                listMouthSQL,
                moment(`${startYear}-${j}-01`).startOf('month'),
                moment(`${startYear}-${j}-01`).endOf('month'),
              );
              list = list.concat(data);
            }
          }
        }
      }
      setDataSource(list);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (dayType === '1') {
      getFetch();
    } else {
      getMonthData();
    }
  }, [search, dayType]);
  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <DownLoadButton filename="财务摊销数据" columns={columns} data={dataSource} />
      <RadioGroup value={dayType} style={{ marginTop: 20 }} onChange={e => setDayType(e.target.value)}>
        <RadioButton value="1" key="1">
          日
        </RadioButton>
        <RadioButton value="2" key="2">
          月
        </RadioButton>
      </RadioGroup>
      <Table
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: columns.length * 120 }}
        bordered
        rowKey="key"
        loading={loading}
      />
    </div>
  );
};
