export const listSQL = `
SELECT parent_id
,parent_name
,SUM(puid_total) AS puid_total
,SUM(playin_total) AS playin_total
,SUM(duid_total) AS duid_total
,SUM(like_count) AS like_count
,SUM(forward_count) AS forward_count
,SUM(comment_count) AS comment_count
,SUM(playin_all) AS playin_all
,SUM(play_count_all) AS play_count_all
,SUM(play_out) AS play_out
,SUM(puid_total_all) AS puid_total_all
,SUM(play_exposure) AS play_exposure
,SUM(exposure_total) AS exposure_total
,SUM(video_download_count) AS video_download_count
FROM rpt_viva_log_tag1_cnt_1d
where ds >= #startDate#
AND ds <= #endDate#
AND group_id = 1
GROUP BY parent_id,parent_name
ORDER BY #order# DESC
LIMIT 1000
`;

export const childrenListSQL = `
SELECT child_id,
       child_name,parent_id
       ,SUM(puid_total) AS puid_total
        ,SUM(playin_total) AS playin_total
        ,SUM(duid_total) AS duid_total
        ,SUM(like_count) AS like_count
        ,SUM(forward_count) AS forward_count
        ,SUM(comment_count) AS comment_count
        ,SUM(playin_all) AS playin_all
        ,SUM(play_count_all) AS play_count_all
        ,SUM(play_out) AS play_out
        ,SUM(puid_total_all) AS puid_total_all
        ,SUM(play_exposure) AS play_exposure
        ,SUM(exposure_total) AS exposure_total
        ,SUM(video_download_count) AS video_download_count
  FROM rpt_viva_log_tag2_cnt_1d
  where ds >= #startDate#
  AND ds <= #endDate#
   and parent_id= '#type#'
   and group_id = 1
 GROUP BY child_id,
         child_name,parent_id
 ORDER BY play_count_all DESC
 LIMIT 1000 ;
`;

export const detailSQL = `
SELECT  puiddigest,
is_spider,
SUM(play_count) AS play_count,
SUM(play_in) AS play_in,
SUM(play_out) AS play_out,
SUM(like_count) AS like_count,
SUM(forward_count) AS forward_count,
SUM(comment_count) AS comment_count,
SUM(exposure_count) AS exposure_count,
SUM(exposure_uv) AS exposure_uv,
SUM(ply_hot_uv) AS ply_hot_uv,
SUM(video_download_count) AS video_download_count
from rpt_viva_log_tag3_cnt_1d
where ds >= #startDate#
AND ds <= #endDate#
and parent_id = '#parent_id#'
and child_id = '#child_id#'
and group_id = 1
#where#
GROUP BY is_spider,puiddigest
ORDER BY #order# DESC
LIMIT   1000
;
`;
