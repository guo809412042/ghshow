/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-10 10:53:32
 * @LastEditTime: 2020-05-08 16:31:29
 * @LastEditors: ssssslf
 */
export const countryNameSQL = `
SELECT DISTINCT(country_name)
  FROM ads_pub_dp_cltusr_sub_1d
 WHERE country_name is not null 
 order by country_name
`;

export const mediaSourceSQL = `
SELECT DISTINCT(media_source)
  FROM ads_pub_dp_cltusr_sub_1d
 WHERE media_source is not null and spend > 0
 order by media_source
`;

export const listSQL = `
SELECT a.reg_time,
       a.product_id,
       a.reg_num,
       round(b.spend,2)as spend,
       round(b.spend/a.reg_num,4) as arpu
  FROM(
select sum(reg_num) as reg_num, reg_time, product_id
  from ads_pub_dp_cltusr_sub_1d
 where reg_time >= #startDate# and reg_time <=#endDate# #where# 
   and media_source not in('Organic') and product_id not in ('6','11','12')
 group by reg_time, product_id) a
  LEFT JOIN(
SELECT reg_time, SUM(spend) as spend, product_id
  FROM(
SELECT campaign_name, reg_time, spend, product_id
  FROM ads_pub_dp_cltusr_sub_1d
 where reg_time >= #startDate# and reg_time <=#endDate# #where# and product_id not in ('6','11','12')
 GROUP BY campaign_name, reg_time, spend, product_id) t
 GROUP BY reg_time, product_id) b on a.reg_time= b.reg_time
   and a.product_id= b.product_id
order by reg_time ,product_id
`;

export const listNoProductSQL = `
SELECT a.reg_time,
       a.product_id,
       a.reg_num,
       round(b.spend,2)as spend,
       round(b.spend/a.reg_num,4) as arpu
  FROM(
select sum(reg_num) as reg_num, reg_time, 1 as product_id
  from ads_pub_dp_cltusr_sub_1d
 where reg_time >= #startDate# and reg_time <=#endDate# #where# 
   and media_source not in('Organic') and product_id not in ('6','11','12')
 group by reg_time, product_id) a
  LEFT JOIN(
SELECT reg_time, SUM(spend) as spend, product_id
  FROM(
SELECT campaign_name, reg_time, spend, 1 as product_id
  FROM ads_pub_dp_cltusr_sub_1d
 where reg_time >= #startDate# and reg_time <=#endDate# #where# and product_id not in ('6','11','12')
 GROUP BY campaign_name, reg_time, spend, product_id) t
 GROUP BY reg_time, product_id) b on a.reg_time= b.reg_time
   and a.product_id= b.product_id
order by reg_time ,product_id
`;

export const listAllSQL = `
SELECT a.product_id,
       a.reg_num,
       round(b.spend,2)as spend,
       round(b.spend/a.reg_num,4) as arpu
  FROM(
select sum(reg_num) as reg_num, product_id
  from ads_pub_dp_cltusr_sub_1d
 where reg_time >= #startDate# and reg_time <=#endDate# #where# 
   and media_source not in('Organic') and product_id not in ('6','11','12')
 group by product_id) a
  LEFT JOIN(
SELECT SUM(spend) as spend, product_id
  FROM(
SELECT campaign_name,  spend, product_id
  FROM ads_pub_dp_cltusr_sub_1d
 where reg_time >= #startDate# and reg_time <=#endDate# #where# and product_id not in ('6','11','12')
 GROUP BY campaign_name, spend, product_id) t
 GROUP BY  product_id) b on a.product_id= b.product_id
order by product_id
`;

export const listAllNoProductSQL = `
SELECT a.product_id,
       a.reg_num,
       round(b.spend,2)as spend,
       round(b.spend/a.reg_num,4) as arpu
  FROM(
select sum(reg_num) as reg_num, 1 as product_id
  from ads_pub_dp_cltusr_sub_1d
 where reg_time >= #startDate# and reg_time <=#endDate# #where# 
   and media_source not in('Organic') and product_id not in ('6','11','12')
 group by product_id) a
  LEFT JOIN(
SELECT SUM(spend) as spend, product_id
  FROM(
SELECT campaign_name,  spend, 1 as product_id
  FROM ads_pub_dp_cltusr_sub_1d
 where reg_time >= #startDate# and reg_time <=#endDate# #where# and product_id not in ('6','11','12')
 GROUP BY campaign_name, spend, product_id) t
 GROUP BY  product_id) b on a.product_id= b.product_id
order by product_id
`;
