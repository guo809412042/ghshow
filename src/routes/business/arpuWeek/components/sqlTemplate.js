/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-05 10:33:58
 * @LastEditTime: 2021-03-30 11:14:36
 * @LastEditors: dongqi.zhao
 */
export const countryListSql = `
/*+engine=mpp*/
select distinct(country_name) from vcm_pub_trd_dau_arpu where country_name is not null;
`;

export const listSQL = `
/*+engine=mpp*/
SELECT 
platform_id
,product_id
,CEILING(avg(dau)) AS adau
,CEILING(avg( reg)) AS areg
, round(avg( reg)/avg(dau) ,3) AS regrate
, CEILING( avg( ad_revenue))  AS ad_revenue
, round(avg( ad_revenue)/avg(dau),4) AS ad_arpu
,round( avg( ecpm), 4) AS ecpm
,CEILING( avg( sub_amount)) AS  sub_amount
,round( avg( sub_amount)/avg( reg),4) sub_arpu
FROM vcm_pub_trd_dau_arpu
WHERE #where#
GROUP BY platform_id
,product_id
;`;

export const allListSQL = `
/*+engine=mpp*/
SELECT 
 product_id
,platform_id
,CEILING(avg(a.dau)) AS adau
,CEILING(avg(a.reg)) AS areg
,round(avg(a.reg)/avg(a.dau) ,3) AS regrate
,CEILING(avg( a.ad_revenue))  AS ad_revenue
,round(avg(a.ad_revenue)/avg(a.dau),4) AS ad_arpu
,round(avg(a.ecpm), 4) AS ecpm
,CEILING(avg( a.sub_amount)) AS  sub_amount
,round( avg( a.sub_amount)/avg( a.reg),4) sub_arpu
FROM(
SELECT
product_id
,platform_id 
,ds
,SUM( dau) AS dau
,SUM(reg) AS reg
,sum(ad_revenue) AS ad_revenue
, avg(ecpm) AS ecpm
, SUM( sub_amount)  AS sub_amount
FROM vcm_pub_trd_dau_arpu
WHERE #where#
GROUP BY ds,product_id,platform_id
)a
GROUP BY a.product_id,a.platform_id
;`;

export const allCountryListSQL = `
/*+engine=mpp*/
SELECT 
 product_id
,platform_id
,country_name
,CEILING(avg(a.dau)) AS adau
,CEILING(avg(a.reg)) AS areg
,round(avg(a.reg)/avg(a.dau) ,3) AS regrate
,CEILING(avg( a.ad_revenue))  AS ad_revenue
,round(avg(a.ad_revenue)/avg(a.dau),4) AS ad_arpu
,round(avg(a.ecpm), 4) AS ecpm
,CEILING(avg( a.sub_amount)) AS  sub_amount
,round( avg( a.sub_amount)/avg( a.reg),4) sub_arpu
FROM(
SELECT
product_id
,platform_id 
,country_name
,ds
,SUM( dau) AS dau
,SUM(reg) AS reg
,sum(ad_revenue) AS ad_revenue
, avg(ecpm) AS ecpm
, SUM( sub_amount)  AS sub_amount
FROM vcm_pub_trd_dau_arpu
WHERE #where#
GROUP BY ds,product_id,platform_id, country_name
)a
GROUP BY a.product_id,a.platform_id, a.country_name
;`;

