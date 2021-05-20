/**
 * @File: sqlTemplate.js
 * @Author: Zero
 * @Date: 2020/05/15
 * @Copyright(c) QuVideo F2E Team
 * @Email: zerong.peng@quvideo.com
 * @comment: 新用户收入来源
 */
export const countryListSQL = `
SELECT DISTINCT(\`country_name\`) AS country  FROM ads_pub_dp_newusr_amtsource_1d
`;

export const areaListSQL = `
/*+engine=mpp*/
SELECT
left(ds,6) as ds,
product_id,
sum(reg_num) as reg_num,
round(sum(amt_total),2) as amt_total
FROM ads_pub_dp_newusr_amtsource_1d
?
group by ds,product_id
ORDER BY ds desc
`;

export const stackListSQL = `
/*+engine=mpp*/
SELECT
left(ds,6) as ds,
sum(reg_num) as reg_num,
round(sum(amt_total),2) as amt_total,
IF(media_source= 'Organic', '自然', '投放') AS media_source
FROM ads_pub_dp_newusr_amtsource_1d
?
group by ds,media_source
ORDER BY ds desc
`;

export const tableListSQL = `
/*+ engine= mpp*/
SELECT
left(ds, 6) as ds,
country_name,
sum(reg_num) as reg_num,
SUM(IF(media_source= 'Organic', reg_num, 0)) as reg_num_organic,
SUM(IF(media_source<> 'Organic', reg_num, 0)) as reg_num_no_organic,
round(SUM(amt_total), 2) as amt_total,
round(SUM(IF(media_source= 'Organic', amt_total, 0)), 2) as amt_total_organic,
round(SUM(IF(media_source<> 'Organic', amt_total, 0)), 2) as amt_total_no_organic,
round(SUM(amt_total) / sum(reg_num), 2) as arpu,

round(SUM(IF(media_source= 'Organic', amt_total, 0)) /SUM(IF(media_source= 'Organic', reg_num, 0)), 2) AS arpu_organic,
round(SUM(IF(media_source<> 'Organic', amt_total, 0)) /SUM(IF(media_source<> 'Organic', reg_num, 0)), 2) AS arpu_no_organic,

round(100*SUM(IF(media_source<> 'Organic', reg_num, 0)) / sum(reg_num), 2) as new_usr_no_organic,
round(100*SUM(IF(media_source= 'Organic', reg_num, 0)) / sum(reg_num), 2) as new_usr_organic,

round(100*SUM(IF(media_source<> 'Organic', amt_total, 0)) / SUM(amt_total), 2) as new_amt_no_organic,
round(100*SUM(IF(media_source= 'Organic', amt_total, 0)) / SUM(amt_total), 2) as new_amt_organic
  FROM ads_pub_dp_newusr_amtsource_1d
 ?
 group by ds,country_name 
 order by ds desc,amt_total_organic desc
`;
