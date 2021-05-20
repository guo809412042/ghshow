/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Button, Table, Modal, Upload, Icon,
} from 'antd';
import XLSX from 'xlsx';
import Query from './components/Query';
import {
  BASIC_COLUMNS,
  ORGANIC_CN_COLUMNS,
  PUT_CN_COLUMNS,
  ORGANIC_NOT_CN_COLUMNS,
  PUT_NOT_CN_COLUMNS,
  CHANNEL_TYPE,
  downMode,
} from './const';
import {
  getConfigCnOrgList,
  createCnOrgBulk,
  createNotCnOrgBulk,
  getConfigNotCnOrgList,
  deleteCnOrg,
  deleteNotCnOrg,
  createCnPutBulk,
  getConfigCnPutList,
  deleteCnPut,
  createNotCnPutBulk,
  getConfigNotCnPutList,
  deleteNotCnPut,
} from '../services';
import { getFixed } from '../../../utils/utils';

export default () => {
  const [search, setSearch] = useState({
    country: '中国',
    channel: '1',
    type: undefined,
    startDate: moment().subtract(6, 'month'),
    endDate: moment().subtract(0, 'month'),
  });
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const getList = async () => {
    let res;
    const {
      country, channel, type, startDate, endDate,
    } = search;
    if (country === '中国' && channel === '1') {
      res = await getConfigCnOrgList({
        type,
        startDate: moment(startDate).format('YYYYMM'),
        endDate: moment(endDate).format('YYYYMM'),
      });
    } else if (country !== '中国' && channel === '1') {
      res = await getConfigNotCnOrgList({
        type,
        country,
        startDate: moment(startDate).format('YYYYMM'),
        endDate: moment(endDate).format('YYYYMM'),
      });
    } else if (country === '中国' && channel === '2') {
      res = await getConfigCnPutList({
        type,
        startDate: moment(startDate).format('YYYYMM'),
        endDate: moment(endDate).format('YYYYMM'),
      });
    } else {
      res = await getConfigNotCnPutList({
        type,
        country,
        startDate: moment(startDate).format('YYYYMM'),
        endDate: moment(endDate).format('YYYYMM'),
      });
    }
    const notFixedIds = ['country', 'channel', 'date_time', 'type'];
    const suffixIds = [
      'gp_new_month_rate',
      'and_month_rate',
      'gp_new_year_rate',
      'ios_new_month_rate',
      'ios_new_year_rate',
      'and_sub_old_month_rate',
      'ios_sub_month_rate',
      'gp_sub_month_rate',
    ];
    const fixed2Ids = [
      'gp_arpu',
      'ios_arpu',
      'and_arpu',
      'and_cpa',
      'ios_cpa',
      'and_put_org_year_arpu',
      'ios_put_org_year_arpu',
      'and_search_cpa',
      'and_other_cpa',
      'ios_other_cpa',
      'ios_search_cpa',
    ];
    const data = res.data;
    const dataSource = [];
    if (data.length) {
      const keys = Object.keys(data[0]);
      for (const i of data) {
        const arr = {};
        for (const j of keys) {
          if (notFixedIds.includes(j)) {
            arr[j] = i[j];
          } else if (suffixIds.includes(j)) {
            arr[j] = `${getFixed(i[j] * 100, 2)}%`;
          } else if (fixed2Ids.includes(j)) {
            arr[j] = getFixed(i[j], 2);
          } else {
            arr[j] = getFixed(i[j], 0);
          }
        }
        dataSource.push(arr);
      }
    }
    setDataSource(dataSource);
  };
  const onSearch = (values) => {
    setSearch(values);
  };
  const deleteRow = (row) => {
    const { country, channel } = search;
    Modal.confirm({
      title: '确定删除？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        if (country === '中国' && channel === '1') {
          await deleteCnOrg(row.id);
        } else if (country !== '中国' && channel === '1') {
          await deleteNotCnOrg(row.id);
        } else if (country === '中国' && channel === '2') {
          await deleteCnPut(row.id);
        } else {
          await deleteNotCnPut(row.id);
        }
        await getList();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const getColumns = () => {
    const country = search.country;
    const channel = Number(search.channel);
    let columns;
    if (country === '中国') {
      if (channel === 1) {
        columns = BASIC_COLUMNS.concat(ORGANIC_CN_COLUMNS);
      } else {
        columns = BASIC_COLUMNS.concat(PUT_CN_COLUMNS);
      }
    } else if (channel === 1) {
      columns = BASIC_COLUMNS.concat(ORGANIC_NOT_CN_COLUMNS);
    } else {
      columns = BASIC_COLUMNS.concat(PUT_NOT_CN_COLUMNS);
    }
    columns.push({
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      fixed: 'right',
      render: (text, row) => (
        <div>
          <Button size="small" onClick={() => deleteRow(row)}>
            删除
          </Button>
        </div>
      ),
    });
    setColumns(columns);
  };
  useEffect(() => {
    getColumns();
  }, [search.country, search.channel]);
  useEffect(() => {
    getList();
  }, [search]);
  const uploadfun = (file) => {
    if (!file) {
      return false;
    }
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = async (e) => {
      const data = e.target.result;
      const wb = XLSX.read(data, {
        type: 'binary',
      });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      rows.splice(0, 1);
      if (search.channel === '1' && search.country === '中国') {
        await createCnOrgBulk(rows);
      } else if (search.channel === '1' && search.country !== '中国') {
        await createNotCnOrgBulk(rows);
      } else if (search.channel === '2' && search.country === '中国') {
        await createCnPutBulk(rows);
      } else {
        await createNotCnPutBulk(rows);
      }
      await getList();
    };
  };
  const uploadProps = {
    customRequest: ({ file }) => {
      try {
        if (!file) {
          return;
        }
        uploadfun(file);
      } catch (error) {
        console.log(error);
      }
    },
    showUploadList: false,
  };
  const down = () => {
    const datas = downMode(search.country, search.channel);
    const data = [[], []];
    datas.columns.forEach((v) => {
      data[0].push(v.key);
    });
    Object.values(datas.data[0]).forEach((v) => {
      data[1].push(v);
    });
    data[2] = datas.demo;

    const filename = `${search.country}${CHANNEL_TYPE[search.channel]}模版.xlsx`; // 文件名称
    const ws_name = 'Sheet1'; // Excel第一个sheet的名称
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, ws_name); // 将数据添加到工作薄
    XLSX.writeFile(wb, filename); // 导出Excel
  };
  return (
    <div>
      <Query search={search} onSearch={onSearch} />
      <div style={{ margin: '10px 0' }}>
        <Upload {...uploadProps} style={{ margin: '10px 10px 10px 0' }}>
          <Button type="primary">
            <Icon type="upload" /> 上传{search.country}
            {CHANNEL_TYPE[search.channel]}列表
          </Button>
        </Upload>
        <Button onClick={down}>
          {' '}
          <Icon type="arrow-down" />
          下载{`${search.country}${CHANNEL_TYPE[search.channel]}模版`}
        </Button>
      </div>

      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 300 * columns.length }}
        rowKey={row => `${row.date_time}+${row.country}+${row.type}`}
      />
    </div>
  );
};
