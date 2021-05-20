import React, { useState } from 'react';
import { DatePicker, Tag } from 'antd';
import moment from 'moment';
import styles from '../../../styles/index.less';

export default (props) => {
  const { onChange, dateTags = [7, 30, 60, 90] } = props;
  const [showDate, setShowDate] = useState(false);

  const dateTagClick = (day) => {
    const start = moment().subtract(day, 'days');
    const end = moment().subtract(1, 'days');
    onChange([start, end]);
    setShowDate(false);
  };

  const renderExtraFooter = () => (
    <div>
      {dateTags.map(v => (
        <Tag color="magenta" onClick={() => dateTagClick(v)} key={v}>
          {`最近${v}天`}
        </Tag>
      ))}
    </div>
  );

  const onOpenChange = (status) => {
    setShowDate(status);
  };

  return (
    <DatePicker.RangePicker
      {...props}
      renderExtraFooter={renderExtraFooter}
      open={showDate}
      onOpenChange={onOpenChange}
      dropdownClassName={styles.datepickerFooter}
    />
  );
};
