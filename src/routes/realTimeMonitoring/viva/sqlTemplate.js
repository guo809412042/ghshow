/*
 * @Author: sssslf
 * @Date: 2020-01-16 10:37:59
 * @LastEditTime : 2020-01-17 15:24:37
 * @LastEditors  : ssssslf
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/realTimeMonitoring/viva/sqlTemplate.js
 */
export const countrySQL = `
select DISTINCT(country) from tmp_vcm_app_dau_dnu_export_monitor_hh where channel = '#platform#'
`;

export const appVersionSQL = `
select DISTINCT(app_version_cal) as app_version from tmp_vcm_app_dau_dnu_export_monitor_hh where channel = '#platform#' order by app_version_cal desc
`;

export const listSQL = `
select hh , sum(export_num) as export_num,sum(active_add_num) as active_add_num,sum(active_num) as active_num, sum(export_uv) as export_uv
from tmp_vcm_app_dau_dnu_export_monitor_hh
where ds = #startDate# and channel = '#platform#' #where#
group by hh
order by hh
`;
