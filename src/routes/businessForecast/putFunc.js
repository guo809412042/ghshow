/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-02 11:30:22
 * @LastEditTime: 2020-04-02 19:39:06
 * @LastEditors: ssssslf
 */
import * as orgFunc from './orgFunc';
import { getNumber } from '../../utils/utils';

const add = (num1, num2) => Number(num1) + Number(num2);
const multip = (num1, num2) => Number(num1) * Number(num2);
export const B10 = org => orgFunc.O10(org);
export const C10 = org => orgFunc.P10(org);
export const D10 = org => orgFunc.Q10(org);
export const F10 = row => row.month_first;
export const G10 = row => row.year_first;
export const J10 = row => row.month_init_and;
export const K10 = row => row.month_renewal;
export const L10 = row => row.year_renewal;
export const N10 = row => row.month_init_ios;
export const M10 = row => row.year_renewal_ios;
export const O10 = org => orgFunc.R10(org);
export const P10 = org => orgFunc.S10(org);
export const Q10 = row => row.put_organic_arpu_gp;
export const R10 = row => row.put_organic_arpu_ios;
export const S10 = row => row.all_new_and;
export const T10 = row => row.all_new_ios;
export const U10 = row => row.cpa_and;
export const V10 = row => row.cpa_ios;
export const AG10 = org => orgFunc.V10(org);
export const AH10 = org => orgFunc.W10(org);
export const AI10 = org => orgFunc.X10(org);
export const AJ10 = org => orgFunc.Y10(org);
export const AK10 = org => orgFunc.Z10(org);
export const AT10 = row => row.calculation_first_purchase;
// "【中国自然预测配置】（首购-单次购买）-首购年包*【中国自然预测配置】（单价）-单次购买-年单价-安卓/【中国自然预测配置】（新增）-月新增-安卓"
export const AL10 = org => getNumber(multip(orgFunc.G10(org), orgFunc.W10(org)), orgFunc.T10(org), false);
// "（【中国自然预测配置】（首购-单次购买）-首购月包*【中国自然预测配置】（单价）-单次购买-月单价-安卓+「自然渠道」-自动续订-首购-月包*【中国自然预测配置】（单价）-月自动续订-月单价-安卓）/【中国自然预测配置】（新增）-月新增-安卓"
export const AM10 = org => getNumber(
  add(multip(orgFunc.E10(org), orgFunc.V10(org)), multip(orgFunc.F10(org), orgFunc.X10(org))),
  orgFunc.T10(org),
  false,
);

// 「中国自然渠道」-首购（新增）-iOS年包*【中国自然预测配置】（单价）-年单价-IOS/【自然预测配置】（新增）-月新增-iOS
export const AN10 = org => getNumber(multip(orgFunc.I10(org), orgFunc.Z10(org)), orgFunc.U10(org), false);

// 「中国自然渠道」-首购（新增）-iOS月包*【中国自然预测配置】（单价）-月单价-IOS/【自然预测配置】（新增）-月新增-iOS
export const AO10 = org => getNumber(multip(orgFunc.H10(org), orgFunc.Y10(org)), orgFunc.U10(org), false);

// (S*AM*Q+J*AI)*Q+K*AG
export const AA10 = (row, org) => add(
  multip(add(multip(S10(row), AM10(org)) * Q10(row), multip(J10(row), AI10(org))), Q10(row)),
  multip(K10(row), AG10(org)),
);
// L*AH*Q+AL*Q*S
export const AB10 = (row, org) => add(multip(L10(row), AH10(org), Q10(row)), multip(AL10(org), Q10(row)) * S10(row));
// AA+AB
export const W10 = (row, org) => add(AA10(row, org), AB10(row, org));
// AJ*N*R+AO*R*T
export const AC10 = (row, org) => add(multip(AJ10(org), N10(row)) * R10(row), multip(AO10(org), R10(row)) * T10(row));
// AK*M*R+AN*R*T
export const AD10 = (row, org) => add(multip(AK10(org), M10(row)) * R10(row), multip(AN10(org), R10(row)) * T10(row));
// W/S
export const AE10 = (row, org) => getNumber(W10(row, org), S10(row), false);
export const Y10 = (row, org) => add(AC10(row, org), AD10(row, org));
// Y/T
export const AF10 = (row, org) => getNumber(Y10(row, org), T10(row), false);
// T*V
export const Z10 = row => multip(T10(row), V10(row));
// S*U
export const X10 = row => multip(S10(row), U10(row));
// B*S
export const E10 = (row, org) => multip(B10(org), S10(row));
// C*T
export const H10 = (row, org) => multip(C10(org), T10(row));
// D*T
export const I10 = (row, org) => multip(D10(org), T10(row));

