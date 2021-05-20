/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-11 15:20:21
 * @LastEditTime: 2020-06-19 14:32:11
 * @LastEditors: ssssslf
 */

export const cardSQL = `
SELECT  a.ds
        ,show_uv    
        ,make_uv    
        ,share_uv   
        ,del_uv   
        ,show_pv   
        ,make_pv   
        ,share_pv   
        ,del_pv       
        ,click_make_uv
FROM    (
            SELECT  ds
                    ,COUNT(DISTINCT auid) AS show_uv
                    ,COUNT(1) AS show_pv
            FROM    dwd_vivamini_sns_usr_track_hi
            WHERE   ds >= #startDate# and ds <= #endDate#
            AND     event_name = 'view'
            AND     ttid IS NOT NULL
            and hh <= #hh#
            #platform#
            GROUP BY ds
        ) a
LEFT OUTER JOIN (
                    SELECT  ds
                            ,COUNT(DISTINCT auid) AS make_uv
                            ,COUNT(1) AS make_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   ds >= #startDate# and ds <= #endDate#
                    AND     event_name = 'make'
                    AND     ttid IS NOT NULL
                    and hh <= #hh#
                    #platform#
                    GROUP BY ds
                ) b
ON      a.ds = b.ds
LEFT OUTER JOIN (
                    SELECT  ds
                            ,COUNT(DISTINCT auid) AS share_uv
                            ,COUNT(1) AS share_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   ds >= #startDate# and ds <= #endDate#
                    AND     event_name = 'share'
                    AND     ttid IS NOT NULL
                    and hh <= #hh#
                    #platform#
                    GROUP BY ds
                ) c
ON      a.ds = c.ds
LEFT OUTER JOIN (
                    SELECT  ds
                            ,COUNT(DISTINCT auid) AS del_uv
                            ,COUNT(1) AS del_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   ds >= #startDate# and ds <= #endDate#
                    AND     event_name = 'delete'
                    AND     ttid IS NOT NULL
                    and hh <= #hh#
                    #platform#
                    GROUP BY ds
                ) d
ON      a.ds = d.ds
LEFT OUTER JOIN (
        SELECT  ds
                ,COUNT(DISTINCT auid) AS click_make_uv
                ,COUNT(1) AS click_make_pv
        FROM    dwd_vivamini_sns_usr_track_hi
        WHERE   ds >= #startDate# and ds <= #endDate#
        AND     event_name = 'make'
        and  make_source in('模板点击制作' ,'模板页制作')
        and hh <= #hh#
        #platform#
        AND     ttid IS NOT NULL
        GROUP BY ds
    ) e
ON      a.ds = e.ds
order by ds desc
`;

export const chartSQL = `
SELECT  a.hh,a.ds
        ,show_uv    
        ,make_uv    
        ,share_uv   
        ,del_uv   
        ,show_pv   
        ,make_pv   
        ,share_pv   
        ,del_pv 
        ,click_make_uv      
FROM    (
            SELECT ds, hh
                    ,COUNT(DISTINCT auid) AS show_uv
                    ,COUNT(1) AS show_pv
            FROM    dwd_vivamini_sns_usr_track_hi
            WHERE   (ds = #startDate# or ds = #yestoday# or ds = #weekday#)
            AND     event_name = 'view'
            AND     ttid IS NOT NULL
            #platform#
            GROUP BY ds,hh
        ) a
LEFT OUTER JOIN (
                    SELECT ds, hh
                            ,COUNT(DISTINCT auid) AS make_uv
                            ,COUNT(1) AS make_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   (ds = #startDate# or ds = #yestoday# or ds = #weekday#)
                    AND     event_name = 'make'
                    AND     ttid IS NOT NULL
                    #platform#
                    GROUP BY ds,hh
                ) b
ON   a.ds = b.ds and   a.hh = b.hh
LEFT OUTER JOIN (
                    SELECT  ds,hh
                            ,COUNT(DISTINCT auid) AS share_uv
                            ,COUNT(1) AS share_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   (ds = #startDate# or ds = #yestoday# or ds = #weekday#)
                    AND     event_name = 'share'
                    AND     ttid IS NOT NULL
                    #platform#
                    GROUP BY ds,hh
                ) c
ON  a.ds = c.ds and a.hh = c.hh 
LEFT OUTER JOIN (
                    SELECT  ds,hh
                            ,COUNT(DISTINCT auid) AS del_uv
                            ,COUNT(1) AS del_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   (ds = #startDate# or ds = #yestoday# or ds = #weekday#)
                    AND     event_name = 'delete'
                    AND     ttid IS NOT NULL
                    #platform#
                    GROUP BY ds,hh
                ) d
ON  a.ds = d.ds and   a.hh = d.hh
LEFT OUTER JOIN (
        SELECT  ds,hh
                ,COUNT(DISTINCT auid) AS click_make_uv
                ,COUNT(1) AS click_make_pv
        FROM    dwd_vivamini_sns_usr_track_hi
        WHERE   ds >= #startDate# and ds <= #endDate#
        AND     event_name = 'make'
        and  make_source in('模板点击制作' ,'模板页制作')
        AND     ttid IS NOT NULL
        #platform#
        GROUP BY ds,hh
    ) e
ON  a.ds = e.ds and  a.hh = e.hh
order by ds ,hh 
`;


