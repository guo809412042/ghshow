export const viewUsrCntSql = `
SELECT sum(view_usr_cnt) as num
  FROM rpt_viva_sns_tt_qual_hi
 where days= #day# and ttid='all' and os = '#os#' #hours#
 GROUP BY days 
`;
export const useUsrCntSql = `
SELECT sum(use_usr_cnt) as num
  FROM rpt_viva_sns_tt_qual_hi
 where days= #day# and ttid='all' and os = '#os#' #hours#
 GROUP BY days 
`;
export const saveUsrCntSql = `
SELECT sum(save_usr_cnt) as num
  FROM rpt_viva_sns_tt_qual_hi
 where days= #day# and ttid='all' and os = '#os#' #hours#
 GROUP BY days 
`;

export const chartSql = `
SELECT #type# as num,hours
  FROM rpt_viva_sns_tt_qual_hi
 where days= #day# and ttid='all' and os = '#os#'
 order by hours
`;

export const tableSql = `
select tt_name,
ttid,
create_time,
sum(view#type#cnt) as view_cnt,
sum(click#type#cnt) as click_cnt,
sum(use#type#cnt) as use_cnt,
sum(share#type#cnt) as share_cnt,
sum(tik_tok_share#type#cnt) as tik_tok_share_cnt,
sum(save#type#cnt) as save_cnt
from rpt_viva_sns_tt_qual_hi
where days= #day# and ttid is not null and ttid <> 'all' and tt_name is not null #where# #ttid#
group by tt_name,ttid,create_time
`;

export const modalSql = `
select sum(#value#) as num,hours 
from rpt_viva_sns_tt_qual_hi
where ttid = '#ttid#' and days = '#day#'
group by hours
order by hours
`;
