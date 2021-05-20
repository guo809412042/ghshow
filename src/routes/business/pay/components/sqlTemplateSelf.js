/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 10:10:34
 * @LastEditTime: 2021-03-26 17:52:19
 * @LastEditors: dongqi.zhao
 */

export const iosGPDaySQL = `
select 
dau
,round(gp_new_sub_y_total,2) as gp_new_sub_y_total
,round(gp_new_sub_m_total,2) as gp_new_sub_m_total
,round(gp_new_sub_oth_total,2) as gp_new_sub_oth_total
,round(ios_new_sub_y_total,2) as ios_new_sub_y_total
,round(ios_new_sub_m_total,2) as ios_new_sub_m_total
,round(ios_new_sub_oth_total,2) as ios_new_sub_oth_total
,round(gp_one_pay_total,2) as gp_one_pay_total
,round(ios_one_pay_total,2) as ios_one_pay_total
,round((cast(gp_new_sub_y_total as double) + cast(gp_new_sub_m_total as double) + cast(gp_new_sub_oth_total as double)+cast(gp_one_pay_total as double)),2) as gp_new_sub
,#group#
from (
select #group#,
sum(cast(dau as double)) as dau,
sum(cast(gp_new_sub_y_total as double)) as gp_new_sub_y_total,
sum(cast(gp_new_sub_m_total as double)) as gp_new_sub_m_total,
sum(cast(gp_new_sub_oth_total as double)) as gp_new_sub_oth_total,
sum(cast(ios_new_sub_y_total as double)) as ios_new_sub_y_total,
sum(cast(ios_new_sub_m_total as double)) as ios_new_sub_m_total,
sum(cast(ios_new_sub_oth_total as double)) as ios_new_sub_oth_total,
sum(cast(gp_one_pay_total as double)) as gp_one_pay_total,
sum(cast(ios_one_pay_total as double)) as ios_one_pay_total
  from rpt_pub_trd_sub_sale_total_1d_ow
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by #group#
  )
   order by #order# desc
`;

export const iosGPMonthSQL = `
select 
dau
,round(gp_new_sub_y_total,2) as gp_new_sub_y_total
,round(gp_new_sub_m_total,2) as gp_new_sub_m_total
,round(gp_new_sub_oth_total,2) as gp_new_sub_oth_total
,round(ios_new_sub_y_total,2) as ios_new_sub_y_total
,round(ios_new_sub_m_total,2) as ios_new_sub_m_total
,round(ios_new_sub_oth_total,2) as ios_new_sub_oth_total
,round(gp_one_pay_total,2) as gp_one_pay_total
,round(ios_one_pay_total,2) as ios_one_pay_total
,round((cast(gp_new_sub_y_total as double) + cast(gp_new_sub_m_total as double) + cast(gp_new_sub_oth_total as double)+cast(gp_one_pay_total as double)),2) as gp_new_sub
,#outerFields#
from (
select #innerFields#,
sum(cast(gp_new_sub_y_total as double)) as gp_new_sub_y_total,
sum(cast(dau as double)) as dau,
sum(cast(gp_new_sub_m_total as double)) as gp_new_sub_m_total,
sum(cast(gp_new_sub_oth_total as double)) as gp_new_sub_oth_total,
sum(cast(ios_new_sub_y_total as double)) as ios_new_sub_y_total,
sum(cast(ios_new_sub_m_total as double)) as ios_new_sub_m_total,
sum(cast(ios_new_sub_oth_total as double)) as ios_new_sub_oth_total,
sum(cast(ios_one_pay_total as double)) as ios_one_pay_total,
sum(cast(gp_one_pay_total as double)) as gp_one_pay_total,
sum(cast(ios_one_pay_total as double)) as ios_one_pay_total
  from rpt_pub_trd_sub_sale_total_1d_ow
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by #groupby#
  )
  order by #orderby# desc
`;

