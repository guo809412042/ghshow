// 按地区或来源（图表数据，按天分组）
export const attrActSQL = `
/*+engine=mpp*/
select
#type#,
ds,new_dvc_cnt,o_new_dvc_cnt,p_new_dvc_cnt,
round(sale_amt,2) AS sale_amt,
round(o_sale_amt,2) AS o_sale_amt,
round(p_sale_amt,2) AS p_sale_amt
 from (
SELECT
#type#
,ds
,sum(install) AS new_dvc_cnt
,sum(o_install) AS o_new_dvc_cnt
,sum(p_install) AS p_new_dvc_cnt
,sum(sale_amt) AS sale_amt
,sum(o_sale_amt) AS o_sale_amt
,sum(p_sale_amt) AS p_sale_amt
FROM    rpt_viva_att_act_nd
WHERE   ds >= '#startDate#' and ds<='#endDate#'  #where#
GROUP BY
#type#,
ds
)
order by ds
`;

// export const attrActSQL = `
// /*+engine=mpp*/
// select
//   #type#,
//   ds,
//   new_dvc_cnt,
//   o_new_dvc_cnt,
//   p_new_dvc_cnt,
//   round(sale_amt,2) AS sale_amt,
//   round(o_sale_amt,2) AS o_sale_amt,
//   round(p_sale_amt,2) AS p_sale_amt
//    from (
//   SELECT
//       #type#
//        ,ds
//       ,sum(install) AS new_dvc_cnt
//       ,sum(o_install) AS o_new_dvc_cnt
//       ,sum(p_install) AS p_new_dvc_cnt
//       ,sum(sale_amt) AS sale_amt
//       ,sum(o_sale_amt) AS o_sale_amt
//       ,sum(p_sale_amt) AS p_sale_amt
//       FROM    rpt_viva_att_act_nd
//       WHERE   ds >= '#startDate#' and ds<='#endDate#'
//       #where#
//       GROUP BY
//       #type#,ds
//   ) t
//   order by ds ASC , #radio# DESC`;

// 其他地区（合并到其他，按天分组）
export const attrActNoCountrySQL = `
select ds,
new_dvc_cnt,o_new_dvc_cnt,p_new_dvc_cnt,
round(sale_amt,2) AS sale_amt,
round(o_sale_amt,2) AS o_sale_amt,
round(p_sale_amt,2) AS p_sale_amt
from(
SELECT  ds
,sum(install) AS new_dvc_cnt   
,sum(o_install) AS o_new_dvc_cnt    
,sum(p_install) AS p_new_dvc_cnt   
,sum(sale_amt) AS sale_amt
,sum(o_sale_amt) AS o_sale_amt
,sum(p_sale_amt) AS p_sale_amt 
FROM    rpt_viva_att_act_nd
WHERE   ds >= '#startDate#' and ds<='#endDate#' #where#
GROUP BY ds);
`;

// 按地区或来源（表格数据，不按天分组）
export const attrActNoDsSQL = `
/*+engine=mpp*/
select #type#,
new_dvc_cnt,o_new_dvc_cnt,p_new_dvc_cnt,
round(sale_amt,2) AS sale_amt,
round(o_sale_amt,2) AS o_sale_amt,
round(p_sale_amt,2) AS p_sale_amt
from(
SELECT #type#
,sum(install) AS new_dvc_cnt   
,sum(o_install) AS o_new_dvc_cnt    
,sum(p_install) AS p_new_dvc_cnt   
,sum(sale_amt) AS sale_amt
,sum(o_sale_amt) AS o_sale_amt
,sum(p_sale_amt) AS p_sale_amt 
FROM    rpt_viva_att_act_nd
WHERE   ds >= '#startDate#' and ds<='#endDate#'  #where#
GROUP BY #type#)
`;

// 其他地区（表格数据，不按天分组）
export const attrActNoDsNoCountrySql = `
/*+engine=mpp*/
select
new_dvc_cnt,o_new_dvc_cnt,p_new_dvc_cnt,
round(sale_amt,2) AS sale_amt,
round(o_sale_amt,2) AS o_sale_amt,
round(p_sale_amt,2) AS p_sale_amt
from (
SELECT  sum(install) AS new_dvc_cnt   
,sum(o_install) AS o_new_dvc_cnt    
,sum(p_install) AS p_new_dvc_cnt   
,sum(sale_amt) AS sale_amt
,sum(o_sale_amt) AS o_sale_amt
,sum(p_sale_amt) AS p_sale_amt  
FROM    rpt_viva_att_act_nd
WHERE   ds >= '#startDate#' and ds<='#endDate#'  #where# )
`;

