import React, { useEffect, useState } from 'react';
import {
  Row, Col, Statistic, Icon,
} from 'antd';
import _ from 'lodash';
import { initata } from './contants';
import { TabSQL, DAUSQL } from './sqlTemplate';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';

const htmlTemplate = ({
  span, offset, name, value, color, percent = [], double = false, data = [],
}) => <Col span={span} offset={offset}>
  <Row>
    {
      double ? data.map((v, index) => <Col key={index} span={11} offset={1} style={{
        backgroundColor: color, textAlign: 'center', padding: 10, borderRadius: 5,
      }}>
        <Statistic title={<h3 style={{ color: '#fff' }}>{v.name}</h3>} value={v.value} valueStyle={{ color: '#fff', fontSize: 16 }} />
      </Col>)
        : <div style={{
          backgroundColor: color, width: '100%', textAlign: 'center', padding: 10, borderRadius: 5,
        }}>
          <Statistic title={<h3 style={{ color: '#fff' }}>{name}</h3>} value={value} valueStyle={{ color: '#fff', fontSize: 16 }} />
        </div>
    }
  </Row>

  {percent.length ? percent.length === 1 ? <div style={{
    textAlign: 'center', fontSize: 14, color, margin: 10,
  }}>
    <Icon type="arrow-down" /><span>{percent[0].percentTitle}{percent[0].percent}</span>
  </div> : <Row >
    {percent.map((v, index) => <Col
      span={span / 2}
      offset={4}
      key={index}
      style={{ color, fontSize: 14, padding: 5 }}
    >
      <Icon type="arrow-down" /><span>{v.percentTitle}{v.percent}</span>
    </Col>)}
  </Row> : ''}
</Col>;
// background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);

export default ({
  platform = 'Android', search, startDate, endDate,
}) => {
  const [data, setData] = useState([]);
  const getInitData = async () => {
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
      sql: TabSQL,
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
      sql: DAUSQL,
      startDate,
      endDate,
      platform: platform === 'IOS' ? 2 : 1,
      where: dauWhere,
    });
    const res = await getData(sql);
    const dauRes = await getData(dauSql);
    const data = _.cloneDeep(initata[platform]);
    if (res.length && dauRes.length) {
      data[0].value = dauRes[0].dau;
      data[0].percent[0].percent = `${getNumber(res[0].in_vip_usr_cnt, dauRes[0].dau)}%`;
      data[1].value = res[0].in_vip_usr_cnt;
      if (platform === 'Android') {
        data[1].percent[0].percent = `${getNumber(res[0].clk_ply_usr_cnt, res[0].in_vip_usr_cnt)}%`;
        data[2].value = res[0].clk_ply_usr_cnt;
        data[2].percent[0].percent = `${getNumber(res[0].start_ply_usr_cnt, res[0].clk_ply_usr_cnt)}%`;
        data[1].value = res[0].in_vip_usr_cnt;
        data[1].percent[0].percent = `${getNumber(res[0].clk_ply_usr_cnt, res[0].in_vip_usr_cnt)}%`;
        data[3].value = res[0].start_ply_usr_cnt;
        data[3].percent[0].percent = `${getNumber(res[0].single_ply_usr_cnt, res[0].start_ply_usr_cnt)}%`;
        data[3].percent[1].percent = `${getNumber(res[0].sign_ply_usr_cnt, res[0].start_ply_usr_cnt)}%`;
        data[4].data[0].value = res[0].single_ply_usr_cnt;
        data[4].data[1].value = res[0].sign_ply_usr_cnt;
      }
      if (platform === 'IOS') {
        data[1].percent[0].percent = `${getNumber(res[0].clk_ply_usr_cnt, res[0].in_vip_usr_cnt)}%`;

        data[2].value = res[0].clk_ply_usr_cnt;
        data[2].percent[0].percent = `${getNumber(res[0].start_ply_usr_cnt, res[0].clk_ply_usr_cnt)}%`;
        data[3].value = res[0].start_ply_usr_cnt;
        data[3].percent[0].percent = `${getNumber(res[0].sign_ply_usr_cnt, res[0].start_ply_usr_cnt)}%`;
        data[4].value = res[0].sign_ply_usr_cnt;
      }

      if (platform === 'GP') {
        data[1].percent[0].percent = `${getNumber(res[0].start_ply_usr_cnt, res[0].in_vip_usr_cnt)}%`;
        data[2].value = res[0].start_ply_usr_cnt;
        data[2].percent[0].percent = `${getNumber(res[0].sign_ply_usr_cnt, res[0].start_ply_usr_cnt)}%`;
        data[3].value = res[0].sign_ply_usr_cnt;
      }
    } else if (dauRes.length) {
      data[0].value = dauRes[0].dau;
      if (!res.length) {
        if (platform === 'Android') {
          data[4].data[0].value = 0;
          data[4].data[1].value = 0;
        }
      }
    } else {
      data[0].value = 0;
    }
    setData(data);
  };
  useEffect(() => {
    getInitData();
  }, [search, startDate, endDate]);
  return <div style={{ margin: '20px 0' }}>
    <Row>
      {data.map(v => htmlTemplate(v))}
    </Row>
  </div>;
};
