/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-03 17:47:00
 * @LastEditTime: 2020-06-02 18:14:52
 * @LastEditors: ssssslf
 */
import _ from 'lodash';
import moment from 'moment';
import * as putFunc from '../putFunc';
import * as orgFunc from '../orgFunc';
import { getNumber, getFixed } from '../../../utils/utils';
import { COUNTRY } from './const';

const add = (num1, num2) => Number(num1 || 0) + Number(num2 || 0);

// 中 自然
const CNOrgRow = (pre, row) => {
  pre.anrd_amt_total_1d += orgFunc.C10(row);
  pre.gp_amt_total_1d += orgFunc.W10(row);
  pre.ios_amt_total_1d += orgFunc.D10(row);
  pre.gp_amt_usr_cnt_1d += add(add(orgFunc.E10(row), orgFunc.F10(row)), orgFunc.G10(row));
  pre.ios_amt_usr_cnt_1d += add(orgFunc.H10(row), orgFunc.I10(row));
  pre.ios_new_month_usr_cnt_1d += orgFunc.H10(row);
  pre.ios_new_year_usr_cnt_1d += orgFunc.I10(row);
  pre.gp_new_month_usr_cnt_1d += add(orgFunc.E10(row), orgFunc.F10(row));
  pre.gp_new_year_usr_cnt_1d += orgFunc.G10(row);
  pre.ios_old_month_usr_cnt_1d += orgFunc.M10(row);
  pre.ios_old_year_usr_cnt_1d += orgFunc.N10(row);
  pre.gp_old_month_usr_cnt_1d += add(orgFunc.J10(row), orgFunc.K10(row));
  pre.gp_old_year_usr_cnt_1d += orgFunc.L10(row);
  pre.zr_gp_new_usr_cnt += orgFunc.T10(row);
  pre.zr_ios_new_usr_cnt += orgFunc.U10(row);
  pre.anrd_one_new_month_usr_cnt_1d += orgFunc.E10(row);
  pre.anrd_sub_new_month_usr_cnt_1d += orgFunc.F10(row);
  pre.anrd_one_new_year_usr_cnt_1d += orgFunc.G10(row);
  pre.anrd_one_old_month_usr_cnt_1d += orgFunc.J10(row);
  pre.anrd_sub_old_month_usr_cnt_1d += orgFunc.K10(row);
  pre.anrd_one_old_year_usr_cnt_1d += orgFunc.L10(row);
  pre.and_sub_old_month_rate = orgFunc.R10(row);
  pre.ios_sub_month_rate = orgFunc.S10(row);
  return pre;
};

// 非中自然
const NotCNOrgRow = (pre, row) => {
  pre.gp_amt_total_1d += orgFunc.C3(row);
  pre.ios_amt_total_1d += orgFunc.D3(row);
  pre.gp_amt_usr_cnt_1d += add(orgFunc.E3(row), orgFunc.F3(row));
  pre.ios_amt_usr_cnt_1d += add(orgFunc.G3(row), orgFunc.H3(row));
  pre.ios_new_month_usr_cnt_1d += orgFunc.G3(row);
  pre.ios_new_year_usr_cnt_1d += orgFunc.H3(row);
  pre.gp_new_month_usr_cnt_1d += orgFunc.E3(row);
  pre.gp_new_year_usr_cnt_1d += orgFunc.F3(row);
  pre.ios_old_month_usr_cnt_1d += orgFunc.K3(row);
  pre.ios_old_year_usr_cnt_1d += orgFunc.L3(row);
  pre.gp_old_month_usr_cnt_1d += orgFunc.I3(row);
  pre.gp_old_year_usr_cnt_1d += orgFunc.J3(row);
  pre.zr_gp_new_usr_cnt += orgFunc.S3(row);
  pre.zr_ios_new_usr_cnt += orgFunc.T3(row);
  pre.gp_sub_month_rate = orgFunc.Q10(row);
  pre.ios_sub_month_rate = orgFunc.R10(row);
  return pre;
};

