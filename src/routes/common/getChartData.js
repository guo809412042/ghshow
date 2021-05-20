import _ from 'lodash';
import { dateFormat, getNumber } from '../../utils/utils';
// num1
const getData = (data, type, molecular, denominator, suffix = true) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i, index) => {
    if (i.ds) {
      list.push({
        day: dateFormat(i.ds),
        value: denominator
          ? i[molecular] && i[denominator]
            ? Number(((i[molecular] / i[denominator]) * (suffix ? 100 : 1)).toFixed(2))
            : 0
          : Number(i[molecular]),
        type,
      });
      exportList[index].value = denominator
        ? i[molecular] && i[denominator]
          ? Number(((i[molecular] / i[denominator]) * (suffix ? 100 : 1)).toFixed(2))
          : 0
        : Number(i[molecular]);
      exportList[index].type = type;
    }
  });

  return { list, exportList };
};
const getData1 = (data, type, molecular, denominator, suffix = true) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i, index) => {
    if (i.ds) {
      list.push({
        day: dateFormat(i.ds),
        value: denominator
          ? i[molecular] && i[denominator]
            ? Number(((i[molecular] / i[denominator]) * (suffix ? 100 : 1)).toFixed(2))
            : 0
          : Number(i[molecular]),
        type: Number(i.flatform) === 1 ? `${type}-android` : `${type}-ios`,
      });
      exportList[index].value = denominator
        ? i[molecular] && i[denominator]
          ? Number(((i[molecular] / i[denominator]) * (suffix ? 100 : 1)).toFixed(2))
          : 0
        : Number(i[molecular]);
      exportList[index].type = Number(i.flatform) === 1 ? `${type}-android` : `${type}-ios`;
    }
  });

  return { list, exportList };
};
// 新用户进入preview的占比
const enterPreview = (data, type, radioValue, userSelectValue) => {
  if (userSelectValue === '') {
    return getData(data, type, 'uv_pre_etr', 'dau');
  }
  if (userSelectValue === 'and new_user = 1') {
    return getData(data, type, 'uv_new_pre_etr', 'uv_new');
  }
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i, index) => {
    if (i.ds) {
      list.push({
        day: dateFormat(i.ds),
        value:
          i.uv_pre_etr && i.dau && i.uv_new_pre_etr && i.uv_new
            ? Number((((i.uv_pre_etr - i.uv_new_pre_etr) / (i.dau - i.uv_new)) * 100).toFixed(2))
            : 0,
        type,
      });
      exportList[index].value = i.uv_pre_etr && i.dau && i.uv_new_pre_etr && i.uv_new
        ? Number((((i.uv_pre_etr - i.uv_new_pre_etr) / (i.dau - i.uv_new)) * 100).toFixed(2))
        : 0;
      exportList[index].type = type;
    }
  });
  return { list, exportList };
};

// 新用户导入完成占比
const shareExportDone = (data, type, radioValue, userSelectValue) => {
  if (userSelectValue === '') {
    return getData(data, type, 'uv_exp_suc', 'dau');
  }
  if (userSelectValue === 'and new_user = 1') {
    return getData(data, type, 'uv_new_exp_suc', 'uv_new');
  }
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i, index) => {
    if (i.ds) {
      list.push({
        day: dateFormat(i.ds),
        value:
          i.uv_exp_suc && i.dau && i.uv_new_exp_suc && i.uv_new
            ? Number((((i.uv_exp_suc - i.uv_new_exp_suc) / (i.dau - i.uv_new)) * 100).toFixed(2))
            : 0,
        type,
      });
      exportList[index].value = i.uv_exp_suc && i.dau && i.uv_new_exp_suc && i.uv_new
        ? Number((((i.uv_exp_suc - i.uv_new_exp_suc) / (i.dau - i.uv_new)) * 100).toFixed(2))
        : 0;
      exportList[index].type = type;
    }
  });
  return { list, exportList };
};

// 分享用户占比
const videoShare = (data, type) => getData(data, type, 'uv_shre', 'dau');

// 人均分享次数
const pvShare = (data, type) => getData(data, type, 'pv_cnt_shre', 'uv_shre', false);

