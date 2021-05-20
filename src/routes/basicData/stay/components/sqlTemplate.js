/*
 * @Date: 2021-03-01 18:46:57
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-28 13:47:43
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
export const productListSQL = `
select distinct(product_id) from holo_vcm_pub_keep_usrn_1d where product_id is not null;
`;

export const mediaSourceListSQL = `
/*+ engine= mpp*/
select distinct(media_source) from holo_vcm_pub_keep_usrn_1d where media_source is not null and #where#
order by media_source
`;

export const versionListSQL = `
select distinct(app_version) from holo_vcm_pub_keep_usrn_1d where app_version is not null and #where# order by app_version;
`;

export const countryListSQL = `
/*+ engine= mpp*/
select distinct(country) from holo_vcm_pub_keep_usrn_1d where country is not null and country not like '%25COM%25' and country not like '%25NET%25' and country not like '%25骨干网%25' and country not like '%25MAXCDN%25'
and country not like '%25ZVONKOVA%25' and #where#
order by country desc
;
`;

export const getListSQL = `
/*+ engine= mpp*/
SELECT
sum(a.#type#) as #type#,
sum(a.#type2#) as #type2#,
sum(case WHEN a.user_type != 1 THEN 0 ELSE a.#type# END) as #type3#,
ds,
a.#groupby#
FROM holo_vcm_pub_keep_usrn_1d a
LEFT JOIN (
              SELECT  #groupby#
                      ,sum(#type#) as #type#
              FROM    holo_vcm_pub_keep_usrn_1d
              #whereInner# and #groupby# is not null
              GROUP BY #groupby#
              ORDER BY #type# DESC
              LIMIT 4
          ) b
ON a.#groupby# = b.#groupby#
#where#
AND  b.#groupby# IS NOT NULL
GROUP BY ds,a.#groupby#
union all
select 
sum(#type#) as #type#,
sum(#type2#) as #type2#,
sum(case WHEN user_type != 1 THEN 0 ELSE #type# END) as #type3#,
ds,
#allvalue# as #groupby#
from holo_vcm_pub_keep_usrn_1d
#whereInner#
group by ds
;
`;

export const getTableListSQL = `
/*+ engine= mpp*/
select
ds
,sum(new_act_bef_1d_cnt) as new_act_bef_1d_cnt
,sum(act_bef_1d_cnt) as act_bef_1d_cnt
,sum(new_act_bef_2d_cnt) as new_act_bef_2d_cnt
,sum(act_bef_2d_cnt) as act_bef_2d_cnt
,sum(new_act_bef_3d_cnt) as new_act_bef_3d_cnt
,sum(act_bef_3d_cnt) as act_bef_3d_cnt
,sum(new_act_bef_4d_cnt) as new_act_bef_4d_cnt
,sum(act_bef_4d_cnt) as act_bef_4d_cnt
,sum(new_act_bef_5d_cnt) as new_act_bef_5d_cnt
,sum(act_bef_5d_cnt) as act_bef_5d_cnt
,sum(new_act_bef_6d_cnt) as new_act_bef_6d_cnt
,sum(act_bef_6d_cnt) as act_bef_6d_cnt
,sum(new_act_bef_7d_cnt) as new_act_bef_7d_cnt
,sum(act_bef_7d_cnt) as act_bef_7d_cnt
,sum(new_act_bef_14d_cnt) as new_act_bef_14d_cnt
,sum(act_bef_14d_cnt) as act_bef_14d_cnt
,sum(new_act_bef_30d_cnt) as new_act_bef_30d_cnt
,sum(act_bef_30d_cnt) as act_bef_30d_cnt
,sum(new_mk_bef_1d_cnt) as new_mk_bef_1d_cnt
,sum(mk_bef_1d_cnt) as mk_bef_1d_cnt
,CASE WHEN SUM(new_act_bef_1d_cnt) = 0 THEN 0 ELSE SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(act_bef_1d_cnt as FLOAT) END)/SUM(CAST(new_act_bef_1d_cnt as FLOAT))*100 END as act_bef_1d_stay_rate
,CASE WHEN SUM(new_act_bef_2d_cnt) = 0 THEN 0 ELSE SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(act_bef_2d_cnt as FLOAT) END)/SUM(CAST(new_act_bef_2d_cnt as FLOAT))*100 END AS act_bef_2d_stay_rate
,CASE WHEN SUM(new_act_bef_3d_cnt) = 0 THEN 0 ELSE SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(act_bef_3d_cnt as FLOAT) END)/SUM(CAST(new_act_bef_3d_cnt as FLOAT ))*100 END as act_bef_3d_stay_rate
,CASE WHEN SUM(new_act_bef_4d_cnt) = 0 THEN 0 ELSE SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(act_bef_4d_cnt as FLOAT) END)/SUM(CAST(new_act_bef_4d_cnt as FLOAT))*100 END  as act_bef_4d_stay_rate
,CASE WHEN SUM(new_act_bef_5d_cnt) = 0 THEN 0 ELSE SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(act_bef_5d_cnt  as FLOAT) END)/SUM(CAST(new_act_bef_5d_cnt as FLOAT))*100 END as act_bef_5d_stay_rate
,CASE WHEN SUM(new_act_bef_6d_cnt) = 0 THEN 0 ELSE SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(act_bef_6d_cnt  as FLOAT) END)/SUM(CAST(new_act_bef_6d_cnt as FLOAT))*100 END as act_bef_6d_stay_rate
,CASE WHEN SUM(new_act_bef_7d_cnt) = 0 THEN 0 ELSE SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(act_bef_7d_cnt  as FLOAT) END)/SUM(CAST(new_act_bef_7d_cnt as FLOAT))*100 END as act_bef_7d_stay_rate
,CASE WHEN SUM(new_act_bef_14d_cnt) = 0THEN 0 ELSE SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(act_bef_14d_cnt as FLOAT)  END)/SUM(CAST(new_act_bef_14d_cnt as FLOAT))*100 END as act_bef_14d_stay_rate
,CASE WHEN SUM(new_act_bef_30d_cnt) = 0THEN 0 ELSE SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(act_bef_30d_cnt as FLOAT)  END)/SUM(CAST(new_act_bef_30d_cnt as FLOAT))*100 END as act_bef_30d_stay_rate
,CASE WHEN SUM(new_mk_bef_1d_cnt) = 0 THEN 0 ELSE  SUM(CASE WHEN user_type <> 1 THEN 0 ELSE CAST(mk_bef_1d_cnt as FLOAT) END)/SUM(CAST(new_mk_bef_1d_cnt as FLOAT))*100 END as mk_bef_1d_stay_rate
from holo_vcm_pub_keep_usrn_1d
#where#
group by ds
order by ds desc
`;
