/* eslint-disable no-tabs */
/*
 * @Description:
 * @Author: kuckboy
 * @Date: 2020-12-04 11:40:28
 * @LastEditTime: 2021-03-09 17:59:30
 * @LastEditors: Neal
 */

export const makeGocutPvSQL = ` 
SELECT
date,
sum( homepage_view_cnt ) AS homepage_view_cnt,
sum( gallery_view_cnt ) AS gallery_view_cnt,
sum( edit_view_cnt ) AS edit_view_cnt,
sum( export_click_cnt ) AS export_click_cnt,
sum( share_view_cnt ) AS share_view_cnt,
sum( share_click_cnt ) AS share_click_cnt,
sum( app_start_cnt ) AS app_start_cnt
FROM gocut_usr_vdo_make_statis_da 
WHERE date >= '#startDate#' and date <= '#endDate#' #where# 
GROUP BY date;`;

export const makeGocutUvSQL = ` 
SELECT
date,
sum( CASE WHEN homepage_view_cnt > 0 THEN 1 ELSE 0 END ) AS homepage_view_cnt,
sum( CASE WHEN gallery_view_cnt > 0 THEN 1 ELSE 0 END ) AS gallery_view_cnt,
sum( CASE WHEN edit_view_cnt > 0 THEN 1 ELSE 0 END ) AS edit_view_cnt,
sum( CASE WHEN export_click_cnt > 0 THEN 1 ELSE 0 END ) AS export_click_cnt,
sum( CASE WHEN share_view_cnt > 0 THEN 1 ELSE 0 END ) AS share_view_cnt,
sum( CASE WHEN share_click_cnt > 0 THEN 1 ELSE 0 END ) AS share_click_cnt,
sum( CASE WHEN app_start_cnt > 0 THEN 1 ELSE 0 END ) AS app_start_cnt,
sum( CASE WHEN success_export_cnt > 0 THEN 1 ELSE 0 END ) AS success_export_cnt
FROM gocut_usr_vdo_make_statis_da 
WHERE date >= '#startDate#' and date <= '#endDate#' #where# 
GROUP BY date
ORDER BY date DESC
;`;
// export const makeGocutUvSQL = `
// SELECT
// *
// FROM gocut_usr_vdo_make_statis_da 
// WHERE date >= '#startDate#' and date <= '#endDate#' #where# 
// GROUP BY date
// ORDER BY date DESC
// ;`;