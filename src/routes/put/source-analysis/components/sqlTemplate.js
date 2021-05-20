/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/3/6
 * Time: 上午11:33
 *
 */
export const coreSql = `
/*self_plus engine=MPP*/
select  #name#
        ,sum(reg_num) as reg_num
        ,sum(play_uv) as play_uv
        ,sum(play_pv) as play_pv
        ,sum(use_period) as use_period
from    dws_vid_dp_index_1d
where   ds >= #startDate#
and     ds <= #endDate# #where#
group by #name#
limit   1000
;
`;

export const coreSqlDetail = `
/*self_plus engine=MPP*/
select  SUM(reg_num) as reg_num,
        ds
from    dws_vid_dp_index_1d
where   ds >= #startDate#
and     ds <= #endDate# #where#
group by ds
order by ds
limit   1000
`;

export const remainSql = `
/*self_plus engine=MPP*/
select  sum(reg_num) as reg_num
        ,sum(stay_num) as stay_num
        ,#name#
        ,stay_seq
from    dws_vid_dp_stay_1d
where   ds >= #startDate#
and     ds <= #endDate# #where#
group by #name#
         ,stay_seq
limit   10000
;
`;
export const NumSql = `
/*self_plus engine=MPP*/
select  sum(reg_num) as reg_num
        ,sum(organic_num) as organic_num
        ,sum(put_num) as put_num
        ,t1.ds as ds
from    (
            select  sum(reg_num) as reg_num
                    ,ds
            from    dws_vid_dp_index_1d
            where   ds >= #startDate#
            and     ds <= #endDate#
            group by ds
        ) t1
left outer join (
                    select  sum(reg_num) as organic_num
                            ,ds
                    from    dws_vid_dp_index_1d
                    where   ds >= #startDate#
                    and     ds <= #endDate#
                    and     media_source not in ('UAC source','FBad','ASM')
                    group by ds
                ) t2
on      t1.ds = t2.ds
left outer join (
                    select  sum(reg_num) as put_num
                            ,ds
                    from    dws_vid_dp_index_1d
                    where   ds >= #startDate#
                    and     ds <= #endDate#
                    and     media_source in ('UAC source','FBad','ASM')
                    group by ds
                ) t3
on      t1.ds = t3.ds
group by t1.ds 
order by ds asc 
limit   1000
;            
`;
export const campaignListSql = `
/*self_plus engine=MPP*/
select  campaign
from    dws_vid_dp_index_1d
where   ds >= #startDate#
and     ds <= #endDate# 
group by campaign
limit   1000
;
`;
export const remainDetailSql = `
/*self_plus engine= MPP*/
select #name#,
       ds,
       SUM(stay_num) as stay_num ,
       SUM(reg_num) as reg_num ,
       stay_seq
  from dws_vid_dp_stay_1d
where   ds >= #startDate#
and     ds <= #endDate# #where#
GROUP BY #name#,ds,stay_seq 
ORDER BY ds ,stay_seq 
 limit 10000 ;
  `;
export const advPlatformSQL = `
SELECT platform,
       sum(impressions) as impressions,
       sum(clicks) as clicks,
       sum(install) as install,
      sum( spend) as spend
  FROM ads_vid_adv_push_agt_lang
   where   ds >= #startDate#
and     ds <= #endDate# 
 GROUP BY platform
 `;
export const advCampaignSQL = `
SELECT campaign_name,
       sum(impressions) as impressions,
       sum(clicks) as clicks,
       sum(install) as install,
      sum( spend) as spend
  FROM ads_vid_adv_push_campaign
   where   ds >= #startDate#
and     ds <= #endDate# 
 GROUP BY campaign_name
 `;
