/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-06 18:40:28
 * @LastEditTime: 2020-06-02 10:23:17
 * @LastEditors: ssssslf
 */

export const templateListSQLSP = `
 select ttid
 ,tt_name as ttname
 ,sum (home_template_show_cnt_1d) as home_template_show_total
 ,sum (home_template_preview_cnt_1d) as home_template_preview_total
 ,sum (home_template_create_cnt_1d) as home_template_create_total
 ,sum (cover_click_cnt_1d) as cover_click_cnt_1d
 ,sum (edit_template_apply_cnt_1d) as edit_template_apply_total
 ,sum (exp_clk_cnt_1d) as save_button_click_total
 ,sum (exp_suces_cnt_1d) as share_savetogallery_total
 ,sum (model_share_clk_cnt_1d) as share_button_click_total
from ads_sp_log_path_usr_cnt_1d
where ds >= '#startDate#' and ds <= '#endDate#' #where#  and path_type = 1 
group by ttid,ttname

 `;
export const templateListDetailSQLSP = `
 select ds
 ,sum (home_template_show_cnt_1d) as home_template_show_total
 ,sum (home_template_preview_cnt_1d) as home_template_preview_total
 ,sum (home_template_create_cnt_1d) as home_template_create_total
 ,sum (edit_template_apply_cnt_1d) as edit_template_apply_total
 ,sum (cover_click_cnt_1d) as cover_click_cnt_1d
 ,sum (exp_clk_cnt_1d) as save_button_click_total
 ,sum (exp_suces_cnt_1d) as share_savetogallery_total
 ,sum (model_share_clk_cnt_1d) as share_button_click_total
from ads_sp_log_path_usr_cnt_1d
where ds >= '#startDate#' and ds <= '#endDate#' #where#  and path_type = 1 
group by ds

 `;

export const templateListSQL = `
SELECT a.ttid
        ,a.ttname
        ,Home_Template_Show_total
        ,Home_Template_Preview_total
        ,Home_Template_Create_total
        ,Edit_Template_Apply_total
        ,Save_Button_Click_total
        ,Share_SaveToGallery_total
        ,Share_Button_Click_total
FROM (
    SELECT ttid,MAX(ttname) as ttname,COUNT(DISTINCT duiddigest) as Home_Template_Show_total
from holo_pub_log_user_path_info 
where ds >= '#startDate#' and ds <= '#endDate#' #where# and event_name = 'Home_Template_Show'
and path_type = 1 
GROUP BY ttid
)a LEFT JOIN (
    SELECT ttid,COUNT(DISTINCT duiddigest) as Home_Template_Preview_total
    from holo_pub_log_user_path_info 
    where ds >= '#startDate#' and ds <= '#endDate#' #where# and event_name = 'Home_Template_Preview'
    and path_type = 1 
    GROUP BY ttid
)b on a.ttid = b.ttid
LEFT JOIN (
    SELECT ttid,COUNT(DISTINCT duiddigest) as Home_Template_Create_total
    from holo_pub_log_user_path_info 
    where ds >= '#startDate#' and ds <= '#endDate#' #where# and event_name = 'Home_Template_Create'
    and path_type = 1 
    GROUP BY ttid
)c on a.ttid = c.ttid 
LEFT JOIN (
    SELECT ttid,COUNT(DISTINCT duiddigest) as Edit_Template_Apply_total
    from holo_pub_log_user_path_info 
    where ds >= '#startDate#' and ds <= '#endDate#' #where# and event_name = 'Edit_Template_Apply'
    and path_type = 1 
    GROUP BY ttid
)d on a.ttid = d.ttid
LEFT JOIN (
    SELECT ttid,COUNT(DISTINCT duiddigest) as Save_Button_Click_total
    from holo_pub_log_user_path_info 
    where ds >= '#startDate#' and ds <= '#endDate#' #where# and event_name IN  ('Save_Button_Click','CloudTheme_Make_Success')
    and path_type = 1 
    GROUP BY ttid
)e on a.ttid = e.ttid

LEFT JOIN (
    SELECT ttid,COUNT(DISTINCT duiddigest) as Share_SaveToGallery_total
    from holo_pub_log_user_path_info 
    where ds >= '#startDate#' and ds <= '#endDate#' #where# and event_name IN  ('Share_SaveToGallery','CloudVideo_Download_Success')
    and path_type = 1 
    GROUP BY ttid
)f on a.ttid = f.ttid

LEFT JOIN (
    SELECT ttid,COUNT(DISTINCT duiddigest) as Share_Button_Click_total
    from holo_pub_log_user_path_info 
    where ds >= '#startDate#' and ds <= '#endDate#' #where# and event_name IN  ('Share_Button_Click','CloudVideo_Share')
    and path_type = 1 
    GROUP BY ttid
)g on a.ttid = g.ttid
;
`;


