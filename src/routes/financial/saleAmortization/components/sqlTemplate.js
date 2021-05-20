/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-27 14:56:55
 * @LastEditTime: 2021-01-22 13:49:42
 * @LastEditors: dongqi.zhao
 */
export const appProductSQL = `
SELECT  DISTINCT(app_product)  from rpt_pub_cld_sale_amortize_1m where app_product not in ('Camdy','KamStar')
`;

// 获取订阅类型
export const subTypeSQL = `
SELECT  DISTINCT(subscription_type)  from rpt_pub_cld_sale_amortize_1m where sku_type = 'Inapp_Subscriptions'
`;

export const channelSQL = `
SELECT  DISTINCT(channel)  from rpt_pub_cld_sale_amortize_1m
`;

// 购买类型
export const skuTypeSQL = `
SELECT  DISTINCT(sku_type)  from rpt_pub_cld_sale_amortize_1m
`;

// 地区
export const countryCodeSQL = `
SELECT  DISTINCT(country_code)  from rpt_pub_cld_sale_amortize_1m
`;

export const saleSQL = `
/*+engine=MPP*/
select
order_month,
subscription_type,
country_code,
kp_country_type,
channel,
app_product,
sku_type,
round(current_order_to_amortize_amount,2) as current_order_to_amortize_amount,
round(current_order_amortized_amount,2) as current_order_amortized_amount,
round(current_order_to_amortize_in_future_amount,2) as current_order_to_amortize_in_future_amount,
round(current_order_to_amortize_over_1y_amount,2) as current_order_to_amortize_over_1y_amount,
round(his_order_to_amorize_amount,2) as his_order_to_amorize_amount,
round(his_order_amorized_amount,2) as his_order_amorized_amount,
round(his_order_to_amortize_in_future_amount,2) as his_order_to_amortize_in_future_amount,
round(his_order_to_amortize_over_1y_amount,2) as his_order_to_amortize_over_1y_amount,
round(current_order_to_amortiz_in_future_amount_12,2) as current_order_to_amortiz_in_future_amount_12,
round(his_order_to_amortiz_in_future_amount_12,2) as his_order_to_amortiz_in_future_amount_12
 from (
  select 
  order_month,
  subscription_type,
  country_code,
  kp_country_type,
  channel,
  app_product,
  sku_type,
  sum(current_order_to_amortize_amount) as current_order_to_amortize_amount,
  sum(current_order_amortized_amount) as current_order_amortized_amount,
  sum(current_order_to_amortize_in_future_amount) as current_order_to_amortize_in_future_amount,
  sum(current_order_to_amortize_over_1y_amount) as current_order_to_amortize_over_1y_amount,
  sum(his_order_to_amorize_amount) as his_order_to_amorize_amount,
  sum(his_order_amorized_amount) as his_order_amorized_amount,
  sum(his_order_to_amortize_in_future_amount) as his_order_to_amortize_in_future_amount,
  sum(his_order_to_amortize_over_1y_amount) as his_order_to_amortize_over_1y_amount,
  sum(current_order_to_amortiz_in_future_amount_12) as current_order_to_amortiz_in_future_amount_12,
  sum(his_order_to_amortiz_in_future_amount_12) as his_order_to_amortiz_in_future_amount_12
  from rpt_pub_cld_sale_amortize_1m
  where order_month >= '#startDate#'
  and order_month <= '#endDate#'
  #where#
  group by order_month,
  subscription_type,
  country_code,
  kp_country_type,
  channel,
  app_product,
  sku_type
)
order by order_month desc

`;

export const refSQL = `
/*+engine=MPP*/
select 
refund_month,
subscription_type,
country_code,
kp_country_type,
channel,
app_product,
sku_type,
round(current_refund_order_to_amortize_amount ,2) as current_refund_order_to_amortize_amount,
round(current_refund_order_amortized_amount ,2) as current_refund_order_amortized_amount,
round(current_refund_order_to_amortize_in_future_amount ,2) as current_refund_order_to_amortize_in_future_amount,
round(current_refund_order_to_amortize_over_1y_amount ,2) as current_refund_order_to_amortize_over_1y_amount,
round(his_refund_order_to_amorize_amount ,2) as his_refund_order_to_amorize_amount,
round(his_refund_order_amorized_amount ,2) as his_refund_order_amorized_amount,
round(his_refund_order_to_amortize_in_future_amount ,2) as his_refund_order_to_amortize_in_future_amount,
round(his_refund_order_to_amortize_over_1y_amount ,2) as his_refund_order_to_amortize_over_1y_amount,
round(current_order_to_amortiz_in_future_amount_12,2) as current_order_to_amortiz_in_future_amount_12,
round(his_order_to_amortiz_in_future_amount_12,2) as his_order_to_amortiz_in_future_amount_12
from (
select 
refund_month,
subscription_type,
country_code,
kp_country_type,
channel,
app_product,
sku_type,
sum(current_refund_order_to_amortize_amount) as current_refund_order_to_amortize_amount,
sum(current_refund_order_amortized_amount) as current_refund_order_amortized_amount,
sum(current_refund_order_to_amortize_in_future_amount) as current_refund_order_to_amortize_in_future_amount,
sum(current_refund_order_to_amortize_over_1y_amount) as current_refund_order_to_amortize_over_1y_amount,
sum(his_refund_order_to_amorize_amount) as his_refund_order_to_amorize_amount,
sum(his_refund_order_amorized_amount) as his_refund_order_amorized_amount,
sum(his_refund_order_to_amortize_in_future_amount) as his_refund_order_to_amortize_in_future_amount,
sum(his_refund_order_to_amortize_over_1y_amount) as his_refund_order_to_amortize_over_1y_amount,
sum(current_order_to_amortiz_in_future_amount_12) as current_order_to_amortiz_in_future_amount_12,
sum(his_order_to_amortiz_in_future_amount_12) as his_order_to_amortiz_in_future_amount_12
from rpt_pub_cld_refd_amortize_1m
where refund_month >= '#startDate#'
and refund_month <= '#endDate#'
#where#
group by refund_month,
country_code,
kp_country_type,
subscription_type,
channel,
app_product,
sku_type
)
order by refund_month desc

`;

