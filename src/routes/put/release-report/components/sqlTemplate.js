/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/4/18
 * Time: 下午7:43
 *
 */

export const chartSQL = `
/*self_plus engine=MPP*/
select  sum(impressions) as impressions
        ,sum(clicks) as clicks
        ,sum(spend) as spend
        ,sum(install) as install,ds
from    ads_vid_adv_push_agt_lang
where   ds >= #startDate#
and     ds <= #endDate# #operator_name# #language# #platform#
group by ds
order by ds asc
limit   1000
;
`;

export const operatorSQL = `
select  distinct operator_name
from    ads_vid_adv_push_agt_lang
where   ds >= #startDate#
and     ds <= #endDate# 
limit   1000
;
`;

export const languageSQL = `
select  distinct language
from    ads_vid_adv_push_agt_lang
where   ds >= #startDate#
and     ds <= #endDate#
limit   1000
;
`;
export const tableSQL1 = `
select  operator_name
        ,language
        ,sum(impressions) as impressions
        ,sum(clicks) as clicks
        ,sum(spend) as spend
        ,sum(install) as install
        ,platform
from    ads_vid_adv_push_agt_lang
where   ds >= #startDate# 
and     ds <= #endDate# #operator_name# #language# #platform#
group by operator_name
         ,language,platform
order by spend desc
limit   1000
;
`;

export const tableDetailSQL1 = `
select  SUM(spend) as spend
        ,SUM(install) as install
        ,ds
from    ads_vid_adv_push_agt_lang
where   ds >= #startDate#
and     ds <= #endDate# #operator_name# #language# #platform#
group by ds
order by ds
limit   1000
;
`;


export const tableSQL2 = ` 
select  language
        ,sum(impressions) as impressions
        ,sum(clicks) as clicks
        ,sum(spend) as spend
        ,sum(install) as install
from    ads_vid_adv_push_agt_lang
where   ds >= #startDate#
and     ds <= #endDate# #operator_name# #language# #platform#
group by language
limit   1000
;
`;

export const tableDetailSQL2 = ` 
select  sum(spend) as spend
        ,sum(install) as install
        ,ds
from    ads_vid_adv_push_agt_lang
where   ds >= #startDate#
and     ds <= #endDate# #operator_name# #language# #platform#
group by ds
order by ds asc
limit   1000
;
`;
export const pieSQL = `
select  #type#
        ,sum(install) as install
        ,sum(spend) as spend
from    ads_vid_adv_push_agt_lang
where   ds >= #startDate#
and     ds <= #endDate# #operator_name# #language# #platform#
group by #type#`;
