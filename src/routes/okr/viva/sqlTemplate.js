// 用户进入preview的占比
export const enterPreviewSql = `
SELECT sum(uv_new_pre_etr) as uv_new_pre_etr, 
       sum(uv_new) as uv_new, 
       sum(dau) as dau,
       sum(uv_pre_etr) as uv_pre_etr,
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;

// 用户导入完成占比
export const shareExportDone = `
SELECT sum(uv_new_exp_suc) as uv_new_exp_suc, 
       sum(uv_new) as uv_new, 
       sum(dau) as dau,
       sum(uv_exp_suc) as uv_exp_suc,
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;

// 分享用户占比
export const videoShare = `
SELECT sum(uv_shre) as uv_shre, 
       sum(dau) as dau, 
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;

// 人均分享次数
export const pvShare = `
SELECT sum(pv_cnt_shre) as pv_cnt_shre, 
       sum(uv_shre) as uv_shre, 
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;
// 模版创作用户占比
export const modAtr = `
SELECT sum(uv_sch_mod_atr) as uv_sch_mod_atr, 
       sum(uv_exp_suc) as uv_exp_suc, 
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;
// 模版创作视频数占比
export const modAtrPv = `
SELECT sum(pv_cnt_sch_mod_atr) as pv_cnt_sch_mod_atr, 
       sum(pv_cnt_exp_suc) as pv_cnt_exp_suc, 
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;
// 教程播放总数
export const pvPly = `
SELECT sum(pv_cnt_crs_ply) as pv_cnt_crs_ply,
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;
// 教程播放用户占比
export const uvPly = `
SELECT sum(uv_crs_ply) as uv_crs_ply,
sum(uv_ply) as uv_ply,
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;

// 7日rolling留存
export const rollingAtv = `
SELECT sum(uv_atv_actv_rolling) as uv_atv_actv_rolling,
sum(uv_new) as uv_new,
       ds
  FROM ads_viva_log_okr_stay_7rol_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;
// 7日rolling导出完成留存
export const rollingExp = `
SELECT sum(uv_exp_suc_rolling) as uv_exp_suc_rolling,
sum(uv_new) as uv_new,
       ds
  FROM ads_viva_log_okr_stay_7rol_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;
// 剪辑完成率
export const cutRate = `
SELECT sum(uv_exp_suc) as uv_exp_suc,
sum(uv_pre_etr) as uv_pre_etr,
sum(uv_new_exp_suc) as uv_new_exp_suc,
sum(uv_new_pre_etr) as uv_new_pre_etr,
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;
// 剪辑完成率
export const cutRateSave = `
SELECT sum(uv_save_suc) as uv_save_suc,
sum(uv_pre_etr) as uv_pre_etr,
sum(uv_new_save_suc) as uv_new_save_suc,
sum(uv_new_pre_etr) as uv_new_pre_etr,
       ds
  FROM ads_viva_log_okr_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;
// 教程用户播放的7日rolling
export const rollingPly = `
SELECT sum(uv_crs_ply_rolling) as uv_crs_ply_rolling,
sum(uv_crs_ply) as uv_crs_ply,
       ds
  FROM ads_viva_log_okr_stay_7rol_1d
where product = #product#
and ds >= #startDate#
and ds <= #endDate#
#quersql#
GROUP BY ds
order by ds
`;

// 曝光占比
export const expsUsrCnt = `
SELECT 
sum(exps_usr_cnt) as exps_usr_cnt,sum(dau) as dau,ds,flatform
FROM gh_viva_tmpl_tool_cnt_1d  
where type=#type# #ttid#
and ds >= #startDate#
and ds <= #endDate# #country#
GROUP BY ds,flatform
order by ds
`;

// 模版进入率
export const enterUsrCnt = `
SELECT 
sum(enter_usr_cnt) as enter_usr_cnt,
sum(exps_usr_cnt) as exps_usr_cnt,
ds,
flatform
FROM gh_viva_tmpl_tool_cnt_1d  
where type=#type# #ttid#
and ds >= #startDate# #country#
and ds <= #endDate#
GROUP BY ds,flatform
order by ds
`;
// 模版完成率
export const saveUsrCnt = `
SELECT 
sum(enter_usr_cnt) as enter_usr_cnt,
sum(expr_usr_cnt) as expr_usr_cnt,
ds,
flatform
FROM gh_viva_tmpl_tool_cnt_1d  
where type=#type# #ttid#
and ds >= #startDate# #country#
and ds <= #endDate#
GROUP BY ds,flatform
order by ds
`;
// 模版分享率
export const shareUsrCnt = `
SELECT 
sum(shared_usr_cnt) as shared_usr_cnt,
sum(expr_usr_cnt) as expr_usr_cnt,
ds,flatform
FROM gh_viva_tmpl_tool_cnt_1d  
where type=#type# #ttid# #country#
and ds >= #startDate#
and ds <= #endDate# 
GROUP BY ds,flatform
order by ds
`;
// 模版创作用户占比
export const puidCnt = `
SELECT 
sum(expr_usr_cnt) as expr_usr_cnt,
sum(export_done_usr_cnt) as export_done_usr_cnt,
ds,flatform
FROM gh_viva_tmpl_tool_cnt_1d  
where type=#type# #ttid#
and ds >= #startDate#
and ds <= #endDate# #country#
GROUP BY ds,flatform
order by ds
`;
// 模版创作视频数占比
export const atrPuidCnt = `
SELECT 
sum(atr_puid_cnt) as atr_puid_cnt,
sum(export_done_usr_cnt) as export_done_usr_cnt,
ds,flatform
FROM gh_viva_tmpl_tool_cnt_1d  
where type=#type# #ttid#
and ds >= #startDate#
and ds <= #endDate#
GROUP BY ds,flatform
order by ds
`;