export const saleAllSQL = `
/*+engine=MPP*/
select
order_month,
round(current_order_to_amortize_amount,2) as current_order_to_amortize_amount,
round(current_order_amortized_amount,2) as current_order_amortized_amount,
round(current_order_to_amortize_in_future_amount,2) as current_order_to_amortize_in_future_amount,
round(current_order_to_amortize_over_1y_amount,2) as current_order_to_amortize_over_1y_amount,
round(his_order_to_amorize_amount,2) as his_order_to_amorize_amount,
round(his_order_amorized_amount,2) as his_order_amorized_amount,
round(his_order_to_amortize_in_future_amount,2) as his_order_to_amortize_in_future_amount,
round(his_order_to_amortize_over_1y_amount,2) as his_order_to_amortize_over_1y_amount,
round(current_order_to_amortiz_in_future_amount_12,2) as current_order_to_amortiz_in_future_amount_12,
round(his_order_to_amortiz_in_future_amount_12,2) as his_order_to_amortiz_in_future_amount_12
 from (
  select 
  order_month,
  sum(current_order_to_amortize_amount) as current_order_to_amortize_amount,
  sum(current_order_amortized_amount) as current_order_amortized_amount,
  sum(current_order_to_amortize_in_future_amount) as current_order_to_amortize_in_future_amount,
  sum(current_order_to_amortize_over_1y_amount) as current_order_to_amortize_over_1y_amount,
  sum(his_order_to_amorize_amount) as his_order_to_amorize_amount,
  sum(his_order_amorized_amount) as his_order_amorized_amount,
  sum(his_order_to_amortize_in_future_amount) as his_order_to_amortize_in_future_amount,
  sum(his_order_to_amortize_over_1y_amount) as his_order_to_amortize_over_1y_amount,
  sum(current_order_to_amortiz_in_future_amount_12) as current_order_to_amortiz_in_future_amount_12,
  sum(his_order_to_amortiz_in_future_amount_12) as his_order_to_amortiz_in_future_amount_12
  from rpt_pub_cld_sale_amortize_1m
  where order_month >= '#startDate#'
  and order_month <= '#endDate#'
  #where#
  group by order_month
)
order by order_month desc

`;

export const refAllSQL = `
/*+engine=MPP*/
select 
refund_month,
round(current_refund_order_to_amortize_amount ,2) as current_refund_order_to_amortize_amount,
round(current_refund_order_amortized_amount ,2) as current_refund_order_amortized_amount,
round(current_refund_order_to_amortize_in_future_amount ,2) as current_refund_order_to_amortize_in_future_amount,
round(current_refund_order_to_amortize_over_1y_amount ,2) as current_refund_order_to_amortize_over_1y_amount,
round(his_refund_order_to_amorize_amount ,2) as his_refund_order_to_amorize_amount,
round(his_refund_order_amorized_amount ,2) as his_refund_order_amorized_amount,
round(his_refund_order_to_amortize_in_future_amount ,2) as his_refund_order_to_amortize_in_future_amount,
round(his_refund_order_to_amortize_over_1y_amount ,2) as his_refund_order_to_amortize_over_1y_amount,
round(current_order_to_amortiz_in_future_amount_12,2) as current_order_to_amortiz_in_future_amount_12,
round(his_order_to_amortiz_in_future_amount_12,2) as his_order_to_amortiz_in_future_amount_12
from (
select 
refund_month,
sum(current_refund_order_to_amortize_amount) as current_refund_order_to_amortize_amount,
sum(current_refund_order_amortized_amount) as current_refund_order_amortized_amount,
sum(current_refund_order_to_amortize_in_future_amount) as current_refund_order_to_amortize_in_future_amount,
sum(current_refund_order_to_amortize_over_1y_amount) as current_refund_order_to_amortize_over_1y_amount,
sum(his_refund_order_to_amorize_amount) as his_refund_order_to_amorize_amount,
sum(his_refund_order_amorized_amount) as his_refund_order_amorized_amount,
sum(his_refund_order_to_amortize_in_future_amount) as his_refund_order_to_amortize_in_future_amount,
sum(his_refund_order_to_amortize_over_1y_amount) as his_refund_order_to_amortize_over_1y_amount,
sum(current_order_to_amortiz_in_future_amount_12) as current_order_to_amortiz_in_future_amount_12,
sum(his_order_to_amortiz_in_future_amount_12) as his_order_to_amortiz_in_future_amount_12
from rpt_pub_cld_refd_amortize_1m
where refund_month >= '#startDate#'
and refund_month <= '#endDate#'
#where#
group by refund_month
)
order by refund_month desc
`;