export const listChartSQL = `
SELECT super.data_time,super.app_product,
a.gp_sub_amount,     --GP???????????????
a.gp_sub_revenue,    --GP???????????????
b.gp_one_amount,     --GP???????????????
b.gp_one_revenue,    --GP???????????????
c.ios_sub_amount,    --IOS???????????????
c.ios_sub_revenue,   --IOS???????????????
d.ios_one_amount,    --IOS???????????????
d.ios_one_revenue,   --IOS???????????????
e.and_sub_amount,    --?????????????????????
e.and_sub_revenue    --?????????????????????
FROM (
    SELECT data_time ,app_product
from   holo_dws_pub_cld_sale_total_1d
where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  and  charged_type = 'rmb' 
and app_product is not null
GROUP BY data_time,app_product
)super LEFT JOIN (
    --GP??????
    select 
        data_time,app_product,
        --GP?????????
        sum(CAST(charged_amount as FLOAT8)) as gp_sub_amount,
        --GP?????????
        sum(CAST(net_revenue as FLOAT8)) as gp_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY data_time,app_product
)a on super.data_time = a.data_time and super.app_product = a.app_product
LEFT JOIN (
    --GP??????
    select 
        data_time,app_product,
        --GP?????????
        sum(CAST(charged_amount as FLOAT8)) as gp_one_amount,
        --GP?????????
        sum(CAST(net_revenue as FLOAT8)) as gp_one_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY data_time,app_product
)b on super.data_time = b.data_time and super.app_product =b.app_product
LEFT JOIN (
    --IOS??????
    select 
        data_time,app_product,
        --IOS?????????
        sum(CAST(charged_amount as FLOAT8)) as ios_sub_amount,
        --IOS?????????
        sum(CAST(net_revenue as FLOAT8)) as ios_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='IOS' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY data_time,app_product
)c on super.data_time = c.data_time and super.app_product =c.app_product
LEFT JOIN (
    --IOS??????
    select 
        data_time,app_product,
        --IOS?????????
        sum(CAST(charge_amount as FLOAT8)) as ios_one_amount,
        --IOS?????????
        sum(CAST(net_revenue as FLOAT8)) as ios_one_revenue 
    from   holo_dws_pub_cld_ios_onepay_cnt_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where# 
    and  charge_type = 'dollar' and channel='IOS' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY data_time,app_product
)d on super.data_time = d.data_time  and super.app_product =d.app_product
LEFT JOIN (
    --??????????????????
    select 
        data_time,app_product,
        --?????????????????????
        sum(CAST(charged_amount as FLOAT8)) as and_sub_amount,
        --?????????????????????
        sum(CAST(net_revenue as FLOAT8)) as and_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel not in ('GooglePlay','IOS') 
    GROUP BY data_time,app_product
)e on super.data_time = e.data_time  and super.app_product =e.app_product
order by data_time ,app_product 
;`;


export const listChartMonSQL = `
SELECT super.app_product,
a.gp_sub_amount,     --GP???????????????
a.gp_sub_revenue,    --GP???????????????
b.gp_one_amount,     --GP???????????????
b.gp_one_revenue,    --GP???????????????
c.ios_sub_amount,    --IOS???????????????
c.ios_sub_revenue,   --IOS???????????????
d.ios_one_amount,    --IOS???????????????
d.ios_one_revenue,   --IOS???????????????
e.and_sub_amount,    --?????????????????????
e.and_sub_revenue    --?????????????????????
FROM (
    SELECT app_product
from   holo_dws_pub_cld_sale_total_1d
where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  and  charged_type = 'rmb' 
and app_product is not null
GROUP BY app_product
)super LEFT JOIN (
    --GP??????
    select 
        data_time,app_product,
        --GP?????????
        sum(CAST(charged_amount as FLOAT8)) as gp_sub_amount,
        --GP?????????
        sum(CAST(net_revenue as FLOAT8)) as gp_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY data_time,app_product
)a on super.app_product = a.app_product
LEFT JOIN (
    --GP??????
    select 
        app_product,
        --GP?????????
        sum(CAST(charged_amount as FLOAT8)) as gp_one_amount,
        --GP?????????
        sum(CAST(net_revenue as FLOAT8)) as gp_one_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY app_product
)b on  super.app_product =b.app_product
LEFT JOIN (
    --IOS??????
    select 
        app_product,
        --IOS?????????
        sum(CAST(charged_amount as FLOAT8)) as ios_sub_amount,
        --IOS?????????
        sum(CAST(net_revenue as FLOAT8)) as ios_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='IOS' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY app_product
)c on  super.app_product =c.app_product
LEFT JOIN (
    --IOS??????
    select 
        app_product,
        --IOS?????????
        sum(CAST(charge_amount as FLOAT8)) as ios_one_amount,
        --IOS?????????
        sum(CAST(net_revenue as FLOAT8)) as ios_one_revenue 
    from   holo_dws_pub_cld_ios_onepay_cnt_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where# 
    and  charge_type = 'dollar' and channel='IOS' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY app_product
)d on super.app_product =d.app_product
LEFT JOIN (
    --??????????????????
    select 
        app_product,
        --?????????????????????
        sum(CAST(charged_amount as FLOAT8)) as and_sub_amount,
        --?????????????????????
        sum(CAST(net_revenue as FLOAT8)) as and_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel not in ('GooglePlay','IOS') 
    GROUP BY app_product
)e on super.app_product =e.app_product
order by  app_product 
;`;


