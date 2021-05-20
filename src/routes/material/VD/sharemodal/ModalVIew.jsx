import React, { useEffect, useState } from 'react';
import {
  Form,
  Table,
  Button,
  DatePicker,
} from 'antd';
import { getSql } from './sql';
import { getDataList } from '../../../../utils/request';
import { exportExcel } from '../../../../utils/exportExcel3';

const { RangePicker } = DatePicker;
function ModalVIew({
  modalViewData, form, sqlWhere,
}) {
  // share_channel 分享渠道  share_cnt 分享次数 share_session_cnt 会话次数 share_dvc_cnt 分享设备 rate 占比
  const columns = [
    {
      title: '分享渠道',
      dataIndex: 'share_channel',
      key: 'share_channel',
    },
    {
      title: '占比',
      dataIndex: 'rate',
      key: 'rate',
      render: text => `${(text * 100).toFixed(2)}%`,
    },
    {
      title: '事件总数',
      dataIndex: 'share_cnt',
      key: 'share_cnt',
      filterMultiple: false,
      sorter: (a, b) => a.share_cnt - b.share_cnt,
    },
    {
      title: '会话数',
      dataIndex: 'share_session_cnt',
      key: 'share_session_cnt',
      filterMultiple: false,
      sorter: (a, b) => a.share_session_cnt - b.share_session_cnt,
    },
    {
      title: '设备数',
      dataIndex: 'share_dvc_cnt',
      key: 'share_dvc_cnt',
      filterMultiple: false,
      sorter: (a, b) => a.share_dvc_cnt - b.share_dvc_cnt,
    },
  ];
  const [tableData, setTableData] = useState([]);
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState(false);
  // sqlWhere.where, sqlWhere.startDate, sqlWhere.endDate
  const getData = async (where, startDate, endDate, ttid) => {
    setLoading(true);
    // 定义一个拼sql 的方法
    const sql = getSql(where, startDate, endDate, ttid);
    const res = await getDataList(sql);
    console.log(res);
    setLoading(false);
    setTableData(res);
  };

  const download = () => {
    // 当数据加载完毕是 可以点击导出
    if (!loading) {
      // 重构excel 导出数据
      const data = [];
      tableData.forEach((item) => {
        // 占比列数据模式
        const rate = `${(item.rate * 100).toFixed(2)}%`;
        const obj = {
          会话渠道: item.share_channel,
          占比: rate,
          事件总数: item.share_cnt,
          会话数: item.share_session_cnt,
          设备数: item.share_dvc_cnt,
        };
        data.push(obj);
      });
      // 导出excel
      exportExcel(data);
    }
  };
  // 日期formitem 发送变化时重新请求数据
  const chanage = (date) => {
    const [startDate, endDate] = date;
    // 重新发送请求
    getData(sqlWhere.where, startDate, endDate, modalViewData.ttid);
  };
  useEffect(() => {
    // 初始化 请求数据
    getData(sqlWhere.where, sqlWhere.startDate, sqlWhere.endDate, modalViewData.ttid);
  }, []);
  return (
    <main>
      <div style={{ fontSize: 20, color: '#000' }}>
        {modalViewData.tt_name ? modalViewData.tt_name : ''}
      </div>
      <Form layout="inline">
        <Form.Item>
          <Button type="primary" icon="download" onClick={download}>导出</Button>
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('date')(<RangePicker onChange={chanage}/>)}
        </Form.Item>

      </Form>

      <div style={{ marginTop: 30 }} />
      <Table columns={columns} dataSource={tableData} loading={loading} rowKey={record => record.share_channel}/>

    </main>
  );
}

export default Form.create()(ModalVIew);
