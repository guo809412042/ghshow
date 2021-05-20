import React, { useState, useEffect } from 'react';
import { Radio, Table } from 'antd';
import { columnsData } from './contants';
import { TabDaySQL, DAUDaySQL } from './sqlTemplate';
import { createSqlWhere, getNumber, getFixed } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';

export default ({
  platform = 'Android', search, startDate, endDate,
}) => {
  const [tableValue, setTableValue] = useState('1');
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const getColumns = () => {
    setColumns(columnsData[platform][tableValue]);
  };
  const getFetchData = async () => {
    let where = search.where || '';
    let dauWhere = search.where || '';
    if (search.userType) {
      where += ` and is_new_dvc ='${search.userType}'`;
      dauWhere += ` and is_new_dvc ='${search.userType}'`;
    }
    if (search.category) {
      where += ` and category ='${search.category}'`;
      if (search.funtion) {
        where += ` and funtion = '${search.funtion}' `;
        if (search.fvalue) {
          where += ` and fvalue = '${search.fvalue}' `;
        } else {
          where += ' and fvalue =\'ALL\'';
        }
      } else {
        where += ' and funtion =\'ALL\' and fvalue = \'ALL\'';
      }
    } else {
      where += ' and category = \'ALL\' and funtion = \'ALL\' and fvalue = \'ALL\' ';
    }
    where += ` and pay_way =  '${platform}'`;
    const sql = createSqlWhere({
      sql: TabDaySQL,
      startDate,
      endDate,
      where,
    });
    if (platform === 'GP') {
      dauWhere += ' AND country <> \'中国\' ';
    }
    if (platform === 'Android') {
      dauWhere += ' AND country = \'中国\' ';
    }
    const dauSql = createSqlWhere({
      sql: DAUDaySQL,
      startDate,
      endDate,
      platform: platform === 'IOS' ? 2 : 1,
      where: dauWhere,
    });
    const res = await getData(sql);
    const dauRes = await getData(dauSql);

    const dataSource = [];
    if (dauRes.length) {
      for (const i of dauRes) {
        const find = res.find(v => v.ds === i.ds);
        if (find) {
          const other_single_ply_usr_cnt = (find.single_ply_usr_cnt - find.one_month_ply_usr_cnt - find.one_year_ply_usr_cnt);
          const other_sign_ply_usr_cnt = (find.sign_ply_usr_cnt - find.sub_month_ply_usr_cnt - find.sub_year_ply_usr_cnt);
          dataSource.push({
            ...i,
            ...find,
            'in_vip_usr_cnt/DAU': getNumber(find.in_vip_usr_cnt, i.dau),
            'clk_ply_usr_cnt/in_vip_usr_cnt': getNumber(find.clk_ply_usr_cnt, find.in_vip_usr_cnt),
            'start_ply_usr_cnt/clk_ply_usr_cnt': getNumber(find.start_ply_usr_cnt, find.clk_ply_usr_cnt),
            'single_ply_usr_cnt/start_ply_usr_cnt': getNumber(find.single_ply_usr_cnt, find.start_ply_usr_cnt),
            'sign_ply_usr_cnt/start_ply_usr_cnt': getNumber(find.sign_ply_usr_cnt, find.start_ply_usr_cnt),
            'start_ply_usr_cnt/in_vip_usr_cnt': getNumber(find.start_ply_usr_cnt, find.in_vip_usr_cnt),
            other_single_ply_usr_cnt: getFixed(other_single_ply_usr_cnt > 0 ? other_single_ply_usr_cnt : 0),
            other_sign_ply_usr_cnt: getFixed(other_sign_ply_usr_cnt > 0 ? other_sign_ply_usr_cnt : 0),
          });
        } else {
          dataSource.push(i);
        }
      }
    }
    setDataSource(dataSource);
  };
  useEffect(() => {
    getColumns();
  }, [tableValue, platform]);
  useEffect(() => {
    getFetchData();
  }, [search, tableValue, startDate, endDate]);
  return <div>
    <DownLoadButton
      filename="列表"
      columns={columns.map(v => ({
        ...v,
        key: v.dataIndex,
      }))}
      data={dataSource}
    />
    <Radio.Group
      style={{ marginLeft: 10 }}
      buttonStyle="solid"
      defaultValue={tableValue}
      onChange={e => setTableValue(e.target.value)}
    >
      <Radio.Button key="1" value="1">
      所有数据
      </Radio.Button>
      <Radio.Button key="2" value="2">
      转化人数
      </Radio.Button>
      <Radio.Button key="3" value="3">
      转化率
      </Radio.Button>
    </Radio.Group>

    <Table
      columns = {columns}
      dataSource={dataSource}
      style={{ marginTop: 10 }}
      bordered
      rowKey="ds"
    />
  </div>;
};
