/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-02 10:40:51
 * @LastEditTime: 2020-04-02 19:41:18
 * @LastEditors: ssssslf
 */
const add = (num1, num2) => Number(num1) + Number(num2);
const multip = (num1, num2) => Number(num1) * Number(num2);
export const E10 = row => row.month_first;
export const G10 = row => row.year_first;
export const J10 = row => row.month_renewal_once_user;

export const K10 = row => row.month_renewal_init_user;

export const L10 = row => row.year_renewal_once_user;
export const M10 = row => row.month_renewal_uesr_ios;
export const N10 = row => row.year_renewal_uesr_ios;
export const O10 = row => row.year_conversion_and;
export const P10 = row => row.month_conversion_ios;
export const Q10 = row => row.year_conversion_ios;
export const R10 = row => row.month_renewal_and;
export const S10 = row => row.month_order_rate_ios;
export const T10 = row => row.month_new_and;
export const U10 = row => row.month_new_ios;
export const V10 = row => row.month_pay_once_and;
export const W10 = row => row.year_pay_once_and;
export const X10 = row => row.month_renewal_unit_and;
export const Y10 = row => row.month_unit_ios;
export const Z10 = row => row.year_unit_ios;
export const F10 = row => multip(O10(row), T10(row));
export const H10 = row => multip(U10(row), P10(row));
export const I10 = row => multip(U10(row), Q10(row));
// (H+M)*Y+(I+N)*Z
export const D10 = row => add(multip(add(H10(row), M10(row)), Y10(row)), multip(add(I10(row), N10(row)), Z10(row)));
// (E+J)*V+(F+K)*X+(G+L)*W
export const C10 = row => add(
  add(multip(add(E10(row), J10(row)), V10(row)), multip(add(F10(row), K10(row)), X10(row))),
  multip(add(G10(row), L10(row)), W10(row)),
);
export const B10 = row => add(C10(row), D10(row));

export const I3 = row => row.month_init_gp;
export const J3 = row => row.year_renewal_gp;
export const K3 = row => row.month_init_ios;
export const L3 = row => row.year_renewal_ios;
export const M3 = row => row.month_rate_gp;
export const N3 = row => row.year_rate_gp;
export const O3 = row => row.month_rate_ios;
export const P3 = row => row.year_rate_ios;
export const Q3 = row => row.month_renewal_gp;
export const R3 = row => row.month_renewal_ios;
export const S3 = row => row.month_new_gp;
export const T3 = row => row.month_new_ios;
export const U3 = row => row.month_unit_gp;
export const V3 = row => row.month_unit_ios;
export const W3 = row => row.year_unit_gp;
export const X3 = row => row.year_unit_ios;
export const H3 = row => multip(P3(row), T3(row));
export const G3 = row => multip(O3(row), T3(row));
export const F3 = row => multip(N3(row), S3(row));
export const E3 = row => multip(M3(row), S3(row));
// (G+K)*V+(H+L)*X
export const D3 = row => add(multip(add(G3(row), K3(row)), V3(row)), multip(add(H3(row), L3(row)), X3(row)));
// (E+I)*U+(F+J)*W
export const C3 = row => add(multip(add(E3(row), I3(row)), U3(row)), multip(add(F3(row), J3(row)), W3(row)));
export const B3 = row => add(C3(row), D3(row));
