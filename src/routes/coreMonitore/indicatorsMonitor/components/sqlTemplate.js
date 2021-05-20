/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-14 16:05:39
 * @LastEditTime: 2020-08-18 17:01:14
 * @LastEditors: ssssslf
 */
// 地区
export const countryNameSQL = `
select  DISTINCT(country) from   rpt_viva_log_index_minit_nd
`;
export const appVersionSQL = `
 SELECT DISTINCT(app_version) FROM rpt_viva_log_index_minit_nd 
 where app_version is not null
 and platform = '#platform#'
 order by app_version desc
 `;

export const listSQL = `
/*+engine=mpp*/
select '全球' as #type#
,sum(dau) AS dau
,sum(new_dvc_cnt) AS new_dvc_cnt
,sum(put_new_dvc_cnt) AS put_new_dvc_cnt
,sum(organic_new_dvc_cnt) AS organic_new_dvc_cnt
,sum(put_dvc_stay_cnt) AS put_dvc_stay_cnt
,sum(organic_dvc_stay_cnt) AS organic_dvc_stay_cnt
,sum(enter_home_dvc_cnt) AS enter_home_dvc_cnt
,sum(enter_gallery_dvc_cnt) AS enter_gallery_dvc_cnt
,sum(enter_edit_dvc_cnt) AS enter_edit_dvc_cnt
,sum(exp_succ_dvc_cnt) AS exp_succ_dvc_cnt
,sum(income) AS income
,sum(fst_income) AS fst_income
,sum(renew_income) AS renew_income
,sum(new_dvc_pay_dvc_cnt_7d) AS new_dvc_pay_dvc_cnt_7d
,sum(exp_bgm_dvc_cnt) AS exp_bgm_dvc_cnt
,sum(exp_theme_dvc_cnt) AS exp_theme_dvc_cnt
,sum(exp_cf_dvc_cnt) AS exp_cf_dvc_cnt
,sum(exp_ef_dvc_cnt) AS exp_ef_dvc_cnt
,sum(exp_t_dvc_cnt) AS exp_t_dvc_cnt
,sum(exp_stick_dvc_cnt) AS exp_stick_dvc_cnt
,sum(exp_trans_dvc_cnt) AS exp_trans_dvc_cnt
,sum(atr_puid_cnt) AS atr_puid_cnt
,sum(start_exp_cnt) AS start_exp_cnt
,sum(exp_cancel_cnt) AS exp_cancel_cnt
,sum(exp_fail_cnt) AS exp_fail_cnt
,sum(exp_normal_cnt) AS exp_normal_cnt
,sum(exp_hd_cnt) AS exp_hd_cnt
,sum(click_save_dvc_cnt) AS click_save_dvc_cnt
,sum(exp_normal_vdo_size) AS exp_normal_vdo_size
,sum(exp_hd_vdo_size) AS exp_hd_vdo_size
,sum(exp_normal_vdo_time) AS exp_normal_vdo_time
,sum(exp_hd_vdo_time) AS exp_hd_vdo_time
,sum(use_material_dvc_cnt) AS use_material_dvc_cnt
,sum(fx_dvc_cnt) as fx_dvc_cnt
,sum(exp_succ_cnt) as exp_succ_cnt
FROM    rpt_viva_log_index_minit_nd
WHERE   ds>='#startDate#' and ds <='#endDate#' #where#
UNION ALL
select '中东' as #type#
,sum(dau) AS dau
,sum(new_dvc_cnt) AS new_dvc_cnt
,sum(put_new_dvc_cnt) AS put_new_dvc_cnt
,sum(organic_new_dvc_cnt) AS organic_new_dvc_cnt
,sum(put_dvc_stay_cnt) AS put_dvc_stay_cnt
,sum(organic_dvc_stay_cnt) AS organic_dvc_stay_cnt
,sum(enter_home_dvc_cnt) AS enter_home_dvc_cnt
,sum(enter_gallery_dvc_cnt) AS enter_gallery_dvc_cnt
,sum(enter_edit_dvc_cnt) AS enter_edit_dvc_cnt
,sum(exp_succ_dvc_cnt) AS exp_succ_dvc_cnt
,sum(income) AS income
,sum(fst_income) AS fst_income
,sum(renew_income) AS renew_income
,sum(new_dvc_pay_dvc_cnt_7d) AS new_dvc_pay_dvc_cnt_7d
,sum(exp_bgm_dvc_cnt) AS exp_bgm_dvc_cnt
,sum(exp_theme_dvc_cnt) AS exp_theme_dvc_cnt
,sum(exp_cf_dvc_cnt) AS exp_cf_dvc_cnt
,sum(exp_ef_dvc_cnt) AS exp_ef_dvc_cnt
,sum(exp_t_dvc_cnt) AS exp_t_dvc_cnt
,sum(exp_stick_dvc_cnt) AS exp_stick_dvc_cnt
,sum(exp_trans_dvc_cnt) AS exp_trans_dvc_cnt
,sum(atr_puid_cnt) AS atr_puid_cnt
,sum(start_exp_cnt) AS start_exp_cnt
,sum(exp_cancel_cnt) AS exp_cancel_cnt
,sum(exp_fail_cnt) AS exp_fail_cnt
,sum(exp_normal_cnt) AS exp_normal_cnt
,sum(exp_hd_cnt) AS exp_hd_cnt
,sum(click_save_dvc_cnt) AS click_save_dvc_cnt
,sum(exp_normal_vdo_size) AS exp_normal_vdo_size
,sum(exp_hd_vdo_size) AS exp_hd_vdo_size
,sum(exp_normal_vdo_time) AS exp_normal_vdo_time
,sum(exp_hd_vdo_time) AS exp_hd_vdo_time
,sum(use_material_dvc_cnt) AS use_material_dvc_cnt
,sum(fx_dvc_cnt) as fx_dvc_cnt
,sum(exp_succ_cnt) as exp_succ_cnt
FROM    rpt_viva_log_index_minit_nd
WHERE   ds>='#startDate#' and ds <='#endDate#' #where#
and  country in ('阿尔及利亚','巴林','埃及','约旦','科威特','黎巴嫩','利比亚','摩洛哥','阿曼','卡塔尔','沙特阿拉伯','突尼斯','阿联酋','阿拉伯联合酋长国','巴勒斯坦','也门','伊拉克','叙利亚')
UNION ALL
SELECT  #type#
,sum(dau) AS dau
,sum(new_dvc_cnt) AS new_dvc_cnt
,sum(put_new_dvc_cnt) AS put_new_dvc_cnt
,sum(organic_new_dvc_cnt) AS organic_new_dvc_cnt
,sum(put_dvc_stay_cnt) AS put_dvc_stay_cnt
,sum(organic_dvc_stay_cnt) AS organic_dvc_stay_cnt
,sum(enter_home_dvc_cnt) AS enter_home_dvc_cnt
,sum(enter_gallery_dvc_cnt) AS enter_gallery_dvc_cnt
,sum(enter_edit_dvc_cnt) AS enter_edit_dvc_cnt
,sum(exp_succ_dvc_cnt) AS exp_succ_dvc_cnt
,sum(income) AS income
,sum(fst_income) AS fst_income
,sum(renew_income) AS renew_income
,sum(new_dvc_pay_dvc_cnt_7d) AS new_dvc_pay_dvc_cnt_7d
,sum(exp_bgm_dvc_cnt) AS exp_bgm_dvc_cnt
,sum(exp_theme_dvc_cnt) AS exp_theme_dvc_cnt
,sum(exp_cf_dvc_cnt) AS exp_cf_dvc_cnt
,sum(exp_ef_dvc_cnt) AS exp_ef_dvc_cnt
,sum(exp_t_dvc_cnt) AS exp_t_dvc_cnt
,sum(exp_stick_dvc_cnt) AS exp_stick_dvc_cnt
,sum(exp_trans_dvc_cnt) AS exp_trans_dvc_cnt
,sum(atr_puid_cnt) AS atr_puid_cnt
,sum(start_exp_cnt) AS start_exp_cnt
,sum(exp_cancel_cnt) AS exp_cancel_cnt
,sum(exp_fail_cnt) AS exp_fail_cnt
,sum(exp_normal_cnt) AS exp_normal_cnt
,sum(exp_hd_cnt) AS exp_hd_cnt
,sum(click_save_dvc_cnt) AS click_save_dvc_cnt
,sum(exp_normal_vdo_size) AS exp_normal_vdo_size
,sum(exp_hd_vdo_size) AS exp_hd_vdo_size
,sum(exp_normal_vdo_time) AS exp_normal_vdo_time
,sum(exp_hd_vdo_time) AS exp_hd_vdo_time
,sum(use_material_dvc_cnt) AS use_material_dvc_cnt
,sum(fx_dvc_cnt) as fx_dvc_cnt
,sum(exp_succ_cnt) as exp_succ_cnt
FROM    rpt_viva_log_index_minit_nd
WHERE   ds>='#startDate#' and ds <='#endDate#' #where# #country#
GROUP BY #type#
order by #order# desc
`;

