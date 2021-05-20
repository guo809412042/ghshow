/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Col, DatePicker, Statistic, Row, Icon, Modal, Button, Select,
} from 'antd';
import moment from 'moment';
import CardTemplateView from '../../../../common/CardTemplateView';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import styles from '../../../../../styles/index.less';
import { createSqlWhere, getPrecision, getNumber } from '../../../../../utils/utils';

import { getData } from '../../../../../utils/request';
import { cardChartRender } from './cardChartRender';
import CardChartModalView from './CardChartModalView';

const dateFormat = 'YYYY-MM-DD';
const sqlTemplate = `select  #select#
,ds
from    #database#
where   ds >= #startDate#
and     ds <= #endDate# #otherWhere# #where#
group by ds
order by ds
limit   10000
;
`;


export default ({
  molecular, title, suffix, database, denominator, unit = '%', appVersionList, otherWhere, molecularName,
}) => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const [content, setContent] = useState('0.0');
  const [rate, setRate] = useState('0.0');
  const [visible, setVisible] = useState(false);
  const [appVersion, setAppVersion] = useState(undefined);
  const CardTemplateViewProps = {
    title,
    loading: false,
  };
  const detailModalShow = async () => {
    setVisible(true);
  };
  const getSQLData = async () => {
    const select = [];
    select.push(` sum(${molecular}) as ${molecularName || molecular}`);
    if (denominator) {
      select.push(` sum(${denominator}) as ${denominator}`);
    }
    let where = '';
    if (appVersion) {
      where = ` and app_version = '${appVersion}'`;
    }
    const sql = createSqlWhere({
      sql: sqlTemplate,
      startDate: moment(currentDate).subtract(30, 'days'),
      endDate: moment(currentDate),
      database,
      select: select.join(','),
      where,
      otherWhere,
    });
    const getNum = (arr) => {
      // value1 分子 value2分母
      let _molecular = 0;
      _molecular = arr[molecularName || molecular];
      const num = denominator ? getNumber(_molecular, arr[denominator], suffix) : _molecular;
      return num;
    };
    const res = await getData(sql);
    const data = [];
    if (res.length) {
      const list = res.filter(v => Number(v.ds) === Number(moment(currentDate).format('YYYYMMDD')));
      if (list.length) {
        const num = getNum(list[0]);
        setContent(num);
        const beforeList = res.filter(v => Number(v.ds) === Number(moment(currentDate).subtract(7, 'days').format('YYYYMMDD')));
        if (beforeList.length) {
          const breforNum = getNum(beforeList[0]);
          setRate(`${getPrecision(num, breforNum)}%`);
        }
      }
      res.forEach((v) => {
        data.push({
          day: moment(v.ds.toString()).format(dateFormat),
          value: getNum(v),
          type: title,
        });
      });
      setDataSource(data);
    } else {
      setContent('0.0');
      setRate('0.0');
    }
    cardChartRender(data, molecular, denominator, '#FF7F50', unit);
    setDataSource(data);
  };
  useEffect(() => {
    getSQLData();
  }, [currentDate, appVersion]);
  return <Col
    span={6}
    id={`chartDiv-${molecular}-${denominator}`}
    style={{ marginBottom: 10 }}
  >

    <CardTemplateView {...CardTemplateViewProps} >
      <DatePicker defaultValue={currentDate} format={dateFormat} onChange={setCurrentDate} />
      <DownLoadButton
        filename={title}
        columns={[
          { key: 'day', title: 'day' },
          { key: 'value', title: 'value' },
        ]}
        data={dataSource}
        buttonText={false}
      />
      <div>
        <Select
          style={{ width: 120, marginTop: 5 }}
          value={appVersion}
          onChange={setAppVersion}
          placeholder="版本"
          allowClear
        >
          {appVersionList.map(v => <Select.Option key={v.app_version} value={v.app_version} >{v.app_version}</Select.Option>)}
        </Select>
      </div>
      <Row
        className={styles.chartNum}
        onClick={detailModalShow}
        style={{ height: 50 }}
      >
        <Statistic
          value={content}
          style={{
            marginRight: 10,
            display: 'inline-block',
          }}
          valueStyle={{
            fontSize: 22,
          }}
          suffix={unit}
        />
        <span style={{ color: rate.includes('-') ? '#3f8600' : '#cf1322' }}>
          <Icon type={rate.includes('-') ? 'arrow-down' : 'arrow-up'}/>
          {rate}
        </span>
      </Row>
      <Row>
        <div id={`chart-${molecular}-${denominator}`} style={{ width: '100%' }}/>
      </Row>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[<Button key="ok" onClick={() => setVisible(false)}>关闭</Button>]}
        title={title}
        width="80%"
        key={`chartModal-${molecular}-${denominator}`}
      >
        <CardChartModalView
          visible={visible}
          title={title}
          molecular={molecular}
          database={database}
          currentDate={currentDate}
          denominator={denominator}
          suffix={suffix}
          unit={unit}
          defaultAppVersion={appVersion}
          appVersionList={appVersionList}
          otherWhere = {otherWhere}
          molecularName={molecularName}
        />
      </Modal>
    </CardTemplateView>
  </Col>;
};
