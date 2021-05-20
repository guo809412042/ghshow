/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-02 17:27:14
 * @LastEditTime: 2020-05-08 15:06:55
 * @LastEditors: ssssslf
 */
import * as putFunc from '../putFunc';
import * as orgFunc from '../orgFunc';
import { getNumber, getFixed } from '../../../utils/utils';

const add = (num1, num2) => Number(num1) + Number(num2);

export const getPutCnData = (preData, putCnData) => {
  preData.gp_amt_total_1d = putCnData.and_income;
  preData.ios_amt_total_1d = putCnData.ios_income;
  preData.anrd_amt_total_1d = putCnData.and_income;
  preData.gp_amt_usr_cnt_1d = putCnData.anrd_new_usr_cnt_1d * 1;
  preData.ios_amt_usr_cnt_1d = putCnData.ios_new_usr_cnt_1d * 1;
  preData.ios_new_month_usr_cnt_1d = putCnData.ios_new_month_usr_cnt_1d;
  preData.ios_new_year_usr_cnt_1d = putCnData.ios_new_year_usr_cnt_1d;
  preData.gp_new_month_usr_cnt_1d = putCnData.anrd_sub_new_month_usr_cnt_1d * 1 + putCnData.anrd_one_new_month_usr_cnt_1d * 1;
  preData.gp_new_year_usr_cnt_1d = putCnData.anrd_one_new_year_usr_cnt_1d * 1;
  preData.gp_old_month_usr_cnt_1d = putCnData.anrd_sub_old_month_usr_cnt_1d * 1 + putCnData.anrd_one_old_month_usr_cnt_1d * 1;
  preData.gp_old_year_usr_cnt_1d = putCnData.anrd_one_old_year_usr_cnt_1d * 1;
  preData.tf_gp_new_usr_cnt = putCnData.anrd_new_usr_cnt_1d;
  preData.tf_ios_new_usr_cnt = putCnData.ios_new_usr_cnt_1d;
  preData.ios_old_year_usr_cnt_1d = putCnData.ios_old_year_usr_cnt_1d;
  preData.ios_old_month_usr_cnt_1d = putCnData.ios_old_month_usr_cnt_1d;
  preData.anrd_one_new_month_usr_cnt_1d = putCnData.anrd_one_new_month_usr_cnt_1d;
  preData.anrd_sub_new_month_usr_cnt_1d = putCnData.anrd_sub_new_month_usr_cnt_1d;
  preData.anrd_one_new_year_usr_cnt_1d = putCnData.anrd_one_new_year_usr_cnt_1d;
  preData.anrd_one_old_month_usr_cnt_1d = putCnData.anrd_one_old_month_usr_cnt_1d;
  preData.anrd_sub_old_month_usr_cnt_1d = putCnData.anrd_sub_old_month_usr_cnt_1d;
  preData.anrd_one_old_year_usr_cnt_1d = putCnData.anrd_one_old_year_usr_cnt_1d;
  preData.tf_and_new_usr_cnt = putCnData.anrd_new_usr_cnt_1d;
  preData.anrd_new_usr_cnt_1d = preData.tf_and_new_usr_cnt;
  preData.ios_new_usr_cnt_1d = preData.tf_ios_new_usr_cnt;
  preData.anrd_cost_total_1d = putCnData.and_cost;
  preData.ios_cost_total_1d = putCnData.ios_cost;
  preData.anrd_month_amt_total_1d = putCnData.and_month_income;
  preData.ios_month_amt_total_1d = putCnData.ios_month_income;
  preData.and_amt_new_user_rate = putCnData.and_month_rate;
  preData.anrd_year_amt_total_1d = putCnData.and_year_income;
  preData.ios_year_amt_total_1d = putCnData.ios_year_income;
  preData.and_sub_old_month_rate = putCnData.and_sub_old_month_rate;
  preData.ios_sub_month_rate = putCnData.ios_sub_month_rate;
  preData.anrd_arpu = putCnData.and_arpu;
  preData.ios_arpu = putCnData.ios_arpu;
  return preData;
};

