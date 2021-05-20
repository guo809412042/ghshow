/*
 * @Date: 2020-09-04 17:00:29
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-25 09:58:28
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */

export const countryListSQL = `
select distinct(country_name) from vcm_pub_trd_overview where country_name is not null;
`;

// 新增总数
export const installAllSQL = `
select sum(cast(dau_new_1d as double)) as install from vcm_pub_trd_overview #where#
`;

// 新增饼图
export const installBarSQL = `
/*+engine=mpp*/
select sum(cast(dau_new_1d as double)) as install,product_id as product_id from vcm_pub_trd_overview #where# group by product_id order by product_id
`;

// 新增折线图
export const installLineSQL = `
/*+engine=mpp*/
select sum(cast(dau_new_1d as double)) as install,ds as ds from vcm_pub_trd_overview #where# group by ds order by ds
`;

// 销售额总数
export const saleAllSQL = `
select sum(sale_total_1d+refd_total_1d) as sale from vcm_pub_trd_overview #where#
`;

// 销售额饼图
export const saleBarSQL = `
/*+engine=mpp*/
select round(sale,2) as sale,product_id from(
select sum(sale_total_1d+refd_total_1d) as sale,product_id as product_id from vcm_pub_trd_overview #where# group by product_id) order by product_id
`;

// 销售额折线图
export const saleLineSQL = `
/*+engine=mpp*/
select round(sale,2) as sale,ds from(
select sum(sale_total_1d+refd_total_1d) as sale,ds as ds from vcm_pub_trd_overview #where# group by ds) order by ds
`;

// 广告花费总数
export const costAllSQL = `
select sum(cost) as cost from vcm_pub_trd_overview #where#
`;

// 广告变现总数
export const adIncomeTotalAllSQL = `
select sum(ad_income_total) as ad_income_total from vcm_pub_trd_overview #where#
`;

// 广告花费饼图
export const adIncomeTotalBarSQL = `
/*+engine=mpp*/
select round(ad_income_total,2) as ad_income_total,product_id from(
select sum(ad_income_total) as ad_income_total,product_id from vcm_pub_trd_overview #where# group by product_id) order by product_id
`;

// 广告花费饼图
export const costBarSQL = `
/*+engine=mpp*/
select round(cost,2) as cost,product_id from(
select sum(cost) as cost,product_id from vcm_pub_trd_overview #where# group by product_id) order by product_id
`;

// 首购现售额折线图
export const adIncomeTotalLineSQL = `
/*+engine=mpp*/
select round(ad_income_total,2) as ad_income_total,ds from(
select sum(ad_income_total) as ad_income_total,ds from vcm_pub_trd_overview #where# group by ds) order by ds
`;

// 首购现售额折线图
export const costLineSQL = `
/*+engine=mpp*/
select round(new_pay_total,2) as new_pay_total,cost,ds from(
select sum(new_pay_total) as new_pay_total,sum(cost) as cost,ds from vcm_pub_trd_overview #where# group by ds) order by ds
`;


// 首购现售额折线图
export const vidDauBarSQL = `
/*+engine=mpp*/
SELECT 'vid' as type,
sum(active_dvc_cnt_1d) as dau
  FROM rpt_vid_itr_idx_1d
  #where2#
`;

// 首购现售额折线图
export const allDauBarSQL = `
/*+engine=mpp*/
SELECT type,
       sum(dau)  as dau
  FROM vcm_app_comm_daliy_data
  #where1#
 GROUP BY type
 UNION ALL
SELECT 'vid' as type,
sum(active_dvc_cnt_1d) as dau
  FROM rpt_vid_itr_idx_1d
  #where2#
`;

// 首购现售额折线图
export const noVidDauBarSQL = `
/*+engine=mpp*/
SELECT type,
       sum(dau)  as dau
  FROM vcm_app_comm_daliy_data
  #where1#
 GROUP BY type
`;

// dau折线图
export const allDauLineSQL = `
/*+engine=mpp*/
SELECT bizdate as ds,
  sum(dau)  as dau
  FROM vcm_app_comm_daliy_data
  #where1#
 GROUP BY bizdate
 order by bizdate
`;

// dau折线图
export const vidDauLineSQL = `
/*+engine=mpp*/
SELECT ds,
       sum(active_dvc_cnt_1d) as dau
  FROM rpt_vid_itr_idx_1d
  #where2#
 GROUP BY ds
 order by ds
`;

// CREATE TABLE quvideo_gh.`vcm_pub_trd_overview` (
//  `product_id` bigint COMMENT '产品ID',
//   `platform` bigint COMMENT '平台 1-安卓 2-IOS',
//   `country_name` varchar COMMENT '国家名称',
//   `dau_new_1d` bigint COMMENT '新增活跃人数',
//   `sale_total_1d` double COMMENT '销售总金额',
//   `refd_total_1d` double COMMENT '退款总金额',
//   `cost` double COMMENT '消耗总金额',
//   `ds` bigint COMMENT '日期编码',
//   PRIMARY KEY (`ds`,`product_id`,`platform`,`country_name`)
// )
// PARTITION BY HASH KEY (`ds`) PARTITION NUM 128
// TABLEGROUP gh_group1
// OPTIONS (UPDATETYPE='realtime')
// COMMENT '各产品交易域数据概览'
// ;
