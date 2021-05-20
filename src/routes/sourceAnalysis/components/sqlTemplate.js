const isMast = window.location.href.includes('gh/source-analytics/mast')
  || window.location.href.includes('gh/client-source-analytics/mast');

// export const clientRemainSQL = `
// /*+ engine= mpp*/
// select  sum(reg_num) as reg_num
//         ,sum(stay_num) as stay_num
//         ,#type#
//         ,stay_seq
// from     ads_pub_dp_#database#_stay_1d
// where   stay_seq IS NOT NULL and ds >= #startDate#
// and     ds <= #endDate# #country# #where# and media_source != 'Organic' and platform = #platform# and product_id = #product#
// group by #type#,stay_seq;
// `;

export const clientRemainSQL = `
/*+ engine= mpp*/
SELECT  #type#,stay_seq ,SUM(reg_num) as reg_num, SUM(stay_num) as stay_num
FROM ( 
SELECT a.#type#
        ,a.ds
        ,b.stay_seq
        ,a.reg_num
        ,b.stay_num
FROM(
    SELECT #type#
            ,ds
            ,SUM(reg_num) AS reg_num
    FROM(
        SELECT country_name,platform,media_source,campaign_name,adset,adname,reg_num,ds,product_id
        FROM    ads_pub_dp_#database#_stay_1d
        GROUP BY country_name,platform,media_source,campaign_name,adset,adname,reg_num,ds,product_id
    )t WHERE  ds >= #startDate# and ds <= #endDate# #country# #where# AND media_source != 'Organic' and platform = #platform# and product_id = #product#
    GROUP BY #type#,ds
)a LEFT JOIN (
    SELECT #type#,ds,stay_seq,SUM(stay_num) as stay_num
    FROM   ads_pub_dp_#database#_stay_1d 
    WHERE ds >= #startDate# and ds <= #endDate# #country# #where# AND media_source != 'Organic' and platform = #platform# and product_id = #product# and stay_seq is not null 
    GROUP BY #type#,ds,stay_seq
)b on a.#type# = b.#type# and a.ds = b.ds 
)t GROUP BY #type#,stay_seq
;
`;

// export const clientRemainOrgSQL = `
// /*+ engine= mpp*/
// select  sum(reg_num) as reg_num
//         ,sum(stay_num) as stay_num
//         ,media_source
//         ,stay_seq
// from     ads_pub_dp_#database#_stay_1d
// where   stay_seq IS NOT NULL and ds >= #startDate#
// and     ds <= #endDate# #country# and media_source = 'Organic' and platform = #platform# and product_id = #product#
// group by media_source,stay_seq;
// `;

export const clientRemainOrgSQL = `
/*+ engine= mpp*/
SELECT  media_source,stay_seq ,SUM(reg_num) as reg_num, SUM(stay_num) as stay_num
FROM ( 
SELECT a.media_source
        ,a.ds
        ,b.stay_seq
        ,a.reg_num
        ,b.stay_num
FROM(
    SELECT media_source
            ,ds
            ,SUM(reg_num) AS reg_num
    FROM(
        SELECT country_name,platform,media_source,campaign_name,adset,adname,reg_num,ds,product_id
        FROM    ads_pub_dp_#database#_stay_1d 
        GROUP BY country_name,platform,media_source,campaign_name,adset,adname,reg_num,ds,product_id
    )t WHERE  ds >= #startDate# #country# and ds <= #endDate# AND media_source = 'Organic' and platform = #platform# and product_id = #product#
    GROUP BY media_source
            ,ds
)a LEFT JOIN (
    SELECT media_source,ds,stay_seq,SUM(stay_num) as stay_num
    FROM   ads_pub_dp_#database#_stay_1d 
    WHERE ds >= #startDate# and ds <= #endDate# #country#  AND media_source = 'Organic' and platform = #platform# and product_id = #product# and stay_seq is not null 
    GROUP BY media_source,ds,stay_seq
)b on a.media_source = b.media_source and a.ds = b.ds 
)t GROUP BY media_source,stay_seq
;
`;

