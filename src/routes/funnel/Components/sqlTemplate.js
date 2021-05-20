/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-09 11:13:38
 * @LastEditTime: 2021-05-08 12:46:43
 * @LastEditors: Neal
 */
export const eventNameSQL = `
select 
event_name
    from #database# 
    group by event_name
    order by event_name

    `;

export const countryNameSQL = `
    SELECT country fROM ads_pub_log_funnel_event_py_1d
     where product_id = #product#
     group by country
    `;

export const appVersionSQL = `
SELECT app_version fROM ads_pub_log_funnel_cnt_1d_ri
where platform = '#platform#' and product_id = #product# 
and app_version is not  NULL 
group by app_version
order by app_version desc
`;

export const paidTypeSQL = `
SELECT DISTINCT(paid_type) fROM ads_pub_log_funnel_event_py_1d 
where paid_type is not null
and product_id = #product#
`;

export const channelSQL = `
SELECT DISTINCT(channel) fROM ads_pub_log_funnel_event_py_1d 
where channel is not null
and product_id = #product#
`;
export const mediaSourceSQL = `
SELECT DISTINCT(media_source) fROM ads_pub_log_funnel_event_py_1d 
where media_source is not null
and product_id = #product#
`;

export const rateSQL = `
SELECT  event_name
        ,step
        ,sum(#type#) as total
FROM    ads_pub_log_funnel_event_py_1d
WHERE  ds >='#startDate#' and ds <= '#endDate#'  #where#
GROUP BY event_name,step
order by step
`;

export const chartSQL = `
SELECT  ds,event_name
        ,step
        ,sum(#type#) as total
FROM    ads_pub_log_funnel_event_py_1d
WHERE  ds >='#startDate#' and ds <= '#endDate#'  #where#
GROUP BY ds,event_name,step
order by ds,step
`;

export const tableSQL = `
SELECT  ds,event_name
        ,step
        ,sum(#type#) as total
FROM    ads_pub_log_funnel_event_py_1d
WHERE  ds >='#startDate#' and ds <= '#endDate#'  #where#
GROUP BY ds,event_name,step
order by ds desc ,step asc
`;

export const rateSQLNew = `
SELECT  event_name
        ,step
        ,sum(#type#) as total
FROM    ads_pub_log_funnel_cnt_1d_ri
WHERE  ds >='#startDate#' and ds <= '#endDate#'  #where#
GROUP BY event_name,step
order by step
`;
export const tableSQLNew = `
SELECT  cast(ds as varchar) as ds,event_name
        ,step
        ,sum(#type#) as total
FROM    ads_pub_log_funnel_cnt_1d_ri
WHERE  ds >='#startDate#' and ds <= '#endDate#'  #where#
GROUP BY ds,event_name,step
order by ds desc ,step asc
`;