// 非中投放
const notPutCnData = (pre, row, org) => {
  pre.gp_amt_total_1d += putFunc.AB3(row, org);
  pre.ios_amt_total_1d += putFunc.AD3(row, org);
  pre.gp_amt_usr_cnt_1d += add(putFunc.F3(row, org), putFunc.G3(row, org)) + add(putFunc.J3(row), putFunc.K3(row));
  pre.ios_amt_usr_cnt_1d = add(putFunc.H3(row, org), putFunc.I3(row, org)) + add(putFunc.L3(row), putFunc.M3(row));
  pre.ios_new_month_usr_cnt_1d += putFunc.H3(row, org);
  pre.ios_new_year_usr_cnt_1d += putFunc.I3(row, org);
  pre.gp_new_month_usr_cnt_1d += putFunc.F3(row, org);
  pre.gp_new_year_usr_cnt_1d += putFunc.G3(row, org);
  pre.ios_old_month_usr_cnt_1d += putFunc.L3(row);
  pre.ios_old_year_usr_cnt_1d += putFunc.M3(row);
  pre.gp_old_month_usr_cnt_1d += putFunc.J3(row);
  pre.gp_old_year_usr_cnt_1d += putFunc.K3(row);
  pre.tf_gp_new_usr_cnt += putFunc.R3(row);
  pre.tf_ios_new_usr_cnt += putFunc.U3(row);
  return pre;
};

// 中投放
const putCnData = (pre, row, org) => {
  pre.gp_amt_total_1d += putFunc.W10(row, org);
  pre.ios_amt_total_1d += putFunc.Y10(row, org);
  pre.gp_amt_usr_cnt_1d
    += add(putFunc.E10(row, org), putFunc.F10(row))
    + add(putFunc.G10(row), putFunc.J10(row))
    + add(putFunc.K10(row), putFunc.L10(row));
  pre.ios_new_month_usr_cnt_1d += putFunc.H10(row, org);
  pre.ios_new_year_usr_cnt_1d += putFunc.I10(row, org);
  pre.gp_new_month_usr_cnt_1d += add(putFunc.E10(row, org), putFunc.F10(row));
  pre.gp_new_year_usr_cnt_1d += putFunc.G10(row);
  pre.ios_old_month_usr_cnt_1d += putFunc.N10(row);
  pre.ios_old_year_usr_cnt_1d += putFunc.M10(row);
  pre.gp_old_month_usr_cnt_1d += add(putFunc.J10(row), putFunc.K10(row));
  pre.gp_old_year_usr_cnt_1d += putFunc.L10(row);
  pre.tf_gp_new_usr_cnt += putFunc.S10(row);
  pre.tf_ios_new_usr_cnt += putFunc.T10(row);
  pre.anrd_one_new_month_usr_cnt_1d += putFunc.F10(row);
  pre.anrd_sub_new_month_usr_cnt_1d += putFunc.E10(row, org);
  pre.anrd_one_new_year_usr_cnt_1d += putFunc.G10(row);
  pre.anrd_one_old_month_usr_cnt_1d += putFunc.K10(row);
  pre.anrd_sub_old_month_usr_cnt_1d += putFunc.J10(row);
  pre.anrd_one_old_year_usr_cnt_1d += putFunc.L10(row);
  return pre;
};

export const getPreData = (preRes, data) => {
  const orgData = data.filter(v => Number(v.channel) === 1);
  const putData = data.filter(v => Number(v.channel) === 2);
  for (const i of orgData) {
    if (i.country === '中国') {
      CNOrgRow(preRes, i);
    } else {
      NotCNOrgRow(preRes, i);
    }
  }
  for (const i of putData) {
    let org = data.find(v => Number(v.channel) === 1 && v.date_time === i.date_time);
    org = org || {};
    if (i.country === '中国') {
      putCnData(preRes, i, org);
    } else {
      notPutCnData(preRes, i, org);
    }
  }
  return preRes;
};