// 汇总表格数据(按地区或来源分组)
export const attrActSumNoDsSQL = `
/*+engine=mpp*/
select #type#
,round(dau,2) AS dau
,round(INSTALL,2) AS INSTALL
,round(o_install,2) AS o_install
,round(p_install,2) AS p_install
,round(revenue,2) AS revenue
,round(o_revenue,2) AS o_revenue
,round(p_revenue,2) AS p_revenue
,round(cost,2) AS cost
,round(year_free,2) AS year_free
,round(month_free,2) AS month_free
,round(year_new_purchase,2) AS year_new_purchase
,round(month_new_purchase,2) AS month_new_purchase
,round(year_renew_purchase,2) AS year_renew_purchase
,round(month_renew_purchase,2) AS month_renew_purchase
,round(other_purchase,2) AS other_purchase
,round(year_revenue,2) AS year_revenue
,round(month_revenue,2) AS month_revenue
,round(other_revenue,2) AS other_revenue
,round(refund_amt,2) as refund_amt
,round(revenue/dau,2) as arpdau
from(
SELECT #type#
,sum(dau) AS dau
,sum(install) AS INSTALL
,sum(o_install) AS o_install
,sum(p_install) AS p_install
,sum(revenue) AS revenue
,sum(o_revenue) AS o_revenue
,sum(p_revenue) AS p_revenue
,sum(cost) AS cost
,sum(year_free) AS year_free
,sum(month_free) AS month_free
,sum(year_new_purchase) AS year_new_purchase
,sum(month_new_purchase) AS month_new_purchase
,sum(year_renew_purchase) AS year_renew_purchase
,sum(month_renew_purchase) AS month_renew_purchase
,sum(other_purchase) AS other_purchase
,sum(year_revenue) AS year_revenue
,sum(month_revenue) AS month_revenue
,sum(other_revenue) AS other_revenue
,sum(refund_amt) as refund_amt
FROM    rpt_viva_att_act_nd
WHERE   ds >= #startDate# and ds<=#endDate# #where#
GROUP BY #type#);
`;

// 汇总表格数据(不按地区分组)
export const attrActSumNoCountrySQL = `
/*+engine=mpp*/
select 
round(dau,2) AS dau
,round(INSTALL,2) AS INSTALL
,round(o_install,2) AS o_install
,round(p_install,2) AS p_install
,round(revenue,2) AS revenue
,round(o_revenue,2) AS o_revenue
,round(p_revenue,2) AS p_revenue
,round(cost,2) AS cost
,round(year_free,2) AS year_free
,round(month_free,2) AS month_free
,round(year_new_purchase,2) AS year_new_purchase
,round(month_new_purchase,2) AS month_new_purchase
,round(year_renew_purchase,2) AS year_renew_purchase
,round(month_renew_purchase,2) AS month_renew_purchase
,round(other_purchase,2) AS other_purchase
,round(year_revenue,2) AS year_revenue
,round(month_revenue,2) AS month_revenue
,round(other_revenue,2) AS other_revenue
,round(refund_amt,2) as refund_amt
,round(revenue/dau,2) as arpdau
from(
SELECT 
sum(dau) AS dau
,sum(install) AS INSTALL
,sum(o_install) AS o_install
,sum(p_install) AS p_install
,sum(revenue) AS revenue
,sum(o_revenue) AS o_revenue
,sum(p_revenue) AS p_revenue
,sum(cost) AS cost
,sum(year_free) AS year_free
,sum(month_free) AS month_free
,sum(year_new_purchase) AS year_new_purchase
,sum(month_new_purchase) AS month_new_purchase
,sum(year_renew_purchase) AS year_renew_purchase
,sum(month_renew_purchase) AS month_renew_purchase
,sum(other_purchase) AS other_purchase
,sum(year_revenue) AS year_revenue
,sum(month_revenue) AS month_revenue
,sum(other_revenue) AS other_revenue
,sum(refund_amt) as refund_amt
FROM    rpt_viva_att_act_nd
WHERE   ds >= #startDate# and ds<=#endDate# #where#);
`;

export const campaignNameSQL = `
 select DISTINCT(campign) as campaign_name from rpt_viva_att_act_nd 
 where 1=1
 and campign is not null 
 order by campign desc
 `;

export const sourceNameSQL = `
 select DISTINCT(media_source) as source_name from rpt_viva_att_act_nd 
 where 1=1
 and media_source is not null 
 order by media_source desc
 `;

// 汇总表格数据(某来源按地区或campaign分组)
export const attrActSumSourceGroupBySQL = `
/*+engine=mpp*/
select #totalGroupBy#
,round(dau,2) AS dau
,round(INSTALL,2) AS INSTALL
,round(o_install,2) AS o_install
,round(p_install,2) AS p_install
,round(revenue,2) AS revenue
,round(o_revenue,2) AS o_revenue
,round(p_revenue,2) AS p_revenue
,round(cost,2) AS cost
,round(year_free,2) AS year_free
,round(month_free,2) AS month_free
,round(year_new_purchase,2) AS year_new_purchase
,round(month_new_purchase,2) AS month_new_purchase
,round(year_renew_purchase,2) AS year_renew_purchase
,round(month_renew_purchase,2) AS month_renew_purchase
,round(other_purchase,2) AS other_purchase
,round(year_revenue,2) AS year_revenue
,round(month_revenue,2) AS month_revenue
,round(other_revenue,2) AS other_revenue
,round(refund_amt,2) as refund_amt
,round(revenue/dau,2) as arpdau
from(
SELECT #totalGroupBy#
,sum(dau) AS dau
,sum(install) AS INSTALL
,sum(o_install) AS o_install
,sum(p_install) AS p_install
,sum(revenue) AS revenue
,sum(o_revenue) AS o_revenue
,sum(p_revenue) AS p_revenue
,sum(cost) AS cost
,sum(year_free) AS year_free
,sum(month_free) AS month_free
,sum(year_new_purchase) AS year_new_purchase
,sum(month_new_purchase) AS month_new_purchase
,sum(year_renew_purchase) AS year_renew_purchase
,sum(month_renew_purchase) AS month_renew_purchase
,sum(other_purchase) AS other_purchase
,sum(year_revenue) AS year_revenue
,sum(month_revenue) AS month_revenue
,sum(other_revenue) AS other_revenue
,sum(refund_amt) as refund_amt
FROM    rpt_viva_att_act_nd
WHERE   ds >= #startDate# and ds<=#endDate# #where#
GROUP BY #totalGroupBy#);
`;
