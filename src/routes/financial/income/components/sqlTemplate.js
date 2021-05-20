/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-28 13:08:12
 * @LastEditTime: 2020-05-07 21:43:21
 * @LastEditors: ssssslf
 */
export const countryCodeSQL = `
select  country_name,country_code_2 as country_code from   dim_pub_log_country_code
  `;

export const appProductListSQL = `
select distinct(app_product) from holo_dws_pub_cld_sale_total_1d;
`;

export const appProductSQL = `
  select DISTINCT  app_product
from(
     select DISTINCT app_product from  holo_dws_pub_cld_sale_total_1d where app_product not in ('Camdy','KamStar')
     union all 
     select DISTINCT app_product from  holo_dws_pub_cld_ios_onepay_cnt_1d where app_product not in ('Camdy','KamStar')
     union all
     select DISTINCT app_product from  holo_dwd_pub_log_ad_platform_data_di where app_product not in ('Camdy','KamStar')
)t

LIMIT 1000;
  `;

export const listSQL = `
SELECT super.data_time , a.net_revenue as net_revenuea, b.net_revenue as net_revenueb,c.and_revenue,d.gp_revenue,e.revenue,f.revenue_appa,g.revenue_appb,h.huawei_revenue
FROM (
    SELECT data_time
from   holo_dws_pub_cld_sale_total_1d
where data_time >= '#startDate#' and data_time <= '#endDate#' #where# #platform#  and  charged_type = '#type#' 
GROUP BY data_time
)super LEFT JOIN (

  select sum(CAST(net_revenue as FLOAT8)) as net_revenue ,
  data_time
  from   holo_dws_pub_cld_sale_total_1d
  where data_time >= '#startDate#' and data_time <= '#endDate#'  #where# #platform#     and  charged_type = '#type#' 
  and channel= 'IOS'
  group by data_time
)a on super.data_time = a.data_time
left join (
  select sum(CAST(net_revenue as FLOAT8)) as net_revenue ,
  data_time
  from   holo_dws_pub_cld_ios_onepay_cnt_1d
  where data_time >= '#startDate#' and data_time <= '#endDate#'  #where# #platform#   and  charge_type = '#type#'  
  and channel='IOS' and sku_type<>'App'
  group by data_time
)b on super.data_time = b.data_time
left join (
  select sum(CAST(net_revenue as FLOAT8)) as and_revenue ,
    data_time
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where# #platform#   and  charged_type = '#type#' 
      and channel not in ('GooglePlay','IOS','huawei') and sku_type<>'App'
    group by data_time
)c on super.data_time = c.data_time
left join (
  select sum(CAST(net_revenue as FLOAT8)) as gp_revenue ,
  data_time
  from   holo_dws_pub_cld_sale_total_1d
  where data_time >= '#startDate#' and data_time <= '#endDate#' #where# #platform#   and  charged_type = '#type#' 
 and channel='GooglePlay' and sku_type<>'App' 
  group by data_time
)d  on super.data_time = d.data_time
left join (
  select sum(revenue) as revenue ,
  data_time
  from   holo_dwd_pub_log_ad_platform_data_di
  where data_time >= '#startDate#' and data_time <= '#endDate#' #where# and  charge_type = '#type#' #placementid#
  group by data_time
)e  on super.data_time = e.data_time
left join (
  select sum(CAST(net_revenue as FLOAT8)) as revenue_appa ,
  data_time
  from   holo_dws_pub_cld_sale_total_1d
  where data_time >= '#startDate#' and data_time <= '#endDate#' #where# #platform#   and  charged_type = '#type#' 
  and channel='GooglePlay' and sku_type='App'
  group by data_time
)f  on super.data_time = f.data_time
left join (
  select sum(CAST(net_revenue as FLOAT8)) as revenue_appb ,
  data_time
  from   holo_dws_pub_cld_ios_onepay_cnt_1d
  where data_time >= '#startDate#' and data_time <= '#endDate#' #where# #platform#   and  charge_type = '#type#'  
  and channel='IOS' and sku_type='App' 
  group by data_time
)g  on super.data_time = g.data_time
LEFT JOIN (
  select sum(CAST(net_revenue as FLOAT8)) as huawei_revenue ,
  data_time
  from   holo_dws_pub_cld_sale_total_1d
  where data_time >= '#startDate#' and data_time <= '#endDate#' #where# #platform# and  charged_type = '#type#' 
  and channel= 'huawei'
  group by data_time
)h on super.data_time = h.data_time 
order by data_time desc
;
  `;
