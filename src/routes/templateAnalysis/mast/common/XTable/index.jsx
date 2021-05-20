import React from 'react';
import { Table, Button } from 'antd';
import { exportExcel } from '../../../../../utils/exportExcel3';

export default ({
  dataSource=[],
  columns=[],
  dowloadOpt = false,
  dowloadFn,
  ...rest
}) => {
  const onExport = () => {
    let data = [];
    if (dowloadFn) {
      data = dowloadFn();
    } else {
      const { dataSource } = this.props;

      if (dowloadOpt) {
        dataSource.forEach(item => {
          let opt = {};
          dowloadOpt.list.forEach(l => {
            const { name, key } = l;
            opt[name] = item[key];
          })
          data.push(opt);
        })
      }
    }
    exportExcel(data, `${dowloadOpt.name}.xlsx`);
  }

  return (
    <>
    {
      !!dowloadOpt && (
        <Button
          type='primary'
          icon='download'
          style={{ margin: '16px 0' }}
          onClick={() => onExport()}
        >
          导出
        </Button>
      )
    }
      <Table
        dataSource={dataSource}
        columns={columns}
        {...rest}
      />
    </>
  );
};