export const getRelData = (relRes, refRes, startDate, endDate, search) => {
  const dataSource = [];
  for (const i of relRes) {
    const date = Number(i.data_time);
    if (startDate <= date && date <= endDate) {
      const arr = _.clone(i);
      arr.country = COUNTRY[search.country] || '全部';
      arr.type = '真实';
      const _list = relRes.find(
        v => v.data_time
          === moment(`${date.toString()}01`)
            .subtract(1, 'month')
            .format('YYYYMM'),
      );

      const refList = refRes.find(ref => ref.data_time === i.data_time);
      arr.gp_amt_total_1d = getFixed(
        arr.anrd_amt_total_1d * 1 + arr.gp_amt_total_1d * 1 + arr.anrd_consum_amt_total_1d * 1,
      );
      if (refList) {
        arr.gp_amt_total_1d = getFixed(
          arr.gp_amt_total_1d * 1 + refList.rfd_amt_total_gp * 1 + refList.rfd_amt_total_and * 1,
        );
        arr.ios_amt_total_1d = getFixed(arr.ios_amt_total_1d + refList.rfd_amt_total_ios);
        arr.amt_total_1d = getFixed(
          arr.amt_total_1d + refList.rfd_amt_total_gp + refList.rfd_amt_total_and + refList.rfd_amt_total_ios,
        );
      }
      if (arr.country === '全部') {
        arr.gp_new_usr_cnt_1d += arr.anrd_new_usr_cnt_1d;
        arr.zr_gp_new_usr_cnt += arr.zr_and_new_usr_cnt;
        arr.tf_gp_new_usr_cnt += arr.tf_and_new_usr_cnt;
        arr.gp_amt_usr_cnt_1d += add(arr.anrd_amt_usr_cnt_1d, arr.anrd_consum_cnt_1d); // 安卓付费人数 gp+and+金币充值人数
        arr.gp_new_month_usr_cnt_1d += add(arr.anrd_one_new_month_usr_cnt_1d, arr.anrd_sub_new_month_usr_cnt_1d);
        arr.gp_new_year_usr_cnt_1d += arr.anrd_one_new_year_usr_cnt_1d;
        arr.gp_old_month_usr_cnt_1d += add(arr.anrd_one_old_month_usr_cnt_1d, arr.anrd_sub_old_month_usr_cnt_1d);
        arr.gp_old_year_usr_cnt_1d += arr.anrd_one_old_year_usr_cnt_1d;
      }
      if (_list) {
        // 续购率(本月复购人数/上个月月付费人数)
        arr.and_sub_old_month_rate = getNumber(
          i.anrd_sub_old_month_usr_cnt_1d,
          _list.anrd_one_new_month_usr_cnt_1d * 1
            + _list.anrd_sub_new_month_usr_cnt_1d * 1
            + _list.anrd_one_old_month_usr_cnt_1d * 1
            + _list.anrd_sub_old_month_usr_cnt_1d,
          false,
          4,
        );
        arr.ios_sub_month_rate = getNumber(
          i.ios_old_month_usr_cnt_1d,
          _list.ios_new_month_usr_cnt_1d * 1 + _list.ios_old_month_usr_cnt_1d * 1,
          false,
          4,
        );
        arr.gp_sub_month_rate = getNumber(
          i.gp_old_month_usr_cnt_1d,
          _list.gp_new_month_usr_cnt_1d * 1 + _list.gp_old_month_usr_cnt_1d * 1,
          false,
          4,
        );
      } else {
        arr.gp_sub_month_rate = 0;
        arr.month_order_rate_ios = 0;
      }
      if (arr.country === '中国') {
        //   arr.gp_amt_total_1d = arr.anrd_amt_total_1d;
        arr.gp_amt_usr_cnt_1d = arr.anrd_amt_usr_cnt_1d;
      }
      arr.gp_arppu = getNumber(arr.gp_amt_total_1d, arr.gp_amt_usr_cnt_1d, false);

      arr.ios_arppu = getNumber(arr.ios_amt_total_1d, arr.ios_amt_usr_cnt_1d, false);
      arr.and_month_rate = getNumber(arr.anrd_sub_new_month_usr_cnt_1d, arr.anrd_new_usr_cnt_1d, false, 4);
      arr.gp_new_month_rate = getNumber(arr.gp_new_month_usr_cnt_1d, arr.gp_new_usr_cnt_1d, false, 4);
      arr.gp_new_year_rate = getNumber(arr.gp_new_year_usr_cnt_1d, arr.gp_new_usr_cnt_1d, false, 4);
      arr.ios_new_month_rate = getNumber(arr.ios_new_month_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false, 4);
      arr.ios_new_year_rate = getNumber(arr.ios_new_year_usr_cnt_1d, arr.ios_new_usr_cnt_1d, false, 4);

      dataSource.push(arr);
    }
  }
  return dataSource;
};

