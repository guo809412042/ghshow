/*
 * @Author: sssslf
 * @Date: 2020-01-15 20:33:00
 * @LastEditTime : 2020-01-15 22:13:20
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/money/funnelPay/components/sqlTemplate.js
 */

export const countrySQL = `
 SELECT DISTINCT(country) FROM  ads_pub_log_ply_evtusr_cnt_1d 
where pay_way = '#platform#'
`;

export const appVersionSQL = `
SELECT DISTINCT(app_version) FROM  ads_pub_log_ply_evtusr_cnt_1d 
where pay_way = '#platform#'
order by app_version DESC 
`;
export const categorySQL = `
SELECT DISTINCT(category) FROM  ads_pub_log_ply_evtusr_cnt_1d 
where pay_way = '#platform#' and category!='ALL'
`;

export const functionSQL = `
SELECT DISTINCT(funtion) FROM  ads_pub_log_ply_evtusr_cnt_1d 
where pay_way = '#platform#' and category = '#type#' and funtion!='ALL';
`;

export const fvalueSQL = `
SELECT DISTINCT(fvalue) FROM  ads_pub_log_ply_evtusr_cnt_1d 
where pay_way = '#platform#' and category = '#type#' and funtion = '#funtion#' and fvalue !='ALL' ;
`;


export const TabSQL = `
select 
sum(in_vip_usr_cnt) as in_vip_usr_cnt,
sum(clk_ply_usr_cnt) as clk_ply_usr_cnt,
sum(start_ply_usr_cnt) as start_ply_usr_cnt,
sum(single_ply_usr_cnt) as single_ply_usr_cnt,
sum(sign_ply_usr_cnt) as sign_ply_usr_cnt,
sum( one_month_ply_usr_cnt) as one_month_ply_usr_cnt , 
sum( one_year_ply_usr_cnt ) as one_year_ply_usr_cnt,
sum( sub_month_ply_usr_cnt) as  sub_month_ply_usr_cnt, 
sum( sub_year_ply_usr_cnt) as sub_year_ply_usr_cnt
from ads_pub_log_ply_evtusr_cnt_1d
where ds>= #startDate# and ds <=#endDate# #where#
`;


export const DAUSQL = `
SELECT SUM(in_vip_usr_cnt) as dau
FROM ads_pub_log_ply_evtusr_cnt_1d WHERE ds>= #startDate# and ds <=#endDate# 
and pay_way = 'DAU' #where# and platform = '#platform#'
`;

export const TabDaySQL = `
select 
ds,
sum(in_vip_usr_cnt) as in_vip_usr_cnt,
sum(clk_ply_usr_cnt) as clk_ply_usr_cnt,
sum(start_ply_usr_cnt) as start_ply_usr_cnt,
sum(single_ply_usr_cnt) as single_ply_usr_cnt,
sum(sign_ply_usr_cnt) as sign_ply_usr_cnt,
sum( one_month_ply_usr_cnt) as one_month_ply_usr_cnt , 
sum( one_year_ply_usr_cnt ) as one_year_ply_usr_cnt,
sum( sub_month_ply_usr_cnt) as  sub_month_ply_usr_cnt, 
sum( sub_year_ply_usr_cnt) as sub_year_ply_usr_cnt
from ads_pub_log_ply_evtusr_cnt_1d
where ds>= #startDate# and ds <=#endDate# #where#
group by ds
order by ds desc
`;

export const DAUDaySQL = `
SELECT SUM(in_vip_usr_cnt) as dau,ds
FROM ads_pub_log_ply_evtusr_cnt_1d WHERE ds>= #startDate# and ds <=#endDate# 
and pay_way = 'DAU' #where# and platform = '#platform#'
group by ds
order by ds desc
`;
