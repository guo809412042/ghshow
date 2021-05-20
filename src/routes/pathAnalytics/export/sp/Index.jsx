/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-10 09:22:57
 * @LastEditTime: 2020-03-24 17:39:31
 * @LastEditors: ssssslf
 */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Tabs, Icon, Row, Table, Statistic, Col, Spin,
} from 'antd';
import _ from 'lodash';
import QueryIndex from '../components/QueryIndex';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import {
  yunduanSQL, localSQL, yunduanDetailSQL, localDetailSQL,
} from '../components/sqlTemplate';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';
import { yunInitData, localInitData } from './contants';
import DetailTableModal from '../../components/DetailTableModal';

const { TabPane } = Tabs;
export default () => {
  const [search, setSearch] = useState({
    where: ' and new_user =  \'Y\' and platform = \'1\'',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    platform: '1',
  });
  const [activeKey, setActiveKey] = useState('1');
  const [dataSource1, setDataSource1] = useState([]);
  const [dataSource2, setDataSource2] = useState([]);
  const [lodaing1, setLoading1] = useState(false);
  const [lodaing2, setLoading2] = useState(false);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const getYunFetchData = async () => {
    setLoading1(true);
    const sql = createSqlWhere({
      sql: yunduanSQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where: search.where,
    });
    const res = await getData(sql);
    const data = res.map(v => ({
      ...v,
      'gallery_entry_cnt_1d/home_entry_cnt_1d': `${getNumber(v.gallery_entry_cnt_1d, v.home_entry_cnt_1d)}%`,
      'preview_entry_cnt_1d/gallery_entry_cnt_1d': `${getNumber(v.preview_entry_cnt_1d, v.gallery_entry_cnt_1d)}%`,
      'save_button_clk_cnt_1d/preview_entry_cnt_1d': `${getNumber(v.save_button_clk_cnt_1d, v.preview_entry_cnt_1d)}%`,
      'share_savetogallery_cnt_1d/save_button_clk_cnt_1d': `${getNumber(v.share_savetogallery_cnt_1d, v.save_button_clk_cnt_1d)}%`,
      'share_button_clk_cnt_1d/save_button_clk_cnt_1d': `${getNumber(v.share_button_clk_cnt_1d, v.save_button_clk_cnt_1d)}%`,
    }));
    setDataSource1(data);
    const initData = _.clone(yunInitData);
    const row = res.length ? res[0] : {};
    initData[0].value = row.home_entry_cnt_1d || 0;
    initData[0].percent[0].percent = `${getNumber(row.gallery_entry_cnt_1d, row.home_entry_cnt_1d)}%`;
    initData[1].value = row.gallery_entry_cnt_1d || 0;
    initData[1].percent[0].percent = `${getNumber(row.preview_entry_cnt_1d, row.gallery_entry_cnt_1d)}%`;
    initData[2].value = row.preview_entry_cnt_1d || 0;
    initData[2].percent[0].percent = `${getNumber(row.save_button_clk_cnt_1d, row.preview_entry_cnt_1d)}%`;
    initData[3].value = row.save_button_clk_cnt_1d || 0;
    initData[3].percent[0].percent = `${getNumber(row.share_button_clk_cnt_1d, row.save_button_clk_cnt_1d)}%`;
    initData[3].percent[1].percent = `${getNumber(row.share_savetogallery_cnt_1d, row.save_button_clk_cnt_1d)}%`;
    initData[4].data[0].value = row.share_button_clk_cnt_1d || 0;
    initData[4].data[1].value = row.share_savetogallery_cnt_1d || 0;

    setData1(initData);
    setLoading1(false);
  };
  const getLocalFetchData = async () => {
    setLoading2(true);
    const sql = createSqlWhere({
      sql: localSQL,
      startDate: search.startDate,
      endDate: search.endDate,
      where: search.where,
    });
    const res = await getData(sql);
    const data = res.map(v => ({
      ...v,
      'gallery_entry_cnt_1d/home_entry_cnt_1d': `${getNumber(v.gallery_entry_cnt_1d, v.home_entry_cnt_1d)}%`,
      'preview_entry_cnt_1d/gallery_entry_cnt_1d': `${getNumber(v.preview_entry_cnt_1d, v.gallery_entry_cnt_1d)}%`,
      'save_button_clk_cnt_1d/preview_entry_cnt_1d': `${getNumber(v.save_button_clk_cnt_1d, v.preview_entry_cnt_1d)}%`,
      'share_savetogallery_cnt_1d/save_button_clk_cnt_1d': `${getNumber(v.share_savetogallery_cnt_1d, v.save_button_clk_cnt_1d)}%`,
      'share_button_clk_cnt_1d/share_savetogallery_cnt_1d': `${getNumber(v.share_button_clk_cnt_1d, v.share_savetogallery_cnt_1d)}%`,
    }));
    setDataSource2(data);
    const initData = _.clone(localInitData);
    const row = res.length ? res[0] : {};
    initData[0].value = row.home_entry_cnt_1d || 0;
    initData[0].percent[0].percent = `${getNumber(row.gallery_entry_cnt_1d, row.home_entry_cnt_1d)}%`;
    initData[1].value = row.gallery_entry_cnt_1d || 0;
    initData[1].percent[0].percent = `${getNumber(row.preview_entry_cnt_1d, row.gallery_entry_cnt_1d)}%`;
    initData[2].value = row.preview_entry_cnt_1d || 0;
    initData[2].percent[0].percent = `${getNumber(row.save_button_clk_cnt_1d, row.preview_entry_cnt_1d)}%`;
    initData[3].value = row.save_button_clk_cnt_1d || 0;
    initData[3].percent[0].percent = `${getNumber(row.share_savetogallery_cnt_1d, row.save_button_clk_cnt_1d)}%`;
    initData[4].value = row.share_savetogallery_cnt_1d || 0;
    initData[4].percent[0].percent = `${getNumber(row.share_button_clk_cnt_1d, row.share_savetogallery_cnt_1d)}%`;
    initData[5].value = row.share_button_clk_cnt_1d || 0;
    setData2(initData);
    setLoading2(false);
  };
  const onSearch = (values) => {
    setSearch(values);
  };
  const columns2 = [
    { dataIndex: 'home_entry_cnt_1d', key: 'home_entry_cnt_1d', title: '进入首页' },
    { dataIndex: 'gallery_entry_cnt_1d', key: 'gallery_entry_cnt_1d', title: '本地主题进入相册页' },
    { dataIndex: 'gallery_entry_cnt_1d/home_entry_cnt_1d', key: 'gallery_entry_cnt_1d/home_entry_cnt_1d', title: '相册进入率(本地)' },
    { dataIndex: 'preview_entry_cnt_1d', key: 'preview_entry_cnt_1d', title: '进入编辑页' },
    { dataIndex: 'preview_entry_cnt_1d/gallery_entry_cnt_1d', key: 'preview_entry_cnt_1d/gallery_entry_cnt_1d', title: '编辑页进入率' },
    { dataIndex: 'save_button_clk_cnt_1d', key: 'save_button_clk_cnt_1d', title: '本地素材导出点击' },
    { dataIndex: 'save_button_clk_cnt_1d/preview_entry_cnt_1d', key: 'save_button_clk_cnt_1d/preview_entry_cnt_1d', title: '导出点击率' },
    { dataIndex: 'share_savetogallery_cnt_1d', key: 'share_savetogallery_cnt_1d', title: '本地素材保存' },
    { dataIndex: 'share_savetogallery_cnt_1d/save_button_clk_cnt_1d', key: 'share_savetogallery_cnt_1d/save_button_clk_cnt_1d', title: '视频保存率(本地)' },
    { dataIndex: 'share_button_clk_cnt_1d', key: 'share_button_clk_cnt_1d', title: '本地视频点击分享' },
    { dataIndex: 'share_button_clk_cnt_1d/share_savetogallery_cnt_1d', key: 'share_button_clk_cnt_1d/share_savetogallery_cnt_1d', title: '视频分享率(本地)' },
    {
      dataIndex: 'action',
      title: '详情',
      key: 'action',
      render: (text, row) => <DetailTableModal
        title="用户导出路径"
        row={row}
        colum={columns2.slice(0, -1)}
        detailSQL = {localDetailSQL}
        search={search}
      />,
    },
  ];
  const columns1 = [
    {
      dataIndex: 'home_entry_cnt_1d',
      key: 'home_entry_cnt_1d',
      title: '进入首页',
    },
    {
      dataIndex: 'gallery_entry_cnt_1d',
      key: 'gallery_entry_cnt_1d',
      title: '云端主题进入相册页',
    },
    {
      dataIndex: 'gallery_entry_cnt_1d/home_entry_cnt_1d',
      key: 'gallery_entry_cnt_1d/home_entry_cnt_1d',
      title: '相册进入率(云端)',
    },
    {
      dataIndex: 'preview_entry_cnt_1d',
      key: 'preview_entry_cnt_1d',
      title: '云端主题开始制作',
    },
    {
      dataIndex: 'preview_entry_cnt_1d/gallery_entry_cnt_1d',
      key: 'preview_entry_cnt_1d/gallery_entry_cnt_1d',
      title: '云端主题制作率',
    },
    {
      dataIndex: 'save_button_clk_cnt_1d',
      key: 'save_button_clk_cnt_1d',
      title: '云端主题制作成功',
    },
    {
      dataIndex: 'save_button_clk_cnt_1d/preview_entry_cnt_1d',
      key: 'save_button_clk_cnt_1d/preview_entry_cnt_1d',
      title: '云端主题制作成功率',
    },
    {
      dataIndex: 'share_savetogallery_cnt_1d',
      key: 'share_savetogallery_cnt_1d',
      title: '云端视频保存',
    },
    {
      dataIndex: 'share_savetogallery_cnt_1d/save_button_clk_cnt_1d',
      key: 'share_savetogallery_cnt_1d/save_button_clk_cnt_1d',
      title: '视频保存率(云端)',
    },
    {
      dataIndex: 'share_button_clk_cnt_1d',
      key: 'share_button_clk_cnt_1d',
      title: '云端视频点击分享',
    },
    {
      dataIndex: 'share_button_clk_cnt_1d/save_button_clk_cnt_1d',
      key: 'share_button_clk_cnt_1d/save_button_clk_cnt_1d',
      title: '视频分享率(云端)',
    },
    {
      dataIndex: 'action',
      title: '详情',
      key: 'action',
      render: (text, row) => <DetailTableModal
        title="用户导出路径"
        row={row}
        colum={columns1.slice(0, -1)}
        detailSQL={yunduanDetailSQL}
        search={search}
      />,
    },
  ];
  const htmlTemplate = ({
    span, offset, name, value, color, percent = [], double = false, data = [],
  }) => <Col span={span} offset={offset}>
    <Row>
      {
        double ? data.map((v, index) => <Col key={index} span={11} offset={1} style={{
          backgroundColor: color, textAlign: 'center', padding: 10, borderRadius: 5,
        }}>
          <Statistic title={<h4 style={{ color: '#fff' }}>{v.name}</h4>} value={v.value} valueStyle={{ color: '#fff', fontSize: 14 }} />
        </Col>)
          : <div style={{
            backgroundColor: color, width: '100%', textAlign: 'center', padding: 10, borderRadius: 5,
          }}>
            <Statistic title={<h4 style={{ color: '#fff' }}>{name}</h4>} value={value} valueStyle={{ color: '#fff', fontSize: 14 }} />
          </div>
      }
    </Row>

    {percent.length ? percent.length === 1 ? <div style={{
      textAlign: 'center', fontSize: 14, color, margin: 10,
    }}>
      <Icon type="arrow-down" /><span>{percent[0].percentTitle}{percent[0].percent}</span>
    </div> : <Row >
      {percent.map((v, index) => <Col
        span={span / 2}
        offset={4}
        key={index}
        style={{ color, fontSize: 14, padding: 5 }}
      >
        <Icon type="arrow-down" /><span>{v.percentTitle}{v.percent}</span>
      </Col>)}
    </Row> : ''}
  </Col>;
  useEffect(() => {
    if (activeKey === '1') {
      getYunFetchData();
    } else {
      getLocalFetchData();
    }
  }, [search, activeKey]);
  return <div>
    <QueryIndex
      onSearch={onSearch}
      product="3"
    />
    <Tabs activeKey={activeKey} onChange={setActiveKey}>
      <TabPane tab="云端" key="1" >
        <Spin spinning={lodaing1}>
          <DownLoadButton
            filename="云端"
            data={dataSource1}
            columns={columns1}
          />
          <Row>
            {data1.map(v => htmlTemplate(v))}
          </Row>
          <Table
            columns={columns1}
            bordered
            dataSource={dataSource1}
            style={{ marginTop: 20 }}
            scroll={{ x: 1500 }}
            rowKey="home_entry_cnt_1d"
          />
        </Spin>

      </TabPane>
      <TabPane tab="本地" key="2" >
        <Spin spinning={lodaing2}>
          <DownLoadButton
            filename="本地"
            data={dataSource2}
            columns={columns2}
          />
          <Row>
            {data2.map(v => htmlTemplate(v))}
          </Row>
          <Table
            columns={columns2}
            bordered
            dataSource={dataSource2}
            style={{ marginTop: 20 }}
            scroll={{ x: 1800 }}
            rowKey="home_entry_cnt_1d"
          />
        </Spin>
      </TabPane>
    </Tabs>
  </div>;
};
