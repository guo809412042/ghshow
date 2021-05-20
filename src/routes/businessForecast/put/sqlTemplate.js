/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-01 14:10:23
 * @LastEditTime: 2020-07-31 17:10:03
 * @LastEditors: ssssslf
 */

export const listSQL = `
 /*+engine=mpp*/
 select
 data_time
 ,round(gp_amt_total_1d / gp_new_usr_cnt_1d,2)  as gp_arpu
 ,round(ios_amt_total_1d / ios_new_usr_cnt_1d,2)  as ios_arpu
 ,round(anrd_amt_total_1d / anrd_new_usr_cnt_1d,2)  as anrd_arpu

 ,round(anrd_amt_usr_cnt_1d,2)  as anrd_amt_usr_cnt_1d
 ,round(gp_amt_usr_cnt_1d,2)  as gp_amt_usr_cnt_1d
 ,round(ios_amt_usr_cnt_1d,2)  as ios_amt_usr_cnt_1d

 ,round(gp_month_amt_total_1d,2) as gp_month_amt_total_1d
 ,round(gp_year_amt_total_1d,2) as gp_year_amt_total_1d
 ,round(ios_month_amt_total_1d,2) as ios_month_amt_total_1d
 ,round(ios_year_amt_total_1d,2) as ios_year_amt_total_1d
 ,round(anrd_year_amt_total_1d,2) as anrd_year_amt_total_1d
 ,round(gp_cost_total_1d,2) as gp_cost_total_1d
 ,round(ios_cost_total_1d,2) as ios_cost_total_1d
 ,round(anrd_month_amt_total_1d,2) as anrd_month_amt_total_1d
 ,round(anrd_cost_total_1d,2) as anrd_cost_total_1d


 ,round(gp_new_month_usr_cnt_1d  / gp_new_usr_cnt_1d,2)  as gp_new_month_rate
 ,round(gp_new_year_usr_cnt_1d  / gp_new_usr_cnt_1d,2)  as gp_new_year_rate
 ,round(ios_new_month_usr_cnt_1d  / ios_new_usr_cnt_1d,2)  as ios_new_month_rate
 ,round(ios_new_year_usr_cnt_1d  / ios_new_usr_cnt_1d,2)  as ios_new_year_rate
 ,round(anrd_sub_new_month_usr_cnt_1d  /anrd_new_usr_cnt_1d,2) as and_month_rate
 ,round(anrd_sub_old_month_usr_cnt_1d/anrd_new_usr_cnt_1d,2) as and_sub_month_rate
 ,round(gp_amt_total_1d,2) AS gp_amt_total_1d   
 ,round(anrd_amt_total_1d,2)as anrd_amt_total_1d
 ,round(ios_amt_total_1d,2) AS ios_amt_total_1d 
 ,round(ios_new_month_usr_cnt_1d,2) as ios_new_month_usr_cnt_1d
 ,round(ios_new_year_usr_cnt_1d,2) as ios_new_year_usr_cnt_1d
 ,round(gp_new_month_usr_cnt_1d,2) as gp_new_month_usr_cnt_1d    
 ,round(gp_new_year_usr_cnt_1d,2) as gp_new_year_usr_cnt_1d 
 ,round(ios_old_month_usr_cnt_1d,2) as ios_old_month_usr_cnt_1d  
 ,round(ios_old_year_usr_cnt_1d,2) as ios_old_year_usr_cnt_1d
 ,round(gp_old_month_usr_cnt_1d,2) as gp_old_month_usr_cnt_1d
 ,round(gp_old_year_usr_cnt_1d,2) as gp_old_year_usr_cnt_1d
 ,round(gp_new_usr_cnt_1d,2) as gp_new_usr_cnt_1d
 ,round(ios_new_usr_cnt_1d,2) as ios_new_usr_cnt_1d
 ,round(anrd_new_usr_cnt_1d,2) as anrd_new_usr_cnt_1d
 ,round(anrd_one_new_month_usr_cnt_1d,2) as anrd_one_new_month_usr_cnt_1d
 ,round(anrd_one_new_year_usr_cnt_1d,2) as anrd_one_new_year_usr_cnt_1d
 ,round(anrd_sub_new_month_usr_cnt_1d,2) as anrd_sub_new_month_usr_cnt_1d
 ,round(anrd_one_old_month_usr_cnt_1d,2) as anrd_one_old_month_usr_cnt_1d
 ,round(anrd_sub_old_month_usr_cnt_1d,2) as anrd_sub_old_month_usr_cnt_1d
 ,round(anrd_one_old_year_usr_cnt_1d,2) as anrd_one_old_year_usr_cnt_1d
 ,round(amt_total_1d,2) as amt_total_1d
  from (
  SELECT 
  substr(data_time,1,6) as data_time
  ,SUM(amt_total_1d) AS amt_total_1d
  ,SUM(anrd_new_usr_cnt_1d) AS anrd_new_usr_cnt_1d
  ,SUM(gp_amt_total_1d) AS gp_amt_total_1d   
  ,SUM(ios_amt_total_1d) AS ios_amt_total_1d 
  ,SUM(gp_amt_usr_cnt_1d) as gp_amt_usr_cnt_1d
  ,SUM(ios_amt_usr_cnt_1d) as ios_amt_usr_cnt_1d
  ,SUM(ios_new_month_usr_cnt_1d) as ios_new_month_usr_cnt_1d
  ,SUM(ios_new_year_usr_cnt_1d) as ios_new_year_usr_cnt_1d
  ,SUM(gp_new_month_usr_cnt_1d) as gp_new_month_usr_cnt_1d    
  ,SUM(gp_new_year_usr_cnt_1d) as gp_new_year_usr_cnt_1d 
  ,SUM(ios_old_month_usr_cnt_1d) as ios_old_month_usr_cnt_1d  
  ,SUM(ios_old_year_usr_cnt_1d) as ios_old_year_usr_cnt_1d
  ,SUM(gp_old_month_usr_cnt_1d) as gp_old_month_usr_cnt_1d
  ,SUM(gp_old_year_usr_cnt_1d) as gp_old_year_usr_cnt_1d
  ,SUM(gp_new_usr_cnt_1d) as gp_new_usr_cnt_1d
  ,SUM(ios_new_usr_cnt_1d) as ios_new_usr_cnt_1d
  ,SUM(anrd_amt_total_1d) as anrd_amt_total_1d
  ,SUM(anrd_amt_usr_cnt_1d) as anrd_amt_usr_cnt_1d
  ,SUM(gp_month_amt_total_1d) as gp_month_amt_total_1d
  ,SUM(anrd_cost_total_1d) as anrd_cost_total_1d
  ,SUM(anrd_month_amt_total_1d) as anrd_month_amt_total_1d
  ,SUM(gp_year_amt_total_1d) as gp_year_amt_total_1d
  ,SUM(ios_month_amt_total_1d) as ios_month_amt_total_1d
  ,SUM(ios_year_amt_total_1d) as ios_year_amt_total_1d
  ,SUM(anrd_year_amt_total_1d) as anrd_year_amt_total_1d
  ,SUM(gp_cost_total_1d) as gp_cost_total_1d
  ,SUM(ios_cost_total_1d) as ios_cost_total_1d


  ,SUM(anrd_one_new_month_usr_cnt_1d) as anrd_one_new_month_usr_cnt_1d
  ,SUM(anrd_one_new_year_usr_cnt_1d) as anrd_one_new_year_usr_cnt_1d
  ,SUM(anrd_sub_new_month_usr_cnt_1d) as anrd_sub_new_month_usr_cnt_1d
  ,SUM(anrd_one_old_month_usr_cnt_1d) as anrd_one_old_month_usr_cnt_1d
  ,SUM(anrd_sub_old_month_usr_cnt_1d) as anrd_sub_old_month_usr_cnt_1d
  ,SUM(anrd_one_old_year_usr_cnt_1d) as anrd_one_old_year_usr_cnt_1d
from ads_pub_rtd_forecast_revenue_1d 
WHERE   product_id = 2 and substr(data_time,1,6) >= '#startDate#' 
and is_throw = 1
and substr(data_time,1,6) <='#endDate#' #where#
group by substr(data_time,1,6)
 )
order by data_time 
;
 `;
