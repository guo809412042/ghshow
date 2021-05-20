/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-10 09:57:04
 * @LastEditTime: 2020-04-20 14:37:13
 * @LastEditors: ssssslf
 */
export const yunduanSQL = `
SELECT  sum(home_entry_cnt_1d) as  home_entry_cnt_1d
        ,sum(gallery_entry_cnt_1d) as gallery_entry_cnt_1d
        ,sum(preview_entry_cnt_1d) as  preview_entry_cnt_1d
        ,sum(save_button_clk_cnt_1d) as save_button_clk_cnt_1d
        ,sum(share_savetogallery_cnt_1d) as share_savetogallery_cnt_1d
        ,sum(share_button_clk_cnt_1d) as share_button_clk_cnt_1d
from ads_sp_log_path_usr_cnt_1d
where type='cloud' and ds >= '#startDate#' and ds <= '#endDate#' #where#
and  path_type = 2 
`;


export const localSQL = `
SELECT  sum(home_entry_cnt_1d) as  home_entry_cnt_1d
        ,sum(gallery_entry_cnt_1d) as gallery_entry_cnt_1d
        ,sum(preview_entry_cnt_1d) as  preview_entry_cnt_1d
        ,sum(save_button_clk_cnt_1d) as save_button_clk_cnt_1d
        ,sum(share_savetogallery_cnt_1d) as share_savetogallery_cnt_1d
        ,sum(share_button_clk_cnt_1d) as share_button_clk_cnt_1d
from ads_sp_log_path_usr_cnt_1d
where type='local' and ds >= '#startDate#' and ds <= '#endDate#' #where#
and  path_type = 2 
`;


export const yunduanDetailSQL = `
SELECT  sum(home_entry_cnt_1d) as  home_entry_cnt_1d
        ,sum(gallery_entry_cnt_1d) as gallery_entry_cnt_1d
        ,sum(preview_entry_cnt_1d) as  preview_entry_cnt_1d
        ,sum(save_button_clk_cnt_1d) as save_button_clk_cnt_1d
        ,sum(share_savetogallery_cnt_1d) as share_savetogallery_cnt_1d
        ,sum(share_button_clk_cnt_1d) as share_button_clk_cnt_1d
        ,ds
from ads_sp_log_path_usr_cnt_1d
where type='cloud' and ds >= '#startDate#' and ds <= '#endDate#' #where#
and  path_type = 2 
group by ds 
order by ds desc
`;

export const localDetailSQL = `
SELECT  sum(home_entry_cnt_1d) as  home_entry_cnt_1d
        ,sum(gallery_entry_cnt_1d) as gallery_entry_cnt_1d
        ,sum(preview_entry_cnt_1d) as  preview_entry_cnt_1d
        ,sum(save_button_clk_cnt_1d) as save_button_clk_cnt_1d
        ,sum(share_savetogallery_cnt_1d) as share_savetogallery_cnt_1d
        ,sum(share_button_clk_cnt_1d) as share_button_clk_cnt_1d
        ,ds
from ads_sp_log_path_usr_cnt_1d
where type='local' and ds >= '#startDate#' and ds <= '#endDate#' #where#
and  path_type = 2 
group by ds 
order by ds desc
`;
