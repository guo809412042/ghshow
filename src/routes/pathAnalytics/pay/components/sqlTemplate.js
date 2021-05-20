/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-10 11:16:15
 * @LastEditTime: 2020-09-29 17:46:39
 * @LastEditors: ssssslf
 */
export const paySQL = `
SELECT  sum(home_entry_cnt_1d) as  home_entry_cnt_1d
        ,sum(pay_entry_cnt_1d) as pay_entry_cnt_1d
        ,sum(pay_clk_cnt_1d) as  pay_clk_cnt_1d
        ,sum(pay_year_cnt_1d) as pay_year_cnt_1d
        ,sum(pay_month_cnt_1d) as pay_month_cnt_1d
from ads_sp_log_path_usr_cnt_1d
where ds >= '#startDate#' and ds <= '#endDate#' #where#
and path_type = 3
;
`;


export const payDetailSQL = `
SELECT  sum(home_entry_cnt_1d) as  home_entry_cnt_1d
        ,sum(pay_entry_cnt_1d) as pay_entry_cnt_1d
        ,sum(pay_clk_cnt_1d) as  pay_clk_cnt_1d
        ,sum(pay_year_cnt_1d) as pay_year_cnt_1d
        ,sum(pay_month_cnt_1d) as pay_month_cnt_1d
        ,ds
from ads_sp_log_path_usr_cnt_1d
where ds >= '#startDate#' and ds <= '#endDate#' #where#  and path_type = 3
group by ds
order by ds desc

;
`;

export const payTempoSQL = `
SELECT  sum(b_enter_home_dvc_cnt) AS enter_home_dvc_cnt
        ,sum(enter_buy_page_dvc_cnt_1d) AS enter_buy_home_dvc_cnt
        ,sum(buy_click_dvc_cnt_1d) AS click_buy_dvc_cnt
        ,sum(buy_succ_dvc_cnt_1d) AS buy_dvc_cnt
FROM    tempo_log_material_path_usr_cnt_1d
where ds >= '#startDate#' and ds <= '#endDate#' #where#
AND     b_enter_home_dvc_cnt > 0   
`;
export const payGocutSQL = `
SELECT  sum(b_enter_home_dvc_cnt) AS enter_home_dvc_cnt
        ,sum(enter_buy_page_dvc_cnt_1d) AS enter_buy_home_dvc_cnt
        ,sum(buy_click_dvc_cnt_1d) AS click_buy_dvc_cnt
        ,sum(buy_succ_dvc_cnt_1d) AS buy_dvc_cnt
FROM    pub_log_material_path_usr_cnt_1d
where ds >= '#startDate#' and ds <= '#endDate#' #where# and product_id =43
AND     b_enter_home_dvc_cnt > 0   
`;

// 路径表
// export const payVivacutSQL = `
// SELECT  sum(app_start_cnt_1d) as app_start_dvc_cnt
//         ,sum(view_cnt_1d) AS enter_buy_home_dvc_cnt
//         ,sum(click_cnt_1d) AS click_buy_dvc_cnt
//         ,sum(buy_cnt_1d) AS buy_dvc_cnt
// FROM    tempo_sp_usr_buy_statis_1d
// where ds >= '#startDate#' and ds <= '#endDate#' #where#

// `;

