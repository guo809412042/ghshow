/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: ssssslf
 * @LastEditTime: 2020-05-08 11:18:58
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
export const COUNTRY_COMMON_LIST = [
  { key: '中国/美国/日本/韩国/台湾/泰国', value: '中美日韩台泰' },
  { key: '印度/印尼/巴西', value: '印度印尼巴西' },
  { key: '伊朗/巴基斯坦/土耳其/俄罗斯', value: '伊朗巴基斯坦土耳其俄罗斯' },
  // { key: '新增设备数-top3', value: '新增设备数 top3' },
  // { key: '新增设备数-top5', value: '新增设备数 top5' },
  // { key: 'DAU-top3', value: 'DAU top3' },
  // { key: 'DAU-top5', value: 'DAU top5' },
  { key: '第一梯度', value: '第一梯度' },
  { key: '第二梯度', value: '第二梯度' },
  { key: '第三梯度', value: '第三梯度' },
];
// {"country_name":"马来西亚","country_code":"MY"}
export const COUNTRY_CODE_COMMON_LIST = [
  { country_code: 'CN\', \'US\', \'JP\', \'KR\', \'TW\', \'TH', country_name: '中美日韩台泰' },
  { country_code: 'IN\', \'ID\', \'BR', country_name: '印度印尼巴西' },
  { country_code: 'IR\', \'PK\', \'TR\', \'RU', country_name: '伊朗巴基斯坦土耳其俄罗斯' },
  { country_code: 'CN\', \'US\', \'KR\', \'TW\', \'JP\', \'TH', country_name: '第一梯度' },
  {
    country_code:
      'MY\', \'RU\', \'GB\', \'ES\', \'DE\', \'SA\', \'AU\', \'FR\', \'CA\', \'HK\', \'IT\', \'SG\', \'AE\', \'IL\', \'AR\', \'CH\', \'NZ\', \'KW\', \'CL\', \'AT\', \'NL\', \'SE\', '
      + '\'OM\', \'BE\', \'FI\', \'RO\', \'PL\', \'NO\', \'QA\', \'IE\', \'CZ\', \'CR\', \'PA\', \'PT\', \'DK\', \'GR\','
      + '\'MO\', \'HU\', \'SK\', \'BH\', \'UY\', \'PR\', \'LT\', \'HR\', \'LV\', \'CY\', \'SI\', \'TT\', \'EE\', \'BS\', \'LU\', \'MU\', \'MT\', \'BN\', \'IS\', \'AG\', \'BB\', \'AW\', \'KN\', \'PW\', \'SC\', \'GD\', \'LC',
    country_name: '第二梯度',
  },
  {
    country_code:
      'MN\', \'GE\', \'GU\', \'MK\', \'BA\', \'GP\', \'KY\', \'RE\', \'MP\', \'BM\', \'TC\', \'CG\', \'VG\', \'AS\', \'VI\', \'AI\', \'SZ\', \'LI\', \'MX\', \'TR\', \'BG\', \'LB\', \'KZ\', \'BR\', \'GA\', \'BW\', \'DO\', \'TM\', \'VC\', \'RS\', \'PE\', \'DM\', \'CO\', \'ZA\', '
      + '\'EC\', \'BY\', \'IQ\', \'PY\', \'SR\', \'FJ\', \'NA\', \'JM\', \'AL\', \'BZ\', \'GY\', \'GT\', \'AZ\', \'JO\', \'DZ\', \'AM\', \'LK\', \'SV\', \'ID\', \'MH\', \'BO\', \'AO\', \'CV\', \'TN\', \'VE\', \'MA\', \'MD\', \'BT\', \'PH\', \'UA\', \'LA\', \'EG\', \'VN\', \'PG\', \'HN\', \'SB\', '
      + '\'GH\', \'NI\', \'NG\', \'IN\', \'KE\', \'BD\', \'ZW\', \'CI\', \'PK\', \'CM\', \'KH\', \'SN\', \'ZM\', \'MM\', \'KG\', \'UZ\', \'MR\', \'TZ\', \'NP\', \'ML\', \'BJ\', \'TD\', \'YE\', \'HT\', \'GW\', \'TJ\', \'RW\', \'GM\', \'BF\', \'LR\', \'UG\', \'TG\', \'SL\', \'NE\', \'MZ\', \'MG\', '
      + '\'MW',
    country_name: '第三梯度',
  },
];

