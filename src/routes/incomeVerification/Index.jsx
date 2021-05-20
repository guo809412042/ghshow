/*
 * @Date: 2021-02-25 14:45:50
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-06 10:58:56
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import {
  Card, Upload, Table, Pagination, message,
} from 'antd';
import {
  evaluate, format, number,
} from 'mathjs';
import moment from 'moment';
import XLSX from 'xlsx';
import {
  getDataList, create,
} from './service';
import { reptileDataSql } from './sqlTemplate';
import { getData } from '../../utils/request';
import { productMap } from '../spendVerification/const';
import { chargeTypeMap, checkStateMap } from './const';

const { Dragger } = Upload;

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

CREATE TABLE `rel_income_verification_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `uuid` varchar(64) NOT NULL COMMENT 'uuid',
  `month` varchar(64) DEFAULT NULL COMMENT '月份',
  `account` varchar(64) DEFAULT NULL COMMENT '平台',
  `product_name` varchar(255) DEFAULT NULL COMMENT '产品',
  `charge_type` varchar(32) DEFAULT NULL COMMENT '货币类型',
  `revenue_count` varchar(128) DEFAULT NULL COMMENT '收入金额',
  `deviation_count` varchar(128) DEFAULT NULL COMMENT '当月偏差金额',
  `bill_revenue_count` varchar(128) DEFAULT NULL COMMENT '账单收入金额',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COMMENT='广告收入明细表';

3：校验流程：
    a：获取爬虫数据，比对偏差金额，计算偏差率
    b：提交审批，审批通过后，当月数据不允许变更及提交当月的数据
*/

