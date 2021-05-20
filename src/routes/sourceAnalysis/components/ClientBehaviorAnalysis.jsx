/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Tag, Row, Table, Modal,
} from 'antd';
import _ from 'lodash';
import styles from './index.less';
import { DownLoadButton } from '../../common/DownLoadButton';
import { tagColors, SOURCE_KEYS_VIVA_BEHAVIOR_ANALYSIS as SOURCE_KEYS_VIVA } from '../viva/constant';
import { createSqlWhere, getNumber } from '../../../utils/utils';
import { clientBehaviorAnalysisSQL, chartClientBehaviorAnalysisSQL } from './sqlTemplate';
import { getData } from '../../../utils/request';
import RegNumChartModal from './RegNumChartModal';

export default ({
  radioValue,
  onSearchValues,
  currentKeyIndex,
  tags,
  closeClick,
  setTags,
  setCurrentKeyIndex,
  product,
  database,
}) => {
  const [columns, setCOlumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [remainRecord, setRemainRecord] = useState([]);
  const [showType, setShowType] = useState('');
  const modalShow = async (row, showType) => {
    console.log('showType', showType);
    await setRemainRecord(row);
    await setShowType(showType);
    await setVisible(true);
  };
  const getCoreClomuns = async () => {
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    const newColumns = [
      {
        dataIndex: currentKey.text,
        key: currentKey.text,
        title: currentKey.text,
        render: text => (currentKey.text === 'adset' || (currentKey.text !== 'media_source' && (text === 'Organic' || text === 'organic')) ? (
          text || 'null'
        ) : (
          <a
            onClick={() => {
              // console.log('currentKeyIndex', currentKeyIndex);
              const newTags = _.clone(tags);
              newTags.push({
                tag: currentKey,
                name: text || 'null',
              });
              setTags(newTags);
              setCurrentKeyIndex(Number(currentKeyIndex) + 1);
            }}
          >
            {text || 'null'}
          </a>
        )),
      },
      {
        title: '新增用户',
        dataIndex: 'new_dvc_cnt',
        key: 'new_dvc_cnt',
        sorter: (a, b) => a.new_dvc_cnt - b.new_dvc_cnt,
        onCell: record => ({
          onClick: () => modalShow(record, 'reg_num'),
        }),
      },
      {
        title: '活跃用户',
        dataIndex: 'dau',
        key: 'dau',
        onCell: record => ({
          onClick: () => modalShow(record, 'dau'),
        }),
      },
      {
        title: '导出用户数',
        dataIndex: 'export_dvc_cnt',
        key: 'export_dvc_cnt',
        onCell: record => ({
          onClick: () => modalShow(record, 'export_dvc_cnt'),
        }),
      },
      {
        title: '导出用户占比',
        dataIndex: 'export_dvc_cnt/new_dvc_cnt',
        key: 'export_dvc_cnt/new_dvc_cnt',
        render: text => `${text}%`,
        onCell: record => ({
          onClick: () => modalShow(record, 'export_user_rate'),
        }),
      },
      {
        title: '导出次数',
        dataIndex: 'export_cnt',
        key: 'export_cnt',
        onCell: record => ({
          onClick: () => modalShow(record, 'export_cnt'),
        }),
      },
      {
        title: '人均导出次数',
        dataIndex: 'export_cnt/export_dvc_cnt',
        key: 'export_cnt/export_dvc_cnt',
        onCell: record => ({
          onClick: () => modalShow(record, 'export_cnt/export_dvc_cnt'),
        }),
      },
    ];

    setCOlumns(newColumns);
  };
  const getSQL = (sql) => {
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    let where = '';
    tags.forEach((v) => {
      where += v.name && v.name !== 'null' ? ` and ${v.tag.value} = '${v.name}' ` : ` and ${v.tag.value} is null `;
    });
    if (visible) {
      const name = remainRecord[currentKey.text] === 'Organic' ? 'media_source' : currentKey.text;
      where
        += remainRecord[currentKey.text] === 'null'
          ? `and ${currentKey.text} is null `
          : `and ${name} = '${remainRecord[currentKey.text]}'`;
    }
    let countryValues = '';
    if (onSearchValues.country.length) {
      countryValues = ` and  country_name in (${onSearchValues.country.map(v => `'${v}'`).join(',')})`;
    }
    const fetchSql = createSqlWhere({
      sql,
      startDate: onSearchValues.startDate,
      endDate: onSearchValues.endDate,
      platform: onSearchValues.platform,
      country: countryValues,
      where: where.replace(/\$/g, '$$$$').replace(/campaign_name/g, 'campaign'),
      type: currentKey.text,
      product,
      database,
    });
    return fetchSql;
  };
  const getDataSource = async () => {
    // const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    const fetchSql = getSQL(clientBehaviorAnalysisSQL);
    const res = await getData(fetchSql);
    // console.log('res', res);
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      element['export_dvc_cnt/new_dvc_cnt'] = getNumber(element.export_dvc_cnt, element.new_dvc_cnt, true, 2);
      element['export_cnt/export_dvc_cnt'] = getNumber(element.export_cnt, element.export_dvc_cnt, true, 0);
    }
    setDataSource(res.sort((a, b) => b.new_dvc_cnt - a.new_dvc_cnt));
  };
  useEffect(() => {
    if (onSearchValues.platform) {
      getCoreClomuns();
      getDataSource();
    }
  }, [radioValue, onSearchValues, currentKeyIndex, tags]);
  return (
    <div>
      <p className={styles.title}>
        <span style={{ marginRight: 20 }}>行为数据</span>
      </p>
      <DownLoadButton filename="行为数据" data={dataSource} columns={columns} />
      <Row
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {tags.map((v, index) => (
          <span>
            <Tag color={tagColors[index]} key={v.tag.value} closable onClose={() => closeClick(v, index)}>
              {v.tag.value}:{v.name}
            </Tag>
            {index === tags.length - 1 ? '' : ' / '}
          </span>
        ))}
      </Row>
      <Table columns={columns} dataSource={dataSource} bordered rowKey={SOURCE_KEYS_VIVA[currentKeyIndex].value} />
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
        title={`行为数据-${showType}`}
        width={1000}
      >
        <h2>{remainRecord[SOURCE_KEYS_VIVA[currentKeyIndex].value]}</h2>
        <RegNumChartModal
          visible={visible}
          sql={getSQL(chartClientBehaviorAnalysisSQL)}
          spendSql={getSQL(chartClientBehaviorAnalysisSQL)}
          searchValues={onSearchValues}
          showType={showType}
          name={remainRecord[SOURCE_KEYS_VIVA[currentKeyIndex].text]}
        />
      </Modal>
    </div>
  );
};
