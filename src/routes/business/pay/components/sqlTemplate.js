/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 10:10:34
 * @LastEditTime: 2020-03-16 15:13:50
 * @LastEditors: ssssslf
 */
export const appProductSQL = `
select DISTINCT(app_product) as app_product from rpt_pub_trd_all_sale_total_1d order by app_product;
`;

// 地区
export const countryNameSQL = `
select  country_name,country_code_2 as country_code from   dim_pub_log_country_code
`;

export const iosGPDaySQL = `
select gp_add_user_total,
ios_add_user_total
,round(gp_new_sub_y_total,2) as gp_new_sub_y_total
,round(gp_new_sub_m_total,2) as gp_new_sub_m_total
,round(gp_new_sub_oth_total,2) as gp_new_sub_oth_total
,round(ios_new_sub_y_total,2) as ios_new_sub_y_total
,round(ios_new_sub_m_total,2) as ios_new_sub_m_total
,round(ios_new_sub_oth_total,2) as ios_new_sub_oth_total
,round(gp_old_sub_y_total,2) as gp_old_sub_y_total
,round(gp_old_sub_m_total,2) as gp_old_sub_m_total
,round(gp_old_sub_oth_total,2) as gp_old_sub_oth_total
,round(ios_old_sub_y_total,2) as ios_old_sub_y_total
,round(ios_old_sub_m_total,2) as ios_old_sub_m_total
,round(ios_old_sub_oth_total,2) as ios_old_sub_oth_total
,round(gp_one_pay_total,2) as gp_one_pay_total
,round(ios_one_pay_total,2) as ios_one_pay_total
,round((cast(gp_new_sub_y_total as double) + cast(gp_new_sub_m_total as double) + cast(gp_new_sub_oth_total as double)+cast(gp_one_pay_total as double)),2) as gp_new_sub
,#group#
from (
select #group#,
sum(cast(gp_new_sub_y_total as double)) as gp_new_sub_y_total,
sum(cast(gp_new_sub_m_total as double)) as gp_new_sub_m_total,
sum(cast(gp_new_sub_oth_total as double)) as gp_new_sub_oth_total,
sum(cast(ios_new_sub_y_total as double)) as ios_new_sub_y_total,
sum(cast(ios_new_sub_m_total as double)) as ios_new_sub_m_total,
sum(cast(ios_new_sub_oth_total as double)) as ios_new_sub_oth_total,
sum(cast(gp_old_sub_y_total as double)) as gp_old_sub_y_total,
sum(cast(gp_old_sub_m_total as double)) as gp_old_sub_m_total,
sum(cast(gp_old_sub_oth_total as double)) as gp_old_sub_oth_total,
sum(cast(ios_old_sub_y_total as double)) as ios_old_sub_y_total,
sum(cast(ios_old_sub_m_total as double)) as ios_old_sub_m_total,
sum(cast(ios_old_sub_oth_total as double)) as ios_old_sub_oth_total,
sum(cast(ios_old_sub_oth_total as double)) as ios_old_sub_oth_total,
sum(cast(ios_one_pay_total as double)) as ios_one_pay_total,
sum(cast(gp_one_pay_total as double)) as gp_one_pay_total,
sum(cast(ios_one_pay_total as double)) as ios_one_pay_total,
sum(cast(gp_add_user_total as double)) as gp_add_user_total,
sum(cast(ios_add_user_total as double)) as ios_add_user_total
  from rpt_pub_trd_all_sale_total_1d
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by #group#
  )
   order by #order# desc
`;

