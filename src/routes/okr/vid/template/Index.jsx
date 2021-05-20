/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Table, Modal } from 'antd';
import _ from 'lodash';
import Query from './components/Query';
import { cardData, columns, productListMap } from './const';
import CardView from './components/CardView';
import {
  getPrecision, getNumber, createSqlWhere, dateFormat,
} from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import {
  cardSQL, chartSQL, cardOtherSQL, cardTemCnTSQL, chartOtherSQL, chartTemCntSQL, listSqlUV, listSqlPV, groupInfoSql,
  mediaSourceListSQL, campaignNameListSQL, adsetListSQL,
} from './sqlTemplate';
import { ChartRenderHHMM } from '../../../common/chartFunc/chartRenderHHMM';
import QueryDetail from './components/QueryDetail';
import { DownLoadButton } from '../../../common/DownLoadButton';

let all_export_cnt = 1;
let all_share_cnt = 1;
export default (props) => {
  const { params: { product } } = props.match;
  const [productId, setProductId] = useState(Number(productListMap.get(product)) || 6);
  const defaultUserTypeObj = { 6: 'all', 42: 'all' };

  const [search, setSearch] = useState(() => ({
    currentDate: moment().subtract(1, 'days'),
    usrType: productId ? productId === 6 ? 'new' : 'all' : null, // vid时才有用户选项
    community: productId ? 'all' : null,
  }));
  const [searchDetail, setSearchDetail] = useState(() => ({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(0, 'days'),
    database: 'rpt_india_log_tmpl_per_1d',
    type: '_',
    selectTTid: undefined,
    searchTTName: undefined,
    usrType: productId ? defaultUserTypeObj[productId] : null, // vid时才有用户选项
    community: productId ? 'all' : null,
    productId,
    groupCode: undefined,
    mediaSource: 'all',
    campaign: 'all',
    adset: 'all',
  }));
  const [loading, setLoading] = useState(false);
  const [cardList, setCardList] = useState(cardData);
  const [clickType, setClickType] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [groupInfoSelectList, setGroupInfoSelectList] = useState([]);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [adsetList, setAdset] = useState([]);

  useEffect(() => {
    setSearch(Object.assign(search, { usrType: productId ? productId === 6 ? 'new' : 'all' : null, community: productId ? 'all' : null }));
    setSearchDetail(Object.assign(searchDetail, { usrType: productId ? defaultUserTypeObj[productId] : null, community: productId ? 'all' : null }));
  }, [productId]);

  const onSearch = (value) => {
    setSearch(value);
  };
  const onSearchDetail = (value) => {
    setSearchDetail(value);
  };

  const fetchSQLData = async (sql) => {
    let $Where = '';
    if (productId && search.community !== 'all') {
      $Where = `and community = '${search.community}'`;
    } else {
      $Where = `and product_id = ${productId}`;
    }
    if (search.usrType && search.usrType !== 'all') {
      $Where = `and usr_type = '${search.usrType}'`;
    }
    const res = await getData(
      createSqlWhere({
        sql,
        startDate: moment(search.currentDate).subtract(1, 'days'),
        database: productId && search.community !== 'all' ? 'rpt_vid_log_template_cnt_1d' : 'rpt_india_log_tmpl_per_1d',
        endDate: search.currentDate,
        where: $Where,
      }),
    );
    return res;
  };

  const fetchGroupInfoSql = async () => {
    // let $Where = '';
    // if (productId && search.community !== 'all') {
    //   $Where = `and community = '${search.community}'`;
    // } else {
    //   $Where = `and product_id = ${productId}`;
    // }
    // if (search.usrType && search.usrType !== 'all') {
    //   $Where = `and usr_type = '${search.usrType}'`;
    // }
    const res = await getData(groupInfoSql.replace(/#product_id#/g, productId));
    console.log('res', res);
    const groupInfoList = [];
    const groupInfoSelectList = [];
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      if (element.group_info) {
        const insertArr = element.group_info.split(',');
        insertArr.map((item) => {
          groupInfoList.push(`${item.split('_')[0]}%${item.split('_')[1]}`);
        });
      }
    }
    const set = new Set(groupInfoList); // 去掉重复数据，返回结果是'set'
    const newArr = Array.from(set); // 将set转化为数组
    for (let index = 0; index < newArr.length; index++) {
      const element = newArr[index];
      groupInfoSelectList.push({
        name: element.split('%')[1],
        code: element.split('%')[0],
      });
    }
    setGroupInfoSelectList(groupInfoSelectList);
    // console.log('groupInfoSelectList', groupInfoSelectList);
    return res;
  };

  const getMediaSource = async () => {
    let $Where = '';
    if (productId) {
      $Where = `and product_id = ${productId}`;
    }
    const mediaSourceList = await getData(mediaSourceListSQL.replace(/#where#/g, $Where));
    const campaignNameList = await getData(campaignNameListSQL.replace(/#where#/g, $Where));
    const adsetList = await getData(adsetListSQL.replace(/#where#/g, $Where));
    setMediaSourceList(mediaSourceList);
    setCampaignList(campaignNameList);
    setAdset(adsetList);
    // console.log('groupInfoSelectList', groupInfoSelectList);
  };
  const getCardData = async () => {
    const res = await fetchSQLData(cardSQL);
    const otherRes = await fetchSQLData(cardOtherSQL);
    const temCntRes = await fetchSQLData(cardTemCnTSQL);
    const data = _.clone(cardList);
    if (res.length) {
      const arr = res[0];
      for (const i of data) {
        if (!i.denominator) {
          const num = arr[`${i.molecular}`];
          i.value = num;
          if (res.length >= 2) {
            const beforeArr = res[1];
            const beforeNum = beforeArr[`${i.molecular}`];
            i.pecision = getPrecision(num, beforeNum);
          } else {
            i.pecision = 0;
          }
        } else {
          const currentData = otherRes.filter(v => dateFormat(v.ds) === dateFormat(search.currentDate));
          const beforeData = otherRes.filter(
            v => dateFormat(v.ds) === dateFormat(moment(search.currentDate).subtract(1, 'days')),
          );
          let num1 = 0;
          let num2 = 0;
          for (const j of currentData) {
            num1 += j[i.molecular];
            num2 += j[i.denominator];
          }
          let num = getNumber(num1, num2);
          num = getNumber(num, temCntRes[0].tem_cnt);
          i.value = num;
          if (beforeData.length) {
            let beforeNum1 = 0;
            let beforeNum2 = 0;
            for (const j of beforeData) {
              beforeNum1 += j[i.molecular];
              beforeNum2 += j[i.denominator];
            }
            let beforeNum = getNumber(beforeNum1, beforeNum2);
            beforeNum = getNumber(beforeNum, temCntRes?.[1]?.tem_cnt);
            i.pecision = getPrecision(num, beforeNum);
          } else {
            i.pecision = 0;
          }
        }
      }
    } else {
      for (const i of data) {
        i.value = 0;
        i.pecision = 0;
      }
    }
    setCardList(data);
  };
  const fetchChartSQLData = async (sql) => {
    let $Where = '';
    if (productId && search.community !== 'all') {
      $Where = `and community = '${search.community}'`;
    } else {
      $Where = `and product_id = ${productId}`;
    }
    console.log('search', search);
    const res = await getData(
      createSqlWhere({
        sql,
        database: productId && search.community !== 'all' ? 'rpt_vid_log_template_cnt_1d' : 'rpt_india_log_tmpl_per_1d',
        startDate: search.currentDate,
        weekday: moment(search.currentDate)
          .subtract(7, 'days')
          .format('YYYYMMDD'),
        yestoday: moment(search.currentDate)
          .subtract(1, 'days')
          .format('YYYYMMDD'),
        type: search.usrType,
        where: $Where,
      }),
    );
    return res;
  };
  const getChartData = async () => {
    const arr = cardData[clickType - 1];
    const yestoday = moment(search.currentDate)
      .subtract(1, 'days')
      .format('YYYYMMDD');
    const data = await fetchChartSQLData(chartSQL);
    const otherData = await fetchChartSQLData(chartOtherSQL);
    const temCntData = await fetchChartSQLData(chartTemCntSQL);
    const chartData = [];
    if (!arr.denominator) {
      data.forEach((v) => {
        chartData.push({
          day: `${moment(search.currentDate).format('YYYY-MM-DD')} ${v.hh}:00`,
          value: v[`${arr.molecular}`],
          type:
            Number(moment(search.currentDate).format('YYYYMMDD')) === Number(v.ds)
              ? '当天'
              : Number(yestoday) === Number(v.ds)
                ? '昨天'
                : '一周前',
        });
      });
    } else {
      for (const i of temCntData) {
        const res = otherData.filter(v => Number(v.ds) === Number(i.ds) && Number(v.hh) === Number(i.hh));
        let num1 = 0;
        let num2 = 0;
        for (const j of res) {
          num1 += j[arr.molecular];
          num2 += j[arr.denominator];
        }
        const num = getNumber(num1, num2);
        chartData.push({
          day: `${moment().format('YYYY-MM-DD')} ${i.hh}:00`,
          value: getNumber(num, i.tem_cnt),
          type:
            Number(moment(search.currentDate).format('YYYYMMDD')) === Number(i.ds)
              ? '当天'
              : Number(yestoday) === Number(i.ds)
                ? '昨天'
                : '一周前',
        });
      }
    }
    ChartRenderHHMM(chartData, 'chart');
  };
  const getTableData = async () => {
    setLoading(true);
    // console.log('searchDetail', searchDetail);
    let where = '';
    let whereAll = '';
    if (searchDetail.selectTTid) {
      where += ` and template_id = '${searchDetail.selectTTid.trim()}' `;
    }
    if (searchDetail.groupCode && searchDetail.groupCode !== 'all') {
      where += ` and instr (group_info, "${searchDetail.groupCode}") >0 `;
    }
    // if (searchDetail.searchTTName) {
    //   where += ` and template_name like "%${searchDetail.searchTTName.trim()}%"`;
    // }
    if (product === 'vid' || product === 'mast') {
      if (searchDetail.usrType) {
        where += ` and user_type = '${searchDetail.usrType}'`;
        whereAll += ` and user_type = '${searchDetail.usrType}'`;
      }
      where += ` and community = '${searchDetail.community}'`;
      whereAll += ` and community = '${searchDetail.community}'`;
      if (searchDetail.mediaSource && searchDetail.mediaSource !== 'all') {
        where += ` and media_source = '${searchDetail.mediaSource}'`;
        whereAll += ` and media_source = '${searchDetail.mediaSource}'`;
      }
      if (searchDetail.campaign && searchDetail.campaign !== 'all') {
        where += ` and campaign = '${searchDetail.campaign}'`;
        whereAll += ` and campaign = '${searchDetail.campaign}'`;
      }
      if (searchDetail.adset && searchDetail.adset !== 'all') {
        where += ` and adset = '${searchDetail.adset}'`;
        whereAll += ` and adset = '${searchDetail.adset}'`;
      }
    }
    where += ` and product_id = ${productId}`;
    // console.log('where', where);
    whereAll += ` and product_id = ${productId}`;
    const res = await getData(
      createSqlWhere({
        sql: searchDetail.type === '_' ? listSqlPV : listSqlUV,
        startDate: searchDetail.startDate,
        endDate: searchDetail.endDate,
        where,
      }),
    );
    const allRes = await getData(
      createSqlWhere({
        sql: searchDetail.type === '_' ? listSqlPV : listSqlUV,
        startDate: searchDetail.startDate,
        endDate: searchDetail.endDate,
        where: `${whereAll} and template_id = 'all' `,
      }),
    );
    if (allRes.length) {
      all_export_cnt = allRes[0].export_cnt;
      all_share_cnt = allRes[0].shr_cnt;
    }
    const dataSource = res.filter((item) => {
      // if (item.template_type === 'all') {
      //   all_export_cnt = allRes[0].export_cnt;
      // }
      if (searchDetail.searchTTName) {
        if (item.template_name && item.template_name.toLowerCase().indexOf(searchDetail.searchTTName.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
      return true;
    }).map((v, index) => ({
      ...v,
      shr_export_ratio: v.shr_export_ratio || 0,
      cover_list_ratio: v.cover_list_ratio || 0,
      made_pre_exp_ratio: v.made_pre_exp_ratio || 0,
      export_made_ratio: v.export_made_ratio || 0,
      shr_cnt: v.shr_cnt || 0,
      export_exp_ratio: v.export_exp_ratio || 0,
      'prev_cnt/exp_cnt': getNumber(v.prev_cnt, v.exp_cnt),
      'click_cnt/exp_cnt': getNumber(v.click_cnt, v.exp_cnt),
      'click_cnt/prev_cnt': getNumber(v.click_cnt, v.prev_cnt),
      'export_cnt/click_cnt': getNumber(v.export_cnt, v.click_cnt),
      'shr_cnt/export_cnt': getNumber(v.shr_cnt, v.export_cnt),
      'upload_cnt/export_cnt': getNumber(v.upload_cnt, v.export_cnt),
      all_export_cnt,
      'export_cnt/all_export_cnt': getNumber(v.export_cnt, all_export_cnt),
      previewurl: v?.previewurl?.replace(/hybrid.gltxy.xyz/, 'xy-hybrid.kakalili.com'),
      key: index,
      all_share_cnt,
      'shr_cnt/all_share_cnt': getNumber(v.shr_cnt, all_share_cnt),
    }));
    console.log('dataSource', dataSource);
    setDataSource(dataSource);
    setLoading(false);
  };

  const changeProductId = (location) => {
    const pathArr = location?.pathname?.split('/');
    const curProductName = pathArr[pathArr.length - 1];
    setProductId(Number(productListMap.get(curProductName)));
    fetchGroupInfoSql();
    getMediaSource();
  };


  useEffect(() => {
    if (productId) getChartData();
  }, [clickType, search, productId]);
  useEffect(() => {
    if (productId) getCardData();
  }, [search, productId]);
  useEffect(() => {
    if (productId) getTableData();
  }, [searchDetail, productId]);

  useEffect(() => {
    props.history.listen(location => changeProductId(location));
    fetchGroupInfoSql();
    getMediaSource();
    // return () => {
    //   props.history.unlisten(() => changeProductId());
    // };
  }, []);
  return (
    <div>
      <p style={{ fontSize: 26, marginBottom: 10 }}>整体数据</p>
      {!!productId && <Query productId={productId} search={search} onSearch={onSearch} />}
      <Row gutter={12}>
        {cardList.map((v, index) => (
          (!v.showInProductIds || (v?.showInProductIds?.includes(productId))) && <CardView {...v} clickType={clickType} setClickType={setClickType} type={index + 1} search={search} product={product}/>
        ))}
      </Row>
      <div id="chart" />
      <hr style={{ margin: '30px 0' }} />
      <p style={{ fontSize: 26, marginBottom: 10 }}>细则信息</p>
      {!!productId && <QueryDetail productId={productId} searchDetail={searchDetail} onSearchDetail={onSearchDetail} groupInfoSelectList={groupInfoSelectList} mediaSourceList={mediaSourceList} campaignList={campaignList} adsetList={adsetList} />}
      <div style={{ height: '20px' }}/>
      <DownLoadButton filename="素材分析" data={dataSource} columns={columns} />
      <Table
        bordered
        style={{ marginTop: 20 }}
        columns={columns.map((v) => {
          if (v.dataIndex !== 'previewurl') {
            return v;
          }
          v.render = text => (
            <div
              onClick={() => {
                setVisible(true);
                setImgUrl(text);
              }}
            >
              <img src={text} alt={text} style={{ width: 70, height: 70 }} />
            </div>
          );

          return v;
        }).filter(v => (searchDetail.usrType === 'old' ? v.dataIndex !== 'click_cnt/prev_cnt' : v.dataIndex !== 'click_cnt/exp_cnt'))
          .filter(v => !v.showInProductIds || v?.showInProductIds?.includes(productId))
        }
        dataSource={dataSource}
        loading={loading}
        rowKey="key"
        scroll={{ x: (columns.length + 1) * 100 }}
      />
      <Modal title="图" onCancel={() => setVisible(false)} onOk={() => setVisible(false)} visible={visible}>
        <img src={imgUrl} alt={imgUrl} style={{ width: '100%' }} />
      </Modal>
    </div>
  );
};
