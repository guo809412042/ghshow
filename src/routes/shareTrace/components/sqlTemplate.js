/* eslint-disable react/jsx-filename-extension */
import React from 'react';

// 分享链接汇总数据
export const shareLinkSQL = `
/*+engine=mpp*/
SELECT 
share_type AS share_type,
SUM(IF(template_id is null,share_uv,0)) as share_uv,
SUM(IF(template_id is null,0,share_uv)) as share_uv_ttid, 
SUM(IF(template_id is null,click_uv,0)) as click_uv,
SUM(IF(template_id is null,install_uv,0)) as install_uv
FROM ads_vid_log_tmpl_dp_cnt_1d 
?
GROUP BY share_type
ORDER BY share_uv DESC 
`;

export const shareLinkColumns = [
  {
    dataIndex: 'share_type',
    key: 'share_type',
    title: '分享类型',
  },
  {
    dataIndex: 'share_uv',
    key: 'share_uv',
    title: '分享人数',
  },
  {
    dataIndex: 'share_uv_ttid',
    key: 'share_uv_ttid',
    title: '分享人数(按模板)',
  },
  {
    dataIndex: 'click_uv',
    key: 'click_uv',
    title: '点击次数',
  },
  {
    dataIndex: 'install_uv',
    key: 'install_uv',
    title: '安装人数',
  },
];

// 分享模板分类数据
export const shareDetailSQL = `
/*+engine=mpp*/
select
  t1.template_id
  ,share_uv
  ,click_uv
  ,install_uv
  ,title
  ,previewurl
from  (
  select
    template_id
    ,SUM(share_uv) as share_uv
    ,SUM(click_uv) as click_uv
    ,SUM(install_uv) as install_uv
    from  ads_vid_log_tmpl_dp_cnt_1d
    ?
  group by template_id
) t1
left outer join (
  select
  template_id
  ,title
  ,previewurl
  from  (
    select
      template_id
      ,title
      ,previewurl
      ,row_number() over(partition by template_id order by ds desc) as rn
    from  ads_vid_log_tmpl_dp_cnt_1d
    ?
  ) t
    where rn = 1
) t2
on t1.template_id = t2.template_id
order by share_uv desc
limit 10000
`;

export const shareDetailColumns = [
  {
    dataIndex: 'template_id',
    key: 'template_id',
    title: '模板ID',
  },
  {
    dataIndex: 'title',
    key: 'title',
    title: '模板名称',
    render: (value, record) => (
      <a target="_blank" href={record.previewurl}>
        {value}
      </a>
    ),
  },
  {
    dataIndex: 'share_uv',
    key: 'share_uv',
    title: '分享人数',
  },
  {
    dataIndex: 'click_uv',
    key: 'click_uv',
    title: '点击人数',
  },
  {
    dataIndex: 'install_uv',
    key: 'install_uv',
    title: '安装人数',
  },
];

// 链接安装图表数据
export const shareChartSQL = `
/*+engine=mpp*/
select ds
,share_type 
,sum(install_uv)over(partition by share_type,ds )  as install_uv
,sum(install_uv)over(partition by ds) as all_type_uv
,ROUND(100*sum(install_uv)over(partition by share_type,ds )/sum(install_uv)over(partition by ds),3) as ratio
from ads_vid_log_tmpl_dp_cnt_1d
? and template_id is null
order by ds desc;
`;

// 用户行为追踪占比数据
export const tracePercentSQL = `
/*+engine=mpp*/
SELECT 
share_type,
SUM(uv) as uv,
SUM(dau_uv) as dau_uv,
ROUND(100*SUM(community_dau_uv)/SUM(uv),3) as community_dau_uv,
ROUND(100*SUM(community_consume_uv)/SUM(uv),3) as community_consume_uv,
ROUND(100*SUM(community_shr_uv)/SUM(uv),3) as community_shr_uv,
ROUND(100*SUM(describe_uv)/SUM(uv),3) as describe_uv,
ROUND(100*SUM(tmpl_dau_uv)/SUM(uv),3) as tmpl_dau_uv,
ROUND(100*SUM(tmpl_exp_uv)/SUM(uv),3) as tmpl_exp_uv,
ROUND(100*SUM(tmpl_shr_uv)/SUM(uv),3) as tmpl_shr_uv
FROM rpt_vid_log_dp_cnt_1d
?
group by share_type
order by uv desc
`;

const render = text => `${text ? `${text}%` : ''}`;

