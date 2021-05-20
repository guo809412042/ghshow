/*
 * @Author: ssssslf
 * @Date: 2020-01-14 17:33:40
 * @LastEditTime : 2020-01-20 17:07:30
 * @LastEditors  : ssssslf
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/recommendation/viva/mainRec/sqlTemplate.js
 */
export const listSQL = `
SELECT SUM(play_puid_total) AS play_puid_total, SUM(exposure_puid_total) AS exposure_puid_total
, SUM(play_uv_total) AS play_uv_total, SUM(exposure_uv_total) AS exposure_uv_total
, SUM(play_uv_3s) AS play_uv_3s, SUM(play_puid_3s) AS play_puid_3s, ab_version
FROM rpt_viva_log_rec_video_count_1d
WHERE ds >= #startDate#
AND ds <= #endDate#
AND group_id = 1 and product_id=2
AND type = 'main_rec'
GROUP BY ab_version
ORDER BY ab_version 
LIMIT 1000;
`;

export const detailSQL = `
SELECT SUM(play_total) AS play_puid_total, SUM(exposure_total) AS exposure_puid_total
, SUM(play_uv_total) AS play_uv_total, SUM(exposure_uv_total) AS exposure_uv_total
, SUM(play_total) AS play_total, SUM(exposure_total) AS exposure_total
, SUM(play_uv_3s) AS play_uv_3s, SUM(play_3s) AS play_puid_3s, alg_unit
, SUM(play_cmplt_cnt) AS play_cmplt_cnt
FROM rpt_viva_log_rec_video_count_1d
WHERE ds >= #startDate#
AND ds <= #endDate#
AND group_id = 1 and product_id=2
AND ab_version = '#type#'
GROUP BY alg_unit
ORDER BY alg_unit 
LIMIT 1000;`;

export const algUnitDetailSQL = `
SELECT SUM(play_puid_total) AS play_puid_total, SUM(exposure_puid_total) AS exposure_puid_total
, SUM(play_uv_total) AS play_uv_total, SUM(exposure_uv_total) AS exposure_uv_total
, SUM(play_total) AS play_total, SUM(exposure_total) AS exposure_total
, SUM(play_uv_3s) AS play_uv_3s, SUM(play_3s) AS play_puid_3s, ds as day
FROM rpt_viva_log_rec_video_count_1d
WHERE ds >= #startDate#
AND ds <= #endDate#
AND group_id = 1 and product_id=2
AND ab_version = '#ab_version#'
AND alg_unit = '#alg_unit#'
GROUP BY ds
ORDER BY ds 
LIMIT 1000
`;


export const mainPtrSQL = `
SELECT SUM(play_total) AS play_puid_total,SUM(play_3s) AS play_puid_3s,SUM(exposure_total) AS exposure_puid_total, ab_version, ds as day
FROM rpt_viva_log_rec_video_count_1d
WHERE ds >= #startDate#
AND ds <= #endDate#
AND group_id = 1 and product_id=2 
AND type = 'main_rec'
GROUP BY ab_version, day  
ORDER BY day
LIMIT 1000;
`;
