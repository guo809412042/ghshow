import React from 'react';
import { Select } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Option } = Select;
export const literalOptions = [
  <Option value="=" key="0">
    <FormattedMessage id="common.equal" />
  </Option>,
  <Option value="<>" key="1">
    <FormattedMessage id="common.not_equal_to" />
  </Option>,
];

export const numberOptions = [
  <Option value="=" key="0">
    <FormattedMessage id="common.equal" defaultMessage="等于" />
  </Option>,
  <Option value="<>" key="1">
    <FormattedMessage id="common.not_equal_to" defaultMessage="不等于" />
  </Option>,
  <Option value=">" key="2">
    <FormattedMessage id="common.Greater_than" defaultMessage="大于" />
  </Option>,
  <Option value=">=" key="3">
    <FormattedMessage id="common.Greater_or_equal_to" defaultMessage="大于等于" />
  </Option>,
  <Option value="<" key="4">
    <FormattedMessage id="common.Less_than" defaultMessage="小于" />
  </Option>,
  <Option value="<=" key="5">
    <FormattedMessage id="common.Less_than_or_equal_to" defaultMessage="小于等于" />
  </Option>,
];

export const ShareExportDoneModify = {
  name: '普通导出',
  value: 'Share_Export_Done_modify',
};

// android
export const ShareExportDonemodifyHD = {
  name: '高清导出',
  value: 'Share_Export_Done_Modify_HD',
};

// ios
export const ShareExportDoneModifyHD = {
  value: 'Share_Export_Done_modify_HD',
  name: '高清导出',
};

export const ShareExportDone4k = {
  value: 'Share_Export_Done_4k',
  name: '4k',
};

export const ShareExportDoneGIF = {
  value: 'Share_Export_Done_modify_GIF',
  name: 'GIF',
};

export const chartRateListIOS = [ShareExportDoneModify, ShareExportDoneModifyHD, ShareExportDone4k, ShareExportDoneGIF];
export const chartRateListAndroid = [
  ShareExportDoneModify,
  ShareExportDonemodifyHD,
  ShareExportDone4k,
  ShareExportDoneGIF,
];
