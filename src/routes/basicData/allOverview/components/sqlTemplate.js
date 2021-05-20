/*
 * @Date: 2020-12-28 14:01:50
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-19 14:53:33
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
export const productListSQL = `
select distinct(product_id) from holo_vcm_pub_newly_usrn_1d where product_id is not null;
`;

export const mediaSourceListSQL = `
/*+ engine= mpp*/
select distinct(media_source) from holo_vcm_pub_newly_usrn_1d where media_source is not null and #where#
order by media_source
`;

export const versionListSQL = `
select distinct(app_version) from holo_vcm_pub_newly_usrn_1d where app_version is not null and #where# order by app_version;
`;

export const countryListSQL = `
/*+ engine= mpp*/
select distinct(country) from holo_vcm_pub_newly_usrn_1d where country is not null and country not like '%25COM%25' and country not like '%25NET%25' and country not like '%25骨干网%25' and country not like '%25MAXCDN%25'
and country not like '%25ZVONKOVA%25' and #where#
order by country desc
;
`;

export const topList = `
SELECT  #groupby#
                      ,sum(#type#) as #type#
              FROM    holo_vcm_pub_newly_usrn_1d
              #whereInner# and #groupby# is not null
              GROUP BY #groupby#
              ORDER BY #type# DESC
              LIMIT 4`;

export const getListSQL = `
/*+ engine= mpp*/
SELECT  sum(a.#type#) as #type#,
ds,
a.#groupby#
FROM holo_vcm_pub_newly_usrn_1d a
LEFT JOIN (
              SELECT  #groupby#
                      ,sum(#type#) as #type#
              FROM    holo_vcm_pub_newly_usrn_1d
              #whereInner# and #groupby# is not null
              GROUP BY #groupby#
              ORDER BY #type# DESC
          ) b
ON a.#groupby# = b.#groupby#
#where#
AND  b.#groupby# IS NOT NULL
GROUP BY ds,a.#groupby#
union all
select sum(#type#) as #type#,
ds,
#allvalue# as #groupby#
from holo_vcm_pub_newly_usrn_1d
#whereInner#
group by ds
;
`;

// export const getListSQL = `
// /*+engine=mpp*/
// select * from (
// select
// sum(dau) as dau,
// sum(mau) as mau,
// sum(newser_user_cnt) as newser_user_cnt,
// sum(all_user_cnt) as all_user_cnt,
// ds,
// #groupby#
// from
// holo_vcm_pub_newly_usrn_1d
// #where#
// group by ds,#groupby#
// )
// union all
// select
// sum(dau) as dau,
// sum(mau) as mau,
// sum(newser_user_cnt) as newser_user_cnt,
// sum(all_user_cnt) as all_user_cnt,
// ds,
// 0 as #groupby#
// from
// holo_vcm_pub_newly_usrn_1d
// #where#
// group by ds,#groupby#
// `;
