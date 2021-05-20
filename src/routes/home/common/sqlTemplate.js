/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-27 17:30:53
 * @LastEditTime: 2020-07-15 13:39:50
 * @LastEditors: ssssslf
 */
// 有平台
export const allActvieUserSQL = `
select bizdate,
sum(dau) as dau,
sum(dau_new_1d) as dau_new_1d,
sum(dau_old_1d) as dau_old_1d,
sum(mau) as mau,
sum(wau) as wau,
sum(dau_ytdy_retn_1d) as dau_ytdy_retn_1d,
sum(dau_ytdy_1d) as dau_ytdy_1d
from vcm_app_comm_daliy_data
where type= '#product#' 
and bizdate >= #startDate# 
and bizdate<= #endDate# 
and platform = #platform# 
group by bizdate 
order by bizdate
`;
// 没有平台
export const allActvieUserPlatformSQL = `
select bizdate,
sum(dau) as dau,
sum(dau_new_1d) as dau_new_1d,
sum(dau_old_1d) as dau_old_1d,
sum(mau) as mau,
sum(wau) as wau,
sum(dau_ytdy_retn_1d) as dau_ytdy_retn_1d,
sum(dau_ytdy_1d) as dau_ytdy_1d
from vcm_app_comm_daliy_data
where type= '#product#' and bizdate >= #startDate# and bizdate<= #endDate# group by bizdate order by bizdate
`;
// vid
export const vidActiveUserSQL = `
select  active_dvc_cnt_1d as dau
        ,app_active_dvc_cnt_1d as app_dau
        ,new_dvc_cnt_1d as new_1d
        ,new_dau_cnt as dau_new_1d 
        ,app_new_dau_cnt as dau_app_new_1d
        ,app_old_dau_cnt as dau_app_old_1d
        ,old_dau_cnt as dau_old_1d
        ,round(new_stay_cnt_1d/y_new_dau_cnt_1d,4) as new_dau_stay
        ,round(old_stay_cnt_1d/y_old_dau_cnt_1d,4) as old_dau_stay
        ,round((new_stay_cnt_1d+old_stay_cnt_1d)/y_dau_cnt_1d,4) as dau_stay
        ,ds as bizdate
from    rpt_vid_itr_idx_1d
where   ds <= #endDate#
and     ds >= #startDate#
order by ds 
`;

export const allRetainUserSQL = `
select bizdate,sum(retn_1d_cnt) as retn_1d_cnt,sum(new_usr_cnt_1d) as new_usr_cnt_1d
from vcm_app_comm_retn_1d
where product_type= '#product#' 
and bizdate >= #startDate# 
and bizdate<= #endDate# 
and platform = #platform# 
group by bizdate 
order by bizdate
`;

export const allRetainUserPlatformSQL = `
select bizdate,
sum(retn_1d_cnt) as retn_1d_cnt,
sum(new_usr_cnt_1d) as new_usr_cnt_1d
from vcm_app_comm_retn_1d
where product_type= '#product#' and bizdate >= #startDate# and bizdate<= #endDate# group by bizdate order by bizdate
`;

// 次留趋势
export const retainUserActiveSQL = `
select bizdate,
SUM(pv_cnt_ystd_dretn_1d) as pv_cnt_ystd_dretn_1d, 
SUM(pv_cnt_ystd_1d)  as pv_cnt_ystd_1d,
SUM(pv_cnt_new_ystd_1d) as pv_cnt_new_ystd_1d, 
SUM(pv_cnt_new_ystd_dretn_1d)  as pv_cnt_new_ystd_dretn_1d,
SUM(pv_cnt_old_ystd_1d) as pv_cnt_old_ystd_1d, 
SUM(pv_cnt_old_ystd_dretn_1d)  as pv_cnt_old_ystd_dretn_1d
from vcm_app_comm_dau_1d
where  type= '#type#' and bizdate >= #startDate# and bizdate<= #endDate# #product#
group by bizdate
order by bizdate
`;