export const getDaySQL = `
select count(distinct(ds)) as count,app_version  
from rpt_viva_log_index_minit_nd 
WHERE   ds>='#startDate#' and ds <='#endDate#' 
#where# #country# 
group by app_version
order by app_version desc`;

export const listDaySQL = `
/*+engine=mpp*/
select * from (
  select '全球' as #type#
  ,ds
  ,sum(dau) AS dau
  ,sum(new_dvc_cnt) AS new_dvc_cnt
  ,sum(put_new_dvc_cnt) AS put_new_dvc_cnt
  ,sum(organic_new_dvc_cnt) AS organic_new_dvc_cnt
  ,sum(put_dvc_stay_cnt) AS put_dvc_stay_cnt
  ,sum(organic_dvc_stay_cnt) AS organic_dvc_stay_cnt
  ,sum(enter_home_dvc_cnt) AS enter_home_dvc_cnt
  ,sum(enter_gallery_dvc_cnt) AS enter_gallery_dvc_cnt
  ,sum(enter_edit_dvc_cnt) AS enter_edit_dvc_cnt
  ,sum(exp_succ_dvc_cnt) AS exp_succ_dvc_cnt
  ,sum(income) AS income
  ,sum(fst_income) AS fst_income
  ,sum(renew_income) AS renew_income
  ,sum(new_dvc_pay_dvc_cnt_7d) AS new_dvc_pay_dvc_cnt_7d
  ,sum(exp_bgm_dvc_cnt) AS exp_bgm_dvc_cnt
  ,sum(exp_theme_dvc_cnt) AS exp_theme_dvc_cnt
  ,sum(exp_cf_dvc_cnt) AS exp_cf_dvc_cnt
  ,sum(exp_ef_dvc_cnt) AS exp_ef_dvc_cnt
  ,sum(exp_t_dvc_cnt) AS exp_t_dvc_cnt
  ,sum(exp_stick_dvc_cnt) AS exp_stick_dvc_cnt
  ,sum(exp_trans_dvc_cnt) AS exp_trans_dvc_cnt
  ,sum(atr_puid_cnt) AS atr_puid_cnt
  ,sum(start_exp_cnt) AS start_exp_cnt
  ,sum(exp_cancel_cnt) AS exp_cancel_cnt
  ,sum(exp_fail_cnt) AS exp_fail_cnt
  ,sum(exp_normal_cnt) AS exp_normal_cnt
  ,sum(exp_hd_cnt) AS exp_hd_cnt
  ,sum(click_save_dvc_cnt) AS click_save_dvc_cnt
  ,sum(exp_normal_vdo_size) AS exp_normal_vdo_size
  ,sum(exp_hd_vdo_size) AS exp_hd_vdo_size
  ,sum(exp_normal_vdo_time) AS exp_normal_vdo_time
  ,sum(exp_hd_vdo_time) AS exp_hd_vdo_time
  ,sum(exp_succ_cnt) as exp_succ_cnt
  ,sum(use_material_dvc_cnt) AS use_material_dvc_cnt
  ,sum(fx_dvc_cnt) as fx_dvc_cnt
  FROM    rpt_viva_log_index_minit_nd
  WHERE   ds>='#startDate#' and ds <='#endDate#' #where#
  group by ds
  UNION ALL
  select '中东' as #type#
  ,ds
  ,sum(dau) AS dau
  ,sum(new_dvc_cnt) AS new_dvc_cnt
  ,sum(put_new_dvc_cnt) AS put_new_dvc_cnt
  ,sum(organic_new_dvc_cnt) AS organic_new_dvc_cnt
  ,sum(put_dvc_stay_cnt) AS put_dvc_stay_cnt
  ,sum(organic_dvc_stay_cnt) AS organic_dvc_stay_cnt
  ,sum(enter_home_dvc_cnt) AS enter_home_dvc_cnt
  ,sum(enter_gallery_dvc_cnt) AS enter_gallery_dvc_cnt
  ,sum(enter_edit_dvc_cnt) AS enter_edit_dvc_cnt
  ,sum(exp_succ_dvc_cnt) AS exp_succ_dvc_cnt
  ,sum(income) AS income
  ,sum(fst_income) AS fst_income
  ,sum(renew_income) AS renew_income
  ,sum(new_dvc_pay_dvc_cnt_7d) AS new_dvc_pay_dvc_cnt_7d
  ,sum(exp_bgm_dvc_cnt) AS exp_bgm_dvc_cnt
  ,sum(exp_theme_dvc_cnt) AS exp_theme_dvc_cnt
  ,sum(exp_cf_dvc_cnt) AS exp_cf_dvc_cnt
  ,sum(exp_ef_dvc_cnt) AS exp_ef_dvc_cnt
  ,sum(exp_t_dvc_cnt) AS exp_t_dvc_cnt
  ,sum(exp_stick_dvc_cnt) AS exp_stick_dvc_cnt
  ,sum(exp_trans_dvc_cnt) AS exp_trans_dvc_cnt
  ,sum(atr_puid_cnt) AS atr_puid_cnt
  ,sum(start_exp_cnt) AS start_exp_cnt
  ,sum(exp_cancel_cnt) AS exp_cancel_cnt
  ,sum(exp_fail_cnt) AS exp_fail_cnt
  ,sum(exp_normal_cnt) AS exp_normal_cnt
  ,sum(exp_hd_cnt) AS exp_hd_cnt
  ,sum(click_save_dvc_cnt) AS click_save_dvc_cnt
  ,sum(exp_normal_vdo_size) AS exp_normal_vdo_size
  ,sum(exp_hd_vdo_size) AS exp_hd_vdo_size
  ,sum(exp_normal_vdo_time) AS exp_normal_vdo_time
  ,sum(exp_hd_vdo_time) AS exp_hd_vdo_time
  ,sum(exp_succ_cnt) as exp_succ_cnt
  ,sum(use_material_dvc_cnt) AS use_material_dvc_cnt
  ,sum(fx_dvc_cnt) as fx_dvc_cnt
  FROM    rpt_viva_log_index_minit_nd
  WHERE   ds>='#startDate#' and ds <='#endDate#' #where#
  and  country in ('阿尔及利亚','巴林','埃及','约旦','科威特','黎巴嫩','利比亚','摩洛哥','阿曼','卡塔尔','沙特阿拉伯','突尼斯','阿联酋','阿拉伯联合酋长国','巴勒斯坦','也门','伊拉克','叙利亚')
  group by ds
  UNION ALL
  SELECT  #type#
  ,ds
  ,sum(dau) AS dau
  ,sum(new_dvc_cnt) AS new_dvc_cnt
  ,sum(put_new_dvc_cnt) AS put_new_dvc_cnt
  ,sum(organic_new_dvc_cnt) AS organic_new_dvc_cnt
  ,sum(put_dvc_stay_cnt) AS put_dvc_stay_cnt
  ,sum(organic_dvc_stay_cnt) AS organic_dvc_stay_cnt
  ,sum(enter_home_dvc_cnt) AS enter_home_dvc_cnt
  ,sum(enter_gallery_dvc_cnt) AS enter_gallery_dvc_cnt
  ,sum(enter_edit_dvc_cnt) AS enter_edit_dvc_cnt
  ,sum(exp_succ_dvc_cnt) AS exp_succ_dvc_cnt
  ,sum(income) AS income
  ,sum(fst_income) AS fst_income
  ,sum(renew_income) AS renew_income
  ,sum(new_dvc_pay_dvc_cnt_7d) AS new_dvc_pay_dvc_cnt_7d
  ,sum(exp_bgm_dvc_cnt) AS exp_bgm_dvc_cnt
  ,sum(exp_theme_dvc_cnt) AS exp_theme_dvc_cnt
  ,sum(exp_cf_dvc_cnt) AS exp_cf_dvc_cnt
  ,sum(exp_ef_dvc_cnt) AS exp_ef_dvc_cnt
  ,sum(exp_t_dvc_cnt) AS exp_t_dvc_cnt
  ,sum(exp_stick_dvc_cnt) AS exp_stick_dvc_cnt
  ,sum(exp_trans_dvc_cnt) AS exp_trans_dvc_cnt
  ,sum(atr_puid_cnt) AS atr_puid_cnt
  ,sum(start_exp_cnt) AS start_exp_cnt
  ,sum(exp_cancel_cnt) AS exp_cancel_cnt
  ,sum(exp_fail_cnt) AS exp_fail_cnt
  ,sum(exp_normal_cnt) AS exp_normal_cnt
  ,sum(exp_hd_cnt) AS exp_hd_cnt
  ,sum(click_save_dvc_cnt) AS click_save_dvc_cnt
  ,sum(exp_normal_vdo_size) AS exp_normal_vdo_size
  ,sum(exp_hd_vdo_size) AS exp_hd_vdo_size
  ,sum(exp_normal_vdo_time) AS exp_normal_vdo_time
  ,sum(exp_hd_vdo_time) AS exp_hd_vdo_time
  ,sum(use_material_dvc_cnt) AS use_material_dvc_cnt
  ,sum(exp_succ_cnt) as exp_succ_cnt
  ,sum(fx_dvc_cnt) as fx_dvc_cnt
  FROM    rpt_viva_log_index_minit_nd
  WHERE   ds>='#startDate#' and ds <='#endDate#' #where# #country# #otherWhere#
  GROUP BY #type#,ds
) where #type# = '#title#'
order by ds,#order# desc
`;

