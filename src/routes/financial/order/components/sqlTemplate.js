/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-27 11:38:05
 * @LastEditTime: 2020-04-07 13:42:03
 * @LastEditors: ssssslf
 */
export const appProductSQL = `
SELECT  DISTINCT(app_product)  from holo_dwd_pub_cld_slerfd_order_di
`;

export const channelSQL = `
SELECT  DISTINCT(channel)  from holo_dwd_pub_cld_slerfd_order_di
`;

export const payWaySQL = `
SELECT  DISTINCT(pay_way)  from holo_dwd_pub_cld_slerfd_order_di
`;

// 购买类型
export const skuTypeSQL = `
SELECT  DISTINCT(sku_type)  from holo_dwd_pub_cld_slerfd_order_di
`;

// 地区
export const countryCodeSQL = `
SELECT  DISTINCT(country_code)  from holo_dwd_pub_cld_slerfd_order_di
`;

export const orderSQL = `
select 
data_time,
channel,
app_product,
country_code,
sku,
sku_type,
pay_way,
order_id,
currency,
subscription_duration,
subscription_type,
subscription_over_1y,
charged_amount,
channel_rate,
handing_rate,
tax_rate,
channel_fee,
handling_fee,
tax_fee,
handling_fee_return,
tax_return,
net_revenue,
refund_amount,
channel_fee_return,
net_refund_amount,
offset_revenue
from holo_dwd_pub_cld_slerfd_order_di
where 1=1  #where#
order by data_time desc
LIMIT 1000
`;
