export const vvuvPlay = `
select  round(ply_cnt#type#1d/ply_dvc_cnt#type#1d,4) as _all 
        ,round(ply_vivashow_cnt#type#1d/ply_vivashow_dvc_cnt#type#1d,4) as vivashow  
        ,round(ply_status_cnt#type#1d/ply_status_dvc_cnt#type#1d,4) as status  
        ,round(ply_search_cnt#type#1d/ply_search_dvc_cnt#type#1d,4) as search  
        ,round(ply_follow_cnt#type#1d/ply_follow_dvc_cnt#type#1d,4) as follow
        ,ds as day
from    rpt_vid_itr_idx_1d
where   ds <= #endDate#
and     ds >= #startDate#
order by ds desc
limit   1000
`;

export const usersql = `
select  active_dvc_cnt_1d
        ,app_active_dvc_cnt_1d
        ,community_dvc_cnt_1d
        ,consume_dvc_cnt_1d
        ,exp_dvc_cnt_1d
        ,tool_dvc_cnt_1d
        ,new_dvc_cnt_1d
        ,ds
from    rpt_vid_itr_idx_1d
where   ds <= #endDate#
and     ds >= #startDate#
order by ds desc
limit   1000
`;

export const publishcount = `
select  pub_vdo_cnt_1d  as publish_count
        ,pub_dvc_cnt_1d as publish_dvc
        ,pub_usr_cnt_1d as publish_uv
        ,ds 
from    rpt_vid_itr_idx_1d
where   ds <= #endDate#
and     ds >= #startDate#
order by ds desc
limit   100
`;

export const interactivesql = `
select  exp#type#cnt_1d as exposure_count
        ,exp#type#dvc_cnt_1d as exposure_uv
        ,ply#type#cnt_1d as play_count
        ,ply#type#dvc_cnt_1d as play_uv
        ,lk#type#cnt_1d as like_count
        ,lk#type#dvc_cnt_1d as like_uv
        ,dnld#type#cnt_1d as download_count
        ,dnld#type#dvc_cnt_1d as download_uv
        ,cmnt#type#cnt_1d as comment_count
        ,cmnt#type#dvc_cnt_1d as comment_uv
        ,fwd_wapp#type#cnt_1d as share_count
        ,fwd_wapp#type#dvc_cnt_1d as share_uv
        ,ply#type#cnt_3s_1d as ply_cnt_3s_1d
        ,ply#type#dvc_cnt_3s_1d as ply_dvc_cnt_3s_1d
        ,ds 
from    rpt_vid_itr_idx_1d
where   ds <= #endDate# 
and     ds >= #startDate#
order by ds desc
limit   1000
`;

export const vivashowplaycountplot = `
SELECT _5, _5_10, _10_15, _15_20, _20_30
, _30_50, _50_100, _100, day
FROM vivashow_play_countplot_day
WHERE day >= #startDate#
AND day <= #endDate#
AND type = '#type#'
ORDER BY day ASC
LIMIT 1000;
`;
