/*
 * @Author: ssssslf
 * @Date: 2020-01-15 13:44:44
 * @LastEditTime: 2020-06-30 14:48:56
 * @LastEditors: ssssslf
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/routes/coreMonitore/apiMonitore/components/sqlTemplate.js
 */
export const apiListSQL = `
SELECT distinct(api_name), avg_total from #database#  where date_time>='2020-01-13 00:00:00  ORDER BY avg_total DESC;'
`;

export const apiListVivaSQL = `
SELECT api_name, avg_total
FROM (
    SELECT api_name ,SUM (value1)/count(DISTINCT ds) as avg_total
    from #database# where ds>='#startDate#' and ds<='#endDate#'
    GROUP BY api_name 
)t   where avg_total>#type#   ORDER BY avg_total DESC
;
`;

export const apiCatorySQL = `
SELECT distinct(api_category) from #database#  where date_time>='2020-01-13 00:00:00'
`;


export const totalSQL = `
select sum(value1) as total ,date_time
from #database#
where 1=1 #where#
and to_number(key_name, '99999999')>0
group by date_time  order by date_time
`;

export const totalTestSQL = `
SELECT
date_time,
sum(value1) as total
FROM ads_viva_android_api_10m 
where 1=1 #where#
and cast(key_name as  bigint)>0
group by date_time order by date_time;
`;

export const totalWeekTestSQL = `

/*+engine=mpp*/ SELECT  to_char(now() ,'YYYY-MM-dd')||' '||substring(date_time,12,8) as date_time
        ,case when count(*)=0 then round((sum(value1))*1.0/1,4)
             when  count(*)=2 then round((sum(value1))*1.0/2,4)
            else round((sum(value1)-min(value1)-max(value1))*1.0/(count(*)-2),4) 
            end as total
FROM (
        select
            sum(value1) as value1
            ,date_time
        FROM ads_viva_android_api_10m 
        where 1=1 #where#
        and cast(key_name as  bigint)>0
        group by date_time
)t
group by substring(date_time ,12,8) order by substring(date_time ,12,8) desc;

`;

export const totalWeekSQL = `
SELECT  to_char(now() ,'YYYY-MM-dd')||' '||substring(date_time,12,8) as date_time
,case when count(*)=0 then round((sum(value1))*1.0/1,4)
 when  count(*)=2 then round((sum(value1))*1.0/2,4)
else round((sum(value1)-min(value1)-max(value1))*1.0/(count(*)-2),4) 
end as total
FROM (
select
sum(value1) as value1
,date_time
FROM #database#
where 1=1 #where#
and to_number(key_name, '99999999')>0

group by date_time
)t
group by substring(date_time ,12,8) order by substring(date_time ,12,8) desc;
`;

export const successTestSQL = `
/*+engine=mpp*/
SELECT date_time
        ,key_name as status_code
        ,ratio
FROM (
    select  date_time
            ,key_name
            ,ratio
            ,row_number() over(partition by date_time order by ratio desc) rn
    FROM (
            SELECT 
                t1.date_time
                ,key_name
                ,code_total
                ,total
                ,round(code_total*1.0/total,4) as ratio
            from
                (
                    SELECT  key_name 
                            ,sum(value1) code_total
                            ,date_time
                    FROM ads_viva_android_api_10m 
                    where 1=1 #where#
                    and cast(key_name as bigint)>0
                    group by key_name ,date_time
                )t1
            left join (
                    SELECT sum(value1) as total
                            ,date_time
                    FROM ads_viva_android_api_10m 
                    where 1=1 #where#
                    and cast(key_name as bigint)>0
                    group by date_time
                )t2 
            on t1.date_time=t2.date_time 
    )t
)t where rn<=5  order by date_time,ratio desc  limit 1000
;
`;

