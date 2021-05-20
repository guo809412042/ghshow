/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-27 11:38:05
 * @LastEditTime : 2020-03-03 17:47:37
 * @LastEditors  : ssssslf
 */
export const appProductSQL = `
SELECT  DISTINCT(app_product)  from holo_ads_pub_cld_finance_amortize_1d
`;

export const channelSQL = `
SELECT  DISTINCT(channel)  from holo_ads_pub_cld_finance_amortize_1d
`;

export const payWaySQL = `
SELECT  DISTINCT(pay_way)  from holo_ads_pub_cld_finance_amortize_1d
`;

// 购买类型
export const skuTypeSQL = `
SELECT  DISTINCT(sku_type)  from holo_ads_pub_cld_finance_amortize_1d
`;

// 地区
export const countryCodeSQL = `
SELECT  DISTINCT(country_code)  from holo_ads_pub_cld_finance_amortize_1d
`;

export const listSQL = `
select 
bizday,country_code,channel,app_product,sku_type,sku,
sum(CAST(amortize_charge_amount as decimal(9,2))) as amortize_charge_amount,
sum(CAST(amortize_channel_fee as decimal(9,2))) as amortize_channel_fee,
sum(CAST(amortize_handling_fee as decimal(9,2))) as amortize_handling_fee,
sum(CAST(amortize_tax_fee as decimal(9,2))) as amortize_tax_fee,
sum(CAST(amortize_refund_amount as decimal(9,2))) as amortize_refund_amount,
sum(CAST(amortize_channel_fee_return as decimal(9,2))) as amortize_channel_fee_return,
sum(CAST(amortize_handling_fee_return as decimal(9,2))) as amortize_handling_fee_return,
sum(CAST(amortize_net_revenue as decimal(9,2))) as amortize_net_revenue,
sum(CAST(amortize_tax_return as decimal(9,2))) as amortize_tax_return,
sum(CAST(amortize_net_refund_amount as decimal(9,2))) as amortize_net_refund_amount,
sum(CAST(amortize_offset_revenue as decimal(9,2))) as amortize_offset_revenue
from holo_ads_pub_cld_finance_amortize_1d
where 1=1  #where#  
group by bizday,country_code,channel,app_product,sku_type,sku
order by bizday desc
LIMIT 10000
`;

export const listMouthSQL = `
select 
country_code,channel,app_product,sku_type,sku,
sum(CAST(amortize_charge_amount as decimal(9,2))) as amortize_charge_amount,
sum(CAST(amortize_channel_fee as decimal(9,2))) as amortize_channel_fee,
sum(CAST(amortize_handling_fee as decimal(9,2))) as amortize_handling_fee,
sum(CAST(amortize_tax_fee as decimal(9,2))) as amortize_tax_fee,
sum(CAST(amortize_refund_amount as decimal(9,2))) as amortize_refund_amount,
sum(CAST(amortize_channel_fee_return as decimal(9,2))) as amortize_channel_fee_return,
sum(CAST(amortize_handling_fee_return as decimal(9,2))) as amortize_handling_fee_return,
sum(CAST(amortize_net_revenue as decimal(9,2))) as amortize_net_revenue,
sum(CAST(amortize_tax_return as decimal(9,2))) as amortize_tax_return,
sum(CAST(amortize_net_refund_amount as decimal(9,2))) as amortize_net_refund_amount,
sum(CAST(amortize_offset_revenue as decimal(9,2))) as amortize_offset_revenue
from holo_ads_pub_cld_finance_amortize_1d
where 1=1  #where#  
group by country_code,channel,app_product,sku_type,sku
LIMIT 10000
`;