export const COUNTRY_NAME_COMMON_LIST = [
  { country_code: '中国\', \'美国\', \'日本\', \'韩国\', \'台湾\', \'泰国', country_name: '中美日韩台泰' },
  { country_code: '印度\', \'印度尼西亚\', \'巴西', country_name: '印度印尼巴西' },
  { country_code: '伊朗\', \'巴基斯坦\', \'土耳其\', \'俄罗斯', country_name: '伊朗巴基斯坦土耳其俄罗斯' },
  { country_code: '中国\', \'美国\', \'韩国\', \'台湾\', \'日本\', \'泰国', country_name: '第一梯度' },
  {
    country_code:
      '马来西亚\', \'俄罗斯\', \'英国\', \'西班牙\', \'德国\', \'沙特阿拉伯\', \'澳大利亚\', \'法国\', \'加拿大\','
      + ' \'香港\', \'意大利\', \'新加坡\', \'阿联酋\', \'以色列\', \'阿根廷\', \'瑞士\', \'新西兰\', \'科威特\', \'智利\', \'奥地利\', \'荷兰\', \'瑞典\','
      + ' \'阿曼\', \'比利时\', \'芬兰\', \'罗马尼亚\', \'波兰\', \'挪威\', \'卡塔尔\', \'爱尔兰\', \'捷克共和国\', \'哥斯达黎加\', \'巴拿马\','
      + ' \'葡萄牙\', \'丹麦\', \'希腊\', \'澳门\', \'匈牙利\', \'斯洛伐克\', \'巴林\', \'乌拉圭\', \'波多黎各\', \'立陶宛\', \'克罗地亚\', \'拉脱维亚\', \'塞浦路斯\','
      + ' \'斯洛文尼亚\', \'特立尼达和多巴哥\', \'爱沙尼亚\', \'巴哈马\', \'卢森堡\', \'毛里求斯\', \'马耳他\', \'文莱\', \'冰岛\', \'安提瓜和巴布达\', \'巴巴多斯\','
      + ' \'阿鲁巴\', \'圣基茨和尼维斯\', \'帕劳\', \'塞舌尔\', \'格林纳达\', \'圣卢西亚',
    country_name: '第二梯度',
  },
  {
    country_code:
      '蒙古\', \'格鲁吉亚\', \'关岛\', \'马其顿\', \'波黑\', \'瓜德罗普岛\', \'开曼群岛\', \'留尼汪岛\','
      + ' \'北马里亚纳群岛\', \'百慕大\', \'特克斯和凯科斯群岛\', \'刚果\', \'英属维尔京群岛\', \'美属萨摩亚\', \'维尔京群岛\', \'安圭拉\','
      + ' \'斯威士兰\', \'列支敦士登\', \'墨西哥\', \'土耳其\', \'保加利亚\', \'黎巴嫩\', \'哈萨克斯坦\', \'巴西\', \'加蓬\', '
      + ' \'博茨瓦纳\', \'多米尼加共和国\', \'土库曼斯坦\', \'圣文森特和格林纳丁斯\', \'塞尔维亚\', \'秘鲁\', \'多米尼克\', \'哥伦比亚\', \'南非\', '
      + ' \'厄瓜多尔\', \'白俄罗斯\', \'伊拉克\', \'巴拉圭\', \'苏里南\', \'斐济\', \'纳米比亚\', \'牙买加\', \'阿尔巴尼亚\', \'伯利兹\', \'圭亚那\','
      + ' \'危地马拉\', \'阿塞拜疆\', \'约旦\', \'阿尔及利亚\', \'亚美尼亚\', \'斯里兰卡\', \'萨尔瓦多\', \'印度尼西亚\', \'马绍尔群岛\', \'玻利维亚\','
      + ' \'安哥拉\', \'佛得角\', \'突尼斯\', \'委内瑞拉\', \'摩洛哥\', \'摩尔多瓦\', \'不丹\', \'菲律宾\', \'乌克兰\', \'老挝\', \'埃及\', \'越南\','
      + ' \'巴布亚新几内亚\', \'洪都拉斯\', \'所罗门群岛\', \'加纳\', \'尼加拉瓜\', \'尼日利亚\', \'印度\', \'肯尼亚\', \'孟加拉国\', \'津巴布韦\','
      + ' \'科特迪瓦\', \'巴基斯坦\', \'喀麦隆\', \'柬埔寨\', \'塞内加尔\', \'赞比亚\', \'缅甸\', \'吉尔吉斯斯坦\', \'乌兹别克斯坦\', \'毛里塔尼亚\','
      + ' \'坦桑尼亚\', \'尼泊尔\', \'马里\', \'贝宁\', \'乍得\', \'也门\', \'海地\', \'几内亚比绍\', \'塔吉克斯坦\', \'卢旺达\', \'冈比亚\','
      + ' \'布基纳法索\', \'利比里亚\', \'乌干达\', \'多哥\', \'塞拉利昂\', \'尼日尔\', \'莫桑比克\', \'马达加斯加\', \'马拉维',
    country_name: '第三梯度',
  },
];

