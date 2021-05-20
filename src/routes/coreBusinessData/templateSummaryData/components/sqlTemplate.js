/*
 * @Date: 2021-03-04 15:03:54
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-21 11:20:27
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
export const productListSQL = `
/*+ engine= mpp*/
select distinct(product_id) from vcm_vd_template_log_summary_1d where product_id is not null;
`;

export const mediaSourceListSQL = `
/*+ engine= mpp*/
select distinct(media_source) from vcm_vd_template_log_summary_1d where media_source is not null and #where#
order by media_source
`;

export const campaignNameListSQL = `
/*+ engine= mpp*/
select distinct(campaign_name) from vcm_vd_template_log_summary_1d where campaign_name is not null and #where#
order by campaign_name
`;

export const countryListSQL = `
/*+ engine= mpp*/
select distinct(country) from vcm_vd_template_log_summary_1d where country is not null and #where#
;
`;

export const dauListSQL = `
/*+ engine= mpp*/
select 
product_id,
product as platform,
day as ds,
sum(dau) as dau
from 
ad_platform_count
where day >= '#startDate#' and day <= '#endDate#'  #where4#
group by
product_id,
product,
day
;
`;

export const dauMonthListSQL = `
/*+ engine= mpp*/
select 
product_id,
product as platform,
substring(day,1,6) as ds,
sum(dau) as dau
from 
ad_platform_count
where day >= '#startDate#' and day <= '#endDate#'  #where4#
group by 
product_id,
product,
substring(day,1,6)
;
`;

export const usrn1dListSQL = `
/*+ engine= mpp*/
select 
product_id,
platform,
ds,
sum(act_bef_1d_cnt) as act_bef_1d_cnt
from 
holo_vcm_pub_keep_usrn_1d
where ds >= '#startDate#' and ds <= '#endDate#'  #where3#
group by 
product_id,
platform,
ds
;
`;

export const usrn1dMonthListSQL = `
/*+ engine= mpp*/
select 
product_id,
platform,
substring(ds,1,6) as ds,
sum(act_bef_1d_cnt) as act_bef_1d_cnt
from 
holo_vcm_pub_keep_usrn_1d
where ds >= '#startDate#' and ds <= '#endDate#'  #where3#
group by 
product_id,
platform,
substring(ds,1,6)
;
`;

export const getListSQL = `
/*+ engine= mpp*/
select
a.product_id,
a.platform,
a.ds,
a.home_view_dvc_cnt，
a.home_view_cnt,
a.home_click_dvc_cnt,
a.home_click_cnt,
a.template_view_dvc_cnt,
a.template_view_cnt,
a.make_button_click_dvc_cnt,
a.make_button_click_cnt,
a.template_make_dvc_cnt,
a.template_make_cnt,
a.share_dvc_cnt,
a.share_cnt,
a.total_make_dvc_cnt,
a.total_make_cnt,
a.save_dvc_cnt,
a.save_cnt,
a.make_fail_dvc_cnt,
a.make_fail_cnt,
b.install_num,
0 as act_bef_1d_cnt,
0 as dau
from 
(
select
product_id,
platform,
ds,
sum(home_view_dvc_cnt) as home_view_dvc_cnt,
sum(home_view_cnt) as home_view_cnt,
sum(home_click_dvc_cnt) as home_click_dvc_cnt,
sum(home_click_cnt) as home_click_cnt,
sum(template_view_dvc_cnt) as template_view_dvc_cnt,
sum(template_view_cnt) as template_view_cnt,
sum(make_button_click_dvc_cnt) as make_button_click_dvc_cnt,
sum(make_button_click_cnt) as make_button_click_cnt,
sum(template_make_dvc_cnt) as template_make_dvc_cnt,
sum(template_make_cnt) as template_make_cnt,
sum(share_dvc_cnt) as share_dvc_cnt,
sum(share_cnt) as share_cnt,
sum(total_make_dvc_cnt) as total_make_dvc_cnt,
sum(total_make_cnt) as total_make_cnt,
sum(save_dvc_cnt) as save_dvc_cnt,
sum(save_cnt) as save_cnt,
sum(make_fail_dvc_cnt) as make_fail_dvc_cnt,
sum(make_fail_cnt) as make_fail_cnt
from vcm_vd_template_log_summary_1d
where ds >= '#startDate#' and ds <= '#endDate#'  #where#
group by 
product_id,
platform,
ds
) a left join (
select 
product_id,
platform,
reg_time as ds,
sum(reg_num) as install_num
from 
ads_pub_dp_cltusr_sub_1d
where reg_time >= '#startDate#' and reg_time <= '#endDate#'  #where2#
group by 
product_id,
platform,
reg_time
) b on a.product_id = b.product_id and a.platform = b.platform  and a.ds = b.ds
order by a.ds
;
`;

export const getMonthListSQL = `
/*+ engine= mpp*/
select
a.product_id,
a.platform,
substring(a.ds,1,6) as ds,
a.home_view_dvc_cnt，
a.home_view_cnt,
a.home_click_dvc_cnt,
a.home_click_cnt,
a.template_view_dvc_cnt,
a.template_view_cnt,
a.make_button_click_dvc_cnt,
a.make_button_click_cnt,
a.template_make_dvc_cnt,
a.template_make_cnt,
a.share_dvc_cnt,
a.share_cnt,
a.total_make_dvc_cnt,
a.total_make_cnt,
a.save_dvc_cnt,
a.save_cnt,
a.make_fail_dvc_cnt,
a.make_fail_cnt,
b.install_num,
0 as act_bef_1d_cnt,
 0 as dau
from 
(
select
product_id,
platform,
substring(ds,1,6) as ds,
sum(home_view_dvc_cnt) as home_view_dvc_cnt,
sum(home_view_cnt) as home_view_cnt,
sum(home_click_dvc_cnt) as home_click_dvc_cnt,
sum(home_click_cnt) as home_click_cnt,
sum(template_view_dvc_cnt) as template_view_dvc_cnt,
sum(template_view_cnt) as template_view_cnt,
sum(make_button_click_dvc_cnt) as make_button_click_dvc_cnt,
sum(make_button_click_cnt) as make_button_click_cnt,
sum(template_make_dvc_cnt) as template_make_dvc_cnt,
sum(template_make_cnt) as template_make_cnt,
sum(share_dvc_cnt) as share_dvc_cnt,
sum(share_cnt) as share_cnt,
sum(total_make_dvc_cnt) as total_make_dvc_cnt,
sum(total_make_cnt) as total_make_cnt,
sum(save_dvc_cnt) as save_dvc_cnt,
sum(save_cnt) as save_cnt,
sum(make_fail_dvc_cnt) as make_fail_dvc_cnt,
sum(make_fail_cnt) as make_fail_cnt
from vcm_vd_template_log_summary_1d
where ds >= #startDate# and ds <= '#endDate#'  #where#
group by 
product_id,
platform,
substring(ds,1,6)
) a left join (
select 
product_id,
platform,
substring(reg_time,1,6) as ds,
sum(reg_num) as install_num
from 
ads_pub_dp_cltusr_sub_1d
where reg_time >= '#startDate#' and reg_time <= '#endDate#'  #where2#
group by 
product_id,
platform,
substring(reg_time,1,6)
) b on a.product_id = b.product_id and a.platform = b.platform  and a.ds = b.ds
order by a.ds
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
// vcm_pub_newly_usrn_1d
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
// vcm_pub_newly_usrn_1d
// #where#
// group by ds,#groupby#
// `;