export const getNotPutCnData = (preData, cnPutData) => {
  preData.gp_amt_total_1d = cnPutData.gp_income;
  preData.ios_amt_total_1d = cnPutData.ios_income;
  preData.amt_total_1d = add(preData.gp_amt_total_1d, preData.ios_amt_total_1d);

  preData.gp_new_month_usr_cnt_1d = cnPutData.gp_new_month_usr_cnt_1d;
  preData.gp_new_year_usr_cnt_1d = cnPutData.gp_new_year_usr_cnt_1d;
  preData.ios_new_month_usr_cnt_1d = cnPutData.ios_new_month_usr_cnt_1d;
  preData.ios_new_year_usr_cnt_1d = cnPutData.ios_new_year_usr_cnt_1d;

  preData.gp_old_month_usr_cnt_1d = cnPutData.gp_old_month_usr_cnt_1d;
  preData.gp_old_year_usr_cnt_1d = cnPutData.gp_old_year_usr_cnt_1d;
  preData.ios_old_month_usr_cnt_1d = cnPutData.ios_old_month_usr_cnt_1d;
  preData.ios_old_year_usr_cnt_1d = cnPutData.ios_old_year_usr_cnt_1d;
  preData.tf_gp_new_usr_cnt = cnPutData.gp_new_usr_cnt_1d;
  preData.tf_ios_new_usr_cnt = cnPutData.ios_new_usr_cnt_1d;
  preData.ios_new_usr_cnt_1d = preData.tf_ios_new_usr_cnt;
  preData.gp_new_usr_cnt_1d = preData.tf_gp_new_usr_cnt;
  preData.gp_sub_month_rate = cnPutData.gp_sub_month_rate;
  preData.ios_sub_month_rate = cnPutData.ios_sub_month_rate;
  preData.gp_cost_total_1d = cnPutData.gp_cost;
  preData.ios_cost_total_1d = cnPutData.ios_cost;
  preData.gp_month_amt_total_1d = cnPutData.gp_month_income;
  preData.gp_year_amt_total_1d = cnPutData.gp_year_income;
  preData.ios_month_amt_total_1d = cnPutData.ios_month_income;
  preData.ios_year_amt_total_1d = cnPutData.ios_year_income;
  preData.gp_arpu = cnPutData.gp_arpu;
  preData.ios_arpu = cnPutData.ios_arpu;
  return preData;
};

