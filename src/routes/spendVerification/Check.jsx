/*
 * @Date: 2021-02-25 14:45:50
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-28 09:55:38
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-await-in-loop */
import OSS from 'ali-oss';
import React, {
  useState, useEffect,
} from 'react';
import {
  Card, Button, Table, message, Row, Col, Input,
} from 'antd';
import {
  evaluate, format, number,
} from 'mathjs';
import {
  info, checkDataInfo, update, relUpdate, getFinanceSpiderCheck,
} from './service';
import { checkStateMap } from './const';
import Csv from '../../utils/csv';
import { getOssToken } from '../../utils/request';

// const EditableContext = React.createContext();
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
  `spend_count` varchar(128) DEFAULT NULL COMMENT '当月消耗金额',
  `deviation_count` varchar(128) DEFAULT NULL COMMENT '当月偏差金额',
  `bill_spend_count` varchar(128) DEFAULT NULL COMMENT '账单消耗金额',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_uuid` (`uuid`) USING BTREE,
  UNIQUE KEY `uniq_month` (`month`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='投放支出/广告收入明细表';

3：校验流程：
    a：获取爬虫数据，比对偏差金额，计算偏差率
    b：提交审批，审批通过后，当月数据不允许变更及提交当月的数据
*/

// const EditableRow = ({ form, index, ...props }) => (
//   <EditableContext.Provider value={form}>
//     <tr {...props} />
//   </EditableContext.Provider>
// );

// const EditableFormRow = Form.create()(EditableRow);

// class EditableCell extends React.Component {
//   state = {
//     editing: false,
//   };

//   toggleEdit = () => {
//     const editing = !this.state.editing;
//     this.setState({ editing }, () => {
//       if (editing) {
//         this.input.focus();
//       }
//     });
//   };

//   save = (e) => {
//     const { record, handleSave } = this.props;
//     this.form.validateFields((error, values) => {
//       if (error && error[e.currentTarget.id]) {
//         return;
//       }
//       this.toggleEdit();
//       handleSave({ ...record, ...values });
//     });
//   };

//   renderCell = (form) => {
//     this.form = form;
//     const {
//       children, dataIndex, record, title,
//     } = this.props;
//     const { editing } = this.state;
//     return editing ? (
//       <Form.Item style={{ margin: 0 }}>
//         {form.getFieldDecorator(dataIndex, {
//           rules: [
//             {
//               required: true,
//               message: `${title} is required.`,
//             },
//           ],
//           initialValue: record[dataIndex],
//         })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
//       </Form.Item>
//     ) : (
//       <div
//         className="editable-cell-value-wrap"
//         style={{ paddingRight: 24 }}
//         onClick={this.toggleEdit}
//       >
//         {children}
//       </div>
//     );
//   };

//   render() {
//     const {
//       editable,
//       dataIndex,
//       title,
//       record,
//       index,
//       handleSave,
//       children,
//       ...restProps
//     } = this.props;
//     return (
//       <td {...restProps}>
//         {editable ? (
//           <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
//         ) : (
//           children
//         )}
//       </td>
//     );
//   }
// }

export default ({ match: { params }, history }) => {
  const [selectData, setSelectData] = useState({});
  const [infoData, setInfoData] = useState([]);
  const [lodaing, setLoading] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const [productFilters, setProductFilters] = useState([]);
  const [summary, setSummary] = useState('');
  // const { uuid } = params
  // console.log('match', params);

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
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
    },
    {
      title: '产品',
      dataIndex: 'product_name',
      key: 'product_name',
      filters: productFilters,
      onFilter: (value, record) => record.product_name.toLowerCase().indexOf(value) === 0,
    },
    {
      title: '货币类型',
      dataIndex: 'charge_type',
      key: 'charge_type',
    },
    {
      title: '当月消耗金额',
      dataIndex: 'spend_count',
      key: 'spend_count',
      editable: true,
    },
    {
      title: '当月消耗金额+上月差额',
      dataIndex: 'spend_count_add_lastmonth',
      key: 'spend_count_add_lastmonth',
      // render: (_text, row) => format(evaluate(Number(row.lastDeviationCount) + Number(row.spend_count)), { notation: 'fixed', precision: 2 }),
    },
    {
      title: '账单消耗金额',
      dataIndex: 'bill_spend_count',
      key: 'bill_spend_count',
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
      // render: (_text, row) => (Number(row.spend_count) ? format(evaluate(Number(row.deviation_count) / Number(row.spend_count) * 100), { notation: 'fixed', precision: 2 }) : 0),
    },
    {
      title: '累计偏差金额',
      dataIndex: 'sumDeviationCount',
      key: 'sumDeviationCount',
      // render: (text, row) => format(evaluate(Number(row.deviation_count) + Number(text)), { notation: 'fixed', precision: 2 }),
    },
    {
      title: '累计偏差率(%)',
      dataIndex: 'all_deviation_count_rate',
      key: 'all_deviation_count_rate',
      // render: (_text, row) => (Number(row.sumSpendCount) + Number(row.spend_count) ? format(evaluate((Number(row.deviation_count) + +row.sumDeviationCount) / (+row.sumSpendCount + +row.spend_count) * 100), { notation: 'fixed', precision: 2 }) : 0),
    },
  ];

  // const components = {
  //   body: {
  //     row: EditableFormRow,
  //     cell: EditableCell,
  //   },
  // };

  // const components = {
  //   body: {
  //     row: EditableRow,
  //     cell: EditableCell,
  //   },
  // };

  const checkData = (list) => {
    let isOk = true;
    const len = list.length;
    for (let index = 0; index < len; index++) {
      const element = list[index];
      if (+element.bill_spend_count === 0 || +element.spend_count === 0) {
        isOk = false;
        break;
      }
      if (+element.spend_count - +element.bill_spend_count >= 100) {
        isOk = false;
        break;
      }
      const deviationRate = (Number(element.spend_count) ? format(evaluate(Number(element.deviation_count) / Number(element.spend_count) * 100), { notation: 'fixed', precision: 2 }) : 0);
      if (+deviationRate >= 1) {
        isOk = false;
        break;
      }
    }
    return isOk;
  };


  const showIndex = () => {
    // history.push('/gh/spend-verification/');
    window.location.href = '/page?p=1110&pt=1110&fg=gh#/gh/spend-verification';
  };

  const initType = async () => {
    if (params.uuid) {
      // setPageType(2);
      setLoading(true);
      const { data } = await info(params.uuid);
      console.log('res', data);
      setSelectData(data.data);
      const { data: spiderCheck } = await getFinanceSpiderCheck({ month: data.data.month });
      console.log('res', spiderCheck);
      data.list.forEach((row) => {
        row.spend_count_add_lastmonth = format(evaluate(Number(row.lastDeviationCount) + Number(row.spend_count)), { notation: 'fixed', precision: 2 });
        row.deviation_count_rate = (Number(row.spend_count) ? format(evaluate(Number(row.deviation_count) / Number(row.spend_count) * 100), { notation: 'fixed', precision: 2 }) : 0);
        row.all_deviation_count_rate = (Number(row.sumSpendCount) + Number(row.spend_count) ? format(evaluate((Number(row.deviation_count) + +row.sumDeviationCount) / (+row.sumSpendCount + +row.spend_count) * 100), { notation: 'fixed', precision: 2 }) : 0);
        row.sumDeviationCount = format(evaluate(Number(row.deviation_count) + Number(row.sumDeviationCount)), { notation: 'fixed', precision: 2 });
      });
      const isOk = checkData(data.list);
      if (!spiderCheck && !isOk) {
        const text = Csv(columnsInfo, data.list, params, false);
        const BOM = '\uFEFF';
        let csvUrl = '';
        // Add BOM to text for open in excel correctly
        if (window.Blob && window.URL && window.URL.createObjectURL) {
          const csvData = new Blob([BOM + text], { type: 'text/csv' });
          console.log('csvData', csvData.text);
          const data = await getOssToken(`${selectData.month}月份数据`, 'rc.quvideo.vip');
          console.log('data', data);
          // if (index === 0) {
          //   fileName = data.fileName;
          // }
          // 生成client
          // OSS({
          //   endpoint: `https://${bucket}.oss-accelerate.aliyuncs.com`,
          //   accessKeyId,
          //   accessKeySecret,
          //   bucket,
          //   stsToken: securityToken,
          //   cname: true,
          // })
          const client = new OSS({
            endpoint: data.endpoint,
            accessKeyId: data.stsToken.Credentials.AccessKeyId,
            accessKeySecret: data.stsToken.Credentials.AccessKeySecret,
            stsToken: data.stsToken.Credentials.SecurityToken,
            bucket: data.bucket,
            cname: true,
          });
          const { res } = await client.put(
            `web/${data.fileName}.csv`,
            csvData,
          );
          csvUrl = `https://rc.quvideo.vip/web/${data.fileName}.csv`;
          console.log('resres', res);
          console.log('csvUrl', csvUrl);
        }
        const res = await update({
          uuid: data.data.uuid, summary, check_state: 3, audit_state: 3, spider_check: 1, csvUrl,
        });
        console.log('res', res);
        if (res.code === 20000) {
          message.success('偏差过大，已发起爬虫数据校验, 5秒后自动返回主页');
          // return true;
        } else {
          message.error(res.message);
        }
        setTimeout(() => {
          showIndex();
        }, 5000);
      }
      setInfoData(data.list);
      setCanSend(isOk);
      const productList = data.list.map(item => item.product_name.toLowerCase());
      // console.log('data.list.map(item => item.product_name)', Array.from(new Set(productList)));
      setProductFilters(Array.from(new Set(productList)).map(item => ({
        text: item,
        value: item,
      })));
      setLoading(false);
      // initData()
    }
  };

  useEffect(() => {
    initType();
  }, []);

  // const handleSave = async (row) => {
  //   // console.log('row', row);
  //   const newData = [...infoData];
  //   const index = newData.findIndex(item => row.id === item.id);
  //   const item = newData[index];
  //   row.deviation_count = number(format(evaluate(Number(row.bill_spend_count) - Number(row.spend_count)), { notation: 'fixed', precision: 2 }));
  //   newData.splice(index, 1, { ...item, ...row });
  //   // console.log('newData', newData);
  //   const res = await relUpdate(row);
  //   if (res.code === 20000) {
  //     setInfoData(newData);
  //     message.success('设置成功');
  //     initType();
  //   } else {
  //     message.error('设置失败，请重试');
  //   }
  // };
  // const columns = columnsInfo.map((col) => {
  //   if (!col.editable) {
  //     return col;
  //   }

  //   return {
  //     ...col,
  //     onCell: record => ({
  //       record,
  //       editable: col.editable,
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       handleSave,
  //     }),
  //   };
  // });

  const saveInfo = async ({ noMsg = false }) => {
    if (!summary) {
      message.error('请输入月度总结');
      return false;
    }
    const res = await update({ uuid: selectData.uuid, summary });
    console.log('res', res);
    if (res.code === 20000) {
      if (!noMsg) {
        message.success(res.message);
      }
      return true;
    }
    message.error(res.message);
    return false;
  };

  const cancel = async () => {
    const res = await update({
      uuid: selectData.uuid, summary, check_state: 3, audit_state: 3,
    });
    console.log('res', res);
    if (res.code === 20000) {
      message.success(res.message);
      // return true;
    } else {
      message.error(res.message);
    }
    showIndex();
    // return false;
  };

  const sendCheck = async () => {
    const data = await saveInfo({ noMsg: true });
    if (!data) {
      message.error('出错了，请重试');
      return true;
    }
    if (!canSend) {
      message.error('数据偏差过大，不允许提交');
      return false;
    }
    const res = await checkDataInfo({ uuid: selectData.uuid, type: 1 });
    console.log('res', res);
    if (res.code === 20000) {
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  };

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
        // components={components}
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
          <TextArea rows={4} value={summary} onChange={(e) => {
            setSummary(e.target.value);
          }}/>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button style={{ marginRight: 16 }} onClick={saveInfo}>保存</Button>
          <Button style={{ marginRight: 16 }} type="primary" onClick={sendCheck}>提交审核</Button>
          <Button type="dashed" onClick={cancel}>取消</Button>
        </Col>
      </Row>
    </div>
  );
};
