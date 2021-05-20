/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-03 11:31:18
 * @LastEditTime: 2021-04-07 10:19:58
 * @LastEditors: dongqi.zhao
 */
export const appProductSQL = `
SELECT  DISTINCT(app_product)  from ads_pub_cld_sale_order_total_df where app_product not in ('Camdy','KamStar')
`;

export const channelSQL = `
SELECT  DISTINCT(channel)  from ads_pub_cld_sale_order_total_df
`;
// 获取订阅类型
export const subTypeSQL = `
SELECT  DISTINCT(subscription_type)  from ads_pub_cld_sale_order_total_df
`;

// 购买类型
export const skuTypeSQL = `
SELECT  DISTINCT(sku_type)  from ads_pub_cld_sale_order_total_df
`;

// 地区
export const countryCodeSQL = `
SELECT  DISTINCT(country_code)  from ads_pub_cld_sale_order_total_df
`;

export const saleSQL = `
/*+engine=mpp*/
select
subscription_type,
data_time,
country_code,
kp_country_type,
channel,
app_product,
sku_type,
round(charged_amount,2) as charged_amount,
round(sum_channel_fee,2) as sum_channel_fee,
round(handling_fee,2) as handling_fee,
round(net_revenue,2) as net_revenue,
round(output_vat,2) as output_vat,
round(withhold_input_vat,2) as withhold_input_vat,
round(withhold_addition_tax,2) as withhold_addition_tax,
round(input_tax_with_handingfee,2) as input_tax_with_handingfee
 from (
  select
  subscription_type,
  substr(data_time,1,6) as data_time,
  country_code,
  kp_country_type,
  channel,
  app_product,
  sku_type,
  sum(charged_amount) as charged_amount,
  sum(sum_channel_fee) as sum_channel_fee,
  sum(handling_fee) as handling_fee,
  sum(net_revenue) as net_revenue,
  sum(output_vat) as output_vat,
  sum(withhold_input_vat) as withhold_input_vat,
  sum(withhold_addition_tax) as withhold_addition_tax,
  sum(input_tax_with_handingfee) as input_tax_with_handingfee
  from ads_pub_cld_sale_order_total_df
  where substr(data_time,1,6) >= '#startDate#'
  and substr(data_time,1,6) <= '#endDate#'
  #where#
  group by substr(data_time,1,6),
  country_code,
  kp_country_type,
  channel,
  subscription_type,
  app_product,
  sku_type
)
order by substr(data_time,1,6) desc ,net_revenue desc
`;

export const saleAllSQL = `
/*+engine=mpp*/
SELECT t1.data_time
,charged_amount
,sum_channel_fee
,handling_fee
,net_revenue
,output_vat
,withhold_input_vat
,withhold_addition_tax
,input_tax_with_handingfee
,cn_material_channel_fee
FROM ( 
select
        data_time,
        round(charged_amount,2) as charged_amount,
        round(sum_channel_fee,2) as sum_channel_fee,
        round(handling_fee,2) as handling_fee,
        round(net_revenue,2) as net_revenue,
        round(output_vat,2) as output_vat,
        round(withhold_input_vat,2) as withhold_input_vat,
        round(withhold_addition_tax,2) as withhold_addition_tax,
        round(input_tax_with_handingfee,2) as input_tax_with_handingfee
     from (
      select 
      substr(data_time,1,6) as data_time,
      sum(charged_amount) as charged_amount,
      sum(sum_channel_fee) as sum_channel_fee,
      sum(handling_fee) as handling_fee,
      sum(net_revenue) as net_revenue,
      sum(output_vat) as output_vat,
      sum(withhold_input_vat) as withhold_input_vat,
      sum(withhold_addition_tax) as withhold_addition_tax,
      sum(input_tax_with_handingfee) as input_tax_with_handingfee
      from ads_pub_cld_sale_order_total_df
      where substr(data_time,1,6) >= '#startDate#'
  and substr(data_time,1,6) <= '#endDate#'
  #where#
      group by substr(data_time,1,6)
    )a
)t1 LEFT JOIN (
  SELECT 
    data_time, round(SUM(cn_material_channel_fee),2) as   cn_material_channel_fee
  FROM ads_pub_cld_cn_material_sale_total_df
  WHERE substr(data_time,1,6) >= '#startDate#' and substr(data_time,1,6) <= '#endDate#' #where2#
  GROUP BY data_time
)t2 on t1.data_time = t2.data_time
order by t1.data_time desc ,net_revenue desc;
`;

