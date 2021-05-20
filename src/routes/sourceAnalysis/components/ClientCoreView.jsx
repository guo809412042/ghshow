/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Checkbox, Table, Tag, Row, Radio, Tooltip, Modal,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { DownLoadButton } from '../../common/DownLoadButton';
import styles from './index.less';
import { SOURCE_KEYS_VIVA, tagColors } from '../viva/constant';
import { createSqlWhere, getNumber, getFixed } from '../../../utils/utils';
import {
  clientCoreSQL,
  clientCoreAmtSQL,
  clientSpendCoreSQL,
  clientCoreDetailSQL,
  clientSpendDetailCoreSQL,
  clientOrganicSQL,
  clientCoreAmtDetailSQL,
  clientLTVAmtSQL,
} from './sqlTemplate';
import { getData } from '../../../utils/request';
import RegNumChartModal from './RegNumChartModal';

export const clientBasicColumns = [
  {
    dataIndex: 'reg_num',
    title: <Tooltip title="新增用户">Install</Tooltip>,
    name: 'Install',
    key: 'reg_num',
    defaultSortOrder: 'descend',
    width: 150,
    sorter: (a, b) => a.reg_num - b.reg_num,
  },
  {
    dataIndex: 'cpa',
    title: <Tooltip title="消耗/新增">Cpa</Tooltip>,
    name: 'Cpa',
    key: 'cpa',
  },
  {
    dataIndex: 'spend',
    title: <Tooltip title="消耗">Cost</Tooltip>,
    name: 'Cost',
    key: 'spend',
    sorter: (a, b) => a.spend - b.spend,
  },
  {
    dataIndex: 'amt_total',
    title: <Tooltip title="当前收入-退款">Revenue</Tooltip>,
    name: 'Revenue',
    key: 'amt_total',
    sorter: (a, b) => a.amt_total - b.amt_total,
  },
  {
    dataIndex: 'roi',
    title: <Tooltip title="当前回收率=当前收入*国家分成比例/cost">Roi(%)</Tooltip>,
    name: 'Roi',
    key: 'roi',
    sorter: (a, b) => a.roi - b.roi,
  },
  {
    dataIndex: 'arpu',
    title: <Tooltip title="单个用户价值">Arpu</Tooltip>,
    name: 'Arpu',
    key: 'arpu',
    sorter: (a, b) => a.arpu - b.arpu,
  },
  {
    dataIndex: 'refund_amt',
    title: '退款金额',
    name: 'refund_amt',
    key: 'refund_amt',
    sorter: (a, b) => a.refund_amt - b.refund_amt,
  },
];

export const clientOrderColumns = [
  {
    dataIndex: 'yearly_trial_paid_cnt',
    title: <Tooltip title="年试用成功订单">year_free</Tooltip>,
    name: 'year_free',
    key: 'yearly_trial_paid_cnt',
  },
  {
    dataIndex: 'monthly_trial_paid_cnt',
    title: <Tooltip title="月试用成功订单">month_free</Tooltip>,
    name: 'month_free',
    key: 'monthly_trial_paid_cnt',
  },
  {
    dataIndex: 'yearly_new_paid_cnt',
    title: <Tooltip title="年首购订单">year_new_purchase</Tooltip>,
    name: 'year_new_purchase',
    key: 'yearly_new_paid_cnt',
  },
  {
    dataIndex: 'monthly_new_paid_cnt',
    title: <Tooltip title="月首购订单">month_new_purchase</Tooltip>,
    name: 'month_new_purchase',
    key: 'monthly_new_paid_cnt',
  },
  {
    dataIndex: 'yearly_old_paid_cnt',
    title: <Tooltip title="年续购订单">year_renew_purchase</Tooltip>,
    name: 'year_renew_purchase',
    key: 'yearly_old_paid_cnt',
  },
  {
    dataIndex: 'monthly_old_paid_cnt',
    title: <Tooltip title="月续购订单">month_renew_purchase</Tooltip>,
    name: 'month_renew_purchase',
    key: 'monthly_old_paid_cnt',
  },
  {
    dataIndex: 'other_old_paid_cnt',
    title: <Tooltip title="其他包订单">other_purchase</Tooltip>,
    name: 'other_purchase',
    key: 'other_old_paid_cnt',
  },
  {
    dataIndex: 'yearly_amt_total',
    title: <Tooltip title="年包收入">year_revenue</Tooltip>,
    name: 'year_revenue',
    key: 'yearly_amt_total',
  },
  {
    dataIndex: 'monthly_amt_total',
    title: <Tooltip title="月包收入">month_revenue</Tooltip>,
    name: 'month_revenue',
    key: 'monthly_amt_total',
  },
  {
    dataIndex: 'other_amt_total',
    title: <Tooltip title="其他包收入">other_revenue</Tooltip>,
    name: 'other_revenue',
    key: 'other_amt_total',
  },
];

