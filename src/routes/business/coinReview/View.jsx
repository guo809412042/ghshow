/* eslint-disable react/no-this-in-sfc */
import React, { useState, useEffect, useRef } from 'react';
import {
  Table, Select, Tooltip, Icon,
} from 'antd';
import moment from 'moment';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';
import Query from './components/Query';
import { getData } from '../../../utils/request';
import { dayListSQL, monthListSQL, skuListSQL } from './components/sqlTemplate';
import { whereSql } from './components/utils';
import { filterEmptyObj } from '../../../utils/utils';
import { DownLoadButton } from '../../common/DownLoadButton';
import styles from './styles/index.less';

export default () => {
  const [loading, setLoading] = useState(false);
  const sku = useRef('');
  const [skuList, setSkuList] = useState([]);
  const [dayMonth, setDayMonth] = useState('day' || 'month');
  const [tableList, setTableList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    countryOpt: 'in',
    countries: ['中国'],
    platform: '1',
    product: '16',
  });

  const onSearch = (params) => {
    setSearch({ ...params, sku: sku.current, dayMonth });
  };

  const width = 120;

  const sorter = () => function sort(a, b) {
    return a[this.key] - b[this.key];
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'ds',
      key: 'ds',
      width,
    },
    {
      title: '新增',
      dataIndex: 'add_dvc_cnt_1d',
      key: 'add_dvc_cnt_1d',
      width,
    },
    {
      title: '金币充值人数',
      dataIndex: 'pay_coin_usr_cnt_1d',
      key: 'pay_coin_usr_cnt_1d',
      width,
    },
    {
      title: '金币充值销售额',
      dataIndex: 'pay_coin_amt_1d',
      key: 'pay_coin_amt_1d',
      width,
      sorter: sorter(),
    },
    {
      title: '首购',
      dataIndex: '首购',
      key: '首购',
      children: [
        {
          title: '首购-笔数',
          dataIndex: 'new_pay_coin_ord_cnt_1d',
          key: 'new_pay_coin_ord_cnt_1d',
          width,
        },
        {
          title: '首购-人数',
          dataIndex: 'new_pay_coin_usr_cnt_1d',
          key: 'new_pay_coin_usr_cnt_1d',
          width,
        },
        {
          title: '首购-销售额',
          dataIndex: 'new_pay_coin_amt_1d',
          key: 'new_pay_coin_amt_1d',
          width,
        },
      ],
    },
    {
      title: '复购',
      dataIndex: '复购',
      key: '复购',
      children: [
        {
          title: '复购-笔数',
          dataIndex: 'old_pay_coin_ord_cnt_1d',
          key: 'old_pay_coin_ord_cnt_1d',
          width,
        },
        {
          title: '复购-人数',
          dataIndex: 'old_pay_coin_usr_cnt_1d',
          key: 'old_pay_coin_usr_cnt_1d',
          width,
        },
        {
          title: '复购-销售额',
          dataIndex: 'old_pay_coin_amt_1d',
          key: 'old_pay_coin_amt_1d',
          width,
        },
      ],
    },
    {
      title: '首购率（%）',
      dataIndex: 'new_rate',
      key: 'new_rate',
      width,
    },
  ];

  const changeProduct = async (product_id) => {
    search.product = product_id;
    if (!product_id) {
      setSkuList([]);
      sku.current = '';
      return;
    }
    // 重新获取sku列表
    const conditions = {
      product_id,
    };
    sku.current = '';
    const where = whereSql(filterEmptyObj(conditions));
    const skuSql = skuListSQL.replace(/\?/g, where ? ` where ${where}` : '');
    const skuRes = await getData(skuSql);
    setSkuList(skuRes || []);
  };

  const getDataList = async () => {
    setLoading(true);
    try {
      const conditions = {
        data_time__gte: moment(search.startDate).format('YYYYMMDD'),
        data_time__lte: moment(search.endDate).format('YYYYMMDD'),
        platform: search.platform,
        product_id: search.product === '' ? '' : search.product,
        sku: sku.current,
      };
      let countryList = [];
      if (search.countries.length > 0) {
        // 地区列表包含全部，都按全部条件搜
        if (!search.countries.includes(' ')) {
          search.countries.forEach((v) => {
            if (v) {
              countryList = countryList.concat(v);
            }
          });
        }
      }
      if (search.countryOpt === 'in') {
        conditions.country_name__in = countryList.length > 0 ? countryList : undefined;
      } else {
        conditions.country_name__notIn = countryList.length > 0 ? countryList : undefined;
      }
      const where = whereSql(filterEmptyObj(conditions));
      let tableSql;
      if (dayMonth === 'day') {
        tableSql = dayListSQL.replace(/\?/g, where ? ` where ${where}` : '');
      } else {
        tableSql = monthListSQL.replace(/\?/g, where ? ` where ${where}` : '');
      }
      const tableRes = await getData(tableSql);
      setTableList(tableRes || []);
    } catch (ex) {
      console.error(ex);
      setTableList([]);
    } finally {
      setLoading(false);
    }
  };

  const exportColumns = [
    {
      title: '时间',
      dataIndex: 'ds',
      key: 'ds',
    },
    {
      title: '新增',
      dataIndex: 'add_dvc_cnt_1d',
      key: 'add_dvc_cnt_1d',
    },
    {
      title: '金币充值人数',
      dataIndex: 'pay_coin_usr_cnt_1d',
      key: 'pay_coin_usr_cnt_1d',
    },
    {
      title: '金币充值销售额',
      dataIndex: 'pay_coin_amt_1d',
      key: 'pay_coin_amt_1d',
    },
    {
      title: '首购-笔数',
      dataIndex: 'new_pay_coin_ord_cnt_1d',
      key: 'new_pay_coin_ord_cnt_1d',
    },
    {
      title: '首购-人数',
      dataIndex: 'new_pay_coin_usr_cnt_1d',
      key: 'new_pay_coin_usr_cnt_1d',
    },
    {
      title: '首购-销售额',
      dataIndex: 'new_pay_coin_amt_1d',
      key: 'new_pay_coin_amt_1d',
    },
    {
      title: '复购-笔数',
      dataIndex: 'old_pay_coin_ord_cnt_1d',
      key: 'old_pay_coin_ord_cnt_1d',
    },
    {
      title: '复购-人数',
      dataIndex: 'old_pay_coin_usr_cnt_1d',
      key: 'old_pay_coin_usr_cnt_1d',
    },
    {
      title: '复购-销售额',
      dataIndex: 'old_pay_coin_amt_1d',
      key: 'old_pay_coin_amt_1d',
    },
    {
      title: '首购率（%）',
      dataIndex: 'new_rate',
      key: 'new_rate',
    },
  ];

  useEffect(() => {
    onSearch({
      ...search,
      sku: sku.current,
      dayMonth,
    });
  }, [dayMonth]);

  useEffect(() => {
    setCurrentPage(1);
    getDataList();
  }, [search]);

  return (
    <div>
      <Query onSearch={onSearch} search={search} onChangeProduct={changeProduct} />
      <Select
        className={styles.queryItem}
        key="商品类型"
        value={sku.current}
        onChange={(value) => {
          sku.current = value;
          getDataList();
        }}
      >
        <Select.Option key="" value="">
          全部商品
        </Select.Option>
        {skuList
          && skuList.map(v => (
            <Select.Option key={v.sku} value={v.sku}>
              {v.sku}
            </Select.Option>
          ))}
      </Select>
      <DownLoadButton
        className={styles.queryItem}
        key="导出"
        filename="金币统计"
        columns={exportColumns}
        data={tableList}
      />
      <RadioGroup
        key="日月"
        style={{ marginBottom: 8 }}
        value={dayMonth}
        onChange={e => setDayMonth(e.target.value)}
        buttonStyle="solid"
      >
        <RadioButton key="" value="day">
          日
        </RadioButton>
        <RadioButton key="" value="month">
          月
        </RadioButton>
      </RadioGroup>
      <Tooltip
        overlayStyle={{ maxWidth: 265 }}
        overlay={
          <div>
            <span>
              数据说明：
              <br />
            </span>
            <span>
              目前仅统计SP TEMPO VIVAMINI国内安卓
              <br />
            </span>
            <span>
              新增：服务端新增
              <br />
            </span>
            <span>
              金币统计人数：auid去重
              <br />
            </span>
            <span>金币统计笔数：order_id不去重</span>
          </div>
        }
      >
        <Icon style={{ fontSize: 18, marginLeft: 8 }} type="question-circle" />
      </Tooltip>
      <Table
        dataSource={tableList}
        columns={columns}
        loading={loading}
        bordered
        pagination={{
          hideOnSinglePage: true,
          current: currentPage,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};
