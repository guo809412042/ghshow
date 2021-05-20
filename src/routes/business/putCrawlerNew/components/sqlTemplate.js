/**
 * @File: sqlTemplate.js
 * @Author: Zero
 * @Date: 2020/05/15
 * @Copyright(c) QuVideo F2E Team
 * @Email: zerong.peng@quvideo.com
 * @comment: 新用户收入来源
 */
export const countryListSQL = `
SELECT DISTINCT(\`country_name\`) AS country FROM vcm_crawler_pub_throw_subamt_1d where country_name is not null;
`;

export const mediaSourceListSQL = `
SELECT DISTINCT(\`media_source\`) AS media_source  FROM vcm_crawler_pub_throw_subamt_1d;
`;

export const campaignListSQL = `
SELECT DISTINCT(\`campaign_name\`) AS campaign FROM vcm_crawler_pub_throw_subamt_1d ?;
`;

export const productListSQL = `
SELECT DISTINCT(\`product_id\`) AS product_id FROM vcm_crawler_pub_throw_subamt_1d;
`;

export const listSQL = `
/*+engine=mpp*/
SELECT
  #query#
  sum( install ) AS install,
  sum( spend ) AS spend,
  sum(ad_cpi) AS ad_cpi,
  sum( impressions ) AS impressions,
  sum( clicks ) AS clicks,
  sum(ad_ctr) AS ad_ctr,
  sum(ad_install_rate) AS ad_install_rate,
  sum( af_retn_newusr_num ) AS af_retn_newusr_num,
  sum(real_revenue) AS real_revenue,
  sum(new_real_revenue) AS new_real_revenue,
  sum(profit) AS profit,
  sum(arpu) AS arpu,
  sum(roi) AS roi,
  sum( year_free_num ) AS year_free_num,
  sum( year_pay_num ) AS year_pay_num,
  sum( year_renew_pay_num ) AS year_renew_pay_num,
  sum( month_free_num ) AS month_free_num,
  sum( month_pay_num ) AS month_pay_num,
  sum( month_renew_pay_num ) AS month_renew_pay_num,
  sum( week_free_num ) AS week_free_num,
  sum( week_pay_num ) AS week_pay_num,
  sum( week_renew_pay_num ) AS week_renew_pay_num,
  sum( purchase_free_num ) AS purchase_free_num,
  sum( purchase_forever_num ) AS purchase_forever_num,
  sum(free_trail_total_num) AS free_trail_total_num,
  sum(purchase_total_num) AS purchase_total_num,
  sum(purchase_renew_total_num) AS purchase_renew_total_num,
  sum(free_trail_total_rate) AS free_trail_total_rate,
  sum(purchase_total_rate) AS purchase_total_rate,
  sum(free_trail_year_rate) AS free_trail_year_rate,
  sum(purchase_year_rate) AS purchase_year_rate
FROM (
SELECT
    #query#
    sum( install ) AS install,
    round( sum( spend ), 2 ) AS spend,
    round(
    CASE
      WHEN sum( install ) = 0 OR sum( spend ) = 0
      THEN 0.0 ELSE sum( spend ) / sum( install ) 
    END , 2 ) as ad_cpi,
    sum( impressions ) AS impressions,
    sum( clicks ) AS clicks,
    round(
    CASE 
        WHEN sum( clicks ) = 0 OR sum( impressions ) = 0 
        THEN 0.0 ELSE ( sum( clicks ) / sum( impressions ) ) * 100 
    END , 2) AS ad_ctr,
    round(
    CASE
        WHEN sum( install ) = 0 OR sum( clicks ) = 0
        THEN 0.0 ELSE ( sum( install ) / sum( clicks ) ) * 100 
    END , 2) AS ad_install_rate,
    sum( af_retn_newusr_num ) AS af_retn_newusr_num,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0 
      THEN 0 ELSE sum( real_revenue ) / sum(af_retn_newusr_num) * sum(install)
    END, 2 ) AS real_revenue,
    round( sum( real_revenue ), 2 ) AS new_real_revenue,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0 
      THEN 0 - sum( spend ) ELSE sum( real_revenue ) / sum(af_retn_newusr_num) * sum(install) - sum( spend )
    END , 2) AS profit,
    round(
    CASE
        WHEN sum( af_retn_newusr_num ) = 0 OR sum( real_revenue ) = 0
        THEN 0.0 ELSE ( sum( real_revenue ) / sum( af_retn_newusr_num ) )
    END , 2) AS arpu,
    round(
    CASE 
        WHEN sum( real_revenue ) = 0 OR sum( spend ) = 0 
        THEN 0.0 ELSE (sum( real_revenue ) / sum( spend ) ) * 100
    END , 2) AS roi,
    sum( year_free_num ) AS year_free_num,
    sum( year_pay_num ) AS year_pay_num,
    sum( year_renew_pay_num ) AS year_renew_pay_num,
    sum( month_free_num ) AS month_free_num,
    sum( month_pay_num ) AS month_pay_num,
    sum( month_renew_pay_num ) AS month_renew_pay_num,
    sum( week_free_num ) AS week_free_num,
    sum( week_pay_num ) AS week_pay_num,
    sum( week_renew_pay_num ) AS week_renew_pay_num,
    sum( purchase_free_num ) AS purchase_free_num,
    sum( purchase_forever_num ) AS purchase_forever_num,
    round(
      sum( year_free_num + month_free_num + week_free_num + purchase_free_num )
    , 2) AS free_trail_total_num,
    round(
      sum( year_pay_num + month_pay_num + week_pay_num + purchase_forever_num )
    , 2) AS purchase_total_num,
    round(
      sum( year_renew_pay_num + month_renew_pay_num + week_renew_pay_num )
    , 2) AS purchase_renew_total_num,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0
      THEN 0 ELSE sum( year_free_num + month_free_num + week_free_num + purchase_free_num ) / sum( af_retn_newusr_num ) * 100
    END , 2) AS free_trail_total_rate,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0
      THEN 0 ELSE sum( year_pay_num + month_pay_num + week_pay_num + purchase_forever_num ) / sum( af_retn_newusr_num ) * 100
    END , 2) AS purchase_total_rate,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0
      THEN 0 ELSE sum( year_free_num ) / sum( af_retn_newusr_num ) * 100
    END , 2) AS free_trail_year_rate,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0
      THEN 0 ELSE sum( year_pay_num ) / sum( af_retn_newusr_num ) * 100
    END , 2) AS purchase_year_rate
FROM vcm_crawler_pub_throw_subamt_1d
?
#group#
union ALL 
SELECT
    #query#
    sum( install ) AS install,
    round( sum( spend ), 2 ) AS spend,
    round(
    CASE
        WHEN sum( install ) = 0 OR sum( spend ) = 0
        THEN 0.0 ELSE sum( spend ) / sum( install ) 
    END , 2 ) as ad_cpi,
    sum( impressions ) AS impressions,
    sum( clicks ) AS clicks,
    round(
    CASE 
        WHEN sum( clicks ) = 0 OR sum( impressions ) = 0 
        THEN 0.0 ELSE ( sum( clicks ) / sum( impressions ) ) * 100 
    END , 2) AS ad_ctr,
    round(
    CASE
        WHEN sum( install ) = 0 OR sum( clicks ) = 0
        THEN 0.0 ELSE ( sum( install ) / sum( clicks ) ) * 100 
    END , 2) AS ad_install_rate,
    sum( af_retn_newusr_num ) AS af_retn_newusr_num,
    round( sum( real_revenue ), 2 ) AS real_revenue,
    round( sum( real_revenue ), 2 ) AS new_real_revenue,
    round( sum( real_revenue ) - sum( spend ), 2) AS profit,
    round(
    CASE
        WHEN sum( af_retn_newusr_num ) = 0 OR sum( real_revenue ) = 0
        THEN 0.0 ELSE ( sum( real_revenue ) / sum( af_retn_newusr_num ) )
    END , 2) AS arpu,
    round(
    CASE 
        WHEN sum( real_revenue ) = 0 OR sum( spend ) = 0 
        THEN 0.0 ELSE (sum( real_revenue ) / sum( spend ) ) * 100
    END , 2) AS roi,
    sum( year_free_num ) AS year_free_num,
    sum( year_pay_num ) AS year_pay_num,
    sum( year_renew_pay_num ) AS year_renew_pay_num,
    sum( month_free_num ) AS month_free_num,
    sum( month_pay_num ) AS month_pay_num,
    sum( month_renew_pay_num ) AS month_renew_pay_num,
    sum( week_free_num ) AS week_free_num,
    sum( week_pay_num ) AS week_pay_num,
    sum( week_renew_pay_num ) AS week_renew_pay_num,
    sum( purchase_free_num ) AS purchase_free_num,
    sum( purchase_forever_num ) AS purchase_forever_num,
    round(
      sum( year_free_num + month_free_num + week_free_num + purchase_free_num )
    , 2) AS free_trail_total_num,
    round(
      sum( year_pay_num + month_pay_num + week_pay_num + purchase_forever_num )
    , 2) AS purchase_total_num,
    round(
      sum( year_renew_pay_num + month_renew_pay_num + week_renew_pay_num )
    , 2) AS purchase_renew_total_num,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0
      THEN 0 ELSE sum( year_free_num + month_free_num + week_free_num + purchase_free_num ) / sum( af_retn_newusr_num ) * 100
    END , 2) AS free_trail_total_rate,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0
      THEN 0 ELSE sum( year_pay_num + month_pay_num + week_pay_num + purchase_forever_num ) / sum( af_retn_newusr_num ) * 100
    END , 2) AS purchase_total_rate,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0
      THEN 0 ELSE sum( year_free_num ) / sum( af_retn_newusr_num ) * 100
    END , 2) AS free_trail_year_rate,
    round(
    CASE
      WHEN sum( af_retn_newusr_num ) = 0
      THEN 0 ELSE sum( year_pay_num ) / sum( af_retn_newusr_num ) * 100
    END , 2) AS purchase_year_rate
FROM vcm_crawler_pub_throw_subamt_1d
#$#
#group#
)
#group#
ORDER BY #order# install DESC
`;
