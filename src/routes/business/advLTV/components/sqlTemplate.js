
export const countryListSQL = `
select distinct(country) from rpt_ad_ltv_real where country is not null and country <> '中国';
`;

export const productListSQL = `
select distinct(product_name) from rpt_ad_ltv_real;
`;

export const mediaSourceListSQL = `
select distinct(media_source) from rpt_ad_ltv_real
`;

export const campaignListSQL = `
select distinct(campaign_name) from rpt_ad_ltv_real #where#
`;

export const predictLTVSQL = `
select 
round(ltv,4) as ltv,
stay_num,
ltv_days,
reg_num,
day 
from (
select 
sum(ltv) as ltv,
avg(stay_rate) as stay_rate,
sum(predict_stay_num) as stay_num,
ltv_days,
sum(reg_num) as reg_num,
day 
from rpt_ad_ltv_predict #where#
group by day,ltv_days
)
order by day desc
`;

export const realLTVSQL = `
select 
round(ltv,4) as ltv,
stay_num,
reg_num,
ltv_days,
day 
from (
select 
sum(ltv) as ltv,
sum(stay_num) as stay_num,
sum(reg_num) as reg_num,
ltv_days,
day 
from rpt_ad_ltv_real #where#
group by day,ltv_days
)
order by day desc
`;

// CREATE TABLE quvideo_gh.`rpt_ad_ltv_predict` (
//   `country` varchar COMMENT '地区',
//   `media_source` varchar COMMENT '来源',
//   `platform` varchar NOT NULL COMMENT '平台 1-安卓 2-ios '
//   `product_name` varchar NOT NULL COMMENT '产品名称',
//   `product_id` int COMMENT '产品id',
//   `campaign_name` varchar COMMENT 'campaign名称',
//   `ltv_days` double COMMENT 'N天',
//   `ltv` double COMMENT 'ltv',
//   `stay_num` int COMMENT '留存用户数',
//   `reg_num` int COMMENT '新增新用户数',
//   `day` int NOT NULL COMMENT '日期'
// )
// PARTITION BY HASH KEY (`day`) PARTITION NUM 100
// TABLEGROUP gh_group1
// OPTIONS (UPDATETYPE='batch')
// COMMENT '广告预测ltv&留存'
// ;


// CREATE TABLE quvideo_gh.`rpt_ad_ltv_real` (
//   `country` varchar COMMENT '地区',
//   `media_source` varchar COMMENT '来源',
//   `platform` varchar NOT NULL COMMENT '平台 1-安卓 2-ios '
//   `product_name` varchar NOT NULL COMMENT '产品名称',
//   `product_id` int COMMENT '产品id',
//   `campaign_name` varchar COMMENT 'campaign名称',
//   `ltv_days` double COMMENT 'N天',
//   `ltv` double COMMENT 'ltv',
//   `stay_num` int COMMENT '留存用户数',
//   `reg_num` int COMMENT '新增新用户数',
//   `day` int NOT NULL COMMENT '日期'
// )
// PARTITION BY HASH KEY (`day`) PARTITION NUM 100
// TABLEGROUP gh_group1
// OPTIONS (UPDATETYPE='batch')
// COMMENT '广告真实ltv&留存'
// ;
