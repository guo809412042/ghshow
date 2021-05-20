/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Checkbox, Table, Icon, Select, Radio, Modal, DatePicker,
} from 'antd';
import { DownLoadButton } from '../../common/DownLoadButton';
import Query from './components/Query';
import { columnsKeys, AllColumns } from './const';
import { createSqlWhere, getNumber, getPrecision } from '../../../utils/utils';
import {
  listSQL, listDaySQL, otherSQL, getDaySQL,
} from './components/sqlTemplate';
import { getData } from '../../../utils/request';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';

export default () => {
  const [tabelKey, setTableKey] = useState(['1']);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [downData, setDownData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalRow, setModalRow] = useState({});
  const [modalStartDate, setModalStartDate] = useState(moment().subtract(30, 'days'));
  const [modalEndDate, setModalEndDate] = useState(moment().subtract(1, 'days'));
  const [modalData, setModalData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    startDate: moment().subtract(1, 'days'),
    endDate: moment().subtract(1, 'days'),
    country: [
      '中国',
      '美国',
      '日本',
      '韩国',
      '台湾',
      '泰国',
      '印度',
      '印度尼西亚',
      '巴西',
      '伊朗',
      '俄罗斯',
      '菲律宾',
      '巴基斯坦',
      '中东',
    ],
    appVersion: [],
    countryName: undefined,
    compareEndDate: moment().subtract(2, 'days'),
    type: 'country',
  });
  const [platform, setPlatform] = useState('1');
  const [userType, setUserType] = useState('');

  const getSQLRes = async (startDate, endDate, sql = listSQL, title) => {
    const { type } = search;
    let where = '';
    if (userType) {
      where += ` and dvc_type = '${userType}'`;
    }
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    if (search.appVersion.length) {
      where += ` and  app_version in (${search.appVersion.map(v => `'${v}'`).join(',')})`;
    }
    let country = '';
    let otherWhere = '';
    if (modalTitle && modalTitle !== '全球' && modalTitle !== '中东') {
      otherWhere += ` and ${type} = '${modalTitle}'`;
    }
    if (search.country.length) {
      country = ` and  country in (${search.country.map(v => `'${v}'`).join(',')})`;
    }
    const fetchSQL = createSqlWhere({
      sql,
      startDate,
      endDate,
      where,
      type,
      country,
      order: type === 'country' ? 'dau' : 'app_version',
      otherWhere,
    }).replace(/#title#/, title);
    let res = await getData(fetchSQL);
    if (!search.country.includes('中东') || type === 'app_version') {
      res = res.filter(v => v[type] !== '中东');
    }
    if (type === 'app_version') {
      res = res.filter(v => v[type] !== '中东' && v[type] !== '全球');
    }
    return res;
  };
  const getList = async () => {
    setLoading(true);
    const {
      startDate, endDate, compareEndDate, type,
    } = search;
    const dayRes = await getSQLRes(startDate, endDate, getDaySQL);
    const res = await getSQLRes(startDate, endDate);
    const diff = endDate.diff(startDate, 'days') + 1;
    const compareRes = type === 'country' ? await getSQLRes(moment(compareEndDate).subtract(diff - 1, 'days'), compareEndDate) : [];
    const keys = AllColumns.map(v => v.dataIndex);
    let data = [];
    const downData = [];
    for (const i of res) {
      const arr = { [type]: i[type] };
      const daysDIff = type === 'country' ? 0 : dayRes.find(item => item.app_version === i.app_version).count;
      const compareArr = { [type]: i[type] };
      let compareData = compareRes.find(v => v[type] === i[type]);
      compareData = compareData || {};
      for (const j of keys) {
        let compare = 0;
        let pecision = 0;
        if (j.includes('/')) {
          const nums = j.split('/');
          arr[j] = getNumber(i[nums[0]], i[nums[1]]);
          compare = getNumber(compareData[nums[0]], compareData[nums[1]]);
        } else if (j.includes('%')) {
          const nums = j.split('%');
          arr[j] = getNumber(i[nums[0]], i[nums[1]], false);
          compare = getNumber(compareData[nums[0]], compareData[nums[1]], false);
        } else {
          arr[j] = ((i[j] || 0) / (type === 'country' ? diff : daysDIff)).toFixed(
            ['dau', 'new_dvc_cnt', 'exp_succ_cnt', 'put_new_dvc_cnt', 'organic_new_dvc_cnt'].includes(j) ? 0 : 2,
          );
          compare = ((compareData[j] || 0) / (type === 'country' ? diff : daysDIff)).toFixed(
            ['dau', 'new_dvc_cnt', 'exp_succ_cnt', 'put_new_dvc_cnt', 'organic_new_dvc_cnt'].includes(j) ? 0 : 2,
          );
        }
        pecision = getPrecision(arr[j], compare);
        compareArr[j] = type === 'country' ? (
          <div>
            <p>({arr[j]})</p>
            <p style={{ color: pecision > 0 ? 'green' : 'red', fontSize: 12 }}>
              <Icon type={pecision > 0 ? 'arrow-up' : 'arrow-down'} />
              {pecision}%
            </p>
          </div>
        ) : (
          arr[j]
        );
      }
      downData.push(arr);
      data.push(compareArr);
    }
    if (search.type === 'app_version') {
      data = data.filter(v => v.app_version && v.app_version.length <= 10);
    }
    setDataSource(data);
    setDownData(downData);
    setLoading(false);
  };
  const chartShow = (name, label) => {
    setModalTitle(name);
    setModalRow(label);
    setVisible(true);
  };
  const getColumns = () => {
    const { type } = search;
    const list = columnsKeys.filter(v => tabelKey.includes(v.value));
    const columns = [{ title: type === 'app_version' ? '版本' : '地区', dataIndex: type, key: type }];
    for (const i of list) {
      const children = i.columns.map(v => ({
        ...v,
        onCell: record => ({
          onClick: () => chartShow(record[type], v),
        }),
        sorter: (a, b) => a[v.dataIndex] - b[[v.dataIndex]],
      }));
      columns.push({
        children,
        title: i.label,
      });
    }
    setColumns(columns);
  };
  const getChartData = async () => {
    let sql;
    if (modalTitle === '全球' || modalTitle === '中东') {
      sql = listDaySQL;
    } else {
      sql = otherSQL;
    }
    const res = await getSQLRes(modalStartDate, modalEndDate, sql, modalTitle);
    const chartData = res.map((v) => {
      let value = 0;
      if (modalRow.key.includes('/')) {
        const nums = modalRow.key.split('/');
        value = getNumber(v[nums[0]], v[nums[1]]);
      } else if (modalRow.key.includes('%')) {
        const nums = modalRow.key.split('%');
        value = getNumber(v[nums[0]], v[nums[1]], false);
      } else {
        value = v[modalRow.key];
      }
      return {
        day: moment(v.ds).format('YYYY-MM-DD'),
        value,
        type: modalRow.title,
      };
    });
    chartLineRender(chartData, document.getElementById('chart'));
    setModalData(chartData);
  };
  useEffect(() => {
    getColumns();
  }, [tabelKey, search.type]);
  useEffect(() => {
    getList();
  }, [search, userType, platform]);
  useEffect(() => {
    if (visible) {
      getChartData();
    }
  }, [visible, modalStartDate, modalEndDate]);
  const downColumns = [];
  columns.forEach((v) => {
    if (v.children) {
      v.children.forEach((i) => {
        downColumns.push(i);
      });
    } else {
      downColumns.push(v);
    }
  });
  return (
    <div>
      <Select
        style={{ width: 100, marginRight: '8px', marginBottom: 8 }}
        placeholder="平台"
        value={platform}
        onChange={e => setPlatform(e)}
      >
        <Select.Option key="1" value="1">
          Andorid
        </Select.Option>

        <Select.Option key="2" value="2">
          iOS
        </Select.Option>
      </Select>
      <Radio.Group
        value={userType}
        placeholder="设备类型"
        onChange={e => setUserType(e.target.value)}
        style={{
          marginRight: 8,
        }}
      >
        <Radio.Button value="" key="">
          全部
        </Radio.Button>
        <Radio.Button value="1" key="1">
          新
        </Radio.Button>
        <Radio.Button value="0" key="0">
          老
        </Radio.Button>
      </Radio.Group>
      <Query search={search} onSearch={setSearch} platform={platform} />

      <Checkbox.Group
        options={columnsKeys}
        value={tabelKey}
        onChange={setTableKey}
        style={{ margin: '20px 20px 20px 0' }}
      />
      <DownLoadButton filename="指标" data={downData} columns={downColumns} />
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        scroll={{ x: columns.length * 700, y: 500 }}
        rowKey={search.type}
        loading={loading}
      />
      <Modal
        title={`${modalTitle}-${modalRow.title}`}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={800}
      >
        <DatePicker.RangePicker
          value={[modalStartDate, modalEndDate]}
          onChange={(value) => {
            setModalStartDate(value[0]);
            setModalEndDate(value[1]);
          }}
        />
        <DownLoadButton
          filename={`${modalTitle}-${modalRow.title}`}
          columns={[{ key: 'day', title: 'day' }, { key: 'value', title: 'value' }, { key: 'type', title: 'type' }]}
          data={modalData}
        />
        <div id="chart" />
      </Modal>
    </div>
  );
};
