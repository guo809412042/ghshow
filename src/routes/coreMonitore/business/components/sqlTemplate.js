/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-27 17:30:53
 * @LastEditTime: 2020-07-20 11:38:34
 * @LastEditors: ssssslf
 */
export const listAllSQL = `
SELECT A
 .business,
 A.date_time,
 A.total AS suc_total,
 b.total AS total
 ,round(a.total*1.0*100/b.total,2) as ratio
FROM
 (
 SELECT
  date_time,
  business,
  SUM ( value1 ) AS total 
 FROM
  holo_product_log_#platform#_mon_biz_10m 
 WHERE
  date_time >= '#startDate#' 
  AND date_time < '#endDate#' 
  AND results = 'Success'  and product = '#product#'
 GROUP BY
  business,
  date_time 
 )
 A LEFT JOIN (
 SELECT
  date_time,
  business,
  SUM ( value1 ) AS total 
 FROM
  holo_product_log_#platform#_mon_biz_10m 
 WHERE
 date_time >= '#startDate#' 
 AND date_time < '#endDate#' 
 and product = '#product#'
 GROUP BY
  business,
  date_time 
 ) b ON A.date_time = b.date_time 
 AND A.business = b.business
 order by  business,
  date_time `;

export const listSQL = `
SELECT t1.date_time
        ,t1.product
        ,t1.business
        ,t1.results
        ,error_code
        ,bus_total
        ,total
        ,round(bus_total*1.0/total,4) as ratio
from
    (
    SELECT
        date_time
        ,product
        ,business
        ,results
        ,error_code
        , bus_total
        ,row_number() over(partition by product,date_time,business,results order by bus_total desc) rn
    FROM (
        SELECT
            date_time
            ,product
            ,business
            ,results
            ,case when LOWER(results)='fail' then error_code
                else '' end as error_code
            ,sum(value1) as bus_total
        from holo_product_log_#platform#_mon_biz_10m
        where date_time>='#startDate#'  and date_time<'#endDate#' #where#
        group by business,product,results,date_time,case when LOWER(results)='fail' then error_code
                else '' end
        )t1
    )t1
left join
    (
    SELECT
        date_time
        ,product
        ,business
        ,sum(value1) as total
    from holo_product_log_#platform#_mon_biz_10m
    where date_time>='#startDate#'  and date_time<'#endDate#' #where#
    group by business,product,date_time
    )t2
on t1.date_time=t2.date_time and t1.business=t2.business and t1.product=t2.product
where  t1.rn<=5
and t1.product='#product#'
order by t1.product,t1.date_time ,t1.business desc limit 10000;`;

export const listDetailSQL = `
SELECT t1.date_time
        ,t1.results
        ,error_code
        ,bus_total
        ,total
        ,round(bus_total*1.0/total,4) as ratio
from
    (
    SELECT
        date_time
        ,results
        ,error_code
        , bus_total
        ,row_number() over(partition by date_time,results order by bus_total desc) rn
    FROM (
        SELECT
            date_time
            ,results
            ,case when LOWER(results)='fail' then error_code
                else '' end as error_code
            ,sum(value1) as bus_total
        from holo_product_log_#platform#_mon_biz_10m
        where date_time>='#startDate#'  and date_time<'#endDate#' #where#
        and product ='#product#'
        and business = '#type#'
        group by results,date_time,case when LOWER(results)='fail' then error_code
                else '' end
        )t1
    )t1
left join
    (
    SELECT
        date_time
        ,sum(value1) as total
    from holo_product_log_#platform#_mon_biz_10m
    where date_time>='#startDate#'  and date_time<'#endDate#' #where# 
    and product ='#product#'
    and business = '#type#'
    group by date_time
    )t2
on t1.date_time=t2.date_time 
where  t1.rn<=5
order by t1.date_time desc limit 10000;`;

// 地区
export const countryNameSQL = `
select  country_name,country_code_2 as country_code from   dim_pub_log_country_code
`;