export const getAllData = (preData, putCn, putNotCn) => {
  preData.gp_amt_total_1d = putCn.and_income;
  preData.ios_amt_total_1d = putCn.ios_income;

  preData.gp_amt_usr_cnt_1d = putCn.anrd_sub_new_month_usr_cnt_1d * 1
    + putCn.anrd_one_new_month_usr_cnt_1d * 1
    + putCn.anrd_one_new_year_usr_cnt_1d * 1
    + putCn.anrd_sub_old_month_usr_cnt_1d * 1
    + putCn.anrd_one_old_month_usr_cnt_1d * 1
    + putCn.anrd_one_old_year_usr_cnt_1d * 1;

  preData.ios_amt_usr_cnt_1d = putCn.ios_new_month_usr_cnt_1d * 1
    + putCn.ios_new_year_usr_cnt_1d * 1
    + putCn.ios_old_month_usr_cnt_1d * 1
    + putCn.ios_old_year_usr_cnt_1d * 1;

  preData.ios_new_month_usr_cnt_1d = putCn.ios_new_month_usr_cnt_1d;
  preData.ios_new_year_usr_cnt_1d = putCn.ios_new_year_usr_cnt_1d;
  preData.gp_new_month_usr_cnt_1d = putCn.anrd_sub_new_month_usr_cnt_1d * 1 + putCn.anrd_one_new_month_usr_cnt_1d * 1;
  preData.gp_new_year_usr_cnt_1d = putCn.anrd_one_new_year_usr_cnt_1d * 1;

  preData.gp_old_month_usr_cnt_1d = putCn.anrd_sub_old_month_usr_cnt_1d * 1 + putCn.anrd_one_old_month_usr_cnt_1d * 1;
  preData.gp_old_year_usr_cnt_1d = putCn.anrd_one_old_year_usr_cnt_1d * 1;

  preData.tf_gp_new_usr_cnt = putCn.anrd_new_usr_cnt_1d;
  preData.tf_ios_new_usr_cnt = putCn.ios_new_usr_cnt_1d;
  preData.ios_old_year_usr_cnt_1d = putCn.ios_old_year_usr_cnt_1d;
  preData.ios_old_month_usr_cnt_1d = putCn.ios_old_month_usr_cnt_1d;
  for (const i of putNotCn) {
    preData.gp_amt_total_1d = add(preData.gp_amt_total_1d, i.gp_income);
    preData.ios_amt_total_1d = add(preData.ios_amt_total_1d, i.ios_income);

    preData.gp_amt_usr_cnt_1d = preData.gp_amt_usr_cnt_1d * 1
      + i.gp_new_month_usr_cnt_1d * 1
      + i.gp_new_year_usr_cnt_1d * 1
      + i.gp_old_month_usr_cnt_1d * 1
      + i.gp_old_year_usr_cnt_1d * 1;

    preData.ios_amt_usr_cnt_1d = preData.ios_amt_usr_cnt_1d * 1
      + i.ios_new_month_usr_cnt_1d * 1
      + i.ios_new_year_usr_cnt_1d * 1
      + i.ios_old_month_usr_cnt_1d * 1
      + i.ios_old_year_usr_cnt_1d * 1;

    preData.ios_new_month_usr_cnt_1d = add(preData.ios_new_month_usr_cnt_1d, i.ios_new_month_usr_cnt_1d);
    preData.ios_new_year_usr_cnt_1d = add(preData.ios_new_year_usr_cnt_1d, i.ios_new_year_usr_cnt_1d);
    preData.gp_new_month_usr_cnt_1d = add(preData.gp_new_month_usr_cnt_1d, i.gp_new_month_usr_cnt_1d);
    preData.gp_new_year_usr_cnt_1d = add(preData.gp_new_year_usr_cnt_1d, i.gp_new_year_usr_cnt_1d);
    preData.ios_old_month_usr_cnt_1d = add(preData.ios_old_month_usr_cnt_1d, i.ios_old_month_usr_cnt_1d);
    preData.ios_old_year_usr_cnt_1d = add(preData.ios_old_year_usr_cnt_1d, i.ios_old_year_usr_cnt_1d);
    preData.gp_old_month_usr_cnt_1d = add(preData.gp_old_month_usr_cnt_1d, i.gp_old_month_usr_cnt_1d);
    preData.gp_old_year_usr_cnt_1d = add(preData.gp_old_year_usr_cnt_1d, i.gp_old_year_usr_cnt_1d);
    preData.tf_gp_new_usr_cnt = add(preData.tf_gp_new_usr_cnt, i.gp_new_usr_cnt_1d);
    preData.tf_ios_new_usr_cnt = add(preData.tf_ios_new_usr_cnt, i.ios_new_usr_cnt_1d);
  }
  preData.amt_total_1d = add(preData.gp_amt_total_1d, preData.ios_amt_total_1d);
  preData.gp_new_usr_cnt_1d = preData.tf_gp_new_usr_cnt;
  preData.ios_new_usr_cnt_1d = preData.tf_ios_new_usr_cnt;
  preData.gp_new_month_rate = getNumber(preData.gp_new_month_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
  preData.gp_new_year_rate = getNumber(preData.gp_new_year_usr_cnt_1d, preData.gp_new_usr_cnt_1d, false, 4);
  preData.ios_new_month_rate = getNumber(preData.ios_new_month_usr_cnt_1d, preData.ios_new_usr_cnt_1d, false, 4);
  preData.ios_new_year_rate = getNumber(preData.ios_new_year_usr_cnt_1d, preData.ios_new_usr_cnt_1d, false, 4);
  preData.gp_arppu = getNumber(preData.gp_amt_total_1d, preData.gp_amt_usr_cnt_1d, false);
  preData.ios_arppu = getNumber(preData.ios_amt_total_1d, preData.ios_amt_usr_cnt_1d, false);
  return preData;
};