// 模版创作用户占比
const modAtr = (data, type) => getData(data, type, 'uv_sch_mod_atr', 'uv_exp_suc');

// 模版创作视频数占比
const modAtrPv = (data, type) => getData(data, type, 'pv_cnt_sch_mod_atr', 'pv_cnt_exp_suc');

// 教程播放总数
const pvPly = (data, type) => getData(data, type, 'pv_cnt_crs_ply');
// 教程播放用户占比
const uvPly = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i, index) => {
    if (i.ds) {
      list.push({
        day: dateFormat(i.ds),
        value: i.uv_ply && i.uv_crs_ply ? Number(((i.uv_crs_ply * 100) / (i.uv_ply + i.uv_crs_ply)).toFixed(2)) : 0,
        type,
      });
      exportList[index].value = i.uv_ply && i.uv_crs_ply ? Number(((i.uv_crs_ply * 100) / (i.uv_ply + i.uv_crs_ply)).toFixed(2)) : 0;
      exportList[index].type = type;
    }
  });
  return { list, exportList };
};
// 7日rolling留存
const rollingAtv = (data, type) => getData(data, type, 'uv_atv_actv_rolling', 'uv_new');
// 7日rolling导出完成留存
const rollingExp = (data, type) => getData(data, type, 'uv_exp_suc_rolling', 'uv_new');
// 教程用户播放的7日rolling
const rollingPly = (data, type) => getData(data, type, 'uv_crs_ply_rolling', 'uv_crs_ply');
// 剪辑完成率
const cutRate = (data, type, radioValue, userSelectValue) => {
  if (!userSelectValue) {
    return getData(data, type, 'uv_exp_suc', 'uv_pre_etr');
  }
  if (userSelectValue === 'and new_user = 1') {
    return getData(data, type, 'uv_new_exp_suc', 'uv_new_pre_etr');
  }
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i, index) => {
    if (i.ds) {
      list.push({
        day: dateFormat(i.ds),
        value: Number((((i.uv_exp_suc - i.uv_new_exp_suc) * 100) / (i.uv_pre_etr - i.uv_new_pre_etr)).toFixed(2)),
        type,
      });
      exportList[index].value = Number(
        (((i.uv_exp_suc - i.uv_new_exp_suc) * 100) / (i.uv_pre_etr - i.uv_new_pre_etr)).toFixed(2),
      );
      exportList[index].type = type;
    }
  });

  return { list, exportList };
};
// 剪辑完成率
const cutRateSave = (data, type, radioValue, userSelectValue) => {
  if (!userSelectValue) {
    return getData(data, type, 'uv_save_suc', 'uv_pre_etr');
  }
  if (userSelectValue === 'and new_user = 1') {
    return getData(data, type, 'uv_new_save_suc', 'uv_new_pre_etr');
  }
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i, index) => {
    if (i.ds) {
      list.push({
        day: dateFormat(i.ds),
        value: Number((((i.uv_save_suc - i.uv_new_save_suc) * 100) / (i.uv_pre_etr - i.uv_new_pre_etr)).toFixed(2)),
        type,
      });
      exportList[index].value = Number(
        (((i.uv_save_suc - i.uv_new_save_suc) * 100) / (i.uv_pre_etr - i.uv_new_pre_etr)).toFixed(2),
      );
      exportList[index].type = type;
    }
  });

  return { list, exportList };
};

// 曝光占比
const expsUsrCnt = (data, type) => getData1(data, type, 'exps_usr_cnt', 'dau');
// 模版进入率
const enterUsrCnt = (data, type) => getData1(data, type, 'enter_usr_cnt', 'exps_usr_cnt');
// 模版完成
const saveUsrCnt = (data, type) => getData1(data, type, 'expr_usr_cnt', 'enter_usr_cnt');
// 模版分享率
const shareUsrCnt = (data, type) => getData1(data, type, 'shared_usr_cnt', 'expr_usr_cnt');

// 模版创作用户占比
const puidCnt = (data, type) => getData1(data, type, 'expr_usr_cnt', 'export_done_usr_cnt');
// 模版创作视频数占比
const atrPuidCnt = (data, type) => getData1(data, type, 'atr_puid_cnt', 'export_done_usr_cnt');