const getNotCnOrgRow = (preData, orgCnRes) => {
  preData.gp_amt_total_1d = add(orgCnRes.gp_amt_total, preData.gp_amt_total_1d);
  preData.ios_amt_total_1d = add(orgCnRes.ios_amt_total, preData.ios_amt_total_1d);

  preData.gp_new_month_usr_cnt_1d = add(orgCnRes.gp_new_month, preData.gp_new_month_usr_cnt_1d);
  preData.gp_new_year_usr_cnt_1d = add(orgCnRes.gp_new_year, preData.gp_new_year_usr_cnt_1d);
  preData.ios_new_month_usr_cnt_1d = add(orgCnRes.ios_new_month, preData.ios_new_month_usr_cnt_1d);
  preData.ios_new_year_usr_cnt_1d = add(orgCnRes.ios_new_year, preData.ios_new_year_usr_cnt_1d);

  preData.gp_old_month_usr_cnt_1d = add(orgCnRes.gp_old_month, preData.gp_old_month_usr_cnt_1d);
  preData.gp_old_year_usr_cnt_1d = add(orgCnRes.gp_old_year, preData.gp_old_year_usr_cnt_1d);
  preData.ios_old_month_usr_cnt_1d = add(orgCnRes.ios_old_month, preData.ios_old_month_usr_cnt_1d);
  preData.ios_old_year_usr_cnt_1d = add(orgCnRes.ios_old_year, preData.ios_old_year_usr_cnt_1d);
  preData.gp_amt_usr_cnt_1d = (preData.gp_amt_usr_cnt_1d || 0) * 1
    + orgCnRes.gp_new_month * 1
    + orgCnRes.gp_new_year * 1
    + orgCnRes.gp_old_month * 1
    + orgCnRes.gp_old_year * 1;
  preData.ios_amt_usr_cnt_1d = (preData.ios_amt_usr_cnt_1d || 0) * 1
    + orgCnRes.ios_new_month * 1
    + orgCnRes.ios_new_year * 1
    + orgCnRes.ios_old_month * 1
    + orgCnRes.ios_old_year * 1;
  preData.gp_sub_month_rate = orgCnRes.gp_sub_month_rate;
  preData.ios_sub_month_rate = orgCnRes.ios_sub_month_rate;
  preData.zr_gp_new_usr_cnt = add(orgCnRes.zr_gp_new, preData.zr_gp_new_usr_cnt);
  preData.zr_ios_new_usr_cnt = add(orgCnRes.zr_ios_new, preData.zr_ios_new_usr_cnt);
  return preData;
};
const getNotCnPutRow = (preData, cnPutData) => {
  preData.gp_amt_total_1d = add(preData.gp_amt_total_1d, cnPutData.gp_income);
  preData.ios_amt_total_1d = add(preData.ios_amt_total_1d, cnPutData.ios_income);

  preData.gp_new_month_usr_cnt_1d = add(preData.gp_new_month_usr_cnt_1d, cnPutData.gp_new_month_usr_cnt_1d);
  preData.gp_new_year_usr_cnt_1d = add(preData.gp_new_year_usr_cnt_1d, cnPutData.gp_new_year_usr_cnt_1d);
  preData.ios_new_month_usr_cnt_1d = add(preData.ios_new_month_usr_cnt_1d, cnPutData.ios_new_month_usr_cnt_1d);
  preData.ios_new_year_usr_cnt_1d = add(preData.ios_new_year_usr_cnt_1d, cnPutData.ios_new_year_usr_cnt_1d);

  preData.gp_old_month_usr_cnt_1d = add(preData.gp_old_month_usr_cnt_1d, cnPutData.gp_old_month_usr_cnt_1d);
  preData.gp_old_year_usr_cnt_1d = add(preData.gp_old_year_usr_cnt_1d, cnPutData.gp_old_year_usr_cnt_1d);
  preData.ios_old_month_usr_cnt_1d = add(preData.ios_old_month_usr_cnt_1d, cnPutData.ios_old_month_usr_cnt_1d);
  preData.ios_old_year_usr_cnt_1d = add(preData.ios_old_year_usr_cnt_1d, cnPutData.ios_old_year_usr_cnt_1d);
  preData.gp_amt_usr_cnt_1d = (preData.gp_amt_usr_cnt_1d || 0)
    + cnPutData.gp_new_month_usr_cnt_1d * 1
    + cnPutData.gp_new_year_usr_cnt_1d * 1
    + cnPutData.gp_old_month_usr_cnt_1d * 1
    + cnPutData.gp_old_year_usr_cnt_1d * 1;
  preData.ios_amt_usr_cnt_1d = (preData.ios_amt_usr_cnt_1d || 0)
    + cnPutData.ios_new_month_usr_cnt_1d * 1
    + cnPutData.ios_new_year_usr_cnt_1d * 1
    + cnPutData.ios_old_month_usr_cnt_1d * 1
    + cnPutData.ios_old_year_usr_cnt_1d * 1;
  preData.tf_gp_new_usr_cnt = add(cnPutData.gp_new_usr_cnt_1d, preData.tf_gp_new_usr_cnt);
  preData.tf_ios_new_usr_cnt = add(cnPutData.ios_new_usr_cnt_1d, preData.tf_ios_new_usr_cnt);
  return preData;
};

