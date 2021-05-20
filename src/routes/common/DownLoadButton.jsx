import React from 'react';
import { Button } from 'antd';
import exportParams from '../../utils/exportExecl';

export const DownLoadButton = ({
  filename, columns, data, size = 'default', buttonText = true, title = '导出',
}) => (
  <Button
    style={{ marginRight: 10 }}
    icon="cloud-download"
    type="primary"
    size={size}
    onClick={() => exportParams({
      filename,
      columns,
      data,
    })
    }
  >
    {buttonText && title}
  </Button>
);
