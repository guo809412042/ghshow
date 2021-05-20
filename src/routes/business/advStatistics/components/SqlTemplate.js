
export const appProductListSQL = `
SELECT DISTINCT(product_id) as app_product FROM  ad_platform_count;
`;

// 国家列表
export const CountryListSQL = `
SELECT DISTINCT(country) as country FROM ad_platform_count;
`;

// 广告商列表
export const AdvCompanyListSQL = `
SELECT distinct(platform) as company FROM ad_platform_count #where#;
`;

// 广告位列表
export const AdvPlacementListSQL = `
SELECT placement_name,group_concat(placement_id) as placement_id from gh_advplacement #where# group by placement_name;
`;

// 广告统计列表
export const AdvListSQL = `
/*+engine=mpp*/
SELECT 
SUM(distinct DAU) as DAU,
ROUND(SUM(revenue)/SUM(distinct DAU),6) as ARPU,
SUM(request) as request,
SUM(filled) as filled,
SUM(impression) as impression,
SUM(click) as click,
ROUND(100 * SUM(filled)/SUM(request),2) AS fill_rate,
ROUND(100 * SUM(impression)/SUM(filled),2) AS show_rate,
ROUND(100 * SUM(click)/SUM(impression),2) AS CTR, 
ROUND(1000 * SUM(revenue)/SUM(impression),2) AS eCPM,
ROUND(SUM(revenue),2) AS revenue,
#groupby#
FROM ad_platform_count
 #where# group by #groupby# #orderby#`;

export const AdvChartSQL = `
/*+engine=mpp*/
SELECT 
day,
SUM(distinct DAU) as DAU,
ROUND(SUM(revenue)/SUM(distinct DAU),6) as ARPU,
SUM(request) as request, 
SUM(filled) as filled,
SUM(impression) as impression,
SUM(click) as click,
ROUND(100 * SUM(filled)/SUM(request),2) AS fill_rate,
ROUND(100 * SUM(impression)/SUM(filled),2) AS show_rate,
ROUND(100 * SUM(click)/SUM(impression),2) AS CTR, 
ROUND(1000 * SUM(revenue)/SUM(impression),2) AS eCPM,
ROUND(SUM(revenue),2) AS revenue
FROM ad_platform_count #where#
group by day
`;

// 广告统计列表
export const PlacementGroupListSQL = `
/*+engine=mpp*/
SELECT 
SUM(distinct DAU) as DAU,
ROUND(SUM(revenue)/SUM(distinct DAU),6) as ARPU,
SUM(request) as request,
SUM(filled) as filled,
SUM(impression) as impression,
SUM(click) as click,
ROUND(100 * SUM(filled)/SUM(request),2) AS fill_rate,
ROUND(100 * SUM(impression)/SUM(filled),2) AS show_rate,
ROUND(100 * SUM(click)/SUM(impression),2) AS CTR, 
ROUND(1000 * SUM(revenue)/SUM(impression),2) AS eCPM,
ROUND(SUM(revenue),2) AS revenue,
placement_name
FROM (
select dau, revenue, request, filled, impression, click, 
      #groupfield#
 FROM ad_platform_count
 #where#
)
GROUP BY placement_name 
order by placement_name`;
