export const productListSQL = `
select distinct(product_id) from vcm_pub_market_1d where product_id is not null;
`;

export const mediaSourceListSQL = `
/*+ engine= mpp*/
select distinct(media_source) from vcm_pub_market_1d where media_source is not null and #where#
order by media_source
`;

export const versionListSQL = `
select distinct(app_version) from vcm_pub_market_1d where app_version is not null and #where# order by app_version;
`;

export const countryListSQL = `
/*+ engine= mpp*/
select distinct(country) from vcm_pub_market_1d where country is not null and country not like '%25COM%25' and country not like '%25NET%25' and country not like '%25骨干网%25' and country not like '%25MAXCDN%25'
and country not like '%25ZVONKOVA%25' and #where#
order by country desc
;
`;

export const getListSQL = `
/*+ engine= mpp*/
SELECT 
 round(sum(a.sale_mnt),2) as sale_mnt
,round(sum(a.refund_mnt),2) as refund_mnt
,round(sum(a.cost),2) as cost
,round(sum((a.sale_mnt-a.refund_mnt)*a.profit_pro),2) as profit
,ds
,a.#groupby#
FROM vcm_pub_market_1d a
LEFT JOIN (
              SELECT  #groupby#
                      ,sum(#type#) as #type#
              FROM    vcm_pub_market_1d
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
round(sum(sale_mnt),2) as sale_mnt
,round(sum(refund_mnt),2) as refund_mnt
,round(sum(cost),2) as cost
,round(sum((sale_mnt-refund_mnt)*profit_pro),2) as profit
,ds
,#allvalue# as #groupby#
from vcm_pub_market_1d
#whereInner#
group by ds,#groupby#
;
`;

export const getProfitListSQL = `
/*+ engine= mpp*/
SELECT 
 round(sum(a.sale_mnt),2) as sale_mnt
,round(sum(a.refund_mnt),2) as refund_mnt
,round(sum(a.cost),2) as cost
,round(sum((a.sale_mnt-a.refund_mnt)*a.profit_pro),2) as profit
,ds
,a.#groupby#
FROM vcm_pub_market_1d a
LEFT JOIN (
              SELECT  #groupby#
                      ,sum((sale_mnt-refund_mnt)*profit_pro) as profit
              FROM    vcm_pub_market_1d
              #whereInner# and #groupby# is not null
              GROUP BY #groupby#
              ORDER BY profit DESC
              LIMIT 4
          ) b
ON a.#groupby# = b.#groupby#
#where#
AND  b.#groupby# IS NOT NULL
GROUP BY ds,a.#groupby#
union all
select 
round(sum(sale_mnt),2) as sale_mnt
,round(sum(refund_mnt),2) as refund_mnt
,round(sum(cost),2) as cost
,round(sum((sale_mnt-refund_mnt)*profit_pro),2) as profit
,ds
,#allvalue# as #groupby#
from vcm_pub_market_1d
#whereInner#
group by ds,#groupby#
;
`;
