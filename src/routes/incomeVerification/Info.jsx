/*
 * @Date: 2021-02-25 14:45:50
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-02 15:32:11
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import {
  Card, Button, Table, Row, Col, Input, Steps,
} from 'antd';
import {
  evaluate, format,
} from 'mathjs';
import moment from 'moment';
// import XLSX from 'xlsx';
import {
  info, approveInfo,
} from './service';
// import { feishuCodeToZh } from '../product/util';
import { checkStateMap, auditStateMap } from './const';

const { TextArea } = Input;

/*
校验流程：
1：用户上传Excel，解析成json arr 存放rc.quvidep.vip/cdn/gh/{uuid}.json
2：将当前记录保存至数据库
  CREATE TABLE `finance_verification` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `uuid` varchar(64) NOT NULL COMMENT 'uuid',
  `month` varchar(64) DEFAULT NULL COMMENT '月份',
  `user_name` varchar(255) DEFAULT NULL COMMENT '上传用户',
  `check_time` datetime NOT NULL COMMENT '检验时间',
  `upload_time` datetime NOT NULL COMMENT '检验时间',
  `check_state` tinyint(4) NOT NULL COMMENT '检验状态 0-未检验 1-检验中 2-通过 3-未通过',
  `audit_state` tinyint(4) NOT NULL COMMENT '审核结果 0-未审核 1-审核中 2-审核通过 3-审核未通过',
  `modify_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `summary` varchar(1024) DEFAULT NULL COMMENT '月度总结',
  `type` tinyint(4) NOT NULL COMMENT '类型 1-投放支出 2-广告收入',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_uuid` (`uuid`) USING BTREE,
  UNIQUE KEY `uniq_month` (`month`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COMMENT='投放支出/广告收入信息表';

CREATE TABLE `rel_finance_verification_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `uuid` varchar(64) NOT NULL COMMENT 'uuid',
  `month` varchar(64) DEFAULT NULL COMMENT '月份',
  `account` varchar(64) DEFAULT NULL COMMENT '供应商',
  `product_name` varchar(255) DEFAULT NULL COMMENT '产品',
  `charge_type` varchar(32) DEFAULT NULL COMMENT '货币类型',
  `revenue_count` varchar(128) DEFAULT NULL COMMENT '当月消耗金额',
  `deviation_count` varchar(128) DEFAULT NULL COMMENT '当月偏差金额',
  `bill_revenue_count` varchar(128) DEFAULT NULL COMMENT '账单消耗金额',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_uuid` (`uuid`) USING BTREE,
  UNIQUE KEY `uniq_month` (`month`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='投放支出/广告收入明细表';

3：校验流程：
    a：获取爬虫数据，比对偏差金额，计算偏差率
    b：提交审批，审批通过后，当月数据不允许变更及提交当月的数据
*/

export default ({ match: { params } }) => {
  const [selectData, setSelectData] = useState({});
  const [infoData, setInfoData] = useState([]);
  const [lodaing, setLoading] = useState(false);
  const [timeline, setTimeline] = useState({});
  // const { uuid } = params
  console.log('match', params);

  const columnsInfo = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '供应商',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '产品',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: '货币类型',
      dataIndex: 'charge_type',
      key: 'charge_type',
    },
    {
      title: '当月收入',
      dataIndex: 'revenue_count',
      key: 'revenue_count',
    },
    {
      title: '当月收入+上月差额',
      dataIndex: 'audit_state',
      key: 'audit_state',
      render: (_text, row) => format(evaluate(Number(row.lastDeviationCount) + Number(row.revenue_count)), { notation: 'fixed', precision: 2 }),
    },
    {
      title: '账单收入',
      dataIndex: 'bill_revenue_count',
      key: 'bill_revenue_count',
    },
    {
      title: '偏差金额',
      dataIndex: 'deviation_count',
      key: 'deviation_count',
    },
    {
      title: '偏差率(%)',
      dataIndex: 'deviation_count_rate',
      key: 'deviation_count_rate',
      render: (_text, row) => (Number(row.revenue_count) ? format(evaluate(Number(row.deviation_count) / Number(row.revenue_count) * 100), { notation: 'fixed', precision: 2 }) : 0),
    },
    {
      title: '累计偏差金额',
      dataIndex: 'sumDeviationCount',
      key: 'sumDeviationCount',
      render: (text, row) => (selectData.audit_state !== 2 ? format(evaluate(Number(row.deviation_count) + text), { notation: 'fixed', precision: 2 }) : format(text, { notation: 'fixed', precision: 2 })),
    },
    {
      title: '累计偏差率(%)',
      dataIndex: 'all_deviation_count_rate',
      key: 'all_deviation_count_rate',
      render: (_text, row) => (selectData.audit_state !== 2 ? (Number(row.sumRevenueCount + row.revenue_count) ? format(evaluate((Number(row.deviation_count) + row.sumDeviationCount) / (row.sumRevenueCount + row.revenue_count) * 100), { notation: 'fixed', precision: 2 }) : 0) : (Number(row.sumRevenueCount) ? format(evaluate((row.sumDeviationCount) / (row.sumRevenueCount) * 100), { notation: 'fixed', precision: 2 }) : 0)),
    },
  ];

  const initType = async () => {
    if (params.uuid) {
      // setPageType(2);
      setLoading(true);
      const { data } = await info(params.uuid);
      const res = await approveInfo(data.data.feishu_instance_code);
      console.log('res', res);

      setTimeline({ ...res.data, current: 1 + !!res.data.owner_end_time + !!res.data.end_time });
      setSelectData(data.data);
      setInfoData(data.list);
      setLoading(false);
      // initData()
    }
  };

  const showIndex = () => {
    window.location.href = '/page?p=1110&pt=1110&fg=gh#/gh/income-verification';
    // history.push('/gh/spend-verification/');
  };

  useEffect(() => {
    initType();
  }, []);


  return (
    <div>
      <Card title={<div><span onClick={showIndex} style={{ color: '#ccc', cursor: 'pointer' }}>月度校验信息</span> / <span style={{ fontWeight: 'bold', cursor: 'pointer' }}>信息详情</span></div>} bordered={false} style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={8}>
              月份：{selectData.month}
          </Col>
          <Col span={8}>
              上传用户：{selectData.user_name}
          </Col>
          <Col span={8}>
              校验时间：{selectData.check_time}
          </Col>
          <Col span={8}>
              上传时间：{selectData.upload_time}
          </Col>
          <Col span={8}>
              校验状态：{checkStateMap[selectData.check_state]}
          </Col>
        </Row>
      </Card>
      <Table
        columns={columnsInfo}
        bordered
        dataSource={infoData}
        style={{ marginTop: 20 }}
        loading={lodaing}
        pagination={false}
        rowKey="id"
      />
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
            月度总结：
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <TextArea rows={4} value={selectData.summary} disabled/>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Steps direction="vertical" current={timeline.current}>
            <Steps.Step title="已提交" description={moment(timeline.start_time).format('YYYY-MM-DD HH:mm:ss')} />
            <Steps.Step
              title="审核人"
              description={
                  <>
                    <p>{moment(timeline.start_time).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p>审核人员: rong.zhou@quvideo.com</p>
                    <p>审核状态：{auditStateMap[timeline.status]}</p>
                  </>
              }
            />
            <Steps.Step title="审核完成" description={moment(timeline.end_time).format('YYYY-MM-DD HH:mm:ss')} />
          </Steps>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={showIndex}>确定</Button>
        </Col>
      </Row>
    </div>
  );
};
