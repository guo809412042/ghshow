/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-19 16:37:40
 * @LastEditTime: 2020-06-23 12:11:10
 * @LastEditors: ssssslf
 */
export const countrySQL = `
select DISTINCT(country) from tempo_sp_usr_buy_statis_1d
where country is not null and platform = '#platform#' `;

export const appVersionSQL = `
select DISTINCT(app_version) from tempo_sp_usr_buy_statis_1d
where app_version is not null and platform = '#platform#'`;

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
                        WHERE  ds >= '#startDate#' and ds <= '#endDate#'  and product_id= 16 #where#
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
                                WHERE  ds >= '#startDate#' and ds <= '#endDate#' and product_id= 16 #where#
                                
                                GROUP BY ds
                            ) b
            ON      a.ds = b.ds
        ) t
ORDER BY ds DESC
;
`;


export const loudouSQL = `
/*+engine=mpp*/
SELECT COUNT(DISTINCT IF(app_start_cnt_1d> 0, duid, NULL)) AS enter_home_dvc_cnt,
       COUNT(DISTINCT IF(view_cnt_1d> 0, duid, NULL)) AS enter_buy_home_dvc_cnt,  
        COUNT(DISTINCT IF(click_cnt_1d> 0, duid, NULL)) AS click_buy_dvc_cnt,  
       COUNT(DISTINCT IF(buy_cnt_1d> 0, duid, NULL)) AS buy_dvc_cnt
  FROM tempo_sp_usr_buy_statis_1d
 WHERE ds>= '#startDate#'
   and ds<= '#endDate#'
   #where#
   and product_id= 16
;
`;

export const detailSQL = `
/*+engine=mpp*/
SELECT COUNT(DISTINCT IF(app_start_cnt_1d> 0, duid, NULL)) AS enter_home_dvc_cnt,
       COUNT(DISTINCT IF(view_cnt_1d> 0, duid, NULL)) AS enter_buy_home_dvc_cnt,  
        COUNT(DISTINCT IF(click_cnt_1d> 0, duid, NULL)) AS click_buy_dvc_cnt,  
       COUNT(DISTINCT IF(buy_cnt_1d> 0, duid, NULL)) AS buy_dvc_cnt,
       ds
  FROM tempo_sp_usr_buy_statis_1d
  WHERE ds>= '#startDate#'
  and ds<= '#endDate#'
  #where#
  and product_id= 16
 GROUP BY ds
`;
