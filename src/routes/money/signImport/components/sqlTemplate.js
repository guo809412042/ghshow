/**
 * @File: sqlTemplate.js
 * @Author: Zero
 * @Date: 2020/05/15
 * @Copyright(c) QuVideo F2E Team
 * @Email: zerong.peng@quvideo.com
 * @comment: 订阅入口分析
 */
export const countryListSQL = `
SELECT DISTINCT(\`country\`)  FROM ads_pub_log_sub_ent_cnt_1d order by country desc
`;

export const versionListSQL = `
SELECT DISTINCT(\`app_version\`)  FROM ads_pub_log_sub_ent_cnt_1d 
`;

export const mediaSourceListSQL = `
SELECT DISTINCT(fvalue) FROM ads_pub_log_sub_ent_cnt_1d
`;

export const dataListSQL = `
/*+engine=mpp*/
SELECT 
IF(fvalue='IAP',IF(platform=1,'tip','首次进入tip'),fvalue) AS fvalue,
sum(IF(is_new_dvc= 'Y', sign_ply_usr_cnt, 0) AS n) as new_user_sign, 
sum(IF(is_new_dvc= 'N', sign_ply_usr_cnt, 0) AS o) as old_user_sign, 
sum(IF(is_new_dvc= 'Y', single_ply_usr_cnt , 0) AS n) as new_user_sing, 
sum(IF(is_new_dvc= 'N', single_ply_usr_cnt , 0) AS o) as old_user_sing, 
sum(in_vip_usr_cnt) as in_vip_usr_cnt,
sum(clk_ply_usr_cnt) as clk_ply_usr_cnt,
sum(start_ply_usr_cnt) as start_ply_usr_cnt,
sum(single_ply_usr_cnt) as single_ply_usr_cnt,
sum(sign_ply_usr_cnt) as sign_ply_usr_cnt,
sum(month_ply_usr_cnt) as month_ply_usr_cnt,
sum(year_ply_usr_cnt) as year_ply_usr_cnt
FROM
ads_pub_log_sub_ent_cnt_1d 
 ? 
 group by IF(fvalue='IAP',IF(platform=1,'tip','首次进入tip'),fvalue);
`;

export const dsListSQL = `
/*+engine=mpp*/
select * from (
SELECT 
ds,
IF(fvalue='IAP',IF(platform=1,'tip','首次进入tip'),fvalue) AS fvalue,
sum(IF(is_new_dvc= 'Y', sign_ply_usr_cnt, 0) AS n) as new_user_sign, 
sum(IF(is_new_dvc= 'N', sign_ply_usr_cnt, 0) AS o) as old_user_sign, 
sum(IF(is_new_dvc= 'Y', single_ply_usr_cnt , 0) AS n) as new_user_sing, 
sum(IF(is_new_dvc= 'N', single_ply_usr_cnt , 0) AS o) as old_user_sing, 
sum(in_vip_usr_cnt) as in_vip_usr_cnt,
sum(clk_ply_usr_cnt) as clk_ply_usr_cnt,
sum(start_ply_usr_cnt) as start_ply_usr_cnt,
sum(single_ply_usr_cnt) as single_ply_usr_cnt,
sum(sign_ply_usr_cnt) as sign_ply_usr_cnt,
sum(month_ply_usr_cnt) as month_ply_usr_cnt,
sum(year_ply_usr_cnt) as year_ply_usr_cnt
FROM
ads_pub_log_sub_ent_cnt_1d 
 ? 
 group by IF(fvalue='IAP',IF(platform=1,'tip','首次进入tip'),fvalue),ds
union all
SELECT 
ds,
' 总数' AS fvalue,
sum(IF(is_new_dvc= 'Y', sign_ply_usr_cnt, 0) AS n) as new_user_sign, 
sum(IF(is_new_dvc= 'N', sign_ply_usr_cnt, 0) AS o) as old_user_sign, 
sum(IF(is_new_dvc= 'Y', single_ply_usr_cnt , 0) AS n) as new_user_sing, 
sum(IF(is_new_dvc= 'N', single_ply_usr_cnt , 0) AS o) as old_user_sing, 
sum(in_vip_usr_cnt) as in_vip_usr_cnt,
sum(clk_ply_usr_cnt) as clk_ply_usr_cnt,
sum(start_ply_usr_cnt) as start_ply_usr_cnt,
sum(single_ply_usr_cnt) as single_ply_usr_cnt,
sum(sign_ply_usr_cnt) as sign_ply_usr_cnt,
sum(month_ply_usr_cnt) as month_ply_usr_cnt,
sum(year_ply_usr_cnt) as year_ply_usr_cnt
FROM
ads_pub_log_sub_ent_cnt_1d 
 ? 
 group by ds)
 where fvalue is not null
 order by ds desc,fvalue
`;