export const getNotCnPreData = (preData, orgCnRes, cnPutData) => {
  preData = getNotCnOrgRow(preData, orgCnRes);
  preData = getNotCnPutRow(preData, cnPutData);
  preData.amt_total_1d = add(preData.gp_amt_total_1d, preData.ios_amt_total_1d);
  preData.ios_new_usr_cnt_1d = add(preData.zr_ios_new_usr_cnt, preData.tf_ios_new_usr_cnt);
  preData.gp_new_usr_cnt_1d = add(preData.tf_gp_new_usr_cnt, preData.zr_gp_new_usr_cnt);
  preData.gp_new_month_rate = getNumber(preData.gp_new_month_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
  preData.gp_new_year_rate = getNumber(preData.gp_new_year_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
  preData.ios_new_month_rate = getNumber(preData.ios_new_month_usr_cnt_1d, preData.ios_new_usr_cnt_1d, false, 4);
  preData.ios_new_year_rate = getNumber(preData.ios_new_year_usr_cnt_1d, preData.ios_new_usr_cnt_1d, false, 4);
  preData.gp_arppu = getNumber(preData.gp_amt_total_1d, preData.gp_amt_usr_cnt_1d, false);
  preData.ios_arppu = getNumber(preData.ios_amt_total_1d, preData.ios_amt_usr_cnt_1d, false);
  return preData;
};

export const getCnPreData = (preData, orgCnRes, putCnRes) => {
  preData.gp_amt_total_1d = add(orgCnRes.and_amt_total, putCnRes.and_income);
  preData.ios_amt_total_1d = add(orgCnRes.ios_amt_total, putCnRes.ios_income);
  preData.amt_total_1d = add(preData.gp_amt_total_1d, preData.ios_amt_total_1d);
  preData.anrd_one_new_month_usr_cnt_1d = add(orgCnRes.anrd_one_new_month, putCnRes.anrd_one_new_month_usr_cnt_1d);
  preData.anrd_sub_new_month_usr_cnt_1d = add(orgCnRes.anrd_sub_new_month, putCnRes.anrd_sub_new_month_usr_cnt_1d);

  preData.gp_amt_usr_cnt_1d = orgCnRes.anrd_one_new_month * 1
    + orgCnRes.anrd_sub_new_month * 1
    + orgCnRes.anrd_one_new_year * 1
    + orgCnRes.anrd_one_old_month * 1
    + orgCnRes.anrd_sub_old_month * 1
    + orgCnRes.anrd_one_old_year * 1
    + putCnRes.anrd_sub_new_month_usr_cnt_1d * 1
    + putCnRes.anrd_one_new_month_usr_cnt_1d * 1
    + putCnRes.anrd_one_new_year_usr_cnt_1d * 1
    + putCnRes.anrd_sub_old_month_usr_cnt_1d * 1
    + putCnRes.anrd_one_old_month_usr_cnt_1d * 1
    + putCnRes.anrd_one_old_year_usr_cnt_1d * 1;
  preData.ios_amt_usr_cnt_1d = orgCnRes.ios_new_month * 1
    + orgCnRes.ios_new_year * 1
    + orgCnRes.ios_old_month * 1
    + orgCnRes.ios_old_year * 1
    + putCnRes.ios_new_month_usr_cnt_1d * 1
    + putCnRes.ios_old_month_usr_cnt_1d * 1
    + putCnRes.ios_old_year_usr_cnt_1d * 1
    + putCnRes.ios_new_year_usr_cnt_1d * 1;
  preData.gp_arppu = getNumber(preData.gp_amt_total_1d, preData.gp_amt_usr_cnt_1d, false);
  preData.ios_arppu = getNumber(preData.ios_amt_total_1d, preData.ios_amt_usr_cnt_1d, false);

  preData.anrd_one_new_year_usr_cnt_1d = add(orgCnRes.anrd_one_new_year, putCnRes.anrd_one_new_year_usr_cnt_1d);

  preData.ios_new_month_usr_cnt_1d = add(orgCnRes.ios_new_month, putCnRes.ios_new_month_usr_cnt_1d);
  preData.ios_new_year_usr_cnt_1d = add(orgCnRes.ios_new_year, putCnRes.ios_new_year_usr_cnt_1d);
  preData.anrd_one_old_month_usr_cnt_1d = add(orgCnRes.anrd_one_old_month, putCnRes.anrd_one_old_month_usr_cnt_1d);
  preData.anrd_sub_old_month_usr_cnt_1d = add(orgCnRes.anrd_sub_old_month, putCnRes.anrd_sub_old_month_usr_cnt_1d);
  preData.anrd_one_old_year_usr_cnt_1d = add(orgCnRes.anrd_one_old_year, putCnRes.anrd_one_old_year_usr_cnt_1d);
  preData.ios_old_month_usr_cnt_1d = add(orgCnRes.ios_old_month, putCnRes.ios_old_month_usr_cnt_1d);
  preData.ios_old_year_usr_cnt_1d = add(orgCnRes.ios_old_year, putCnRes.ios_old_year_usr_cnt_1d);
  preData.zr_and_new_usr_cnt = orgCnRes.zr_and_new_usr;
  preData.zr_gp_new_usr_cnt = orgCnRes.zr_and_new_usr;
  preData.zr_ios_new_usr_cnt = orgCnRes.zr_ios_new_usr;
  preData.tf_and_new_usr_cnt = putCnRes.anrd_new_usr_cnt_1d;
  preData.tf_gp_new_usr_cnt = putCnRes.anrd_new_usr_cnt_1d;
  preData.tf_ios_new_usr_cnt = putCnRes.ios_new_usr_cnt_1d;
  preData.anrd_new_usr_cnt_1d = add(preData.zr_and_new_usr_cnt, preData.tf_and_new_usr_cnt);
  preData.ios_new_usr_cnt_1d = add(preData.zr_ios_new_usr_cnt, preData.tf_ios_new_usr_cnt);
  preData.and_sub_old_month_rate = orgCnRes.and_sub_old_month_rate;
  preData.ios_sub_month_rate = orgCnRes.ios_sub_month_rate;
  preData.and_month_rate = orgCnRes.and_month_rate;
  preData.ios_new_month_rate = orgCnRes.ios_new_month_rate;
  preData.ios_new_year_rate = orgCnRes.ios_new_year_rate;

  preData.gp_new_month_usr_cnt_1d = orgCnRes.anrd_one_new_month * 1
    + putCnRes.anrd_one_new_month_usr_cnt_1d * 1
    + orgCnRes.anrd_sub_new_month * 1
    + putCnRes.anrd_sub_new_month_usr_cnt_1d * 1;

  preData.gp_new_year_usr_cnt_1d = orgCnRes.anrd_one_new_year * 1 + putCnRes.anrd_one_new_year_usr_cnt_1d * 1;

  preData.gp_old_month_usr_cnt_1d = orgCnRes.anrd_one_old_month * 1
    + orgCnRes.anrd_sub_old_month * 1
    + putCnRes.anrd_sub_old_month_usr_cnt_1d * 1
    + putCnRes.anrd_one_old_month_usr_cnt_1d * 1;

  preData.gp_old_year_usr_cnt_1d = putCnRes.anrd_one_old_year_usr_cnt_1d * 1 + orgCnRes.anrd_one_old_year * 1;
  return preData;
};

export const getAllPreData = (preData, orgCnData, putCnData, orgNotCnData, putNotCnData) => {
  preData = getCnPreData(preData, orgCnData, putCnData);

  for (const i of orgNotCnData) {
    getNotCnOrgRow(preData, i);
  }
  for (const i of putNotCnData) {
    getNotCnPutRow(preData, i);
  }
  preData.amt_total_1d = add(preData.gp_amt_total_1d, preData.ios_amt_total_1d);
  preData.gp_new_usr_cnt_1d = add(preData.zr_gp_new_usr_cnt, preData.tf_gp_new_usr_cnt);
  preData.ios_new_usr_cnt_1d = add(preData.zr_ios_new_usr_cnt, preData.tf_ios_new_usr_cnt);
  preData.gp_new_month_rate = getNumber(preData.gp_new_month_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
  preData.gp_new_year_rate = getNumber(preData.gp_new_year_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
  preData.ios_new_month_rate = getNumber(preData.ios_new_month_usr_cnt_1d, preData.ios_new_usr_cnt_1d, false, 4);
  preData.ios_new_year_rate = getNumber(preData.ios_new_year_usr_cnt_1d, preData.ios_new_usr_cnt_1d, false, 4);
  preData.gp_arppu = getNumber(preData.gp_amt_total_1d, preData.gp_amt_usr_cnt_1d, false);
  preData.ios_arppu = getNumber(preData.ios_amt_total_1d, preData.ios_amt_usr_cnt_1d, false);
  return preData;
};
