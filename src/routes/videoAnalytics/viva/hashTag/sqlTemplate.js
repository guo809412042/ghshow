/*
 * @Author: ssssslf
 * @Date: 2020-01-14 11:14:21
 * @LastEditTime : 2020-01-14 11:38:11
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/videoAnalytics/viva/hashTag/sqlTemplate.js
 */
export const listSQL = `
select sum(play_count) as play_count,
sum(play_in) as play_in,
sum(play_out) as play_out,
sum(like_count) as like_count,
sum(forward_count) as forward_count,
sum(comment_count) as comment_count,
sum(publish_count) as publish_count,
sum(video_download_count) as video_download_count,
tag
from rpt_viva_log_report_hashtag_total_1d
where ds >= #startDate#
and ds <= #endDate# and group_id = 1 
group by tag 
order by #order# desc limit 10000;
`;

export const tagSQL = `
select DISTINCT(tag) from rpt_viva_log_report_hashtag_total_1d
where ds >= #startDate#
and ds <= #endDate# and group_id = 1
`;

export const detailSQL = `
SELECT puiddigest
,auiddigest
,SUM(play_count) AS play_count
,SUM(play_in) AS play_in
,SUM(play_out) AS play_out
,SUM(like_count) AS like_count
,SUM(comment_count) AS comment_count
,SUM(forward_count) AS forward_count
,1 AS publish_count
,ver
,SUM(exposure_count) AS exposure_count
,SUM(exposure_uv) AS exposure_uv
,SUM(play_hot_uv) AS play_hot_uv
,SUM(video_download_count) AS video_download_count
FROM rpt_viva_log_report_hashtag_info_1d
WHERE tag = '#type#'
and group_id = 1
And ds >=  #startDate#
and ds <= #endDate#
GROUP BY puiddigest
,auiddigest,ver
ORDER BY play_count DESC
LIMIT 1000
;
`;