// 一键分享占比
const shareOne = (data, type, uvpvValue) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i, index) => {
    const valueuv = (i.shared_bili_uv_cnt || 0)
      + (i.shared_dou_uv_cnt || 0)
      + (i.shared_other_uv_cnt || 0)
      + (i.shared_wx_uv_cnt || 0)
      + (i.shared_wxp_uv_cnt || 0);
    const valuepv = (i.shared_bili_pv_cnt || 0)
      + (i.shared_dou_pv_cnt || 0)
      + (i.shared_other_pv_cnt || 0)
      + (i.shared_wx_pv_cnt || 0)
      + (i.shared_wxp_pv_cnt || 0);
    const value = uvpvValue === 'a' ? valuepv : valueuv;
    const shareValue = uvpvValue === 'a' ? i.one_share_pv_cnt : i.one_share_uv_cnt;
    list.push({
      day: dateFormat(i.ds),
      value: shareValue && value ? Number(((shareValue * 100) / value).toFixed(2)) : 0,
      type: Number(i.flatform) === 1 ? `${type}-android` : `${type}-ios`,
    });
    exportList[index].value = shareValue && value ? Number(((shareValue * 100) / value).toFixed(2)) : 0;
    exportList[index].type = Number(i.flatform) === 1 ? `${type}-android` : `${type}-ios`;
  });
  return { list, exportList };
};
// dashboard - dau
const DAU = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.active_device_num,
      type,
    });
  });
  return { list, exportList };
};
// dahsboard  -次日留存
const stayRegData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.stay_num, i.reg_num),
      type,
    });
  });
  return { list, exportList: list };
};

// dahsboard  -Rollling7日留存
const stayRollling7RegData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.stay_num, i.reg_num),
      type,
    });
  });
  return { list, exportList: list };
};

// dahsboard  -老用户Rollling7日留存
const oldstayRollling7RegData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.stay_num, i.reg_num),
      type,
    });
  });
  return { list, exportList: list };
};

// dashboard 服务端1天留存
const Server1StayData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.stay_num, i.reg_num),
      type,
    });
  });
  return { list, exportList: list };
};

// dashboard 服务端1天留存
const Server2StayData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.stay_num, i.reg_num),
      type,
    });
  });
  return { list, exportList: list };
};

// dashboard 服务端1天留存
const Server6StayData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.stay_num, i.reg_num),
      type,
    });
  });
  return { list, exportList: list };
};

// dashboard-老用户留存
const oldStayRegData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.stay_num, i.reg_num),
      type,
    });
  });
  return { list, exportList: list };
};

// dashboard-新增设备数
const deviceAdditionData = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.active_new_device_num,
      type,
    });
  });
  return { list, exportList };
};
// 新增活跃设备数
const deviceAddActSQL = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.new_act_dvc_cnt,
      type,
    });
  });
  return { list, exportList };
};


// dashboard-temp 每日累计用户
const cumulativeUsers = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.total,
      type,
    });
  });
  return { list, exportList };
};

// dashboard-新增账号数
const auidAdditionData = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.active_new_usr_num,
      type,
    });
  });
  return { list, exportList };
};
// dashboard-新增账号数
const exportRateData = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.day),
      value: i['T1.duid_total_export * 100 / T2.duid_total_enter']
        ? Number(i['T1.duid_total_export * 100 / T2.duid_total_enter'].toFixed(2))
        : 0,
      type,
    });
  });
  return { list, exportList };
};

// dashboard-工具用户次留
const toolUserStayData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.stay_num, i.reg_num),
      type,
    });
  });
  return { list, exportList: list };
};
// dashboard- push点击
const pushClickData = (data, type, name) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.day),
      value: i[name],
      type,
    });
  });
  return { list, exportList };
};

// dashboard 导出平均速率
const exportAvgRateData = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.export_cost_time ? Number((i.export_size_total / i.export_cost_time).toFixed(2)) : 0,
      type,
    });
  });
  return { list, exportList };
};
// dashboard 导出平均时长
const exportAvgTimeData = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.export_cost_count ? Number((i.export_cost_time / i.export_cost_count).toFixed(2)) : 0,
      type,
    });
  });
  return { list, exportList };
};

