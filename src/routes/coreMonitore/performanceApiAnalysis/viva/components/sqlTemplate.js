/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-23 10:17:51
 * @LastEditTime: 2020-04-23 11:23:52
 * @LastEditors: ssssslf
 */


export const countrySQL = `
 SELECT DISTINCT(country) FROM ads_viva_log_mon_api_1d where country is not null
 `;

export const apiCategorySQL = `
 SELECT DISTINCT(api_category) FROM ads_viva_log_mon_api_1d where api_category is not null
 `;

export const apiNameSQL = `
 SELECT DISTINCT(api_name) FROM ads_viva_log_mon_api_1d 
 where api_name is not null
 and api_category = '#type#'
 `;

export const appVersionSQL = `
 SELECT DISTINCT(app_version) FROM ads_viva_log_mon_api_1d 
 where app_version is not null
 and product = '#product#'
 order by app_version desc
 `;

// api响应时长统计
export const APISCOSTMILLS = `
select sum(_value2) as value2, sum(_value1) as value1, ds
from ads_viva_log_mon_api_1d
where ds>=#startDate# and ds <= #endDate# and type = 'cost_mills' and product = #product# 
      #where#
group by ds
order by ds;
`;

// api错误统计
export const APIERROE = `
select sum(_value1) as total,sum(_value2) as duid_total,ds
from ads_viva_log_mon_api_1d
where ds>=#startDate# and ds <= #endDate# and type = 'error_code' and product = #product#
      #where#
      #query#
group by ds
order by ds;
`;

export const errorCodeSQL = `
select _key as error_code
from ads_viva_log_mon_api_1d
where ds>=#startDate# and ds <= #endDate# and type = 'error_code' and product = #product#
      #where#
group by _key;
`;

export const APICOUNT = `
select sum(_value1) as total,ds
from ads_viva_log_mon_api_1d
where ds>=#startDate# and ds <= #endDate# and product = #product#
#where#
group by ds
order by ds;
`;