// export const clientRemainDetailSQL = `
// /*+ engine= mpp*/
// select  sum(reg_num) as reg_num
//         ,sum(stay_num) as stay_num
//         ,#type#
//         ,stay_seq
//         ,ds
// from     ads_pub_dp_#database#_stay_1d
// where  stay_seq IS NOT NULL and ds >= #startDateRemain#
// and     ds <= #endDateRemain# #country# #where# and platform = #platform# and product_id = #product#
// group by ds,#type#,stay_seq
// order by ds ;
// `;

export const clientRemainDetailSQL = `
/*+ engine= mpp*/
SELECT a.#type#
        ,a.ds
        ,b.stay_seq
        ,a.reg_num
        ,b.stay_num
FROM(
    SELECT #type#
            ,ds
            ,SUM(reg_num) AS reg_num
    FROM(
        SELECT country_name,platform,media_source,campaign_name,adset,adname,reg_num,ds,product_id
        FROM    ads_pub_dp_#database#_stay_1d
        GROUP BY country_name,platform,media_source,campaign_name,adset,adname,reg_num,ds,product_id
    )t WHERE  ds >= #startDateRemain# and ds <= #endDateRemain# #country# #where# AND media_source != 'Organic' and platform = #platform# and product_id = #product#
    GROUP BY #type#,ds
)a LEFT JOIN (
    SELECT #type#,ds,stay_seq,SUM(stay_num) as stay_num
    FROM   ads_pub_dp_#database#_stay_1d
    WHERE ds >= #startDateRemain# and ds <= #endDateRemain# #country# #where# AND media_source != 'Organic' and platform = #platform# and product_id = #product# and stay_seq is not null
    GROUP BY #type#,ds,stay_seq
)b on a.#type# = b.#type# and a.ds = b.ds
order by a.ds
;
`;

export const clientBehaviorAnalysisSQL = `
/*+ engine= mpp*/
select  #type#
,sum(new_dvc_cnt) as new_dvc_cnt
,sum(dau) as dau
,sum(export_dvc_cnt) as export_dvc_cnt
,sum(export_cnt) as export_cnt
from     rpt_india_dp_dvc_cnt_1d
where   ds >= #startDate#
and     ds <= #endDate# #country# #where# and product_id = #product#
group by #type#;
`;

export const chartClientBehaviorAnalysisSQL = `
/*+ engine= mpp*/
select  #type#
,sum(new_dvc_cnt) as reg_num
,sum(dau) as dau
,sum(export_dvc_cnt) as export_dvc_cnt
,sum(export_cnt) as export_cnt
,round(sum(export_dvc_cnt)*100/sum(new_dvc_cnt),2) as export_user_rate
,ds as reg_time
from     rpt_india_dp_dvc_cnt_1d
where   ds >= #startDateReg#
and     ds <= #endDateReg# #country# #where# and product_id = #product#
group by ds, #type#
order by ds;
`;

export const clientBehaviorAnalysisDetailSQL = `
/*+ engine= mpp*/
select  sum(reg_num) as reg_num
        ,sum(stay_num) as stay_num
        ,#type#
        ,stay_seq
        ,ds
from     rpt_india_dp_dvc_cnt_1d
where   stay_seq IS NOT NULL and ds >= #startDateReg#
and     ds <= #endDateRemain# #country# #where# and platform = #platform# and product_id = #product#
group by ds,#type#,stay_seq
order by ds ;
`;

export const clientCardSQL = `
select  reg_num
,put_num
, organic_num,reg_time as ds
from    (
select  sum(reg_num) as reg_num
        ,reg_time
from    ads_pub_dp_#database#_sub_1d
where   reg_time >= #startDate#
and     reg_time <= #endDate#  #country# and platform = #platform# and product_id = #product#
group by reg_time
) t1
left outer join (
        select  sum(reg_num) as put_num
                ,reg_time
        from    ads_pub_dp_#database#_sub_1d
        where   reg_time >= #startDate#
        and     reg_time <= #endDate# 
        #country# and platform = #platform# and product_id = #product#
        and  
        ${isMast ? 'media_source not in(\'Organic\',\'share\')' : 'media_source not in( \'Organic\')'}
        group by reg_time
    ) t2
on      t1.reg_time = t2.reg_time
left outer join (
        select  sum(reg_num) as organic_num
                ,reg_time
        from    ads_pub_dp_#database#_sub_1d
        where   reg_time >= #startDate#
        and     reg_time <= #endDate# 
        #country# and platform = #platform# and product_id = #product#
        and  
        ${isMast ? 'media_source in(\'Organic\',\'share\')' : 'media_source in( \'Organic\')'}
group by reg_time
    ) t3
on      t1.reg_time = t3.reg_time`;