// dashboard 导出成功率
const exportSuccessRateData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.total_export_done, i.total_export_start),
      type,
    });
  });
  return { list, exportList: list };
};

// dashboard 导出闪退率
const exportExitRateData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value:
        i.total_export_start && i.total_export_fail
          ? Number((((i.total_export_start - i.total_export_fail) * 100) / i.total_export_start).toFixed(2))
          : 0,
      type,
    });
  });
  return { list, exportList: list };
};
// dashboard APP导出失败率
const exportAppFailRateData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.total_export_fail, i.total_export_start),
      type,
    });
  });
  return { list, exportList: list };
};
// dashboard 真实导出失败率
const exportFailRateData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.total_export_fail, i.total_export_start),
      type,
    });
  });
  return { list, exportList: list };
};
// dahsboard导出取消率
const exportCancleRateData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.total_export_fail, i.total_export_start),
      type,
    });
  });
  return { list, exportList: list };
};

// dashbaord app登录成功率
const appLoginSuccessRateData = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.failed_total, i.total),
      type,
    });
  });
  return { list, exportList };
};
// dashboard APP登录失败率
const appLoginFailRateData = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.failed_total, i.total),
      type,
    });
  });
  return { list, exportList };
};
// dashbaord 上传失败率
const uploadFailRateData = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.failed_total, i.total),
      type,
    });
  });
  return { list, exportList };
};

// dashbaord上传取消率
const uploadFailCancelData = (data, type) => {
  const list = [];
  const exportList = _.clone(data);
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: getNumber(i.cancel_total, i.total),
      type,
    });
  });
  return { list, exportList };
};
// 次留
const stayData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.stay_ratio,
      type,
    });
  });
  return { list, exportList: list };
};
// 老用户活跃次留
const oldStayData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.stay_ratio,
      type,
    });
  });
  return { list, exportList: list };
};

// 制作率
const madeRateData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.made_ratio,
      type,
    });
  });
  return { list, exportList: list };
};
// 导出率
const exportRateDataOfMast = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.export_ratio,
      type,
    });
  });
  return { list, exportList: list };
};
// 分享率
const shareRateData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.shr_ratio,
      type,
    });
  });
  return { list, exportList: list };
};
// 首页曝光率
const homeExposeData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.fir_exp_ratio,
      type,
    });
  });
  return { list, exportList: list };
};
// 预览页转化率
const prePageExpData = (data, type) => {
  const list = [];
  data.forEach((i) => {
    list.push({
      day: dateFormat(i.ds),
      value: i.cover_exp_ratio,
      type,
    });
  });
  return { list, exportList: list };
};
export default {
  DAU,
  stayRegData,
  stayRollling7RegData,
  oldstayRollling7RegData,
  Server1StayData,
  Server2StayData,
  Server6StayData,
  oldStayRegData,
  deviceAdditionData,
  auidAdditionData,
  exportRateData,
  toolUserStayData,
  pushClickData,
  exportAvgTimeData,
  exportAvgRateData,
  exportSuccessRateData,
  exportExitRateData,
  exportAppFailRateData,
  exportFailRateData,
  exportCancleRateData,
  appLoginSuccessRateData,
  appLoginFailRateData,
  uploadFailRateData,
  uploadFailCancelData,

  enterPreview,
  shareExportDone,
  videoShare,
  pvShare,
  modAtr,
  modAtrPv,
  pvPly,
  uvPly,
  rollingAtv,
  rollingExp,
  rollingPly,
  expsUsrCnt,
  enterUsrCnt,
  saveUsrCnt,
  shareUsrCnt,
  puidCnt,
  atrPuidCnt,
  shareOne,
  cutRate,
  cutRateSave,
  cumulativeUsers,
  deviceAddActSQL,
  stayData,
  oldStayData,
  madeRateData,
  exportRateDataOfMast,
  shareRateData,
  homeExposeData,
  prePageExpData,
};