export const ALLDaySQL = `
/*+engine=mpp*/
select * from (
  select '全球' as #type#
  ,ds
  ,sum(dau) AS dau
  ,sum(new_dvc_cnt) AS new_dvc_cnt
  ,sum(put_new_dvc_cnt) AS put_new_dvc_cnt
  ,sum(organic_new_dvc_cnt) AS organic_new_dvc_cnt
  ,sum(put_dvc_stay_cnt) AS put_dvc_stay_cnt
  ,sum(organic_dvc_stay_cnt) AS organic_dvc_stay_cnt
  ,sum(enter_home_dvc_cnt) AS enter_home_dvc_cnt
  ,sum(enter_gallery_dvc_cnt) AS enter_gallery_dvc_cnt
  ,sum(enter_edit_dvc_cnt) AS enter_edit_dvc_cnt
  ,sum(exp_succ_dvc_cnt) AS exp_succ_dvc_cnt
  ,sum(income) AS income
  ,sum(fst_income) AS fst_income
  ,sum(renew_income) AS renew_income
  ,sum(new_dvc_pay_dvc_cnt_7d) AS new_dvc_pay_dvc_cnt_7d
  ,sum(exp_bgm_dvc_cnt) AS exp_bgm_dvc_cnt
  ,sum(exp_theme_dvc_cnt) AS exp_theme_dvc_cnt
  ,sum(exp_cf_dvc_cnt) AS exp_cf_dvc_cnt
  ,sum(exp_ef_dvc_cnt) AS exp_ef_dvc_cnt
  ,sum(exp_t_dvc_cnt) AS exp_t_dvc_cnt
  ,sum(exp_stick_dvc_cnt) AS exp_stick_dvc_cnt
  ,sum(exp_trans_dvc_cnt) AS exp_trans_dvc_cnt
  ,sum(atr_puid_cnt) AS atr_puid_cnt
  ,sum(start_exp_cnt) AS start_exp_cnt
  ,sum(exp_cancel_cnt) AS exp_cancel_cnt
  ,sum(exp_fail_cnt) AS exp_fail_cnt
  ,sum(exp_normal_cnt) AS exp_normal_cnt
  ,sum(exp_hd_cnt) AS exp_hd_cnt
  ,sum(click_save_dvc_cnt) AS click_save_dvc_cnt
  ,sum(exp_normal_vdo_size) AS exp_normal_vdo_size
  ,sum(exp_hd_vdo_size) AS exp_hd_vdo_size
  ,sum(exp_normal_vdo_time) AS exp_normal_vdo_time
  ,sum(exp_hd_vdo_time) AS exp_hd_vdo_time
  ,sum(exp_succ_cnt) as exp_succ_cnt
  ,sum(use_material_dvc_cnt) AS use_material_dvc_cnt
  ,sum(fx_dvc_cnt) as fx_dvc_cnt
  FROM    rpt_viva_log_index_minit_nd
  WHERE   ds>='#startDate#' and ds <='#endDate#' #where#
  group by ds
  )
  order by ds
  `;

