/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-06-10 10:20:46
 * @LastEditTime: 2020-06-12 11:23:24
 * @LastEditors: ssssslf
 */
export const listSQL = `
SELECT  a.ds
        ,click_dvc_cnt
        ,cover_view_dvc_cnt
        ,make_succ_dvc_cnt
        ,make_dvc_cnt
        ,save_dvc_cnt
        ,share_dvc_cnt
        ,m_edit_view_dvc_cnt
        ,m_edit_make_dvc_cnt
        ,m_view_dvc_cnt
        ,app_start_dvc_cnt
        ,ent_home_dvc_cnt
FROM    (
            SELECT  ds
                    ,sum(click_dvc_cnt) AS click_dvc_cnt
                    ,sum(cover_view_dvc_cnt) AS cover_view_dvc_cnt
                    ,sum(make_succ_dvc_cnt) AS make_succ_dvc_cnt
                    ,sum(make_dvc_cnt) AS make_dvc_cnt
                    ,sum(save_dvc_cnt) AS save_dvc_cnt
                    ,sum(share_dvc_cnt) AS share_dvc_cnt
                    ,sum(m_edit_view_dvc_cnt) AS m_edit_view_dvc_cnt
                    ,sum(m_edit_make_dvc_cnt) AS m_edit_make_dvc_cnt
                    ,sum(m_view_dvc_cnt) AS m_view_dvc_cnt
            FROM    rpt_picslab_material_cnt_1d
            WHERE   ds >= '#startDate#'
            AND     ds <= '#endDate#'
            AND ttid = 'all'
            #where#
            GROUP BY ds
        ) a
LEFT OUTER JOIN (
                    SELECT  ds
                            ,sum(app_start_dvc_cnt) AS app_start_dvc_cnt
                            ,sum(ent_home_dvc_cnt) AS ent_home_dvc_cnt
                    FROM    (
                                SELECT  ds
                                        ,country
                                        ,app_version
                                        ,platform
                                        ,app_start_dvc_cnt
                                        ,ent_home_dvc_cnt
                                        ,new_user
                                        ,appKey
                                FROM    rpt_picslab_material_cnt_1d
                                WHERE   ds >= '#startDate#'
                                AND     ds <= '#endDate#'
                                AND     ttid = 'all'
                                GROUP BY ds
                                         ,country
                                         ,app_version
                                         ,platform
                                         ,app_start_dvc_cnt
                                         ,ent_home_dvc_cnt
                                         ,new_user
                                         ,appKey
                            ) b1
                    WHERE 1=1  #otherWhere#
                    GROUP BY ds
                ) b
ON      a.ds = b.ds
order by a.ds desc
`;

export const countrySQL = `
select DISTINCT(country) from rpt_picslab_material_cnt_1d 
`;

export const appVersionSQL = `
select app_version,appkey
 from rpt_picslab_material_cnt_1d
 where platform = '#platform#'
 and appkey is not null
 group by app_version,appkey
 order by appKey desc
 `;
