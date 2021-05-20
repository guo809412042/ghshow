/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-05-29 11:13:32
 * @LastEditTime: 2020-06-10 16:30:36
 * @LastEditors: ssssslf
 */
export const coutnrySQL = `
/*+engine=mpp*/
select DISTINCT(country) from rpt_pub_cs_df
where country is not null #platform# and product_id = '#product#' #where# `;

export const sourceSQL = `
/*+engine=mpp*/
select DISTINCT(source) from rpt_pub_cs_df
where source is not null #platform# and product_id = '#product#'`;

export const langSQL = `
/*+engine=mpp*/
select DISTINCT(lang) from rpt_pub_cs_df
where lang is not null #platform# and product_id = '#product#' #where# `;

export const issueTypeSQL = `
/*+engine=mpp*/
select DISTINCT(issue_type) from rpt_pub_cs_df
where issue_type is not #platform# null and product_id = '#product#'`;

export const appVersionSQL = `
/*+engine=mpp*/
select appkey,app_version from rpt_pub_cs_df
where product_id = '#product#' and platform = '#platform#'
and appkey is not null
group by app_version,appkey
order by appkey desc
`;

export const overviewChartSQL = `
/*+engine=mpp*/
SELECT count(DISTINCT(msg_id))  as count ,ds,product_id
  FROM rpt_pub_cs_df
 where ds >= '#startDate#' and ds <='#endDate#' #where#
 group by ds,product_id
order by ds,product_id
`;
export const overviewChartMonthSQL = `
/*+engine=mpp*/
SELECT count(DISTINCT(msg_id))  as count ,product_id
  FROM rpt_pub_cs_df
 where ds >= '#startDate#' and ds <='#endDate#' #where#
 group by product_id
order by product_id
`;

export const overviewChartAllSQL = `
/*+engine=mpp*/
SELECT count(DISTINCT(msg_id))  as count ,ds
  FROM rpt_pub_cs_df
 where ds >= '#startDate#' and ds <='#endDate#' #where#
 group by ds
order by ds
`;

export const overviewTableSQL = `
/*+engine=mpp*/
SELECT count(DISTINCT(msg_id))  as count,ds,product_id #group#
  FROM rpt_pub_cs_df
 where ds >= '#startDate#' and ds <='#endDate#' #where#
 group by ds,product_id #group#
order by ds desc
`;
export const overviewTableMonSQL = `
/*+engine=mpp*/
SELECT count(DISTINCT(msg_id))  as count,product_id #group#
  FROM rpt_pub_cs_df
 where ds >= '#startDate#' and ds <='#endDate#' #where#
 group by product_id #group#
order by product_id
`;

export const feedbackChartSQL = `
/*+engine=mpp*/
SELECT count(msg_id)  as count ,ds,product_id
  FROM rpt_pub_cs_df
 where ds >= '#startDate#' and ds <='#endDate#' #where#
 AND  issue_type IS NOT NULL
 group by ds,product_id
order by ds,product_id
`;

export const feedbackChartAllSQL = `
/*+engine=mpp*/
SELECT count(msg_id)  as count ,ds
  FROM rpt_pub_cs_df
 where ds >= '#startDate#' and ds <='#endDate#' #where#
 AND  issue_type IS NOT NULL
 group by ds
order by ds
`;

export const feedbackTableSQL = `
/*+engine=mpp*/
SELECT count(msg_id)  as count,ds,product_id #group#
  FROM rpt_pub_cs_df
 where ds >= '#startDate#' and ds <='#endDate#' #where#
 AND  issue_type IS NOT NULL
 group by ds,product_id #group#
order by ds desc ,product_id
`;

export const feedbackTableMonSQL = `
/*+engine=mpp*/
SELECT count(msg_id)  as count,product_id #group#
  FROM rpt_pub_cs_df
 where ds >= '#startDate#' and ds <='#endDate#' #where#
 AND  issue_type IS NOT NULL
 group by product_id #group#
order by product_id
`;

export const levelOneSQL = '/*+engine=mpp*/ SELECT DISTINCT(level_one) FROM rpt_pub_cs_df where level_one is not null ; ';

export const levelOneTwoSQL = `
/*+engine=mpp*/
SELECT level_one, level_two
FROM rpt_pub_cs_df
where level_one is not null and level_two is not null
GROUP BY level_one , level_two
;`;

export const levelTwoThereeSQL = `
/*+engine=mpp*/
SELECT level_one,level_three, level_two
FROM rpt_pub_cs_df
where level_three is not null and level_two is not null and level_one is not null
 GROUP BY level_one,level_three , level_two ;`;
