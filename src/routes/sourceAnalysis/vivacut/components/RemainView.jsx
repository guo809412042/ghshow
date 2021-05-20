/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Table, Row, Tag, Modal,
} from 'antd';
import { SOURCE_KEYS_VIVA, tagColors } from '../constant';
import { DownLoadButton } from '../../../common/DownLoadButton';
import styles from '../../components/index.less';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { remainSQL, remainDetailSql } from '../sqlTemplate';
import { getData } from '../../../../utils/request';
import RemainModal from '../../components/RemainModal';

const RemainView = ({
  radioValue, currentKeyIndex, onSearchValues, setCurrentKeyIndex, closeClick,
  tags, setTags,
}) => {
  const [columns, setCOlumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [OrgnicData, setOrgnicData] = useState({});
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
      render: text => ((currentKey.text === 'adname' || (currentKey.text !== 'media_source' && text === 'Organic'))
        ? (text || 'null') : <a onClick={() => {
          const newTags = _.clone(tags);
          newTags.push({
            tag: currentKey,
            name: text || 'null',
          });
          setTags(newTags);
          setCurrentKeyIndex(Number(currentKeyIndex) + 1);
        }}>{text || 'null'}</a>),
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
    setCOlumns(newColumns);
  };
  const getSQL = (sql) => {
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    let where = '';
    tags.forEach((v) => {
      where += v.name && v.name !== 'null' ? ` and ${v.tag.value} = '${v.name}' `
        : ` and ${v.tag.value} is null `;
    });
    if (visible) {
      const name = remainRecord[currentKey.value] === 'Organic' ? 'media_source' : currentKey.value;
      where += (remainRecord[currentKey.value] === 'null' ? `and ${currentKey.value} is null ` : `and ${name} = '${remainRecord[currentKey.value]}'`);
      where = where.replace(/\$/g, '#');
    }
    const fetchSql = createSqlWhere({
      sql,
      startDate: onSearchValues.startDate,
      endDate: onSearchValues.endDate,
      platform: onSearchValues.platform,
      country: onSearchValues.country.length ? ` and country_name in (${onSearchValues.country.map(v => `'${v}'`).join(',')})` : '',
      where,
      type: currentKey.value,
    });
    return fetchSql;
  };
  const getDataSource = async () => {
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    const fetchSql = getSQL(remainSQL);
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
      OrgnicData[currentKey.value] = OrgnicData[SOURCE_KEYS_VIVA[currentKeyIndex - 1].value];
      data.unshift(OrgnicData);
    }
    setDataSource(data);
  };
  useEffect(() => {
    if (onSearchValues.platform) {
      getCoreClomuns();
      getDataSource();
    }
  }, [radioValue, onSearchValues, currentKeyIndex,
    tags]);
  return <div>
    <p className={styles.title}><span style={{ marginRight: 20 }}>留存相关</span>
    </p>
    <DownLoadButton
      filename="留存相关"
      data={dataSource}
      columns={columns}
    />
    <Row
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      {tags.map((v, index) => (<span>
        <Tag
          color={tagColors[index]}
          key={v.tag.value}
          closable
          onClose={() => closeClick(v, index)}
        >{v.tag.value}:{v.name}</Tag>
        {index === tags.length - 1 ? '' : ' / '}
      </span>))}
    </Row>
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      rowKey={ SOURCE_KEYS_VIVA[currentKeyIndex].value}
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
        sql={getSQL(remainDetailSql)}
        searchValues={onSearchValues}
        name={remainRecord[SOURCE_KEYS_VIVA[currentKeyIndex].value]}
      />
    </Modal>
  </div>;
};

export default RemainView;
