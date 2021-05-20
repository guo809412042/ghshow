/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-08-15 19:33:12
 * @LastEditTime: 2020-09-28 11:33:57
 * @LastEditors: ssssslf
 */
export const cardSQL = `
select 
sum(home_view_dvc_cnt) as home_view_dvc_cnt,
sum(template_make_dvc_cnt) as template_make_dvc_cnt,
sum(share_dvc_cnt) as share_dvc_cnt,
sum(pay_dvc_cnt) as pay_dvc_cnt
from vcm_vd_log_material_1h
where ds = #startDate# #where#
and ttid = '全部'
`;

export const chartSQL = `
select 
hh,
sum(home_view_dvc_cnt) as home_view_dvc_cnt,
sum(template_make_dvc_cnt) as template_make_dvc_cnt,
sum(share_dvc_cnt) as share_dvc_cnt,
sum(pay_dvc_cnt) as pay_dvc_cnt
from vcm_vd_log_material_1h
where ds = #startDate# #where#
and ttid = '全部'
group by hh
order by hh
`;

export const mediaSourceListSQL = `
select DISTINCT(media_source) from ads_pub_dp_serusr_sub_1d
`;