export const payVivacutSQL = `
/*+engine=mpp*/
SELECT  
        view_cnt AS enter_buy_home_dvc_cnt
        ,app_start_cnt as app_start_dvc_cnt
        ,click_cnt AS click_buy_dvc_cnt
        ,buy_cnt AS buy_dvc_cnt
FROM    (
            SELECT  app_start_cnt
                    ,view_cnt
                    ,click_cnt
                    ,buy_month_cnt
                    ,buy_year_cnt
                    ,buy_week_cnt
                    ,buy_cnt
                    
            FROM    (
                        SELECT  
                        COUNT(DISTINCT IF(app_start_cnt_1d>0,duid,NULL)) AS app_start_cnt
                               
                        FROM    tempo_sp_usr_buy_statis_1d
                        WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where#  and product_id= #product#
                    ) a
            LEFT OUTER JOIN (
                                SELECT  COUNT(DISTINCT IF(click_cnt_1d>0,duid,NULL)) AS click_cnt
                                ,COUNT(DISTINCT IF(enter_cnt_1d>0,duid,NULL)) AS view_cnt
                                        ,COUNT(DISTINCT IF(buy_month_cnt_1d>0,duid,NULL)) AS buy_month_cnt
                                        ,COUNT(DISTINCT IF(buy_week_cnt_1d>0,duid,NULL)) AS buy_week_cnt
                                        ,COUNT(DISTINCT IF(buy_year_cnt_1d>0,duid,NULL)) AS buy_year_cnt
                                        ,COUNT(DISTINCT IF(buy_cnt_1d>0,duid,NULL )) AS buy_cnt
                                       
                                FROM    tempo_sp_usr_buy_statis_1d
                                WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where#  and product_id= #product# #sub_type#
                            ) b
            ON      1=1
        ) t
`;


export const payDetailTempoSQL = `
SELECT  ds
,sum(b_enter_home_dvc_cnt) AS enter_home_dvc_cnt
,sum(enter_buy_page_dvc_cnt_1d) AS enter_buy_home_dvc_cnt
,sum(buy_click_dvc_cnt_1d) AS click_buy_dvc_cnt
,sum(buy_succ_dvc_cnt_1d) AS buy_dvc_cnt
FROM    tempo_log_material_path_usr_cnt_1d
WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where#
AND     b_enter_home_dvc_cnt > 0   
GROUP BY ds
order by ds desc
;`;

export const payDetailGocutSQL = `
SELECT  ds
,sum(b_enter_home_dvc_cnt) AS enter_home_dvc_cnt
,sum(enter_buy_page_dvc_cnt_1d) AS enter_buy_home_dvc_cnt
,sum(buy_click_dvc_cnt_1d) AS click_buy_dvc_cnt
,sum(buy_succ_dvc_cnt_1d) AS buy_dvc_cnt
FROM    pub_log_material_path_usr_cnt_1d
WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where#
AND     b_enter_home_dvc_cnt > 0    and product_id = 43
GROUP BY ds
order by ds desc
;`;

export const payDetailVivacutSQL = `
SELECT  ds
        ,sum(app_start_dvc_cnt) as app_start_dvc_cnt
        ,sum(b_enter_home_dvc_cnt) AS enter_home_dvc_cnt
        ,sum(enter_buy_page_dvc_cnt_1d) AS enter_buy_home_dvc_cnt
        ,sum(buy_click_dvc_cnt_1d) AS click_buy_dvc_cnt
        ,sum(buy_succ_dvc_cnt_1d) AS buy_dvc_cnt
FROM    vivacut_log_material_path_usr_cnt_1d_ow
WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where#  
GROUP BY ds
order by ds desc
;`;


