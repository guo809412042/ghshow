/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-05 10:33:58
 * @LastEditTime: 2021-05-17 16:04:56
 * @LastEditors: dongqi.zhao
 */
export const countryListSql = `
/*+engine=mpp*/
select distinct(country_name) from vcm_pub_trd_mau_arpu where country_name is not null;
`;

export const listSQL = `
/*+engine=mpp*/
SELECT country_name,
ds,
platform_id,
mau,
reg,
round(reg/mau,3) as reg_rate,
CEILING(ad_revenue+ (sub_amount-return_amount)*bonus)  AS all_amount,
CEILING(ad_revenue)  AS ad_revenue,
CEILING(net_revenue)  AS real_amount,
CEILING(sub_amount)  AS sub_amount,
bonus,
round((ad_revenue+ (sub_amount-return_amount)*bonus) /mau, 4)  AS all_arpu,
round(ad_revenue/mau, 4)  AS ad_arpu,
round((sub_amount-return_amount)*bonus/mau, 4)  sub_arpu,
product_id,
return_amount,
net_revenue
FROM vcm_pub_trd_mau_arpu
WHERE #where#
;`;

export const allListSQL = `
/*+engine=mpp*/
SELECT 
       a.ds,
       a.platform_id,
       a.product_id,
       sum(a.mau) AS mau,
       sum(a.return_amount) AS return_amount,
       sum(reg) AS reg,
       round(sum(reg)/ sum(mau),3) as reg_rate,
       CEILING(sum(ad_revenue)+ sum(net_revenue))  AS all_amount,
       CEILING(sum(ad_revenue))  AS ad_revenue,
       CEILING(sum(net_revenue))  AS real_amount,
       CEILING(sum(sub_amount))  AS sub_amount,
       '0.7'AS bonus,
       round((sum(ad_revenue)+ sum(bsub_amount) - sum(breturn_amount)) /sum(mau), 4)  AS all_arpu,
       round(sum(ad_revenue)/sum(mau), 4)  AS ad_arpu,
       round((sum(bsub_amount)- sum(breturn_amount))/sum(mau), 4)  sub_arpu
  FROM(SELECT 
       ds,
       platform_id,
       mau,
       reg,
       sub_amount,
       sub_amount*bonus AS bsub_amount,
       return_amount*bonus AS breturn_amount,
       ad_revenue,
       bonus,
       product_id,
       return_amount,
       net_revenue
  FROM vcm_pub_trd_mau_arpu
 WHERE  #where#
  ) a
  GROUP BY
 a.ds,
 a.platform_id,
 a.product_id
;`;

export const allCountryListSQL = `
/*+engine=mpp*/
SELECT 
       a.ds,
       a.platform_id,
       a.product_id,
       a.country_name,
       sum(a.mau) AS mau,
       sum(a.return_amount) AS return_amount,
       sum(reg) AS reg,
       round(sum(reg)/ sum(mau),3) as reg_rate,
       CEILING(sum(ad_revenue)+ sum(net_revenue))  AS all_amount,
       CEILING(sum(ad_revenue))  AS ad_revenue,
       CEILING(sum(net_revenue))  AS real_amount,
       CEILING(sum(sub_amount))  AS sub_amount,
       a.bonus,
       round((sum(ad_revenue)+ sum(bsub_amount) - sum(breturn_amount)) /sum(mau), 4)  AS all_arpu,
       round(sum(ad_revenue)/sum(mau), 4)  AS ad_arpu,
       round((sum(bsub_amount)- sum(breturn_amount))/sum(mau), 4)  sub_arpu
  FROM(SELECT 
       ds,
       platform_id,
       mau,
       reg,
       sub_amount,
       sub_amount*bonus AS bsub_amount,
       return_amount*bonus AS breturn_amount,
       ad_revenue,
       bonus,
       product_id,
       country_name,
       return_amount
  FROM vcm_pub_trd_mau_arpu
 WHERE  #where#
  ) a
  GROUP BY
 a.ds,
 a.platform_id,
 a.product_id,
 a.country_name,
 a.bonus
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
