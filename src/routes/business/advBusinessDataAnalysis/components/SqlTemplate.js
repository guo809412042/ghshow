
export const appProductListSQL = `
SELECT DISTINCT(product_id) as app_product FROM  ad_platform_count;
`;

// 国家列表
export const CountryListSQL = `
SELECT DISTINCT(country) as country FROM vcm_pub_log_ad_analyse_business_ow where country IS NOT NULL;
`;

// 广告商列表
export const AdvCompanyListSQL = `
SELECT distinct(platform) as company FROM ad_platform_count #where#;
`;

// 广告位列表
export const AdvPlacementListSQL = `
SELECT distinct(placement_id) as placement_id FROM vcm_pub_log_ad_analyse_business_ow where placement_id is not NULL #where#;
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

// 广告分析来源查询
export const appkeyListSQL = `
/*+engine=mpp*/
SELECT distinct(app_version) as app_version FROM vcm_pub_log_ad_analyse_business_ow where app_version is not NULL #where#;
`;

// 广告分析来源查询
export const mediaSourceListSQL = `
/*+engine=mpp*/
SELECT distinct(media_source) as media_source FROM vcm_pub_log_ad_analyse_business_ow where media_source is not NULL;
`;

// 广告分析来源查询
export const campaignListSQL = `
/*+engine=mpp*/
SELECT distinct(campaign_name) as campaign FROM vcm_pub_log_ad_analyse_business_ow where campaign_name is not NULL #where#;
`;

// 广告分析产品查询
export const productListSQL = `
/*+engine=mpp*/
SELECT distinct(product_name) as product_name FROM vcm_pub_log_ad_analyse_business_ow where product_name is not NULL;
`;

// 广告分析广告商查询
export const platformNameListSQL = `
/*+engine=mpp*/
SELECT distinct(platform_id) as platform_id FROM vcm_pub_log_ad_analyse_business_ow  where platform_id is not NULL #where#;
`;

export const listDaysql = `
/*+ engine= mpp*/
SELECT
        a.*,
        b.triggers,
        b.triggeruid_num,
        b.request_num,
        c.dau
FROM
(  
    SELECT 
       ds,
      product_name,
      platform,
      sum(request_suc_num) fill_suc_num,
      sum(request_fail_num) fill_fail_num,
      ROUND(sum(request_suc_num)  / sum(request_num), 6) fill_rate,
      sum(show_num) show_num,
      sum(showuid_num) showuid_num,
      ROUND(sum(show_num)  /sum(request_suc_num), 6) show_rate,
      sum(click_num) click_num,
      ROUND(sum(click_num)  / sum(show_num), 6) click_rate,
      sum(video_num) video_num
  FROM vcm_pub_log_ad_analyse_business_ow
 #where1#
   #group1#
) a
LEFT  OUTER JOIN 
(
    
   SELECT 
      ds,
      product_name,
      platform,
      sum(triggers) triggers, #不变
      sum(triggeruid_num) triggeruid_num, #不变
      sum(request_num) request_num #不变
  FROM vcm_pub_log_ad_analyse_business_ow
 #where2#
 #group2#
) b
on a.ds=b.ds
 AND  a.product_name=b.product_name
 AND   a.platform=b.platform
 LEFT  OUTER JOIN 
(
   SELECT 
      ds,
      product_name,
      platform,
      sum(DISTINCT dau) dau
  FROM vcm_pub_log_ad_analyse_business_ow
  #where3#
  group by  ds, product_name, platform
) c
 ON  a.ds=c.ds
 AND  a.product_name=c.product_name
 and a.platform=c.platform
 order by a.ds desc
;
`;

export const listDayplacementsql = `
/*+ engine= mpp*/
SELECT
        a.*,
        b.triggers,
        b.triggeruid_num,
        b.request_num,
        c.dau
FROM
(  
    SELECT 
       ds,
      product_name,
      platform,
      placement_id,
      sum(request_suc_num) fill_suc_num,
      sum(request_fail_num) fill_fail_num,
      ROUND(sum(request_suc_num)  / sum(request_num), 6) fill_rate,
      sum(show_num) show_num,
      sum(showuid_num) showuid_num,
      ROUND(sum(show_num)  /sum(request_suc_num), 6) show_rate,
      sum(click_num) click_num,
      ROUND(sum(click_num)  / sum(show_num), 6) click_rate,
      sum(video_num) video_num
  FROM vcm_pub_log_ad_analyse_business_ow
 #where1#
   #group1#
   order by ds desc
) a
LEFT  OUTER JOIN 
(
    
   SELECT 
      ds,
      product_name,
      platform,
      placement_id,
      sum(triggers) triggers, #不变
      sum(triggeruid_num) triggeruid_num, #不变
      sum(request_num) request_num #不变
  FROM vcm_pub_log_ad_analyse_business_ow
 #where2#
 #group2#
 order by ds desc
) b
on a.ds=b.ds
 AND  a.product_name=b.product_name
 AND   a.platform=b.platform
 and a.placement_id = b.placement_id
 LEFT  OUTER JOIN 
(
   SELECT 
      ds,
      product_name,
      platform,
      sum(DISTINCT dau) dau
  FROM vcm_pub_log_ad_analyse_business_ow
  #where3#
  group by  ds, product_name, platform
) c
 ON  a.ds=c.ds
 AND  a.product_name=c.product_name
 and a.platform=c.platform
 order by a.ds desc
;
`;

export const listplacementsql = `
/*+ engine= mpp*/
SELECT
        a.*,
        b.triggers,
        b.triggeruid_num,
        b.request_num,
        b.dau
FROM
(  
    SELECT 
      product_name,
      platform,
      placement_id,
      sum(request_suc_num) fill_suc_num,
      sum(request_fail_num) fill_fail_num,
      ROUND(sum(request_suc_num)  / sum(request_num), 6) fill_rate,
      sum(show_num) show_num,
      sum(showuid_num) showuid_num,
      ROUND(sum(show_num)  /sum(request_suc_num), 6) show_rate,
      sum(click_num) click_num,
      ROUND(sum(click_num)  / sum(show_num), 6) click_rate,
      sum(video_num) video_num
  FROM vcm_pub_log_ad_analyse_business_ow
 #where1#
   #group1#
) a
LEFT  OUTER JOIN 
(
    
   SELECT 
      product_name,
      platform,
      placement_id,
      sum(triggers) triggers, #不变
      sum(triggeruid_num) triggeruid_num, #不变
      sum(request_num) request_num, #不变
      sum( DISTINCT dau ) dau
  FROM vcm_pub_log_ad_analyse_business_ow
 #where2#
 #group2#
) b
on a.product_name=b.product_name
 AND   a.platform=b.platform
 and a.placement_id = b.placement_id
;
`;
