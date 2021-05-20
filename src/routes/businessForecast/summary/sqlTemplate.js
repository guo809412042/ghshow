/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-01 11:18:56
 * @LastEditTime: 2020-05-01 20:14:36
 * @LastEditors: ssssslf
 */

export const listSQL = `
 /*+engine=mpp*/
 select
 data_time
 ,round(gp_amt_total_1d,2) AS gp_amt_total_1d   
 ,round(anrd_consum_cnt_1d,2) AS anrd_consum_cnt_1d   
 ,round(anrd_consum_amt_total_1d,2) AS anrd_consum_amt_total_1d   
 ,round(anrd_amt_total_1d,2)as anrd_amt_total_1d
 ,round(ios_amt_total_1d,2) AS ios_amt_total_1d 
 ,round(gp_amt_usr_cnt_1d,2) as gp_amt_usr_cnt_1d
 ,round(ios_amt_usr_cnt_1d,2) as ios_amt_usr_cnt_1d
 ,round(anrd_amt_usr_cnt_1d,2) as anrd_amt_usr_cnt_1d
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
 ,round(zr_gp_new_usr_cnt,2) as zr_gp_new_usr_cnt
 ,round(zr_ios_new_usr_cnt,2)as zr_ios_new_usr_cnt
 ,round(zr_and_new_usr_cnt,2)as zr_and_new_usr_cnt
 ,round(tf_gp_new_usr_cnt,2) as tf_gp_new_usr_cnt
 ,round(tf_and_new_usr_cnt,2) as tf_and_new_usr_cnt
 ,round(tf_ios_new_usr_cnt,2)as tf_ios_new_usr_cnt
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
  ,SUM(anrd_consum_cnt_1d) AS anrd_consum_cnt_1d
  ,SUM(anrd_consum_amt_total_1d) AS anrd_consum_amt_total_1d
  ,SUM(gp_amt_total_1d) AS gp_amt_total_1d   
  ,SUM(ios_amt_total_1d) AS ios_amt_total_1d 
  ,SUM(gp_amt_usr_cnt_1d) as gp_amt_usr_cnt_1d
  ,SUM(ios_amt_usr_cnt_1d) as ios_amt_usr_cnt_1d
  ,SUM(anrd_amt_usr_cnt_1d) as anrd_amt_usr_cnt_1d
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
  ,SUM(anrd_one_new_month_usr_cnt_1d) as anrd_one_new_month_usr_cnt_1d
  ,SUM(anrd_one_new_year_usr_cnt_1d) as anrd_one_new_year_usr_cnt_1d
  ,SUM(anrd_sub_new_month_usr_cnt_1d) as anrd_sub_new_month_usr_cnt_1d
  ,SUM(anrd_one_old_month_usr_cnt_1d) as anrd_one_old_month_usr_cnt_1d
  ,SUM(anrd_sub_old_month_usr_cnt_1d) as anrd_sub_old_month_usr_cnt_1d
  ,SUM(anrd_one_old_year_usr_cnt_1d) as anrd_one_old_year_usr_cnt_1d
  ,SUM(if(is_throw  = 0,gp_new_usr_cnt_1d,0)) as zr_gp_new_usr_cnt
  ,SUM(if(is_throw  = 0,ios_new_usr_cnt_1d,0))as zr_ios_new_usr_cnt
  ,SUM(if(is_throw  = 0,anrd_new_usr_cnt_1d,0))as zr_and_new_usr_cnt
  ,SUM(if(is_throw  = 1,gp_new_usr_cnt_1d,0)) as tf_gp_new_usr_cnt
  ,SUM(if(is_throw  = 1,ios_new_usr_cnt_1d,0))as tf_ios_new_usr_cnt
  ,SUM(if(is_throw  = 1,anrd_new_usr_cnt_1d,0))as tf_and_new_usr_cnt
from ads_pub_rtd_cld_forecast_revenue_1d 
WHERE   product_id = #product# and substr(data_time,1,6) >= '#startDate#' and substr(data_time,1,6) <='#endDate#' #where#
group by substr(data_time,1,6)
 )
order by data_time asc
;
 `;

export const refSQL = `
/*+engine=mpp*/
select data_time,
round(rfd_amt_total_gp,2 )as rfd_amt_total_gp,
round(rfd_amt_total_ios,2 )as rfd_amt_total_ios,
round(rfd_amt_total_and,2 )as rfd_amt_total_and
 from (
    SELECT 
    substr(data_time,1,6) as data_time,
    SUM(IF(pay_way = 'GP' , rfd_amt_total,0)) AS rfd_amt_total_gp,
    SUM(IF(pay_way = 'IOS' , rfd_amt_total,0)) AS rfd_amt_total_ios,
    SUM(IF(pay_way = 'AND' , rfd_amt_total,0)) AS rfd_amt_total_and
    from ads_pub_cld_slerfd_usr_cnt_1d
    where substr(data_time,1,6) >= '#startDate#' and substr(data_time,1,6) <= '#endDate#'
    and app_product in ('#type#')
    #where#
    GROUP BY substr(data_time,1,6)
 )
order by data_time  
`;
