/* eslint-disable no-restricted-syntax */
// /* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Radio, Button, Popover, Checkbox, Col, Row, Table, Tooltip,
} from 'antd';
import { Resizable } from 'react-resizable';
import Query from './components/Query';
import { fields, groups, fieldsTooltip } from './const';
import { DownLoadButton } from '../../common/DownLoadButton';
import { getData } from '../../../utils/request';
import { listSQL, AlllistSQL } from './sqlTemplate';
import { createSqlWhere, getNumber, getFixed } from '../../../utils/utils';
import 'react-resizable/css/styles.css';

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize} draggableOpts={{ enableUserSelectHack: false }}>
      <th {...restProps} />
    </Resizable>
  );
};
const components = {
  header: {
    cell: ResizeableTitle,
  },
};

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(1, 'days'),
    endDate: moment().subtract(1, 'days'),
    group: [],
    productId: '10',
    ltvDay: '180',
  });
  const [dayType, setDayType] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [fildsValue, setFildsValue] = useState(Object.keys(fields));
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const getList = async () => {
    setLoading(true);
    const {
      startDate,
      endDate,
      productId,
      subscribePeriod,
      platform,
      group,
      createTime,
      campaign,
      mediaSource,
      country,
      entrance,
      skuId,
      ltvDay,
    } = search;
    let where = '';
    console.log('search', search);
    let whereLTV = '';
    let whereAD = '';
    if (productId) {
      where += ` and product_id = ${productId}`;
    }
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    whereLTV = `${where} and ltv_day = ${ltvDay}`;
    whereAD = ` ${where} `;

    if (mediaSource && mediaSource.length) {
      where += ` and media_source in (${mediaSource.map(v => `'${v}'`).join(',')}) `;
      whereAD += ` and media_source in (${mediaSource
        .map((v) => {
          switch (v) {
            case 'uac':
              return '\'UAC source\'';
            case 'asm':
              return '\'ASM\'';
            case 'fbad':
              return '\'FBad\'';
            case 'organic':
              return '\'Organic\'';
            case 'jifenqiang':
              return '\'Jifenqiang\'';
            default:
              return `'${v}'`;
          }
        })
        .join(',')}) `;
      whereLTV += ` and media_source in (${mediaSource
        .map((v) => {
          switch (v) {
            case 'uac':
              return '\'UAC source\'';
            case 'asm':
              return '\'ASM\'';
            case 'fbad':
              return '\'FBad\'';
            case 'organic':
              return '\'Organic\'';
            case 'jifenqiang':
              return '\'Jifenqiang\'';
            default:
              return `'${v}'`;
          }
        })
        .join(',')}) `;
    }
    if (country && country.length) {
      where += ` and country in (${country.map(v => `'${v}'`).join(',')}) `;
      whereLTV += ` and country_name in (${country.map(v => `'${v}'`).join(',')}) `;
      whereAD += ` and country_name in (${country.map(v => `'${v}'`).join(',')}) `;
    }

    if (campaign) {
      where += ` and campaign = '${campaign.replace(/\$\$/g, '$$$$$$$$')}'`;
      whereAD += ` and campaign_name = '${campaign.replace(/\$\$/g, '$$$$$$$$')}'`;
      whereLTV += ' and 1!=1 ';
    }

    const otherWhere = where;

    if (entrance && entrance.length) {
      where += ` and entrance in (${entrance.map(v => `'${v}'`).join(',')}) `;
      whereLTV += ' and 1!=1 ';
    }
    if (skuId && skuId.length) {
      const skuIdWhere = [];
      for (const i of skuId) {
        skuIdWhere.push(`(instr(sku_id , '${i}')>0)`);
      }
      where += ` and ( ${skuIdWhere.join(' or ')} )`;
      whereLTV += ' and 1!=1 ';
      // where += ` and sku_id in (${skuId.map(v => `'${v}'`).join(',')}) `;
    }

    let otherWhere1 = where;
    if (subscribePeriod) {
      where += ` and  instr(commodity_type,'${subscribePeriod}') > 0`;
      otherWhere1 += ` and  instr(subscribe_period,'${subscribePeriod}') > 0`;
      // whereLTV += ` and  instr(subscription_type,'${subscribePeriod}') > 0`;
      whereLTV += ' and 1!=1 ';
    }
    if (createTime) {
      where += ` and create_order_time ${createTime} `;
      whereLTV += ' and 1!=1 ';
    }

    let groupLTV = group.filter(v => v === 'country' || v === 'media_source');
    let groupAD = group.filter(v => v === 'country' || v === 'media_source' || v === 'campaign');
    if (groupLTV.includes('country')) {
      groupLTV = groupLTV.filter(v => v !== 'country');
      groupLTV.push('country_name');
    }
    if (groupAD.includes('country')) {
      groupAD = groupAD.filter(v => v !== 'country');
      groupAD.push('country_name');
    }
    if (groupAD.includes('campaign')) {
      groupAD = groupAD.filter(v => v !== 'campaign');
      groupAD.push('campaign_name');
    }

    let selectLTV = groupLTV.map(v => v);
    let selectAD = groupAD.map(v => v);

    if (groupLTV.includes('media_source')) {
      groupLTV = groupLTV.filter(v => v !== 'media_source');
      groupLTV.push(` CASE media_source
      WHEN 'UAC source' THEN 'uac'
      WHEN 'ASM' THEN 'asm'
      WHEN 'FBad' THEN 'fbad'
      WHEN 'Organic' THEN 'organic'
      WHEN 'Jifenqiang' THEN 'jifenqiang'
      ELSE media_source
      END
      `);
    }
    if (groupAD.includes('media_source')) {
      groupAD = groupAD.filter(v => v !== 'media_source');
      groupAD.push(` CASE media_source
      WHEN 'UAC source' THEN 'uac'
      WHEN 'ASM' THEN 'asm'
      WHEN 'FBad' THEN 'fbad'
      WHEN 'Organic' THEN 'organic'
      WHEN 'Jifenqiang' THEN 'jifenqiang'
      ELSE media_source
      END
      `);
    }
    // if (groupAD.includes('media_source')) {
    //   groupAD = groupAD.filter(v => v !== 'media_source');
    // }
    if (selectLTV.includes('media_source')) {
      selectLTV = selectLTV.filter(v => v !== 'media_source');
      selectLTV.push(` CASE media_source
      WHEN 'UAC source' THEN 'uac'
      WHEN 'ASM' THEN 'asm'
      WHEN 'FBad' THEN 'fbad'
      WHEN 'Organic' THEN 'organic'
      WHEN 'Jifenqiang' THEN 'jifenqiang'
      ELSE media_source
      END AS media_source
      `);
    }
    if (selectAD.includes('media_source')) {
      selectAD = selectAD.filter(v => v !== 'media_source');
      selectAD.push(` CASE media_source
      WHEN 'UAC source' THEN 'uac'
      WHEN 'ASM' THEN 'asm'
      WHEN 'FBad' THEN 'fbad'
      WHEN 'Organic' THEN 'organic'
      WHEN 'Jifenqiang' THEN 'jifenqiang'
      ELSE media_source
      END AS media_source
      `);
    }

    // 如果按sku_id,entrance,campaign分组，则不查询ltv数据
    if (group.find(v => v === 'sku_id' || v === 'entrance' || v === 'campaign')) {
      whereLTV += ' and 1!=1 ';
    }

    // 如果按sku_id,entrance,campaign分组，则不查询ltv数据
    if (group.find(v => v === 'sku_id' || v === 'entrance')) {
      whereAD += ' and 1!=1 ';
    }

    const select = (dayType === '1' ? ',ds' : ',substr(ds,1,6) as ds') + group.map(v => `,${v}`).join(' ');
    const select21 = (dayType === '1' ? 'reg_time' : 'substr(reg_time,1,6) as reg_time') + selectLTV.map(v => `,${v}`).join(' ');
    const select31 = (dayType === '1' ? ' cast(bizday AS bigint) as bizday ' : ' substr(bizday,1,6) as bizday ') + selectAD.map(v => `,${v}`).join(' ');
    const select1 = group.map(v => `,a.${v}`).join(' ');
    const group4 = group.map(v => `,${v}`).join(' ');
    const group44 = (dayType === '1' ? 'ds' : 'substr(ds,1,6) ') + group.map(v => `,${v}`).join(' ');
    const group21 = (dayType === '1' ? 'reg_time' : 'substr(reg_time,1,6) ') + groupLTV.map(v => `,${v}`).join(' ');
    const group31 = (dayType === '1' ? 'bizday' : 'substr(bizday,1,6) ') + groupAD.map(v => `,${v}`).join(' ');
    const select55 = group
      .filter(v => v === 'entrance' || v === 'sku_id' || v === 'subscribe_period')
      .map(v => `,null as ${v}`)
      .join(' ');
    const group1 = group
      .filter(v => v !== 'entrance' && v !== 'sku_id' && v !== 'subscribe_period')
      .map(v => `,${v}`)
      .join(' ');
    const join2 = group.map(v => ` and a.${v} = b.${v}`).join(' ');
    const select4 = group
      .filter(v => v !== 'entrance' && v !== 'sku_id' && v !== 'subscribe_period')
      .map(v => `,${v}`)
      .join(' ');
    let join21 = '';
    if (groupLTV.includes('country_name')) {
      join21 += ' and t1.country = t2.country_name';
    }
    if (groupLTV.includes('media_source')) {
      join21 += ' and t1.media_source = t2.media_source';
    }
    let join31 = '';
    if (groupAD.includes('country_name')) {
      join31 += ' and t1.country = t3.country_name';
    }
    if (group.includes('media_source')) {
      join31 += ' and t1.media_source = t3.media_source';
    }
    if (groupAD.includes('campaign_name')) {
      join31 += ' and t1.campaign = t3.campaign_name';
    }
    // console.log('groupAD', groupAD);
    // console.log('join31', join31);
    const res = await getData(
      createSqlWhere({
        sql: listSQL,
        startDate,
        endDate,
        where,
        otherWhere,
        select,
        group: group4,
        order: dayType === '1' ? 'ds' : 'substr(ds,1,6)',
      })
        .replace(/#select1#/g, select1)
        .replace(/#group4#/g, group4)
        .replace(/#join2#/g, join2)
        .replace(/#select2#/g, group4)
        .replace(/#select3#/g, group4)
        .replace(/#select3#/g, group4)
        .replace(/#select4#/g, select4)
        .replace(/#group1#/g, group1)
        .replace(/#join#/g, join2)
        .replace(/#select6#/g, group4)
        .replace(/#group2#/g, group4)
        .replace(/#group3#/g, group4)
        .replace(/#otherWhere1#/g, otherWhere1)
        .replace(/#group44#/g, group44)
        .replace(/#select55#/g, select55)
        .replace(/#select21#/g, select21)
        .replace(/#select31#/g, select31)
        .replace(/#where21#/g, whereLTV)
        .replace(/#where31#/g, whereAD)
        .replace(/#group21#/g, group21)
        .replace(/#join21#/g, join21)
        .replace(/#join31#/g, join31)
        .replace(/#group31#/g, group31),
    );

    const allRes = await getData(
      createSqlWhere({
        sql: AlllistSQL,
        startDate,
        endDate,
        where,
        otherWhere,
        select,
        group: group4,
        order: 'ds',
      })
        .replace(/#select1#/g, select1)
        .replace(/#group4#/g, group4)
        .replace(/#join2#/g, join2)
        .replace(/#select2#/g, group4)
        .replace(/#select3#/g, group4)
        .replace(/#select3#/g, group4)
        .replace(/#select4#/g, select4)
        .replace(/#group1#/g, group1)
        .replace(/#join#/g, join2)
        .replace(/#select6#/g, group4)
        .replace(/#group2#/g, group4)
        .replace(/#group3#/g, group4)
        .replace(/#otherWhere1#/g, otherWhere1)
        .replace(/#group44#/g, group44)
        .replace(/#select55#/g, select55)
        .replace(/#select21#/g, select21)
        .replace(/#select31#/g, select31)
        .replace(/#where21#/g, whereLTV)
        .replace(/#where31#/g, whereAD)
        .replace(/#group21#/g, group21)
        .replace(/#join21#/g, join21)
        .replace(/#group31#/g, group31)
        .replace(/#join31#/g, join31),
    );
    const allData = {};
    if (allRes.length) {
      for (const i of Object.keys(fields)) {
        allData[i] = allRes[0][i] || 0;
      }
      allData.reckon_amt = allRes[0].reckon_amt;
      allData.reckon_amt2 = allRes[0].reckon_amt2;
      allData.charged_amount2 = allRes[0].charged_amount2;
      allData.refund_amount2 = allRes[0].refund_amount2;
      allData.ds = '合计';
      for (const i of group) {
        if (i === 'sku_id') {
          allData.sku_id = skuId && skuId.length ? skuId.join(' | ') : '合计';
        }
        if (i === 'entrance') {
          allData.entrance = entrance && entrance.length ? entrance.join(' | ') : '合计';
        }
        if (i === 'country') {
          allData.country = country && country.length ? country.join(' | ') : '合计';
        }
        if (i === 'media_source') {
          allData.media_source = mediaSource && mediaSource.length ? mediaSource.join(' | ') : '合计';
        }
        if (i === 'campaign') {
          allData.campaign = campaign || '合计';
        }
      }
    }

    // const ltvData = await getData(
    //   createSqlWhere({
    //     sql: LTVListSQL,
    //     startDate,
    //     endDate,
    //     where: whereLTV,
    //     group: groupLTV,
    //   }),
    // );

    // const allLTVData = await getData(
    //   createSqlWhere({
    //     sql: allLTVListSQL,
    //     startDate,
    //     endDate,
    //     where: whereLTV,
    //     group: groupLTV,
    //   }),
    // );

    // console.log(allLTVData, ltvData);

    const data = [allData].concat(res).map((v, key) => {
      v.ad_revenue = getFixed(v.ad_revenue, 2);
      v.reckon_amt2 = getFixed(v.reckon_amt2, 4);
      return {
        ...v,
        key,
        ad_revenue: getFixed(v.ad_revenue, 2),
        ad_cost: getFixed(v.ad_cost, 2),
        real_revenue: getFixed(v.real_revenue, 2),
        refund_amount: getFixed(v.refund_amount, 2),
        charged_amount: getFixed(v.charged_amount, 2),
        cpa: getNumber(v.ad_cost, v.user_num, false, 4),
        arpu: getNumber(v.charged_amount2 - v.refund_amount2 + v.ad_revenue, v.user_num, false, 2),
        profit: getFixed(v.charged_amount2 - v.refund_amount2 + v.ad_revenue - v.ad_cost, 2),
        profit_rate: `${getNumber(v.charged_amount2 - v.refund_amount2 - v.ad_cost + v.ad_revenue, v.ad_cost)}%`,
        view_rate: `${getNumber(v.subscription_views_num, v.user_num)}%`,
        click_rate: `${getNumber(v.subscription_click_num, v.subscription_views_num)}%`,
        subscribe_success_rate: `${getNumber(v.subscribe_success_num, v.subscription_views_num)}%`,
        purchase_success_rate: `${getNumber(v.purchase_num + v.free_purchase_num, v.subscribe_success_num)}%`,
        purchase_rate: `${getNumber(v.purchase_num + v.free_purchase_num, v.user_num)}%`,
        refund_rate: `${getNumber(v.refund_num, v.purchase_num * 1 + v.free_purchase_num * 1)}%`,
        purchase_renew_rate: `${getNumber(v.purchase_renew_num, v.purchase_num * 1 + v.free_purchase_num * 1)}%`,
        fore_roi: `${v.fore_roi === '-' ? '-' : `${getNumber(v.reckon_amt2 - v.refund_amount2 + v.ad_revenue, v.ad_cost, true, 2)}%`}`,
        LTV: `${v.LTV === '-' ? '-' : `${getNumber(v.reckon_amt2 - v.refund_amount2 + v.ad_revenue, v.user_num, false, 4)}`}`,
      };
    });
    setDataSource(data);
    setLoading(false);
  };

  useEffect(() => {
    getList();
  }, [search, dayType]);

  const content = (
    <div style={{ width: 500 }}>
      <Checkbox.Group value={fildsValue} onChange={setFildsValue}>
        <Row>
          {Object.keys(fields).map(item => (
            <Col span={8} style={{ marginBottom: 10 }} key={item}>
              <Checkbox value={item} key={item}>
                {fields[item]}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </div>
  );
  const handleResize = index => (e, { size }) => {
    const nextColumns = [...columns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    setColumns(nextColumns);
  };
  useEffect(() => {
    setColumns(
      [
        {
          dataIndex: 'ds',
          title: '日期',
          fixed: 'left',
          width: 120,
        },
      ]
        .concat(
          search.group.map(v => ({
            dataIndex: v,
            title: groups[v],
            fixed: 'left',
            width: 120,
          })),
        )
        .concat(
          fildsValue.map(v => ({
            dataIndex: v,
            title: fields[v],
            width: 150,
            sorter: (a, b) => a[v] - b[v],
          })),
        ),
    );
  }, [search.group, fildsValue]);
  return (
    <div>
      <Query search={search} setSearch={setSearch} />
      <div>
        <Radio.Group value={dayType} onChange={e => setDayType(e.target.value)}>
          <Radio.Button value="1" key="1">
            日
          </Radio.Button>
          <Radio.Button value="2" key="2">
            月
          </Radio.Button>
        </Radio.Group>
        <div style={{ float: 'right' }}>
          <Popover title={null} content={content} trigger="click" placement="left">
            <Button style={{ marginRight: 10 }}>数据筛选</Button>
          </Popover>
          <DownLoadButton
            data={dataSource}
            filename="订阅转化数据"
            columns={columns.map(v => ({
              ...v,
              key: v.dataIndex,
            }))}
          />
        </div>
      </div>
      <Table
        components={components}
        dataSource={dataSource}
        columns={columns
          .map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
              width: column.width,
              onResize: handleResize(index),
            }),
          }))
          .map((v) => {
            if (fieldsTooltip[v.dataIndex]) {
              return {
                ...v,
                title: <Tooltip title={fieldsTooltip[v.dataIndex]}>{v.title}</Tooltip>,
              };
            }
            return v;
          })}
        bordered
        style={{ marginTop: 20 }}
        scroll={{ x: columns.length * 140 }}
        rowKey="key"
        loading={loading}
      />
    </div>
  );
};
