/*
 * @Author: ssssslf
 * @Date: 2019-12-17 17:34:22
 * @LastEditTime: 2020-04-30 13:54:37
 * @LastEditors: ssssslf
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/sourceAnalysis/viva/sqlTemplate.js
 */
export const listSql = `
select  reg_num
,put_num
, organic_num,reg_time as ds
from    (
select  sum(reg_num) as reg_num
        ,reg_time
from    ads_viva_dp_sub_1d
where   reg_time >= #startDate#
and     reg_time <= #endDate#  #country# and platform = #product#
group by reg_time
) t1
left outer join (
        select  sum(reg_num) as put_num
                ,reg_time
        from    ads_viva_dp_sub_1d
        where   reg_time >= #startDate#
        and     reg_time <= #endDate# 
         #country# and platform = #product#
        and     media_source not in ('Organic','other_reg') 
        group by reg_time

    ) t2
on      t1.reg_time = t2.reg_time
left outer join (
        select  sum(reg_num) as organic_num
                ,reg_time
        from    ads_viva_dp_sub_1d
        where   reg_time >= #startDate#
        and     reg_time <= #endDate# 
         #country# and platform = #product#
        and     media_source in ('Organic','other_reg') 
group by reg_time
    ) t3
on      t1.reg_time = t3.reg_time
order by reg_time
;`;

export const campaignListSql = `
select campaign_name
  from ads_viva_dp_sub_1d
 group by campaign_name
;
`;

export const vivaMoneySQL = `
/*self_plus engine=MPP*/
select   #type#
    ,sum(reg_num )  as  reg_num
    ,sum(vip_enter_cnt)  as  vip_enter_cnt
    ,sum(trial_paid_cnt ) as  trial_paid_cnt 
    ,sum(yearly_paid_cnt ) as  yearly_paid_cnt 
    ,sum(monthly_paid_cnt ) as  monthly_paid_cnt 
    ,sum(other_paid_cnt ) as  other_paid_cnt 
    ,round(sum(amount_total ),2) as  amount_total 
from    ads_viva_dp_sub_1d
where   reg_time >= #startDate#
and     reg_time <= #endDate# #country# #where# and platform = #platform#
group   by #type#
order by reg_num desc`;

export const vivaCommunitySQL = `
/*self_plus engine=MPP*/
select   #type#
        ,sum(play_uv) as play_uv
        ,sum(play_pv) as play_pv
        ,round(sum(use_period/1000),2) as use_period
from    ads_viva_dp_usr_index_1d
where   ds >= #startDate#
and     ds <= #endDate# #country# #where# and platform = #platform#
group   by #type#;
`;

export const remainSQL = `
/*self_plus engine=MPP*/
select  sum(reg_num) as reg_num
        ,sum(stay_num) as stay_num
        ,#type#
        ,stay_seq
from     ads_viva_dp_usr_stay_1d
where   ds >= #startDate#
and     ds <= #endDate# #country# #where# and platform = #platform#
group by #type#,stay_seq;
`;

export const coreSqlDetail = `
/*self_plus engine=MPP*/
select   #type#
    ,sum(reg_num )  as  reg_num,reg_time
from    ads_viva_dp_sub_1d
where   reg_time >= #startDateReg#
and     reg_time <= #endDateReg# #country# #where#
and platform = #platform#
group   by #type# , reg_time order by reg_time asc;
`;

export const remainDetailSql = `
 /*self_plus engine=MPP*/
select  sum(reg_num) as reg_num
        ,sum(stay_num) as stay_num
        ,#type#
        ,stay_seq
        ,ds
from     ads_viva_dp_usr_stay_1d
where   ds >= #startDateRemain#
and     ds <= #endDateRemain# #country# #where# and platform = #platform#
group by #type#,ds,stay_seq
order by ds, stay_seq
  `;
