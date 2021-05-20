/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-19 16:37:40
 * @LastEditTime: 2020-06-24 10:15:48
 * @LastEditors: ssssslf
 */
export const countrySQL = `
select DISTINCT(country) from vivamini_log_material_path_cnt_1d
where country is not null and platform = '#platform#' `;

export const appVersionSQL = `
select DISTINCT(app_version) from vivamini_log_material_path_cnt_1d
where app_version is not null and platform = '#platform#'`;

export const listSQL = `
SELECT ttid,
       max(name) as name,
       sum(view_dvc_cnt_1d) as view_dvc_cnt_1d,
       sum(temp_make_dvc_cnt_1d) as temp_make_dvc_cnt_1d,
       sum(make_dvc_cnt_1d) as make_dvc_cnt_1d,
       sum(share_dvc_cnt_1d) as share_dvc_cnt_1d,
       sum(make_fail_dvc_cnt_1d) as make_fail_dvc_cnt_1d,
       sum(del_dvc_cnt_1d) as del_dvc_cnt_1d,
       sum(pay_dvc_cnt_1d) as pay_dvc_cnt_1d,
       sum(view_dvc_cnt_1d) as view_dvc_cnt_1d,
       sum(coil_60_dvc_cnt_1d) as coil_60_dvc_cnt_1d,
       sum(coil_200_dvc_cnt_1d) as coil_200_dvc_cnt_1d,
       sum(month_pay_dvc_cnt_1d) as month_pay_dvc_cnt_1d,
       sum(year_pay_dvc_cnt_1d) as year_pay_dvc_cnt_1d,
       sum(other_pay_dvc_cnt_1d) as other_pay_dvc_cnt_1d
  from vivamini_log_material_path_cnt_1d
 where ds >= #startDate#
   and ds <= #endDate# #where#
 group by ttid `;