export default () => {
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [lodaing, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [count, seCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  // const { uuid } = params
  // console.log('match', params);
  const getInfo = async (content) => {
    // setLoading(true);
    // const { data } = await info(content.uuid);
    // console.log('res', data);
    // setPageType(2);
    // setSelectData(data.data);
    // setInfoData(data.list);
    // setLoading(false);
    window.location.href = `/page?p=1110&pt=1110&fg=gh#/gh/income-verification/info/${content.uuid}`;
    // history.push(`/gh/income-verification/info/${content.uuid}`);
  };

  const checkInfo = async (content) => {
    window.location.href = `/page?p=1110&pt=1110&fg=gh#/gh/income-verification/check/${content.uuid}`;
    // history.push(`/gh/income-verification/check/${content.uuid}`);
  };

  const columns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '上传用户',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '上传时间',
      dataIndex: 'upload_time',
      key: 'upload_time',
    },
    {
      title: '校验时间',
      dataIndex: 'check_time',
      key: 'check_time',
    },
    {
      title: '校验状态',
      dataIndex: 'check_state',
      key: 'check_state',
      render: text => checkStateMap[text],
    },
    {
      title: '审核结果',
      dataIndex: 'audit_state',
      key: 'audit_state',
      render: text => checkStateMap[text],
    },
    {
      title: '操作',
      dataIndex: 'handel',
      key: 'handel',
      render: (_text, row) => <>{!row.feishu_instance_code && <a onClick={() => { checkInfo(row); }}>校验 | </a>}<a onClick={() => { getInfo(row); }}>查看详情</a></>,
    },
  ];

  const getFetchData = async () => {
    setLoading(true);
    const { data: { rows, count } } = await getDataList({ page, pageSize, type: 2 });
    // console.log('res', res);
    seCount(count);
    setDataSource(rows);
    setLoading(false);
  };

  const uploadfun = (obj) => {
    if (!obj) {
      return;
    }
    const reader = new FileReader();
    reader.readAsBinaryString(obj);
    reader.onload = async (e) => {
      const data = e.target.result;
      const wb = XLSX.read(data, {
        type: 'binary',
      });
      const arr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      console.log('arr', arr);
      const senData = [];
      let day;
      try {
        if (arr.length) {
          day = String(arr[0]['月份']);
        }
      } catch (error) {
        message.error('请检查上传Excel');
        return false;
      }

      console.log('day', day);
      const startDay = moment(day).startOf('month').format('YYYYMMDD');
      const endDay = moment(day).endOf('month').format('YYYYMMDD');
      const sql = reptileDataSql.replace(/#startDay#/g, startDay).replace(/#endDay#/g, endDay);
      console.log('sql', sql);
      const reptileData = await getData(sql);
      // const reptileDataObj = {};
      // const reptileDataList = [];
      // for (let index = 0; index < reptileData.length; index++) {
      //   const element = reptileData[index];
      //   if (!accountMap[element.platform_name]) {
      //     continue;
      //   }
      //   if (reptileDataObj[`${accountMap[element.platform_name]}%%${productMap[element.product_id]}%%${chargeTypeMap[element.charge_type]}`]) {
      //     const obj = reptileDataObj[`${accountMap[element.platform_name]}%%${productMap[element.product_id]}%%${chargeTypeMap[element.charge_type]}`];
      //     obj.ad_revenue = format(evaluate(Number(obj.ad_revenue)
      //     + element.ad_revenue), { precision: 14 });
      //   } else {
      //     reptileDataObj[`${accountMap[element.platform_name]}%%${productMap[element.product_id]}%%${chargeTypeMap[element.charge_type]}`] = element;
      //   }
      //   element.account_name = accountMap[element.platform_name];
      // }

      // console.log('reptileDataObj', reptileDataObj);
      // // eslint-disable-next-line guard-for-in
      // for (const key in reptileDataObj) {
      //   const element = reptileDataObj[key];
      //   reptileDataList.push(element);
      // }
      console.log('reptileData', reptileData);
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        for (let n = 0; n < reptileData.length; n++) {
          const item = reptileData[n];
          if (item.platform_name.toLowerCase() === element['平台'].toLowerCase() && productMap[item.product_id].toLowerCase() === element['产品'].toLowerCase() && chargeTypeMap[item.charge_type].toLowerCase() === element['货币类型'].toLowerCase()) {
            // senData.push({
            //   product_name: element['产品'],
            //   month: element['月份'],
            //   account: element['供应商'],
            //   charge_type: element['货币类型'],
            //   spend_count: number(format(item.ad_spend, { notation: 'fixed', precision: 2 })),
            //   type: 1,
            //   bill_spend_count: number(format(element['账单消耗金额'], { notation: 'fixed', precision: 2 })),
            //   deviation_count: number(format(evaluate(Number(element['账单消耗金额']) - Number(item.ad_spend)), { notation: 'fixed', precision: 2 })),
            //   // month: element['月份'],
            // });
            senData.push({
              product_name: element['产品'],
              month: element['月份'],
              account: element['平台'],
              charge_type: element['货币类型'],
              revenue_count: number(format(item.ad_revenue, { notation: 'fixed', precision: 2 })),
              type: 2,
              bill_revenue_count: number(format(element['账单收入'], { notation: 'fixed', precision: 2 })),
              deviation_count: number(format(evaluate(Number(element['账单收入']) - item.ad_revenue), { precision: 2 })),
              // month: element['月份'],
            });
          }
        }
      }
      console.log('senData', senData);
      setUploadDisabled(false);
      const res = await create({ list: senData });
      console.log('res', res);
      if (res.code === 20000) {
        getFetchData();
        message.success('上传成功');
      } else {
        message.error(res.message);
      }
    };
  };

  const Uploadprops = {
    customRequest: ({ file }) => {
      setUploadDisabled(true);
      try {
        if (!file) {
          return;
        }
        uploadfun(file);
      } catch (error) {
        setUploadDisabled(false);
      }
    },
    showUploadList: false,
  };

  const onShowSizeChange = (current, pageSize) => {
    // console.log(current, pageSize);
    setPage(current);
    setPageSize(pageSize);
  };


  useEffect(() => {
    getFetchData();
  }, [page, pageSize]);

  return (
    <div>
      <Card title={<span>月度校验信息<a href="https://rc.quvideo.vip/vcm/2/20210402/155232/807255304654848/202104021552321.xlsm">模板下载</a></span>} bordered={false} style={{ width: '100%' }}>
        <Dragger {...Uploadprops} disabled={uploadDisabled}>
            添加
        </Dragger>
      </Card>
      <Table
        columns={columns}
        bordered
        dataSource={dataSource}
        style={{ marginTop: 20 }}
        loading={lodaing}
        pagination={false}
        rowKey="uuid"
      />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Pagination
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          defaultCurrent={1}
          total={count}
        />
      </div>
    </div>
  );
};
