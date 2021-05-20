export const tagVideoEveryDaySql = `
/*self_plus engine=MPP*/
select  tag_id
      ,tag_name
      ,tag_puid_all_total
      ,puid_all_total
      ,tag_puid_total
      ,puid_total
      ,exposure_puid_total
      ,exposure_count
      ,play_count
      ,download_count
      ,like_count
      ,forward_count
      ,pop_cnt
      ,pass_cnt
      ,exposure_uv
      ,play_3s_uv
      ,crawler_v_cnt
      ,crawler_exposure_count
      ,round(play_count*100/exposure_count,2) as ptr
      ,round(download_count*100/exposure_count,2) as dtr
      ,round(like_count*100/exposure_count,2) as ltr
      ,round(forward_count*100/exposure_count,2) as ftr
      ,day
from    (
          select  tag_id
                  ,tag_name
                  ,sum(tag_puid_all_total) as tag_puid_all_total
                  ,sum(puid_all_total) as puid_all_total
                  ,sum(tag_puid_total) as tag_puid_total
                  ,sum(puid_total) as puid_total
                  ,sum(exposure_puid_total) as exposure_puid_total
                  ,sum(exposure_count) as exposure_count
                  ,sum(play_count) as play_count
                  ,sum(download_count) as download_count
                  ,sum(like_count) as like_count
                  ,sum(forward_count) as forward_count
                  ,sum(pop_cnt) as pop_cnt
                  ,sum(pass_cnt) as pass_cnt
                  ,sum(exposure_uv) as exposure_uv
                  ,sum(play_3s_uv) as play_3s_uv
                  ,sum(crawler_v_cnt) as crawler_v_cnt
                  ,sum(crawler_exposure_count) as crawler_exposure_count
        ,day
          from    vivashow_tag_performance_result
         where   day >= #startDate#
          and     day <= #endDate#
          #type#
          and     (type = 'parent' )
          and     language = 'all'
          group by tag_id
                   ,tag_name,day
      ) t
order by day desc,#order# desc
limit   10000
;
`;

export const tagChildSQL = `
/*self_plus engine=MPP*/
select  tag_id
        ,tag_name
        ,tag_puid_all_total
        ,puid_all_total
        ,tag_puid_total
        ,puid_total
        ,exposure_puid_total
        ,exposure_count
        ,play_count
        ,download_count
        ,like_count
        ,forward_count
        ,pop_cnt
        ,pass_cnt
        ,exposure_uv
        ,play_3s_uv
        ,crawler_v_cnt
        ,crawler_exposure_count
        ,round(play_count*100/exposure_count,2) as ptr
        ,round(download_count*100/exposure_count,2) as dtr
        ,round(like_count*100/exposure_count,2) as ltr
        ,round(forward_count*100/exposure_count,2) as ftr
        ,day
from    (
            select  tag_id
                    ,tag_name
                    ,sum(tag_puid_all_total) as tag_puid_all_total
                    ,sum(puid_all_total) as puid_all_total
                    ,sum(tag_puid_total) as tag_puid_total
                    ,sum(puid_total) as puid_total
                    ,sum(exposure_puid_total) as exposure_puid_total
                    ,sum(exposure_count) as exposure_count
                    ,sum(play_count) as play_count
                    ,sum(download_count) as download_count
                    ,sum(like_count) as like_count
                    ,sum(forward_count) as forward_count
                    ,sum(pop_cnt) as pop_cnt
                    ,sum(pass_cnt) as pass_cnt
                    ,sum(exposure_uv) as exposure_uv
                    ,sum(play_3s_uv) as play_3s_uv
                    ,sum(crawler_v_cnt) as crawler_v_cnt
                    ,sum(crawler_exposure_count) as crawler_exposure_count,day
            from    vivashow_tag_performance_result
           where   day >= #startDate#
            and     day <= #endDate#
            and     type = 'child'
            and     parent_id = #type#
            and     language = 'all'
            group by tag_id
                     ,tag_name,day
        ) t
order by day desc ,#order# desc
limit   10000
;
`;


export const tagNamesSQL = `
SELECT DISTINCT(tag_name) FROM vivashow_tag_performance_result
 where tag_name is not null
and   type = 'parent' 
and   language = 'all'
order by tag_name
`;
