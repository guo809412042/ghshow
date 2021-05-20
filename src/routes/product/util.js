const langMap = new Map([
  ['PENDING', '审批中'],
  ['REJECTED', '拒绝'],
  ['APPROVED', '审批通过'],
  ['CANCELED', '取消'],
  ['DELETED', '删除'],
  ['DONE', '完成'],
  ['COVER', '覆盖'],
]);

export const feishuCodeToZh = code => langMap.get(code);
