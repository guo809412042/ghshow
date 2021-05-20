import React, { useState, useEffect } from 'react';
import {
  Modal, Divider, Table, Steps, Button, Descriptions, Row, Col,
} from 'antd';
import { getProductInfo, getApproveList, getApproveRecord } from '../services/index';
import { feishuCodeToZh } from '../util';

const keyTitle = [
  ['product_line', '产品线'],
  ['product_id', '产品ID'],
  ['product_name', '产品名称'],
  ['ali_android_app_key', '阿里APPKEY—安卓'],
  ['ali_ios_app_key', '阿里APPKEY—IOS'],
  ['product_package_name', 'GP后台包'],
  ['product_apple_id', 'IOS appid'],
  ['product_ios_token', 'IOS token'],
  ['product_state', '产品状态', state => ['下线', '上线'][state]],
  ['modify_time', '修改时间'],
];

export default ({ id, changeModalvisible }) => {
  const [productDetail, setProductDetail] = useState([]);
  const [approve, setApprove] = useState([]);
  const [timeline, setTimeline] = useState({});
  const [modifyContent, setModifyContent] = useState({});

  const getProductDetail = async () => {
    const res = await getProductInfo(id);

    if (res.code === 20000) {
      setProductDetail(res.data);
    }
  };

  const getApproveData = async () => {
    const res = await getApproveList(id);
    if (res.code === 20000 && res.data.length > 0) {
      const arr = res.data.reverse();
      setApprove(arr);
      setModifyContent(arr[0]);
    }
  };

  const getApproveRecordData = async (approveId) => {
    const res = await getApproveRecord(approveId);
    console.log(res);
    if (res.code === 20000) {
      const data = res.data;
      setTimeline({
        ...data,
        owner_status_ZH: feishuCodeToZh(data.owner_status),
        reviewer_status_ZH: feishuCodeToZh(data.reviewer_status),
        timeline: JSON.parse(data.feishu_time_line),
        current: 1 + !!data.owner_end_time + !!data.end_time,
      });
      setModifyContent(approve.filter(item => item.id === approveId)[0]);
    }
  };

  const renderContent = () => (
    <>
      <h2>配置详情</h2>
      <Descriptions bordered>
        {keyTitle.map(k => (
          <Descriptions.Item label={k[1]} key={k[0]}>
            {k[2] ? k[2](productDetail[k[0]]) : productDetail[k[0]]}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <br />
      <h2>修改记录</h2>
      <Table
        columns={[
          {
            title: '修改日期',
            dataIndex: 'date',
          },
          {
            title: '修改人员',
            dataIndex: 'name',
            render: (_, record) => `${record.name} - ${record.email}`,
          },
          {
            title: '审核状态',
            dataIndex: 'status',
            render: status => feishuCodeToZh(status),
          },
          {
            title: '操作',
            dataIndex: 'id',
            render: id => (
              <Button type="primary" onClick={() => getApproveRecordData(id)}>
                查看timeline
              </Button>
            ),
          },
        ]}
        rowKey="id"
        style={{ width: 800 }}
        dataSource={approve}
        pagination={{ pageSize: 100000 }}
        scroll={{ y: 240 }}
      />
      <Divider />
      <Row>
        <Col span={10}>
          <h2>Timeline</h2>
          {timeline.id && (
            <Steps direction="vertical" current={timeline.current}>
              <Steps.Step title="已提交" description={timeline.start_time} />
              <Steps.Step
                title={`${timeline.owner_status_ZH} - 审核人（项目负责人）`}
                description={
                  <>
                    <p>{timeline.start_time}</p>
                    <p>审核人员 {timeline.owner_email}</p>
                  </>
                }
              />
              <Steps.Step
                title={`${timeline.reviewer_status_ZH} - 审核人（数据组负责人）`}
                description={
                  <>
                    <p>{timeline.owner_end_time}</p>
                    <p>审核人员 {timeline.reviewer_email}</p>
                  </>
                }
              />
              <Steps.Step title="审核完成" description={timeline.end_time} />
            </Steps>
          )}
        </Col>
        <Col span={14}>
          <h2>修改内容</h2>
          <Descriptions bordered>
            {keyTitle.map(k => (
              <Descriptions.Item label={k[1]} key={k[0]}>
                {k[2] !== undefined ? k[2](modifyContent[k[0]]) : modifyContent[k[0]]}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Col>
      </Row>
    </>
  );

  useEffect(() => {
    getProductDetail();
    getApproveData();
    // getApproveRecordData();
  }, []);

  useEffect(() => {
    approve[0] && getApproveRecordData(approve[0].id);
  }, [approve]);

  return (
    <>
      <Modal
        width="90%"
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="产品详细信息"
        visible={!!id}
        onCancel={() => changeModalvisible(false)}
        footer={[
          <Button key="submit" type="primary" onClick={() => changeModalvisible(false)}>
            确定
          </Button>,
        ]}
      >
        {renderContent()}
      </Modal>
    </>
  );
};
