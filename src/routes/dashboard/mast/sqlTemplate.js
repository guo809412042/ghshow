// 新增设备数
export const deviceAddSQL = `
    select  sum(reg_dvc_cnt) as active_new_device_num
            ,ds
    from    rpt_india_itx_idx_1d
    where   ds >= #startDate#
    and     ds <= #endDate#  #quersql# 
    group by ds
    order by ds asc
    limit   10000
;`;
// 新增活跃设备数
export const deviceAddActSQL = `
select  sum(new_act_dvc_cnt) as new_act_dvc_cnt
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;`;

// 老用户活跃设备数
export const oldDeviceActSQL = `
select  sum(old_act_dvc_cnt) as old_act_dvc_cnt
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;`;

// DAU
export const DAU = `
select  sum(dau) as active_device_num
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;`;

// 新增次留
export const newStaySQL = `
/*+engine=mpp*/
select  round(
    if(sum(reg_dvc_cnt)>0,sum(reg_stay_dvc_cnt) *100/sum(reg_dvc_cnt),0)
    ,4
) as stay_ratio
,ds
from    rpt_india_log_stay_cnt_nd
where   ds >= #startDate#
and     ds <= #endDate# #quersql# 
group by ds
order by ds asc
limit   1000
;
`;

// 新增活跃次留
export const newActStaySQL = `
/*+engine=mpp*/
select round(
    if(sum(new_act_dvc_cnt)>0,sum(new_act_stay_dvc_cnt)*100/sum(new_act_dvc_cnt),0)
    ,4
) as stay_ratio
,ds
from    rpt_india_log_stay_cnt_nd
where   ds >= #startDate#
and     ds <= #endDate# #quersql# 
group by ds
order by ds asc
limit   1000
;
`;
// 老用户活跃次留
export const oldUserActStaySQL = `
/*+engine=mpp*/
select round(
    if(sum(old_act_dvc_cnt)>0,sum(old_act_stay_dvc_cnt)*100/sum(old_act_dvc_cnt),0)
    ,4
) as stay_ratio
,ds
from    rpt_india_log_stay_cnt_nd
where   ds >= #startDate#
and     ds <= #endDate# #quersql# 
group by ds
order by ds asc
limit   1000
;
`;
// 整体活跃次留
export const staySQL = `
/*+engine=mpp*/
select round(if(sum(dau)>0,sum(stay_dvc_cnt)*100 /sum(dau),0),4) as stay_ratio
,ds
from    rpt_india_log_stay_cnt_nd
where   ds >= #startDate#
and     ds <= #endDate# #quersql#
group by ds
order by ds asc
limit   1000
;
`;


// pv-全部制作率
export const madeRateOfPVSQL = `
/*+engine=mpp*/
select  if(sum(pre_exp_cnt)>0,round(sum(made_cnt)*100/ sum(pre_exp_cnt),4),0) as made_ratio
       ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;

// uv-全部制作率
export const madeRateOfUVSQL = `
/*+engine=mpp*/
select  if(sum(pre_exp_dvc_cnt)>0,round(sum(made_dvc_cnt)*100/ sum(pre_exp_dvc_cnt),4),0) as made_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// pv-新用户制作率
export const madeRateOfNewPVSQL = `
/*+engine=mpp*/
select  if(sum(new_pre_exp_cnt)>0,round(sum(new_made_cnt)*100/ sum(new_pre_exp_cnt),4),0) as made_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// uv-新用户制作率
export const madeRateOfNewUVSQL = `
/*+engine=mpp*/
select if(sum(new_pre_exp_dvc_cnt)>0,round(sum(new_made_dvc_cnt)*100/ sum(new_pre_exp_dvc_cnt),4),0) as made_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// pv-  老用户制作率
export const madeRateOfOldPVSQL = `
/*+engine=mpp*/
select   if(sum(old_pre_exp_cnt)>0,round(sum(old_made_cnt)*100/ sum(old_pre_exp_cnt),4),0) as made_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// uv-老用户制作率
export const madeRateOfOldUVSQL = `
/*+engine=mpp*/
select  if(sum(old_pre_exp_dvc_cnt)>0,round(sum(old_made_dvc_cnt)*100/ sum(old_pre_exp_dvc_cnt),4),0) as made_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;

// pv-全部导出率
export const exportRateOfPVSQL = `
/*+engine=mpp*/
select  if(sum(made_cnt) >0,round(sum(export_cnt)*100/sum(made_cnt),4),0) as export_ratio
       ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;

// uv-全部导出率
export const exportRateOfUVSQL = `
/*+engine=mpp*/
select if(sum(made_dvc_cnt) >0,round(sum(export_dvc_cnt)*100/sum(made_dvc_cnt),4),0) as export_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// pv-新用户导出率
export const exportRateOfNewPVSQL = `
/*+engine=mpp*/
select if(sum(new_made_cnt) >0,round(sum(new_export_cnt)*100/sum(new_made_cnt),4),0) as export_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// uv-新用户导出率
export const exportRateOfNewUVSQL = `
/*+engine=mpp*/
select if(sum(new_made_dvc_cnt) >0,round(sum(new_export_dvc_cnt)*100/sum(new_made_dvc_cnt),4),0) as export_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// pv-  老用户导出率
export const exportRateOfOldPVSQL = `
/*+engine=mpp*/
select   if(sum(old_made_cnt) >0,round(sum(old_export_cnt)*100/sum(old_made_cnt),4),0) as export_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// uv-老用户导出率
export const exportRateOfOldUVSQL = `
/*+engine=mpp*/
select if(sum(old_made_dvc_cnt) >0,round(sum(old_export_dvc_cnt)*100/sum(old_made_dvc_cnt),4),0) as export_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;