export const iosGPMonthSQL = `
select gp_add_user_total,
ios_add_user_total
,round(gp_new_sub_y_total,2) as gp_new_sub_y_total
,round(gp_new_sub_m_total,2) as gp_new_sub_m_total
,round(gp_new_sub_oth_total,2) as gp_new_sub_oth_total
,round(ios_new_sub_y_total,2) as ios_new_sub_y_total
,round(ios_new_sub_m_total,2) as ios_new_sub_m_total
,round(ios_new_sub_oth_total,2) as ios_new_sub_oth_total
,round(gp_old_sub_y_total,2) as gp_old_sub_y_total
,round(gp_old_sub_m_total,2) as gp_old_sub_m_total
,round(gp_old_sub_oth_total,2) as gp_old_sub_oth_total
,round(ios_old_sub_y_total,2) as ios_old_sub_y_total
,round(ios_old_sub_m_total,2) as ios_old_sub_m_total
,round(ios_old_sub_oth_total,2) as ios_old_sub_oth_total
,round(gp_one_pay_total,2) as gp_one_pay_total
,round(ios_one_pay_total,2) as ios_one_pay_total
,round((cast(gp_new_sub_y_total as double) + cast(gp_new_sub_m_total as double) + cast(gp_new_sub_oth_total as double)+cast(gp_one_pay_total as double)),2) as gp_new_sub
,#outerFields#
from (
select #innerFields#,
sum(cast(gp_new_sub_y_total as double)) as gp_new_sub_y_total,
sum(cast(gp_new_sub_m_total as double)) as gp_new_sub_m_total,
sum(cast(gp_new_sub_oth_total as double)) as gp_new_sub_oth_total,
sum(cast(ios_new_sub_y_total as double)) as ios_new_sub_y_total,
sum(cast(ios_new_sub_m_total as double)) as ios_new_sub_m_total,
sum(cast(ios_new_sub_oth_total as double)) as ios_new_sub_oth_total,
sum(cast(gp_old_sub_y_total as double)) as gp_old_sub_y_total,
sum(cast(gp_old_sub_m_total as double)) as gp_old_sub_m_total,
sum(cast(gp_old_sub_oth_total as double)) as gp_old_sub_oth_total,
sum(cast(ios_old_sub_y_total as double)) as ios_old_sub_y_total,
sum(cast(ios_old_sub_m_total as double)) as ios_old_sub_m_total,
sum(cast(ios_old_sub_oth_total as double)) as ios_old_sub_oth_total,
sum(cast(ios_old_sub_oth_total as double)) as ios_old_sub_oth_total,
sum(cast(ios_one_pay_total as double)) as ios_one_pay_total,
sum(cast(gp_one_pay_total as double)) as gp_one_pay_total,
sum(cast(ios_one_pay_total as double)) as ios_one_pay_total,
sum(cast(gp_add_user_total as double)) as gp_add_user_total,
sum(cast(ios_add_user_total as double)) as ios_add_user_total
  from rpt_pub_trd_all_sale_total_1d
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by #groupby#
  )
   order by #orderby# desc
`;


export const andSQL = `
select and_add_user_total
,round(and_new_sub_y_total,2) as and_new_sub_y_total
,round(and_new_sub_m_total,2) as and_new_sub_m_total
,round(and_new_sub_oth_total,2) as and_new_sub_oth_total
,round(and_nosub_new_y_total,2) as and_nosub_new_y_total
,round(and_nosub_new_m_total,2) as and_nosub_new_m_total
,round(and_nosub_new_oth_total,2) as and_nosub_new_oth_total
,round(and_old_sub_y_total,2) as and_old_sub_y_total
,round(and_old_sub_m_total,2) as and_old_sub_m_total
,round(and_old_sub_oth_total,2) as and_old_sub_oth_total
,round(and_nosub_old_y_total,2) as and_nosub_old_y_total
,round(and_nosub_old_m_total,2) as and_nosub_old_m_total
,round(and_nosub_old_oth_total,2) as and_nosub_old_oth_total
,round((cast(and_new_sub_y_total as double) + cast(and_new_sub_m_total as double) + cast(and_new_sub_oth_total as double)),2) as and_new_sub
,#group#
from (
select #group#,
    sum(cast(and_new_sub_y_total as double)) as and_new_sub_y_total,
    sum(cast(and_new_sub_m_total as double)) as and_new_sub_m_total,
    sum(cast(and_new_sub_oth_total as double)) as and_new_sub_oth_total,
    sum(cast(and_nosub_new_y_total as double)) as and_nosub_new_y_total,
    sum(cast(and_nosub_new_m_total as double)) as and_nosub_new_m_total,
    sum(cast(and_nosub_new_oth_total as double)) as and_nosub_new_oth_total,
    sum(cast(and_old_sub_y_total as double)) as and_old_sub_y_total,
    sum(cast(and_old_sub_m_total as double)) as and_old_sub_m_total,
    sum(cast(and_old_sub_oth_total as double)) as and_old_sub_oth_total,
    sum(cast(and_nosub_old_y_total as double)) as and_nosub_old_y_total,
    sum(cast(and_nosub_old_m_total as double)) as and_nosub_old_m_total,
    sum(cast(and_nosub_old_oth_total as double)) as and_nosub_old_oth_total,
    sum(cast(and_add_user_total as double)) as and_add_user_total
  from rpt_pub_trd_all_sale_total_1d
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by #group#
  )
   order by #order# desc
`;

