/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 10:10:34
 * @LastEditTime: 2021-01-26 19:10:04
 * @LastEditors: dongqi.zhao
 */
export const appProductSQL = `
SELECT  DISTINCT(product_id)  from vcm_ad_template_count where product_id is not null
`;

// 地区
export const countryNameSQL = `
select  country_name,country_code_2 as country_code from   dim_pub_log_country_code
`;

export const skuTypeSQL = `
select DISTINCT(sku) from ads_pub_cld_slerfd_usr_cnt_1d where sku is not null `;

export const payWaySQL = `
select DISTINCT(pay_way) from ads_pub_cld_slerfd_usr_cnt_1d  where pay_way is not null `;

export const mediaSourceSQL = `
select media_source from vcm_ad_template_count where media_source is not null group by media_source`;

export const listSQL = `
SELECT 
product_id, media_source, ttid, country_code, sum(spend) as spend, sum(impressions) as impressions, sum(clicks) as clicks, sum(installs) as installs, sum(amount) as amount, country_name,
sum(refund_amount) as refund_amount, max(bonus) as bonus, ds
from vcm_ad_template_count 
where ds >= '#startDate#' and ds <= '#endDate#' #where#
group by product_id, media_source, ttid, country_code, country_name, ds
order by ds desc
`;

export const allTtid = `
SELECT 
ttid
from vcm_ad_template_count 
group by ttid
`;

export const listMonthSQL = `
SELECT 
product_id, media_source, platform, ttid, country_code, sum(spend) as spend, sum(impressions) as impressions, sum(clicks) as clicks, sum(installs) as installs, sum(amount) as amount, country_name,
sum(refund_amount) as refund_amount, max(bonus) as bonus,substring(ds,1,6) as ds
from vcm_ad_template_count 
where ds >= '#startDate#' and ds <= '#endDate#' #where#
group by product_id, media_source, platform, ttid, country_code, country_name, substring(ds,1,6)
order by substring(ds, 1, 6) desc
`;

export const listChartSQL = `
SELECT a.data_time,
    a.new_usr_actv  
    ,b.pay_usr_total 
    ,b.pay_amt_total 
FROM(
        SELECT sum(new_usr_actv) as new_usr_actv ,data_time
        FROM(
        SELECT 
            data_time
            ,app_product
            ,pay_way
            ,country_name
            ,country_code
            ,new_usr_actv
        from ads_pub_cld_slerfd_usr_cnt_1d 
        where data_time >= '#startDate#' and data_time <= '#endDate#'
        #where1#
        GROUP BY  data_time
                ,app_product
                ,pay_way
                ,country_name
                ,country_code
                ,new_usr_actv
        )
GROUP BY data_time
)a join (
        SELECT sum(pay_usr_total) as pay_usr_total
                ,sum(pay_amt_total) as pay_amt_total
                ,data_time
        from(
            SELECT     
                pay_amt_total
                ,pay_usr_total
                ,data_time
            from ads_pub_cld_slerfd_usr_cnt_1d 
            where data_time >= '#startDate#' and data_time <= '#endDate#'
            #where#
            ) group by data_time 
)b on a.data_time = b.data_time
order by a.data_time desc
`;