// pv-全部分享率
export const shareRateOfPVSQL = `
/*+engine=mpp*/
select  if(sum(export_cnt)>0,round(sum(shr_cnt)*100/sum(export_cnt),4),0) as shr_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;

// uv-全部分享率
export const shareRateOfUVSQL = `
/*+engine=mpp*/
select if(sum(export_dvc_cnt)>0,round(sum(shr_dvc_cnt)*100/sum(export_dvc_cnt),4),0) as shr_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// pv-新用户分享率
export const shareRateOfNewPVSQL = `
/*+engine=mpp*/
select if(sum(new_export_cnt)>0,round(sum(new_shr_cnt)*100/sum(new_export_cnt),4),0) as shr_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// uv-新用户分享率
export const shareRateOfNewUVSQL = `
/*+engine=mpp*/
select if(sum(new_export_dvc_cnt)>0,round(sum(new_shr_dvc_cnt)*100/sum(new_export_dvc_cnt),4),0) as shr_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// pv-  老用户分享率
export const shareRateOfOldPVSQL = `
/*+engine=mpp*/
select   if(sum(old_export_cnt)>0,round(sum(old_shr_cnt)*100/sum(old_export_cnt),4),0) as shr_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// uv-老用户分享率
export const shareRateOfOldUVSQL = `
/*+engine=mpp*/
select if(sum(old_export_dvc_cnt)>0,round(sum(old_shr_dvc_cnt)*100/sum(old_export_dvc_cnt),4),0) as shr_ratio
,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;

// 首页曝光率-老用户
export const homeExposeOfOldSQL = `
/*+engine=mpp*/
select if(
            sum(old_act_dvc_cnt) >0
            ,round(sum(old_fir_exp_dvc_cnt)*100/sum(old_act_dvc_cnt),4)
            ,0
        ) as fir_exp_ratio
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// 首页曝光率-新用户
export const homeExposeOfNewSQL = `
/*+engine=mpp*/
select  if(
            sum(new_act_dvc_cnt)>0
            ,round(sum(new_fir_exp_dvc_cnt)*100/ sum(new_act_dvc_cnt),4)
            ,0
        ) as fir_exp_ratio
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// 首页曝光率-全部用户
export const homeExposeSQL = `
/*+engine=mpp*/
select  if(
            sum(dau)>0
            ,round(sum(new_fir_exp_dvc_cnt+old_fir_exp_dvc_cnt)*100/sum(dau),4)
            ,0
        ) as fir_exp_ratio
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;

// 预览页转化率 PV 老用户
export const prePageExpOfOldPVSQL = `
/*+engine=mpp*/
select if(
            sum(old_fir_exp_cnt) >0
            ,round(sum(old_cover_click_cnt)*100/sum(old_fir_exp_cnt),4)
            ,0
        ) as cover_exp_ratio
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// 预览页转化率 PV 新用户
export const prePageExpOfNewPVSQL = `
/*+engine=mpp*/
select  if(
            sum(new_fir_exp_cnt)>0
            ,round(sum(new_cover_click_cnt)*100/ sum(new_fir_exp_cnt),4)
            ,0
        ) as cover_exp_ratio
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// 预览页转化率 PV 全部用户
export const prePageExpOfPVSQL = `
/*+engine=mpp*/
select if(
            sum(new_fir_exp_cnt+old_fir_exp_cnt)>0
            ,round(
                sum(new_cover_click_cnt+old_cover_click_cnt )*100/sum(new_fir_exp_cnt+old_fir_exp_cnt)
                ,4
            )
            ,0
        ) as cover_exp_ratio
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// 预览页转化率 UV 老用户
export const prePageExpOfOldUVSQL = `
/*+engine=mpp*/
select if(
            sum(old_fir_exp_dvc_cnt) >0
            ,round(sum(old_cover_click_dvc_cnt)*100/sum(old_fir_exp_dvc_cnt),4)
            ,0
        ) as cover_exp_ratio
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// 预览页转化率 UV 新用户
export const prePageExpOfNewUVSQL = `
/*+engine=mpp*/
select   if(
            sum(new_fir_exp_dvc_cnt)>0
            ,round(sum(new_cover_click_dvc_cnt)*100/ sum(new_fir_exp_dvc_cnt),4)
            ,0
        ) as cover_exp_ratio
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
// 预览页转化率 UV 全部用户
export const prePageExpOfUVSQL = `
/*+engine=mpp*/
select if(
            sum(new_fir_exp_dvc_cnt+old_fir_exp_dvc_cnt)>0
            ,round(
                sum(new_cover_click_dvc_cnt+old_cover_click_dvc_cnt)*100/sum(new_fir_exp_dvc_cnt+old_fir_exp_dvc_cnt)
                ,4
            )
            ,0
        ) as cover_exp_ratio
        ,ds
from    rpt_india_itx_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#  #quersql# 
group by ds
order by ds asc
limit   10000
;
`;
