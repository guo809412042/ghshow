/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-05 10:33:58
 * @LastEditTime: 2021-01-14 18:36:52
 * @LastEditors: dongqi.zhao
 */

export const listSQL = `
 SELECT super.data_time,
       a.gp_sub_amount,     --GP订阅销售额
       a.gp_sub_revenue,    --GP订阅净收入
       b.gp_one_amount,     --GP单项销售额
       b.gp_one_revenue,    --GP单项净收入
       c.ios_sub_amount,    --IOS订阅销售额
       c.ios_sub_revenue,   --IOS订阅净收入
       d.ios_one_amount,    --IOS单项销售额
       d.ios_one_revenue,   --IOS单项净收入
       e.and_sub_amount,    --安卓订阅销售额
       e.and_sub_revenue    --安卓订阅净收入
FROM (
    SELECT data_time
from   holo_dws_pub_cld_sale_total_1d
where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  and  charged_type = 'rmb' 
GROUP BY data_time
)super LEFT JOIN (
    --GP订阅
    select 
        data_time,
        --GP销售额
        sum(CAST(charged_amount as FLOAT8)) as gp_sub_amount,
        --GP净收入
        sum(CAST(net_revenue as FLOAT8)) as gp_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY data_time
)a on super.data_time = a.data_time
LEFT JOIN (
    --GP单项
    select 
        data_time,
        --GP销售额
        sum(CAST(charged_amount as FLOAT8)) as gp_one_amount,
        --GP净收入
        sum(CAST(net_revenue as FLOAT8)) as gp_one_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY data_time
)b on super.data_time = b.data_time
LEFT JOIN (
    --IOS订阅
    select 
        data_time,
        --IOS销售额
        sum(CAST(charged_amount as FLOAT8)) as ios_sub_amount,
        --IOS净收入
        sum(CAST(net_revenue as FLOAT8)) as ios_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='IOS' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY data_time
)c on super.data_time = c.data_time
LEFT JOIN (
    --IOS单项
    select 
        data_time,
        --IOS销售额
        sum(CAST(charge_amount as FLOAT8)) as ios_one_amount,
        --IOS净收入
        sum(CAST(net_revenue as FLOAT8)) as ios_one_revenue 
    from   holo_dws_pub_cld_ios_onepay_cnt_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where# 
    and  charge_type = 'dollar' and channel='IOS' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY data_time
)d on super.data_time = d.data_time
LEFT JOIN (
    --国内安卓订阅
    select 
        data_time,
        --国内安卓销售额
        sum(CAST(charged_amount as FLOAT8)) as and_sub_amount,
        --国内安卓净收入
        sum(CAST(net_revenue as FLOAT8)) as and_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel not in ('GooglePlay','IOS') 
    GROUP BY data_time
)e on super.data_time = e.data_time
order by data_time desc
;`;

