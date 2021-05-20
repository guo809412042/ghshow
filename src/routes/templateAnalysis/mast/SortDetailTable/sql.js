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
  from  rpt_india_log_tmpl_class_per_1d
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
      key: 'in',
      value: type,
      mapKey: 'type',
    },
    {
      key: 'common',
      list: [
        {
          mapKey: 'product_id',
          value: productId,
        },
        {
          mapKey: 'name',
          value: name,
        },
      ],
    },
  ];
  const sqlWhere1 = formatWhere(pList);

  return `
    /*+engine=mpp*/
    select  class_id
    ,name
    ,ds
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
  where  1 = 1
  ${sqlWhere1}
  group by class_id
    ,name
    ,ds
  order by ds desc
  limit   10000
  `;
};
