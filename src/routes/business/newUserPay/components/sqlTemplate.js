/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 10:10:34
 * @LastEditTime: 2020-04-29 17:23:53
 * @LastEditors: ssssslf
 */
export const appProductSQL = `
SELECT  DISTINCT(product_id)  from vcm_pub_log_throwusr_pay_cnt_1d
`;

// 地区
export const countryNameSQL = `
select  country_name,country_code_2 as country_code from   dim_pub_log_country_code
`;

export const skuTypeSQL = `
select DISTINCT(sku_id) from vcm_pub_log_throwusr_pay_cnt_1d where sku_id is not null  #where# `;

export const listSQL = `
select a. reg_time,
       a.user_total,
       round(b.pay_amt_total,2) as pay_amt_total,
       b.interval_day,
       round(b.pay_usr_cnt_1d,2) as pay_usr_cnt_1d,
       round(c.pay_total,2) as pay_total
  from(
SELECT reg_time, SUM(user_total) as user_total
  FROM(
SELECT reg_time, product_id, platform, country_name, user_total
  FROM vcm_pub_log_throwusr_pay_cnt_1d
 where reg_time>= '#startDate#'
   and reg_time<= '#endDate#'
    #where1#
   and platform in(#platform#)
 GROUP BY reg_time, product_id, platform, country_name, user_total)
 GROUP BY reg_time) a
  LEFT JOIN(
select reg_time, pay_amt_total,interval_day,pay_usr_cnt_1d
  from(
SELECT reg_time, sum(pay_amt_total) as pay_amt_total,interval_day, sum(pay_usr_cnt_1d) as pay_usr_cnt_1d
  FROM vcm_pub_log_throwusr_pay_cnt_1d
 where reg_time>= '#startDate#'
   and reg_time<= '#endDate#'
    #where#
    and interval_day is not null
   and platform in (#platform#)
   GROUP BY reg_time, interval_day)) b on a.reg_time= b.reg_time
  LEFT JOIN(
  select reg_time, pay_total
    from(
  SELECT reg_time, sum(pay_amt_total) as pay_total
    FROM vcm_pub_log_throwusr_pay_cnt_1d
    where reg_time>= '#startDate#'
      and reg_time<= '#endDate#'
      #where#
      and interval_day is not null
      and platform in (#platform#)
      GROUP BY reg_time)) c on a.reg_time= c.reg_time
      order by a.reg_time desc
 `;

export const chartSQL = `
select a.interval_day,a.user_total,b.pay_usr_cnt_1d,b.pay_amt_total from (
  SELECT interval_day, SUM(user_total) as user_total
  FROM(
SELECT interval_day, product_id, platform, country_name, user_total
  FROM vcm_pub_log_throwusr_pay_cnt_1d
 where reg_time>= '#startDate#'
   and reg_time<= '#endDate#'
    #where1#
   and platform in(#platform#)
   and interval_day is not null
 GROUP BY interval_day, product_id, platform, country_name, user_total)
 GROUP BY interval_day
)a left join (
select pay_usr_cnt_1d,pay_amt_total,interval_day from (
  SELECT sum(pay_amt_total) as pay_amt_total,
    interval_day,
       sum(pay_usr_cnt_1d) as pay_usr_cnt_1d
  FROM vcm_pub_log_throwusr_pay_cnt_1d
  where reg_time>= '#startDate#'
  and reg_time<= '#endDate#'
  #where#
  and interval_day is not null
  and platform in (#platform#)
 GROUP BY interval_day
order by interval_day
))b on a.interval_day = b.interval_day`;
