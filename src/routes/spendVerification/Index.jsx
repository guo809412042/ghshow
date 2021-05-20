/*
 * @Date: 2021-02-25 10:45:50
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-26 17:31:37
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
// import { productMap } from '../business/arpu/const';
import {
  accountMap, chargeTypeMap, checkStateMap, productMap, serviceChargeMap, stateMap,
} from './const';


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

export default ({ history }) => {
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
    window.location.href = `/page?p=1110&pt=1110&fg=gh#/gh/spend-verification/info/${content.uuid}`;
    // history.push(`/gh/spend-verification/info/${content.uuid}`);
  };

  const checkInfo = async (content) => {
    window.location.href = `/page?p=1110&pt=1110&fg=gh#/gh/spend-verification/check/${content.uuid}`;
    // history.push(`/gh/spend-verification/check/${content.uuid}`);
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
      render: text => stateMap[text],
    },
    {
      title: '操作',
      dataIndex: 'handel',
      key: 'handel',
      render: (_text, row) => <>{!row.feishu_instance_code && row.check_state < 1 && <a onClick={() => { checkInfo(row); }}>校验 | </a>}<a onClick={() => { getInfo(row); }}>查看详情</a></>,
    },
  ];

  const getFetchData = async () => {
    setLoading(true);
    const { data: { rows, count } } = await getDataList({ page, pageSize, type: 1 });
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
      const reptileDataObj = {};
      const reptileDataList = [];
      console.log('reptileData', reptileData);
      for (let index = 0; index < reptileData.length; index++) {
        const element = reptileData[index];
        element.account_id = element.account_id.replace('act_', '');
        if (!accountMap[element.account_id]) {
          console.log('element.account_id', `${element.account_id}***${element.media_source}`);
          element.account_name = `${element.account_id}***${element.media_source}`;
          reptileDataObj[`${element.account_name}`] = element;
          continue;
        }
        // if (accountMap[element.account_id] === 'Adsmarch' && element.product_id === 2) {
        //   console.log('elementelementelementelement', element);
        // }
        if (reptileDataObj[`${accountMap[element.account_id]}%%${productMap[element.product_id]}%%${chargeTypeMap[element.charge_type]}%%${element.media_source}`]) {
          const obj = reptileDataObj[`${accountMap[element.account_id]}%%${productMap[element.product_id]}%%${chargeTypeMap[element.charge_type]}%%${element.media_source}`];
          obj.ad_spend = evaluate(obj.ad_spend
          + element.ad_spend);
        } else {
          reptileDataObj[`${accountMap[element.account_id]}%%${productMap[element.product_id]}%%${chargeTypeMap[element.charge_type]}%%${element.media_source}`] = element;
        }
        element.account_name = accountMap[element.account_id];
      }

      console.log('reptileDataObj', reptileDataObj);
      // eslint-disable-next-line guard-for-in
      for (const key in reptileDataObj) {
        const element = reptileDataObj[key];
        reptileDataList.push(element);
      }
      console.log('reptileData', reptileDataList);
      const hasPushAccount = [];
      const hasAccountList = [];
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        // console.log('element', element);
        // let has = false;
        for (let n = 0; n < reptileDataList.length; n++) {
          const item = reptileDataList[n];
          // console.log('item', item);
          if (item.media_source.toLowerCase() !== element['渠道'].toLowerCase()) {
            continue;
          }
          if (accountMap[item.account_id]) {
            if (!hasAccountList.includes(`${accountMap[item.account_id].toLowerCase()}-${productMap[item.product_id].toLowerCase()}-${element['渠道'].toLowerCase()}`)) {
              hasAccountList.push(`${accountMap[item.account_id].toLowerCase()}-${productMap[item.product_id].toLowerCase()}-${element['渠道'].toLowerCase()}`);
            }
            if (serviceChargeMap[element['供应商'].toLowerCase()] && accountMap[item.account_id].toLowerCase() === element['供应商'].toLowerCase()) {
              // console.log('ele', element);
              item.ad_spend = evaluate(item.ad_spend + (item.ad_spend * serviceChargeMap[element['供应商'].toLowerCase()]));
            }
            if (item.media_source.toLowerCase() === element['渠道'].toLowerCase() && accountMap[item.account_id].toLowerCase() === element['供应商'].toLowerCase()
            && productMap[item.product_id].toLowerCase() === element['产品'].toLowerCase() && chargeTypeMap[item.charge_type].toLowerCase() === element['货币类型'].toLowerCase()) {
              // has = true;
              senData.push({
                product_name: element['产品'],
                month: element['月份'],
                account: element['供应商'],
                channel: element['渠道'],
                charge_type: element['货币类型'],
                spend_count: number(format(item.ad_spend, { notation: 'fixed', precision: 2 })),
                type: 1,
                bill_spend_count: number(format(element['账单消耗金额'], { notation: 'fixed', precision: 2 })),
                deviation_count: number(format(evaluate(Number(element['账单消耗金额']) - Number(item.ad_spend)), { notation: 'fixed', precision: 2 })),
                // month: element['月份'],
              });
            }
          } else {
            // has = true;
            // console.log('hasPushAccount', hasPushAccount);
            if (hasPushAccount.includes(`${item.account_name}-${item.product_id}-${item.charge_type}-${element['渠道'].toLowerCase()}`)) {
              // console.log('hasPushAccount2', hasPushAccount);
              continue;
            }
            hasPushAccount.push(`${item.account_name}-${item.product_id}-${item.charge_type}-${element['渠道'].toLowerCase()}`);
            senData.push({
              product_name: productMap[item.product_id],
              month: element['月份'],
              account: item.account_name,
              channel: element['渠道'],
              charge_type: chargeTypeMap[item.charge_type],
              spend_count: number(format(item.ad_spend, { notation: 'fixed', precision: 2 })),
              type: 1,
              bill_spend_count: 0,
              deviation_count: number(format(evaluate(0 - Number(item.ad_spend)), { notation: 'fixed', precision: 2 })),
              // month: element['月份'],
            });
          }
        }
        if (!hasAccountList.includes(`${element['供应商'].toLowerCase()}-${element['产品'].toLowerCase()}-${element['渠道'].toLowerCase()}`)) {
          senData.push({
            product_name: element['产品'],
            month: element['月份'],
            account: element['供应商'],
            charge_type: element['货币类型'],
            spend_count: 0,
            type: 1,
            channel: element['渠道'],
            bill_spend_count: number(format(element['账单消耗金额'], { notation: 'fixed', precision: 2 })),
            deviation_count: number(format(evaluate(Number(element['账单消耗金额']) - 0), { notation: 'fixed', precision: 2 })),
          });
        }
      }
      // console.log('hasAccountList', hasAccountList);
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
      <Card title={<span>月度校验信息<a href="https://rc.quvideo.vip/vcm/15/20210426/173021/529182816481280/202104261730216.xlsx">模板下载</a></span>} bordered={false} style={{ width: '100%' }}>
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