export const successSQL = `
SELECT date_time
,code_total
,total
,round (code_total*1.0/total,4) as ratio
FROM  (
SELECT
to_char(now() ,'YYYY-MM-dd')||' '||substring(t1.date_time,12,8)  as date_time
,key_name
,case when count(*)=0 then round((sum(code_total))*1.0/1,4)
 when  count(*)=2 then round((sum(code_total))*1.0/2,4)
else round((sum(code_total)-max(code_total)-min(code_total))*1.0/(count(*)-2),4) 
end as code_total

,case when count(*)=0 then round((sum(total))*1.0/1,4)
 when  count(*)=2 then round((sum(total))*1.0/2,4)
else round((sum(total)-max(total)-min(total))*1.0/(count(*)-2),4)
end  as total
FROM
(
SELECT key_name
,sum(value1) code_total
,date_time
FROM #database#
where 1=1  #where#
          
and to_number(key_name, '99999999')>0
group by key_name ,date_time
)t1
LEFT JOIN (
SELECT sum(value1) as total
,date_time
FROM #database#
where 1=1  #where#
          
and to_number(key_name, '99999999')>0
group by date_time
)t2 on t1.date_time=t2.date_time
group by  substring(t1.date_time,12,8) ,key_name
)t where key_name='200' order by date_time DESC LIMIT 10000;
`;


export const linkSuccessSQL = `
SELECT date_time
,code_total
,total
,round (code_total*1.0/total,4) as ratio
FROM  (
SELECT
to_char(now() ,'YYYY-MM-dd')||' '||substring(t1.date_time,12,8)  as date_time
,key_name
,case when count(*)=0 then round((sum(code_total))*1.0/1,1)
 when  count(*)=2 then round((sum(code_total))*1.0/2,1)
else round((sum(code_total)-max(code_total)-min(code_total))*1.0/(count(*)-2),1) 
end as code_total

,case when count(*)=0 then round((sum(total))*1.0/1,1)
 when  count(*)=2 then round((sum(total))*1.0/2,1)
else round((sum(total)-max(total)-min(total))*1.0/(count(*)-2),1)
end  as total
FROM
(
SELECT key_name
,sum(value1) code_total
,date_time
FROM #database#
where 1=1  #where#
          
group by key_name ,date_time
)t1
LEFT JOIN (
SELECT sum(value1) as total
,date_time
FROM #database#
where 1=1  #where#
          
group by date_time
)t2 on t1.date_time=t2.date_time
group by  substring(t1.date_time,12,8) ,key_name
)t where key_name='200' order by date_time DESC LIMIT 10000;
`;

export const statusCodeSQL = `
SELECT date_time
,key_name as status_code
,ratio
FROM (
    select date_time
    ,key_name
    ,ratio
    ,row_number() over(partition by date_time order by ratio desc) rn
    FROM (
        SELECT 
            t1.date_time
            ,key_name
            ,code_total
            ,total
            ,round(code_total*1.0/total,4) as ratio
        from
        (
            SELECT key_name 
                ,sum(value1) code_total
                ,date_time
            FROM #database# 
            where 1=1 #where#
            group by key_name ,date_time 
        )t1
        left join (
            SELECT sum(value1) as total
            ,date_time
            FROM #database# 
            where 1=1 #where#
            group by date_time
        )t2 on t1.date_time=t2.date_time 
    )t
)t where rn<=5  order by date_time,ratio desc  limit 1000
;
`;


export const successStatusCodeSQL = `
SELECT date_time
,key_name as status_code
,ratio
FROM (
    select date_time
    ,key_name
    ,ratio
    ,row_number() over(partition by date_time order by ratio desc) rn
    FROM (
        SELECT 
            t1.date_time
            ,key_name
            ,code_total
            ,total
            ,round(code_total*1.0/total,4) as ratio
        from
        (
            SELECT key_name 
                ,sum(value1) code_total
                ,date_time
            FROM #database# 
            where 1=1 #where#
            and to_number(key_name, '99999999')>0
            group by key_name ,date_time 
        )t1
        left join (
            SELECT sum(value1) as total
            ,date_time
            FROM #database# 
            where 1=1 #where#
            and to_number(key_name, '99999999')>0
            group by date_time
        )t2 on t1.date_time=t2.date_time 
    )t
)t where rn<=5  order by date_time,ratio desc  limit 1000
;
`;