export const ZDDaySQL = `
  /*+engine=mpp*/
  select * from (
  select '中东' as #type#
  ,ds
  ,sum(dau) AS dau
  ,sum(new_dvc_cnt) AS new_dvc_cnt
  ,sum(put_new_dvc_cnt) AS put_new_dvc_cnt
  ,sum(organic_new_dvc_cnt) AS organic_new_dvc_cnt
  ,sum(put_dvc_stay_cnt) AS put_dvc_stay_cnt
  ,sum(organic_dvc_stay_cnt) AS organic_dvc_stay_cnt
  ,sum(enter_home_dvc_cnt) AS enter_home_dvc_cnt
  ,sum(enter_gallery_dvc_cnt) AS enter_gallery_dvc_cnt
  ,sum(enter_edit_dvc_cnt) AS enter_edit_dvc_cnt
  ,sum(exp_succ_dvc_cnt) AS exp_succ_dvc_cnt
  ,sum(income) AS income
  ,sum(fst_income) AS fst_income
  ,sum(renew_income) AS renew_income
  ,sum(new_dvc_pay_dvc_cnt_7d) AS new_dvc_pay_dvc_cnt_7d
  ,sum(exp_bgm_dvc_cnt) AS exp_bgm_dvc_cnt
  ,sum(exp_theme_dvc_cnt) AS exp_theme_dvc_cnt
  ,sum(exp_cf_dvc_cnt) AS exp_cf_dvc_cnt
  ,sum(exp_ef_dvc_cnt) AS exp_ef_dvc_cnt
  ,sum(exp_t_dvc_cnt) AS exp_t_dvc_cnt
  ,sum(exp_stick_dvc_cnt) AS exp_stick_dvc_cnt
  ,sum(exp_trans_dvc_cnt) AS exp_trans_dvc_cnt
  ,sum(atr_puid_cnt) AS atr_puid_cnt
  ,sum(start_exp_cnt) AS start_exp_cnt
  ,sum(exp_cancel_cnt) AS exp_cancel_cnt
  ,sum(exp_fail_cnt) AS exp_fail_cnt
  ,sum(exp_normal_cnt) AS exp_normal_cnt
  ,sum(exp_hd_cnt) AS exp_hd_cnt
  ,sum(click_save_dvc_cnt) AS click_save_dvc_cnt
  ,sum(exp_normal_vdo_size) AS exp_normal_vdo_size
  ,sum(exp_hd_vdo_size) AS exp_hd_vdo_size
  ,sum(exp_normal_vdo_time) AS exp_normal_vdo_time
  ,sum(exp_hd_vdo_time) AS exp_hd_vdo_time
  ,sum(exp_succ_cnt) as exp_succ_cnt
  ,sum(use_material_dvc_cnt) AS use_material_dvc_cnt
  ,sum(fx_dvc_cnt) as fx_dvc_cnt
  FROM    rpt_viva_log_index_minit_nd
  WHERE   ds>='#startDate#' and ds <='#endDate#' #where#
  and  country in ('阿尔及利亚','巴林','埃及','约旦','科威特','黎巴嫩','利比亚','摩洛哥','阿曼','卡塔尔','沙特阿拉伯','突尼斯','阿联酋','阿拉伯联合酋长国','巴勒斯坦','也门','伊拉克','叙利亚')
  group by ds
  )
  order by ds`;

