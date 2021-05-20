import React from 'react';
import { Select, Input, DatePicker } from 'antd';

const style = (width = 120) => ({
  margin: '0 8px 8px 0',
  width,
});

export default ({
  type = 'select',
  data,
  title,
  value,
  setValue,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  showSearch = true,
  width,
  multiple = false,
  disabled = false,
  allowClear = true,
}) => {
  if (type === 'select') {
    return (
      <>
        {/* <span>{title}:</span> */}
        <Select
          showSearch={showSearch}
          filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
          style={style(width)}
          value={value}
          onChange={setValue}
          placeholder={title}
          allowClear={allowClear}
          disabled={disabled}
          {...(multiple ? { mode: 'multiple' } : {})}
        >
          {data.map(v => (
            <Select.Option key={v.value} value={v.value}>
              {v.label}
            </Select.Option>
          ))}
        </Select>
      </>
    );
  }
  if (type === 'input') {
    return (
      <>
        {/* <span>{title}:</span> */}
        <Input style={style(width)} value={value} placeholder={title} onChange={setValue} />
      </>
    );
  }
  if (type === 'rangePicker') {
    return (
      <>
        {/* <span>{title}:</span> */}
        <DatePicker.RangePicker
          style={style(280)}
          value={[startDate, endDate]}
          onChange={(values) => {
            setStartDate(values[0]);
            setEndDate(values[1]);
          }}
        />
      </>
    );
  }
};
