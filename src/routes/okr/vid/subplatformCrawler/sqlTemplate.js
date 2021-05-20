/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-26 11:36:49
 * @LastEditTime: 2020-03-26 13:41:57
 * @LastEditors: ssssslf
 */
export const listSQL = `
select  platform
        ,vdo_cnt
        ,vdo_exp_cnt
        ,similar_vdo_cnt
        ,exp_vdo_cnt_1d
        ,ply_vdo_cnt_1d
        ,dnld_vdo_cnt_1d
        ,ptr_3s
        ,ds
from    vid_vdo_platform_crawler_cnt_1d
where   ds = #startDate# and tag='total'
order by ds desc
         ,vdo_cnt desc
limit   1000
;
`;
