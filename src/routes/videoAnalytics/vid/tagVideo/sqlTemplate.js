
export const summarySQL = `
/*self_plus engine=MPP*/
select  sum(if(type='parent',vdo_cnt,0)) as parent_all_cnt
      ,sum(if(type='parent_is_spider',vdo_cnt,0)) as parent_is_spider_cnt
      ,sum(if(type='parent_not_spider',vdo_cnt,0)) as parent_not_spider_cnt
      ,sum(if(type='child',vdo_cnt,0)) as child_all_cnt
      ,sum(if(type='child_is_spider',vdo_cnt,0)) as child_is_spider_cnt
      ,sum(if(type='child_not_spider',vdo_cnt,0)) as child_not_spider_cnt
  ,sum(if(type='tag',vdo_cnt,0)) as tag_all_cnt
from    (
          select  sum(vdo_cnt) as vdo_cnt
                  ,type
          from    ads_vid_vdo_tag
          where   ds >= #startDate#
          and     ds <= #endDate#
          and     name = 'all'
          group by type
      ) t
;
`;

export const parentTagsSQL = `
/*self_plus engine=MPP*/
select  distinct split_part(name,':',2) as name
from    ads_vid_vdo_tag
where   ds >= #startDate#
and     ds <= #endDate#
and     type = 'parent'
and     name <> 'all'
;
`;
export const childTagsSQL = `
/*self_plus engine=MPP*/
select  distinct split_part(name,':',2) as name
from    ads_vid_vdo_tag
where   ds >= #startDate#
and     ds <= #endDate#
and     type = 'child'
and     name <> 'all'
;
`;
export const parentTableSQL = `
/*self_plus engine=MPP*/
select  sum(if(type='parent',vdo_cnt,0)) as parent_all_cnt
        ,sum(if(type='parent_is_spider',vdo_cnt,0)) as parent_is_spider_cnt
        ,sum(if(type='parent_not_spider',vdo_cnt,0)) as parent_not_spider_cnt
        ,split_part(name,':',1) as tag_id
        ,split_part(name,':',2) as name
        ,ds
from    (
            select  sum(vdo_cnt) as vdo_cnt
                    ,name
                    ,type
                    ,ds
            from    ads_vid_vdo_tag
            where   ds >= #startDate#
            and     ds <= #endDate#
            and     type in ('parent','parent_not_spider','parent_is_spider')
            and     #tagName#
            group by name,ds,type
        ) t
group by split_part(name,':',1)
         ,split_part(name,':',2)
         ,ds
order by tag_id asc,ds
limit   1000
;
`;

export const childTableSQL = `
/*self_plus engine=MPP*/
select  sum(if(type='child',vdo_cnt,0)) as child_all_cnt
        ,sum(if(type='child_is_spider',vdo_cnt,0)) as child_is_spider_cnt
        ,sum(if(type='child_not_spider',vdo_cnt,0)) as child_not_spider_cnt
        ,split_part(name,':',1) as tag_id
        ,split_part(name,':',2) as name
        ,ds
from    (
            select  sum(vdo_cnt) as vdo_cnt
                    ,name
                    ,type
                    ,ds
            from    ads_vid_vdo_tag
            where   ds >= #startDate#
            and     ds <= #endDate#
            and     type in ('child','child_not_spider','child_is_spider')
            and     #tagName#
            group by name
                     ,type,ds
        ) t
group by split_part(name,':',1)
         ,split_part(name,':',2),ds
order by tag_id asc,ds
limit   1000
;
`;
export const communitySQL = `
/*self_plus engine=MPP*/
select  sum(vdo_cnt) as vdo_cnt
        ,split_part(name,':',2) as name
        ,ds
from    ads_vid_vdo_tag
where   ds >= #startDate#
and     ds <= #endDate#
and     type = 'lang'
group by ds,split_part(name,':',2)
order by ds 
limit   1000
;
`;
export const tagTableSQL = `
/*self_plus engine=MPP*/
select  sum(vdo_cnt) as vdo_cnt
        ,cast(split_part(name,':',1) as int) as tag_id
        ,split_part(name,':',2) as name
        ,ds
from    ads_vid_vdo_tag
where   ds >= #startDate#
and     ds <= #endDate#
and     type = 'tag'
and     #tagName#
group by ds
         ,split_part(name,':',1)
         ,split_part(name,':',2)
order by ds,tag_id asc
;
`;
export const tagSQL = `
/*self_plus engine=MPP*/
select  distinct split_part(name,':',2) as name
from    ads_vid_vdo_tag
where   ds >= #startDate#
and     ds <= #endDate#
and     type = 'tag'
and     name <> 'all'
;
`;