export const clientCampaignListSql = `
/*+ engine= mpp*/
select campaign_name
  from ads_pub_dp_#database#_sub_1d where product_id = #product#
 group by campaign_name
;
`;

export const clientCoreSQL = `
/*+ engine= mpp*/
select #type#
, sum(reg_num) as reg_num
, sum(amt_total) as amt_total
, sum(refund_amt) as refund_amt
, sum(monthly_trial_paid_cnt) as monthly_trial_paid_cnt
, sum(yearly_trial_paid_cnt) as yearly_trial_paid_cnt
, sum(yearly_new_paid_cnt) as yearly_new_paid_cnt
, sum(monthly_new_paid_cnt) as monthly_new_paid_cnt
, sum(yearly_old_paid_cnt) as yearly_old_paid_cnt
, sum(monthly_old_paid_cnt) as monthly_old_paid_cnt
, sum(other_old_paid_cnt) as other_old_paid_cnt
, sum(yearly_amt_total) as yearly_amt_total
, sum(monthly_amt_total) as monthly_amt_total
, sum(other_amt_total) as other_amt_total
, sum(spend) as spend
from  ads_pub_dp_#database#_sub_1d
where   reg_time >= #startDate#
and     reg_time <= #endDate# #country# #where# and platform = #platform# and product_id = #product#
group   by #type#
order by reg_num desc
`;

export const clientOrganicSQL = `
/*+ engine= mpp*/
select media_source
, sum(reg_num) as reg_num
, sum(amt_total) as amt_total
, sum(refund_amt) as refund_amt
, sum(monthly_trial_paid_cnt) as monthly_trial_paid_cnt
, sum(yearly_trial_paid_cnt) as yearly_trial_paid_cnt
, sum(yearly_new_paid_cnt) as yearly_new_paid_cnt
, sum(monthly_new_paid_cnt) as monthly_new_paid_cnt
, sum(yearly_old_paid_cnt) as yearly_old_paid_cnt
, sum(monthly_old_paid_cnt) as monthly_old_paid_cnt
, sum(other_old_paid_cnt) as other_old_paid_cnt
, sum(yearly_amt_total) as yearly_amt_total
, sum(monthly_amt_total) as monthly_amt_total
, sum(other_amt_total) as other_amt_total
from  ads_pub_dp_#database#_sub_1d
where   reg_time >= #startDate#
and     reg_time <= #endDate# #country# and media_source='Organic' and platform = #platform# and product_id = #product#
group   by media_source
`;

export const clientCoreDetailSQL = `
/*+ engine= mpp*/
select #type#
, sum(reg_num) as reg_num
, sum(amt_total) as amt_total
, reg_time
, sum(refund_amt) as refund_amt
, sum(monthly_trial_paid_cnt) as monthly_trial_paid_cnt
, sum(yearly_trial_paid_cnt) as yearly_trial_paid_cnt
, sum(yearly_new_paid_cnt) as yearly_new_paid_cnt
, sum(monthly_new_paid_cnt) as monthly_new_paid_cnt
, sum(yearly_old_paid_cnt) as yearly_old_paid_cnt
, sum(monthly_old_paid_cnt) as monthly_old_paid_cnt
, sum(other_old_paid_cnt) as other_old_paid_cnt
, sum(yearly_amt_total) as yearly_amt_total
, sum(monthly_amt_total) as monthly_amt_total
, sum(other_amt_total) as other_amt_total
from  ads_pub_dp_#database#_sub_1d
where   reg_time >= #startDateReg#
and     reg_time <= #endDateReg# #country# #where# and platform = #platform# and product_id = #product#
group   by #type#,reg_time
order by reg_time,reg_num desc
`;
export const clientSpendDetailCoreSQL = `
/*+ engine= mpp*/
 select reg_time,
       round(spend,2) as spend
  from(
SELECT  sum(spend) as spend,reg_time
  FROM(
SELECT #select_type# campaign_name, spend,reg_time
  FROM ads_pub_dp_#database#_sub_1d
  where   reg_time >= #startDateReg#
  and     reg_time <= #endDateReg# #country# #where# and platform = #platform# and  product_id = #product#
 GROUP BY #select_type# reg_time, campaign_name, spend) t
 GROUP BY reg_time) 
 order by reg_time 
`;

