/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-10 10:12:41
 * @LastEditTime: 2020-03-10 10:12:59
 * @LastEditors: ssssslf
 */
export const listSQL = `
select  sum(app_active_cnt) as app_active_cnt
        ,sum(app_con_cnt) as app_con_cnt
        ,sum(con_cnt) as con_cnt
        ,sum(shr_cnt) as shr_cnt
        ,sum(pub_cnt) as pub_cnt
        ,sum(tool_enter_cnt) as tool_enter_cnt
        ,sum(tool_made_cnt) as tool_made_cnt
        ,sum(tool_sus_cnt) as tool_sus_cnt
        ,sum(cmty_act_cnt) as cmty_act_cnt
        ,sum(cmty_act_app_stay_cnt) as cmty_act_app_stay_cnt
        ,sum(cmty_act_stay_cnt) as cmty_act_stay_cnt
        ,sum(con_app_stay_cnt) as con_app_stay_cnt
        ,sum(con_stay_cnt) as con_stay_cnt
        ,sum(shr_app_stay_cnt) as shr_app_stay_cnt
        ,sum(shr_stay_cnt) as shr_stay_cnt
        ,sum(pub_app_stay_cnt) as pub_app_stay_cnt
        ,sum(pub_stay_cnt) as pub_stay_cnt
        ,sum(tool_act_app_stay_cnt) as tool_act_app_stay_cnt
        ,sum(tool_act_stay_cnt) as tool_act_stay_cnt
        ,sum(tool_made_app_stay_cnt) as tool_made_app_stay_cnt
        ,sum(tool_made_stay_cnt) as tool_made_stay_cnt
        ,sum(tool_shr_app_stay_cnt) as tool_shr_app_stay_cnt
        ,sum(tool_shr_stay_cnt) as tool_shr_stay_cnt
        ,sum(pre_cmty_act_cnt) as pre_cmty_act_cnt
        ,sum(pre_con_cnt) as pre_con_cnt
        ,sum(pre_shr_cnt) as pre_shr_cnt
        ,sum(pre_pub_cnt) as pre_pub_cnt
        ,sum(pre_tool_act_cnt) as pre_tool_act_cnt
        ,sum(pre_tool_made_cnt) as pre_tool_made_cnt
        ,sum(pre_tool_shr_cnt) as pre_tool_shr_cnt
        ,usr_type
        ,ds
from    rpt_vid_log_dvc_type_cnt_1d
where   ds >= #startDate#
and     ds <= #endDate#
group by usr_type
         ,ds
order by ds asc
limit   1000
;
`;
