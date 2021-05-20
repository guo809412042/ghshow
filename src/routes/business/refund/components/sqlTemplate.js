/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 10:10:34
 * @LastEditTime: 2020-05-08 14:22:16
 * @LastEditors: ssssslf
 */
export const appProductSQL = `
SELECT  DISTINCT(app_product)  from ads_pub_cld_slerfd_usr_cnt_1d where app_product is not null
and app_product not in ('Camdy','KamStar')
`;

// 地区
export const countryNameSQL = `
select  country_name,country_code_2 as country_code from   dim_pub_log_country_code
`;

export const listSQL = `
/*+engine=mpp*/
select data_time,
round(rfd_usr_total_gp,2 )as rfd_usr_total_gp,
round(rfd_amt_total_gp,2 )as rfd_amt_total_gp,
round(pay_usr_total_gp,2 )as pay_usr_total_gp,
round(pay_amt_total_gp,2 )as pay_amt_total_gp,

round(rfd_usr_total_ios,2 )as rfd_usr_total_ios,
round(rfd_amt_total_ios,2 )as rfd_amt_total_ios,
round(pay_usr_total_ios,2 )as pay_usr_total_ios,
round(pay_amt_total_ios,2 )as pay_amt_total_ios,

round(rfd_usr_total_and,2 )as rfd_usr_total_and,
round(rfd_amt_total_and,2 )as rfd_amt_total_and,
round(pay_usr_total_and,2 )as pay_usr_total_and,
round(pay_amt_total_and,2 )as pay_amt_total_and,

round(pay_amt_total,2 )as pay_amt_total,
round(rfd_usr_total,2 )as rfd_usr_total,
round(rfd_amt_total,2 )as rfd_amt_total,
round(pay_usr_total,2 )as pay_usr_total
 from (
    SELECT 
    data_time,
    SUM(IF(pay_way = 'GP' , rfd_usr_total,0)) AS rfd_usr_total_gp,
    SUM(IF(pay_way = 'GP' , rfd_amt_total,0)) AS rfd_amt_total_gp,
    SUM(IF(pay_way = 'GP' , pay_usr_total,0)) AS pay_usr_total_gp,
    SUM(IF(pay_way = 'GP' , pay_amt_total,0)) AS pay_amt_total_gp,
    
    SUM(IF(pay_way = 'IOS' , rfd_usr_total,0)) AS rfd_usr_total_ios,
    SUM(IF(pay_way = 'IOS' , rfd_amt_total,0)) AS rfd_amt_total_ios,
    SUM(IF(pay_way = 'IOS' , pay_usr_total,0)) AS pay_usr_total_ios,
    SUM(IF(pay_way = 'IOS' , pay_amt_total,0)) AS pay_amt_total_ios,
    
    SUM(IF(pay_way = 'AND' , rfd_usr_total,0)) AS rfd_usr_total_and,
    SUM(IF(pay_way = 'AND' , rfd_amt_total,0)) AS rfd_amt_total_and,
    SUM(IF(pay_way = 'AND' , pay_usr_total,0)) AS pay_usr_total_and,
    SUM(IF(pay_way = 'AND' , pay_amt_total,0)) AS pay_amt_total_and,
    
    SUM(rfd_usr_total) AS rfd_usr_total,
    SUM(rfd_amt_total) AS rfd_amt_total,
    SUM(pay_usr_total) AS pay_usr_total,
    SUM(pay_amt_total) AS pay_amt_total
    from ads_pub_cld_slerfd_usr_cnt_1d
    where
    data_time >= '#startDate#' and data_time <= '#endDate#'
    #where#
    GROUP BY data_time
 )
order by data_time desc 
`;