export const listChartSQL = `
SELECT super.data_time,super.app_product,
a.gp_sub_amount,     --GP订阅销售额
a.gp_sub_revenue,    --GP订阅净收入
b.gp_one_amount,     --GP单项销售额
b.gp_one_revenue,    --GP单项净收入
c.ios_sub_amount,    --IOS订阅销售额
c.ios_sub_revenue,   --IOS订阅净收入
d.ios_one_amount,    --IOS单项销售额
d.ios_one_revenue,   --IOS单项净收入
e.and_sub_amount,    --安卓订阅销售额
e.and_sub_revenue    --安卓订阅净收入
FROM (
    SELECT data_time ,app_product
from   holo_dws_pub_cld_sale_total_1d
where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  and  charged_type = 'rmb' 
and app_product is not null
GROUP BY data_time,app_product
)super LEFT JOIN (
    --GP订阅
    select 
        data_time,app_product,
        --GP销售额
        sum(CAST(charged_amount as FLOAT8)) as gp_sub_amount,
        --GP净收入
        sum(CAST(net_revenue as FLOAT8)) as gp_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY data_time,app_product
)a on super.data_time = a.data_time and super.app_product = a.app_product
LEFT JOIN (
    --GP单项
    select 
        data_time,app_product,
        --GP销售额
        sum(CAST(charged_amount as FLOAT8)) as gp_one_amount,
        --GP净收入
        sum(CAST(net_revenue as FLOAT8)) as gp_one_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY data_time,app_product
)b on super.data_time = b.data_time and super.app_product =b.app_product
LEFT JOIN (
    --IOS订阅
    select 
        data_time,app_product,
        --IOS销售额
        sum(CAST(charged_amount as FLOAT8)) as ios_sub_amount,
        --IOS净收入
        sum(CAST(net_revenue as FLOAT8)) as ios_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='IOS' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY data_time,app_product
)c on super.data_time = c.data_time and super.app_product =c.app_product
LEFT JOIN (
    --IOS单项
    select 
        data_time,app_product,
        --IOS销售额
        sum(CAST(charge_amount as FLOAT8)) as ios_one_amount,
        --IOS净收入
        sum(CAST(net_revenue as FLOAT8)) as ios_one_revenue 
    from   holo_dws_pub_cld_ios_onepay_cnt_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where# 
    and  charge_type = 'dollar' and channel='IOS' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY data_time,app_product
)d on super.data_time = d.data_time  and super.app_product =d.app_product
LEFT JOIN (
    --国内安卓订阅
    select 
        data_time,app_product,
        --国内安卓销售额
        sum(CAST(charged_amount as FLOAT8)) as and_sub_amount,
        --国内安卓净收入
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
a.gp_sub_amount,     --GP订阅销售额
a.gp_sub_revenue,    --GP订阅净收入
b.gp_one_amount,     --GP单项销售额
b.gp_one_revenue,    --GP单项净收入
c.ios_sub_amount,    --IOS订阅销售额
c.ios_sub_revenue,   --IOS订阅净收入
d.ios_one_amount,    --IOS单项销售额
d.ios_one_revenue,   --IOS单项净收入
e.and_sub_amount,    --安卓订阅销售额
e.and_sub_revenue    --安卓订阅净收入
FROM (
    SELECT app_product
from   holo_dws_pub_cld_sale_total_1d
where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  and  charged_type = 'rmb' 
and app_product is not null
GROUP BY app_product
)super LEFT JOIN (
    --GP订阅
    select 
        data_time,app_product,
        --GP销售额
        sum(CAST(charged_amount as FLOAT8)) as gp_sub_amount,
        --GP净收入
        sum(CAST(net_revenue as FLOAT8)) as gp_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY data_time,app_product
)a on super.app_product = a.app_product
LEFT JOIN (
    --GP单项
    select 
        app_product,
        --GP销售额
        sum(CAST(charged_amount as FLOAT8)) as gp_one_amount,
        --GP净收入
        sum(CAST(net_revenue as FLOAT8)) as gp_one_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='GooglePlay' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY app_product
)b on  super.app_product =b.app_product
LEFT JOIN (
    --IOS订阅
    select 
        app_product,
        --IOS销售额
        sum(CAST(charged_amount as FLOAT8)) as ios_sub_amount,
        --IOS净收入
        sum(CAST(net_revenue as FLOAT8)) as ios_sub_revenue 
    from   holo_dws_pub_cld_sale_total_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#'  #where#
    and  charged_type = 'dollar' and channel='IOS' and sku_type='Inapp_Subscriptions_Autorenewable'
    GROUP BY app_product
)c on  super.app_product =c.app_product
LEFT JOIN (
    --IOS单项
    select 
        app_product,
        --IOS销售额
        sum(CAST(charge_amount as FLOAT8)) as ios_one_amount,
        --IOS净收入
        sum(CAST(net_revenue as FLOAT8)) as ios_one_revenue 
    from   holo_dws_pub_cld_ios_onepay_cnt_1d
    where data_time >= '#startDate#' and data_time <= '#endDate#' #where# 
    and  charge_type = 'dollar' and channel='IOS' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
    GROUP BY app_product
)d on super.app_product =d.app_product
LEFT JOIN (
    --国内安卓订阅
    select 
        app_product,
        --国内安卓销售额
        sum(CAST(charged_amount as FLOAT8)) as and_sub_amount,
        --国内安卓净收入
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
SELECT a.gp_sub_amount,     --GP订阅销售额
      a.gp_sub_revenue,    --GP订阅净收入
      b.gp_one_amount,     --GP单项销售额
      b.gp_one_revenue,    --GP单项净收入
      c.ios_sub_amount,    --IOS订阅销售额
      c.ios_sub_revenue,   --IOS订阅净收入
      d.ios_one_amount,    --IOS单项销售额
      d.ios_one_revenue,   --IOS单项净收入
      e.and_sub_amount,    --安卓订阅销售额
      e.and_sub_revenue    --安卓订阅净收入
FROM (
   --GP订阅
   select 
        1 as flag,
       --GP销售额
       sum(CAST(charged_amount as FLOAT8)) as gp_sub_amount,
       --GP净收入
       sum(CAST(net_revenue as FLOAT8)) as gp_sub_revenue 
   from   holo_dws_pub_cld_sale_total_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  
   and  charged_type = 'dollar' and channel='GooglePlay' and sku_type='Inapp_Subscriptions_Autorenewable'
)a 
LEFT JOIN (
     
   --GP单项
   select 
        1 as flag,
       --GP销售额
       sum(CAST(charged_amount as FLOAT8)) as gp_one_amount,
       --GP净收入
       sum(CAST(net_revenue as FLOAT8)) as gp_one_revenue 
   from   holo_dws_pub_cld_sale_total_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  
   and  charged_type = 'dollar' and channel='GooglePlay' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
)b on a.flag = b.flag
LEFT JOIN (
     
   --IOS订阅
   select 
         1 as flag,
       --IOS销售额
       sum(CAST(charged_amount as FLOAT8)) as ios_sub_amount,
       --IOS净收入
       sum(CAST(net_revenue as FLOAT8)) as ios_sub_revenue 
   from   holo_dws_pub_cld_sale_total_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where# 
   and  charged_type = 'dollar' and channel='IOS' and sku_type='Inapp_Subscriptions_Autorenewable'
)c on a.flag = c.flag
LEFT JOIN (
     
   --IOS单项
   select 
        1 as flag,
       --IOS销售额
       sum(CAST(charge_amount as FLOAT8)) as ios_one_amount,
       --IOS净收入
       sum(CAST(net_revenue as FLOAT8)) as ios_one_revenue 
   from   holo_dws_pub_cld_ios_onepay_cnt_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where# 
   and  charge_type = 'dollar' and channel='IOS' and sku_type not  in ('Inapp_Subscriptions_Autorenewable')
)d on a.flag = d.flag
LEFT JOIN (
    
   --国内安卓订阅
   select 
        1 as flag,
       --国内安卓销售额
       sum(CAST(charged_amount as FLOAT8)) as and_sub_amount,
       --国内安卓净收入
       sum(CAST(net_revenue as FLOAT8)) as and_sub_revenue 
   from   holo_dws_pub_cld_sale_total_1d
   where data_time >= '#startDate#' and data_time <= '#endDate#' #where#  
   and  charged_type = 'dollar' and channel not in ('GooglePlay','IOS') 
)e on a.flag = e.flag
;`;
