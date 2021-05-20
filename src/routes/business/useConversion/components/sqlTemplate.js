/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 10:10:34
 * @LastEditTime: 2020-06-09 18:11:52
 * @LastEditors: ssssslf
 */
export const appProductSQL = `
SELECT  DISTINCT(product_type)  from rpt_pub_trd_gp_ios_trial_usr_1d 
`;

// 地区
export const countryNameSQL = `
select  country_name,country_code_2 as country_code from   dim_pub_log_country_code
`;

export const skuTypeSQL = `
select DISTINCT(sku_id) from rpt_pub_trd_gp_ios_trial_usr_1d where sku_id is not null `;

export const payWaySQL = `
select DISTINCT(pay_way) from rpt_pub_trd_gp_ios_trial_usr_1d where pay_way is not null `;

export const listSQL = `
select a.ds,a.new_usr_actv,
b.pay_usr_cnt_1d,
b.trial_usr_cnt_1d,
b.trial_pay_usr_cnt_1d,
b.pay_amt_total
  from(
SELECT ds,  SUM(new_usr_actv) as new_usr_actv
  FROM(
SELECT ds, platform, country_name, product_type, new_usr_actv
  from rpt_pub_trd_gp_ios_trial_usr_1d
  where ds >= '#startDate#' and ds <= '#endDate#'
  and platform = #platform# #where1#
 GROUP BY ds, platform, country_name, product_type, new_usr_actv) t
 GROUP BY ds) a
  left join(
select ds,
       sum(pay_usr_cnt_1d) as pay_usr_cnt_1d,
       sum(trial_usr_cnt_1d) as trial_usr_cnt_1d,
       sum(trial_pay_usr_cnt_1d) as trial_pay_usr_cnt_1d,
       sum(pay_amt_total) as pay_amt_total
  from rpt_pub_trd_gp_ios_trial_usr_1d
  where ds >= '#startDate#' and ds <= '#endDate#'
  and platform = #platform# #where#
 group by ds) b on a.ds= b.ds 
 order by ds desc
`;

export const listMonthSQL = `
SELECT sum(a.new_usr_actv) as new_usr_actv,
        sum(b.pay_usr_cnt_1d) as pay_usr_cnt_1d,
        sum(b.trial_usr_cnt_1d) as trial_usr_cnt_1d,
        sum(b.trial_pay_usr_cnt_1d) as trial_pay_usr_cnt_1d,
        sum(b.pay_amt_total) as pay_amt_total
from(
SELECT SUM(new_usr_actv) as new_usr_actv, flag
  FROM(
SELECT platform, country_name, product_type,new_usr_actv,1 as flag
  from rpt_pub_trd_gp_ios_trial_usr_1d
  where ds >= '#startDate#' and ds <= '#endDate#'
  and platform = #platform# #where1#
 GROUP BY platform, country_name, product_type, new_usr_actv) t
 GROUP BY flag
 )a join (
     SELECT sum(pay_usr_cnt_1d) as pay_usr_cnt_1d,
          sum(trial_usr_cnt_1d) as trial_usr_cnt_1d,
          sum(trial_pay_usr_cnt_1d) as trial_pay_usr_cnt_1d,
          sum(pay_amt_total) as pay_amt_total,flag
    from(
        select 
            1 as flag,
            pay_usr_cnt_1d,
            trial_usr_cnt_1d,
            trial_pay_usr_cnt_1d,
            pay_amt_total
      from rpt_pub_trd_gp_ios_trial_usr_1d
      where ds >= '#startDate#' and ds <= '#endDate#'
      and platform = #platform# #where#
    )t group by flag
)b on  a.flag = b.flag
`;

export const listChartSQL = `
select a.ds,a.new_usr_actv,
b.pay_usr_cnt_1d,
b.trial_usr_cnt_1d,
b.trial_pay_usr_cnt_1d,
b.pay_amt_total
  from(
SELECT ds,  SUM(new_usr_actv) as new_usr_actv
  FROM(
SELECT ds, platform, country_name, product_type, new_usr_actv
  from rpt_pub_trd_gp_ios_trial_usr_1d
  where ds >= '#startDate#' and ds <= '#endDate#'
  and platform = #platform# #where1#
 GROUP BY ds, platform, country_name, product_type, new_usr_actv) t
 GROUP BY ds) a
  left join(
select ds,
       sum(pay_usr_cnt_1d) as pay_usr_cnt_1d,
       sum(trial_usr_cnt_1d) as trial_usr_cnt_1d,
       sum(trial_pay_usr_cnt_1d) as trial_pay_usr_cnt_1d,
       sum(pay_amt_total) as pay_amt_total
  from rpt_pub_trd_gp_ios_trial_usr_1d
  where ds >= '#startDate#' and ds <= '#endDate#'
  and platform = #platform# #where#
 group by ds
  ) b on a.ds= b.ds 
  order by a.ds
`;
