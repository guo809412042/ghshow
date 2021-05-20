/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-31 15:16:15
 * @LastEditTime: 2020-04-02 22:59:00
 * @LastEditors: ssssslf
 */

import * as orgFunc from '../orgFunc';
import * as putFunc from '../putFunc';

// 3 非中国 10 中国 17全部
const add = (num1, num2) => Number(num1) + Number(num2);
const multip = (num1, num2) => Number(num1) * Number(num2);

// 中国自然
const getCNOrganicData = (data) => {
  const lists = [];
  for (const row of data) {
    // "首月:=K,即（续购）-自动续订-续购-月包用户初始值非首月:(上月F+上月K)*本月R"
    row.month_renewal_init_user = orgFunc.K10(row);
    row.month_first_renewal_pay = orgFunc.F10(row);
    row.month_ios = orgFunc.H10(row);
    row.year_ios = orgFunc.I10(row);
    row.sale_and = orgFunc.C10(row);
    row.sale_ios = orgFunc.D10(row);
    row.sale = Number(row.sale_and) + Number(row.sale_ios);
    lists.push(row);
  }
  return lists;
};

// 非中国自然
const getNotCNOrganicData = (data) => {
  const lists = [];
  for (const row of data) {
    // P*T
    row.year_ios = orgFunc.H3(row);
    // O*T
    row.month_ios = orgFunc.G3(row);
    // N*S
    row.year_gp = orgFunc.F3(row);
    // M*S
    row.month_gp = orgFunc.E3(row);
    // (G+K)*V+(H+L)*X
    row.sale_ios = orgFunc.D3(row);
    // (E+I)*U+(F+J)*W
    row.sale_gp = orgFunc.C3(row);
    row.sale = add(row.sale_gp, row.sale_ios);
    lists.push(row);
  }
  return lists;
};
// 非中国投放
const getNotCNPutData = (data, organicData) => {
  const lists = [];
  for (const row of data) {
    const list = organicData.filter(v => v.date_time === row.date_time);
    const org = list.length ? list[0] : {};
    row.month_first_rate_gp = putFunc.B3(org);
    row.year_first_rate_gp = putFunc.C3(org);
    row.month_first_rate_ios = putFunc.D3(org);
    row.year_first_rate_ios = putFunc.E3(org);
    // S+T = R
    row.all_new_gp = putFunc.R3(row);
    // V+W = U
    row.all_new_ios = putFunc.U3(row);
    // B*R
    row.month_gp = putFunc.F3(row, org);
    // C*R*AT
    row.year_gp = putFunc.G3(row, org);
    // D*U
    row.month_ios = putFunc.H3(row, org);
    // E*U*AT
    row.year_ios = putFunc.I3(row, org);
    row.month_renewal_gp = putFunc.N3(org);
    row.month_renewal_ios = putFunc.O3(org);
    // AL*J*Q+AQ*Q*R = AF
    row.income_month_gp = putFunc.AF3(row, org);
    // AN*K*Q+AP*Q*R = AG
    row.income_year_gp = putFunc.AG3(row, org);
    // AF+AG = AB
    row.income_gp = putFunc.AB3(row, org);

    // S*X+T*Y = AC
    row.spend_gp = putFunc.AC3(row);

    // AM*L*P+AS*P*U = AH
    row.income_month_ios = putFunc.AH3(row, org);

    // AO*M*P+AR*P*U = AI
    row.income_year_ios = putFunc.AI3(row, org);
    // AH+AI = AD
    row.income_ios = putFunc.AD3(row, org);
    // V*Z+W*AA = AE
    row.spend_ios = putFunc.AE3(row);

    // AB/R = AJ
    row.gp_arpu = putFunc.AJ3(row, org);
    // AD/U
    row.ios_arpu = putFunc.AK3(row, org);
    lists.push(row);
  }
  return lists;
};

// 中国投放
const getCNPutData = (data, organicData) => {
  const lists = [];
  for (const row of data) {
    const list = organicData.filter(v => v.date_time === row.date_time);
    const org = list.length ? list[0] : {};
    row.month_conversion_and = putFunc.B10(org);
    row.month_conversion_ios = putFunc.C10(org);
    row.year_conversion_ios = putFunc.D10(org);
    // B*S = E
    row.month_first_renewal_pay = putFunc.E10(row, org);
    // C*T = H
    row.month_first_ios = putFunc.H10(row, org);
    // D*T = I
    row.year_first_ios = putFunc.I10(row, org);

    row.month_renewal_and = putFunc.O10(org);
    row.month_order_rate_ios = putFunc.P10(org);

    // AA (S*AM*Q+J*AI)*Q+K*AG
    row.income_month_and = putFunc.AA10(row, org);

    // AB L*AH*Q+AL*Q*S
    row.income_year_and = putFunc.AB10(row, org);

    // AC AJ*N*R+AO*R*T
    row.income_month_ios = putFunc.AC10(row, org);

    //  AD AK*M*R+AN*R*T
    row.income_year_ios = putFunc.AD10(row, org);

    // W AA+AB

    row.income_and = putFunc.W10(row, org);
    // X S*U
    row.spend_and = putFunc.X10(row);

    // Y AC+AD
    row.income_ios = putFunc.Y10(row, org);

    // z T*V
    row.spend_ios = putFunc.Z10(row);

    // W/S
    row.and_arpu = putFunc.AE10(row, org);
    // Y/T
    row.ios_arpu = putFunc.AF10(row, org);

    lists.push(row);
  }
  return lists;
};

export const getDataRows = (data, country, defaultChannel, organicData) => {
  const channel = Number(defaultChannel);
  if (country === '中国') {
    if (channel === 1) {
      return getCNOrganicData(data);
    }
    if (channel === 2) {
      return getCNPutData(data, organicData);
    }
  }
  if (country !== '中国') {
    if (channel === 1) {
      return getNotCNOrganicData(data);
    }
    if (channel === 2) {
      return getNotCNPutData(data, organicData);
    }
  }
  return [];
};
