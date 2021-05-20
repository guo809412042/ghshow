/*
 * @Author: ssssslf
 * @Date: 2020-01-13 16:52:22
 * @LastEditTime : 2020-01-14 10:58:04
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/videoAnalytics/viva/topVideo/sqlTemplate.js
 */
export const listSQL = `
select puiddigest
,puid
,is_spider
,sum(play_count) as play_count_total
,sum(like_count) as like_count_total
,sum(forward_count) as forward_count_total
,sum(comment_count) as comment_count_total
,sum(play_in) as play_in_total
,sum(play_out) as play_out_total 
from rpt_viva_topvdo_count_1d 
where
 ds >= #startDate# and
  ds <= #endDate#  
  #where#
  and group_id = 1 
  group by puiddigest,puid,is_spider 
  order by #order# desc limit 10000;
`;
