/**
 * @File: sqlTemplate.js
 * @Author: Zero
 * @Date: 2020/05/15
 * @Copyright(c) QuVideo F2E Team
 * @Email: zerong.peng@quvideo.com
 * @comment: 新用户收入来源
 */
export const countryListSQL = `
SELECT DISTINCT(\`country_name\`) AS country  FROM ads_crawler_pub_throw_subamt_1d where country_name is not null;
`;

export const mediaSourceListSQL = `
SELECT DISTINCT(\`media_source\`) AS media_source  FROM ads_crawler_pub_throw_subamt_1d
`;

export const dayListSQL = `
/*+engine=mpp*/
    SELECT ds as ds,
           country_name,
           sum(install) as install,
           round(SUM(spend), 2) as spend,
           round(sum(spend) /sum(install), 2) as CPI,
           round(SUM(IF(media_source='ASM',(install/af_retn_newusr_num)*revenue,revenue))*0.7 , 2) as after_revenue,
           SUM(impressions) as impressions,
           SUM(clicks) as clicks,
           round(100*sum(clicks) /sum(impressions), 2) as CTR,
           round(100*sum(install)/sum(clicks),2) as CVR,
           SUM(af_retn_newusr_num) as af_retn_newusr_num,
           round(SUM(IF(media_source='ASM',(install/af_retn_newusr_num)*revenue,revenue))*0.7 /sum(spend),2) as ROAS,
           round((SUM(IF(media_source='ASM',(install/af_retn_newusr_num)*revenue,revenue))*0.7 -sum(spend)) /sum(spend), 2) as ROI,
           round(SUM(IF(media_source='ASM',(install/af_retn_newusr_num)*revenue,revenue))*0.7 /sum(af_retn_newusr_num),2) as arpu,
           SUM(year_trial_num) as year_trial_num,
           round(100*sum(year_trial_num) /sum(af_retn_newusr_num), 2) as year_trial_rate,
           sum(year_pay_num) as year_pay_num,
           round(100*sum(year_pay_num) /sum(year_trial_num), 2) as year_success_rate,
           round(100*sum(year_pay_num) /sum(af_retn_newusr_num), 2) as year_pay_rate,
           sum(year_renew_pay_num) as year_renew_pay_num,
           sum(month_trial_num) as month_trial_num,
           sum(month_pay_num) as month_pay_num,
           sum(month_renew_pay_num) as month_renew_pay_num,
           sum(week_trial_num) as week_trial_num,
           sum(week_pay_num) as week_pay_num,
           sum(week_renew_pay_num) as week_renew_pay_num,
           sum(purchase_forever_num) as purchase_forever_num
      FROM ads_crawler_pub_throw_subamt_1d
       ?
     GROUP BY ds,
             country_name
     ORDER BY ds DESC,
             install DESC
union all 
    
    SELECT 
           '合计' as ds ,
           '合计' as country_name,
           sum(install) as install,
           round(SUM(spend), 2) as spend,
           round(sum(spend) /sum(install), 2) as CPI,
           round(SUM(IF(media_source='ASM',(install/af_retn_newusr_num)*revenue,revenue))*0.7 , 2) as after_revenue,
           SUM(impressions) as impressions,
           SUM(clicks) as clicks,
           round(100*sum(clicks) /sum(impressions), 2) as CTR,
           round(100*sum(install)/sum(clicks),2) as CVR,
           SUM(af_retn_newusr_num) as af_retn_newusr_num,
           round(SUM(IF(media_source='ASM',(install/af_retn_newusr_num)*revenue,revenue))*0.7 /sum(spend),2) as ROAS,
           round((SUM(IF(media_source='ASM',(install/af_retn_newusr_num)*revenue,revenue))*0.7 -sum(spend)) /sum(spend), 2) as ROI,
           round(SUM(IF(media_source='ASM',(install/af_retn_newusr_num)*revenue,revenue))*0.7 /sum(af_retn_newusr_num),2) as arpu,
           SUM(year_trial_num) as year_trial_num,
           round(100*sum(year_trial_num) /sum(af_retn_newusr_num), 2) as year_trial_rate,
           sum(year_pay_num) as year_pay_num,
           round(100*sum(year_pay_num) /sum(year_trial_num), 2) as year_success_rate,
           round(100*sum(year_pay_num) /sum(af_retn_newusr_num), 2) as year_pay_rate,
           sum(year_renew_pay_num) as year_renew_pay_num,
           sum(month_trial_num) as month_trial_num,
           sum(month_pay_num) as month_pay_num,
           sum(month_renew_pay_num) as month_renew_pay_num,
           sum(week_trial_num) as week_trial_num,
           sum(week_pay_num) as week_pay_num,
           sum(week_renew_pay_num) as week_renew_pay_num,
           sum(purchase_forever_num) as purchase_forever_num
      FROM ads_crawler_pub_throw_subamt_1d
      ?
`;
