/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Col, DatePicker, Statistic, Row, Icon, Modal, Button,
} from 'antd';
import moment from 'moment';
import CardTemplateView from '../../../../common/CardTemplateView';
import { DownLoadButton } from '../../../../common/DownLoadButton';
import styles from '../../../../../styles/index.less';
import { createSqlWhere, getPrecision } from '../../../../../utils/utils';

import { getData } from '../../../../../utils/request';
import { cardChartRender } from './cardChartRender';
import CardChartModalView from './CardChartModalView';

const dateFormat = 'YYYY-MM-DD';
const sqlTemplate = `select  sum(#molecular#) as #molecular#
,ds
from    #database#
where   ds >= #startDate#
and     ds <= #endDate#
#otherWhere#
group by ds
order by ds
limit   10000
;
`;


export default ({
  molecular, title, suffix, database, otherWhere,
}) => {
  const [currentDate, setCurrentDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const [content, setContent] = useState('0.0');
  const [rate, setRate] = useState('0.0');
  const [visible, setVisible] = useState(false);
  const CardTemplateViewProps = {
    title,
    loading: false,
    graphName: title,
  };
  const detailModalShow = async () => {
    setVisible(true);
  };
  const getSQLData = async () => {
    const sql = createSqlWhere({
      sql: sqlTemplate,
      startDate: moment(currentDate).subtract(6, 'days'),
      endDate: moment(currentDate),
      molecular,
      database,
      otherWhere,
    });
    const res = await getData(sql);
    const data = [];
    if (res.length) {
      const list = res.filter(v => Number(v.ds) === Number(moment(currentDate).format('YYYYMMDD')));
      if (list.length) {
        setContent(list[0][molecular]);
        const beforeList = res.filter(v => Number(v.ds) === Number(moment(currentDate).subtract(6, 'days').format('YYYYMMDD')));
        if (beforeList.length) {
          setRate(`${getPrecision(list[0][molecular], beforeList[0][molecular])}%`);
        }
      }
      res.forEach((v) => {
        data.push({
          day: moment(v.ds.toString()).format(dateFormat),
          value: v[molecular],
          type: title,
        });
      });
      setDataSource(data);
    }
    cardChartRender(data, molecular, title, '#FF7F50', suffix);
    setDataSource(data);
  };
  useEffect(() => {
    getSQLData();
  }, [currentDate]);
  return <Col
    span={6}
    id={`chartDiv-${molecular}-${title}`}
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
          suffix={suffix ? '%' : ''}
        />
        <span style={{ color: rate.includes('-') ? '#3f8600' : '#cf1322' }}>
          <Icon type={rate.includes('-') ? 'arrow-down' : 'arrow-up'}/>
          {rate}
        </span>
      </Row>
      <Row>
        <div id={`chart-${molecular}-${title}`} style={{ width: '100%' }}/>
      </Row>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[<Button key="ok" onClick={() => setVisible(false)}>关闭</Button>]}
        title={title}
        width="80%"
        key={`chartModal-${molecular}-${title}`}
      >
        <CardChartModalView
          visible={visible}
          title={title}
          molecular={molecular}
          database={database}
          otherWhere={otherWhere}
          currentDate={currentDate}
        />
      </Modal>
    </CardTemplateView>
  </Col>;
};
