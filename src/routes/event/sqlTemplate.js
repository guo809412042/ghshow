/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2019-12-09 15:04:40
 * @LastEditTime: 2020-08-28 11:53:36
 * @LastEditors: dongqi.zhao
 */
export const eventSQL = `
SELECT event_name,
sum(total) as total ,
sum(session_total) as session_total,
sum(duid_total) as duid_total
#auid#
FROM #database# 
WHERE ds>= '#startDate#'
AND ds<= '#endDate#'
#product#  #type# #where#
GROUP BY event_name
ORDER BY event_name 
 LIMIT 10000;
 `;

export const eventSQLWeb = `
SELECT event_name,SUM(evt_cnt_1d) AS total
FROM #database# 
WHERE day>= '#startDate#'
AND day<= '#endDate#'
#product#  #type# #where#
GROUP BY event_name
 LIMIT 10000;
 `;

export const eventNameSQL = `
  select id,event_name,event_name_CN from event_definition;
`;

export const eventDaySQL = `
SELECT ds,
sum(total) as total ,
sum(session_total) as session_total,
sum(duid_total) as duid_total
#auid#
FROM #database#  
WHERE ds>= '#startDate#'
AND ds<= '#endDate#' and event_name = '#event_name#'
#product# #type# #where# 
GROUP BY ds
ORDER BY ds 
 LIMIT 10000;
 `;

export const eventDaySQLWeb = `
SELECT day as ds,
sum(evt_cnt_1d) as total,
event_name
FROM ads_pub_log_h5_event_count  
WHERE day>= '#startDate#'
AND day<= '#endDate#' and event_name = '#event_name#'
#where# 
GROUP by day,event_name  
order by day LIMIT 10000;
 `;

export const eventKeySQL = `
select SUM(total) AS total,
     SUM(session_total) AS session_total,
     SUM(duid_total) AS duid_total,
     SUM(auid_total) AS auid_total,
     param_value
from #database#
where ds >= '#startDate#'
 and ds <= '#endDate#'
 #product# #type# #where# 
 and event_name= '#event_name#'
 and key_name= '#key_name#'
group by param_value
order by total desc
limit 1000;
`;

export const eventKeySQLWeb = `
select SUM(evt_cnt_1d) AS total,
     param_value
from ads_pub_log_h5_event_key_count
where day >= '#startDate#'
 and day <= '#endDate#'
 #product# #where# 
 and event_name= '#event_name#'
 and key_name= '#key_name#'
group by param_value
order by total desc
limit 1000;
`;
// export const eventKeySQLWeb = `
// select
// SUM(evt_cnt_1d) AS total
// , param_value
// from ads_pub_log_h5_event_key_count
// where day >= '20200725' and day <= '20200824'
// and productid = '2' and event_name= '埋点测试'
// and key_name= 'viva'
// group by param_value
// order by total desc  limit 1000;
// `;

export const eventKeyDaySQL = `
select SUM(total) AS total,
     SUM(session_total) AS session_total,
     SUM(duid_total) AS duid_total,
     SUM(auid_total) AS auid_total,
     ds
from #database#
where ds >= '#startDate#'
 and ds <= '#endDate#'
and event_name = '#event_name#'
 and key_name = '#key_name#'
 and param_value ='#param_value#'
 #product# #type# #where# 
group by ds
order by ds 
limit 1000;
`;

export const eventKeyDaySQLWeb = `
select SUM(total) AS total,
     SUM(session_total) AS session_total,
     SUM(duid_total) AS duid_total,
     SUM(auid_total) AS auid_total,
     ds
from ads_pub_log_h5_event_key_count
where ds >= '#startDate#'
 and ds <= '#endDate#'
and event_name = '#event_name#'
 and key_name = '#key_name#'
 and param_value ='#param_value#'
 #where# 
group by ds
order by ds 
limit 1000;
`;
