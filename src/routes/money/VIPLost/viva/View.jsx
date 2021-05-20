import React, { useState, useEffect } from 'react';
import { Table, Select } from 'antd';
import moment from 'moment';
import { DownLoadButton } from '../../../common/DownLoadButton';
import Query from '../components/Query';
import { getData } from '../../../../utils/request';
import { vipListSQL, commodityListSQL } from '../components/sqlTemplate';
import { whereSql } from '../../signImport/components/utils';
import { CommodityTypeList } from '../components/constant';
import styles from '../styles/index.less';
import { filterEmptyObj } from '../../../../utils/utils';

export default ({ product = 2 }) => {
  // const [loading, setLoading] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [commdityLoading, setCommodityLoading] = useState(false);
  const [vipList, setVipList] = useState([]);
  const [commodityList, setCommodityList] = useState([]);
  const [commodityType, setCommodityType] = useState('');
  const [vipPage, setVipPage] = useState(1);
  const [commodityPage, setCommodityPage] = useState(1);

  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    countries: [''],
    platform: '',
  });

  const onSearch = (params) => {
    setSearch({
      ...params,
      commodityType,
    });
  };

  const width = 120;

  const vipColumns = [
    {
      title: '日期',
      key: 'ds',
      dataIndex: 'ds',
      width,
    },
    {
      title: '新增取消订阅人数',
      key: 'off_sub_usr_cnt_1d',
      dataIndex: 'off_sub_usr_cnt_1d',
      width,
    },
    {
      title: '新增失效会员人数',
      key: 'lose_vip_usr_cnt_1d',
      dataIndex: 'lose_vip_usr_cnt_1d',
      width,
    },
    {
      title: '累计失效会员人数',
      key: 'lose_vip_usr_cnt_std',
      dataIndex: 'lose_vip_usr_cnt_std',
      width,
    },
    {
      title: '日活',
      key: 'dau_usr_cnt_1d',
      dataIndex: 'dau_usr_cnt_1d',
      width,
    },
    {
      title: '失效会员活跃人数',
      key: 'lose_vip_dau_usr_cnt_std',
      dataIndex: 'lose_vip_dau_usr_cnt_std',
      width,
    },
    {
      title: '失效会员活跃比例(%)',
      key: 'lost_dau_rate',
      dataIndex: 'lost_dau_rate',
      width,
    },
  ];

  const commodityColumns = [
    {
      title: '日期',
      key: 'ds',
      dataIndex: 'ds',
      width,
    },
    {
      title: '失效会员再免费试用的人数',
      key: 'lose_vip_free_usr_cnt_1d',
      dataIndex: 'lose_vip_free_usr_cnt_1d',
      width,
    },
    {
      title: '失效会员再免费试用转付费的人数(7天)',
      key: 'lose_vip_free_pay_usr_cnt_1d',
      dataIndex: 'lose_vip_free_pay_usr_cnt_1d',
      width,
    },
    {
      title: '失效会员再免费试用转付费的金额(7天)',
      key: 'lose_vip_free_pay_amt_1d',
      dataIndex: 'lose_vip_free_pay_amt_1d',
      width,
    },
    {
      title: '失效会员直接购买人数',
      key: 'lose_vip_pay_usr_cnt_1d',
      dataIndex: 'lose_vip_pay_usr_cnt_1d',
      width,
    },
    {
      title: '失效会员直接购买金额',
      key: 'lose_vip_pay_amt_1d',
      dataIndex: 'lose_vip_pay_amt_1d',
      width,
    },
    {
      title: '累计失效会员再付费的人数',
      key: 'lose_vip_pay_usr_cnt_std',
      dataIndex: 'lose_vip_pay_usr_cnt_std',
      width,
    },
    {
      title: '累计失效会员再付费的金额',
      key: 'lose_vip_pay_amt_std',
      dataIndex: 'lose_vip_pay_amt_std',
      width,
    },
  ];

  const getDataList = async (dataType) => {
    try {
      const whereObj = {};
      whereObj.ds__gte = moment(search.startDate).format('YYYYMMDD');
      whereObj.ds__lte = moment(search.endDate).format('YYYYMMDD');
      let countryList = [];
      if (search.countries.length > 0) {
        // 地区列表包含全部，都按全部条件搜
        if (!search.countries.includes('')) {
          search.countries.forEach((v) => {
            if (v) {
              countryList = countryList.concat(v);
            }
          });
        }
      }
      whereObj.country_name__in = countryList.length > 0 ? countryList : undefined;
      whereObj.pay_type = search.platform;
      whereObj.product_id = product;
      let sql;
      // 商品列表需加sku条件
      if (dataType === 'commodity') {
        setCommodityLoading(true);
        whereObj.sku_type = search.commodityType;
        const where = whereSql(filterEmptyObj(whereObj));
        sql = commodityListSQL.replace('?', where ? ` where ${where}` : '');
        const res = await getData(sql);
        setCommodityList(res || []);
      }
      if (dataType === 'vip') {
        setVipLoading(true);
        const where = whereSql(filterEmptyObj(whereObj));
        sql = vipListSQL.replace('?', where ? ` where ${where}` : '');
        const res = await getData(sql);
        setVipList(res || []);
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      if (dataType === 'commodity') {
        setCommodityLoading(false);
      } else if (dataType === 'vip') {
        setVipLoading(false);
      }
    }
  };

  useEffect(() => {
    setSearch({
      ...search,
      commodityType,
    });
  }, [commodityType]);

  useEffect(() => {
    setVipPage(1);
    setCommodityPage(1);
    getDataList('vip');
    getDataList('commodity');
  }, [search]);

  return (
    <div>
      <Query onSearch={onSearch} search={search} />
      <div style={{ padding: 8 }}>
        <DownLoadButton filename="失效会员人数" data={vipList} columns={vipColumns} />
      </div>
      <Table
        dataSource={vipList}
        columns={vipColumns}
        loading={vipLoading}
        bordered
        pagination={{
          hideOnSinglePage: true,
          current: commodityPage,
          onChange: (page) => {
            setCommodityPage(page);
          },
        }}
        scroll={{ x: 'max-content' }}
      />
      <div
        style={{
          marginTop: 10,
        }}
      >
        <Select
          allowClear
          className={styles.queryItem}
          placeholder="包类型"
          value={commodityType}
          key=""
          onChange={setCommodityType}
        >
          {CommodityTypeList
            && CommodityTypeList.map(v => (
              <Select.Option key={v.key} value={v.value}>
                {v.key}
              </Select.Option>
            ))}
        </Select>
        <DownLoadButton filename="失效会员付费" data={commodityList} columns={commodityColumns} />
        <Table
          dataSource={commodityList}
          columns={commodityColumns}
          loading={commdityLoading}
          bordered
          pagination={{
            hideOnSinglePage: true,
            current: vipPage,
            onChange: (page) => {
              setVipPage(page);
            },
          }}
        />
      </div>
    </div>
  );
};
