export const hotvideoVivaShow = `
select  puid
        ,lang
        ,is_spider
        ,sum(exp_vdo_vivashow_cnt_1d) as exp_vdo_vivashow_cnt_1d
        ,sum(exp_vdo_vivashow_dvc_cnt_1d) as exp_vdo_vivashow_dvc_cnt_1d
        ,sum(ply_vdo_vivashow_dvc_cnt_1d) as ply_vdo_vivashow_dvc_cnt_1d
        ,sum(ply_vdo_vivashow_cnt_1d ) as ply_vdo_vivashow_cnt_1d
        ,sum(ply_vdo_dur_vivashow_1d ) as ply_vdo_dur_vivashow_1d
        ,sum(ply_vdo_vivashow_cnt_3s_1d ) as ply_vdo_vivashow_cnt_3s_1d
        ,sum(ply_vdo_vivashow_dvc_cnt_3s_1d) as ply_vdo_vivashow_dvc_cnt_3s_1d
        ,sum(ply_vdo_dur_vivashow_3s_1d) as ply_vdo_dur_vivashow_3s_1d
        ,sum(lk_vdo_vivashow_cnt_1d) as lk_vdo_vivashow_cnt_1d
        ,sum(lk_vdo_vivashow_dvc_cnt_1d) as lk_vdo_vivashow_dvc_cnt_1d
        ,sum(cmnt_vdo_vivashow_cnt_1d) as cmnt_vdo_vivashow_cnt_1d
        ,sum(cmnt_vdo_vivashow_dvc_cnt_1d) as cmnt_vdo_vivashow_dvc_cnt_1d
        ,sum(dnld_vdo_vivashow_cnt_1d) as dnld_vdo_vivashow_cnt_1d
        ,sum(dnld_vdo_vivashow_dvc_cnt_1d) as dnld_vdo_vivashow_dvc_cnt_1d
        ,sum(fwd_wapp_vdo_vivashow_cnt_1d) as fwd_wapp_vdo_vivashow_cnt_1d
        ,sum(fwd_wapp_vdo_vivashow_dvc_cnt_1d) as fwd_wapp_vdo_vivashow_dvc_cnt_1d
        ,publish_time
from    rpt_vid_vdo_idx_1d
where   ds >= #startDate#
and     ds <= #endDate#
#where#
group by puid
         ,lang
         ,is_spider
         ,publish_time
order by #order# desc
limit   10000
;
`;
