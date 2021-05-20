/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-19 15:57:16
 * @LastEditTime: 2021-03-29 19:12:34
 * @LastEditors: dongqi.zhao
 */
export const cardSQL = `
select  sum(exp_cnt) as exp_cnt
        ,sum(prev_cnt) as prev_cnt
        ,sum(click_cnt) as click_cnt
        ,sum(export_cnt) as export_cnt
        ,sum(shr_cnt) as shr_cnt
        ,sum(upload_cnt) as upload_cnt
        ,ds
from    #database#
where   ds >= #startDate#  and ds <= #endDate#  and hh = '24' and template_id='all'
#where#
group by ds
order by ds desc
limit   10000
;`;
export const cardOtherSQL = `
select  sum(export_dvc_cnt) as export_dvc_cnt
        ,sum(click_dvc_cnt) as click_dvc_cnt
        ,sum(shr_dvc_cnt) as shr_dvc_cnt
        ,sum(upload_dvc_cnt) as upload_dvc_cnt
        ,ds
from    #database#
where   ds >= #startDate#  and ds <= #endDate#  and hh = '24' and template_id='all'
#where#
group by ds
order by ds desc
limit   10000
;`;

export const cardTemCnTSQL = `
select  count(distinct template_id) as tem_cnt
        ,ds
from    #database#
where   ds >= #startDate#  and ds <= #endDate#  and template_id<>'all'
#where#
group by ds 
order by ds desc
limit   10000
;
`;

export const chartSQL = `
select  ds,sum(exp_cnt) as exp_cnt
        ,sum(prev_cnt) as prev_cnt
        ,sum(click_cnt) as click_cnt
        ,sum(export_cnt) as export_cnt
        ,sum(shr_cnt) as shr_cnt
        ,sum(upload_cnt) as upload_cnt
        ,hh
from    #database#
WHERE   (ds = #startDate# or ds = #yestoday# or ds = #weekday#)
and     hh <> '24' and template_id='all' and usr_type = '#type#'
#where#
group by hh,ds
order by hh asc
limit   10000
`;

export const chartOtherSQL = `
select  sum(export_dvc_cnt) as export_dvc_cnt
        ,sum(click_dvc_cnt) as click_dvc_cnt
        ,sum(shr_dvc_cnt) as shr_dvc_cnt
        ,sum(upload_dvc_cnt) as upload_dvc_cnt
        ,ds,hh
from    #database#
WHERE   (ds = #startDate# or ds = #yestoday# or ds = #weekday#)
  and hh <> '24' and template_id='all' and usr_type = '#type#'
  #where#
  group by ds,hh
order by ds,hh desc
limit   10000
`;
export const chartTemCntSQL = `
select  count(distinct template_id) as tem_cnt
        ,ds,hh
from    #database#
WHERE   (ds = #startDate# or ds = #yestoday# or ds = #weekday#)
 and hh <> '24' and template_id<>'all' and usr_type = '#type#'
 #where#
group by ds,hh
order by ds,hh desc
limit   10000
`;
export const modalChartSQL = `
select ds,
export_dvc_cnt,
click_dvc_cnt,
shr_dvc_cnt,
upload_dvc_cnt,
exp_dvc_cnt,
prev_dvc_cnt,
export_cnt,
click_cnt,
shr_cnt,
upload_cnt,
exp_cnt,
prev_cnt,
b.tem_cnt
  from(
select sum(exp_dvc_cnt) as exp_dvc_cnt
,sum(prev_dvc_cnt) as prev_dvc_cnt
,sum(click_dvc_cnt) as click_dvc_cnt
,sum(export_dvc_cnt) as export_dvc_cnt
,sum(shr_dvc_cnt) as shr_dvc_cnt
,sum(upload_dvc_cnt) as upload_dvc_cnt
,sum(exp_cnt) as exp_cnt
,sum(prev_cnt) as prev_cnt
,sum(click_cnt) as click_cnt
,sum(export_cnt) as export_cnt
,sum(shr_cnt) as shr_cnt
,sum(upload_cnt) as upload_cnt
,ds
  from #database#
 where ds >= #startDate#  and ds <= #endDate#
   and hh= '24'
   and template_id= 'all'
   and usr_type= '#type#'
   #where#
 group by ds) a
  left join(
select count(distinct template_id) as tem_cnt, ds
  from #database#
 where ds >= #startDate#  and ds <= #endDate#
   and template_id<> 'all'
   and usr_type= '#type#'
   #where#
 group by ds)b on a.ds = b.ds
 order by ds
 `;

