// import { getProductIdFoURl } from '../../../../utils/utils';

export function getSql(where, startDate, endDate, ttid) {
  where = where.replace(/and\s*new_user\s*=\s*'0'/, 'and new_user != \'0\'');
  // console.log(getProductIdFoURl());
  // console.log(where);
  // if (getProductIdFoURl() === 35) {
  //   where = where.replace(/and\s*product_id\s*= \s*\d* /, '');
  //   console.log(where);
  // }

  startDate = startDate && startDate.format('YYYYMMDD');
  endDate = endDate && endDate.format('YYYYMMDD');
  // 暂时用不到
  // (/全部/g.test(ttid)) ? ttid = '全部' : ttid;
  return `
  /*+engine=mpp*/
  select
  share_channel,
  share_cnt,
  share_cnt/total_share_cnt as rate,
  share_session_cnt,
  share_dvc_cnt
  from 
  (
  select 
  ttid,
  share_channel,
  sum(share_cnt) as share_cnt,
  sum(share_session_cnt) as share_session_cnt,
  sum(share_dvc_cnt) as share_dvc_cnt
  from quvideo_gh.\`tempo_template_share_channel_1d\` where ttid = '${ttid}' and share_channel != 'all'${where}${startDate ? `and ds >= ${startDate}` : ''}
  ${endDate ? `and ds <= ${endDate}` : ''}
  group by share_channel,ttid
  ) a
  left join (
  select 
  ttid,
  sum(share_cnt) as total_share_cnt
  from quvideo_gh.\`tempo_template_share_channel_1d\` where  ttid = '${ttid}' and  share_channel = 'all'${where}${startDate ? `and ds >= ${startDate}` : ''}
  ${endDate ? `and ds <= ${endDate}` : ''}
  group by ttid
  ) b on a.ttid = b.ttid
  ;
`;
}
