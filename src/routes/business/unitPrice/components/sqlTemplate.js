/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-09 10:10:34
 * @LastEditTime: 2020-05-07 21:40:49
 * @LastEditors: ssssslf
 */
export const appProductSQL = `
SELECT  DISTINCT(app_product)  from ads_pub_cld_slerfd_usr_cnt_1d where app_product is not null
and app_product not in ('Camdy','KamStar')
`;

// 地区
export const countryNameSQL = `
select  country_name,country_code_2 as country_code from   dim_pub_log_country_code
`;

export const skuTypeSQL = `
select DISTINCT(sku) from ads_pub_cld_slerfd_usr_cnt_1d where sku is not null `;

export const payWaySQL = `
select DISTINCT(pay_way) from ads_pub_cld_slerfd_usr_cnt_1d  where pay_way is not null `;

export const listSQL = `
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

export const listMonthSQL = `
SELECT 
    a.new_usr_actv  
    ,b.pay_usr_total 
    ,b.pay_amt_total 

FROM(
    SELECT sum(new_usr_actv) as new_usr_actv
            ,flag
    FROM(

        SELECT new_usr_actv,1 as flag 
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
        )s

    )t group by flag 

)a join (
        SELECT sum(pay_usr_total) as pay_usr_total
                ,sum(pay_amt_total) as pay_amt_total
                ,flag
        from(
            SELECT     
                pay_amt_total
                ,pay_usr_total
                ,1 as flag
            from ads_pub_cld_slerfd_usr_cnt_1d 
            where data_time >= '#startDate#' and data_time <= '#endDate#'
            #where#
            )t group by flag 
)b on a.flag = b.flag
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
