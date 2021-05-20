/*
 * @Date: 2020-12-28 10:46:30
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-01-12 20:21:52
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState, useEffect } from 'react';
import {
  Row, Col, DatePicker, Table, Button, Radio, Select, Spin,
} from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { getData } from '../../utils/request';
import { PRODUCT_LIST_MIN } from '../../utils/const';
import { warningMessageMap, warningMessageStateMap } from './const';
import { QueryMessageState, createMessageState, updateMessageState } from './services/index';
import { chartRender2 } from '../common/chartFunc/chartRender2';
import { countSQL, dataSQL } from './sqlTemplate';
// import { DownLoadButton } from '../common/DownLoadButton';

const { Option } = Select;
const { RangePicker } = DatePicker;
const PRODUCT_LIST = Object.assign(PRODUCT_LIST_MIN, {
  44: '小影印度马甲包',
  18: 'VMix',
  35: 'Facee',
  36: 'Glitch-VFX',
  39: 'Veffecto',
  43: 'GoCut',
  42: 'mAst',
  16: '甜影',
  3: 'slideplus',
  10: 'tempo',
  15: 'vivacut',
  41: 'StoryBuff',
  50: 'beatStarr',
  51: 'MultiRecorder',
  33: 'Picsfox',
  17: '奇幻变脸秀',
});

export default () => {
  // 1 server、2 爬虫、3 UT、4 中间层
  const [loading, setLoading] = useState(false);
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [tableData3, setTableData3] = useState([]);
  const [tableData4, setTableData4] = useState([]);
  const [dateStr, setDateStr] = useState(moment().subtract(1, 'days'));
  const [showDetail, setShowDetail] = useState(false);
  const [dataInfo, setDataInfo] = useState([]);
  const [serverTableName, setServerTableName] = useState('');
  // const [dataCount, setDataCount] = useState([]);
  const [dataCountTime, setDataCountTime] = useState([moment().subtract(1, 'days'), moment().subtract(1, 'days')]);
  const [dataCountProduct, setDataCountProduct] = useState('');
  const getTabelData = async () => {
    setLoading(true);
    const res = await getData(`
      SELECT * FROM dim_pub_monitor_centre_table;
    `);
    const tableData1 = res.filter(item => item.table_type === 1);
    for (let index = 0; index < tableData1.length; index++) {
      const element = tableData1[index];
      const dataSQLstr = dataSQL
        .replace(/#startDate#/g, dateStr.format('YYYYMMDD'))
        .replace(/#endDate#/g, dateStr.format('YYYYMMDD'))
        .replace(/#database#/g, `'${element.odps_table_name}'`)
        .replace(/#where#/g, '');
      // eslint-disable-next-line no-await-in-loop
      const res = await getData(dataSQLstr);
      console.log('dataSQLstr', dataSQLstr);
      const warninglist = res.filter(item => item.is_warning === 1);
      element.warningCount = warninglist.length;
      let fixCount = 0;
      let fixIng = 0;
      let nofix = 0;
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        // eslint-disable-next-line no-await-in-loop
        const { data } = await QueryMessageState(
          `${item.odps_table_name}-${item.product_id}-${item.platform}-${item.warning_type}-${item.ds}`,
        );
        switch (data) {
          case 1:
            fixIng += 1;
            break;
          case 2:
            fixCount += 1;
            break;
          default:
            nofix += 1;
            break;
        }
      }
      element.fixCount = fixCount;
      element.fixIng = fixIng;
      element.nofix = nofix;
      console.log('res1', res);
    }
    const tableData2 = res.filter(item => item.table_type === 2);
    for (let index = 0; index < tableData2.length; index++) {
      const element = tableData2[index];
      const dataSQLstr = dataSQL
        .replace(/#startDate#/g, dateStr.format('YYYYMMDD'))
        .replace(/#endDate#/g, dateStr.format('YYYYMMDD'))
        .replace(/#database#/g, `'${element.odps_table_name}'`)
        .replace(/#where#/g, '');
      // eslint-disable-next-line no-await-in-loop
      const res = await getData(dataSQLstr);
      let fixCount = 0;
      let fixIng = 0;
      let nofix = 0;
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        // eslint-disable-next-line no-await-in-loop
        const { data } = await QueryMessageState(
          `${item.odps_table_name}-${item.product_id}-${item.platform}-${item.warning_type}-${item.ds}`,
        );
        switch (data) {
          case 1:
            fixIng += 1;
            break;
          case 2:
            fixCount += 1;
            break;
          default:
            nofix += 1;
            break;
        }
      }
      element.fixCount = fixCount;
      element.fixIng = fixIng;
      element.nofix = nofix;
      const warninglist = res.filter(item => item.is_warning === 1);
      element.warningCount = warninglist.length;
      console.log('res2', res);
    }
    const tableData3 = res.filter(item => item.table_type === 3);
    for (let index = 0; index < tableData3.length; index++) {
      const element = tableData3[index];
      const dataSQLstr = dataSQL
        .replace(/#startDate#/g, dateStr.format('YYYYMMDD'))
        .replace(/#endDate#/g, dateStr.format('YYYYMMDD'))
        .replace(/#database#/g, `'${element.odps_table_name}'`)
        .replace(/#where#/g, '');
      // eslint-disable-next-line no-await-in-loop
      const res = await getData(dataSQLstr);
      const warninglist = res.filter(item => item.is_warning === 1);
      element.warningCount = warninglist.length;
      let fixCount = 0;
      let fixIng = 0;
      let nofix = 0;
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        // eslint-disable-next-line no-await-in-loop
        const { data } = await QueryMessageState(
          `${item.odps_table_name}-${item.product_id}-${item.platform}-${item.warning_type}-${item.ds}`,
        );
        switch (data) {
          case 1:
            fixIng += 1;
            break;
          case 2:
            fixCount += 1;
            break;
          default:
            nofix += 1;
            break;
        }
      }
      element.fixCount = fixCount;
      element.fixIng = fixIng;
      element.nofix = nofix;
      console.log('res3', res);
    }
    const tableData4 = res.filter(item => item.table_type === 4);
    for (let index = 0; index < tableData4.length; index++) {
      const element = tableData4[index];
      const dataSQLstr = dataSQL
        .replace(/#startDate#/g, dateStr.format('YYYYMMDD'))
        .replace(/#endDate#/g, dateStr.format('YYYYMMDD'))
        .replace(/#database#/g, `'${element.odps_table_name}'`)
        .replace(/#where#/g, '');
      // eslint-disable-next-line no-await-in-loop
      const res = await getData(dataSQLstr);
      const warninglist = res.filter(item => item.is_warning === 1);
      element.warningCount = warninglist.length;
      let fixCount = 0;
      let fixIng = 0;
      let nofix = 0;
      for (let n = 0; n < res.length; n++) {
        const item = res[n];
        // eslint-disable-next-line no-await-in-loop
        const { data } = await QueryMessageState(
          `${item.odps_table_name}-${item.product_id}-${item.platform}-${item.warning_type}-${item.ds}`,
        );
        switch (data) {
          case 1:
            fixIng += 1;
            break;
          case 2:
            fixCount += 1;
            break;
          default:
            nofix += 1;
            break;
        }
      }
      element.fixCount = fixCount;
      element.fixIng = fixIng;
      element.nofix = nofix;
      console.log('res4', res);
    }
    console.log('tableData1', tableData1);
    setTableData1(tableData1);
    setTableData2(tableData2);
    setTableData3(tableData3);
    setTableData4(tableData4);
    setLoading(false);
  };

  const showDetailPage = async (content) => {
    setLoading(true);
    let dataSQLstr = dataSQL
      .replace(/#startDate#/g, dataCountTime[0].format('YYYYMMDD'))
      .replace(/#endDate#/g, dataCountTime[1].format('YYYYMMDD'))
      .replace(/#database#/g, `'${content.odps_table_name}'`);
    if (dataCountProduct) {
      dataSQLstr = dataSQLstr.replace(/#where#/g, `and product_id = ${dataCountProduct}`);
    } else {
      dataSQLstr = dataSQLstr.replace(/#where#/g, '');
    }
    const res = await getData(dataSQLstr);
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      // eslint-disable-next-line no-await-in-loop
      const { data } = await QueryMessageState(
        `${element.odps_table_name}-${element.product_id}-${element.platform}-${element.warning_type}-${element.ds}`,
      );
      if (data) {
        element.state = data.state;
      } else {
        element.state = 0;
      }
    }
    let countSqlStr = countSQL
      .replace(/#startDate#/g, dataCountTime[0].format('YYYYMMDD'))
      .replace(/#endDate#/g, dataCountTime[1].format('YYYYMMDD'))
      .replace(/#database#/g, `'${content.odps_table_name}'`);
    if (dataCountProduct) {
      countSqlStr = countSqlStr.replace(/#where#/g, `and product_id = ${dataCountProduct}`);
    } else {
      countSqlStr = countSqlStr.replace(/#where#/g, '');
    }
    const countData = await getData(countSqlStr);
    setServerTableName(content.odps_table_name);
    setDataInfo(res);
    // setDataCount(countData);
    setShowDetail(true);
    setTimeout(() => {
      chartRender2(countData, 'chart-monitor');
    }, 300);
    setLoading(false);
  };

  const getCountData = async () => {
    if (serverTableName) {
      let sql = countSQL
        .replace(/#startDate#/g, dataCountTime[0].format('YYYYMMDD'))
        .replace(/#endDate#/g, dataCountTime[1].format('YYYYMMDD'))
        .replace(/#database#/g, `'${serverTableName}'`);
      if (dataCountProduct) {
        sql = sql.replace(/#where#/g, `and product_id = ${dataCountProduct}`);
      } else {
        sql = sql.replace(/#where#/g, '');
      }
      const countData = await getData(sql);
      // setDataCount(countData);
      setTimeout(() => {
        chartRender2(countData, 'chart-monitor');
      }, 300);
    }
  };

  const getDetailData = async () => {
    if (serverTableName) {
      setLoading(true);
      let dataSQLstr = dataSQL
        .replace(/#startDate#/g, dataCountTime[0].format('YYYYMMDD'))
        .replace(/#endDate#/g, dataCountTime[1].format('YYYYMMDD'))
        .replace(/#database#/g, `'${serverTableName}'`);
      if (dataCountProduct) {
        dataSQLstr = dataSQLstr.replace(/#where#/g, `and product_id = ${dataCountProduct}`);
      } else {
        dataSQLstr = dataSQLstr.replace(/#where#/g, '');
      }
      const res = await getData(dataSQLstr);
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        // eslint-disable-next-line no-await-in-loop
        const { data } = await QueryMessageState(
          `${element.odps_table_name}-${element.product_id}-${element.platform}-${element.warning_type}-${element.ds}`,
        );
        if (data) {
          element.state = data.state;
        } else {
          element.state = 0;
        }
      }
      setDataInfo(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailData();
    getCountData();
  }, [dataCountProduct, dataCountTime]);

  useEffect(() => {
    getTabelData();
  }, [dateStr]);

  const changeMessageState = async (content) => {
    switch (content.state) {
      case 0: {
        const res = await createMessageState({
          messageId: `${content.odps_table_name}-${content.product_id}-${content.platform}-${content.warning_type}-${content.ds}`,
          state: 1,
        });
        console.log('res', res);
        break;
      }
      case 1: {
        const res = await updateMessageState({
          messageId: `${content.odps_table_name}-${content.product_id}-${content.platform}-${content.warning_type}-${content.ds}`,
          state: 2,
        });
        console.log('res', res);
        break;
      }
      default:
        break;
    }
    getDetailData();
  };

  const columns = [
    {
      title: '监控表名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '表名',
      dataIndex: 'odps_table_name',
      key: 'odps_table_name',
    },
    // {
    //   title: '所属数据库',
    //   dataIndex: 'server_db',
    //   key: 'server_db',
    // },
    {
      title: '告警情况',
      dataIndex: 'warningCount',
      key: 'warningCount',
    },
    {
      title: '修复情况',
      dataIndex: 'fix',
      key: 'fix',
      render: (_text, row) => (
        <>
          <span>已修复:{row.fixCount}</span>
          <span>修复中:{row.fixIng}</span>
          <span>未处理:{row.nofix}</span>
        </>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '详情',
      dataIndex: 'handle',
      key: 'handle',
      render: (_text, row) => <Button onClick={() => showDetailPage(row)}>查看</Button>,
    },
  ];

  const columnsInfo = [
    {
      title: '产品',
      dataIndex: 'product_id',
      key: 'product_id',
      render: text => PRODUCT_LIST[text],
    },
    {
      title: '告警类型',
      dataIndex: 'warning_type',
      key: 'warning_type',
    },
    {
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
    },
    {
      title: '告警信息',
      dataIndex: 'warning_message',
      key: 'warning_message',
      render: (_text, row) => warningMessageMap[row.warning_type],
    },
    {
      title: '状态',
      dataIndex: 'fix',
      key: 'fix',
      render: (_text, row) => warningMessageStateMap[row.state],
    },
    {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      width: 200,
      render: (_text, row) => (row.state < 2 ? (
        <Button type="primary" onClick={() => changeMessageState(row)}>
          {row.state === 0 ? '进行修复' : row.state === 1 ? '修复完成' : ''}
        </Button>
      ) : (
        ''
      )),
    },
  ];

  const columnsDirtyData = [
    {
      title: '产品',
      dataIndex: 'product_id',
      key: 'product_id',
      render: text => PRODUCT_LIST[text],
    },
    {
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
    },
    {
      title: '数据类型',
      dataIndex: 'dirtyType',
      key: 'dirtyType',
      render: (_text, row) => warningMessageMap[row.warning_type],
    },
    {
      title: '数据占比',
      dataIndex: 'warning_value',
      key: 'warning_value',
    },
  ];
  const dateFormat = 'YYYY-MM-DD';
  return (
    <div style={{ margin: 20 }}>
      <Spin spinning={loading}>
        {showDetail ? (
          <Row gutter={24} style={{ marginTop: 20 }}>
            <Col span={24}>
              <Radio.Group
                defaultValue="b"
                buttonStyle="solid"
                onChange={(e) => {
                  e.target.value === 'a' && setShowDetail(false);
                }}
              >
                <Radio.Button value="a">数据监控</Radio.Button>
                <Radio.Button value="b">数据详情</Radio.Button>
              </Radio.Group>
              <Select
                style={{ width: 120, margin: '0 16px' }}
                value={dataCountProduct}
                placeholder="请输入产品"
                onChange={(value) => {
                  setDataCountProduct(value);
                }}
              >
                <Option value="">all</Option>
                {Object.keys(PRODUCT_LIST).map(item => (
                  <Option value={item}>{PRODUCT_LIST[item]}</Option>
                ))}
              </Select>
              <RangePicker
                value={dataCountTime}
                format={dateFormat}
                onChange={(value) => {
                  setDataCountTime(value);
                }}
              />
            </Col>
            <Col span={24}>
              <Table dataSource={dataInfo} title={() => '告警信息'} columns={columnsInfo} pagination={false} />
            </Col>
            <Col span={24} style={{ marginTop: 16 }}>
              <div className="ant-table-title">数据量</div>
              <div id="chart-monitor" />
              {/* <ChartCardView key={v.id} info={v} platform={platform} searchItem={searchItem} /> */}
            </Col>
            <Col span={24} style={{ marginTop: 16 }}>
              <Table
                dataSource={dataInfo.filter(item => item.is_warning === 1 && item.warning_type !== 1)}
                title={() => '脏数据情况'}
                columns={columnsDirtyData}
                pagination={false}
              />
            </Col>
          </Row>
        ) : (
          <>
            <DatePicker locale={locale} value={dateStr} onChange={setDateStr} />
            <Row gutter={24} style={{ marginTop: 20 }}>
              <Col span={24}>
                <Table dataSource={tableData1} title={() => '服务端'} columns={columns} pagination={false} />
              </Col>
              <Col span={24}>
                <Table dataSource={tableData2} title={() => '爬虫'} columns={columns} pagination={false} />
              </Col>
              <Col span={24}>
                <Table dataSource={tableData3} title={() => 'UT'} columns={columns} pagination={false} />
              </Col>
              <Col span={24}>
                <Table dataSource={tableData4} title={() => '中间层'} columns={columns} pagination={false} />
              </Col>
            </Row>
          </>
        )}
      </Spin>
    </div>
  );
};
