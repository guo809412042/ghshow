export const GroupBy = [
  {
    key: '产品',
    value: 'product_id',
  },
  {
    key: '平台',
    value: 'platform',
  },
  {
    key: '渠道',
    value: 'media_source',
  },
  {
    key: '用户',
    value: 'user_type',
  },
  {
    key: '会员',
    value: 'is_vip',
  },
  {
    key: '版本',
    value: 'app_version',
  },
  {
    key: '地区',
    value: 'country',
  },
];

export const AllValue = {
  product_id: 0,
  platform: 0,
  media_source: '\'全部\'',
  user_type: 0,
  is_vip: '\'0\'',
  app_version: '\'全部\'',
  country: '\'全部\'',
};

export const Platform = {
  0: '全部',
  1: '安卓',
  2: 'iOS',
};

export const UserType = {
  0: '全部',
  1: '新用户',
  2: '老用户',
  3: '回流用户',
};

export const VIP = {
  0: '全部',
  Y: 'VIP',
  N: '非VIP',
};
