/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import Query from '../components/Query';
import { getData } from '../../../../utils/request';
import { dataListSQL, dsListSQL } from '../components/sqlTemplate';
import { whereSql } from '../components/utils';
import { DownLoadButton } from '../../../common/DownLoadButton';

export default ({ product = 2 }) => {
  const [columns, setColumns] = useState([]);
  // 需要用useRef，否则表格的render方法取不到tableList的实时数据
  const lastTableListRef = useRef([]);
  const tableListRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [dsList, setDsList] = useState([]);
  const [dsColumns, setDsColumns] = useState([]);

  const [search, setSearch] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
    countryOpt: '',
    versionOpt: '=',
    userType: '',
    payWay: 'Android',
    versions: '',
    mediaSource: [],
  });

  const onSearch = (params) => {
    setSearch(params);
  };

  const getTotal = (list, field) => {
    if (Array.isArray(list)) {
      return list.reduce((pre, item) => pre + (item[field] ? Number(item[field]) : 0), 0);
    }
    return Number(list[field]);
  };

  const getLastData = (field, value) => {
    const last = lastTableListRef.current.filter(v => v[field] === value);
    if (last && last.length > 0) {
      return last[0];
    }
    return {};
  };

  const Percent = (child = 0, mom) => {
    if (!child || !mom) {
      return '0';
    }
    const rate = (100 * (child / mom)).toFixed(2);
    // if (arrowFlag) {
    //   return <span style={{ color: rate >= 0 ? 'green' : 'red' }}>{`${rate}%`}</span>;
    // }
    return rate;
  };

  const renderPercent = (num, arrowFlag = false) => {
    const rate = (Number(num)).toFixed(2);
    if (arrowFlag) {
      return <span style={{ color: rate >= 0 ? 'green' : 'red' }}>{`${rate}%`}</span>;
    }
    return <span>{`${rate}%`}</span>;
  };

  // 处理非数字
  const numHandler = (value) => {
    const num = isNaN(value);
    if (num) {
      return 0;
    }
    return value;
  };

  // const getTotal = (list, field) => list.reduce((sum, current) => sum + current[field], 0);

  // const getLastTotal = (list, field) => list.reduce((sum, current) => sum + current[field], 0);

  const width = 140;

  const androidColumns = [
    {
      title: '订阅入口',
      dataIndex: 'fvalue',
      key: '1',
      width,
      fixed: 'left',
    },
    {
      title: '总购买量',
      dataIndex: 'total_pay',
      key: '2',
      width,
    },
    {
      title: '上一阶段购买量',
      dataIndex: 'last_total_pay',
      key: '3',
      width,
    },
    {
      title: '涨跌幅（%）',
      dataIndex: 'total_pay_percent',
      key: '4',
      width,
      render: (text, record) => renderPercent(record.total_pay_percent, true),
    },
    {
      title: '自动续费量',
      dataIndex: 'sign_ply_usr_cnt',
      key: '5',
      width,
    },
    {
      title: '上一阶段自动续费量',
      dataIndex: 'last_auto_continue',
      value: '',
      key: '6',
      width,
      render: (text, record) => record.last_auto_continue,
    },
    {
      title: '涨跌幅（%）',
      dataIndex: 'auto_continue_percent',
      value: '',
      key: '7',
      width,
      render: (text, record) => renderPercent(record.auto_continue_percent, true),
    },
    {
      title: '单次购买量',
      dataIndex: 'single_ply_usr_cnt',
      value: 'single_ply_usr_cnt',
      key: '8',
      width,
    },
    {
      title: '上一阶段单次购买量',
      dataIndex: 'last_single_ply_usr_cnt',
      value: '',
      key: '9',
      width,
      render: (text, record) => record.last_single_ply_usr_cnt,
    },
    {
      title: '涨跌幅（%）',
      dataIndex: 'single_ply_usr_cnt_percent',
      value: '',
      key: '10',
      width,
      render: (text, record) => renderPercent(record.single_ply_usr_cnt_percent, true),
    },
    {
      title: '购买/展示（%）',
      dataIndex: 'buy_show',
      value: '',
      key: '11',
      width,
      render: (text, record) => renderPercent(record.buy_show),
    },
    {
      title: '上一阶段购买/展示（%）',
      dataIndex: 'last_buy_show',
      value: '',
      key: '12',
      width,
      render: (text, record) => renderPercent(record.last_buy_show),
    },
    {
      title: '涨跌幅（%）',
      dataIndex: 'last_buy_show_percent',
      value: '',
      key: '13',
      width,
      render: (text, record) => renderPercent(record.last_buy_show_percent, true),
    },
    {
      title: '占总购买占比（%）',
      dataIndex: 'buy_percent',
      value: '',
      key: '14',
      width,
      render: (text, record) => renderPercent(record.buy_percent),
    },
    {
      title: '购买页展示量',
      dataIndex: 'in_vip_usr_cnt',
      value: 'in_vip_usr_cnt',
      key: '15',
      width,
    },
    {
      title: '购买按钮点击量',
      dataIndex: 'clk_ply_usr_cnt',
      value: 'clk_ply_usr_cnt',
      key: '16',
      width,
    },
    {
      title: '购买成功量',
      dataIndex: 'buy_number',
      value: '',
      key: '17',
      width,
      render: (text, record) => record.buy_number,
    },
    {
      title: '点击/展示（%）',
      dataIndex: 'click_show',
      value: '',
      key: '18',
      width,
      render: (text, record) => renderPercent(record.click_show),
    },
    {
      title: '购买/点击（%）',
      dataIndex: 'buy_click',
      value: '',
      key: '19',
      width,
      render: (text, record) => renderPercent(record.buy_click),
    },
    {
      title: '购买/展示（%）',
      dataIndex: 'buy_show2',
      value: '',
      key: '20',
      width,
      render: (text, record) => renderPercent(record.buy_show2),
    },
    {
      title: '年包购买比重（%）',
      dataIndex: 'year_buy_percent',
      value: '',
      key: '21',
      width,
      render: (text, record) => renderPercent(record.year_buy_percent),
    },
    {
      title: '月包购买比重（%）',
      dataIndex: 'month_buy_percent',
      value: '',
      key: '22',
      width,
      render: (text, record) => renderPercent(record.month_buy_percent),
    },
    {
      title: '新用户比重（%）',
      dataIndex: 'new_user_percent',
      value: '',
      key: '23',
      width,
      render: (text, record) => renderPercent(record.new_user_percent),
    },
  ];

  const GPiOSColumns = [
    {
      title: '订阅入口',
      dataIndex: 'fvalue',
      value: 'fvalue',
      key: '24',
      width,
      fixed: 'left',
    },
    {
      title: '订阅量',
      dataIndex: 'sign_ply_usr_cnt',
      value: 'sign_ply_usr_cnt',
      key: '25',
      width,
    },
    {
      title: '上一阶段订阅量',
      dataIndex: 'last_sign_ply_usr_cnt',
      value: '',
      key: '26',
      width,
      render: (text, record) => record.last_sign_ply_usr_cnt,
    },
    {
      title: '涨跌幅（%）',
      dataIndex: 'last_sign_ply_usr_cnt_percent',
      value: '',
      key: '27',
      width,
      render: (text, record) => renderPercent(record.last_sign_ply_usr_cnt_percent, true),
    },
    {
      title: '订阅页展示量',
      dataIndex: 'in_vip_usr_cnt',
      value: 'in_vip_usr_cnt',
      key: '32',
      width,
    },
    {
      title: '订阅按钮点击量',
      dataIndex: search.payWay === 'GP' ? 'start_ply_usr_cnt' : 'clk_ply_usr_cnt',
      value: search.payWay === 'GP' ? 'start_ply_usr_cnt' : 'clk_ply_usr_cnt',
      key: '33',
      width,
    },
    {
      title: '订阅成功量',
      dataIndex: 'sign_ply_usr_cnt',
      value: 'sign_ply_usr_cnt',
      key: '34',
      width,
    },
    {
      title: '订阅/展示（%）',
      dataIndex: 'buy_show',
      value: '',
      key: '28',
      width,
      render: (text, record) => renderPercent(record.buy_show),
    },
    {
      title: '上一阶段订阅/展示（%）',
      dataIndex: 'last_buy_show',
      value: '',
      key: '29',
      width,
      render: (text, record) => renderPercent(record.last_buy_show),
    },
    {
      title: '涨跌幅（%）',
      dataIndex: 'last_buy_show_percent',
      value: '',
      key: '30',
      width,
      render: (text, record) => renderPercent(record.last_buy_show_percent, true),
    },
    {
      title: '占总订阅占比（%）',
      dataIndex: 'buy_percent',
      value: '',
      key: '31',
      width,
      render: (text, record) => renderPercent(record.buy_percent),
    },
    {
      title: '点击/展示（%）',
      dataIndex: 'click_show',
      value: '',
      key: '35',
      width,
      render: (text, record) => renderPercent(record.click_show),
    },
    {
      title: '订阅/点击（%）',
      dataIndex: 'buy_click',
      value: '',
      key: '36',
      width,
      render: (text, record) => renderPercent(record.buy_click),
    },
    {
      title: '订阅/展示（%）',
      dataIndex: 'buy_show2',
      value: '',
      key: '37',
      width,
      render: (text, record) => renderPercent(record.buy_show2),
    },
    {
      title: '年包订阅比重（%）',
      dataIndex: 'year_buy_percent',
      value: '',
      key: '38',
      width,
      render: (text, record) => renderPercent(record.year_buy_percent),
    },
    {
      title: '月包订阅比重（%）',
      dataIndex: 'month_buy_percent',
      value: '',
      key: '39',
      width,
      render: (text, record) => renderPercent(record.month_buy_percent),
    },
    {
      title: '新用户比重（%）',
      dataIndex: 'new_user_percent',
      value: '',
      key: '40',
      width,
      render: (text, record) => renderPercent(record.new_user_percent),
    },
  ];

  const androidExportColumns = [
    {
      title: '日期',
      key: 'ds',
    },
    {
      title: '订阅入口',
      key: 'fvalue',
    },
    {
      title: '总购买量',
      key: 'total_pay',
    },
    {
      title: '自动续费量',
      key: 'sign_ply_usr_cnt',
    },
    {
      title: '单次购买量',
      key: 'single_ply_usr_cnt',
    },
    {
      title: '购买/展示（%）',
      key: 'buy_show',
    },
    {
      title: '占总购买占比（%）',
      key: 'buy_percent',
    },
    {
      title: '购买页展示量',
      key: 'in_vip_usr_cnt',
    },
    {
      title: '购买按钮点击量',
      key: 'clk_ply_usr_cnt',
    },
    {
      title: '购买成功量',
      key: 'buy_number',
    },
    {
      title: '点击/展示（%）',
      key: 'click_show',
    },
    {
      title: '购买/点击（%）',
      key: 'buy_click',
    },
    {
      title: '购买/展示（%）',
      key: 'buy_show2',
    },
    {
      title: '年包购买比重（%）',
      key: 'year_buy_percent',
    },
    {
      title: '月包购买比重（%）',
      key: 'month_buy_percent',
    },
    {
      title: '新用户比重（%）',
      key: 'new_user_percent',
    },
  ];

  const GPiOSExportColumns = [
    {
      title: '日期',
      key: 'ds',
    },
    {
      title: '订阅入口',
      key: 'fvalue',
    },
    {
      title: '订阅量',
      key: 'sign_ply_usr_cnt',
    },
    {
      title: '订阅页展示量',
      key: 'in_vip_usr_cnt',
    },
    {
      title: '订阅按钮点击量',
      key: search.payWay === 'GP' ? 'start_ply_usr_cnt' : 'clk_ply_usr_cnt',
    },
    {
      title: '订阅成功量',
      key: 'sign_ply_usr_cnt',
    },
    {
      title: '订阅/展示（%）',
      key: 'buy_show',
    },
    {
      title: '占总订阅占比（%）',
      key: 'buy_percent',
    },
    {
      title: '点击/展示（%）',
      key: 'click_show',
    },
    {
      title: '订阅/点击（%）',
      key: 'buy_click',
    },
    {
      title: '订阅/展示（%）',
      key: 'buy_show2',
    },
    {
      title: '年包订阅比重（%）',
      key: 'year_buy_percent',
    },
    {
      title: '月包订阅比重（%）',
      key: 'month_buy_percent',
    },
    {
      title: '新用户比重（%）',
      key: 'new_user_percent',
    },
  ];

  const getWere = () => {
    // 动态切换表格列名
    if (search.payWay === 'Android') {
      setColumns(androidColumns);
      setDsColumns(androidExportColumns);
    } else {
      setColumns(GPiOSColumns);
      setDsColumns(GPiOSExportColumns);
    }
    const conditions = {
      ds__gte: moment(search.startDate).format('YYYYMMDD'),
      ds__lte: moment(search.endDate).format('YYYYMMDD'),
      pay_way: search.payWay,
      product_id: product,
    };

    // 判断搜索条件是等于还是不等于
    if (search.countries && search.countries.length > 0) {
      if (search.countryOpt === 'not') {
        conditions.country__notIn = search.countries;
      } else {
        conditions.country__in = search.countries;
      }
    }

    if (search.versions) {
      switch (search.versionOpt) {
        case '=':
          conditions.app_version = search.versions;
          break;
        case '!=':
          conditions.app_version__not = search.versions;
          break;
        case '>=':
          conditions.app_version__lte = search.versions;
          break;
        case '>':
          conditions.app_version__lt = search.versions;
          break;
        case '<=':
          conditions.app_version__gte = search.versions;
          break;
        case '<':
          conditions.app_version__gt = search.versions;
          break;
        default:
          conditions.app_version = search.versions;
          break;
      }
    }

    if (search.userType) {
      conditions.is_new_dvc = search.userType;
    }

    if (search.mediaSource.length > 0) {
      conditions.fvalue__in = search.mediaSource;
    }

    return conditions;
  };

  const getDataList = async () => {
    setLoading(true);
    try {
      const conditions = getWere();
      const where = whereSql(conditions);
      const diff = moment(search.endDate).diff(moment(search.startDate), 'days') + 1;
      const lastStart = moment(search.startDate).subtract(diff, 'days').format('YYYYMMDD');
      const lastEnd = moment(search.endDate).subtract(diff, 'days').format('YYYYMMDD');
      const whereLast = whereSql({
        ...conditions, ds__gte: lastStart, ds__lte: lastEnd,
      });
      const sql = dataListSQL.replace('?', where ? ` where ${where}` : '');
      const sqlLast = dataListSQL.replace('?', whereLast ? ` where ${whereLast}` : '');
      const resLast = await getData(sqlLast);// 上一阶段数据
      const res = await getData(sql);

      // 计算合计行
      const total = {};
      total.fvalue = '总数';
      const lastTotal = {};
      lastTotal.fvalue = '总数';
      ['sign_ply_usr_cnt',
        'single_ply_usr_cnt',
        'in_vip_usr_cnt',
        'clk_ply_usr_cnt',
        'month_ply_usr_cnt',
        'year_ply_usr_cnt',
        'start_ply_usr_cnt',
        'new_user_sign',
        'new_user_sing',
        'old_user_sign',
        'old_user_sing',
      ].forEach((v) => {
        total[v] = getTotal(res, v);
        lastTotal[v] = getTotal(resLast, v);
      });
      res.push(total);
      resLast.push(lastTotal);
      lastTableListRef.current = resLast;

      // 计算列
      res.forEach((record) => {
        try {
          if (search.payWay === 'Android') {
            record.total_pay = numHandler(Number(record.single_ply_usr_cnt) + Number(record.sign_ply_usr_cnt));

            const lastRecord = getLastData('fvalue', record.fvalue);
            record.last_total_pay = numHandler(Number(lastRecord.single_ply_usr_cnt) + Number(lastRecord.sign_ply_usr_cnt));

            const total = Number(record.single_ply_usr_cnt) + Number(record.sign_ply_usr_cnt);
            // const lastRecord = getLastData('fvalue', record.fvalue);
            const lastTotal = Number(lastRecord.single_ply_usr_cnt) + Number(lastRecord.sign_ply_usr_cnt);

            record.total_pay_percent = Percent(total - lastTotal, lastTotal, true);

            // const lastRecord = getLastData('fvalue', record.fvalue);
            record.last_auto_continue = lastRecord.sign_ply_usr_cnt;

            // const lastRecord = getLastData('fvalue', record.fvalue);
            record.auto_continue_percent = Percent(record.sign_ply_usr_cnt - lastRecord.sign_ply_usr_cnt, lastRecord.sign_ply_usr_cnt, true);

            // const lastRecord = getLastData('fvalue', record.fvalue);
            record.last_single_ply_usr_cnt = lastRecord.single_ply_usr_cnt;

            // const lastRecord = getLastData('fvalue', record.fvalue);
            record.single_ply_usr_cnt_percent = Percent(record.single_ply_usr_cnt - lastRecord.single_ply_usr_cnt, lastRecord.single_ply_usr_cnt, true);


            const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
            const show = record.in_vip_usr_cnt;
            record.buy_show = Percent(buy, show);

            // const lastRecord = getLastData('fvalue', record.fvalue);
            const lastBuy = lastRecord.single_ply_usr_cnt + lastRecord.sign_ply_usr_cnt;
            const lastShow = lastRecord.in_vip_usr_cnt;
            record.last_buy_show = Percent(lastBuy, lastShow);

            // const lastRecord = getLastData('fvalue', record.fvalue);
            // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
            // const show = record.in_vip_usr_cnt;
            // const lastBuy = lastRecord.single_ply_usr_cnt + lastRecord.sign_ply_usr_cnt;
            // const lastShow = lastRecord.in_vip_usr_cnt;
            record.last_buy_show_percent = Percent(buy / show - lastBuy / lastShow, lastBuy / lastShow, true);

            // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
            const totalBuy = tableListRef.current.reduce((pre, v) => ((v.fvalue === '总数') ? 0 : (pre + (v.single_ply_usr_cnt + v.sign_ply_usr_cnt))), 0);
            record.buy_percent = Percent(buy, totalBuy);


            record.buy_number = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;

            const click = record.clk_ply_usr_cnt;
            // const show = record.in_vip_usr_cnt;
            record.click_show = Percent(click, show);

            // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
            // const click = record.clk_ply_usr_cnt;
            record.buy_click = Percent(buy, click);

            // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
            // const show = record.in_vip_usr_cnt;
            record.buy_show2 = Percent(buy, show);

            const yearly = record.year_ply_usr_cnt;
            // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
            record.year_buy_percent = Percent(yearly, buy);

            const monthly = record.month_ply_usr_cnt;
            // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
            record.month_buy_percent = Percent(monthly, buy);

            record.new_user_percent = Percent(record.new_user_sign + record.new_user_sing,
              record.new_user_sign + record.new_user_sing + record.old_user_sign + record.old_user_sing);
          } else {
            // ios
            const lastRecord = getLastData('fvalue', record.fvalue);
            record.last_sign_ply_usr_cnt = lastRecord.sign_ply_usr_cnt;

            record.last_sign_ply_usr_cnt_percent = Percent(record.sign_ply_usr_cnt - lastRecord.sign_ply_usr_cnt, lastRecord.sign_ply_usr_cnt, true);

            record.buy_show = Percent(record.sign_ply_usr_cnt, record.in_vip_usr_cnt);

            record.last_buy_show = Percent(lastRecord.sign_ply_usr_cnt, lastRecord.in_vip_usr_cnt);

            // const lastRecord = getLastData('fvalue', record.fvalue);
            const current = record.sign_ply_usr_cnt / record.in_vip_usr_cnt;
            const last = lastRecord.sign_ply_usr_cnt / lastRecord.in_vip_usr_cnt;
            record.last_buy_show_percent = Percent(current - last, last, true);


            const total = tableListRef.current.reduce((pre, v) => ((v.fvalue === '总数') ? 0 : (pre + v.sign_ply_usr_cnt)), 0);
            record.buy_percent = Percent(record.sign_ply_usr_cnt, total);

            const click = record[((search.payWay === 'GP') ? 'start_ply_usr_cnt' : 'clk_ply_usr_cnt')];
            const show = record.in_vip_usr_cnt;
            record.click_show = Percent(click, show);

            const buy = record.sign_ply_usr_cnt;
            // const click = record[((search.payWay === 'GP') ? 'start_ply_usr_cnt' : 'clk_ply_usr_cnt')];
            record.buy_click = Percent(buy, click);

            // const buy = record.sign_ply_usr_cnt;
            // const show = record.in_vip_usr_cnt;
            record.buy_show2 = Percent(buy, show);

            const yearly = record.year_ply_usr_cnt;
            // const buy = record.sign_ply_usr_cnt;
            record.year_buy_percent = Percent(yearly, buy);

            const monthly = record.month_ply_usr_cnt;
            // const buy = record.sign_ply_usr_cnt;
            record.month_buy_percent = Percent(monthly, buy);

            record.new_user_percent = Percent(record.new_user_sign, record.new_user_sign + record.old_user_sign);
          }
        } catch (ex) {
          console.log(ex);
        }
      });

      if (search.payWay === 'Android') {
        tableListRef.current = res.sort((a, b) => (b.sign_ply_usr_cnt + b.single_ply_usr_cnt) - (a.sign_ply_usr_cnt + a.single_ply_usr_cnt));
      } else {
        tableListRef.current = res.sort((a, b) => b.sign_ply_usr_cnt - a.sign_ply_usr_cnt);
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  const getExportList = async () => {
    const conditions = getWere();
    const where = whereSql(conditions);
    const sql = dsListSQL.replace(/\?/g, where ? ` where ${where}` : '');
    const res = await getData(sql);

    // 计算列
    res.forEach((record) => {
      try {
        if (search.payWay === 'Android') {
          record.total_pay = numHandler(Number(record.single_ply_usr_cnt) + Number(record.sign_ply_usr_cnt));

          const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
          const show = record.in_vip_usr_cnt;
          record.buy_show = Percent(buy, show);

          // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
          const totalBuy = tableListRef.current.reduce((pre, v) => ((v.fvalue === '总数') ? 0 : (pre + (v.single_ply_usr_cnt + v.sign_ply_usr_cnt))), 0);
          record.buy_percent = Percent(buy, totalBuy);

          record.buy_number = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;

          const click = record.clk_ply_usr_cnt;
          // const show = record.in_vip_usr_cnt;
          record.click_show = Percent(click, show);

          // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
          // const click = record.clk_ply_usr_cnt;
          record.buy_click = Percent(buy, click);

          // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
          // const show = record.in_vip_usr_cnt;
          record.buy_show2 = Percent(buy, show);

          const yearly = record.year_ply_usr_cnt;
          // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
          record.year_buy_percent = Percent(yearly, buy);

          const monthly = record.month_ply_usr_cnt;
          // const buy = record.single_ply_usr_cnt + record.sign_ply_usr_cnt;
          record.month_buy_percent = Percent(monthly, buy);

          record.new_user_percent = Percent(record.new_user_sign + record.new_user_sing,
            record.new_user_sign + record.new_user_sing + record.old_user_sign + record.old_user_sing);
        } else {
          // ios
          record.buy_show = Percent(record.sign_ply_usr_cnt, record.in_vip_usr_cnt);

          const total = tableListRef.current.reduce((pre, v) => ((v.fvalue === '总数') ? 0 : (pre + v.sign_ply_usr_cnt)), 0);
          record.buy_percent = Percent(record.sign_ply_usr_cnt, total);

          const click = record[((search.payWay === 'GP') ? 'start_ply_usr_cnt' : 'clk_ply_usr_cnt')];
          const show = record.in_vip_usr_cnt;
          record.click_show = Percent(click, show);

          const buy = record.sign_ply_usr_cnt;
          // const click = record[((search.payWay === 'GP') ? 'start_ply_usr_cnt' : 'clk_ply_usr_cnt')];
          record.buy_click = Percent(buy, click);

          // const buy = record.sign_ply_usr_cnt;
          // const show = record.in_vip_usr_cnt;
          record.buy_show2 = Percent(buy, show);

          const yearly = record.year_ply_usr_cnt;
          // const buy = record.sign_ply_usr_cnt;
          record.year_buy_percent = Percent(yearly, buy);

          const monthly = record.month_ply_usr_cnt;
          // const buy = record.sign_ply_usr_cnt;
          record.month_buy_percent = Percent(monthly, buy);

          record.new_user_percent = Percent(record.new_user_sign, record.new_user_sign + record.old_user_sign);
        }
      } catch (ex) {
        console.log(ex);
      }
    });
    setDsList(res);
  };

  useEffect(() => {
    getDataList();
    getExportList();
  }, [search]);

  return (
    <div>
      <Query onSearch={onSearch} search={search} product={product} />
      <p />
      <DownLoadButton filename="按订阅入口" title="默认导出" data={tableListRef.current} columns={columns.map(v => ({
        ...v,
        key: v.dataIndex,
      }))} />
      <DownLoadButton filename="按日期" title="按日导出" data={dsList} columns={dsColumns} />
      <p />
      <Table
        dataSource={tableListRef.current}
        columns={columns}
        loading={loading}
        bordered
        scroll={{ x: 'max-content', y: 600 }} />
    </div>);
};
