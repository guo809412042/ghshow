/*
 * @Author: ssssslf
 * @Date: 2020-01-14 16:35:03
 * @LastEditTime : 2020-01-14 16:49:41
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/videoAnalytics/viva/hotVideo/sqlTemplate.js
 */
export const listSQL = `
SELECT puiddigest
, SUM(play_uv) AS play_uv
, SUM(play_in) AS play_in
, SUM(play_out) AS play_out
, SUM(like_uv) AS like_uv
, SUM(comment_uv) AS comment_uv
, SUM(exposure_count) AS exposure_count
, SUM(exposure_uv) AS exposure_uv
, SUM(play_hot_uv) AS play_hot_uv
, SUM(video_download_count) AS video_download_count
, group_id, is_spider
FROM rpt_viva_log_hot_vdo_cnt_1d
WHERE bizday >= #startDate#
AND bizday <= #endDate#
AND group_id = 1 #where#
GROUP BY puiddigest, 
group_id, 
is_spider
ORDER BY #order# DESC
limit 1000
`;
