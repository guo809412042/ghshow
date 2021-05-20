/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, DatePicker, Icon, Modal,
} from 'antd';
import styles from '../index.less';
import { SOURCE_KEYS_VIVA } from '../const';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { RetentionSQL } from '../sqlTemplate';
import { getData } from '../../../../utils/request';
import RemainModal from './RetentionModal';

const { RangePicker } = DatePicker;

const RemainView = () => {
  const [columns, setCOlumns] = useState([]);
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [dataSource, setDataSource] = useState([]);
  const [OrgnicData, setOrgnicData] = useState({});

  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [source, setSource] = useState();

  const [visible, setVisible] = useState(false);
  const [remainRecord, setRemainRecord] = useState([]);

  const modalShow = async (row) => {
    await setRemainRecord(row);
    await setVisible(true);
  };

  const getCoreClomuns = async () => {
    const newColumns = [];
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    newColumns[0] = {
      dataIndex: currentKey.value,
      key: currentKey.value,
      title: currentKey.text,
      render: text => ((text === 'Organic' || source) ? text : <a onClick={() => {
        setCurrentKeyIndex(1);
        setSource(text);
      }}>{text}</a>),
    };
    newColumns[1] = {
      title: '新增用户',
      dataIndex: 'reg_num',
      key: 'reg_num',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.reg_num - b.reg_num,
      onCell: record => ({
        onClick: () => modalShow(record),
      }),
    };
    for (let i = 1; i < 8; i++) {
      newColumns.push({
        title: `${i}天后`,
        dataIndex: `stay_seq_${i}`,
        key: `stay_seq_${i}`,
        onCell: record => ({
          onClick: () => modalShow(record),
        }),
      });
    }
    newColumns.push({
      title: '14天后',
      dataIndex: 'stay_seq_14',
      key: 'stay_seq_14',
    });
    newColumns.push({
      title: '29天后',
      dataIndex: 'stay_seq_29',
      key: 'stay_seq 29',
    });
    setCOlumns(newColumns);
  };
  const getSQL = (sql) => {
    let where = '';
    if (!source) {
      where += 'AND  media_source <> \'ALL\'';
    } else {
      where += `AND  media_source = '${source}'`;
    }

    const fetchSql = createSqlWhere({
      sql,
      startDate,
      endDate,
      where,
    });
    return fetchSql;
  };
  const getDataSource = async () => {
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    const fetchSql = getSQL(RetentionSQL);
    const res = await getData(fetchSql);
    const listKeys = [];
    for (const i of res) {
      if (!listKeys.includes(i[SOURCE_KEYS_VIVA[currentKeyIndex].value])) {
        listKeys.push(i[SOURCE_KEYS_VIVA[currentKeyIndex].value]);
      }
    }
    let data = [];
    listKeys.forEach((v) => {
      const arr = {};
      arr[SOURCE_KEYS_VIVA[currentKeyIndex].value] = v;
      const items = res.filter(i => i[SOURCE_KEYS_VIVA[currentKeyIndex].value] === v);
      for (const i of items) {
        arr[`stay_seq_${i.stay_seq}`] = `${getNumber(i.stay_num, i.reg_num)}%`;
        if (Number(i.stay_seq) === 1) {
          arr.reg_num = i.reg_num;
        }
      }
      data.push(arr);
    });
    data = data.sort((a, b) => b.reg_num - a.reg_num);
    if (!Object.keys(OrgnicData).length) {
      const organicData = data.find(v => v[currentKey.value] === 'Organic');
      setOrgnicData(organicData);
    }
    if (currentKey.value !== 'media_source') {
      OrgnicData[currentKey.text] = OrgnicData[SOURCE_KEYS_VIVA[currentKeyIndex - 1].value];
      data.unshift(OrgnicData);
    }
    setDataSource(data);
  };

  useEffect(() => {
    getCoreClomuns();
  }, [currentKeyIndex]);

  useEffect(() => {
    getDataSource();
  }, [startDate, endDate, source]);


  return <div>
    <div className={styles.panel}>
      <strong>{!source ? '留存相关' : <a onClick={() => {
        setSource(null);
        setCurrentKeyIndex(0);
      }}><Icon type="left" />{source}数据</a>}</strong>
      <div>
        <RangePicker
          style={{ marginRight: '20px' }}
          value={[startDate, endDate]}
          onChange={(value) => {
            setStartDate(value[0]);
            setEndDate(value[1]);
          }}
        />
        <DownLoadButton filename="留存相关" data={dataSource} columns={columns} />
      </div>
    </div>
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      rowKey={(_i, x) => x.toString()}
    />
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={() => setVisible(false)}
      title="留存"
      width={1000}
    >
      <h2>{remainRecord[SOURCE_KEYS_VIVA[currentKeyIndex].value]}</h2>
      <RemainModal
        visible={visible}
        source={source}
        name={remainRecord[SOURCE_KEYS_VIVA[currentKeyIndex].value]}
        searchValues={{
          startDate,
          endDate,
        }}
      />
    </Modal>
  </div>;
};
export default RemainView;