export const otherSQL = `
  select * from (
    SELECT  #type#
    ,ds
    ,sum(dau) AS dau
    ,sum(new_dvc_cnt) AS new_dvc_cnt
    ,sum(put_new_dvc_cnt) AS put_new_dvc_cnt
    ,sum(organic_new_dvc_cnt) AS organic_new_dvc_cnt
    ,sum(put_dvc_stay_cnt) AS put_dvc_stay_cnt
    ,sum(organic_dvc_stay_cnt) AS organic_dvc_stay_cnt
    ,sum(enter_home_dvc_cnt) AS enter_home_dvc_cnt
    ,sum(enter_gallery_dvc_cnt) AS enter_gallery_dvc_cnt
    ,sum(enter_edit_dvc_cnt) AS enter_edit_dvc_cnt
    ,sum(exp_succ_dvc_cnt) AS exp_succ_dvc_cnt
    ,sum(income) AS income
    ,sum(fst_income) AS fst_income
    ,sum(renew_income) AS renew_income
    ,sum(new_dvc_pay_dvc_cnt_7d) AS new_dvc_pay_dvc_cnt_7d
    ,sum(exp_bgm_dvc_cnt) AS exp_bgm_dvc_cnt
    ,sum(exp_theme_dvc_cnt) AS exp_theme_dvc_cnt
    ,sum(exp_cf_dvc_cnt) AS exp_cf_dvc_cnt
    ,sum(exp_ef_dvc_cnt) AS exp_ef_dvc_cnt
    ,sum(exp_t_dvc_cnt) AS exp_t_dvc_cnt
    ,sum(exp_stick_dvc_cnt) AS exp_stick_dvc_cnt
    ,sum(exp_trans_dvc_cnt) AS exp_trans_dvc_cnt
    ,sum(atr_puid_cnt) AS atr_puid_cnt
    ,sum(start_exp_cnt) AS start_exp_cnt
    ,sum(exp_cancel_cnt) AS exp_cancel_cnt
    ,sum(exp_fail_cnt) AS exp_fail_cnt
    ,sum(exp_normal_cnt) AS exp_normal_cnt
    ,sum(exp_hd_cnt) AS exp_hd_cnt
    ,sum(click_save_dvc_cnt) AS click_save_dvc_cnt
    ,sum(exp_normal_vdo_size) AS exp_normal_vdo_size
    ,sum(exp_hd_vdo_size) AS exp_hd_vdo_size
    ,sum(exp_normal_vdo_time) AS exp_normal_vdo_time
    ,sum(exp_hd_vdo_time) AS exp_hd_vdo_time
    ,sum(use_material_dvc_cnt) AS use_material_dvc_cnt
    ,sum(exp_succ_cnt) as exp_succ_cnt
    ,sum(fx_dvc_cnt) as fx_dvc_cnt
    FROM    rpt_viva_log_index_minit_nd
    WHERE   ds>='#startDate#' and ds <='#endDate#' #where# #country# #otherWhere#
    GROUP BY #type#,ds
  )
  order by ds
  `;