export const successWeekTestSQL = `
/*+engine=mpp*/
SELECT date_time
        ,code_total
        ,total
        ,round (code_total*1.0/total,4) as ratio
FROM  (
        SELECT
                to_char(now() ,'YYYY-MM-dd')||' '||substring(t1.date_time,12,8)  as date_time
                ,key_name
                ,case when count(*)=0 then round((sum(code_total))*1.0/1,4)
                    when  count(*)=2 then round((sum(code_total))*1.0/2,4)
                    else round((sum(code_total)-max(code_total)-min(code_total))*1.0/(count(*)-2),4) 
                end as code_total
                ,case when count(*)=0 then round((sum(total))*1.0/1,4)
                    when  count(*)=2 then round((sum(total))*1.0/2,4)
                    else round((sum(total)-max(total)-min(total))*1.0/(count(*)-2),4)
                end  as total
        FROM
            (
                SELECT key_name
                    ,sum(value1) code_total
                    ,date_time
                FROM ads_viva_android_api_10m 
                where 1=1 #where#
                and cast(key_name as bigint)>0
                group by key_name ,date_time
            )t1
        LEFT JOIN (
                SELECT sum(value1) as total
                        ,date_time
                FROM ads_viva_android_api_10m 
                where 1=1 #where#
                and cast(key_name as bigint)>0
                group by date_time
            )t2 
        on t1.date_time=t2.date_time
        group by  substring(t1.date_time,12,8) ,key_name
)t 
where key_name='200' order by date_time DESC LIMIT 10000;
`;
export const successWeekSQL = `
SELECT date_time
        ,code_total
        ,total
        ,round (code_total*1.0/total,4) as ratio
FROM  (
        SELECT
                to_char(now() ,'YYYY-MM-dd')||' '||substring(t1.date_time,12,8)  as date_time
                ,key_name
                ,case when count(*)=0 then round((sum(code_total))*1.0/1,4)
                    when  count(*)=2 then round((sum(code_total))*1.0/2,4)
                    else round((sum(code_total)-max(code_total)-min(code_total))*1.0/(count(*)-2),4) 
                end as code_total
                ,case when count(*)=0 then round((sum(total))*1.0/1,4)
                    when  count(*)=2 then round((sum(total))*1.0/2,4)
                    else round((sum(total)-max(total)-min(total))*1.0/(count(*)-2),4)
                end  as total
        FROM
            (
                SELECT key_name
                    ,sum(value1) code_total
                    ,date_time
                    FROM #database#
                    where 1=1  #where#
                and to_number(key_name, '99999999')>0
                group by key_name ,date_time
            )t1
        LEFT JOIN (
                SELECT sum(value1) as total
                        ,date_time
                        FROM #database#
                        where 1=1  #where#
                and to_number(key_name, '99999999')>0
                group by date_time
            )t2 
        on t1.date_time=t2.date_time
        group by  substring(t1.date_time,12,8) ,key_name
)t 
where key_name='200' order by date_time DESC LIMIT 10000;
`;


export const linkWeekSQL = `
SELECT date_time
        ,code_total
        ,total
        ,round (code_total*1.0/total,4) as ratio
FROM  (
        SELECT
                to_char(now() ,'YYYY-MM-dd')||' '||substring(t1.date_time,12,8)  as date_time
                ,key_name
                ,case when count(*)=0 then round((sum(code_total))*1.0/1,1)
                    when  count(*)=2 then round((sum(code_total))*1.0/2,1)
                    else round((sum(code_total)-max(code_total)-min(code_total))*1.0/(count(*)-2),1) 
                end as code_total
                ,case when count(*)=0 then round((sum(total))*1.0/1,1)
                    when  count(*)=2 then round((sum(total))*1.0/2,1)
                    else round((sum(total)-max(total)-min(total))*1.0/(count(*)-2),1)
                end  as total
        FROM
            (
                SELECT key_name
                    ,sum(value1) code_total
                    ,date_time
                    FROM #database#
                    where 1=1  #where#
                group by key_name ,date_time
            )t1
        LEFT JOIN (
                SELECT sum(value1) as total
                        ,date_time
                        FROM #database#
                        where 1=1  #where#
                group by date_time
            )t2 
        on t1.date_time=t2.date_time
        group by  substring(t1.date_time,12,8) ,key_name
)t 
where key_name='200' order by date_time DESC LIMIT 10000;
`;