export const listSQL = `
/*+engine=mpp*/
SELECT  ds
        ,view_cnt
        ,app_start_cnt
        ,click_cnt
        ,buy_month_cnt
        ,buy_year_cnt
        ,buy_week_cnt
        ,buy_cnt
        ,IF(buy_cnt <> 0 and view_cnt <> 0, round(buy_cnt*100/view_cnt,2), 0) as view_cnt_buy_cnt
        ,IF(view_cnt <> 0 and app_start_cnt <> 0, round(view_cnt*100/app_start_cnt,2), 0) as app_start_cnt_view_cnt
        ,IF(click_cnt <> 0 and view_cnt <> 0, round(click_cnt*100/view_cnt,2), 0) as view_cnt_click_cnt
        ,IF(buy_cnt <> 0 and click_cnt <> 0, round(buy_cnt*100/click_cnt,2), 0) as click_cnt_buy_cnt
FROM    (
            SELECT  app_start_cnt
                    ,view_cnt
                    ,click_cnt
                    ,buy_month_cnt
                    ,buy_year_cnt
                    ,buy_week_cnt
                    ,buy_cnt
                    ,a.ds
            FROM    (
                        SELECT  COUNT(DISTINCT IF(app_start_cnt_1d>0,duid,NULL)) AS app_start_cnt
                                ,ds
                        FROM    tempo_sp_usr_buy_statis_1d
                        WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where# and product_id= #product#
                        GROUP BY ds
                    ) a
            LEFT OUTER JOIN (
                                SELECT  COUNT(DISTINCT IF(view_cnt_1d>0,duid,NULL)) AS view_cnt
                                        ,COUNT(DISTINCT IF(click_cnt_1d>0,duid,NULL)) AS click_cnt
                                        ,COUNT(DISTINCT IF(buy_month_cnt_1d>0,duid,NULL)) AS buy_month_cnt
                                        ,COUNT(DISTINCT IF(buy_week_cnt_1d>0,duid,NULL)) AS buy_week_cnt
                                        ,COUNT(DISTINCT IF(buy_year_cnt_1d>0,duid,NULL)) AS buy_year_cnt
                                        ,COUNT(DISTINCT IF(buy_cnt_1d>0,duid,NULL )) AS buy_cnt
                                        ,ds
                                FROM    tempo_sp_usr_buy_statis_1d
                                WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where# and product_id= #product#
                                #sub_type#
                                GROUP BY ds
                            ) b
            ON      a.ds = b.ds
        ) t
ORDER BY ds DESC
`;

export const listVivacutSQL = `
/*+engine=mpp*/
SELECT  ds
        ,view_cnt
        ,app_start_cnt
        ,click_cnt
        ,buy_month_cnt
        ,buy_year_cnt
        ,buy_week_cnt
        ,buy_cnt
        ,round(view_cnt*100/app_start_cnt,2) AS app_start_cnt_view_cnt
        ,round(click_cnt*100/view_cnt,2) AS view_cnt_click_cnt
        ,round(buy_cnt*100/click_cnt,2) AS click_cnt_buy_cnt
        ,round(buy_cnt*100/view_cnt,2) AS view_cnt_buy_cnt
FROM    (
            SELECT  app_start_cnt
                    ,view_cnt
                    ,click_cnt
                    ,buy_month_cnt
                    ,buy_year_cnt
                    ,buy_week_cnt
                    ,buy_cnt
                    ,a.ds
            FROM    (
                        SELECT  COUNT(DISTINCT IF(app_start_cnt_1d>0,duid,NULL)) AS app_start_cnt
                                ,ds
                        FROM    tempo_sp_usr_buy_statis_1d
                        WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where# and product_id= #product#
                        GROUP BY ds
                    ) a
            LEFT OUTER JOIN (
                                SELECT  COUNT(DISTINCT IF(click_cnt_1d>0,duid,NULL)) AS click_cnt
                                        ,COUNT(DISTINCT IF(enter_cnt_1d>0,duid,NULL)) AS view_cnt
                                        ,COUNT(DISTINCT IF(buy_month_cnt_1d>0,duid,NULL)) AS buy_month_cnt
                                        ,COUNT(DISTINCT IF(buy_week_cnt_1d>0,duid,NULL)) AS buy_week_cnt
                                        ,COUNT(DISTINCT IF(buy_year_cnt_1d>0,duid,NULL)) AS buy_year_cnt
                                        ,COUNT(DISTINCT IF(buy_cnt_1d>0,duid,NULL )) AS buy_cnt
                                        ,ds
                                FROM    tempo_sp_usr_buy_statis_1d
                                WHERE  ds >= '#startDate#' and ds <= '#endDate#' #where# and product_id= #product#
                                #sub_type#
                                GROUP BY ds
                            ) b
            ON      a.ds = b.ds
        ) t
ORDER BY ds DESC
`;

export const subTypeSQL = `
select distinct(sub_type)  from tempo_sp_usr_buy_statis_1d
 where product_id= #product# 
 and platform = #platform#
 and sub_type is not null `;