export const refSQL = `
/*+engine=mpp*/
select 
data_time,
country_code,
kp_country_type,
subscription_type,
channel,
app_product,
sku_type,
round(charged_amount,2) as charged_amount,
round(sum_channel_fee_return,2) as sum_channel_fee_return,
round(handing_fee_return,2) as handing_fee_return,
round(net_revenue_return,2) as net_revenue_return,
round(output_vat_return,2) as output_vat_return,
round(withhold_input_vat_return,2) as withhold_input_vat_return,
round(withhold_addition_tax_return,2) as withhold_addition_tax_return,
round(input_tax_with_handingfee_return,2) as input_tax_with_handingfee_return
from (
select 
substr(data_time,1,6) as data_time,
country_code,
kp_country_type,
channel,
subscription_type,
app_product,
sku_type,
sum(charged_amount) as charged_amount,
sum(sum_channel_fee_return) as sum_channel_fee_return,
sum(handing_fee_return) as handing_fee_return,
sum(net_revenue_return) as net_revenue_return,
sum(output_vat_return) as output_vat_return,
sum(withhold_input_vat_return) as withhold_input_vat_return,
sum(withhold_addition_tax_return) as withhold_addition_tax_return,
sum(input_tax_with_handingfee_return) as input_tax_with_handingfee_return
from ads_pub_cld_refund_order_total_df
where substr(data_time,1,6) >= '#startDate#'
and substr(data_time,1,6) <= '#endDate#'
#where#
group by substr(data_time,1,6),
country_code,
kp_country_type,
subscription_type,
channel,
app_product,
sku_type
)
order by substr(data_time,1,6) desc ,net_revenue_return desc

`;
// export const refAllSQL = `
// /*+engine=mpp*/
// select
// data_time,
// round(charged_amount,2) as charged_amount,
// round(sum_channel_fee_return,2) as sum_channel_fee_return,
// round(handing_fee_return,2) as handing_fee_return,
// round(net_revenue_return,2) as net_revenue_return,
// round(output_vat_return,2) as output_vat_return,
// round(withhold_input_vat_return,2) as withhold_input_vat_return,
// round(withhold_addition_tax_return,2) as withhold_addition_tax_return,
// round(input_tax_with_handingfee_return,2) as input_tax_with_handingfee_return
// from (
// select
// substr(data_time,1,6) as data_time,
// sum(charged_amount) as charged_amount,
// sum(sum_channel_fee_return) as sum_channel_fee_return,
// sum(handing_fee_return) as handing_fee_return,
// sum(net_revenue_return) as net_revenue_return,
// sum(output_vat_return) as output_vat_return,
// sum(withhold_input_vat_return) as withhold_input_vat_return,
// sum(withhold_addition_tax_return) as withhold_addition_tax_return,
// sum(input_tax_with_handingfee_return) as input_tax_with_handingfee_return
// from ads_pub_cld_refund_order_total_df
// where substr(data_time,1,6) >= '#startDate#'
// and substr(data_time,1,6) <= '#endDate#'
// #where#
// group by substr(data_time,1,6)
// )
// order by substr(data_time,1,6) desc ,net_revenue_return desc

// `;

export const refAllSQL = `
/*+engine=mpp*/
SELECT t1.data_time
,charged_amount
,sum_channel_fee_return
,handing_fee_return
,net_revenue_return
,output_vat_return
,withhold_input_vat_return
,withhold_addition_tax_return
,input_tax_with_handingfee_return
,cn_material_channel_fee
FROM (
    select 
        data_time,
        round(charged_amount,2) as charged_amount,
        round(sum_channel_fee_return,2) as sum_channel_fee_return,
        round(handing_fee_return,2) as handing_fee_return,
        round(net_revenue_return,2) as net_revenue_return,
        round(output_vat_return,2) as output_vat_return,
        round(withhold_input_vat_return,2) as withhold_input_vat_return,
        round(withhold_addition_tax_return,2) as withhold_addition_tax_return,
        round(input_tax_with_handingfee_return,2) as input_tax_with_handingfee_return
    from (
        select 
        substr(data_time,1,6) as data_time,
        sum(charged_amount) as charged_amount,
        sum(sum_channel_fee_return) as sum_channel_fee_return,
        sum(handing_fee_return) as handing_fee_return,
        sum(net_revenue_return) as net_revenue_return,
        sum(output_vat_return) as output_vat_return,
        sum(withhold_input_vat_return) as withhold_input_vat_return,
        sum(withhold_addition_tax_return) as withhold_addition_tax_return,
        sum(input_tax_with_handingfee_return) as input_tax_with_handingfee_return
        from ads_pub_cld_refund_order_total_df
        where substr(data_time,1,6) >= '#startDate#'
and substr(data_time,1,6) <= '#endDate#'
#where#
group by substr(data_time,1,6)
    )a
)t1 LEFT JOIN (
  SELECT 
    data_time, round(SUM(cn_material_channel_fee),2) as   cn_material_channel_fee
  FROM ads_pub_cld_cn_material_refd_total_df
  WHERE substr(data_time,1,6) >= '#startDate#' and substr(data_time,1,6) <= '#endDate#'  #where2#
  GROUP BY data_time
)t2 on t1.data_time = t2.data_time
order by t1.data_time desc ,net_revenue_return desc
;

`;