export const countryLevel1List = '中国,美国,韩国,台湾,日本,泰国'.split(',');
export const countryLevel2List = (
  '马来西亚,俄罗斯,英国,西班牙,德国,沙特阿拉伯,澳大利亚,法国,加拿大,香港,意大利,新加坡,阿联酋,以色列,阿根廷,瑞士,新西兰,科威特,智利,奥地利,荷兰,瑞典,'
  + '阿曼,比利时,芬兰,罗马尼亚,波兰,挪威,卡塔尔,爱尔兰,捷克共和国,哥斯达黎加,巴拿马,葡萄牙,丹麦,希腊,澳门,匈牙利,斯洛伐克,巴林,乌拉圭,波多黎各,立陶宛,克罗地亚,拉脱维亚,塞浦路斯,'
  + '斯洛文尼亚,特立尼达和多巴哥,爱沙尼亚,巴哈马,卢森堡,毛里求斯,马耳他,文莱,冰岛,安提瓜和巴布达,巴巴多斯,阿鲁巴,圣基茨和尼维斯,帕劳,塞舌尔,格林纳达,圣卢西亚'
).split(',');
export const countryLevel3List = (
  '蒙古,格鲁吉亚,关岛,马其顿,波黑,瓜德罗普岛,开曼群岛,留尼汪岛,北马里亚纳群岛,百慕大,特克斯和凯科斯群岛,刚果,英属维尔京群岛,美属萨摩亚,维尔京群岛,'
  + '安圭拉,斯威士兰,列支敦士登,墨西哥,土耳其,保加利亚,黎巴嫩,哈萨克斯坦,巴西,加蓬,博茨瓦纳,多米尼加共和国,土库曼斯坦,圣文森特和格林纳丁斯,塞尔维亚,秘鲁,多米尼克,哥伦比亚,南非,'
  + '厄瓜多尔,白俄罗斯,伊拉克,巴拉圭,苏里南,斐济,纳米比亚,牙买加,阿尔巴尼亚,伯利兹,圭亚那,危地马拉,阿塞拜疆,约旦,阿尔及利亚,亚美尼亚,斯里兰卡,萨尔瓦多,印度尼西亚,马绍尔群岛,玻利维亚,'
  + '安哥拉,佛得角,突尼斯,委内瑞拉,摩洛哥,摩尔多瓦,不丹,菲律宾,乌克兰,老挝,埃及,越南,巴布亚新几内亚,洪都拉斯,所罗门群岛,加纳,尼加拉瓜,尼日利亚,印度,肯尼亚,孟加拉国,津巴布韦,科特迪瓦,'
  + '巴基斯坦,喀麦隆,柬埔寨,塞内加尔,赞比亚,缅甸,吉尔吉斯斯坦,乌兹别克斯坦,毛里塔尼亚,坦桑尼亚,尼泊尔,马里,贝宁,乍得,也门,海地,几内亚比绍,塔吉克斯坦,卢旺达,冈比亚,布基纳法索,利比里亚,'
  + '乌干达,多哥,塞拉利昂,尼日尔,莫桑比克,马达加斯加,马拉维'
).split(',');
export const zhongdongCountryList = '阿尔及利亚,巴林,埃及,约旦,科威特,黎巴嫩,利比亚,摩洛哥,阿曼,卡塔尔,沙特阿拉伯,突尼斯,阿联酋,阿拉伯联合酋长国,巴勒斯坦,也门,伊拉克,叙利亚'.split(
  ',',
);
export const duliantiCountryList = '亚美尼亚,阿塞拜疆,白俄罗斯,哈萨克斯坦,吉尔吉斯斯坦,摩尔多瓦,俄罗斯,塔吉克斯坦,乌兹别克斯坦'.split(
  ',',
);
export const oumeiCountryList = '法国,荷兰,比利时,卢森堡,瑞士,列支敦士登,奥地利,摩纳哥,德国,波兰,匈牙利,斯洛伐克,捷克,保加利亚,罗马尼亚,摩尔多瓦,俄罗斯,英国,丹麦,挪威,冰岛,芬兰,瑞典,立陶宛,拉脱维亚,爱沙尼亚,爱尔兰,法罗群岛,斯瓦尔巴,葡萄牙,西班牙,希腊,意大利,梵蒂冈,安道尔,北马其顿,圣马力诺,马耳他,斯洛文尼亚,克罗地亚,波黑,黑山,塞尔维亚,科索沃,阿尔巴尼亚,马耳他骑士团,新西兰,澳大利亚,美国,加拿大'.split(
  ',',
);
export const lameiCountryList = '巴西,墨西哥,阿根廷,智利'.split(',');
export const dongnanyashiguoCountryList = '印度尼西亚,马来西亚,菲律宾,泰国,新加坡,文莱,柬埔寨,老挝,缅甸,越南'.split(
  ',',
);
export const eyuquCountryList = '俄罗斯,白俄罗斯,哈萨克斯坦,吉尔吉斯斯坦,乌克兰'.split(',');

export const countryLevel1 = `\'${countryLevel1List.join('\', \'')}\'`;
export const countryLevel2 = `\'${countryLevel2List.join('\', \'')}\'`;
export const countryLevel3 = `\'${countryLevel3List.join('\', \'')}\'`;
export const zhongdongCountry = `\'${zhongdongCountryList.join('\', \'')}\'`;
export const duliantiCountry = `\'${duliantiCountryList.join('\', \'')}\'`;
export const oumeiCountry = `\'${oumeiCountryList.join('\', \'')}\'`;
export const lameiCountry = `\'${lameiCountryList.join('\', \'')}\'`;
export const dongnanyashiguoCountry = `\'${dongnanyashiguoCountryList.join('\', \'')}\'`;
export const eyuquCountry = `\'${eyuquCountryList.join('\', \'')}\'`;