export const clientProportionColumns = [
  {
    dataIndex: 'year_ecpa',
    title: <Tooltip title="年试用单价=消耗/年试用">year_ecpa</Tooltip>,
    name: 'year_ecpa',
    key: 'year_ecpa',
  },
  {
    dataIndex: 'month_ecpa',
    title: <Tooltip title="月试用单价=消耗/月试用">month_ecpa</Tooltip>,
    name: 'month_ecpa',
    key: 'month_ecpa',
  },
  {
    dataIndex: 'year_new_rate',
    title: <Tooltip title="年首购率=年首购/新增">year_new_Rate</Tooltip>,
    name: 'year_new_rate',
    key: 'year_new_rate',
  },
  {
    dataIndex: 'month_new_rate',
    title: <Tooltip title="月首购率=月首购/新增">month_new_Rate</Tooltip>,
    name: 'month_new_rate',
    key: 'month_new_rate',
  },
  {
    dataIndex: 'year_free_rate',
    title: <Tooltip title="年试用率=年试用事件/新增">year_free_Rate</Tooltip>,
    name: 'year_free_rate',
    key: 'year_free_rate',
  },
  {
    dataIndex: 'month_free_rate',
    title: <Tooltip title="月试用率=月试用事件/新增">month_free_Rate</Tooltip>,
    name: 'month_free_rate',
    key: 'month_free_rate',
  },
  {
    dataIndex: 'yfree_pur_cvr',
    title: <Tooltip title="年试用付费转化率=年首购/年试用">yfree_pur_Cvr</Tooltip>,
    name: 'yfree_pur_cvr',
    key: 'yfree_pur_cvr',
  },
  {
    dataIndex: 'mfree_pur_cvr',
    title: <Tooltip title="月试用付费转化率=月首购/月试用">mfree_pur_Cvr</Tooltip>,
    name: 'mfree_pur_cvr',
    key: 'mfree_pur_cvr',
  },
];

export const clientWeekColumns = [
  {
    dataIndex: 'amt_total_7d',
    title: <Tooltip title="7天内收入">Rev_7d</Tooltip>,
    name: 'Rev_7d',
    key: 'amt_total_7d',
  },
  {
    dataIndex: 'fore_Rev_7d',
    title: <Tooltip title="根据7天收入预估6个月收入(付费率（天更）和留存率（月更） 滚动计算">fore_Rev_7d</Tooltip>,
    name: 'fore_Rev_7d',
    key: 'fore_Rev_7d',
  },
  {
    dataIndex: 'fore_roi_7d',
    title: <Tooltip title="根据7天预估6个月回收率=预估收入*国家分成比例/cost">fore_Roi_7d(%)</Tooltip>,
    name: 'fore_Roi_7d',
    key: 'fore_roi_7d',
    sorter: (a, b) => a.fore_roi_7d - b.fore_roi_7d,
  },
];

export const clientMonthColumns = [
  {
    dataIndex: 'amt_total_30d',
    title: <Tooltip title="30天内收入">Rev_30d</Tooltip>,
    name: 'Rev_30d',
    key: 'amt_total_30d',
  },
  {
    dataIndex: 'fore_Rev_30d',
    title: <Tooltip title="根据30天收入预估6个月收入">fore_Rev_30d</Tooltip>,
    name: 'fore_Rev_30d',
    key: 'fore_Rev_30d',
  },
  {
    dataIndex: 'fore_roi_30d',
    title: <Tooltip title="根据30天收入预估6个月回收率=预估收入*国家分成比例/cost">fore_Roi_30d(%)</Tooltip>,
    name: 'fore_Roi_30d',
    key: 'fore_roi_30d',
    sorter: (a, b) => a.fore_roi_30d - b.fore_roi_30d,
  },
];

