/* eslint-disable no-unused-expressions */
import * as React from 'react';
import { Row, Table } from 'antd';
import moment from 'moment';
import {
  listView, cardListSql, detailPvSql, chartSql, detailUvSql,
} from './const';
import { createSqlWhere, getNumber, getPrecision } from '../../../utils/utils';
import { DownLoadButton } from '../../common/DownLoadButton';
import Query from './components/Query';
import QueryDetail from './components/QueryDetail';
import CardView from './components/CardView';
import { getData } from '../../../utils/request';
import { chartRender2 } from '../../common/chartFunc/chartRender2';

const { useState, useEffect } = React;

const columns = [
  {
    dataIndex: 'video_url',
    title: '模版封面图',
    key: 'video_url',
    align: 'center',
    width: 200,
    render: v => v && <video src={v} controls style={{ width: '180px' }} />,
  },
  // { dataIndex: 'ds', title: '日期', key: 'ds' },
  { dataIndex: 'project_id', title: '工程ID', key: 'project_id' },
  {
    dataIndex: 'publish_time',
    title: '发布时间',
    key: 'publish_time',
  },
  {
    dataIndex: 'category',
    title: '模版分类',
    key: 'category',
  },
  {
    dataIndex: 'is_pro',
    title: '是否vip',
    key: 'is_pro',
    render: is_pro => (is_pro === '1' ? '是' : '否'),
  },
  {
    dataIndex: 'advertise_lock',
    title: '是否广告锁',
    key: 'advertise_lock',
    render: advertise_lock => (advertise_lock === '1' ? '锁定' : '未锁定'),
  },
  {
    dataIndex: 'order_no',
    title: '排序',
    key: 'order_no',
  },
  {
    dataIndex: 'mk_ratio',
    title: '模版制作完成率(%)',
    key: 'mk_ratio',
    sorter: (a, b) => a.mk_ratio - b.mk_ratio,
  },
  {
    dataIndex: 'clk_ratio',
    title: '下载点击率(%)',
    key: 'clk_ratio',
    sorter: (a, b) => a.clk_ratio - b.clk_ratio,
  },
  {
    dataIndex: 'dwnl_ratio',
    title: '下载成功率(%)',
    key: 'dwnl_ratio',
    sorter: (a, b) => a.dwnl_ratio - b.dwnl_ratio,
  },
  {
    dataIndex: 'exp_ratio',
    title: '导出成功率(%)',
    key: 'exp_ratio',
    sorter: (a, b) => a.exp_ratio - b.exp_ratio,
  },
  {
    dataIndex: 'shr_ratio',
    title: '分享率(%)',
    key: 'shr_ratio',
    sorter: (a, b) => a.shr_ratio - b.shr_ratio,
  },
  {
    dataIndex: 'tub_clk_pv',
    title: '模版缩略图点击量',
    key: 'tub_clk_pv',
  },
  {
    dataIndex: 'detail_clk_pv',
    title: '模版详情图点击量',
    key: 'detail_clk_pv',
  },
  {
    dataIndex: 'dwnl_pv',
    title: '下载成功数量',
    key: 'dwnl_pv',
  },
  {
    dataIndex: 'exp_pv',
    title: '导出成功数量',
    key: 'exp_pv',
  },
  {
    dataIndex: 'shr_pv',
    title: '分享数量',
    key: 'shr_pv',
  },
];