export const listSqlPV = `
/*+ engine= mpp*/
select  template_id
        ,max(template_name) as template_name
        ,max(template_type) as template_type
        ,sum(exp_cnt) as exp_cnt
        ,sum(list_exp_cnt) as list_exp_cnt
        ,sum(pre_exp_cnt) as pre_exp_cnt
        ,sum(cover_click_cnt) as cover_click_cnt
        ,sum(export_cnt) as export_cnt
        ,sum(made_cnt) as made_cnt
        ,sum(shr_cnt) as shr_cnt
        ,if(sum(list_exp_cnt)>0,round(sum(cover_click_cnt)*100/sum(list_exp_cnt),4),0) as cover_list_ratio
        ,if(sum(pre_exp_cnt)>0,round(sum(made_cnt)*100/sum(pre_exp_cnt),4),0)  as made_pre_exp_ratio
        ,if(sum(made_cnt)>0,round(sum(export_cnt)*100/sum(made_cnt),4),0)  as export_made_ratio
        ,if(sum(exp_cnt)>0,round(sum(shr_cnt)*100/sum(export_cnt),4),0)  as shr_export_ratio
        ,if(sum(exp_cnt)>0,round(sum(export_cnt)*100/sum(exp_cnt),4),0)  as export_exp_ratio
        ,max(create_time) as create_time
        ,max(previewurl) as previewurl
from    rpt_india_log_tmpl_per_1d_02
where ds >= #startDate#  and ds <= #endDate#
#where#
group by template_id
order by exp_cnt desc
limit   10000
;
`;

export const listSqlUV = `
/*+ engine= mpp*/
select  template_id
        ,max(template_name) as template_name
        ,max(template_type) as template_type
        ,sum(exp_dvc_cnt) as exp_cnt
        ,sum(list_exp_dvc_cnt) as list_exp_cnt
        ,sum(pre_exp_dvc_cnt) as pre_exp_cnt
        ,sum(cover_click_dvc_cnt) as cover_click_cnt
        ,sum(export_dvc_cnt) as export_cnt
        ,sum(made_dvc_cnt) as made_cnt
        ,sum(shr_dvc_cnt) as shr_cnt
        ,if(sum(list_exp_dvc_cnt)>0,round(sum(cover_click_dvc_cnt)*100/sum(list_exp_dvc_cnt),4),0) as cover_list_ratio
        ,if(sum(pre_exp_dvc_cnt)>0,round(sum(made_dvc_cnt)*100/sum(pre_exp_dvc_cnt),4),0)  as made_pre_exp_ratio
        ,if(sum(made_dvc_cnt)>0,round(sum(export_dvc_cnt)*100/sum(made_dvc_cnt),4),0)  as export_made_ratio
        ,if(sum(exp_dvc_cnt)>0,round(sum(shr_dvc_cnt)*100/sum(export_dvc_cnt),4),0)  as shr_export_ratio
        ,if(sum(exp_dvc_cnt)>0,round(sum(export_dvc_cnt)*100/sum(exp_dvc_cnt),4),0)  as export_exp_ratio
        ,max(create_time) as create_time
        ,max(previewurl) as previewurl
from    rpt_india_log_tmpl_per_1d_02
where ds >= #startDate#  and ds <= #endDate#
#where#
group by template_id
order by exp_cnt desc
limit   10000
;
`;

export const groupInfoSql = `
/*+ engine= mpp*/
select  group_info, product_id
from    rpt_india_log_tmpl_per_1d_02
where product_id = #product_id#
group by group_info, product_id;;
`;

export const mediaSourceListSQL = `
/*+ engine= mpp*/
select distinct(media_source) from rpt_india_log_tmpl_per_1d_02 where media_source is not null and media_source <> '' #where#
order by media_source
`;

export const campaignNameListSQL = `
/*+ engine= mpp*/
select distinct(campaign) from rpt_india_log_tmpl_per_1d_02 where campaign is not null and campaign <> '' #where#
order by campaign
`;

export const adsetListSQL = `
/*+ engine= mpp*/
select distinct(adset) from rpt_india_log_tmpl_per_1d_02 where adset is not null and adset <> '' #where#
order by adset
`;
