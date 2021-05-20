/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-07-06 16:43:49
 * @LastEditTime: 2020-07-06 17:37:35
 * @LastEditors: ssssslf
 */

export const paySQL = `
/*+engine=mpp*/
SELECT  sum(if(app_start_cnt> 0, 1, 0)) AS enter_home_dvc_cnt,
       sum(if(enter_sub_cnt> 0, 1, 0)) AS enter_buy_home_dvc_cnt,
       sum(if(click_cnt> 0, 1, 0)) AS click_buy_dvc_cnt,
       sum(if(buy_cnt> 0, 1, 0)) AS buy_dvc_cnt
  FROM vcm_pub_buy_dvc_cnt_1d
 WHERE ds >= '#startDate#' and ds <= '#endDate#' #where#
`;
export const payDetailSQL = `
/*+engine=mpp*/
SELECT ds,
       sum(if(app_start_cnt> 0, 1, 0)) AS enter_home_dvc_cnt,
       sum(if(enter_sub_cnt> 0, 1, 0)) AS enter_buy_home_dvc_cnt,
       sum(if(click_cnt> 0, 1, 0)) AS click_buy_dvc_cnt,
       sum(if(buy_cnt> 0, 1, 0)) AS buy_dvc_cnt
  FROM vcm_pub_buy_dvc_cnt_1d
 WHERE ds >= '#startDate#' and ds <= '#endDate#' #where#
 GROUP BY ds 
 order by ds desc;
;`;