export const clientSpendSql = `
/*+ engine= mpp*/
SELECT reg_time as ds,SUM(spend) as spend_num
FROM(
    SELECT campaign_name,reg_time,spend 
FROM ads_pub_dp_#database#_sub_1d 
where reg_time >= #startDate# 
  and reg_time <= #endDate# 
   #country# and platform = #platform# and  product_id = #product#
GROUP BY campaign_name,reg_time,spend
)t GROUP BY reg_time

;
`;

export const clientCoreAmtSQL = `
/*+engine=mpp*/
SELECT t.#type# as #type#,
       round((t.monthly_amt_7total+ t.yearly_amt_7total),2) as amt_total_7d,
       round((t.monthly_amt_30total+ t.yearly_amt_30total),2) as amt_total_30d,
       round(t.fore_Rev_7d,2) as fore_Rev_7d,
       round(t.fore_Rev_30d,2) as fore_Rev_30d
  from(
select #type#, 
sum(monthly_amt_7total) as monthly_amt_7total,
sum(yearly_amt_7total) as yearly_amt_7total, 
sum(monthly_amt_30total) as monthly_amt_30total,
sum(yearly_amt_30total) as yearly_amt_30total, 
sum(reckon_7_amt) as fore_Rev_7d,
sum(reckon_30_amt) as fore_Rev_30d
from ads_viva_dp_#database#_reckon_amt_1d
 where ds>= #startDate#
   and ds<= #endDate#
   #country# #where# and platform = #platform#
 group by #type#) t
`;

export const clientCoreAmtDetailSQL = `
/*+engine=mpp*/
SELECT t.#type# as #type#,
t.reg_time as reg_time,
       round((t.monthly_amt_7total+ t.yearly_amt_7total),2) as amt_total_7d,
       round((t.monthly_amt_30total+ t.yearly_amt_30total),2) as amt_total_30d,
       round(t.fore_Rev_7d,2) as fore_Rev_7d,
       round(t.fore_Rev_30d,2) as fore_Rev_30d
  from(
select #type#, 
reg_time,
sum(monthly_amt_7total) as monthly_amt_7total,
sum(yearly_amt_7total) as yearly_amt_7total, 
sum(monthly_amt_30total) as monthly_amt_30total,
sum(yearly_amt_30total) as yearly_amt_30total, 
sum(reckon_7_amt) as fore_Rev_7d,
sum(reckon_30_amt) as fore_Rev_30d
from ads_viva_dp_#database#_reckon_amt_1d
 where ds>= #startDateReg#
   and ds<= #endDateReg#
   #country# #where# and platform = #platform#
 group by #type#,reg_time) t
 `;

export const clientSpendCoreSQL = `
/*+ engine= mpp*/
 select #type#,
       round(spend,2) as spend
  from(
SELECT #type#, sum(spend) as spend
  FROM(
SELECT #select_type# campaign_name, spend,country_name, reg_time
  FROM ads_pub_dp_#database#_sub_1d
  where   reg_time >= #startDate#
  and     reg_time <= #endDate# #country# #where# and platform = #platform# and  product_id = #product#
 GROUP BY #select_type# campaign_name, spend,country_name, reg_time) t
 GROUP BY #type#) 
`;

export const clientLTVAmtSQL = `
/*+engine=mpp*/
SELECT t.#type# as #type#,
  round(reckon_amt,2) as reckon_amt
  from(
select #type#, 
sum(reckon_amt) as reckon_amt
from ads_dp_ltv_future_amt_1d
 where reg_time>= #startDate#
   and reg_time<= #endDate#
   and product_id = #product#
   #country# #where# and platform = #platform#
 group by #type#) t
`;
