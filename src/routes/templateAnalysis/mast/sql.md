```sql
1、分类
ttid_cnt 素材个数
class 类别ID
name 类别名称
ratio 占比

type（1，2，3）分别代表一二三级

select  ttid_cnt
        ,class
        ,name
        ,t1.ds
        ,round(ttid_cnt*100 / total, 4) as ratio
from    (
            select  ttid_cnt
                    ,class
                    ,name
                    ,ds
            from    rpt_india_tmpl_class_cnt_1d
            where   ds >= 20210301
            and     ds <= 20210328
            and     type = 1
            and     product_id = 42
        ) t1
left join (
              select  count(distinct template_id) as total
                      ,ds
              from    rpt_india_log_tmpl_per_1d_02
              where   ds >= 20210301
              and     ds <= 20210328
              and     user_type = 'all'
              and     template_id <> 'all'
              and     product_id = 42
              group by ds
          ) t2
on      t1.ds = t2.ds
order by t1.ds asc
limit   1000
;

2、分类表现

name 分类名称
class_id 分类id
exp_cnt 总曝光
list_exp_cnt 列表曝光
cover_click_cnt 封面点击
pre_exp_cnt 预览曝光
made_cnt 制作量
export_cnt 导出量
shr_cnt 分享量
cover_list_ratio 封面点击率
made_pre_exp_ratio 制作率
export_made_ratio 导出率
shr_export_ratio 分享率
export_exp_ratio 导出/总曝光

select  class_id
        ,name
        ,sum(exp_cnt) as exp_cnt
        ,sum(list_exp_cnt) as list_exp_cnt
        ,sum(pre_exp_cnt) as pre_exp_cnt
        ,sum(cover_click_cnt) as cover_click_cnt
        ,sum(export_cnt) as export_cnt
        ,sum(made_cnt) as made_cnt
        ,sum(shr_cnt) as shr_cnt
        ,if(
            sum(list_exp_cnt)>0
            ,round(sum(cover_click_cnt)*100/sum(list_exp_cnt),4)
            ,0
        ) as cover_list_ratio
        ,if(
            sum(pre_exp_cnt)>0
            ,round(sum(made_cnt)*100/sum(pre_exp_cnt),4)
            ,0
        ) as made_pre_exp_ratio
        ,if(
            sum(made_cnt)>0
            ,round(sum(export_cnt)*100/sum(made_cnt),4)
            ,0
        ) as export_made_ratio
        ,if(
            sum(export_cnt)>0
            ,round(sum(shr_cnt)*100/sum(export_cnt),4)
            ,0
        ) as shr_export_ratio
        ,if(
            sum(exp_cnt)>0
            ,round(sum(export_cnt)*100/sum(exp_cnt),4)
            ,0
        ) as export_exp_ratio
        ,ds
from    rpt_india_log_tmpl_class_per_1d
where   ds >= 20210324
and     ds <= 20210324
and     product_id = 42
and     type = 1
group by class_id
         ,name
         ,ds
order by ds desc
limit   10000
;

3、标签
ttid_cnt 素材个数
tag_id 标签id
name 标签名称
ratio 占比
select  ttid_cnt
        ,tag_id
        ,name
        ,t1.ds
        ,round(ttid_cnt*100/total,4) as ratio
from    (
            select  ttid_cnt
                    ,tag_id
                    ,name
                    ,ds
            from    rpt_india_tmpl_tag_cnt_1d
            where   ds >= 20210301
            and     ds <= 20210328
            and     product_id = 42
        ) t1
left outer join (
                    select  count(distinct template_id) as total
                            ,ds
                    from    rpt_india_log_tmpl_per_1d_02
                    where   ds >= 20210301
                    and     ds <= 20210328
                    and     user_type = 'all'
                    and     template_id <> 'all'
                    and     product_id = 42
                    group by ds
                ) t2
on      t1.ds = t2.ds
order by t1.ds asc
limit   10000
;
```