// 模版列表
export const listSQL = `
SELECT sum(exps_usr_cnt) as exps_usr_cnt,
       sum(clik_usr_cnt) as clik_usr_cnt,
       sum(enter_usr_cnt) as enter_usr_cnt,
       sum(expr_usr_cnt) as expr_usr_cnt,
       sum(save_usr_cnt) as save_usr_cnt,
       sum(shared_usr_cnt) as shared_usr_cnt,
       ttid #flatform#
  FROM gh_viva_tmpl_tool_cnt_1d
where type=2 #ttid#
and ds >= #startDate# #country#
and ds <= #endDate# and exps_usr_cnt>0
GROUP BY ttid  #flatform#
order by clik_usr_cnt desc 
 `;

// 分享列表
export const shareList = `
SELECT sum(shared_vdo_pv_cnt ) as shared_vdo_pv_cnt,
sum( shared_vdo_uv_cnt ) as shared_vdo_uv_cnt,
sum( shared_wx_pv_cnt ) as shared_wx_pv_cnt,
sum( shared_wx_uv_cnt ) as shared_wx_uv_cnt,
sum( shared_wxp_pv_cnt ) as shared_wxp_pv_cnt,
sum( shared_wxp_uv_cnt ) as shared_wxp_uv_cnt,
sum( shared_bili_pv_cnt ) as shared_bili_pv_cnt,
sum( shared_bili_uv_cnt ) as shared_bili_uv_cnt,
sum( shared_dou_pv_cnt ) as shared_dou_pv_cnt,
sum( shared_dou_uv_cnt ) as shared_dou_uv_cnt,
sum( shared_other_pv_cnt ) as shared_other_pv_cnt,
sum( shared_other_uv_cnt ) as shared_other_uv_cnt,
sum(shared_whatsapp_pv_cnt) as shared_whatsapp_pv_cnt,
sum(shared_whatsapp_uv_cnt) as shared_whatsapp_uv_cnt,
sum(shared_instagram_pv_cnt) as shared_instagram_pv_cnt,
sum(shared_instagram_uv_cnt) as shared_instagram_uv_cnt,
sum(shared_facebook_pv_cnt) as shared_facebook_pv_cnt,
sum(shared_facebook_uv_cnt) as shared_facebook_uv_cnt,
sum(shared_tiktok_pv_cnt) as shared_tiktok_pv_cnt,
sum(shared_tiktok_uv_cnt) as shared_tiktok_uv_cnt,
ttid #flatform#
  FROM gh_viva_tmpl_shared_cnt_1d 
  where type=2 #ttid#
  and ds >= #startDate# #country#
  and ds <= #endDate#
  GROUP BY ttid #flatform#
  order by shared_vdo_pv_cnt
`;

// 分享次数
export const shareCountSQL = `
SELECT sum( shared_wx_pv_cnt ) as shared_wx_pv_cnt,
sum( shared_wxp_pv_cnt ) as shared_wxp_pv_cnt,
sum( shared_bili_pv_cnt ) as shared_bili_pv_cnt,
sum( shared_dou_pv_cnt ) as shared_dou_pv_cnt,
sum( shared_other_pv_cnt ) as shared_other_pv_cnt
  FROM gh_viva_tmpl_shared_cnt_1d 
  where type=#type# #ttid# 
  and ds >= #startDate#
  and ds <= #endDate# #country#
  #groupflatform#
`;

// 分享次数美国
export const shareCountUKSQL = `
SELECT sum(shared_whatsapp_pv_cnt) as shared_whatsapp_pv_cnt,
sum(shared_instagram_pv_cnt) as shared_instagram_pv_cnt,
sum(shared_facebook_pv_cnt) as shared_facebook_pv_cnt,
sum(shared_tiktok_pv_cnt) as shared_tiktok_pv_cnt
  FROM gh_viva_tmpl_shared_cnt_1d 
  where type=#type# #ttid# 
  and ds >= #startDate# 
  and ds <= #endDate# #country#
  #groupflatform#
`;

// 一键分享
export const shareOne = `
SELECT 
sum(shared_wx_pv_cnt ) as shared_wx_pv_cnt,
sum(shared_wx_uv_cnt ) as shared_wx_uv_cnt,
sum( shared_wxp_pv_cnt ) as shared_wxp_pv_cnt,
sum( shared_wxp_uv_cnt ) as shared_wxp_uv_cnt,
sum( shared_bili_pv_cnt ) as shared_bili_pv_cnt,
sum( shared_bili_uv_cnt ) as shared_bili_uv_cnt,
sum( shared_dou_pv_cnt ) as shared_dou_pv_cnt,
sum( shared_dou_uv_cnt ) as shared_dou_uv_cnt,
sum( shared_other_pv_cnt ) as shared_other_pv_cnt,
sum( shared_other_uv_cnt ) as shared_other_uv_cnt,
sum( one_share_pv_cnt ) as one_share_pv_cnt,
sum( one_share_uv_cnt ) as one_share_uv_cnt,
ds,flatform
  FROM gh_viva_tmpl_shared_cnt_1d 
  where type=#type# #ttid#
  and ds >= #startDate#
  and ds <= #endDate#
  GROUP BY ds,flatform
  order by ds
`;

export const ttidListSQL = `
SELECT DISTINCT(ttid) 
  FROM gh_viva_tmpl_tool_cnt_1d 
  where ttid is not null and exps_usr_cnt>0
`;

export const countrySQL = `
SELECT DISTINCT(country) 
  FROM gh_viva_tmpl_tool_cnt_1d 
`;