export const tracePercentColumns = [
  {
    dataIndex: 'share_type',
    key: 'share_type',
    title: '用户类型',
  },
  {
    dataIndex: 'uv',
    key: 'uv',
    title: '新增用户',
  },
  {
    dataIndex: 'dau_uv',
    key: 'dau_uv',
    title: '活跃用户',
  },
  {
    dataIndex: 'community_dau_uv',
    key: 'community_dau_uv',
    title: '社区活跃占比',
    render,
  },
  {
    dataIndex: 'community_consume_uv',
    key: 'community_consume_uv',
    title: '社区消费占比',
    render,
  },
  {
    dataIndex: 'community_shr_uv',
    key: 'community_shr_uv',
    title: '社区分享占比',
    render,
  },
  {
    dataIndex: 'describe_uv',
    key: 'describe_uv',
    title: '订阅人数占比',
    render,
  },
  {
    dataIndex: 'tmpl_dau_uv',
    key: 'tmpl_dau_uv',
    title: '模板活跃占比',
    render,
  },
  {
    dataIndex: 'tmpl_exp_uv',
    key: 'tmpl_exp_uv',
    title: '模板制作占比',
    render,
  },
  {
    dataIndex: 'tmpl_shr_uv',
    key: 'tmpl_shr_uv',
    title: '模板分享占比',
    render,
  },
];

// 用户行为追踪数值
export const traceNumberSQL = `
/*+engine=mpp*/
SELECT 
share_type,
SUM(uv) as uv,
SUM(dau_uv) as dau_uv,
SUM(community_dau_uv) as community_dau_uv,
SUM(community_consume_uv) as community_consume_uv,
SUM(community_shr_uv) as community_shr_uv,
SUM(describe_uv) as describe_uv,
SUM(tmpl_dau_uv) as tmpl_dau_uv,
SUM(tmpl_exp_uv) as tmpl_exp_uv,
SUM(tmpl_shr_uv) as tmpl_shr_uv
FROM rpt_vid_log_dp_cnt_1d
?
group by share_type
order by share_type
`;

export const traceNumberColumns = [
  {
    dataIndex: 'share_type',
    key: 'share_type',
    title: '用户类型',
  },
  {
    dataIndex: 'uv',
    key: 'uv',
    title: '新增用户',
  },
  {
    dataIndex: 'dau_uv',
    key: 'dau_uv',
    title: '活跃用户',
  },
  {
    dataIndex: 'community_dau_uv',
    key: 'community_dau_uv',
    title: '社区活跃用户数',
  },
  {
    dataIndex: 'community_consume_uv',
    key: 'community_consume_uv',
    title: '社区消费用户数',
  },
  {
    dataIndex: 'community_shr_uv',
    key: 'community_shr_uv',
    title: '社区分享用户数',
  },
  {
    dataIndex: 'describe_uv',
    key: 'describe_uv',
    title: '订阅人数',
  },
  {
    dataIndex: 'tmpl_dau_uv',
    key: 'tmpl_dau_uv',
    title: '模板活跃用户数',
  },
  {
    dataIndex: 'tmpl_exp_uv',
    key: 'tmpl_exp_uv',
    title: '模板制作用户数',
  },
  {
    dataIndex: 'tmpl_shr_uv',
    key: 'tmpl_shr_uv',
    title: '模板分享用户数',
  },
];

// 用户留存率数据
export const userStaySQL = `
/*+engine=mpp*/
select 
round(stay_num*100/reg_num,4) as stay_ratio
,stay_seq
,day
,share_type
from vivashow_user_stay
?
and cast(stay_seq as int ) >= 1
and cast(stay_seq as int )  <= 30
order by day desc
`;

export const userStayColumns = [
  {
    dataIndex: 'day',
    key: 'day',
    title: '日期',
  },
  {
    dataIndex: 'day1',
    key: 'day1',
    title: '1天后',
    render,
  },
  {
    dataIndex: 'day2',
    key: 'day2',
    title: '2天后',
    render,
  },
  {
    dataIndex: 'day3',
    key: 'day3',
    title: '3天后',
    render,
  },
  {
    dataIndex: 'day4',
    key: 'day4',
    title: '4天后',
    render,
  },
  {
    dataIndex: 'day5',
    key: 'day5',
    title: '5天后',
    render,
  },
  {
    dataIndex: 'day6',
    key: 'day6',
    title: '6天后',
    render,
  },
  {
    dataIndex: 'day7',
    key: 'day7',
    title: '7天后',
    render,
  },
  {
    dataIndex: 'day14',
    key: 'day14',
    title: '14天后',
    render,
  },
  {
    dataIndex: 'day29',
    key: 'day29',
    title: '29天后',
    render,
  },
];