export const clientLTVColumns30 = [
  {
    dataIndex: 'fore_rev30',
    title: <Tooltip title="预估收入">fore_rev(30)</Tooltip>,
    name: 'fore_rev30',
    key: 'fore_rev30',
  },
  {
    dataIndex: 'fore_roi30',
    title: <Tooltip title="预估ROI">fore_roi(30)</Tooltip>,
    name: 'fore_roi30',
    key: 'fore_roi30',
  },
];

export const clientLTVColumns60 = [
  {
    dataIndex: 'fore_rev60',
    title: <Tooltip title="预估收入">fore_rev(60)</Tooltip>,
    name: 'fore_rev60',
    key: 'fore_rev60',
  },
  {
    dataIndex: 'fore_roi60',
    title: <Tooltip title="预估ROI">fore_roi(60)</Tooltip>,
    name: 'fore_roi60',
    key: 'fore_roi60',
  },
];

export const clientLTVColumns90 = [
  {
    dataIndex: 'fore_rev90',
    title: <Tooltip title="预估收入">fore_rev(90)</Tooltip>,
    name: 'fore_rev90',
    key: 'fore_rev90',
  },
  {
    dataIndex: 'fore_roi90',
    title: <Tooltip title="预估ROI">fore_roi(90)</Tooltip>,
    name: 'fore_roi90',
    key: 'fore_roi90',
  },
];

export const clientLTVColumns180 = [
  {
    dataIndex: 'fore_rev180',
    title: <Tooltip title="预估收入">fore_rev(180)</Tooltip>,
    name: 'fore_rev180',
    key: 'fore_rev180',
  },
  {
    dataIndex: 'fore_roi180',
    title: <Tooltip title="预估ROI">fore_roi(180)</Tooltip>,
    name: 'fore_roi180',
    key: 'fore_roi180',
  },
];

export const columnsKeys = [
  { value: '1', label: '基础指标', columns: clientBasicColumns },
  { value: '2', label: '订单指标', columns: clientOrderColumns },
  { value: '3', label: '比例指标', columns: clientProportionColumns },
  // { value: '4', label: '周估指标', columns: clientWeekColumns },
  // { value: '5', label: '月估指标', columns: clientMonthColumns },
  { value: '6', label: '30天预估指标', columns: clientLTVColumns30 },
  { value: '7', label: '60天预估指标', columns: clientLTVColumns60 },
  { value: '8', label: '90天预估指标', columns: clientLTVColumns90 },
  { value: '9', label: '180天预估指标', columns: clientLTVColumns180 },
];

