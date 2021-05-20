import { formatWhere } from '../utils';

export const getNameListSql = (params) => {
  const { date, } = params || {};
  const pList = [
    {
      key: 'dateRange',
      value: date,
      mapKey: 'ds',
    },
  ]
  const sqlWhere = formatWhere(pList);

  return `
  select name
  from  rpt_india_tmpl_class_cnt_1d
  where name is not null
  ${sqlWhere}
  group by name;
`;
}

export const getSql = (params) => {
  const { date, productId, type, name, } = params || {};
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
        }
      ]
    }
  ];
  const sqlWhere1 = formatWhere([...pList, {
    key: 'in',
    value: type,
    mapKey: 'type',
  }, {
    key: 'common',
    value: name,
    mapKey: 'name',
  }]);
  const sqlWhere2 = formatWhere(pList);

  return `
  /*+engine=mpp*/
    select  ttid_cnt
          ,class as class_id
          ,name
          ,t1.ds as ds
          ,round(ttid_cnt * 100 / total, 4) as ratio
  from    (
              select  ttid_cnt
                      ,class
                      ,name
                      ,ds
              from    rpt_india_tmpl_class_cnt_1d
              where   1 = 1
              ${sqlWhere1}
          ) t1
  left join (
                select  count(distinct template_id) as total
                        ,ds
                from    rpt_india_log_tmpl_per_1d_02
                where     user_type = 'all'
                and     template_id <> 'all'
                ${sqlWhere2}
                group by ds
            ) t2
  on      t1.ds = t2.ds
  order by t1.ds DESC
  limit 10000
  ;
  `
};