export const andSQL = `
select 
dau
,round(and_new_sub_y_total,2) as and_new_sub_y_total
,round(and_new_sub_m_total,2) as and_new_sub_m_total
,round(and_new_sub_oth_total,2) as and_new_sub_oth_total
,round(and_nosub_new_y_total,2) as and_nosub_new_y_total
,round(and_nosub_new_m_total,2) as and_nosub_new_m_total
,round(and_nosub_new_oth_total,2) as and_nosub_new_oth_total
,round((cast(and_new_sub_y_total as double) + cast(and_new_sub_m_total as double) + cast(and_new_sub_oth_total as double)),2) as and_new_sub
,#group#
from (
select #group#,
sum(cast(dau as double)) as dau,
sum(cast(and_new_sub_y_total as double)) as and_new_sub_y_total,
    sum(cast(and_new_sub_m_total as double)) as and_new_sub_m_total,
    sum(cast(and_new_sub_oth_total as double)) as and_new_sub_oth_total,
    sum(cast(and_nosub_new_y_total as double)) as and_nosub_new_y_total,
    sum(cast(and_nosub_new_m_total as double)) as and_nosub_new_m_total,
    sum(cast(and_nosub_new_oth_total as double)) as and_nosub_new_oth_total
  from rpt_pub_trd_sub_sale_total_1d_ow
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by #group#
  )
   order by #order# desc
`;

export const andMonthSQL = `
select 
dau
,round(and_new_sub_y_total,2) as and_new_sub_y_total
,round(and_new_sub_m_total,2) as and_new_sub_m_total
,round(and_new_sub_oth_total,2) as and_new_sub_oth_total
,round(and_nosub_new_y_total,2) as and_nosub_new_y_total
,round(and_nosub_new_m_total,2) as and_nosub_new_m_total
,round(and_nosub_new_oth_total,2) as and_nosub_new_oth_total
,round((cast(and_new_sub_y_total as double) + cast(and_new_sub_m_total as double) + cast(and_new_sub_oth_total as double)),2) as and_new_sub
,#outerFields#
from (
select #innerFields#,
    sum(cast(and_new_sub_y_total as double)) as and_new_sub_y_total,
    sum(cast(dau as double)) as dau,
    sum(cast(and_new_sub_m_total as double)) as and_new_sub_m_total,
    sum(cast(and_new_sub_oth_total as double)) as and_new_sub_oth_total,
    sum(cast(and_nosub_new_y_total as double)) as and_nosub_new_y_total,
    sum(cast(and_nosub_new_m_total as double)) as and_nosub_new_m_total,
    sum(cast(and_nosub_new_oth_total as double)) as and_nosub_new_oth_total
  from rpt_pub_trd_sub_sale_total_1d_ow
  where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by #groupby#
  )
   order by #orderby# desc
`;