export const andMonthSQL = `
select and_add_user_total
,round(and_new_sub_y_total,2) as and_new_sub_y_total
,round(and_new_sub_m_total,2) as and_new_sub_m_total
,round(and_new_sub_oth_total,2) as and_new_sub_oth_total
,round(and_nosub_new_y_total,2) as and_nosub_new_y_total
,round(and_nosub_new_m_total,2) as and_nosub_new_m_total
,round(and_nosub_new_oth_total,2) as and_nosub_new_oth_total
,round(and_old_sub_y_total,2) as and_old_sub_y_total
,round(and_old_sub_m_total,2) as and_old_sub_m_total
,round(and_old_sub_oth_total,2) as and_old_sub_oth_total
,round(and_nosub_old_y_total,2) as and_nosub_old_y_total
,round(and_nosub_old_m_total,2) as and_nosub_old_m_total
,round(and_nosub_old_oth_total,2) as and_nosub_old_oth_total
,round((cast(and_new_sub_y_total as double) + cast(and_new_sub_m_total as double) + cast(and_new_sub_oth_total as double)),2) as and_new_sub
,#outerFields#
from (
select #innerFields#,
    sum(cast(and_new_sub_y_total as double)) as and_new_sub_y_total,
    sum(cast(and_new_sub_m_total as double)) as and_new_sub_m_total,
    sum(cast(and_new_sub_oth_total as double)) as and_new_sub_oth_total,
    sum(cast(and_nosub_new_y_total as double)) as and_nosub_new_y_total,
    sum(cast(and_nosub_new_m_total as double)) as and_nosub_new_m_total,
    sum(cast(and_nosub_new_oth_total as double)) as and_nosub_new_oth_total,
    sum(cast(and_old_sub_y_total as double)) as and_old_sub_y_total,
    sum(cast(and_old_sub_m_total as double)) as and_old_sub_m_total,
    sum(cast(and_old_sub_oth_total as double)) as and_old_sub_oth_total,
    sum(cast(and_nosub_old_y_total as double)) as and_nosub_old_y_total,
    sum(cast(and_nosub_old_m_total as double)) as and_nosub_old_m_total,
    sum(cast(and_nosub_old_oth_total as double)) as and_nosub_old_oth_total,
    sum(cast(and_add_user_total as double)) as and_add_user_total
  from rpt_pub_trd_all_sale_total_1d
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by #groupby#
  )
   order by #orderby# desc
`;