const tabelKeyMap = {
  6: 30,
  7: 60,
  8: 90,
  9: 180,
};
export default ({
  currentKeyIndex,
  setCurrentKeyIndex,
  tags,
  setTags,
  closeClick,
  onSearchValues,
  product,
  database,
}) => {
  const [regRecord, setRegcord] = useState({});
  const [regVisible, setRegVisible] = useState(false);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [tabelKey, setTableKey] = useState(['1']);
  const [showType, setShowType] = useState('');
  const [radioValue, setRadioValue] = useState('campaign');
  const chartShow = async (record, type) => {
    await setShowType(type);
    await setRegcord(record);
    await setRegVisible(true);
  };
  const getColumns = async () => {
    let newColumns = [];
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    if (currentKey.text === 'campaign' && radioValue === 'country') {
      newColumns[0] = {
        dataIndex: 'country_name',
        key: 'country_name',
        title: '地区',
        width: 150,
        fixed: 'left',
      };
    } else {
      newColumns[0] = {
        dataIndex: currentKey.value,
        key: currentKey.value,
        title: currentKey.text,
        width: 150,
        fixed: 'left',
        render: text => (currentKey.text === 'adname' || (currentKey.text !== 'media_source' && text === 'Organic') ? (
          text || 'null'
        ) : (
          <a
            onClick={() => {
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
      };
    }

    for (const i of tabelKey) {
      const find = columnsKeys.find(v => v.value === i);
      if (find) {
        newColumns = newColumns.concat(find.columns);
      }
    }
    if (tabelKey.includes('1')) {
      newColumns[1].onCell = record => ({
        onClick: () => chartShow(record, 'reg_num'),
      });
      newColumns[3].onCell = record => ({
        onClick: () => chartShow(record, 'spend'),
      });
      newColumns[4].onCell = record => ({
        onClick: () => chartShow(record, 'amt_total'),
      });
    }
    if (tabelKey.includes('3')) {
      newColumns.forEach((v) => {
        if (v.name === 'year_ecpa') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'spend/yearly_trial_paid_cnt'),
          });
        }
        if (v.name === 'month_ecpa') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'spend/monthly_trial_paid_cnt'),
          });
        }
        if (v.dataIndex === 'year_new_rate') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'yearly_new_paid_cnt%reg_num'),
          });
        }
        if (v.dataIndex === 'month_new_rate') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'monthly_new_paid_cnt%reg_num'),
          });
        }
        if (v.dataIndex === 'year_free_rate') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'yearly_trial_paid_cnt%reg_num'),
          });
        }
        if (v.dataIndex === 'month_free_rate') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'monthly_trial_paid_cnt%reg_num'),
          });
        }
        if (v.dataIndex === 'yfree_pur_cvr') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'yearly_new_paid_cnt%yearly_trial_paid_cnt'),
          });
        }
        if (v.dataIndex === 'mfree_pur_cvr') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'monthly_new_paid_cnt%monthly_trial_paid_cnt'),
          });
        }
      });
    }
    if (tabelKey.includes('4')) {
      newColumns.forEach((v) => {
        if (v.dataIndex === 'amt_total_7d') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'amt_total_7d'),
          });
        }
        if (v.dataIndex === 'fore_Rev_7d') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'fore_Rev_7d'),
          });
        }
        if (v.dataIndex === 'fore_roi_7d') {
          v.onCell = record => ({
            onClick: () => chartShow(record, 'spend*fore_Rev_7d'),
          });
        }
      });
    }
    // console.log('newColumns', _.uniq(newColumns));
    setColumns(newColumns);
  };

  const getSQL = (sql, Key) => {
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    let where = '';
    tags.forEach((v) => {
      where += v.name && v.name !== 'null' ? ` and ${v.tag.value} = '${v.name}' ` : ` and ${v.tag.value} is null `;
    });
    if (regVisible) {
      const name = regRecord[currentKey.value] === 'Organic'
        ? 'media_source'
        : currentKey.text === 'campaign' && radioValue === 'country'
          ? 'country_name'
          : currentKey.value;
      where
        += regRecord[currentKey.value] === 'null'
          ? `and ${currentKey.value} is null `
          : `and ${name} = '${regRecord[name]}'`;
    }
    let countryValues = '';
    if (onSearchValues.country.length) {
      countryValues = ` and  country_name in (${onSearchValues.country.map(v => `'${v}'`).join(',')})`;
    }
    // console.log('KeyKeyKey', Key);
    if (Key) {
      where += ` and ltv_day = ${tabelKeyMap[Key]}`;
    }
    let fetchSql = createSqlWhere({
      sql,
      startDate: onSearchValues.startDate,
      endDate: onSearchValues.endDate,
      platform: onSearchValues.platform,
      country: countryValues,
      where: where.replace(/\$/g, '$$$$'),
      product,
      type: currentKey.text === 'campaign' && radioValue === 'country' ? 'country_name' : currentKey.value,
      yestoday: moment()
        .subtract(1, 'days')
        .format('YYYYMMDD'),
      database,
    });

    fetchSql = fetchSql.replace(
      /#select_type#/g,
      currentKey.text === 'campaign'
        ? ''
        : currentKey.text === 'campaign' && radioValue === 'country'
          ? 'country_name ,'
          : `${currentKey.value} ,`,
    );
    return fetchSql;
  };
  const getDataSource = async () => {
    const currentKey = SOURCE_KEYS_VIVA[currentKeyIndex];
    const sql = getSQL(clientCoreSQL);
    let res = await getData(sql);
    const Orgres = await getData(getSQL(clientOrganicSQL));
    let name = '';
    if (currentKey.text === 'campaign' && radioValue === 'country') {
      name = 'country_name';
    } else {
      name = currentKey.value;
    }
    res = res.filter(v => v[name] !== 'Organic');
    Orgres.length && (Orgres[0][name] = 'Organic');
    let dataSource = [];
    let data = [];
    if (name === 'country_name') {
      data = res;
    } else {
      data = Orgres.concat(res);
    }
    data.forEach((v) => {
      dataSource.push({
        ...v,
        arpu: getNumber((v.amt_total || 0) - (v.refund_amt || 0), v.reg_num, false),
        refund_amt: getFixed(v.refund_amt),
        amt_total: getFixed(v.amt_total - v.refund_amt, 0),
        yearly_amt_total: getFixed(v.yearly_amt_total, 0),
        monthly_amt_total: getFixed(v.monthly_amt_total, 0),
        other_amt_total: getFixed(v.other_amt_total, 0),
        year_new_rate: `${getNumber(v.yearly_new_paid_cnt, v.reg_num)}%`,
        month_new_rate: `${getNumber(v.monthly_new_paid_cnt, v.reg_num)}%`,
        year_free_rate: `${getNumber(v.yearly_trial_paid_cnt, v.reg_num)}%`,
        month_free_rate: `${getNumber(v.monthly_trial_paid_cnt, v.reg_num)}%`,
        yfree_pur_cvr: `${getNumber(v.yearly_new_paid_cnt, v.yearly_trial_paid_cnt)}%`,
        mfree_pur_cvr: `${getNumber(v.monthly_new_paid_cnt, v.monthly_trial_paid_cnt)}%`,
      });
    });
    const spendSql = getSQL(clientSpendCoreSQL);
    const spendRes = await getData(spendSql);
    dataSource = dataSource.map((v) => {
      const name = currentKey.text === 'campaign' && radioValue === 'country' ? 'country_name' : currentKey.value;
      const find = spendRes.find(i => i[name] === v[name]);
      if (find) {
        return {
          ...v,
          spend: getFixed(find.spend, 0),
          cpa: getNumber(find.spend, v.reg_num, false, 4),
          // roi: getNumber(v.amt_total, find.spend),
          roi: find.spend && v.amt_total ? Number(((v.amt_total * 100) / find.spend).toFixed(0)) : 0,
          year_ecpa: getNumber(find.spend, v.yearly_trial_paid_cnt, false),
          month_ecpa: getNumber(find.spend, v.monthly_trial_paid_cnt, false),
        };
      }
      return v;
    });
    if (tabelKey.includes('4') || tabelKey.includes('5')) {
      const amtSql = getSQL(clientCoreAmtSQL);
      const amtRes = await getData(amtSql);
      dataSource = dataSource.map((v) => {
        const name = currentKey.text === 'campaign' && radioValue === 'country' ? 'country_name' : currentKey.value;
        const find = amtRes.find(i => i[name] === v[name]);
        if (find) {
          const fore_Rev_30d = find.fore_Rev_30d || 0 - v.refund_amt || 0;
          const fore_Rev_7d = find.fore_Rev_7d || 0 - v.refund_amt || 0;
          return {
            ...v,
            ...find,
            amt_total_7d: getFixed(find.amt_total_7d, 0),
            amt_total_30d: getFixed(find.amt_total_30d, 0),
            fore_Rev_7d: getFixed(fore_Rev_7d, 0),
            fore_Rev_30d: getFixed(fore_Rev_30d, 0),
            fore_roi_7d: `${getNumber(fore_Rev_7d, v.spend * 1, true, 0)}`,
            fore_roi_30d: `${getNumber(fore_Rev_30d, v.spend * 1, true, 0)}`,
          };
        }
        return v;
      });
    }
    // 新加-预估指标
    if (tabelKey.includes('6') || tabelKey.includes('7') || tabelKey.includes('8') || tabelKey.includes('9')) {
      for (let index = 0; index < tabelKey.length; index++) {
        const key = tabelKey[index];
        if (!tabelKeyMap[key]) {
          continue;
        }
        const amtSql = getSQL(clientLTVAmtSQL, key);
        // eslint-disable-next-line no-await-in-loop
        const amtRes = await getData(amtSql);
        dataSource = dataSource.map((v) => {
          const name = currentKey.text === 'campaign' && radioValue === 'country' ? 'country_name' : currentKey.value;
          const find = amtRes.find(i => i[name] === v[name]);
          if (find) {
            const reckon_amt = find.reckon_amt || 0;
            return {
              ...v,
              ...find,
              [`fore_roi${tabelKeyMap[key]}`]: getNumber(reckon_amt - v.refund_amt, v.spend, true, 0),
              [`fore_rev${tabelKeyMap[key]}`]: reckon_amt,
              // fore_rev: reckon_amt,
              // amt_total_7d: getFixed(find.amt_total_7d, 0),
              // amt_total_30d: getFixed(find.amt_total_30d, 0),
              // fore_Rev_7d: getFixed(fore_Rev_7d, 0),
              // fore_Rev_30d: getFixed(fore_Rev_30d, 0),
              // fore_roi_7d: `${getNumber(fore_Rev_7d, v.spend * 1, true, 0)}`,
              // fore_roi_30d: `${getNumber(fore_Rev_30d, v.spend * 1, true, 0)}`,
            };
          }
          return v;
        });
      }
    }
    // console.log('dataSource', dataSource);
    setDataSource(dataSource);
  };
  useEffect(() => {
    if (onSearchValues.platform) {
      getColumns();
      getDataSource();
    }
  }, [tabelKey, currentKeyIndex, onSearchValues, radioValue]);
  return (
    <div style={{ marginTop: 20 }}>
      <p className={styles.title}>
        <span style={{ marginRight: 20 }}>核心指标</span>
      </p>
      <DownLoadButton
        filename="核心指标"
        data={dataSource}
        columns={columns.map(v => ({
          ...v,
          title: v.name,
        }))}
      />

      <Checkbox.Group
        options={database === 'serusr' ? columnsKeys.slice(0, 3) : columnsKeys}
        defaultValue={tabelKey}
        onChange={(value) => {
          console.log('value', value);
          setTableKey(value);
        }}
        style={{ marginLeft: 20 }}
      />
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
      {SOURCE_KEYS_VIVA[currentKeyIndex].text === 'campaign' ? (
        <Radio.Group style={{ marginBottom: 10 }} value={radioValue} onChange={e => setRadioValue(e.target.value)}>
          <Radio.Button key="campaign" value="campaign">
            campaign
          </Radio.Button>
          <Radio.Button key="country" value="country">
            地区
          </Radio.Button>
        </Radio.Group>
      ) : (
        ''
      )}
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        scroll={{ x: columns.length * 150 }}
        rowKey={SOURCE_KEYS_VIVA[currentKeyIndex].value}
      />
      <Modal
        visible={regVisible}
        onCancel={() => setRegVisible(false)}
        onOk={() => setRegVisible(false)}
        title={regRecord[SOURCE_KEYS_VIVA[currentKeyIndex].value]}
        width={800}
      >
        <h2>{regRecord[SOURCE_KEYS_VIVA[currentKeyIndex].value]}</h2>
        <RegNumChartModal
          visible={regVisible}
          sql={
            ['amt_total_7d', 'fore_Rev_7d', 'spend*fore_Rev_7d'].includes(showType)
              ? getSQL(clientCoreAmtDetailSQL)
              : getSQL(showType === 'spend' ? clientSpendDetailCoreSQL : clientCoreDetailSQL)
          }
          spendSql={getSQL(clientSpendDetailCoreSQL)}
          searchValues={onSearchValues}
          showType={showType}
          name={
            SOURCE_KEYS_VIVA[currentKeyIndex].text === 'campaign' && radioValue === 'country'
              ? regRecord.country_name
              : regRecord[SOURCE_KEYS_VIVA[currentKeyIndex].value]
          }
        />
      </Modal>
    </div>
  );
};
