export const newUserSQL = `
select sum(cast(new_usr_cnt_1d AS BIGINT)) as new_usr_cnt_1d,ds,dau_type
from vcm_vivacut_new_usr_cnt_1d_ow
where ds<= #endDate#
and ds >= #startDate# and new_user =1 and dau_type in (1,100,200) #where# 
group by dau_type,ds
order by ds
`;

export const dauSQL = `
select sum(cast(new_usr_cnt_1d AS BIGINT)) as new_usr_cnt_1d,ds,new_user
from vcm_vivacut_new_usr_cnt_1d_ow
where ds<= #endDate#
and ds >= #startDate# and dau_type = 1 #where#
group by new_user,ds
order by ds
`;
export const userActiveSQL = `
select sum(dau_cnt ) as dau_cnt,ds,dau_type
from vcm_vivacut_duid_actv_1730_1d_ow
where ds<= #endDate#
and ds >= #startDate# #where# 
group by dau_type,ds
order by ds
`;

export const duidTotalSQL = `
select sum(duid_total ) as duid_total,ds
from vcm_vivacut_add_user_std_ow
where ds<= #endDate#
and ds >= #startDate# and type=1 #where#
group by ds
order by ds
`;

export const expSQL = `select 
sum (#molecular#) as #molecular#,
sum (#denominator#) as #denominator#,
ds
from 
vcm_vivacut_exp_prop_cnt_1d_ow 
where ds<= #endDate#
and ds >= #startDate#
#where# 
group by ds 
order by ds
  `;

export const remainSQL = `
  select type,sum (#molecular#) as #molecular#,
  sum (#denominator#) as #denominator#,ds
  from vcm_vivacut_stay_active_ratio_1d_ow
where ds<= #endDate#
and ds >= #startDate# and stay_seq= 1 and product= 15 and type in('user', 'rolling', 'active_all') #where#
group by type,ds
order by ds
  `;

export const rolloingDAUSQL = `
select type,sum (#molecular#) as #molecular#,
sum (#denominator#) as #denominator#,ds
from vcm_vivacut_stay_active_ratio_1d_ow
where ds<= #endDate#
and ds >= #startDate# and stay_seq=7 and type in('user', 'rolling', 'active_all') #where#
group by type,ds
order by ds
  `;

export const collapseSQL = `
  select 
sum (exp_start_cnt_1d) as exp_start_cnt_1d,
sum (exp_suced_cnt_1d) as exp_suced_cnt_1d,
sum (exp_failed_cnt_1d) as exp_failed_cnt_1d,
sum (exp_cancel_cnt_1d) as exp_cancel_cnt_1d,
ds
from 
vcm_vivacut_exp_prop_cnt_1d_ow 
where ds<= #endDate#
and ds >= #startDate#
#where# 
group by ds 
order by ds
  `;

export const expTimeSQL = `
  select 
  avg (exp_time_1d) as exp_time_1d,
  ds
  from 
  vcm_vivacut_exp_prop_cnt_1d_ow 
  where ds<= #endDate#
  and ds >= #startDate# and exp_time_1d <= 3600 and resolution is not null
  #where# 
  group by ds 
  order by ds
  `;

export const expSizeSQL = `
  select 
  avg (exp_fsize_1d) as exp_fsize_1d,
  ds
  from 
  vcm_vivacut_exp_prop_cnt_1d_ow 
  where ds<= #endDate#
  and ds >= #startDate# 
  #where# 
  group by ds 
  order by ds
  `;

export const expResoCntSQL = `
  select resolution,sum(exp_cnt_1d) as exp_cnt_1d
  from vcm_vivacut_exp_reso_cnt_1d_ow
  where ds<= #endDate#
  and ds >= #startDate#  and resolution is not null
  #where# 
  group by resolution 
  `;

export const activeSQL = `
  select bizdate,
sum(dau) as dau,
sum(dau_new_1d) as dau_new_1d,
sum(dau_old_1d) as dau_old_1d
from vcm_app_comm_daliy_data
where  bizdate <= #endDate#
and bizdate >= #startDate#  
and type='vivacut' #where#
group by bizdate order by bizdate desc LIMIT 1000;
  `;