export const chartSQL = `
SELECT 
data_time
,round(gp_new_sub_all_total,2) as gp_new_sub_all_total
,round(gp_new_sub_y_total,2) as gp_new_sub_y_total
,round(gp_new_sub_m_total,2) as gp_new_sub_m_total
,round(gp_new_sub_oth_total,2) as gp_new_sub_oth_total
,round(gp_one_pay_total,2) as gp_one_pay_total

,round(ios_new_sub_all_total,2) as ios_new_sub_all_total
,round(ios_new_sub_y_total,2) as ios_new_sub_y_total
,round(ios_new_sub_m_total,2) as ios_new_sub_m_total
,round(ios_new_sub_oth_total,2) as ios_new_sub_oth_total
,round(ios_one_pay_total,2) as ios_one_pay_total
from
(SELECT
        data_time,
         sum(cast(gp_new_sub_all_total as double)) as gp_new_sub_all_total,
         sum(cast(ios_new_sub_all_total as double)) as ios_new_sub_all_total,
         sum(cast(gp_new_sub_y_total as double)) as gp_new_sub_y_total,
         sum(cast(gp_new_sub_m_total as double)) as gp_new_sub_m_total,
         sum(cast(gp_new_sub_oth_total as double)) as gp_new_sub_oth_total,
         sum(cast(ios_new_sub_y_total as double)) as ios_new_sub_y_total,
         sum(cast(ios_new_sub_m_total as double)) as ios_new_sub_m_total,
         sum(cast(ios_new_sub_oth_total as double)) as ios_new_sub_oth_total,
         sum(cast(gp_one_pay_total as double)) as gp_one_pay_total,
         sum(cast(ios_one_pay_total as double)) as ios_one_pay_total,
         sum(cast(and_new_sub_all_total as double)) as and_new_sub_all_total,
         sum(cast(and_new_nosub_all_total as double)) as and_new_nosub_all_total,
         sum(cast(and_new_sub_y_total as double)) as and_new_sub_y_total,
         sum(cast(and_new_sub_m_total as double)) as and_new_sub_m_total,
         sum(cast(and_new_sub_oth_total as double)) as and_new_sub_oth_total,
         sum(cast(and_nosub_new_y_total as double)) as and_nosub_new_y_total,
         sum(cast(and_nosub_new_m_total as double)) as and_nosub_new_m_total,
         sum(cast(and_nosub_new_oth_total as double)) as and_nosub_new_oth_total
 FROM rpt_pub_trd_sub_sale_total_1d_ow
 where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
  group by data_time
)
`;

export const chartMonthSQL = `
SELECT 
data_time
,round(gp_new_sub_all_total,2) as gp_new_sub_all_total
,round(gp_new_sub_y_total,2) as gp_new_sub_y_total
,round(gp_new_sub_m_total,2) as gp_new_sub_m_total
,round(gp_new_sub_oth_total,2) as gp_new_sub_oth_total
,round(gp_one_pay_total,2) as gp_one_pay_total

,round(ios_new_sub_all_total,2) as ios_new_sub_all_total
,round(ios_new_sub_y_total,2) as ios_new_sub_y_total
,round(ios_new_sub_m_total,2) as ios_new_sub_m_total
,round(ios_new_sub_oth_total,2) as ios_new_sub_oth_total
,round(ios_one_pay_total,2) as ios_one_pay_total
from
(SELECT
  left(data_time,6) as data_time,
         sum(cast(gp_new_sub_all_total as double)) as gp_new_sub_all_total,
         sum(cast(ios_new_sub_all_total as double)) as ios_new_sub_all_total,
         sum(cast(gp_new_sub_y_total as double)) as gp_new_sub_y_total,
         sum(cast(gp_new_sub_m_total as double)) as gp_new_sub_m_total,
         sum(cast(gp_new_sub_oth_total as double)) as gp_new_sub_oth_total,
         sum(cast(ios_new_sub_y_total as double)) as ios_new_sub_y_total,
         sum(cast(ios_new_sub_m_total as double)) as ios_new_sub_m_total,
         sum(cast(ios_new_sub_oth_total as double)) as ios_new_sub_oth_total,
         sum(cast(gp_one_pay_total as double)) as gp_one_pay_total,
         sum(cast(ios_one_pay_total as double)) as ios_one_pay_total,
         sum(cast(and_new_sub_all_total as double)) as and_new_sub_all_total,
         sum(cast(and_new_nosub_all_total as double)) as and_new_nosub_all_total,
         sum(cast(and_new_sub_y_total as double)) as and_new_sub_y_total,
         sum(cast(and_new_sub_m_total as double)) as and_new_sub_m_total,
         sum(cast(and_new_sub_oth_total as double)) as and_new_sub_oth_total,
         sum(cast(and_nosub_new_y_total as double)) as and_nosub_new_y_total,
         sum(cast(and_nosub_new_m_total as double)) as and_nosub_new_m_total,
         sum(cast(and_nosub_new_oth_total as double)) as and_nosub_new_oth_total
 FROM rpt_pub_trd_sub_sale_total_1d_ow
 where data_time>= '#startDate#' and data_time<= '#endDate#' and total_type= '#type#' #where#
 group by left(data_time,6)
)
`;