export const appProductSQL = `
SELECT  DISTINCT(app_product)  from holo_dws_pub_cld_sale_total_1d where app_product not in ('Camdy','KamStar')
`;

export const listMonSQL = `
SELECT a.gp_sub_amount,     --GP???????????????
      a.gp_sub_revenue,    --GP???????????????
      b.gp_one_amount,     --GP???????????????
      b.gp_one_revenue,    --GP???????????????
      c.ios_sub_amount,    --IOS???????????????
      c.ios_sub_revenue,   --IOS???????????????
      d.ios_one_amount,    --IOS???????????????
      d.ios_one_revenue,   --IOS???????????????
      e.and_sub_amount,    --?????????????????????
      e.and_sub_revenue    --?????????????????????
FROM (
   --GP??????
   select 
        1 as flag,
       --GP?????????
       sum(CAST(charged_amount as FLOAT8)) as gp_sub_amount,
       --GP?????????
       sum(CAST(net_revenue as FLOAT8)) as gp_sub_revenue 
   from   holo_dws_pub_cld_sale_total_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  
   and  charged_type = 'dollar' and channel='GooglePlay' and sku_type='Inapp_Subscriptions_Autorenewable'
)a 
LEFT JOIN (
     
   --GP??????
   select 
        1 as flag,
       --GP?????????
       sum(CAST(charged_amount as FLOAT8)) as gp_one_amount,
       --GP?????????
       sum(CAST(net_revenue as FLOAT8)) as gp_one_revenue 
   from   holo_dws_pub_cld_sale_total_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  
   and  charged_type = 'dollar' and channel='GooglePlay' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
)b on a.flag = b.flag
LEFT JOIN (
     
   --IOS??????
   select 
         1 as flag,
       --IOS?????????
       sum(CAST(charged_amount as FLOAT8)) as ios_sub_amount,
       --IOS?????????
       sum(CAST(net_revenue as FLOAT8)) as ios_sub_revenue 
   from   holo_dws_pub_cld_sale_total_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where# 
   and  charged_type = 'dollar' and channel='IOS' and sku_type='Inapp_Subscriptions_Autorenewable'
)c on a.flag = c.flag
LEFT JOIN (
     
   --IOS??????
   select 
        1 as flag,
       --IOS?????????
       sum(CAST(charge_amount as FLOAT8)) as ios_one_amount,
       --IOS?????????
       sum(CAST(net_revenue as FLOAT8)) as ios_one_revenue 
   from   holo_dws_pub_cld_ios_onepay_cnt_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where# 
   and  charge_type = 'dollar' and channel='IOS' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
)d on a.flag = d.flag
LEFT JOIN (
    
   --??????????????????
   select 
        1 as flag,
       --?????????????????????
       sum(CAST(charged_amount as FLOAT8)) as and_sub_amount,
       --?????????????????????
       sum(CAST(net_revenue as FLOAT8)) as and_sub_revenue 
   from   holo_dws_pub_cld_sale_total_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  
   and  charged_type = 'dollar' and channel not in ('GooglePlay','IOS') 
)e on a.flag = e.flag
;`;
