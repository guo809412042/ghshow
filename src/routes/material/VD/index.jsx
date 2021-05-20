/* eslint-disable no-dupe-keys */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Row, Table, Button, Modal,
} from 'antd';
import Query from './components/Query';
import QueryDetail from './components/QueryDetail';
import ModalView from './sharemodal/ModalVIew';
import { initData, columns } from './const';
import { APP_PRODUCT_LIST } from '../../../utils/const';
import CardView from '../vivamini/analysis/components/CardView';
import { getData } from '../../../utils/request';
import { cardSQL, chartSQL, mediaSourceListSQL } from './sqlTemplate';
import {
  createSqlWhere, getNumber, getPrecision, getDistincetSQLData,
  getProductIdFoURl,
} from '../../../utils/utils';
import { ChartRenderHHMM } from '../../common/chartFunc/chartRenderHHMM';
import { DownLoadButton } from '../../common/DownLoadButton';
import { sort } from './utils/util';


export default (props) => {
  const { product } = props.match.params;
  const [search, setSearch] = useState({
    new_user: '1',
    date: moment().subtract(1, 'days'),
  });

  // 显示或者关闭模态框
  const [isShowModal, setShowModel] = useState(false);
  const [modalViewData, setModalViewData] = useState({});
  const [sqlWhere, setSqlWhere] = useState();

  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState(initData);
  const [clickType, setClickType] = useState('template_make_dvc_cnt');
  const [dataSource, setDataSource] = useState([]);
  const [downloadDataSource, setDownloadDataSource] = useState([]);
  const [searchDetail, setSearchDetail] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(0, 'days'),
    selectTTid: undefined,
    new_user: '1',
    platform: product * 1 === 35 ? '2' : '1',
    media_source: undefined,
    equal: '0',
  });
  const [countryList, setCountryList] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);
  const [originDataSource, setOriginDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [mediaSource, setMediaSource] = useState([]);

  const getCountryList = async () => {
    const res = await getDistincetSQLData('country', 'vcm_vd_log_material_1h', ` and product_id = ${product}`);
    setCountryList(res);
  };
  const getAppVersionList = async () => {
    const res = await getDistincetSQLData(
      'app_version',
      'vcm_vd_log_material_1h',
      ` and product_id = ${product} and platform = ${searchDetail.platform} order by app_version desc`,
    );
    setAppVersionList(res);
  };
  const getMediaSourceList = async () => {
    const res = await getData(mediaSourceListSQL);
    setMediaSource(res);
  };

  useEffect(() => {
    getCountryList();
    getMediaSourceList();
  }, [product]);

  useEffect(() => {
    getAppVersionList();
  }, [product, searchDetail.platform]);

  const getAllSQLData = async (sql = cardSQL, date) => {
    let where = ` and product_id = ${product}`;
    if (search.platform) {
      where += ` and platform = '${search.platform}'`;
    }
    if (search.new_user) {
      where += ` and new_user = '${search.new_user}'`;
    }
    if (search.country) {
      where += ` and country = '${search.country}'`;
    }
    if (search.media_source) {
      where += ` and media_source = '${search.media_source}'`;
    }
    const res = await getData(
      createSqlWhere({
        sql,
        startDate: date,
        where,
      }),
    );
    return res;
  };
  const getValue = (values, fields) => {
    let value = 0;
    if (fields.includes('/')) {
      value = getNumber(values[fields.split('/')[0]], values[fields.split('/')[1]]);
    } else {
      value = values[fields];
    }
    return value;
  };
  const getCardData = async () => {
    const currentRes = await getAllSQLData(cardSQL, search.date);
    const beforeRes = await getAllSQLData(cardSQL, moment(search.date).subtract(1, 'days'));
    const data = [];
    if (currentRes.length) {
      const values = currentRes[0];
      for (const i of cardData) {
        const arr = { ...i };
        if (i.fields.includes('/')) {
          arr.suffix = true;
        } else {
          arr.suffix = false;
        }
        arr.value = getValue(values, i.fields);
        if (beforeRes.length) {
          const before = beforeRes[0];
          arr.before = getValue(before, i.fields);
          arr.pecision = getPrecision(arr.value, arr.before);
        }
        data.push(arr);
      }
    }
    setCardData(data);
  };
  const getChartData = async () => {
    const todayRes = await getAllSQLData(chartSQL, search.date);
    const yestodayRes = await getAllSQLData(chartSQL, moment(search.date).subtract(1, 'days'));
    const weekRes = await getAllSQLData(chartSQL, moment(search.date).subtract(7, 'days'));
    const chartData = [];
    for (const i of todayRes) {
      chartData.push({
        day: `${moment(new Date()).format('YYYY-MM-DD')} ${i.hh}:00:00`,
        value: getValue(i, clickType),
        type: '今天',
      });
    }
    for (const i of yestodayRes) {
      chartData.push({
        day: `${moment(new Date()).format('YYYY-MM-DD')} ${i.hh}:00:00`,
        value: getValue(i, clickType),
        type: '昨天',
      });
    }
    for (const i of weekRes) {
      chartData.push({
        day: `${moment(new Date()).format('YYYY-MM-DD')} ${i.hh}:00:00`,
        value: getValue(i, clickType),
        type: '一周前',
      });
    }
    ChartRenderHHMM(chartData, 'VD_chart');
  };
  /**
   * 重新按钮 表单内容的数据改变去搜索数据
   */
  const getDetailData = async () => {
    setLoading(true);
    const column = (Array.isArray(columns[product]) ? columns[product] : columns[product][searchDetail.platform]) || [];
    const selects = [];
    for (const i of column) {
      if (
        !i.dataIndex.includes('/')
        && !i.dataIndex.includes('+')
        && i.dataIndex !== 'ttid'
        && i.dataIndex !== 'tt_name'
        && i.dataIndex !== 'country'
      ) {
        selects.push(` sum(${i.dataIndex}) as ${i.dataIndex} `);
      }
    }
    /**
     * 分享渠道 选择框内的内容
     */
    // 选择条件
    // console.log('object', searchDetail);
    // let sqlWhere = 'select * from where ';
    // for (const key in searchDetail) {
    //   if (key === 'new_user') {
    //     sqlWhere += `${key} = ${searchDetail[key]}`;
    //   } else if (key === 'platform') {
    //     sqlWhere += ` and ${key} = ${searchDetail[key]} `;
    //   } else if (key === 'country' && searchDetail.country.length) {
    //     sqlWhere += ` and country not in ('${searchDetail.country}') `;
    //   }
    // }


    const data = [];
    // console.log(searchDetail.country?.length ? searchDetail.country : [1]);
    // eslint-disable-next-line guard-for-in
    for (const j in searchDetail.country?.length ? searchDetail.country : [1]) {
      let where = ` and product_id = ${product}`;
      if (searchDetail.platform) {
        where += ` and platform = '${searchDetail.platform}'`;
      }
      if (searchDetail.new_user) {
        where += ` and new_user = '${searchDetail.new_user}'`;
      }
      // 等于
      if (searchDetail.equal === '0') {
        if (searchDetail.country && searchDetail.country[j]) {
          where += ` and country in ('${searchDetail.country[j]}')`;
        }
      } else { // 不等于
        if (searchDetail.country && searchDetail.country[j]) {
          where += ` and country not in ('${searchDetail.country[j]}')`;
        }
      }


      if (searchDetail.app_version) {
        where += ` and app_version = '${searchDetail.app_version}'`;
      }
      if (searchDetail.media_source) {
        where += ` and media_source = '${searchDetail.media_source}'`;
      }
      const otherWhere = where;
      if (searchDetail.ttid) {
        where += ` and ttid = '${searchDetail.ttid}'`;
      }
      if (searchDetail.tt_name) {
        where += ` and tt_name = '${searchDetail.tt_name}'`;
      }
      const sql = `select
      ttid,max(tt_name) AS tt_name,
      ${selects.join(',')}
      from vcm_vd_log_material_1h
      where ds >= '#startDate#'
      and ds <= '#endDate#' #where#
      and hh = 'all'
      group by ttid
      order by template_make_dvc_cnt desc`;

      const allSql = `select
      '全部ttid' as ttid, '全部tt_name' as tt_name,
      ${selects.join(',\n')}
      from vcm_facee_log_material_1d
      where ds >= '#startDate#'
      and ds <= '#endDate#' #otherWhere#
      group by ttid,tt_name
      `;

      setSqlWhere({
        startDate: searchDetail.startDate,
        endDate: searchDetail.endDate,
        where,
      });
      const res = await getData(
        createSqlWhere({
          sql,
          startDate: searchDetail.startDate,
          endDate: searchDetail.endDate,
          where,
        }),
      );
      const allRes = await getData(
        createSqlWhere({
          sql: allSql,
          startDate: searchDetail.startDate,
          endDate: searchDetail.endDate,
          otherWhere,
        }),
      );
      for (const i of allRes.concat(res)) {
        data.push({
          ...i,
          unqieKey: i.ttid + ((searchDetail.country && searchDetail.country[j]) || '全部'),
          country: `${searchDetail.equal === '1' ? '不等于' : ''}${(searchDetail.country && searchDetail.country[j]) || '全部'}`,
          'home_click_dvc_cnt/home_view_dvc_cnt': getNumber(i.home_click_dvc_cnt, i.home_view_dvc_cnt),
          'make_button_click_dvc_cnt/template_view_dvc_cnt': getNumber(
            i.make_button_click_dvc_cnt,
            i.template_view_dvc_cnt,
          ),
          'template_make_dvc_cnt/template_view_dvc_cnt': getNumber(i.template_make_dvc_cnt, i.template_view_dvc_cnt),
          'share_dvc_cnt/template_make_dvc_cnt': getNumber(i.share_dvc_cnt, i.template_make_dvc_cnt),
          'template_make_dvc_cnt/home_view_dvc_cnt': getNumber(i.template_make_dvc_cnt, i.home_view_dvc_cnt),
          'make_fail_dvc_cnt/total_make_dvc_cnt': getNumber(i.make_fail_dvc_cnt, i.total_make_dvc_cnt),
          'pay_dvc_cnt/template_view_dvc_cnt': getNumber(i.pay_dvc_cnt, i.template_view_dvc_cnt),
          'share_dvc_cnt/save_dvc_cnt': getNumber(i.share_dvc_cnt, i.save_dvc_cnt),
          'save_dvc_cnt/home_view_dvc_cnt': getNumber(i.save_dvc_cnt, i.home_view_dvc_cnt),
          'template_make_dvc_cnt/make_button_click_dvc_cnt': getNumber(
            i.template_make_dvc_cnt,
            i.make_button_click_dvc_cnt,
          ),
          'template_make_dvc_cnt+make_button_click_dvc_cnt':
            (i.template_make_dvc_cnt || 0) + (i.make_button_click_dvc_cnt || 0),
          'save_dvc_cnt/total_make_dvc_cnt': getNumber(i.save_dvc_cnt, i.total_make_dvc_cnt),
          'save_dvc_cnt/template_make_dvc_cnt': getNumber(i.save_dvc_cnt, i.template_make_dvc_cnt),
          'save_dvc_cnt/home_view_dvc_cnt': getNumber(i.save_dvc_cnt, i.home_view_dvc_cnt),
          'make_button_click_cnt/make_button_click_dvc_cnt': getNumber(
            i.make_button_click_cnt,
            i.make_button_click_dvc_cnt,
            false,
          ),
          'template_make_cnt/template_make_dvc_cnt': getNumber(i.template_make_cnt, i.template_make_dvc_cnt, false),
          'save_cnt/save_dvc_cnt': getNumber(i.save_cnt, i.save_dvc_cnt, false),
          'share_cnt/share_dvc_cnt': getNumber(i.share_cnt, i.share_dvc_cnt, false),
          'save_dvc_cnt/make_button_click_dvc_cnt': getNumber(i.save_dvc_cnt, i.make_button_click_dvc_cnt),
          'make_button_click_dvc_cnt/home_view_dvc_cn': getNumber(i.make_button_click_dvc_cnt, i.home_view_dvc_cn),
          'share_dvc_cnt/make_button_click_dvc_cnt': getNumber(i.share_dvc_cnt, i.make_button_click_dvc_cnt),
          'make_fail_dvc_cnt/make_button_click_dvc_cnt': getNumber(i.make_fail_dvc_cnt, i.make_button_click_dvc_cnt),
          'home_click_cnt/home_click_dvc_cnt': getNumber(i.home_click_cnt, i.home_click_dvc_cnt, false),
          'save_cnt/save_dvc_cnt': getNumber(i.save_cnt, i.save_dvc_cnt, false),
          'share_cnt/share_dvc_cnt': getNumber(i.share_cnt, i.share_dvc_cnt, false),
          'total_make_dvc_cnt/template_view_dvc_cnt': getNumber(i.total_make_dvc_cnt, i.template_view_dvc_cnt),
          'total_make_dvc_cnt/home_click_dvc_cnt': getNumber(i.total_make_dvc_cnt, i.home_click_dvc_cnt),
          'share_dvc_cnt/total_make_dvc_cnt': getNumber(i.share_dvc_cnt, i.total_make_dvc_cnt),
          'make_fail_cnt/total_make_cnt': getNumber(i.make_fail_cnt, i.total_make_cnt),
        });
      }
    }

    const ttidMap = {};
    for (const i in data) {
      if (ttidMap[data[i].ttid]) {
        ttidMap[data[i].ttid].children.push(data[i]);
        ttidMap[data[i].ttid].countrySet.add(data[i].country);
      } else {
        ttidMap[data[i].ttid] = {
          children: [data[i]],
          // 有ttid下的集合
          countrySet: new Set([data[i].country]),
        };
      }
    }

    const newData = [];

    // 全部国家的集合
    const country = searchDetail.country?.length ? searchDetail.country.map(c => c || '全部') : ['全部'];

    for (const i in ttidMap) {
      if (ttidMap[i].children.length !== country.length) {
        const obj = {
          ttid: ttidMap[i].children[0].ttid,
          tt_name: ttidMap[i].children[0].tt_name,
        };
        for (const c of country) {
          if (!ttidMap[i].countrySet.has(c)) {
            ttidMap[i].children.push({
              ...obj,
              country: c,
              unqieKey: obj.ttid + c,
            });
          }
        }
      }

      newData.push(...ttidMap[i].children);
    }

    const pageSize = (searchDetail.country?.length || 1) * 10;
    // console.log(newData);
    setPagination({
      current: 1,
      pageSize,
      total: newData.length,
    });
    setOriginDataSource(newData);
    setDataSource(newData.slice(0, pageSize));
    setDownloadDataSource(newData);
    setLoading(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter;
    const { current, pageSize } = pagination;
    const countryNum = searchDetail.country?.length || 1;
    const country = (searchDetail.country?.length && searchDetail.country[0]) || '全部';
    setPagination({
      ...pagination,
    });

    const list = [];
    let temp = {};
    for (const i in originDataSource) {
      if (i % countryNum === 0) {
        temp = { children: [] };
      }
      if (originDataSource[i].country === (`${searchDetail.equal === '0' ? '' : '不等于'}${country}`)) {
        temp = {
          ...originDataSource[i],
          children: [...temp.children, originDataSource[i]],
        };
      } else {
        temp.children.push(originDataSource[i]);
      }

      if (i % countryNum === countryNum - 1) {
        list.push(temp);
      }
    }

    sort(list, columnKey, order);

    const data = [];
    for (const item of list) {
      sort(item.children, columnKey, order);
      data.push(...item.children);
    }

    setDataSource(data.slice((current - 1) * pageSize, current * pageSize));
    setDownloadDataSource(data);
  };

  useEffect(() => {
    getCardData();
  }, [search, product]);
  useEffect(() => {
    getChartData();
  }, [search, product, clickType]);
  useEffect(() => {
    // 每一次表单的数据发送改变的时候 会执行这个方法
    getDetailData();
  }, [searchDetail, product]);

  let col = (Array.isArray(columns[product]) ? columns[product] : columns[product][searchDetail.platform]) || [];
  // 如果当前的url 中得产品id 是 Tempo 或者 Facee话的 个体表格添加一列
  if (APP_PRODUCT_LIST[getProductIdFoURl()] === APP_PRODUCT_LIST[10] || APP_PRODUCT_LIST[getProductIdFoURl()] === APP_PRODUCT_LIST[35]) {
  // if (APP_PRODUCT_LIST[getProductIdFoURl()] === APP_PRODUCT_LIST[10]) {
    col = [...col, {
      dataIndex: '',
      title: '查看渠道',
      key: 'action',
      width: 120,
    }];
  }

  return (
    <div>
      <p style={{ fontSize: 26, marginBottom: 10 }}>整体数据</p>
      <Query search={search} setSearch={setSearch} countryList={countryList} />
      <Row gutter={12}>
        {cardData.map((v, index) => (
          <CardView key={index} {...v} clickType={clickType} setClickType={setClickType} type={v.fields} />
        ))}
      </Row>
      <div id="VD_chart" />
      <p style={{ fontSize: 26, marginBottom: 10 }}>细则信息</p>
      <QueryDetail
        searchDetail={searchDetail}
        setSearchDetail={setSearchDetail}
        countryList={countryList}
        appVersionList={appVersionList}
        mediaSource={mediaSource}
      />
      <DownLoadButton
        filename="细则信息"
        data={downloadDataSource}
        columns={col.map(v => ({
          ...v,
          key: v.dataIndex,
        }))}
      />
      <Table
        sortDirections={['descend', 'ascend']}
        columns={col.map(v => ({
          ...v,
          sorter: !(v.dataIndex === 'ttid' || v.dataIndex === 'tt_name' || v.dataIndex === 'country'),
          render:
              v.dataIndex === 'ttid' || v.dataIndex === 'tt_name'
                ? (value, row, index) => {
                  const obj = {
                    children: value,
                    props: { rowSpan: index % (pagination.pageSize / 10) == 0 ? pagination.pageSize / 10 : 0 },
                  };
                  return obj;
                }
                // : a => a,
                : (text, rec) => {
                  if (v.key === 'action') {
                    return <Button type="primary" onClick={() => {
                      setShowModel(true);
                      setModalViewData(rec);
                    }}>查看详情</Button>;
                  }
                  return text;
                },
        }))}
        dataSource={dataSource}
        rowKey="unqieKey"
        bordered
        scroll={{ x: col.length * 100 }}
        loading={loading}
        onChange={handleTableChange}
        pagination={pagination}
      />

      <Modal
        visible={isShowModal}
        // onOk={this.handleOk}
        onCancel={() => setShowModel(false)}
        destroyOnClose
        footer={[]}
        width={1300}
      >
        <ModalView modalViewData={modalViewData} searchDetail={searchDetail} sqlWhere={sqlWhere}/>
      </Modal>
    </div>
  );
};
