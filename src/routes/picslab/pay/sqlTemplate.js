/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-10 11:42:21
 * @LastEditTime: 2020-06-12 17:52:39
 * @LastEditors: ssssslf
 */
export const listSQL = `
/*+engine=mpp*/
SELECT  ds
        ,app_start_dvc_cnt
        ,ent_sub_dvc_cnt
        ,click_dvc_cnt
        ,buy_dvc_cnt
FROM    (
            SELECT  app_start_dvc_cnt
                   ,ent_sub_dvc_cnt
                    ,click_dvc_cnt
                  
                    ,buy_dvc_cnt
                    ,a.ds
            FROM    (
                        SELECT  COUNT(DISTINCT IF(app_start_cnt>0,duid,NULL)) AS app_start_dvc_cnt
                                ,ds
                        FROM    rpt_picslab_buy_dvc_cnt_1d
                        WHERE   ds >= '#startDate#'
                        AND     ds <= '#endDate#'
                        #where#
                        GROUP BY ds
                    ) a
            LEFT OUTER JOIN (
                                SELECT  COUNT(DISTINCT IF(enter_sub_cnt>0,duid,NULL)) AS ent_sub_dvc_cnt
                                        ,COUNT(DISTINCT IF(click_cnt>0,duid,NULL)) AS click_dvc_cnt
                                        ,COUNT(DISTINCT IF(buy_cnt>0,duid,NULL)) AS buy_dvc_cnt
                                        ,ds
                                FROM    rpt_picslab_buy_dvc_cnt_1d
                                WHERE   ds >= '#startDate#'
                                AND     ds <= '#endDate#'
                                #where#
                                GROUP BY ds
                            ) b
            ON      a.ds = b.ds
        ) t
ORDER BY ds DESC
;




`;

export const countrySQL = `
select DISTINCT(country) from rpt_picslab_buy_cnt_1d 
`;
export const uitypeSQL = `
select DISTINCT(uitype) from rpt_picslab_buy_cnt_1d 
where uitype is not null
`;
export const sourceSQL = `
select DISTINCT(source) from rpt_picslab_buy_cnt_1d 
where source is not null
`;

export const appVersionSQL = `
select app_version,appkey
 from rpt_picslab_buy_cnt_1d
 where platform = '#platform#'
 and appkey is not null
 group by app_version,appkey
 order by appKey desc
 `;
