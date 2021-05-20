/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Table, Row, Tag, Modal,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { DownLoadButton } from '../../../common/DownLoadButton';
import styles from '../../components/index.less';
import {
  vivaAllColumns, vivaMoneyColumns, tagColors, SOURCE_KEYS_VIVA,
} from '../constant';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { vivaMoneySQL, coreSqlDetail } from '../sqlTemplate';
import { getData } from '../../../../utils/request';
import RegNumChartModal from '../../components/RegNumChartModal';

const CoreView = ({
  radioValue, currentKeyIndex, onSearchValues, setCurrentKeyIndex,
  tags, setTags, closeClick,
}) => {
  const [regRecord, setRegcord] = useState({});
  const [regVisible, setRegVisible] = useState(false);
  const [columns, setCOlumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [OrgnicData, setOrgnicData] = useState({});
  const chartShow = async (record) => {
    await setRegcord(record);
    await setRegVisible(true);
  };
  const getCoreClomuns = async () => {
    let newColumns = [];
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
    if (radioValue === 'all') {
      newColumns = newColumns.concat(vivaAllColumns);
      newColumns[1].onCell = record => ({
        onClick: () => chartShow(record),
      });
    } else if (radioValue === 'b') {
      newColumns = newColumns.concat(vivaMoneyColumns);
      newColumns[1].onCell = record => ({
        onClick: () => chartShow(record),
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
    if (regVisible) {
      const name = regRecord[currentKey.value] === 'Organic' ? 'media_source' : currentKey.value;
      where += (regRecord[currentKey.value] === 'null' ? `and ${currentKey.value} is null ` : `and ${name} = '${regRecord[currentKey.value]}'`);
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
      yestoday: moment().subtract(1, 'days').format('YYYYMMDD'),
    });
    return fetchSql;
  };
  const getMoneyData = async () => {
    const sql = getSQL(vivaMoneySQL);
    const res = await getData(sql);
    return res;
  };

  const getDataSource = async () => {
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    let data = [];
    if (radioValue === 'all') {
      const res1 = await getMoneyData();
      data = res1.map((i) => {
        i['trial_paid_cnt/reg_num'] = getNumber(i.trial_paid_cnt, i.reg_num);
        i['(yearly_paid_cnt+monthly_paid_cnt+other_paid_cnt)/reg_num'] = i.reg_num ? Number(((i.yearly_paid_cnt + i.monthly_paid_cnt + i.other_paid_cnt) * 100 / i.reg_num).toFixed(2)) : 0;
        return {
          ...i,
        };
      });
    } else if (radioValue === 'b') {
      const res1 = await getMoneyData();
      data = res1.map((i) => {
        i['trial_paid_cnt/reg_num'] = getNumber(i.trial_paid_cnt, i.reg_num);
        i['(yearly_paid_cnt+monthly_paid_cnt+other_paid_cnt)/reg_num'] = i.reg_num ? Number(((i.yearly_paid_cnt + i.monthly_paid_cnt + i.other_paid_cnt) * 100 / i.reg_num).toFixed(2)) : 0;
        return {
          ...i,
        };
      });
    }
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
    <p className={styles.title}><span style={{ marginRight: 20 }}>核心指标</span>
    </p>
    <DownLoadButton
      filename="核心指标"
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
      visible={regVisible}
      onCancel={() => setRegVisible(false)}
      onOk={() => setRegVisible(false)}
      title="新增用户"
      width={800}
    >
      <h2>{regRecord[SOURCE_KEYS_VIVA[currentKeyIndex].value]}</h2>
      <RegNumChartModal
        visible={regVisible}
        sql={getSQL(coreSqlDetail)}
        searchValues={onSearchValues}
        showType="reg_num"
        name={regRecord[SOURCE_KEYS_VIVA[currentKeyIndex].value]}
      />
    </Modal>
  </div>;
};

export default CoreView;
