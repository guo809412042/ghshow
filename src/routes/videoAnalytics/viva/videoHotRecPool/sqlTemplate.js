/*
 * @Author: ssssslf
 * @Date: 2020-01-14 17:02:54
 * @LastEditTime : 2020-01-14 17:20:04
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/videoAnalytics/viva/videoHotRecPool/sqlTemplate.js
 */
export const listSQL = `
select count(distinct puiddigest) as puid_cnt,video_trace,state
from video_hot_rec_pool
where ds >= #startDate# and ds <= #endDate# and group_id = 1
group by video_trace,state
order by video_trace,state;
`;


export const hotRecPoolDetail = `
select auiddigest,puiddigest,ver,video_trace,state,create_time,modify_time
from video_hot_rec_pool
where ds >= #startDate# and ds <= #endDate# and group_id = 1 and video_trace=#type# and state = #state#
order by create_time desc;
`;