export const chartSQL = `
SELECT 
data_time
,round(and_new_sub_y_total,2) as and_new_sub_y_total
,round(and_new_sub_m_total,2) as and_new_sub_m_total
,round(and_new_sub_oth_total,2) as and_new_sub_oth_total
,round(and_nosub_new_y_total,2) as and_nosub_new_y_total
,round(and_nosub_new_m_total,2) as and_nosub_new_m_total
,round(and_nosub_new_oth_total,2) as and_nosub_new_oth_total
,round(and_old_sub_y_total,2) as and_old_sub_y_total
,round(and_old_sub_m_total,2) as and_old_sub_m_total
,round(and_old_sub_oth_total,2) as and_old_sub_oth_total
,round(and_nosub_old_y_total,2) as and_nosub_old_y_total
,round(and_nosub_old_m_total,2) as and_nosub_old_m_total
,round(and_nosub_old_oth_total,2) as and_nosub_old_oth_total

,round(cast(gp_new_sub_y_total as double) 
+ cast(gp_new_sub_m_total as double) 
+ cast(gp_new_sub_oth_total as double)
+cast(gp_one_pay_total as double),2) as gp_new_sub

,round(cast(gp_old_sub_y_total as double)
+cast(gp_old_sub_m_total as double)
+cast(gp_old_sub_oth_total as double),2) as gp_old_sub

,round(cast(ios_new_sub_y_total as double)
+cast(ios_new_sub_m_total as double)
+cast(ios_new_sub_oth_total as double)
+cast(ios_one_pay_total as double),2) as ios_new_sub

,round(cast(ios_old_sub_y_total as double)
+cast(ios_old_sub_m_total as double)
+cast(ios_old_sub_oth_total as double),2) as ios_old_sub

,round(cast(and_new_sub_y_total as double)
+cast(and_new_sub_m_total as double)
+cast(and_new_sub_oth_total as double),2) as and_new_sub

,round(cast(and_nosub_new_y_total as double)
+cast(and_nosub_new_m_total as double)
+cast(and_nosub_new_oth_total as double),2) as and_nosub_new

,round(cast(and_old_sub_y_total as double)
+cast(and_old_sub_m_total as double)
+cast(and_old_sub_oth_total as double),2) as and_old_sub

,round(cast(and_nosub_old_y_total as double)
 +cast(and_nosub_old_m_total as double)
 +cast(and_nosub_old_oth_total as double),2) as and_nosub_old

,round(gp_new_sub_y_total,2) as gp_new_sub_y_total
,round(gp_new_sub_m_total,2) as gp_new_sub_m_total
,round(gp_new_sub_oth_total,2) as gp_new_sub_oth_total
,round(ios_new_sub_y_total,2) as ios_new_sub_y_total
,round(ios_new_sub_m_total,2) as ios_new_sub_m_total
,round(ios_new_sub_oth_total,2) as ios_new_sub_oth_total
,round(gp_old_sub_y_total,2) as gp_old_sub_y_total
,round(gp_old_sub_m_total,2) as gp_old_sub_m_total
,round(gp_old_sub_oth_total,2) as gp_old_sub_oth_total
,round(ios_old_sub_y_total,2) as ios_old_sub_y_total
,round(ios_old_sub_m_total,2) as ios_old_sub_m_total
,round(ios_old_sub_oth_total,2) as ios_old_sub_oth_total
,round(gp_one_pay_total,2) as gp_one_pay_total
,round(ios_one_pay_total,2) as ios_one_pay_total
FROM (
  SELECT
  data_time,
  sum(cast(and_new_sub_y_total as double)) as and_new_sub_y_total,
  sum(cast(and_new_sub_m_total as double)) as and_new_sub_m_total,
  sum(cast(and_new_sub_oth_total as double)) as and_new_sub_oth_total,
  sum(cast(and_nosub_new_y_total as double)) as and_nosub_new_y_total,
  sum(cast(and_nosub_new_m_total as double)) as and_nosub_new_m_total,
  sum(cast(and_nosub_new_oth_total as double)) as and_nosub_new_oth_total,
  sum(cast(and_old_sub_y_total as double)) as and_old_sub_y_total,
  sum(cast(and_old_sub_m_total as double)) as and_old_sub_m_total,
  sum(cast(and_old_sub_oth_total as double)) as and_old_sub_oth_total,
  sum(cast(and_nosub_old_y_total as double)) as and_nosub_old_y_total,
  sum(cast(and_nosub_old_m_total as double)) as and_nosub_old_m_total,
  sum(cast(and_nosub_old_oth_total as double)) as and_nosub_old_oth_total,

  sum(cast(gp_new_sub_y_total as double)) as gp_new_sub_y_total,
  sum(cast(gp_new_sub_m_total as double)) as gp_new_sub_m_total,
  sum(cast(gp_new_sub_oth_total as double)) as gp_new_sub_oth_total,
  sum(cast(ios_new_sub_y_total as double)) as ios_new_sub_y_total,
  sum(cast(ios_new_sub_m_total as double)) as ios_new_sub_m_total,
  sum(cast(ios_new_sub_oth_total as double)) as ios_new_sub_oth_total,
  sum(cast(gp_old_sub_y_total as double)) as gp_old_sub_y_total,
  sum(cast(gp_old_sub_m_total as double)) as gp_old_sub_m_total,
  sum(cast(gp_old_sub_oth_total as double)) as gp_old_sub_oth_total,
  sum(cast(ios_old_sub_y_total as double)) as ios_old_sub_y_total,
  sum(cast(ios_old_sub_m_total as double)) as ios_old_sub_m_total,
  sum(cast(ios_old_sub_oth_total as double)) as ios_old_sub_oth_total,
  sum(cast(ios_old_sub_oth_total as double)) as ios_old_sub_oth_total,
  sum(cast(ios_one_pay_total as double)) as ios_one_pay_total,
  sum(cast(gp_one_pay_total as double)) as gp_one_pay_total,
  sum(cast(gp_add_user_total as double)) as gp_add_user_total,
  sum(cast(ios_add_user_total as double)) as ios_add_user_total
  FROM rpt_pub_trd_all_sale_total_1d
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by data_time
)
`;

