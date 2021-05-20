import { formatWhere } from '../utils';

export const getSql = (params) => {
  const { date, productId } = params || {};
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

  return `
  /*+engine=mpp*/
  SELECT  tag_id
  ,name
  ,path
  ,sum(exp_cnt) AS exp_cnt
  ,sum(list_exp_cnt) AS list_exp_cnt
  ,sum(pre_exp_cnt) AS pre_exp_cnt
  ,sum(cover_click_cnt) AS cover_click_cnt
  ,sum(export_cnt) AS export_cnt
  ,sum(made_cnt) AS made_cnt
  ,sum(shr_cnt) AS shr_cnt
  ,IF(
      sum(list_exp_cnt)>0
      ,round(sum(cover_click_cnt)*100/sum(list_exp_cnt),4)
      ,0
  ) AS cover_list_ratio
  ,IF(
      sum(pre_exp_cnt)>0
      ,round(sum(made_cnt)*100/sum(pre_exp_cnt),4)
      ,0
  ) AS made_pre_exp_ratio
  ,IF(
      sum(made_cnt)>0
      ,round(sum(export_cnt)*100/sum(made_cnt),4)
      ,0
  ) AS export_made_ratio
  ,IF(
      sum(export_cnt)>0
      ,round(sum(shr_cnt)*100/sum(export_cnt),4)
      ,0
  ) AS shr_export_ratio
  ,IF(
      sum(exp_cnt)>0
      ,round(sum(export_cnt)*100/sum(exp_cnt),4)
      ,0
  ) AS export_exp_ratio
  ,ds
  FROM rpt_india_log_tmpl_tag_per_1d
  WHERE 1 = 1
  ${sqlWhere}
  GROUP BY tag_id
    ,name
    ,path
    ,ds
  ORDER BY ds DESC
  LIMIT   10000
;
  `;
};