export const listMonthSQL = `
/*+engine=mpp*/
select 
round(rfd_usr_total_gp,2 )as rfd_usr_total_gp,
round(rfd_amt_total_gp,2 )as rfd_amt_total_gp,
round(pay_usr_total_gp,2 )as pay_usr_total_gp,
round(pay_amt_total_gp,2 )as pay_amt_total_gp,

round(rfd_usr_total_ios,2 )as rfd_usr_total_ios,
round(rfd_amt_total_ios,2 )as rfd_amt_total_ios,
round(pay_usr_total_ios,2 )as pay_usr_total_ios,
round(pay_amt_total_ios,2 )as pay_amt_total_ios,

round(rfd_usr_total_and,2 )as rfd_usr_total_and,
round(rfd_amt_total_and,2 )as rfd_amt_total_and,
round(pay_usr_total_and,2 )as pay_usr_total_and,
round(pay_amt_total_and,2 )as pay_amt_total_and,

round(pay_amt_total,2 )as pay_amt_total,
round(rfd_usr_total,2 )as rfd_usr_total,
round(rfd_amt_total,2 )as rfd_amt_total,
round(pay_usr_total,2 )as pay_usr_total

 from (
    SELECT 
    SUM(IF(pay_way = 'GP' , rfd_usr_total,0)) AS rfd_usr_total_gp,
    SUM(IF(pay_way = 'GP' , rfd_amt_total,0)) AS rfd_amt_total_gp,
    SUM(IF(pay_way = 'GP' , pay_usr_total,0)) AS pay_usr_total_gp,
    SUM(IF(pay_way = 'GP' , pay_amt_total,0)) AS pay_amt_total_gp,
    
    SUM(IF(pay_way = 'IOS' , rfd_usr_total,0)) AS rfd_usr_total_ios,
    SUM(IF(pay_way = 'IOS' , rfd_amt_total,0)) AS rfd_amt_total_ios,
    SUM(IF(pay_way = 'IOS' , pay_usr_total,0)) AS pay_usr_total_ios,
    SUM(IF(pay_way = 'IOS' , pay_amt_total,0)) AS pay_amt_total_ios,
    
    SUM(IF(pay_way = 'AND' , rfd_usr_total,0)) AS rfd_usr_total_and,
    SUM(IF(pay_way = 'AND' , rfd_amt_total,0)) AS rfd_amt_total_and,
    SUM(IF(pay_way = 'AND' , pay_usr_total,0)) AS pay_usr_total_and,
    SUM(IF(pay_way = 'AND' , pay_amt_total,0)) AS pay_amt_total_and,
    
    SUM(rfd_usr_total) AS rfd_usr_total,
    SUM(rfd_amt_total) AS rfd_amt_total,
    SUM(pay_usr_total) AS pay_usr_total,
    SUM(pay_amt_total) AS pay_amt_total
    from ads_pub_cld_slerfd_usr_cnt_1d
    where
    data_time >= '#startDate#' and data_time <= '#endDate#'
    #where#
 )
`;

export const listChartSQL = `
/*+engine=mpp*/
select data_time,
round(rfd_usr_total_gp,2 )as rfd_usr_total_gp,
round(rfd_amt_total_gp,2 )as rfd_amt_total_gp,
round(pay_usr_total_gp,2 )as pay_usr_total_gp,
round(pay_amt_total_gp,2 )as pay_amt_total_gp,

round(rfd_usr_total_ios,2 )as rfd_usr_total_ios,
round(rfd_amt_total_ios,2 )as rfd_amt_total_ios,
round(pay_usr_total_ios,2 )as pay_usr_total_ios,
round(pay_amt_total_ios,2 )as pay_amt_total_ios,

round(rfd_usr_total_and,2 )as rfd_usr_total_and,
round(rfd_amt_total_and,2 )as rfd_amt_total_and,
round(pay_usr_total_and,2 )as pay_usr_total_and,
round(pay_amt_total_and,2 )as pay_amt_total_and,

round(pay_amt_total,2 )as pay_amt_total,
round(rfd_usr_total,2 )as rfd_usr_total,
round(rfd_amt_total,2 )as rfd_amt_total,
round(pay_usr_total,2 )as pay_usr_total
 from (
    SELECT 
    data_time,
    SUM(IF(pay_way = 'GP' , rfd_usr_total,0)) AS rfd_usr_total_gp,
    SUM(IF(pay_way = 'GP' , rfd_amt_total,0)) AS rfd_amt_total_gp,
    SUM(IF(pay_way = 'GP' , pay_usr_total,0)) AS pay_usr_total_gp,
    SUM(IF(pay_way = 'GP' , pay_amt_total,0)) AS pay_amt_total_gp,
    
    SUM(IF(pay_way = 'IOS' , rfd_usr_total,0)) AS rfd_usr_total_ios,
    SUM(IF(pay_way = 'IOS' , rfd_amt_total,0)) AS rfd_amt_total_ios,
    SUM(IF(pay_way = 'IOS' , pay_usr_total,0)) AS pay_usr_total_ios,
    SUM(IF(pay_way = 'IOS' , pay_amt_total,0)) AS pay_amt_total_ios,
    
    SUM(IF(pay_way = 'AND' , rfd_usr_total,0)) AS rfd_usr_total_and,
    SUM(IF(pay_way = 'AND' , rfd_amt_total,0)) AS rfd_amt_total_and,
    SUM(IF(pay_way = 'AND' , pay_usr_total,0)) AS pay_usr_total_and,
    SUM(IF(pay_way = 'AND' , pay_amt_total,0)) AS pay_amt_total_and,
    
    SUM(rfd_usr_total) AS rfd_usr_total,
    SUM(rfd_amt_total) AS rfd_amt_total,
    SUM(pay_usr_total) AS pay_usr_total,
    SUM(pay_amt_total) AS pay_amt_total
    from ads_pub_cld_slerfd_usr_cnt_1d
    where
    data_time >= '#startDate#' and data_time <= '#endDate#'
    #where#
    GROUP BY data_time
 )
order by data_time  
`;
