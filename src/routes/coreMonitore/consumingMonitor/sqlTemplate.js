/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-11 11:18:03
 * @LastEditTime: 2020-07-01 17:38:06
 * @LastEditors: ssssslf
 */
export const countrySQL = `
select DISTINCT(country) from dws_pub_log_event_api_cnt_1d_test
where product_id ='#product#'`;

export const appVersionSQL = `
select DISTINCT(app_version) from dws_pub_log_event_api_cnt_1d_test
where product_id ='#product#' and platform = '#platform#'
and app_version is not null
order by app_version desc
`;

export const urlSQL = `
select url from dws_pub_log_event_api_cnt_1d_test 
where product_id =2 and  match(url)  against('https://viva.v21xy.com/api/rest/u/um')
limit 100
`;

export const statusCodeSQL = `
select DISTINCT(status_code) from dws_pub_log_event_api_cnt_1d_test
where product_id ='#product#'`;

export const dnsSQL = `
select DISTINCT(dns) from dws_pub_log_event_api_cnt_1d_test
where product_id ='#product#' `;

export const listSQL = `
/*+ engine= mpp*/
select 
sum(conn_cost_cnt_1d) as conn_cost_cnt_1d,
sum(rsp_cost_cnt_1d) as rsp_cost_cnt_1d,
sum(dns_cost_cnt_1d) as dns_cost_cnt_1d,
sum(costmills_cnt_1d) as costmills_cnt_1d,
sum(conn_cost_sum_1d) as conn_cost_sum_1d,
sum(rsp_cost_sum_1d) as rsp_cost_sum_1d,
sum(dns_cost_sum_1d) as dns_cost_sum_1d,
sum(costmills_sum_1d) as costmills_sum_1d
from dws_pub_log_event_api_cnt_1d_test
where concat(ds, hh)>= '#startDate#'
and concat(ds, hh)<= '#endDate#'
and product_id ='#product#'
#where#
`;