export default () => {
  const [cardList, setCardList] = useState([]);
  const [search, setSearch] = useState(null);
  const [detailSearch, setDetailSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const getCardData = () => {
    let where = '';
    if (search?.platform) {
      where += ` and platform = ${search.platform}`;
    }
    if (search?.country) {
      where += ` and country = '${search.country}'`;
    }
    if (search?.newUser) {
      where += ` and new_user = ${search.newUser}`;
    }
    getData(
      createSqlWhere({
        sql: cardListSql,
        startDate: moment(search.currentDate).subtract(1, 'days'),
        endDate: search.currentDate,
        where,
      }),
    ).then((res) => {
      const data = listView.map((x) => {
        const { value, pecision, ...rest } = x;
        return { ...rest };
      });
      if (res.length) {
        const arr = res[0];
        const formatCurrentDate = moment(search.currentDate).format('YYYYMMDD');
        // eslint-disable-next-line no-restricted-syntax
        for (const i of data) {
          if (!i.denominator) {
            const num = arr[`${i.molecular}`];
            i.value = arr.ds === formatCurrentDate ? num : 0;
            if (res.length >= 2) {
              const beforeArr = res[1];
              const beforeNum = beforeArr[`${i.molecular}`];
              i.pecision = getPrecision(num, beforeNum);
            }
          } else {
            const num = getNumber(arr[`${i.molecular}`], arr[`${i.denominator}`]);
            i.value = arr.ds === formatCurrentDate ? num : 0;
            if (res.length >= 2) {
              const beforeArr = res[1];
              const beforeNum = getNumber(beforeArr[`${i.molecular}`], beforeArr[`${i.denominator}`]);
              i.pecision = getPrecision(num, beforeNum);
            }
          }
        }
      }
      setCardList(data);
    });
  };

  const getChartData = async () => {
    let where = '';
    console.log('search', search);
    if (search?.platform) {
      where += ` and platform = ${search.platform}`;
    }
    if (search?.country) {
      where += ` and country = '${search.country}'`;
    }
    if (search?.newUser) {
      where += ` and new_user = ${search.newUser}`;
    }
    const data = await getData(
      createSqlWhere({
        sql: chartSql,
        startDate: moment(search.currentDate).subtract(15, 'days'),
        endDate: search.currentDate,
        where,
      }),
    );
    const chartData1 = [];
    const chartData2 = [];
    data.forEach((v) => {
      chartData1.push({
        day: moment(v.ds).format('YYYY-MM-DD'),
        value: v.show_pv,
        type: v.category,
      });
      chartData2.push({
        day: moment(v.ds).format('YYYY-MM-DD'),
        value: v.show_uv,
        type: v.category,
      });
    });
    chartRender2(chartData1, 'chart1');
    chartRender2(chartData2, 'chart2');
  };

  const getTableData = async () => {
    setLoading(true);
    let where = '';
    let sqlStr = detailSearch.isPv ? detailPvSql : detailUvSql;
    if (detailSearch?.platform) {
      where += ` and platform = ${detailSearch?.platform}`;
    }
    if (detailSearch?.publishStart) {
      where += ` and publish_time >= ${moment(detailSearch?.publishStart).format('YYYYMMDD')}`;
    }
    if (detailSearch?.publishEnd) {
      where += ` and publish_time <= ${moment(detailSearch?.publishEnd).format('YYYYMMDD')}`;
    }
    if (detailSearch?.category) {
      where += ` and category = '${detailSearch?.category}'`;
    }
    if (detailSearch?.isLock) {
      where += ` and advertise_lock = ${detailSearch?.isLock}`;
    }
    if (detailSearch?.isPro) {
      where += ` and is_pro = ${detailSearch?.isPro}`;
    }
    if (detailSearch?.newUser) {
      where += ` and new_user = ${detailSearch?.newUser}`;
      sqlStr = sqlStr.replace(/#new_user#/g, ' new_user, ');
    } else {
      sqlStr = sqlStr.replace(/#new_user#/g, '');
    }
    if (detailSearch?.projectId) {
      where += ` and project_id = ${detailSearch?.projectId}`;
    }
    if (detailSearch?.country) {
      where += ` and country = '${detailSearch?.country}'`;
      sqlStr = sqlStr.replace(/#country#/g, ' country, ');
    } else {
      sqlStr = sqlStr.replace(/#country#/g, '');
    }
    console.log('sqlStr', sqlStr);
    const sql = createSqlWhere({
      sql: sqlStr,
      startDate: detailSearch.startDate,
      endDate: detailSearch.endDate,
      where,
    });
    const res = await getData(sql);
    setDataSource([...res]);
    setLoading(false);
  };

  useEffect(() => {
    if (search) {
      getChartData();
      getCardData();
    }
  }, [search]);

  useEffect(() => {
    if (detailSearch) getTableData();
  }, [detailSearch]);

  return (
    <div>
      <p style={{ fontSize: 26, marginBottom: 10 }}>整体数据</p>
      <Query onSearch={value => setSearch(value)} />
      <Row gutter={12}>
        {cardList.map((v, index) => (
          <CardView {...v} clickType={1} setClickType={() => {}} type={index + 1} key={index} />
        ))}
      </Row>
      <h4>单页面展示量</h4>
      <div id="chart1" />
      <h4>单页面展示设备数</h4>
      <div id="chart2" />
      <hr style={{ margin: '30px 0' }} />
      <p style={{ fontSize: 26, marginBottom: 10 }}>
        <span style={{ display: 'inline-block', marginRight: '12px' }}>细则信息</span>
        <DownLoadButton filename="细则信息" data={dataSource} columns={columns} />
      </p>
      <QueryDetail onSearchDetail={value => setDetailSearch(value)} />
      <Table
        bordered
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={i => JSON.stringify(i)}
        scroll={{ x: columns.length * 120 }}
      />
    </div>
  );
};