export const detailTemplateChartSQL = `SELECT  a.ds
,Home_Template_Show_total
,Home_Template_Preview_total
,Home_Template_Create_total
,Edit_Template_Apply_total
,Save_Button_Click_total
,Share_SaveToGallery_total
,Share_Button_Click_total
FROM (
SELECT ds,COUNT(DISTINCT duiddigest) as Home_Template_Show_total
from holo_pub_log_user_path_info 
where ds >= '#startDate#' and ds <= '#endDate#'  #where# and ttid = '#type#'  and event_name = 'Home_Template_Show'
and path_type = 1 
GROUP BY ds
)a LEFT JOIN (
SELECT ds,COUNT(DISTINCT duiddigest) as Home_Template_Preview_total
from holo_pub_log_user_path_info 
where ds >= '#startDate#' and ds <= '#endDate#'  #where# and ttid = '#type#'  and event_name = 'Home_Template_Preview'
and path_type = 1 
GROUP BY ds
)b on a.ds = b.ds
LEFT JOIN (
SELECT ds,COUNT(DISTINCT duiddigest) as Home_Template_Create_total
from holo_pub_log_user_path_info 
where ds >= '#startDate#' and ds <= '#endDate#'  #where# and ttid = '#type#'  and event_name = 'Home_Template_Create'
and path_type = 1 
GROUP BY ds
)c on a.ds = c.ds 
LEFT JOIN (
SELECT ds,COUNT(DISTINCT duiddigest) as Edit_Template_Apply_total
from holo_pub_log_user_path_info 
where ds >= '#startDate#' and ds <= '#endDate#'  #where# and ttid = '#type#'  and event_name = 'Edit_Template_Apply'
and path_type = 1 
GROUP BY ds
)d on a.ds = d.ds
LEFT JOIN (
SELECT ds,COUNT(DISTINCT duiddigest) as Save_Button_Click_total
from holo_pub_log_user_path_info
 where ds >= '#startDate#' and ds <= '#endDate#'  #where# and ttid = '#type#'  and event_name IN  ('Save_Button_Click','CloudTheme_Make_Success')
 and path_type = 1 
GROUP BY ds
)e on  a.ds = e.ds

LEFT JOIN (
SELECT ds,COUNT(DISTINCT duiddigest) as Share_SaveToGallery_total
from holo_pub_log_user_path_info 
where ds >= '#startDate#' and ds <= '#endDate#'  #where# and ttid = '#type#'  and event_name IN  ('Share_SaveToGallery','CloudVideo_Download_Success')
and path_type = 1 
GROUP BY ds
)f on a.ds = f.ds

LEFT JOIN (
SELECT ds,COUNT(DISTINCT duiddigest) as Share_Button_Click_total
from holo_pub_log_user_path_info 
where ds >= '#startDate#' and ds <= '#endDate#'  #where# and ttid = '#type#'  and event_name IN  ('Share_Button_Click','CloudVideo_Share')
and path_type = 1 
GROUP BY ds
)g on a.ds = g.ds
order by ds 
;
`;


export const templateTempoSQL = ` 
SELECT  ttid,max(tt_name) as tt_name
        ,sum(view_dvc_cnt_1d) AS c_view_dvc_cnt
        ,sum(click_dvc_cnt_1d) AS c_click_dvc_cnt
        ,sum(detali_view_dvc_cnt_1d) AS d_view_dvc_cnt
        ,sum(use_dvc_cnt_1d) AS use_dvc_cnt
        ,sum(edit_dvc_cnt_1d) AS edit_dvc_cnt
        ,sum(save_dvc_cnt_1d) AS save_dvc_cnt
        ,sum(shr_dvc_cnt_1d) AS share_dvc_cnt
FROM    tempo_log_material_path_usr_cnt_1d
WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where#  
GROUP BY ttid
order by c_view_dvc_cnt desc
;`;

export const templateTempoDetailSQL = ` 
SELECT  ds
,sum(view_dvc_cnt_1d) AS c_view_dvc_cnt
,sum(click_dvc_cnt_1d) AS c_click_dvc_cnt
,sum(detali_view_dvc_cnt_1d) AS d_view_dvc_cnt
,sum(use_dvc_cnt_1d) AS use_dvc_cnt
,sum(edit_dvc_cnt_1d) AS edit_dvc_cnt
,sum(save_dvc_cnt_1d) AS save_dvc_cnt
,sum(shr_dvc_cnt_1d) AS share_dvc_cnt
FROM    tempo_log_material_path_usr_cnt_1d
WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where# 
GROUP BY ds
 order by ds desc
;`;