export const listSQL = `
SELECT  a.ttid
        ,a.ttname
        ,sum(show_uv) AS show_uv
        ,sum(make_uv) AS make_uv
        ,sum(make_succ_uv) AS make_succ_uv
        ,sum(make_fail_uv) AS make_fail_uv
        ,sum(share_uv) AS share_uv
        ,sum(del_uv) AS del_uv
        ,sum(show_pv ) AS show_pv
        ,sum(make_pv ) AS make_pv
        ,sum(share_pv) AS share_pv
        ,sum(del_pv ) AS del_pv
        ,sum(make_succ_pv ) AS make_succ_pv
        ,sum(make_fail_pv ) AS make_fail_pv
        ,sum(click_make_uv) AS click_make_uv
        ,sum(click_make_pv) AS click_make_pv
FROM    (
            SELECT  ttid
                    ,max(ttname) AS ttname
                    ,COUNT(DISTINCT auid) AS show_uv
                    ,COUNT(1) AS show_pv
            FROM    dwd_vivamini_sns_usr_track_hi
            WHERE   ds >= #startDate#
            AND     ds <= #endDate# #where# #platform#
            AND     event_name = 'view'
            AND     ttid IS NOT NULL
            GROUP BY ttid
        ) a
LEFT OUTER JOIN (
                    SELECT  ttid
                            ,COUNT(DISTINCT auid) AS make_uv
                            ,COUNT(1) AS make_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   ds >= #startDate#
                    AND     ds <= #endDate# #where# #platform#
                    AND     event_name = 'make'
                    AND     ttid IS NOT NULL
                    GROUP BY ttid
                ) b
ON      a.ttid = b.ttid
LEFT OUTER JOIN (
                    SELECT  ttid
                            ,COUNT(DISTINCT auid) AS share_uv
                            ,COUNT(1) AS share_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   ds >= #startDate#
                    AND     ds <= #endDate# #where# #platform#
                    AND     event_name = 'share'
                    AND     ttid IS NOT NULL
                    GROUP BY ttid
                ) c
ON      a.ttid = c.ttid
LEFT OUTER JOIN (
                    SELECT  ttid
                            ,COUNT(DISTINCT auid) AS del_uv
                            ,COUNT(1) AS del_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   ds >= #startDate#
                    AND     ds <= #endDate# #where# #platform#
                    AND     event_name = 'delete'
                    AND     ttid IS NOT NULL
                    GROUP BY ttid
                ) d
ON      a.ttid = d.ttid
LEFT OUTER JOIN (
                    SELECT  ttid
                            ,COUNT(DISTINCT auid) AS make_succ_uv
                            ,COUNT(1) AS make_succ_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   ds >= #startDate#
                    AND     ds <= #endDate# #where# #platform#
                    AND     event_name = 'make'
                    AND     result = 'success'
                    AND     ttid IS NOT NULL
                    GROUP BY ttid
                ) e
ON      a.ttid = e.ttid
LEFT OUTER JOIN (
                    SELECT  ttid
                            ,COUNT(DISTINCT auid) AS make_fail_uv
                            ,COUNT(1) AS make_fail_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   ds >= #startDate#
                    AND     ds <= #endDate# #where# #platform#
                    AND     event_name = 'make'
                    AND     result = 'fail'
                    AND     ttid IS NOT NULL
                    GROUP BY ttid
                ) f
ON      a.ttid = f.ttid
LEFT OUTER JOIN (
                    SELECT  ttid
                            ,COUNT(DISTINCT auid) AS click_make_uv
                            ,COUNT(1) AS click_make_pv
                    FROM    dwd_vivamini_sns_usr_track_hi
                    WHERE   ds >= #startDate#
                    AND     ds <= #endDate# #where# #platform#
                    AND     event_name = 'make'
                    AND     make_source IN ('模板点击制作' ,'模板页制作')
                    AND     ttid IS NOT NULL
                    GROUP BY ttid
                ) g
ON      a.ttid = g.ttid
GROUP BY a.ttid
         ,a.ttname
ORDER BY a.ttid

;`;
