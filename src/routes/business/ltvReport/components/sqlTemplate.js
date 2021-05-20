/* eslint-disable max-len */
export const CountryListSQL = `
SELECT DISTINCT(country_name) FROM vcm_viva_trd_ltv_1d;
`;

export const DataListSQL = ` 
/*+ engine= mpp*/ 

SELECT 
round(a.ARPDAU / c.active_user, 3) AS ARPDAU
        ,round(100*a.curr_rate / c.active_user, 3) AS curr_rate
        ,round(a.LTV / c.active_user, 3) AS LTV
        ,case sku_info when '月' then CAST(rate AS varchar) when '年' then '1' when '永久' then '1' when '全部' then '' end as rate
        ,try_out
        ,try_out_topay
        ,try_out_topay_amount
        ,direct_pay
        ,direct_amount
        ,curr_amount
        ,year_expect_amount
        ,c.active_user
        ,a.ds
        ,a.platform
        ,a.country_name
        ,a.media_source
        ,a.sku_info
        ,a.user_status
  FROM(
SELECT round(sum(try_out), 2) AS try_out, round(sum(try_out_topay), 2) AS try_out_topay, round(sum(try_out_topay_amount), 2) AS try_out_topay_amount, round(sum(direct_pay), 2) AS direct_pay, round(sum(direct_amount), 2) AS direct_amount, sum(try_out_topay_amount+ direct_amount) AS ARPDAU, round(sum(try_out_topay_amount+ direct_amount), 2) AS curr_amount, sum(try_out_topay+ direct_pay) AS curr_rate, sum((try_out_topay_amount+ direct_amount) *rate) AS LTV, round((sum(try_out_topay_amount*rate)+ sum(direct_amount*rate)), 2) AS year_expect_amount, #fields#
  FROM(
SELECT ltv.platform, ltv.sku_info, ltv.country_name, ltv.user_status, ltv.media_source, ltv.active_user, ltv.try_out, ltv.try_out_topay, CAST(ltv.try_out_topay_amount AS DOUBLE) AS try_out_topay_amount, ltv.direct_pay, CAST(ltv.direct_amount AS DOUBLE) AS direct_amount, ltv.ds, if(sku_info = '月', CAST(ltvren.rate AS DOUBLE), 1.0) AS rate
  FROM vcm_viva_trd_ltv_1d ltv
  LEFT JOIN vcm_viva_di_ltv_renewal_1m ltvren ON
  IF(substr(ltv.ds,1,6)<'202004','202004',substr(ltv.ds,1,6))=ltvren.ms
   AND ltv.platform= ltvren.platform
   AND ltv.country_name= ltvren.country_name
   )
 #where#
 #groupby#
) a
  LEFT JOIN vcm_viva_di_ltv_renewal_1m b ON
  IF(substr(a.ds,1,6)<'202004','202004',substr(a.ds,1,6)) = b.ms
   AND a.platform= b.platform
   AND a.country_name= b.country_name
  LEFT JOIN(
    select ds#activefield# ,sum(active_user) as active_user from (SELECT ds, platform, media_source, country_name, user_status ,active_user
      FROM vcm_viva_trd_ltv_1d #where1#
     GROUP BY ds, platform, media_source, country_name, user_status ,active_user) group by ds#activegroup#
) c ON a.ds= c.ds #activeon# ORDER BY a.ds DESC
`;
