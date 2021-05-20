import { formatWhere } from '../utils';

// 获取标签名称和维度list
export const getPathListSql = () => {
  return `
  /*+engine=mpp*/
  select path
  from  rpt_india_tmpl_tag_cnt_1d
  where path is not null and path <> ''
  group by path
  limit   10000
;`;
};

export const getNameListSql = () => {
  return `
  /*+engine=mpp*/
  select name
  from  rpt_india_tmpl_tag_cnt_1d
  where name is not null and name <> ''
  group by name
  limit   10000
;`;
};

export const getTableDataSql = (params) => {
  const { date, productId, name, path } = params || {};
  const pList = [
    {
      key: 'dateRange',
      value: date,
      mapKey: 'ds',
    },
    {
      key: 'common',
      list: [
        {
          mapKey: 'product_id',
          value: productId,
        },
      ],
    },
  ];
  const sqlWhere = formatWhere(pList);
  const sqlWhere2 = formatWhere([
    {
      key: 'common',
      list: [
        {
          mapKey: 'name',
          value: name,
        },
        {
          mapKey: 'path',
          value: path,
        },
      ],
    },
  ]);

  return `
  /*+engine=mpp*/
  select  t1.ds as ds
          ,ttid_cnt
          ,tag_id
          ,name
          ,path
          ,t1.ds
          ,round(ttid_cnt * 100 / total , 4) as ratio
  from    (
              select  ttid_cnt
                      ,tag_id
                      ,name
                      ,path
                      ,ds
              from    rpt_india_tmpl_tag_cnt_1d
              where 1 = 1
              ${sqlWhere}
          ) t1
  left outer join (
                      select  count(distinct template_id) as total
                              ,ds
                      from    rpt_india_log_tmpl_per_1d_02
                      where user_type = 'all'
                      and template_id <> 'all'
                      ${sqlWhere}
                      group by ds
                  ) t2
  on      t1.ds = t2.ds
  where 1 = 1
  ${sqlWhere2}
  order by t1.ds asc
  limit 10000
;
  `;
};