export const chartMonthSQL = `
SELECT 
data_time
,round(and_new_sub_y_total,2) as and_new_sub_y_total
,round(and_new_sub_m_total,2) as and_new_sub_m_total
,round(and_new_sub_oth_total,2) as and_new_sub_oth_total
,round(and_nosub_new_y_total,2) as and_nosub_new_y_total
,round(and_nosub_new_m_total,2) as and_nosub_new_m_total
,round(and_nosub_new_oth_total,2) as and_nosub_new_oth_total
,round(and_old_sub_y_total,2) as and_old_sub_y_total
,round(and_old_sub_m_total,2) as and_old_sub_m_total
,round(and_old_sub_oth_total,2) as and_old_sub_oth_total
,round(and_nosub_old_y_total,2) as and_nosub_old_y_total
,round(and_nosub_old_m_total,2) as and_nosub_old_m_total
,round(and_nosub_old_oth_total,2) as and_nosub_old_oth_total

,round(cast(gp_new_sub_y_total as double) 
+ cast(gp_new_sub_m_total as double) 
+ cast(gp_new_sub_oth_total as double)
+cast(gp_one_pay_total as double),2) as gp_new_sub

,round(cast(gp_old_sub_y_total as double)
+cast(gp_old_sub_m_total as double)
+cast(gp_old_sub_oth_total as double),2) as gp_old_sub

,round(cast(ios_new_sub_y_total as double)
+cast(ios_new_sub_m_total as double)
+cast(ios_new_sub_oth_total as double)
+cast(ios_one_pay_total as double),2) as ios_new_sub

,round(cast(ios_old_sub_y_total as double)
+cast(ios_old_sub_m_total as double)
+cast(ios_old_sub_oth_total as double),2) as ios_old_sub

,round(cast(and_new_sub_y_total as double)
+cast(and_new_sub_m_total as double)
+cast(and_new_sub_oth_total as double),2) as and_new_sub

,round(cast(and_nosub_new_y_total as double)
+cast(and_nosub_new_m_total as double)
+cast(and_nosub_new_oth_total as double),2) as and_nosub_new

,round(cast(and_old_sub_y_total as double)
+cast(and_old_sub_m_total as double)
+cast(and_old_sub_oth_total as double),2) as and_old_sub

,round(cast(and_nosub_old_y_total as double)
 +cast(and_nosub_old_m_total as double)
 +cast(and_nosub_old_oth_total as double),2) as and_nosub_old

,round(gp_new_sub_y_total,2) as gp_new_sub_y_total
,round(gp_new_sub_m_total,2) as gp_new_sub_m_total
,round(gp_new_sub_oth_total,2) as gp_new_sub_oth_total
,round(ios_new_sub_y_total,2) as ios_new_sub_y_total
,round(ios_new_sub_m_total,2) as ios_new_sub_m_total
,round(ios_new_sub_oth_total,2) as ios_new_sub_oth_total
,round(gp_old_sub_y_total,2) as gp_old_sub_y_total
,round(gp_old_sub_m_total,2) as gp_old_sub_m_total
,round(gp_old_sub_oth_total,2) as gp_old_sub_oth_total
,round(ios_old_sub_y_total,2) as ios_old_sub_y_total
,round(ios_old_sub_m_total,2) as ios_old_sub_m_total
,round(ios_old_sub_oth_total,2) as ios_old_sub_oth_total
,round(gp_one_pay_total,2) as gp_one_pay_total
,round(ios_one_pay_total,2) as ios_one_pay_total
FROM (
  SELECT
  left(data_time,6) as data_time,
  sum(cast(and_new_sub_y_total as double)) as and_new_sub_y_total,
  sum(cast(and_new_sub_m_total as double)) as and_new_sub_m_total,
  sum(cast(and_new_sub_oth_total as double)) as and_new_sub_oth_total,
  sum(cast(and_nosub_new_y_total as double)) as and_nosub_new_y_total,
  sum(cast(and_nosub_new_m_total as double)) as and_nosub_new_m_total,
  sum(cast(and_nosub_new_oth_total as double)) as and_nosub_new_oth_total,
  sum(cast(and_old_sub_y_total as double)) as and_old_sub_y_total,
  sum(cast(and_old_sub_m_total as double)) as and_old_sub_m_total,
  sum(cast(and_old_sub_oth_total as double)) as and_old_sub_oth_total,
  sum(cast(and_nosub_old_y_total as double)) as and_nosub_old_y_total,
  sum(cast(and_nosub_old_m_total as double)) as and_nosub_old_m_total,
  sum(cast(and_nosub_old_oth_total as double)) as and_nosub_old_oth_total,

  sum(cast(gp_new_sub_y_total as double)) as gp_new_sub_y_total,
  sum(cast(gp_new_sub_m_total as double)) as gp_new_sub_m_total,
  sum(cast(gp_new_sub_oth_total as double)) as gp_new_sub_oth_total,
  sum(cast(ios_new_sub_y_total as double)) as ios_new_sub_y_total,
  sum(cast(ios_new_sub_m_total as double)) as ios_new_sub_m_total,
  sum(cast(ios_new_sub_oth_total as double)) as ios_new_sub_oth_total,
  sum(cast(gp_old_sub_y_total as double)) as gp_old_sub_y_total,
  sum(cast(gp_old_sub_m_total as double)) as gp_old_sub_m_total,
  sum(cast(gp_old_sub_oth_total as double)) as gp_old_sub_oth_total,
  sum(cast(ios_old_sub_y_total as double)) as ios_old_sub_y_total,
  sum(cast(ios_old_sub_m_total as double)) as ios_old_sub_m_total,
  sum(cast(ios_old_sub_oth_total as double)) as ios_old_sub_oth_total,
  sum(cast(ios_old_sub_oth_total as double)) as ios_old_sub_oth_total,
  sum(cast(ios_one_pay_total as double)) as ios_one_pay_total,
  sum(cast(gp_one_pay_total as double)) as gp_one_pay_total,
  sum(cast(gp_add_user_total as double)) as gp_add_user_total,
  sum(cast(ios_add_user_total as double)) as ios_add_user_total
  FROM rpt_pub_trd_all_sale_total_1d
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by left(data_time,6)
)
`;