export const B3 = org => orgFunc.M3(org);
export const C3 = org => orgFunc.N3(org);
export const D3 = org => orgFunc.O3(org);
export const E3 = org => orgFunc.P3(org);
export const J3 = row => row.month_init_gp;
export const K3 = row => row.year_renewal_gp;
export const L3 = row => row.month_init_ios;
export const M3 = row => row.year_renewal_ios;
export const N3 = org => orgFunc.Q3(org);
export const O3 = org => orgFunc.R3(org);
export const P3 = row => row.put_organic_arpu_ios;
export const Q3 = row => row.put_organic_arpu_gp;
export const S3 = row => row.search_new_gp;
export const T3 = row => row.other_new_gp;
export const V3 = row => row.search_new_ios;
export const W3 = row => row.other_new_ios;
export const X3 = row => row.search_gp;
export const Y3 = row => row.other_gp;
export const Z3 = row => row.search_ios;
export const AA3 = row => row.other_ios;
export const AL3 = org => orgFunc.U3(org);
export const AM3 = org => orgFunc.V3(org);
export const AN3 = org => orgFunc.W3(org);
export const AO3 = org => orgFunc.X3(org);
export const AT3 = row => row.calculation_first_purchase;

// 「自然渠道」-首购（新增）-GP年包*【自然预测配置】（单价）-年单价-GP/【自然预测配置】（新增）-月新增-GP
export const AP3 = org => getNumber(multip(orgFunc.F3(org), orgFunc.W3(org)), orgFunc.S3(org), false);

// 「自然渠道」-首购（新增）-GP月包*【自然预测配置】（单价）-月单价-GP/【自然预测配置】（新增）-月新增-GP
export const AQ3 = org => getNumber(multip(orgFunc.E3(org), orgFunc.U3(org)), orgFunc.S3(org), false);

// 「自然渠道」-首购（新增）-iOS年包*【自然预测配置】（单价）-年单价-iOS/【自然预测配置】（新增）-月新增-iOS
export const AR3 = org => getNumber(multip(orgFunc.H3(org), orgFunc.X3(org)), orgFunc.T3(org), false);

// 「自然渠道」-首购（新增）-iOS月包*【自然预测配置】（单价）-月单价-iOS/【自然预测配置】（新增）-月新增-iOS
export const AS3 = org => getNumber(multip(orgFunc.G3(org), orgFunc.V3(org)), orgFunc.T3(org), false);

export const R3 = row => add(S3(row), T3(row));
export const U3 = row => add(V3(row), W3(row));

// AL*J*Q+AQ*Q*R
export const AF3 = (row, org) => add(multip(AL3(org), J3(row)) * Q3(row), multip(AQ3(org), Q3(row)) * R3(row));
// AN*K*Q+AP*Q*R
export const AG3 = (row, org) => add(multip(AN3(org), K3(row)) * Q3(row), multip(AP3(org), Q3(row)) * R3(row));
// AM*L*P+AS*P*U
export const AH3 = (row, org) => add(multip(AM3(org), L3(row)) * P3(row), multip(AS3(org), P3(row)) * U3(row));
// AO*M*P+AR*P*U
export const AI3 = (row, org) => add(multip(AO3(org), M3(row)) * P3(row), multip(AR3(org), P3(row)) * U3(row));
// AH+AI
export const AD3 = (row, org) => add(AH3(row, org), AI3(row, org));
// AF+AG
export const AB3 = (row, org) => add(AF3(row, org), AG3(row, org));
// AB/R
export const AJ3 = (row, org) => getNumber(AB3(row, org), R3(row), false);
// AD/U
export const AK3 = (row, org) => getNumber(AD3(row, org), U3(row), false);
// S*X+T*Y
export const AC3 = row => add(multip(S3(row), X3(row)), multip(T3(row), Y3(row)));
// V*Z+W*AA
export const AE3 = row => add(multip(V3(row), Z3(row)), multip(W3(row), AA3(row)));
// E*U*AT
export const I3 = (row, org) => multip(E3(org), U3(row)) * AT3(row);
// D*U
export const H3 = (row, org) => multip(D3(org), U3(row));
// C*R*AT
export const G3 = (row, org) => multip(C3(org), R3(row)) * AT3(row);
// B*R
export const F3 = (row, org) => multip(B3(org), R3(row));
